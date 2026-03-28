import json
from pathlib import Path
from typing import Any


VISION_STATE_PATH = Path("/home/ricardo/safe-park/storage/logs/vision_state.json")
VISION_STATE_DIR = Path("/home/ricardo/safe-park/storage/logs/vision")


def load_vision_state() -> dict[str, Any] | None:
    if not VISION_STATE_PATH.exists():
        return None

    try:
        return json.loads(VISION_STATE_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def load_all_vision_states() -> dict[str, dict[str, Any]]:
    states: dict[str, dict[str, Any]] = {}
    if not VISION_STATE_DIR.exists():
        single_state = load_vision_state()
        if single_state and single_state.get("camera_id"):
            states[str(single_state["camera_id"])] = single_state
        return states

    for path in sorted(VISION_STATE_DIR.glob("*.json")):
        try:
            state = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        camera_id = state.get("camera_id")
        if camera_id:
            states[str(camera_id)] = state
    return states
