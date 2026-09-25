import os
import io
import json
import warnings
from pathlib import Path
from typing import Optional

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
warnings.filterwarnings("ignore")

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

from smart_inference import SmartCropDiagnosticEngine
from risk_engine import CropRiskEngine

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
ENGINE_DIR = Path(__file__).resolve().parent

app = FastAPI(
    title="AgroPulse Regional Diagnostic & Risk API",
    description="Offline-first Crop Pathology, Non-Leaf Rejection, and Microclimate Risk Engine for Karnataka, Kerala, and Tamil Nadu",
    version="1.0.0"
)

# Enable CORS for web portal (port 5173), Expo (port 8081/8083), and local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load engine instance
model_file = ENGINE_DIR / "artifacts" / "agropulse_leaf_classifier.tflite"
mapping_file = ENGINE_DIR / "curated_dataset" / "class_mapping.json"
engine = SmartCropDiagnosticEngine(
    model_path=str(model_file),
    mapping_path=str(mapping_file),
    min_confidence=0.65,
    max_entropy=1.75
)

# Load team-verified advisories
advisories_path = ROOT_DIR / "agropulse-app" / "assets" / "data" / "advisories.json"
try:
    with open(advisories_path, "r", encoding="utf-8") as f:
        ADVISORIES_DATA = json.load(f)
except Exception:
    ADVISORIES_DATA = {}

CLASS_MAP = {
    "Background_without_leaves": "invalid_capture",
    "Banana___Cordana": "banana_cordana",
    "Banana___Healthy": "healthy",
    "Banana___Pestalotiopsis": "banana_pestalotiopsis",
    "Banana___Sigatoka": "banana_sigatoka",
    "Coconut___Healthy": "healthy",
    "Coconut___Leaf_Spot": "coconut_leaf_spot",
    "Coconut___Pest_Damage": "coconut_pest_damage",
    "Coconut___Yellowing": "coconut_yellowing",
    "Rice___Bacterial_leaf_blight": "rice_bacterial_leaf_blight",
    "Rice___Brown_spot": "rice_brown_spot",
    "Rice___Leaf_smut": "rice_leaf_smut",
    "Sugarcane___Healthy": "healthy",
    "Sugarcane___Mosaic": "sugarcane_mosaic",
    "Sugarcane___RedRot": "sugarcane_red_rot",
    "Sugarcane___Rust": "sugarcane_rust",
    "Sugarcane___Yellow": "sugarcane_yellow",
}


class WeatherRiskRequest(BaseModel):
    latitude: float = 12.9716
    longitude: float = 77.5946
    crop: str = "rice"


@app.get("/")
def read_root():
    return {
        "service": "AgroPulse AI Diagnostic & Risk Server",
        "status": "online",
        "classes_count": len(engine.idx_to_class),
        "target_regions": ["Karnataka", "Kerala", "Tamil Nadu"],
        "endpoints": ["/api/predict", "/api/weather-risk", "/api/health"]
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": True,
        "model_path": str(model_file.name),
        "classes": list(engine.idx_to_class.values()),
        "ood_rejection_active": True,
        "entropy_uncertainty_gate": True,
    }


@app.post("/api/predict")
async def predict_crop_leaf(
    file: UploadFile = File(...),
    weather_risk_score: Optional[float] = None
):
    try:
        content = await file.read()
        image = Image.open(io.BytesIO(content)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

    result = engine.predict(image, weather_risk_score=weather_risk_score)
    status = result.get("status")

    if status == "REJECTED_QUALITY":
        return {
            "status": "REJECTED_QUALITY",
            "class_name": "Invalid Quality",
            "confidence": 0.0,
            "message": result.get("message"),
            "requires_retake": True,
        }

    if status == "REJECTED_NON_LEAF":
        return {
            "status": "REJECTED_NON_LEAF",
            "class_name": "Background_without_leaves",
            "confidence": result.get("confidence", 0.0),
            "message": result.get("message"),
            "entropy": result.get("entropy"),
            "requires_retake": True,
            "advisory": ADVISORIES_DATA.get("invalid_capture"),
        }

    top_class = result.get("class_name")
    conf = result.get("confidence_percent", 0.0)
    adv_key = CLASS_MAP.get(top_class, "healthy")
    advisory = ADVISORIES_DATA.get(adv_key, {})

    return {
        "status": status,
        "class_name": top_class,
        "confidence": conf,
        "confidence_fraction": round(conf / 100.0, 4),
        "uncertainty_entropy": result.get("uncertainty_entropy"),
        "top_differential": result.get("top_differential", []),
        "fused_threat_level": result.get("fused_threat_level"),
        "weather_correlation": result.get("weather_correlation"),
        "requires_human_escalation": result.get("requires_human_escalation", False),
        "advisory": advisory,
    }


@app.post("/api/weather-risk")
def get_weather_risk(req: WeatherRiskRequest):
    try:
        risk_engine = CropRiskEngine(lat=req.latitude, lon=req.longitude)
        evaluation = risk_engine.evaluate_risk(crop=req.crop)
        
        # Format response matching QA runner contracts
        score = evaluation.get("risk_score", 25.0)
        return {
            "crop": req.crop,
            "latitude": req.latitude,
            "longitude": req.longitude,
            "risk_score_percent": round(score, 1),
            "alert_level": evaluation.get("alert_level", "LOW"),
            "primary_threat": evaluation.get("primary_threat", "General Foliar Monitoring"),
            "action": evaluation.get("action", "Routine field observation"),
            "consecutive_wet_hours": evaluation.get("consecutive_wet_hours", 0),
        }
    except Exception as e:
        # Fallback offline risk estimation if external API is unreachable
        return {
            "crop": req.crop,
            "latitude": req.latitude,
            "longitude": req.longitude,
            "risk_score_percent": 35.0,
            "alert_level": "MODERATE",
            "primary_threat": "Monsoon Humidity Precaution",
            "action": "Maintain soil drainage and scout lower foliage.",
            "source": "fallback_offline",
            "note": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8081))
    print(f"Starting AgroPulse API Server on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
