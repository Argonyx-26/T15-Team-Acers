#!/usr/bin/env bash
# ==============================================================================
# AgroPulse — Web Portal Launcher (Canonical / Ubuntu Theme)
# Launches the interactive web portal for smallholder crop pathology.
# Runs in the foreground and stops immediately on Ctrl+C.
# ==============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$ROOT_DIR/agropulse-web"

if [[ ! -d "$WEB_DIR" ]]; then
  echo "[-] Error: agropulse-web directory was not found at $WEB_DIR" >&2
  exit 1
fi

cd "$WEB_DIR"

if [[ ! -d node_modules ]]; then
  echo "[+] Installing web dependencies..."
  npm install
fi

PORT="${PORT:-5173}"

# Handle --build flag
if [[ "${1:-}" == "--build" ]]; then
  echo "[+] Building AgroPulse Web Portal for production..."
  npm run build
  echo "[✓] Build complete: $WEB_DIR/dist"
  exit 0
fi

# Handle --preview flag
if [[ "${1:-}" == "--preview" ]]; then
  echo "======================================================================"
  echo " [AgroPulse] Previewing Production Web Portal (Canonical Theme)"
  echo " URL: http://localhost:$PORT"
  echo " Note: Press Ctrl+C to exit (stops completely)."
  echo "======================================================================"
  npm run preview -- --port "$PORT" --host
  exit 0
fi

echo "======================================================================"
echo " [AgroPulse] Starting Web Portal (Canonical Ubuntu Theme)"
echo " Local URL:    http://localhost:$PORT"
echo " Network URL:  http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo '0.0.0.0'):$PORT"
echo ""
echo " Features: Interactive Leaf Lab · Bayesian Prior Simulator"
echo "           Automated QA Benchmark · Vernacular Audio · Regional SOPs"
echo ""
echo " Note: Running in foreground. Press Ctrl+C anytime to stop."
echo "======================================================================"

npm run dev -- --port "$PORT" --host
