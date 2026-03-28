from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.domain import DashboardMetrics, EventRead
from app.services.repository import get_dashboard_metrics


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/metrics", response_model=DashboardMetrics)
def dashboard_metrics(db: Session = Depends(get_db)) -> DashboardMetrics:
    data = get_dashboard_metrics(db)
    data["recent_events"] = [EventRead.model_validate(event) for event in data["recent_events"]]
    return DashboardMetrics(**data)

