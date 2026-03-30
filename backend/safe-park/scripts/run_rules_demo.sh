#!/usr/bin/env bash
set -euo pipefail

source .venv/bin/activate
export PYTHONPATH="$(pwd)/services/rules:$(pwd)/packages/shared"
python -m rules.runner

