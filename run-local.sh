#!/usr/bin/env bash
# ==============================================================================
# AgroPulse — Local Web Application Launcher (Canonical / Ubuntu Theme)
# Focused 100% on the responsive Web Application (Mobile / Expo Go decommissioned).
# Runs in the foreground and stops immediately on Ctrl+C.
# ==============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "======================================================================"
echo " [AgroPulse] Directing to Responsive Web Portal"
echo " Note: Mobile / Expo Go decommissioned as requested. Focusing 100% on Web App."
echo "======================================================================"

exec "$ROOT_DIR/run-website.sh" "$@"
