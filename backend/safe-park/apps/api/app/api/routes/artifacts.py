from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.repository import list_artifacts_for_event


router = APIRouter(prefix="/artifacts", tags=["artifacts"])


@router.get("/events/{event_id}")
def get_artifacts_for_event(event_id: str, db: Session = Depends(get_db)) -> list[dict]:
    return [
        {
            "id": artifact.id,
            "event_id": artifact.event_id,
            "artifact_type": artifact.artifact_type,
            "path": artifact.path,
            "metadata": artifact.metadata_json,
        }
        for artifact in list_artifacts_for_event(db, event_id)
    ]

