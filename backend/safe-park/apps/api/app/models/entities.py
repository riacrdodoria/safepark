import uuid
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


def uuid_str() -> str:
    return str(uuid.uuid4())


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Organization(Base, TimestampMixin):
    __tablename__ = "organizations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    name: Mapped[str] = mapped_column(String(255), unique=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True)


class Site(Base, TimestampMixin):
    __tablename__ = "sites"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    organization_id: Mapped[str] = mapped_column(ForeignKey("organizations.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    metadata_json: Mapped[dict] = mapped_column("metadata", JSON, default=dict)


class Zone(Base, TimestampMixin):
    __tablename__ = "zones"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    site_id: Mapped[str] = mapped_column(ForeignKey("sites.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    zone_type: Mapped[str] = mapped_column(String(50))
    restricted: Mapped[bool] = mapped_column(Boolean, default=False)
    metadata_json: Mapped[dict] = mapped_column("metadata", JSON, default=dict)


class Camera(Base, TimestampMixin):
    __tablename__ = "cameras"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    site_id: Mapped[str] = mapped_column(ForeignKey("sites.id"), index=True)
    zone_id: Mapped[str | None] = mapped_column(ForeignKey("zones.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255))
    type: Mapped[str] = mapped_column(String(50))
    stream_url: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(50), default="unknown")
    position_metadata: Mapped[dict] = mapped_column(JSON, default=dict)
    direction_metadata: Mapped[dict] = mapped_column(JSON, default=dict)
    coverage_metadata: Mapped[dict] = mapped_column(JSON, default=dict)


class CameraLink(Base, TimestampMixin):
    __tablename__ = "camera_links"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    source_camera_id: Mapped[str] = mapped_column(ForeignKey("cameras.id"), index=True)
    target_camera_id: Mapped[str] = mapped_column(ForeignKey("cameras.id"), index=True)
    link_type: Mapped[str] = mapped_column(String(50))
    transition_confidence: Mapped[float] = mapped_column(Float, default=0.5)
    expected_travel_time_min: Mapped[int] = mapped_column(Integer, default=5)
    expected_travel_time_max: Mapped[int] = mapped_column(Integer, default=60)


class ParkingSpot(Base, TimestampMixin):
    __tablename__ = "parking_spots"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    site_id: Mapped[str] = mapped_column(ForeignKey("sites.id"), index=True)
    zone_id: Mapped[str] = mapped_column(ForeignKey("zones.id"), index=True)
    code: Mapped[str] = mapped_column(String(50))
    occupied: Mapped[bool] = mapped_column(Boolean, default=False)
    metadata_json: Mapped[dict] = mapped_column("metadata", JSON, default=dict)


class Event(Base, TimestampMixin):
    __tablename__ = "events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    site_id: Mapped[str] = mapped_column(ForeignKey("sites.id"), index=True)
    camera_id: Mapped[str | None] = mapped_column(ForeignKey("cameras.id"), nullable=True)
    event_type: Mapped[str] = mapped_column(String(80), index=True)
    severity: Mapped[str] = mapped_column(String(20), index=True)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(50), default="open")
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    related_camera_ids: Mapped[list] = mapped_column(JSON, default=list)
    related_zone_ids: Mapped[list] = mapped_column(JSON, default=list)
    payload: Mapped[dict] = mapped_column(JSON, default=dict)


class EventArtifact(Base, TimestampMixin):
    __tablename__ = "event_artifacts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    event_id: Mapped[str] = mapped_column(ForeignKey("events.id"), index=True)
    artifact_type: Mapped[str] = mapped_column(String(50))
    path: Mapped[str] = mapped_column(Text)
    metadata_json: Mapped[dict] = mapped_column("metadata", JSON, default=dict)


class TrackedObject(Base, TimestampMixin):
    __tablename__ = "tracked_objects"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    site_id: Mapped[str] = mapped_column(ForeignKey("sites.id"), index=True)
    camera_id: Mapped[str | None] = mapped_column(ForeignKey("cameras.id"), nullable=True)
    zone_id: Mapped[str | None] = mapped_column(ForeignKey("zones.id"), nullable=True)
    object_type: Mapped[str] = mapped_column(String(50), index=True)
    reid_group: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    first_seen_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    trajectory: Mapped[list] = mapped_column(JSON, default=list)
    appearance_signature: Mapped[dict] = mapped_column(JSON, default=dict)
    state_payload: Mapped[dict] = mapped_column(JSON, default=dict)


class TrackedPerson(Base, TimestampMixin):
    __tablename__ = "tracked_people"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    tracked_object_id: Mapped[str] = mapped_column(ForeignKey("tracked_objects.id"), unique=True, index=True)
    probable_origin: Mapped[str | None] = mapped_column(String(50), nullable=True)
    time_outside_vehicle_seconds: Mapped[int] = mapped_column(Integer, default=0)
    visited_zone_ids: Mapped[list] = mapped_column(JSON, default=list)
    visited_camera_ids: Mapped[list] = mapped_column(JSON, default=list)


class TrackedVehicle(Base, TimestampMixin):
    __tablename__ = "tracked_vehicles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    tracked_object_id: Mapped[str] = mapped_column(ForeignKey("tracked_objects.id"), unique=True, index=True)
    parking_spot_id: Mapped[str | None] = mapped_column(ForeignKey("parking_spots.id"), nullable=True)
    plate_hint: Mapped[str | None] = mapped_column(String(32), nullable=True)
    color_hint: Mapped[str | None] = mapped_column(String(32), nullable=True)
    occupancy_state: Mapped[str] = mapped_column(String(50), default="unknown")


class PersonVehicleAssociation(Base, TimestampMixin):
    __tablename__ = "person_vehicle_associations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    person_id: Mapped[str] = mapped_column(ForeignKey("tracked_people.id"), index=True)
    vehicle_id: Mapped[str] = mapped_column(ForeignKey("tracked_vehicles.id"), index=True)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.0)
    association_type: Mapped[str] = mapped_column(String(50), default="origin_vehicle")
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_confirmed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class RuleConfig(Base, TimestampMixin):
    __tablename__ = "rule_configs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    site_id: Mapped[str] = mapped_column(ForeignKey("sites.id"), index=True)
    rule_key: Mapped[str] = mapped_column(String(100), index=True)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    config_json: Mapped[dict] = mapped_column("config", JSON, default=dict)


class Alert(Base, TimestampMixin):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    event_id: Mapped[str] = mapped_column(ForeignKey("events.id"), index=True)
    severity: Mapped[str] = mapped_column(String(20))
    status: Mapped[str] = mapped_column(String(50), default="open")
    assigned_to_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    organization_id: Mapped[str] = mapped_column(ForeignKey("organizations.id"), index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(50), default="admin")
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class AuditLog(Base, TimestampMixin):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    entity_type: Mapped[str] = mapped_column(String(100))
    entity_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    action: Mapped[str] = mapped_column(String(100))
    payload: Mapped[dict] = mapped_column(JSON, default=dict)

