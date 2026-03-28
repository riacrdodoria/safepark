#!/usr/bin/env bash
set -euo pipefail

cd /home/ricardo/safe-park
source .venv/bin/activate
export PYTHONPATH="$(pwd)/services/vision:$(pwd)/packages/shared"

mkdir -p storage/logs/vision storage/snapshots
pkill -f "python -m vision.main" || true

launch_worker() {
  local camera_id="$1"
  local camera_name="$2"
  local video_path="$3"
  local state_path="$4"
  local snapshot_path="$5"

  nohup env \
    SAFE_PARK_DEMO_CAMERA_ID="$camera_id" \
    SAFE_PARK_DEMO_CAMERA_NAME="$camera_name" \
    SAFE_PARK_DEMO_VIDEO_PATH="$video_path" \
    SAFE_PARK_VISION_STATE_PATH="$state_path" \
    SAFE_PARK_VISION_SNAPSHOT_PATH="$snapshot_path" \
    python -m vision.main \
    > "storage/logs/vision/${camera_id}.log" 2>&1 < /dev/null &
}

launch_worker \
  "841fa8a1-d341-45f8-a490-1c91f9dafab9" \
  "Demo WhatsApp 01" \
  "/home/ricardo/safe-park/storage/demo/videos/parking-demo-whatsapp-2026-03-27.mp4" \
  "/home/ricardo/safe-park/storage/logs/vision/841fa8a1-d341-45f8-a490-1c91f9dafab9.json" \
  "/home/ricardo/safe-park/storage/snapshots/vision-841fa8a1-d341-45f8-a490-1c91f9dafab9.jpg"

launch_worker \
  "47c89a10-98cc-4a56-87f5-5e2b71692335" \
  "Entrada Principal 01" \
  "/home/ricardo/safe-park/storage/demo/videos/parking-feed-02.mp4" \
  "/home/ricardo/safe-park/storage/logs/vision/47c89a10-98cc-4a56-87f5-5e2b71692335.json" \
  "/home/ricardo/safe-park/storage/snapshots/vision-47c89a10-98cc-4a56-87f5-5e2b71692335.jpg"

launch_worker \
  "54d98e47-1edd-418e-98ab-4bc1d08a98de" \
  "Rampa Norte 02" \
  "/home/ricardo/safe-park/storage/demo/videos/parking-feed-03.mp4" \
  "/home/ricardo/safe-park/storage/logs/vision/54d98e47-1edd-418e-98ab-4bc1d08a98de.json" \
  "/home/ricardo/safe-park/storage/snapshots/vision-54d98e47-1edd-418e-98ab-4bc1d08a98de.jpg"

launch_worker \
  "9ad7d773-bbb0-4333-ae39-0d9a53c37146" \
  "Pátio Coberto 03" \
  "/home/ricardo/safe-park/storage/demo/videos/parking-feed-04.mp4" \
  "/home/ricardo/safe-park/storage/logs/vision/9ad7d773-bbb0-4333-ae39-0d9a53c37146.json" \
  "/home/ricardo/safe-park/storage/snapshots/vision-9ad7d773-bbb0-4333-ae39-0d9a53c37146.jpg"

echo "vision workers started"
