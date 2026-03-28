from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.domain import SiteRead
from app.services.repository import list_sites


router = APIRouter(prefix="/sites", tags=["sites"])


@router.get("/", response_model=list[SiteRead])
def get_sites(db: Session = Depends(get_db)) -> list[SiteRead]:
    return list_sites(db)

