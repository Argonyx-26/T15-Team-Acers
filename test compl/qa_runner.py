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
                print(f"[PASS] Image: {img_path.name} -> Class: {result.get('class_name')} | Conf: {result.get('confidence')}% | Crop: {result.get('detected_crop')} ({result.get('crop_confidence_percent')}%)")
            else:
                print(f"[FAIL] Image: {img_path.name} -> HTTP {res.status_code}: {res.text}")
        except requests.exceptions.ConnectionError:
            print("[PENDING] Backend not running yet.")
            break

def test_crop_recognition_and_mismatch():
    print("\n--- 3. Testing Autonomous Crop Recognition & Farmer Input Mismatch Cross-Validation ---")
    test_img = GOLD_DIR / "DSC_0109.jpg"
    if not test_img.exists():
        for p in GOLD_DIR.glob("*.*"):
            if p.suffix.lower() in [".jpg", ".jpeg", ".png"]:
                test_img = p
                break
    
    if not test_img or not test_img.exists():
        print("[SKIP] No image available for crop mismatch test.")
        return

    try:
        # Case A: Autonomous Crop Detection (No user_crop provided)
        with open(test_img, "rb") as f:
            res_auto = requests.post(f"{API_BASE_URL}/api/predict", files={"file": (test_img.name, f, "image/jpeg")}, timeout=10)
        if res_auto.status_code == 200:
            data = res_auto.json()
            detected_crop = data.get("detected_crop")
            print(f"[PASS] Autonomous Crop Recognition: detected '{detected_crop}' ({data.get('crop_confidence_percent')}%) | Verification: {data.get('crop_verification')}")
        else:
            print(f"[FAIL] Auto predict failed: HTTP {res_auto.status_code}")
            return

        # Case B: Cross-Validation with Deliberate Crop Mismatch
        conflicting_crop = "Sugarcane" if detected_crop != "Sugarcane" else "Rice"
        with open(test_img, "rb") as f:
            res_mismatch = requests.post(f"{API_BASE_URL}/api/predict?user_crop={conflicting_crop}", files={"file": (test_img.name, f, "image/jpeg")}, timeout=10)
        if res_mismatch.status_code == 200:
            data_m = res_mismatch.json()
            if data_m.get("crop_verification") == "CROP_MISMATCH_DETECTED" and data_m.get("mismatch_warning"):
                print(f"[PASS] Deliberate Mismatch Caught: Input '{conflicting_crop}' vs Detected '{data_m.get('detected_crop')}'. Warning: {data_m.get('mismatch_warning')}")
            else:
                print(f"[FAIL] Expected CROP_MISMATCH_DETECTED, got: {data_m.get('crop_verification')}")
        else:
            print(f"[FAIL] Mismatch test HTTP error: {res_mismatch.status_code}")

        # Case C: Cross-Validation with Matching Input Crop
        with open(test_img, "rb") as f:
            res_match = requests.post(f"{API_BASE_URL}/api/predict?user_crop={detected_crop}", files={"file": (test_img.name, f, "image/jpeg")}, timeout=10)
        if res_match.status_code == 200:
            data_ok = res_match.json()
            if data_ok.get("crop_verification") == "VERIFIED_MATCH":
                print(f"[PASS] Farmer Input Verified: Input '{detected_crop}' matches Detected '{data_ok.get('detected_crop')}'. Verification: {data_ok.get('crop_verification')}")
            else:
                print(f"[FAIL] Expected VERIFIED_MATCH, got: {data_ok.get('crop_verification')}")
        else:
            print(f"[FAIL] Match test HTTP error: {res_match.status_code}")

    except requests.exceptions.ConnectionError:
        print("[PENDING] Backend not running yet.")

if __name__ == "__main__":
    print("Argonyx QA & Integration Test Runner")
    test_weather_engine()
    test_image_inference()
    test_crop_recognition_and_mismatch()