from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

from app.schemas.common import TimestampedSchema


class OrganizationRead(TimestampedSchema):
    name: str
    slug: str


class SiteRead(TimestampedSchema):
    organization_id: str
    name: str
    address: str | None = None
    metadata_json: dict[str, Any] = Field(alias="metadata")


class ZoneRead(TimestampedSchema):
    site_id: str
    name: str
    zone_type: str
    restricted: bool
    metadata_json: dict[str, Any] = Field(alias="metadata")


class CameraCreate(BaseModel):
    site_id: str
    zone_id: str | None = None
    name: str
    type: str
    stream_url: str
    status: str = "unknown"
    position_metadata: dict[str, Any] = {}
    direction_metadata: dict[str, Any] = {}
    coverage_metadata: dict[str, Any] = {}


class CameraRead(TimestampedSchema):
    site_id: str
    zone_id: str | None = None
    name: str
    type: str
    stream_url: str
    status: str
    position_metadata: dict[str, Any]
    direction_metadata: dict[str, Any]
    coverage_metadata: dict[str, Any]


class CameraLinkCreate(BaseModel):
    source_camera_id: str
    target_camera_id: str
    link_type: str
    transition_confidence: float = 0.5
    expected_travel_time_min: int = 5
    expected_travel_time_max: int = 60


class CameraLinkRead(TimestampedSchema):
    source_camera_id: str
    target_camera_id: str
    link_type: str
    transition_confidence: float
    expected_travel_time_min: int
    expected_travel_time_max: int


class ParkingSpotRead(TimestampedSchema):
    site_id: str
    zone_id: str
    code: str
    occupied: bool
    metadata_json: dict[str, Any] = Field(alias="metadata")


class EventRead(TimestampedSchema):
    site_id: str
    camera_id: str | None = None
    event_type: str
    severity: str
    confidence: float
    status: str
    title: str
    description: str | None = None
    started_at: datetime
    ended_at: datetime | None = None
    related_camera_ids: list[str]
    related_zone_ids: list[str]
    payload: dict[str, Any]


class AlertRead(TimestampedSchema):
    event_id: str
    severity: str
    status: str
    assigned_to_user_id: str | None = None
    note: str | None = None


class RuleConfigRead(TimestampedSchema):
    site_id: str
    rule_key: str
    enabled: bool
    config_json: dict[str, Any] = Field(alias="config")


class DashboardMetrics(BaseModel):
    cars_in_lot: int
    occupancy_rate: float
    unknown_persons: int
    high_occupancy_zones: int
    critical_alerts: int
    cameras_online: int
    cameras_offline: int
    recent_events: list[EventRead]
    occupancy_by_zone: list[dict[str, Any]]


class SystemStatus(BaseModel):
    api: str
    database: str
    demo_mode: bool
    go2rtc_url: str
    stream_gateway_url: str

