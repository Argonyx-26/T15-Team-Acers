#!/usr/bin/env bash
# ==============================================================================
# AgroPulse — Unified Stack Launcher (All-In-One)
# Launches:
#   1. FastAPI Neural Inference Backend (:8000)
#   2. Diagnostic Validation Trial Battery (17-class vision + conversational check)
#   3. Web Application Portal (:5173)
#
# Terminates all background services cleanly on Ctrl+C.
# ==============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENGINE_DIR="$ROOT_DIR/agropulse-app/risk-engine"
WEB_DIR="$ROOT_DIR/agropulse-web"
VENV_DIR="$ENGINE_DIR/.venv"
PYTHON_BIN="$VENV_DIR/bin/python"

BACKEND_PID=""
WEB_PID=""

cleanup() {
  echo ""
  echo "======================================================================"
  echo " [AgroPulse] Shutting down unified stack..."
  if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo " [+] Stopping FastAPI Neural Server (PID: $BACKEND_PID)..."
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [[ -n "$WEB_PID" ]] && kill -0 "$WEB_PID" 2>/dev/null; then
    echo " [+] Stopping Web Application (PID: $WEB_PID)..."
    kill "$WEB_PID" 2>/dev/null || true
  fi
  # Catch any lingering child processes on ports
  fuser -k 8000/tcp 2>/dev/null || true
  echo " [✓] All AgroPulse services stopped cleanly."
  echo "======================================================================"
  exit 0
}

trap cleanup INT TERM EXIT

echo "======================================================================"
echo "      🌱 AGROPULSE UNIFIED SYSTEM LAUNCHER (ALL 3 SERVICES)         "
echo "======================================================================"
echo " 1. FastAPI Neural Inference Backend (TFLite + Bayesian Risk)"
echo " 2. Comprehensive Model & Conversational Trial Battery"
echo " 3. Responsive Web Application (Leaf Vision + Farmer Companion)"
echo "======================================================================"

# --- 1. Launch FastAPI Backend Server ---
echo ""
echo "[Step 1/3] Starting FastAPI Neural Diagnostic Backend on port 8000..."

if [[ ! -f "$PYTHON_BIN" ]]; then
  echo " [+] Initializing Python virtual environment in $VENV_DIR..."
  python3 -m venv "$VENV_DIR"
  "$VENV_DIR/bin/pip" install --quiet --upgrade pip
  "$VENV_DIR/bin/pip" install --quiet -r "$ENGINE_DIR/requirements-training.txt"
fi

# Ensure port 8000 is free
fuser -k 8000/tcp 2>/dev/null || true

cd "$ENGINE_DIR"
PYTHONPATH="$ENGINE_DIR" "$PYTHON_BIN" -m uvicorn server:app --host 0.0.0.0 --port 8000 > /tmp/agropulse-backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend health
echo -n " [+] Waiting for backend neural engine to initialize"
MAX_TRIES=20
TRIES=0
until curl -s http://localhost:8000/api/health >/dev/null 2>&1; do
  echo -n "."
  sleep 0.5
  TRIES=$((TRIES + 1))
  if [[ $TRIES -ge $MAX_TRIES ]]; then
    echo ""
    echo "[-] Error: Backend server failed to start. Logs:"
    cat /tmp/agropulse-backend.log
    exit 1
  fi
done
echo " [ONLINE ✅]"
echo "     • Endpoint:  http://localhost:8000"
echo "     • Swagger:   http://localhost:8000/docs"
echo "     • Health:    http://localhost:8000/api/health"

# --- 2. Run Diagnostic & Conversational Trial Battery ---
if [[ "${1:-}" != "--skip-trial" ]]; then
  echo ""
  echo "[Step 2/3] Running Neural Diagnostic & Conversational Trial Battery..."
  cd "$ROOT_DIR"
  bash trial-run.sh
else
  echo ""
  echo "[Step 2/3] Skipping trial battery as requested (--skip-trial)."
fi

# --- 3. Launch Web Application ---
echo ""
echo "[Step 3/3] Starting AgroPulse Web Application on port 5173..."
cd "$WEB_DIR"

if [[ ! -d node_modules ]]; then
  echo " [+] Installing web dependencies..."
  npm install
fi

echo "======================================================================"
echo " [✓] ALL THREE SERVICES ARE LIVE & INTERCONNECTED:"
echo ""
echo "  🌐 Web Application:       http://localhost:5173"
echo "  🧠 FastAPI Neural Engine:  http://localhost:8000"
echo "  📖 API Documentation:     http://localhost:8000/docs"
echo ""
echo " Note: Press Ctrl+C anytime to stop all services simultaneously."
echo "======================================================================"

# Run web app in foreground; trap will handle clean termination
npm run dev -- --port 5173 --host
