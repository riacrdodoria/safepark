import json
import logging
import os
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import cv2

try:
    from ultralytics import YOLO
except ImportError:  # pragma: no cover - runtime dependency on wo4
    YOLO = None


logger = logging.getLogger("safepark.vision")

PERSON_CLASS = 0
VEHICLE_CLASSES = {2, 3, 5, 7}
STATE_VERSION = 1


@dataclass
class Detection:
    label: str
    confidence: float
    bbox: tuple[int, int, int, int]


@dataclass
class Track:
    track_id: str
    label: str
    bbox: tuple[int, int, int, int]
    confidence: float
    last_seen_frame: int
    previous_center: tuple[float, float] | None = None
    current_center: tuple[float, float] | None = None
    center_history: list[tuple[float, float]] | None = None
    motion_candidate: str | None = None
    motion_candidate_since: float | None = None
    motion_state: str = "stopped"


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def iou(box_a: tuple[int, int, int, int], box_b: tuple[int, int, int, int]) -> float:
    ax1, ay1, ax2, ay2 = box_a
    bx1, by1, bx2, by2 = box_b
    inter_x1 = max(ax1, bx1)
    inter_y1 = max(ay1, by1)
    inter_x2 = min(ax2, bx2)
    inter_y2 = min(ay2, by2)
    inter_w = max(0, inter_x2 - inter_x1)
    inter_h = max(0, inter_y2 - inter_y1)
    inter_area = inter_w * inter_h
    area_a = max(0, ax2 - ax1) * max(0, ay2 - ay1)
    area_b = max(0, bx2 - bx1) * max(0, by2 - by1)
    union = area_a + area_b - inter_area
    return inter_area / union if union else 0.0


def bbox_center(box: tuple[int, int, int, int]) -> tuple[float, float]:
    x1, y1, x2, y2 = box
    return ((x1 + x2) / 2, (y1 + y2) / 2)


def center_distance(a: tuple[float, float] | None, b: tuple[float, float] | None) -> float:
    if a is None or b is None:
        return 0.0
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5


def clamp_box(box: tuple[int, int, int, int], width: int, height: int) -> tuple[int, int, int, int]:
    x1, y1, x2, y2 = box
    return (
        max(0, min(x1, width - 1)),
        max(0, min(y1, height - 1)),
        max(1, min(x2, width)),
        max(1, min(y2, height)),
    )


class VisionEngine:
    def __init__(self) -> None:
        self.camera_id = os.getenv("SAFE_PARK_DEMO_CAMERA_ID", "841fa8a1-d341-45f8-a490-1c91f9dafab9")
        self.camera_name = os.getenv("SAFE_PARK_DEMO_CAMERA_NAME", "Demo WhatsApp 01")
        self.video_path = Path(
            os.getenv(
                "SAFE_PARK_DEMO_VIDEO_PATH",
                "/home/ricardo/safe-park/storage/demo/videos/parking-demo-whatsapp-2026-03-27.mp4",
            )
        )
        self.state_path = Path(
            os.getenv("SAFE_PARK_VISION_STATE_PATH", "/home/ricardo/safe-park/storage/logs/vision_state.json")
        )
        self.snapshot_path = Path(
            os.getenv("SAFE_PARK_VISION_SNAPSHOT_PATH", "/home/ricardo/safe-park/storage/snapshots/vision-demo-live.jpg")
        )
        self.model_name = os.getenv("SAFE_PARK_VISION_MODEL", "yolov8n.pt")
        self.confidence_threshold = float(os.getenv("SAFE_PARK_VISION_CONFIDENCE", "0.35"))
        self.process_every_n_frames = int(os.getenv("SAFE_PARK_VISION_EVERY_N_FRAMES", "2"))
        self.snapshot_every_n_updates = int(os.getenv("SAFE_PARK_VISION_SNAPSHOT_EVERY", "1"))
        self.track_max_age_frames = int(os.getenv("SAFE_PARK_VISION_TRACK_MAX_AGE", "10"))
        self.capture_delay_seconds = float(os.getenv("SAFE_PARK_VISION_CAPTURE_DELAY", "0.005"))
        self.person_motion_threshold = float(os.getenv("SAFE_PARK_PERSON_MOTION_THRESHOLD", "5"))
        self.vehicle_motion_threshold = float(os.getenv("SAFE_PARK_VEHICLE_MOTION_THRESHOLD", "8"))
        self.person_motion_stop_threshold = float(os.getenv("SAFE_PARK_PERSON_MOTION_STOP_THRESHOLD", "0.045"))
        self.person_motion_start_threshold = float(os.getenv("SAFE_PARK_PERSON_MOTION_START_THRESHOLD", "0.085"))
        self.vehicle_motion_stop_threshold = float(os.getenv("SAFE_PARK_VEHICLE_MOTION_STOP_THRESHOLD", "0.025"))
        self.vehicle_motion_start_threshold = float(os.getenv("SAFE_PARK_VEHICLE_MOTION_START_THRESHOLD", "0.05"))
        self.motion_history_size = int(os.getenv("SAFE_PARK_VISION_MOTION_HISTORY", "6"))
        self.motion_transition_hold_seconds = float(os.getenv("SAFE_PARK_MOTION_TRANSITION_HOLD_SECONDS", "1.0"))
        self.input_width = int(os.getenv("SAFE_PARK_VISION_INPUT_WIDTH", "640"))
        self.track_match_iou = float(os.getenv("SAFE_PARK_VISION_TRACK_MATCH_IOU", "0.2"))
        self.model = YOLO(self.model_name) if YOLO is not None else None
        self.tracks: list[Track] = []
        self.next_track_number = 1
        self.update_count = 0
        self.frame_number = 0

    def run(self) -> None:
        if self.model is None:
            raise RuntimeError("ultralytics is not installed in the active environment")
        if not self.video_path.exists():
            raise FileNotFoundError(f"Demo video not found: {self.video_path}")

        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        self.snapshot_path.parent.mkdir(parents=True, exist_ok=True)

        capture = cv2.VideoCapture(str(self.video_path))
        if not capture.isOpened():
            raise RuntimeError(f"Could not open demo video: {self.video_path}")

        logger.info("Safe Park vision started for %s using %s", self.video_path, self.model_name)
        while True:
            ok, frame = capture.read()
            if not ok or frame is None:
                capture.set(cv2.CAP_PROP_POS_FRAMES, 0)
                logger.info("Restarting demo video loop from frame 0")
                continue

            self.frame_number += 1
            if self.frame_number % self.process_every_n_frames != 0:
                time.sleep(self.capture_delay_seconds)
                continue

            detections = self.detect(frame)
            active_tracks = self.update_tracks(detections)
            annotated = self.annotate(frame.copy(), active_tracks)
            state = self.build_state(frame, active_tracks)
            self.persist_state(state)

            self.update_count += 1
            if self.update_count % self.snapshot_every_n_updates == 0:
                cv2.imwrite(str(self.snapshot_path), annotated)

            logger.info(
                "Vision update camera=%s people=%s vehicles=%s tracks=%s frame=%s",
                self.camera_id,
                state["counts"]["person"],
                state["counts"]["vehicle"],
                len(active_tracks),
                self.frame_number,
            )
            time.sleep(self.capture_delay_seconds)

    def detect(self, frame) -> list[Detection]:
        height, width = frame.shape[:2]
        results = self.model.predict(
            frame,
            verbose=False,
            conf=self.confidence_threshold,
            classes=[0, 2, 3, 5, 7],
            imgsz=self.input_width,
        )
        detections: list[Detection] = []
        if not results:
            return detections

        boxes = results[0].boxes
        if boxes is None:
            return detections

        for box in boxes:
            cls = int(box.cls.item())
            confidence = float(box.conf.item())
            x1, y1, x2, y2 = clamp_box(tuple(int(v) for v in box.xyxy[0].tolist()), width, height)
            if cls == PERSON_CLASS:
                label = "person"
            elif cls in VEHICLE_CLASSES:
                label = "vehicle"
            else:
                continue
            detections.append(Detection(label=label, confidence=confidence, bbox=(x1, y1, x2, y2)))
        return detections

    def update_tracks(self, detections: list[Detection]) -> list[Track]:
        matched_track_ids: set[str] = set()
        next_tracks: list[Track] = []

        for detection in detections:
            best_track = None
            best_iou = 0.0
            for track in self.tracks:
                if track.label != detection.label or track.track_id in matched_track_ids:
                    continue
                score = iou(track.bbox, detection.bbox)
                if score > best_iou:
                    best_iou = score
                    best_track = track

            if best_track is not None and best_iou >= self.track_match_iou:
                best_track.previous_center = best_track.current_center
                best_track.bbox = detection.bbox
                best_track.confidence = detection.confidence
                best_track.last_seen_frame = self.frame_number
                best_track.current_center = bbox_center(detection.bbox)
                best_track.center_history = (best_track.center_history or []) + [best_track.current_center]
                best_track.center_history = best_track.center_history[-self.motion_history_size :]
                best_track.motion_state = self.classify_motion(best_track)
                next_tracks.append(best_track)
                matched_track_ids.add(best_track.track_id)
                continue

            prefix = "person" if detection.label == "person" else "vehicle"
            track = Track(
                track_id=f"{prefix}-{self.next_track_number:04d}",
                label=detection.label,
                bbox=detection.bbox,
                confidence=detection.confidence,
                last_seen_frame=self.frame_number,
                previous_center=None,
                current_center=bbox_center(detection.bbox),
                center_history=[bbox_center(detection.bbox)],
                motion_candidate=None,
                motion_candidate_since=None,
                motion_state="stopped",
            )
            self.next_track_number += 1
            next_tracks.append(track)
            matched_track_ids.add(track.track_id)

        carried_tracks = [
            track
            for track in self.tracks
            if self.frame_number - track.last_seen_frame <= self.track_max_age_frames and track.track_id not in matched_track_ids
        ]
        self.tracks = next_tracks + carried_tracks
        return [track for track in self.tracks if self.frame_number - track.last_seen_frame <= self.track_max_age_frames]

    def classify_motion(self, track: Track) -> str:
        history = track.center_history or []
        if len(history) < 3:
            return track.motion_state

        start_center = history[0]
        end_center = history[-1]
        accumulated_distance = center_distance(start_center, end_center)
        x1, y1, x2, y2 = track.bbox
        box_diagonal = max((((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5), 1.0)
        motion_ratio = accumulated_distance / box_diagonal

        if track.label == "person":
            start_threshold = self.person_motion_start_threshold
            stop_threshold = self.person_motion_stop_threshold
        else:
            start_threshold = self.vehicle_motion_start_threshold
            stop_threshold = self.vehicle_motion_stop_threshold

        now = time.monotonic()
        if track.motion_state == "moving":
            desired_state = "stopped" if motion_ratio <= stop_threshold else "moving"
        else:
            desired_state = "moving" if motion_ratio >= start_threshold else "stopped"

        if desired_state == track.motion_state:
            track.motion_candidate = None
            track.motion_candidate_since = None
            return track.motion_state

        if track.motion_candidate != desired_state:
            track.motion_candidate = desired_state
            track.motion_candidate_since = now
            return track.motion_state

        if track.motion_candidate_since is not None and now - track.motion_candidate_since >= self.motion_transition_hold_seconds:
            track.motion_state = desired_state
            track.motion_candidate = None
            track.motion_candidate_since = None

        return track.motion_state

    def annotate(self, frame, tracks: list[Track]):
        for track in tracks:
            x1, y1, x2, y2 = track.bbox
            color = self.track_color(track)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            label = f"{track.label.upper()} {track.motion_state.upper()} {track.confidence:.2f}"
            cv2.putText(frame, label, (x1, max(16, y1 - 8)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        return frame

    def track_color(self, track: Track) -> tuple[int, int, int]:
        if track.label == "person":
            return (0, 255, 255) if track.motion_state == "moving" else (255, 0, 0)
        return (0, 0, 255) if track.motion_state == "moving" else (0, 255, 0)

    def build_state(self, frame, tracks: list[Track]) -> dict[str, Any]:
        height, width = frame.shape[:2]
        people = [track for track in tracks if track.label == "person"]
        vehicles = [track for track in tracks if track.label == "vehicle"]
        return {
            "version": STATE_VERSION,
            "updated_at": utc_now(),
            "mode": "demo-video-loop",
            "camera_id": self.camera_id,
            "camera_name": self.camera_name,
            "video_path": str(self.video_path),
            "model": self.model_name,
            "frame_number": self.frame_number,
            "frame_size": {"width": width, "height": height},
            "counts": {
                "person": len(people),
                "vehicle": len(vehicles),
                "tracked_objects": len(tracks),
            },
            "tracks": [
                {
                    "track_id": track.track_id,
                    "label": track.label,
                    "motion_state": track.motion_state,
                    "confidence": round(track.confidence, 4),
                    "bbox": {
                        "x1": track.bbox[0],
                        "y1": track.bbox[1],
                        "x2": track.bbox[2],
                        "y2": track.bbox[3],
                    },
                }
                for track in tracks
            ],
            "artifacts": {
                "latest_snapshot_path": str(self.snapshot_path),
            },
        }

    def persist_state(self, state: dict[str, Any]) -> None:
        tmp_path = self.state_path.with_suffix(".tmp")
        tmp_path.write_text(json.dumps(state, ensure_ascii=True, indent=2), encoding="utf-8")
        tmp_path.replace(self.state_path)


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
    VisionEngine().run()


if __name__ == "__main__":
    main()
