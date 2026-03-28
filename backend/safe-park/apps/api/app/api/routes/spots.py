from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.domain import ParkingSpotRead
from app.services.repository import list_spots


router = APIRouter(prefix="/spots", tags=["spots"])


@router.get("/", response_model=list[ParkingSpotRead])
def get_spots(site_id: str | None = None, db: Session = Depends(get_db)) -> list[ParkingSpotRead]:
    return list_spots(db, site_id=site_id)

