#!/usr/bin/env bash
# ==============================================================================
# AgroPulse — Mobile Application Launcher (Canonical / Ubuntu Theme)
# Launches the React Native Expo field application for leaf diagnosis.
# Runs in the foreground and stops immediately on Ctrl+C.
# ==============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$ROOT_DIR/agropulse-app"

if [[ ! -d "$APP_DIR" ]]; then
  echo "[-] Error: agropulse-app directory was not found at $APP_DIR" >&2
  exit 1
fi

cd "$APP_DIR"

if [[ ! -d node_modules ]]; then
  echo "[+] Installing mobile app dependencies..."
  npm install
fi

PORT="${AGROPULSE_PORT:-8083}"

echo "======================================================================"
echo " [AgroPulse] Starting Mobile Application (Canonical Ubuntu Theme)"
echo " Environment: React Native (Expo) · Port: $PORT"
echo " Modes:       --web (default) | --android | --ios"
echo ""
echo " Note: Running in foreground. Press Ctrl+C anytime to stop."
echo "======================================================================"

case "${1:-web}" in
  android|--android)
    echo "[+] Launching on Android device or emulator..."
    npm run android
    ;;
  ios|--ios)
    echo "[+] Launching on iOS simulator or device..."
    npm run ios
    ;;
  *)
    echo "[+] Launching web preview on port $PORT..."
    npm run web -- --lan --port "$PORT"
    ;;
esac
