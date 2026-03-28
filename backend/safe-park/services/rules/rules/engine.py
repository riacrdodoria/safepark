from dataclasses import dataclass
from datetime import datetime, timedelta

from shared.enums import EventSeverity, EventType


@dataclass
class RuleDecision:
    triggered: bool
    event_type: str | None = None
    severity: str | None = None
    confidence: float = 0.0
    reason: str | None = None
    payload: dict | None = None


class RuleEngine:
    def person_vehicle_binding(self, car_parked_at: datetime, person_seen_at: datetime, distance_m: float, max_seconds: int, max_distance_m: float) -> RuleDecision:
        delta = abs((person_seen_at - car_parked_at).total_seconds())
        if delta <= max_seconds and distance_m <= max_distance_m:
            confidence = max(0.5, 1 - (delta / max_seconds) * 0.4 - (distance_m / max_distance_m) * 0.2)
            return RuleDecision(True, EventType.PERSON_BOUND_TO_VEHICLE.value, EventSeverity.MEDIUM.value, confidence, "Person emerged near newly parked vehicle")
        return RuleDecision(False)

    def person_returned_to_vehicle(self, association_active: bool, distance_to_vehicle_m: float) -> RuleDecision:
        if association_active and distance_to_vehicle_m <= 2.5:
            return RuleDecision(True, EventType.PERSON_RETURNED_TO_VEHICLE.value, EventSeverity.LOW.value, 0.88, "Person returned to associated vehicle")
        return RuleDecision(False)

    def unknown_person(self, has_vehicle_origin: bool, entered_pedestrian_gate: bool) -> RuleDecision:
        if not has_vehicle_origin and not entered_pedestrian_gate:
            return RuleDecision(True, EventType.UNKNOWN_PERSON_DETECTED.value, EventSeverity.HIGH.value, 0.8, "Person appeared without known origin")
        return RuleDecision(False)

    def anomalous_wandering(self, visited_vehicle_count: int, time_outside_vehicle_seconds: int, crossed_zones: int) -> RuleDecision:
        if visited_vehicle_count >= 3 or time_outside_vehicle_seconds >= 900 or crossed_zones >= 4:
            confidence = min(0.95, 0.55 + visited_vehicle_count * 0.1 + crossed_zones * 0.05)
            return RuleDecision(True, EventType.ANOMALOUS_WANDERING.value, EventSeverity.HIGH.value, confidence, "Person shows anomalous wandering")
        return RuleDecision(False)

    def restricted_zone(self, restricted: bool, object_type: str) -> RuleDecision:
        if restricted:
            return RuleDecision(True, EventType.RESTRICTED_ZONE_INTRUSION.value, EventSeverity.CRITICAL.value, 0.93, f"{object_type} entered restricted zone")
        return RuleDecision(False)

    def vehicle_count_changed(self, previous_count: int, current_count: int) -> RuleDecision:
        if previous_count != current_count:
            return RuleDecision(True, EventType.VEHICLE_COUNT_CHANGED.value, EventSeverity.LOW.value, 1.0, "Vehicle count changed", {"previous_count": previous_count, "current_count": current_count})
        return RuleDecision(False)

    def cross_camera_transition(self, disappeared_at: datetime, appeared_at: datetime, expected_min: int, expected_max: int, link_confidence: float) -> RuleDecision:
        travel_time = (appeared_at - disappeared_at).total_seconds()
        if expected_min <= travel_time <= expected_max:
            score = min(0.97, link_confidence * 0.7 + 0.25)
            return RuleDecision(True, EventType.CROSS_CAMERA_TRANSITION.value, EventSeverity.MEDIUM.value, score, "Object likely transitioned between linked cameras", {"travel_time_seconds": travel_time})
        return RuleDecision(False)

    def person_reidentified(self, last_seen_at: datetime, reappeared_at: datetime, same_type: bool, appearance_similarity: float, direction_similarity: float) -> RuleDecision:
        if not same_type:
            return RuleDecision(False)
        delta = reappeared_at - last_seen_at
        if delta <= timedelta(seconds=120) and appearance_similarity >= 0.4:
            confidence = min(0.98, 0.35 + appearance_similarity * 0.45 + direction_similarity * 0.2)
            return RuleDecision(True, EventType.PERSON_REIDENTIFIED.value, EventSeverity.MEDIUM.value, confidence, "Probabilistic re-identification match")
        return RuleDecision(False)

