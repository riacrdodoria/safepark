from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.domain import RuleConfigRead
from app.services.repository import list_rules


router = APIRouter(prefix="/rules", tags=["rules"])


@router.get("/", response_model=list[RuleConfigRead])
def get_rules(db: Session = Depends(get_db)) -> list[RuleConfigRead]:
    return list_rules(db)

