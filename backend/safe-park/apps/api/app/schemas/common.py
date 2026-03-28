from datetime import datetime

from pydantic import BaseModel


class APIMessage(BaseModel):
    message: str


class PaginationMeta(BaseModel):
    total: int
    offset: int
    limit: int


class PaginatedResponse[T](BaseModel):
    items: list[T]
    meta: PaginationMeta


class TimestampedSchema(BaseModel):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

