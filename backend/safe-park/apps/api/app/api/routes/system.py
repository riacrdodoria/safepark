from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.db.session import get_db
from app.schemas.domain import SystemStatus


router = APIRouter(prefix="/system", tags=["system"])


@router.get("/status", response_model=SystemStatus)
def system_status(db: Session = Depends(get_db), settings: Settings = Depends(get_settings)) -> SystemStatus:
    db.execute(text("SELECT 1"))
    return SystemStatus(
        api="ok",
        database="ok",
        demo_mode=settings.demo_mode,
        go2rtc_url=settings.go2rtc_url,
        stream_gateway_url=f"http://localhost:{settings.stream_gateway_port}",
    )

