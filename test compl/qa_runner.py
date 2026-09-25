import os
import requests
import json
from pathlib import Path

# Local FastAPI address where backend is hosted
API_BASE_URL = os.environ.get("API_BASE_URL", "http://127.0.0.1:8000")
GOLD_DIR = Path(__file__).resolve().parent / "qa_test_assets" / "demo_gold"

def test_weather_engine():
    print("\n--- 1. Testing Meteorological Risk Engine Endpoint ---")
    payload = {
        "latitude": 12.9716,
        "longitude": 77.5946,
        "crop": "tomato"
    }
    try:
        res = requests.post(f"{API_BASE_URL}/api/weather-risk", json=payload, timeout=5)
        if res.status_code == 200:
            data = res.json()
            print(f"[PASS] Risk Score: {data.get('risk_score_percent')}% | Alert: {data.get('alert_level')}")
        else:
            print(f"[FAIL] HTTP {res.status_code}: {res.text}")
    except requests.exceptions.ConnectionError:
        print("[PENDING] Backend not running yet. Visweshwara needs to start the FastAPI server.")

def test_image_inference():
    print("\n--- 2. Testing Vision Model Camera Upload Simulation ---")
    if not GOLD_DIR.exists() or not list(GOLD_DIR.glob("*.*")):
        print(f"[WARN] No test images found in {GOLD_DIR}. Add test images first.")
        return

    for img_path in GOLD_DIR.glob("*.*"):
        if img_path.suffix.lower() not in [".jpg", ".jpeg", ".png"]:
            continue
        try:
            with open(img_path, "rb") as f:
                files = {"file": (img_path.name, f, "image/jpeg")}
                res = requests.post(f"{API_BASE_URL}/api/predict", files=files, timeout=10)
                
            if res.status_code == 200:
                result = res.json()
                print(f"[PASS] Image: {img_path.name} -> Class: {result.get('class_name')} | Conf: {result.get('confidence')}%")
            else:
                print(f"[FAIL] Image: {img_path.name} -> HTTP {res.status_code}: {res.text}")
        except requests.exceptions.ConnectionError:
            print("[PENDING] Backend not running yet.")
            break

if __name__ == "__main__":
    print("Argonyx QA & Integration Test Runner")
    test_weather_engine()
    test_image_inference()