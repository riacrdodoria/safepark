# Safe Park Backend Architecture

## Scope

This repository contains the backend and services for Safe Park running locally on Linux (`wo4`), designed to power a separate frontend built in Replit.

## Components

- `apps/api`: primary FastAPI application with domain APIs, dashboard endpoints, tracking endpoints, and OpenAPI
- `services/stream-gateway`: RTSP validation, snapshots, and integration surface for `go2rtc`
- `services/vision`: frame ingestion and tracking service with demo-mode multi-camera simulation
- `services/rules`: rules engine for person-vehicle binding, return-to-vehicle, restricted zones, unknown persons, and cross-camera continuity
- `packages/shared`: shared enums and contracts reused across services
- `infra`: Docker Compose and `go2rtc` config
- `storage`: clips, snapshots, and logs used by services
- `docs`: API-first documentation for the frontend and operations

## MVP Decisions

- PostgreSQL runs via Docker Compose
- `go2rtc` is used for MVP stream relay because it is the most pragmatic choice for RTSP handling and future browser preview support
- multi-camera tracking starts with heuristics driven by `CameraLink` and short-lived state
- demo mode is functional and seeded; advanced inference is scaffolded for incremental replacement with real detectors

## Commercial Evolution Path

- swap simple auth for proper tenant-aware auth
- move background workers to queue-based processing
- add robust re-identification embeddings
- add artifact lifecycle management for clips and snapshots
- expose signed URLs and authz boundaries for SaaS deployment

