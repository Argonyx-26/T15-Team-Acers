#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$ROOT_DIR/agropulse-app"

if [[ ! -d "$APP_DIR" ]]; then
  echo "Error: agropulse-app directory was not found." >&2
  exit 1
fi

cd "$APP_DIR"

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting AgroPulse web app..."
echo "Open the Expo URL shown below in your browser."

npm run web -- --lan --port "${AGROPULSE_PORT:-8083}"
