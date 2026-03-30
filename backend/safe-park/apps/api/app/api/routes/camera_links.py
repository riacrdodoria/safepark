from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import CameraLink
from app.schemas.domain import CameraLinkCreate, CameraLinkRead
from app.services.repository import list_camera_links


router = APIRouter(prefix="/camera-links", tags=["camera-links"])


@router.get("/", response_model=list[CameraLinkRead])
def get_camera_links(db: Session = Depends(get_db)) -> list[CameraLinkRead]:
    return list_camera_links(db)


@router.post("/", response_model=CameraLinkRead)
def create_camera_link(payload: CameraLinkCreate, db: Session = Depends(get_db)) -> CameraLinkRead:
    link = CameraLink(**payload.model_dump())
    db.add(link)
    db.commit()
    db.refresh(link)
    return link

