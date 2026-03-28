from collections.abc import Sequence

from sqlalchemy import Integer, func, select
from sqlalchemy.orm import Session

from app.models.entities import (
    Alert,
    Camera,
    CameraLink,
    Event,
    EventArtifact,
    Organization,
    ParkingSpot,
    RuleConfig,
    Site,
    TrackedObject,
    TrackedPerson,
    TrackedVehicle,
    User,
    Zone,
)


def paginate(query, db: Session, offset: int = 0, limit: int = 50) -> tuple[Sequence, int]:
    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    items = db.execute(query.offset(offset).limit(limit)).scalars().all()
    return items, total


def list_sites(db: Session) -> list[Site]:
    return db.execute(select(Site).order_by(Site.name)).scalars().all()


def list_cameras(db: Session, status: str | None = None, site_id: str | None = None) -> list[Camera]:
    query = select(Camera).order_by(Camera.name)
    if status:
        query = query.where(Camera.status == status)
    if site_id:
        query = query.where(Camera.site_id == site_id)
    return db.execute(query).scalars().all()


def list_camera_links(db: Session) -> list[CameraLink]:
    return db.execute(select(CameraLink)).scalars().all()


def list_zones(db: Session, site_id: str | None = None) -> list[Zone]:
    query = select(Zone).order_by(Zone.name)
    if site_id:
        query = query.where(Zone.site_id == site_id)
    return db.execute(query).scalars().all()


def list_spots(db: Session, site_id: str | None = None) -> list[ParkingSpot]:
    query = select(ParkingSpot).order_by(ParkingSpot.code)
    if site_id:
        query = query.where(ParkingSpot.site_id == site_id)
    return db.execute(query).scalars().all()


def list_events(
    db: Session,
    event_type: str | None = None,
    severity: str | None = None,
    site_id: str | None = None,
    offset: int = 0,
    limit: int = 50,
) -> tuple[Sequence[Event], int]:
    query = select(Event).order_by(Event.started_at.desc())
    if event_type:
        query = query.where(Event.event_type == event_type)
    if severity:
        query = query.where(Event.severity == severity)
    if site_id:
        query = query.where(Event.site_id == site_id)
    return paginate(query, db, offset, limit)


def get_event(db: Session, event_id: str) -> Event | None:
    return db.get(Event, event_id)


def list_alerts(db: Session, status: str | None = None) -> list[Alert]:
    query = select(Alert).order_by(Alert.created_at.desc())
    if status:
        query = query.where(Alert.status == status)
    return db.execute(query).scalars().all()


def list_rules(db: Session) -> list[RuleConfig]:
    return db.execute(select(RuleConfig).order_by(RuleConfig.rule_key)).scalars().all()


def list_artifacts_for_event(db: Session, event_id: str) -> list[EventArtifact]:
    return db.execute(select(EventArtifact).where(EventArtifact.event_id == event_id)).scalars().all()


def get_dashboard_metrics(db: Session) -> dict:
    total_spots = db.scalar(select(func.count(ParkingSpot.id))) or 0
    occupied_spots = db.scalar(select(func.count(ParkingSpot.id)).where(ParkingSpot.occupied.is_(True))) or 0
    unknown_persons = (
        db.scalar(
            select(func.count(Event.id)).where(Event.event_type == "unknown_person_detected", Event.status != "resolved")
        )
        or 0
    )
    critical_alerts = db.scalar(select(func.count(Alert.id)).where(Alert.severity == "critical", Alert.status == "open")) or 0
    cameras_online = db.scalar(select(func.count(Camera.id)).where(Camera.status == "online")) or 0
    cameras_offline = db.scalar(select(func.count(Camera.id)).where(Camera.status != "online")) or 0
    zone_counts = db.execute(
        select(Zone.name, func.count(ParkingSpot.id), func.sum(func.cast(ParkingSpot.occupied, Integer)))
        .join(ParkingSpot, ParkingSpot.zone_id == Zone.id)
        .group_by(Zone.name)
    ).all()
    occupancy_by_zone = []
    high_occupancy_zones = 0
    for name, total, occupied in zone_counts:
        occupied = int(occupied or 0)
        rate = occupied / total if total else 0
        if rate >= 0.85:
            high_occupancy_zones += 1
        occupancy_by_zone.append({"zone_name": name, "occupied": occupied, "total": total, "occupancy_rate": round(rate, 2)})
    recent_events = db.execute(select(Event).order_by(Event.started_at.desc()).limit(10)).scalars().all()
    return {
        "cars_in_lot": occupied_spots,
        "occupancy_rate": round(occupied_spots / total_spots, 2) if total_spots else 0,
        "unknown_persons": unknown_persons,
        "high_occupancy_zones": high_occupancy_zones,
        "critical_alerts": critical_alerts,
        "cameras_online": cameras_online,
        "cameras_offline": cameras_offline,
        "recent_events": recent_events,
        "occupancy_by_zone": occupancy_by_zone,
    }


def get_tracking_overview(db: Session) -> dict:
    people = db.execute(select(TrackedPerson)).scalars().all()
    vehicles = db.execute(select(TrackedVehicle)).scalars().all()
    objects = db.execute(select(TrackedObject)).scalars().all()
    return {
        "tracked_people_count": len(people),
        "tracked_vehicle_count": len(vehicles),
        "tracked_objects_count": len(objects),
    }


def get_system_counts(db: Session) -> dict:
    return {
        "organizations": db.scalar(select(func.count(Organization.id))) or 0,
        "sites": db.scalar(select(func.count(Site.id))) or 0,
        "cameras": db.scalar(select(func.count(Camera.id))) or 0,
        "events": db.scalar(select(func.count(Event.id))) or 0,
        "users": db.scalar(select(func.count(User.id))) or 0,
    }
