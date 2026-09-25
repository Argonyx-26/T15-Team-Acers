#!/usr/bin/env bash
# ==============================================================================
# AgroPulse — FastAPI Inference Server Launcher
# Runs the on-device TFLite inference server with microclimate prior integration.
# Runs in the foreground and terminates cleanly on Ctrl+C.
# ==============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENGINE_DIR="$ROOT_DIR/agropulse-app/risk-engine"
VENV_DIR="$ENGINE_DIR/.venv"
PYTHON_BIN="$VENV_DIR/bin/python"

if ! command -v python3 >/dev/null 2>&1; then
  echo "[-] Error: python3 is required on this system." >&2
  exit 1
fi

if [[ ! -f "$PYTHON_BIN" ]]; then
  echo "[+] Initializing Python virtual environment in $VENV_DIR..."
  python3 -m venv "$VENV_DIR"
  # shellcheck disable=SC1091
  source "$VENV_DIR/bin/activate"
  python -m pip install --quiet --upgrade pip
  python -m pip install --quiet -r "$ENGINE_DIR/requirements-training.txt"
fi

PORT="${PORT:-8000}"

echo "======================================================================"
echo " [AgroPulse] Starting FastAPI Inference Backend"
echo " Endpoint:   http://localhost:$PORT"
echo " Docs:       http://localhost:$PORT/docs"
echo " Health:     http://localhost:$PORT/api/health"
echo ""
echo " Note: Running in foreground. Press Ctrl+C anytime to stop."
echo "======================================================================"

cd "$ENGINE_DIR"
"$PYTHON_BIN" -m uvicorn server:app --host 0.0.0.0 --port "$PORT"
