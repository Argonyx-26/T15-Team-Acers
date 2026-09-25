#!/usr/bin/env bash
# ==============================================================================
# AgroPulse — AI Model Training & Edge Compilation Pipeline
# Trains the 17-class MobileNetV2 with Autonomous Crop Recognition & BUG-01 Guard
# ==============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENGINE_DIR="$ROOT_DIR/agropulse-app/risk-engine"
VENV_DIR="$ENGINE_DIR/.venv"

echo "======================================================================"
echo " [AgroPulse] 17-Class Neural Pathology Training & Export Pipeline"
echo " MobileNetV2 · Autonomous Crop Recognition · BUG-01 Guard · TFLite"
echo "======================================================================"

if ! command -v python3 >/dev/null 2>&1; then
  echo "[-] Error: python3 is required on this system." >&2
  exit 1
fi

cd "$ENGINE_DIR"

# 1. Setup Virtual Environment
if [[ ! -d "$VENV_DIR" ]]; then
  echo "[+] Creating Python virtual environment in $VENV_DIR..."
  python3 -m venv "$VENV_DIR"
fi

# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

echo "[+] Upgrading pip and ensuring training dependencies..."
python -m pip install --quiet --upgrade pip
if [[ -f requirements-training.txt ]]; then
  python -m pip install --quiet -r requirements-training.txt
fi

# 2. Verify or Auto-Curate Dataset
if [[ ! -d curated_dataset/train || ! -d curated_dataset/val ]]; then
  echo "[+] Curated dataset not found. Running curate_crops.py from test vectors..."
  if [[ -f curate_crops.py ]]; then
    python curate_crops.py
  else
    echo "[-] Error: Neither curated_dataset/ nor curate_crops.py was found in $ENGINE_DIR" >&2
    exit 1
  fi
fi

# 3. Execute Model Training
echo "[+] Starting two-stage transfer learning and TFLite quantization..."
python train_model.py "$@"

# 4. Sync Exported TFLite Models to Mobile and Web Asset Stores
echo "[+] Syncing trained TFLite artifacts to application asset stores..."
APP_MODELS_DIR="$ROOT_DIR/agropulse-app/assets/models"
WEB_MODELS_DIR="$ROOT_DIR/agropulse-web/public/models"

mkdir -p "$APP_MODELS_DIR" "$WEB_MODELS_DIR"

if [[ -f artifacts/agropulse_leaf_classifier.tflite ]]; then
  cp -u artifacts/agropulse_leaf_classifier.tflite "$APP_MODELS_DIR/"
  cp -u artifacts/agropulse_leaf_classifier.tflite "$WEB_MODELS_DIR/"
fi

if [[ -f artifacts/crop_hierarchy.json ]]; then
  cp -u artifacts/crop_hierarchy.json "$APP_MODELS_DIR/"
  cp -u artifacts/crop_hierarchy.json "$WEB_MODELS_DIR/"
fi

if [[ -f artifacts/preprocessing.json ]]; then
  cp -u artifacts/preprocessing.json "$APP_MODELS_DIR/"
  cp -u artifacts/preprocessing.json "$WEB_MODELS_DIR/"
fi

if [[ -f artifacts/farmer_chat_model.json ]]; then
  cp -u artifacts/farmer_chat_model.json "$APP_MODELS_DIR/"
  cp -u artifacts/farmer_chat_model.json "$WEB_MODELS_DIR/"
fi

echo "======================================================================"
echo " [✓] Training complete! TFLite models synchronized."
echo "     • agropulse-app/assets/models/agropulse_leaf_classifier.tflite"
echo "     • agropulse-web/public/models/agropulse_leaf_classifier.tflite"
echo "     To run validation battery: ./trial-run.sh"
echo "======================================================================"
