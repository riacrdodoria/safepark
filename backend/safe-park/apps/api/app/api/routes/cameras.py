from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import Camera
from app.schemas.domain import CameraCreate, CameraRead
from app.services.repository import list_cameras


router = APIRouter(prefix="/cameras", tags=["cameras"])


@router.get("/", response_model=list[CameraRead])
def get_cameras(status: str | None = None, site_id: str | None = None, db: Session = Depends(get_db)) -> list[CameraRead]:
    return list_cameras(db, status=status, site_id=site_id)


@router.post("/", response_model=CameraRead)
def create_camera(payload: CameraCreate, db: Session = Depends(get_db)) -> CameraRead:
    camera = Camera(**payload.model_dump())
    db.add(camera)
    db.commit()
    db.refresh(camera)
    return camera


@router.get("/{camera_id}", response_model=CameraRead)
def get_camera(camera_id: str, db: Session = Depends(get_db)) -> CameraRead:
    camera = db.get(Camera, camera_id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera

