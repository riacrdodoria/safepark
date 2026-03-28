# Safe Park Backend MVP

Backend-only Safe Park monorepo for Linux (`wo4`), prepared to serve a separate frontend built in Replit.

## Project Path On `wo4`

Recommended target path:

- `/home/ricardo/safe-park`

## Repository Structure

```text
safe-park/
  apps/
    api/
  services/
    vision/
    rules/
    stream-gateway/
  packages/
    shared/
  infra/
  scripts/
  storage/
    clips/
    snapshots/
    logs/
  docs/
```

## What Is Real In This MVP

- FastAPI backend
- PostgreSQL schema
- OpenAPI docs
- seeded demo data
- dashboard/event/tracking/camera-flow APIs
- stream validation and snapshot capture
- Docker Compose for PostgreSQL and go2rtc

## What Is Mocked Or Simplified

- authentication is basic
- advanced multi-camera re-identification is heuristic
- vision inference loop is demo-oriented first, with structure for real RTSP/video ingestion
- automatic go2rtc stream registration is not complete yet

## Setup On `wo4`

```bash
cd /home/ricardo
cp -r safe-park /home/ricardo/safe-park
cd /home/ricardo/safe-park
cp .env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

The dedicated environment is:

- `/home/ricardo/safe-park/.venv`

## Optional Real Vision Stack

For the first backend MVP, `requirements.txt` installs the stable base stack plus OpenCV.

`Ultralytics` is kept in `requirements-vision.txt` because Linux resolution may pull a very heavy `torch` dependency chain that is unnecessary for the demo-first backend baseline.

When you want to enable the real detector stack in the same dedicated environment:

```bash
source .venv/bin/activate
pip install -r requirements-vision.txt
```

## Start Infrastructure

```bash
docker compose up -d
```

Services:

- PostgreSQL at `localhost:5432`
- go2rtc at `http://localhost:1984`

## Seed Demo Data

```bash
source .venv/bin/activate
export PYTHONPATH="$(pwd)/apps/api:$(pwd)/packages/shared:$(pwd)/services/rules:$(pwd)/services/vision:$(pwd)/services/stream-gateway"
python scripts/seed_demo.py
```

## Run The API

```bash
./scripts/run_api.sh
```

API endpoints:

- root: `http://localhost:8000/`
- docs: `http://localhost:8000/docs`
- openapi: `http://localhost:8000/openapi.json`

## Run The Stream Gateway

```bash
./scripts/run_stream_gateway.sh
```

Stream gateway:

- `http://localhost:8010/`

## Run Demo Vision And Rules Services

```bash
./scripts/run_vision_demo.sh
./scripts/run_rules_demo.sh
```

## Storage Layout

- snapshots: `storage/snapshots/`
- clips: `storage/clips/`
- logs: `storage/logs/`

## Real RTSP Cameras

1. Create camera via `POST /cameras/`
2. Validate stream via `POST /validate` on stream-gateway
3. Optionally capture a snapshot via `POST /snapshot`
4. Configure `CameraLink` relations via `POST /camera-links/`

More detail:

- `docs/camera-ip-onboarding.md`
- `docs/camera-links.md`

## Frontend Integration

The future Replit frontend should use:

- `GET /dashboard/metrics`
- `GET /events/`
- `GET /events/{event_id}`
- `GET /cameras/`
- `GET /camera-flow/`
- `GET /tracking/overview`
- `GET /system/status`

See:

- `docs/api-contracts.md`
