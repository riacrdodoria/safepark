from fastapi import APIRouter, Depends

from app.core.config import Settings, get_settings


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(settings: Settings = Depends(get_settings)) -> dict:
    return {
        "access_token": settings.default_access_token,
        "token_type": "bearer",
        "expires_in": 86400,
    }

