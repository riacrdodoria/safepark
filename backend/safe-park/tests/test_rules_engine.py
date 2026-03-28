from datetime import datetime, timedelta

from rules.engine import RuleEngine


def test_person_vehicle_binding_triggers() -> None:
    engine = RuleEngine()
    decision = engine.person_vehicle_binding(datetime.utcnow(), datetime.utcnow() + timedelta(seconds=5), 1.2, 20, 4)
    assert decision.triggered is True
    assert decision.event_type == "person_bound_to_vehicle"


def test_cross_camera_transition_triggers() -> None:
    engine = RuleEngine()
    now = datetime.utcnow()
    decision = engine.cross_camera_transition(now, now + timedelta(seconds=10), 5, 15, 0.85)
    assert decision.triggered is True
    assert decision.confidence > 0.7

