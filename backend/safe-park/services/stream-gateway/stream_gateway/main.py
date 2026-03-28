import logging
from datetime import datetime
from pathlib import Path

import cv2
import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


logger = logging.getLogger("safepark.stream_gateway")
app = FastAPI(title="Safe Park Stream Gateway", version="0.1.0")


class StreamValidationRequest(BaseModel):
    stream_url: str


class SnapshotRequest(BaseModel):
    stream_url: str
    output_name: str


@app.get("/")
def root() -> dict:
    return {"service": "stream-gateway", "status": "ok"}


@app.post("/validate")
def validate_stream(payload: StreamValidationRequest) -> dict:
    capture = cv2.VideoCapture(payload.stream_url)
    ok, frame = capture.read()
    capture.release()
    return {
        "valid": bool(ok and frame is not None),
        "checked_at": datetime.utcnow().isoformat(),
    }


@app.post("/snapshot")
def create_snapshot(payload: SnapshotRequest) -> dict:
    capture = cv2.VideoCapture(payload.stream_url)
    ok, frame = capture.read()
    capture.release()
    if not ok or frame is None:
        raise HTTPException(status_code=400, detail="Could not capture snapshot from stream")
    output_path = Path("./storage/snapshots") / payload.output_name
    output_path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(output_path), frame)
    return {"path": str(output_path), "captured_at": datetime.utcnow().isoformat()}


@app.get("/health/go2rtc")
def go2rtc_health() -> dict:
    try:
        response = httpx.get("http://localhost:1984/api/streams", timeout=3.0)
        return {"ok": response.status_code == 200, "status_code": response.status_code}
    except Exception as exc:  # pragma: no cover - network dependent
        logger.warning("go2rtc health check failed: %s", exc)
        return {"ok": False, "error": str(exc)}

