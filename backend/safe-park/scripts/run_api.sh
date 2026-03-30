#!/usr/bin/env bash
set -euo pipefail

source .venv/bin/activate
export PYTHONPATH="$(pwd)/apps/api:$(pwd)/packages/shared:$(pwd)/services/rules:$(pwd)/services/vision:$(pwd)/services/stream-gateway"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

