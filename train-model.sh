#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENGINE_DIR="$ROOT_DIR/agropulse-app/risk-engine"
VENV_DIR="$ENGINE_DIR/.venv"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Error: python3 is required." >&2
  exit 1
fi

# Note: TensorFlow 2.22+ supports Python 3.14


cd "$ENGINE_DIR"

if [[ ! -d "$VENV_DIR" ]]; then
  python3 -m venv "$VENV_DIR"
fi

# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"
python -m pip install --upgrade pip
python -m pip install -r requirements-training.txt

if [[ ! -d curated_dataset/train || ! -d curated_dataset/val ]]; then
  echo "Dataset split not found. Add raw_plantvillage/ and raw_rice/ first." >&2
  exit 1
fi

python train_model.py "$@"
