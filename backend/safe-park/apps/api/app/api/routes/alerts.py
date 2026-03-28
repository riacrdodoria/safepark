from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.domain import AlertRead
from app.services.repository import list_alerts


router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/", response_model=list[AlertRead])
def get_alerts(status: str | None = None, db: Session = Depends(get_db)) -> list[AlertRead]:
    return list_alerts(db, status=status)

