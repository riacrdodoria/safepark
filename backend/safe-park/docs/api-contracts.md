# Safe Park API Contracts For Replit Frontend

## Core Endpoints

- `POST /auth/login`
- `GET /sites/`
- `GET /cameras/`
- `POST /cameras/`
- `GET /camera-links/`
- `POST /camera-links/`
- `GET /zones/`
- `GET /spots/`
- `GET /rules/`
- `GET /events/`
- `GET /events/{event_id}`
- `GET /alerts/`
- `GET /artifacts/events/{event_id}`
- `GET /dashboard/metrics`
- `GET /tracking/overview`
- `GET /camera-flow/`
- `GET /system/status`

## Frontend-Relevant Payloads

### Dashboard

- `cars_in_lot`
- `occupancy_rate`
- `unknown_persons`
- `high_occupancy_zones`
- `critical_alerts`
- `cameras_online`
- `cameras_offline`
- `recent_events`
- `occupancy_by_zone`

### Events Table

`GET /events/` returns:

- `items[]`
- `meta.total`
- `meta.offset`
- `meta.limit`

Supported filters:

- `event_type`
- `severity`
- `site_id`
- `offset`
- `limit`

### Tracking View

`GET /tracking/overview` returns:

- tracked people/vehicles/object totals
- active person-vehicle associations

### Camera Flow View

`GET /camera-flow/` returns:

- configured `CameraLink` graph
- recent cross-camera transition events

