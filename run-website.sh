#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$ROOT_DIR/agropulse-web"

if [[ ! -d "$WEB_DIR" ]]; then
  echo "Error: agropulse-web directory was not found." >&2
  exit 1
fi

cd "$WEB_DIR"

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  npm install
fi

PORT="${PORT:-5173}"

echo "=================================================="
echo " Starting AgroPulse Web Portal on port $PORT..."
echo " Open in browser: http://localhost:$PORT"
echo "=================================================="

npm run dev -- --port "$PORT" --host
