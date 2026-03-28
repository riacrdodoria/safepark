from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.domain import ZoneRead
from app.services.repository import list_zones


router = APIRouter(prefix="/zones", tags=["zones"])


@router.get("/", response_model=list[ZoneRead])
def get_zones(site_id: str | None = None, db: Session = Depends(get_db)) -> list[ZoneRead]:
    return list_zones(db, site_id=site_id)

