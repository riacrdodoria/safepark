from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import CameraLink, Event


router = APIRouter(prefix="/camera-flow", tags=["camera-flow"])


@router.get("/")
def camera_flow(db: Session = Depends(get_db)) -> dict:
    links = db.execute(select(CameraLink)).scalars().all()
    transitions = db.execute(
        select(Event).where(Event.event_type.in_(["cross_camera_transition", "person_reidentified"])).order_by(Event.started_at.desc())
    ).scalars().all()
    return {
        "links": [
            {
                "id": link.id,
                "source_camera_id": link.source_camera_id,
                "target_camera_id": link.target_camera_id,
                "link_type": link.link_type,
                "transition_confidence": link.transition_confidence,
                "expected_travel_time_min": link.expected_travel_time_min,
                "expected_travel_time_max": link.expected_travel_time_max,
            }
            for link in links
        ],
        "recent_transitions": [
            {
                "event_id": event.id,
                "title": event.title,
                "confidence": event.confidence,
                "started_at": event.started_at,
                "payload": event.payload,
            }
            for event in transitions
        ],
    }

