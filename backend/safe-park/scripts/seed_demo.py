from datetime import datetime, timedelta

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.entities import (
    Alert,
    Camera,
    CameraLink,
    Event,
    EventArtifact,
    Organization,
    ParkingSpot,
    PersonVehicleAssociation,
    RuleConfig,
    Site,
    TrackedObject,
    TrackedPerson,
    TrackedVehicle,
    User,
    Zone,
)
from shared.enums import EventSeverity, EventType


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    if db.query(Organization).first():
        db.close()
        return

    org = Organization(name="Safe Park Demo Org", slug="safe-park-demo")
    db.add(org)
    db.flush()
    site = Site(name="Safe Park Centro", organization_id=org.id, address="Av. Exemplo, 1000", metadata_json={"timezone": "America/Sao_Paulo"})
    db.add(site)
    db.flush()

    zones = [
        Zone(site_id=site.id, name="Entrada Principal 01", zone_type="transition", restricted=False, metadata_json={"pedestrian_gate": False}),
        Zone(site_id=site.id, name="Rampa Norte 02", zone_type="transition", restricted=False, metadata_json={}),
        Zone(site_id=site.id, name="Corredor B1", zone_type="pedestrian", restricted=False, metadata_json={"pedestrian_gate": True}),
        Zone(site_id=site.id, name="Setor A Leste", zone_type="parking", restricted=False, metadata_json={}),
        Zone(site_id=site.id, name="Saída Sul 01", zone_type="transition", restricted=False, metadata_json={}),
        Zone(site_id=site.id, name="Pátio Coberto 03", zone_type="restricted", restricted=True, metadata_json={}),
    ]
    db.add_all(zones)
    db.flush()
    zone_by_name = {zone.name: zone for zone in zones}

    cameras = [
        Camera(site_id=site.id, zone_id=zone_by_name["Entrada Principal 01"].id, name="Entrada Principal 01", type="entrance", stream_url="rtsp://demo/entrada01", status="online"),
        Camera(site_id=site.id, zone_id=zone_by_name["Rampa Norte 02"].id, name="Rampa Norte 02", type="lane", stream_url="rtsp://demo/rampa02", status="online"),
        Camera(site_id=site.id, zone_id=zone_by_name["Corredor B1"].id, name="Corredor B1", type="pedestrian", stream_url="rtsp://demo/corredorb1", status="online"),
        Camera(site_id=site.id, zone_id=zone_by_name["Setor A Leste"].id, name="Setor A Leste", type="overview", stream_url="rtsp://demo/setorale", status="degraded"),
        Camera(site_id=site.id, zone_id=zone_by_name["Saída Sul 01"].id, name="Saída Sul 01", type="exit", stream_url="rtsp://demo/saidasul", status="offline"),
        Camera(site_id=site.id, zone_id=zone_by_name["Pátio Coberto 03"].id, name="Pátio Coberto 03", type="overview", stream_url="rtsp://demo/patiocoberto", status="online"),
    ]
    db.add_all(cameras)
    db.flush()
    camera_by_name = {camera.name: camera for camera in cameras}

    links = [
        CameraLink(source_camera_id=camera_by_name["Entrada Principal 01"].id, target_camera_id=camera_by_name["Rampa Norte 02"].id, link_type="continues_to", transition_confidence=0.92, expected_travel_time_min=3, expected_travel_time_max=20),
        CameraLink(source_camera_id=camera_by_name["Rampa Norte 02"].id, target_camera_id=camera_by_name["Corredor B1"].id, link_type="continues_to", transition_confidence=0.88, expected_travel_time_min=3, expected_travel_time_max=25),
        CameraLink(source_camera_id=camera_by_name["Corredor B1"].id, target_camera_id=camera_by_name["Pátio Coberto 03"].id, link_type="intersects", transition_confidence=0.67, expected_travel_time_min=5, expected_travel_time_max=45),
        CameraLink(source_camera_id=camera_by_name["Setor A Leste"].id, target_camera_id=camera_by_name["Saída Sul 01"].id, link_type="exits_to", transition_confidence=0.81, expected_travel_time_min=8, expected_travel_time_max=50),
    ]
    db.add_all(links)

    spots = [
        ParkingSpot(site_id=site.id, zone_id=zone_by_name["Setor A Leste"].id, code="A-01", occupied=True, metadata_json={"sector": "A", "row": 1}),
        ParkingSpot(site_id=site.id, zone_id=zone_by_name["Setor A Leste"].id, code="A-02", occupied=True, metadata_json={"sector": "A", "row": 1}),
        ParkingSpot(site_id=site.id, zone_id=zone_by_name["Setor A Leste"].id, code="A-03", occupied=False, metadata_json={"sector": "A", "row": 1}),
        ParkingSpot(site_id=site.id, zone_id=zone_by_name["Pátio Coberto 03"].id, code="C-15", occupied=True, metadata_json={"sector": "C", "row": 4}),
    ]
    db.add_all(spots)
    db.flush()

    vehicle_track = TrackedObject(
        site_id=site.id,
        camera_id=camera_by_name["Entrada Principal 01"].id,
        zone_id=zone_by_name["Setor A Leste"].id,
        object_type="vehicle",
        reid_group="veh-group-001",
        confidence=0.96,
        trajectory=[camera_by_name["Entrada Principal 01"].id, camera_by_name["Setor A Leste"].id],
        state_payload={"speed_hint": "slow"},
    )
    person_track = TrackedObject(
        site_id=site.id,
        camera_id=camera_by_name["Corredor B1"].id,
        zone_id=zone_by_name["Corredor B1"].id,
        object_type="person",
        reid_group="person-group-001",
        confidence=0.92,
        trajectory=[
            camera_by_name["Entrada Principal 01"].id,
            camera_by_name["Rampa Norte 02"].id,
            camera_by_name["Corredor B1"].id,
            camera_by_name["Pátio Coberto 03"].id,
        ],
        state_payload={"direction": "southbound"},
    )
    db.add_all([vehicle_track, person_track])
    db.flush()

    tracked_vehicle = TrackedVehicle(tracked_object_id=vehicle_track.id, parking_spot_id=spots[0].id, plate_hint="ABC1D23", color_hint="silver", occupancy_state="parked")
    tracked_person = TrackedPerson(tracked_object_id=person_track.id, probable_origin="vehicle_exit", time_outside_vehicle_seconds=720, visited_zone_ids=[zone_by_name["Corredor B1"].id, zone_by_name["Pátio Coberto 03"].id], visited_camera_ids=[camera_by_name["Entrada Principal 01"].id, camera_by_name["Corredor B1"].id, camera_by_name["Pátio Coberto 03"].id])
    db.add_all([tracked_vehicle, tracked_person])
    db.flush()

    association = PersonVehicleAssociation(person_id=tracked_person.id, vehicle_id=tracked_vehicle.id, confidence_score=0.89, association_type="origin_vehicle", active=True)
    db.add(association)

    event_started = datetime.utcnow() - timedelta(minutes=12)
    events = [
        Event(site_id=site.id, camera_id=camera_by_name["Entrada Principal 01"].id, event_type=EventType.PERSON_BOUND_TO_VEHICLE.value, severity=EventSeverity.MEDIUM.value, confidence=0.89, title="Pessoa vinculada ao veículo A-01", description="Pessoa saiu do veículo estacionado em A-01", started_at=event_started, related_camera_ids=[camera_by_name["Entrada Principal 01"].id], related_zone_ids=[zone_by_name["Setor A Leste"].id], payload={"person_id": tracked_person.id, "vehicle_id": tracked_vehicle.id}),
        Event(site_id=site.id, camera_id=camera_by_name["Corredor B1"].id, event_type=EventType.CROSS_CAMERA_TRANSITION.value, severity=EventSeverity.MEDIUM.value, confidence=0.82, title="Transição entre câmeras detectada", description="Pessoa transitou da Rampa Norte 02 para Corredor B1", started_at=event_started + timedelta(minutes=4), related_camera_ids=[camera_by_name["Rampa Norte 02"].id, camera_by_name["Corredor B1"].id], related_zone_ids=[zone_by_name["Rampa Norte 02"].id, zone_by_name["Corredor B1"].id], payload={"object_id": person_track.id, "travel_time_seconds": 14}),
        Event(site_id=site.id, camera_id=camera_by_name["Pátio Coberto 03"].id, event_type=EventType.RESTRICTED_ZONE_INTRUSION.value, severity=EventSeverity.CRITICAL.value, confidence=0.95, title="Intrusão em área restrita", description="Pessoa vinculada ao veículo entrou em área restrita", started_at=event_started + timedelta(minutes=9), related_camera_ids=[camera_by_name["Corredor B1"].id, camera_by_name["Pátio Coberto 03"].id], related_zone_ids=[zone_by_name["Corredor B1"].id, zone_by_name["Pátio Coberto 03"].id], payload={"object_id": person_track.id}),
        Event(site_id=site.id, camera_id=camera_by_name["Saída Sul 01"].id, event_type=EventType.CAMERA_OFFLINE.value, severity=EventSeverity.HIGH.value, confidence=1.0, title="Câmera offline", description="Saída Sul 01 não responde há mais de 60 segundos", started_at=event_started + timedelta(minutes=10), related_camera_ids=[camera_by_name["Saída Sul 01"].id], related_zone_ids=[zone_by_name["Saída Sul 01"].id], payload={"last_seen_at": (event_started + timedelta(minutes=9, seconds=30)).isoformat()}),
        Event(site_id=site.id, camera_id=camera_by_name["Setor A Leste"].id, event_type=EventType.HIGH_OCCUPANCY.value, severity=EventSeverity.MEDIUM.value, confidence=0.77, title="Alta ocupação no Setor A Leste", description="Ocupação acima do limiar configurado", started_at=event_started + timedelta(minutes=11), related_camera_ids=[camera_by_name["Setor A Leste"].id], related_zone_ids=[zone_by_name["Setor A Leste"].id], payload={"occupancy_rate": 0.86}),
    ]
    db.add_all(events)
    db.flush()

    artifacts = [
        EventArtifact(event_id=events[2].id, artifact_type="snapshot", path="storage/snapshots/restricted-zone-demo.jpg", metadata_json={"source_camera": camera_by_name["Pátio Coberto 03"].name}),
        EventArtifact(event_id=events[1].id, artifact_type="timeline", path="storage/clips/cross-camera-transition-demo.mp4", metadata_json={"trail": person_track.trajectory}),
    ]
    db.add_all(artifacts)

    alerts = [
        Alert(event_id=events[2].id, severity=EventSeverity.CRITICAL.value, status="open", note="Enviar operador para averiguação"),
        Alert(event_id=events[3].id, severity=EventSeverity.HIGH.value, status="open", note="Checar conectividade da câmera"),
    ]
    db.add_all(alerts)

    rule_configs = [
        RuleConfig(site_id=site.id, rule_key="person_vehicle_binding", enabled=True, config_json={"max_seconds": 20, "max_distance_m": 4}),
        RuleConfig(site_id=site.id, rule_key="person_returned_to_vehicle", enabled=True, config_json={"max_distance_m": 2.5}),
        RuleConfig(site_id=site.id, rule_key="unknown_person", enabled=True, config_json={"pedestrian_zone_types": ["pedestrian"]}),
        RuleConfig(site_id=site.id, rule_key="anomalous_wandering", enabled=True, config_json={"max_seconds": 900, "vehicle_visit_threshold": 3}),
        RuleConfig(site_id=site.id, rule_key="restricted_zone", enabled=True, config_json={"restricted_zone_types": ["restricted"]}),
        RuleConfig(site_id=site.id, rule_key="vehicle_count", enabled=True, config_json={"emit_site_level": True}),
        RuleConfig(site_id=site.id, rule_key="cross_camera_transition", enabled=True, config_json={"confidence_threshold": 0.65}),
        RuleConfig(site_id=site.id, rule_key="person_reidentification", enabled=True, config_json={"appearance_threshold": 0.4}),
    ]
    db.add_all(rule_configs)

    admin = User(organization_id=org.id, email="admin@safepark.local", password_hash="admin123", full_name="Safe Park Admin")
    db.add(admin)
    db.commit()
    db.close()


if __name__ == "__main__":
    seed()
