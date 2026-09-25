#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENGINE_DIR="$ROOT_DIR/agropulse-app/risk-engine"
PYTHON_BIN="$ENGINE_DIR/.venv/bin/python"

if [[ ! -f "$PYTHON_BIN" ]]; then
  echo "Error: Virtual environment not found at $PYTHON_BIN." >&2
  exit 1
fi

"$PYTHON_BIN" "$ENGINE_DIR/trial_run.py" "$@"
