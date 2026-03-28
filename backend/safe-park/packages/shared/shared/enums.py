from enum import Enum


class CameraStatus(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    DEGRADED = "degraded"
    UNKNOWN = "unknown"


class CameraType(str, Enum):
    ENTRANCE = "entrance"
    EXIT = "exit"
    LANE = "lane"
    OVERVIEW = "overview"
    PEDESTRIAN = "pedestrian"


class ZoneType(str, Enum):
    PARKING = "parking"
    PEDESTRIAN = "pedestrian"
    RESTRICTED = "restricted"
    TRANSITION = "transition"


class LinkType(str, Enum):
    CONTINUES_TO = "continues_to"
    OVERLAPS = "overlaps"
    EXITS_TO = "exits_to"
    INTERSECTS = "intersects"


class EventType(str, Enum):
    UNKNOWN_PERSON_DETECTED = "unknown_person_detected"
    PERSON_BOUND_TO_VEHICLE = "person_bound_to_vehicle"
    PERSON_RETURNED_TO_VEHICLE = "person_returned_to_vehicle"
    ANOMALOUS_WANDERING = "anomalous_wandering"
    RESTRICTED_ZONE_INTRUSION = "restricted_zone_intrusion"
    SUSPICIOUS_VEHICLE_CONTACT = "suspicious_vehicle_contact"
    VEHICLE_COUNT_CHANGED = "vehicle_count_changed"
    SUSPECTED_COLLISION = "suspected_collision"
    CROSS_CAMERA_TRANSITION = "cross_camera_transition"
    PERSON_LOST_TRACK = "person_lost_track"
    PERSON_REIDENTIFIED = "person_reidentified"
    CAMERA_OFFLINE = "camera_offline"
    HIGH_OCCUPANCY = "high_occupancy"


class EventSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AlertStatus(str, Enum):
    OPEN = "open"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"


class TrackObjectType(str, Enum):
    PERSON = "person"
    VEHICLE = "vehicle"

