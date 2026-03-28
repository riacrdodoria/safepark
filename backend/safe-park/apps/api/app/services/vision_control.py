import json
import os
import signal
import subprocess
import time
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path("/home/ricardo/safe-park")
PYTHON_BIN = PROJECT_ROOT / ".venv/bin/python"
VISION_CONTROL_PATH = PROJECT_ROOT / "storage/logs/vision/control.json"
VISION_STATE_DIR = PROJECT_ROOT / "storage/logs/vision"
SNAPSHOT_DIR = PROJECT_ROOT / "storage/snapshots"

WORKER_SPECS: dict[str, dict[str, str]] = {
    "841fa8a1-d341-45f8-a490-1c91f9dafab9": {
        "camera_name": "Demo WhatsApp 01",
        "video_path": "/home/ricardo/safe-park/storage/demo/videos/parking-demo-whatsapp-2026-03-27.mp4",
        "state_path": "/home/ricardo/safe-park/storage/logs/vision/841fa8a1-d341-45f8-a490-1c91f9dafab9.json",
        "snapshot_path": "/home/ricardo/safe-park/storage/snapshots/vision-841fa8a1-d341-45f8-a490-1c91f9dafab9.jpg",
        "log_path": "/home/ricardo/safe-park/storage/logs/vision/841fa8a1-d341-45f8-a490-1c91f9dafab9.log",
        "pid_path": "/home/ricardo/safe-park/storage/logs/vision/841fa8a1-d341-45f8-a490-1c91f9dafab9.pid",
    },
    "47c89a10-98cc-4a56-87f5-5e2b71692335": {
        "camera_name": "Entrada Principal 01",
        "video_path": "/home/ricardo/safe-park/storage/demo/videos/parking-feed-02.mp4",
        "state_path": "/home/ricardo/safe-park/storage/logs/vision/47c89a10-98cc-4a56-87f5-5e2b71692335.json",
        "snapshot_path": "/home/ricardo/safe-park/storage/snapshots/vision-47c89a10-98cc-4a56-87f5-5e2b71692335.jpg",
        "log_path": "/home/ricardo/safe-park/storage/logs/vision/47c89a10-98cc-4a56-87f5-5e2b71692335.log",
        "pid_path": "/home/ricardo/safe-park/storage/logs/vision/47c89a10-98cc-4a56-87f5-5e2b71692335.pid",
    },
    "54d98e47-1edd-418e-98ab-4bc1d08a98de": {
        "camera_name": "Rampa Norte 02",
        "video_path": "/home/ricardo/safe-park/storage/demo/videos/parking-feed-03.mp4",
        "state_path": "/home/ricardo/safe-park/storage/logs/vision/54d98e47-1edd-418e-98ab-4bc1d08a98de.json",
        "snapshot_path": "/home/ricardo/safe-park/storage/snapshots/vision-54d98e47-1edd-418e-98ab-4bc1d08a98de.jpg",
        "log_path": "/home/ricardo/safe-park/storage/logs/vision/54d98e47-1edd-418e-98ab-4bc1d08a98de.log",
        "pid_path": "/home/ricardo/safe-park/storage/logs/vision/54d98e47-1edd-418e-98ab-4bc1d08a98de.pid",
    },
    "9ad7d773-bbb0-4333-ae39-0d9a53c37146": {
        "camera_name": "Pátio Coberto 03",
        "video_path": "/home/ricardo/safe-park/storage/demo/videos/parking-feed-04.mp4",
        "state_path": "/home/ricardo/safe-park/storage/logs/vision/9ad7d773-bbb0-4333-ae39-0d9a53c37146.json",
        "snapshot_path": "/home/ricardo/safe-park/storage/snapshots/vision-9ad7d773-bbb0-4333-ae39-0d9a53c37146.jpg",
        "log_path": "/home/ricardo/safe-park/storage/logs/vision/9ad7d773-bbb0-4333-ae39-0d9a53c37146.log",
        "pid_path": "/home/ricardo/safe-park/storage/logs/vision/9ad7d773-bbb0-4333-ae39-0d9a53c37146.pid",
    },
}


def _is_pid_running(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


def _read_pid(pid_path: Path) -> int | None:
    if not pid_path.exists():
        return None

    try:
        pid = int(pid_path.read_text(encoding="utf-8").strip())
    except (OSError, ValueError):
        return None

    return pid if _is_pid_running(pid) else None


def load_vision_control_state() -> dict[str, bool]:
    defaults = {camera_id: True for camera_id in WORKER_SPECS}
    if not VISION_CONTROL_PATH.exists():
        return defaults

    try:
        raw = json.loads(VISION_CONTROL_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return defaults

    for camera_id in defaults:
        if camera_id in raw:
            defaults[camera_id] = bool(raw[camera_id])

    return defaults


def save_vision_control_state(state: dict[str, bool]) -> dict[str, bool]:
    VISION_CONTROL_PATH.parent.mkdir(parents=True, exist_ok=True)
    normalized = {camera_id: bool(state.get(camera_id, True)) for camera_id in WORKER_SPECS}
    VISION_CONTROL_PATH.write_text(json.dumps(normalized, indent=2), encoding="utf-8")
    return normalized


def _clear_artifacts(camera_id: str) -> None:
    spec = WORKER_SPECS[camera_id]
    for path_str in (spec["state_path"], spec["snapshot_path"]):
        path = Path(path_str)
        try:
            if path.exists():
                path.unlink()
        except OSError:
            continue


def start_worker(camera_id: str) -> dict[str, Any]:
    if camera_id not in WORKER_SPECS:
        raise KeyError(camera_id)

    spec = WORKER_SPECS[camera_id]
    pid_path = Path(spec["pid_path"])
    existing_pid = _read_pid(pid_path)
    if existing_pid:
        return {"camera_id": camera_id, "enabled": True, "running": True, "pid": existing_pid}

    VISION_STATE_DIR.mkdir(parents=True, exist_ok=True)
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)

    env = os.environ.copy()
    env.update(
        {
            "PYTHONPATH": f"{PROJECT_ROOT / 'services/vision'}:{PROJECT_ROOT / 'packages/shared'}",
            "SAFE_PARK_DEMO_CAMERA_ID": camera_id,
            "SAFE_PARK_DEMO_CAMERA_NAME": spec["camera_name"],
            "SAFE_PARK_DEMO_VIDEO_PATH": spec["video_path"],
            "SAFE_PARK_VISION_STATE_PATH": spec["state_path"],
            "SAFE_PARK_VISION_SNAPSHOT_PATH": spec["snapshot_path"],
        }
    )

    with open(spec["log_path"], "ab") as log_file:
        process = subprocess.Popen(
            [str(PYTHON_BIN), "-m", "vision.main"],
            cwd=str(PROJECT_ROOT),
            env=env,
            stdout=log_file,
            stderr=log_file,
            stdin=subprocess.DEVNULL,
            start_new_session=True,
        )

    pid_path.write_text(str(process.pid), encoding="utf-8")
    return {"camera_id": camera_id, "enabled": True, "running": True, "pid": process.pid}


def stop_worker(camera_id: str) -> dict[str, Any]:
    if camera_id not in WORKER_SPECS:
        raise KeyError(camera_id)

    spec = WORKER_SPECS[camera_id]
    pid_path = Path(spec["pid_path"])
    pid = _read_pid(pid_path)

    if pid:
        try:
            os.kill(pid, signal.SIGTERM)
        except OSError:
            pid = None

        if pid:
            deadline = time.time() + 5
            while time.time() < deadline and _is_pid_running(pid):
                time.sleep(0.1)

            if _is_pid_running(pid):
                try:
                    os.kill(pid, signal.SIGKILL)
                except OSError:
                    pass

    try:
        if pid_path.exists():
            pid_path.unlink()
    except OSError:
        pass

    _clear_artifacts(camera_id)
    return {"camera_id": camera_id, "enabled": False, "running": False, "pid": None}


def get_worker_statuses() -> dict[str, dict[str, Any]]:
    control_state = load_vision_control_state()
    statuses: dict[str, dict[str, Any]] = {}

    for camera_id, enabled in control_state.items():
        pid = _read_pid(Path(WORKER_SPECS[camera_id]["pid_path"]))
        statuses[camera_id] = {
            "enabled": enabled,
            "running": bool(pid),
            "pid": pid,
        }

    return statuses


def sync_workers() -> dict[str, dict[str, Any]]:
    control_state = load_vision_control_state()
    statuses: dict[str, dict[str, Any]] = {}

    for camera_id, enabled in control_state.items():
        statuses[camera_id] = start_worker(camera_id) if enabled else stop_worker(camera_id)

    return statuses


def set_camera_enabled(camera_id: str, enabled: bool) -> dict[str, Any]:
    if camera_id not in WORKER_SPECS:
        raise KeyError(camera_id)

    control_state = load_vision_control_state()
    control_state[camera_id] = enabled
    save_vision_control_state(control_state)

    return start_worker(camera_id) if enabled else stop_worker(camera_id)
