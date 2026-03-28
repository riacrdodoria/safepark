from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import PaginationMeta
from app.schemas.domain import EventRead
from app.services.repository import get_event, list_events


router = APIRouter(prefix="/events", tags=["events"])


@router.get("/")
def get_events(
    event_type: str | None = None,
    severity: str | None = None,
    site_id: str | None = None,
    offset: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
) -> dict:
    events, total = list_events(db, event_type=event_type, severity=severity, site_id=site_id, offset=offset, limit=limit)
    return {
        "items": [EventRead.model_validate(event).model_dump() for event in events],
        "meta": PaginationMeta(total=total, offset=offset, limit=limit).model_dump(),
    }


@router.get("/{event_id}", response_model=EventRead)
def get_event_detail(event_id: str, db: Session = Depends(get_db)) -> EventRead:
    event = get_event(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

