# Multi-Camera Events

## Implemented Event Types

- `cross_camera_transition`
- `person_reidentified`
- `person_lost_track`
- `restricted_zone_intrusion`
- `unknown_person_detected`
- `person_bound_to_vehicle`
- `person_returned_to_vehicle`
- `high_occupancy`
- `camera_offline`

## How The MVP Works

1. The vision service keeps short-lived state per camera.
2. Lost objects are buffered.
3. If a related camera receives a compatible object inside the configured `CameraLink` travel window, the rules engine can emit:
   - `cross_camera_transition`
   - `person_reidentified`

This is heuristic and deliberately simple in the MVP.

