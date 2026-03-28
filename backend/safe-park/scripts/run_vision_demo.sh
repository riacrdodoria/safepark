#!/usr/bin/env bash
set -euo pipefail

source .venv/bin/activate
export PYTHONPATH="$(pwd)/services/vision:$(pwd)/packages/shared"
export SAFE_PARK_DEMO_VIDEO_PATH="${SAFE_PARK_DEMO_VIDEO_PATH:-/home/ricardo/safe-park/storage/demo/videos/parking-demo-whatsapp-2026-03-27.mp4}"
export SAFE_PARK_DEMO_CAMERA_ID="${SAFE_PARK_DEMO_CAMERA_ID:-841fa8a1-d341-45f8-a490-1c91f9dafab9}"
export SAFE_PARK_DEMO_CAMERA_NAME="${SAFE_PARK_DEMO_CAMERA_NAME:-Demo WhatsApp 01}"
python -m vision.main
