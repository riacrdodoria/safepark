import time
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import PersonVehicleAssociation, TrackedObject, TrackedPerson, TrackedVehicle
from app.services.vision_control import get_worker_statuses, set_camera_enabled, sync_workers
from app.services.vision_state import load_all_vision_states, load_vision_state


router = APIRouter(prefix="/tracking", tags=["tracking"])


class VisionTogglePayload(BaseModel):
    enabled: bool


@router.get("/overview")
def tracking_overview(db: Session = Depends(get_db)) -> dict:
    worker_statuses = sync_workers()
    people = db.execute(select(TrackedPerson)).scalars().all()
    vehicles = db.execute(select(TrackedVehicle)).scalars().all()
    associations = db.execute(select(PersonVehicleAssociation)).scalars().all()
    objects = db.execute(select(TrackedObject)).scalars().all()
    live_states = load_all_vision_states()
    primary_live_state = next(iter(live_states.values()), None)
    return {
        "tracked_people": len(people),
        "tracked_vehicles": len(vehicles),
        "tracked_objects": len(objects),
        "live_counts": primary_live_state.get("counts") if primary_live_state else None,
        "live_camera_id": primary_live_state.get("camera_id") if primary_live_state else None,
        "live_updated_at": primary_live_state.get("updated_at") if primary_live_state else None,
        "vision_controls": worker_statuses,
        "live_cameras": [
            {
                "camera_id": state.get("camera_id"),
                "camera_name": state.get("camera_name"),
                "counts": state.get("counts"),
                "updated_at": state.get("updated_at"),
            }
            for state in live_states.values()
        ],
        "associations": [
            {
                "id": assoc.id,
                "person_id": assoc.person_id,
                "vehicle_id": assoc.vehicle_id,
                "confidence_score": assoc.confidence_score,
                "association_type": assoc.association_type,
                "active": assoc.active,
            }
            for assoc in associations
        ],
    }


@router.get("/live")
def tracking_live() -> dict:
    worker_statuses = sync_workers()
    live_states = load_all_vision_states()
    primary_state = next(iter(live_states.values()), None)
    return {
        "available": bool(live_states),
        "state": primary_state,
        "states": live_states,
        "controls": worker_statuses,
    }


@router.post("/vision/{camera_id}")
def tracking_toggle_vision(camera_id: str, payload: VisionTogglePayload) -> dict:
    try:
        status = set_camera_enabled(camera_id, payload.enabled)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Camera not configured for live vision") from exc

    live_states = load_all_vision_states()
    return {
        "camera_id": camera_id,
        "status": status,
        "controls": get_worker_statuses(),
        "state": live_states.get(camera_id),
    }


@router.get("/live-snapshot/{camera_id}")
def tracking_live_snapshot(camera_id: str):
    live_state = load_all_vision_states().get(camera_id)
    snapshot_path = live_state.get("artifacts", {}).get("latest_snapshot_path") if live_state else None
    if not snapshot_path:
        raise HTTPException(status_code=404, detail="Live snapshot not available")

    path = Path(snapshot_path)
    if not path.exists():
        raise HTTPException(status_code=404, detail="Live snapshot file missing")

    return FileResponse(path, media_type="image/jpeg", filename=path.name)


@router.get("/live-stream/{camera_id}")
def tracking_live_stream(camera_id: str):
    def generate():
        last_mtime = 0.0
        empty_frame = b""
        while True:
            live_state = load_all_vision_states().get(camera_id)
            snapshot_path = live_state.get("artifacts", {}).get("latest_snapshot_path") if live_state else None
            path = Path(snapshot_path) if snapshot_path else None

            if path and path.exists():
                try:
                    mtime = path.stat().st_mtime
                    if mtime != last_mtime:
                        last_mtime = mtime
                        payload = path.read_bytes()
                    else:
                        payload = path.read_bytes() if not empty_frame else empty_frame
                except OSError:
                    payload = empty_frame
            else:
                payload = empty_frame

            if payload:
                empty_frame = payload
                yield b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + payload + b"\r\n"

            time.sleep(0.08)

    return StreamingResponse(generate(), media_type="multipart/x-mixed-replace; boundary=frame")
