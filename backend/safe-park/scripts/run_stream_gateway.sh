#!/usr/bin/env bash
set -euo pipefail

source .venv/bin/activate
export PYTHONPATH="$(pwd)/services/stream-gateway:$(pwd)/packages/shared"
uvicorn stream_gateway.main:app --host 0.0.0.0 --port 8010 --reload

