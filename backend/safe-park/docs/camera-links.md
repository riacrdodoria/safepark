# Configuring Camera Links

`CameraLink` encodes expected continuity between cameras.

Recommended fields:

- `source_camera_id`
- `target_camera_id`
- `link_type`
- `transition_confidence`
- `expected_travel_time_min`
- `expected_travel_time_max`

## Practical Use

- entrance to lane camera
- lane to pedestrian corridor
- corridor to covered patio
- parking overview to exit camera

These links are consumed by the multi-camera transition heuristics in the rules engine and camera-flow endpoints.

