import json
import requests
from typing import Dict, Any

class CropRiskEngine:
    def __init__(self, lat: float = 12.9716, lon: float = 77.5946):
        self.lat = lat
        self.lon = lon
        self.api_url = "https://api.open-meteo.com/v1/forecast"

    def fetch_weather(self) -> Dict[str, Any]:
        params = {
            "latitude": self.lat,
            "longitude": self.lon,
            "hourly": "temperature_2m,relative_humidity_2m,precipitation_probability,dew_point_2m",
            "past_days": 1,
            "forecast_days": 1,
            "timezone": "auto"
        }
        res = requests.get(self.api_url, params=params, timeout=10)
        res.raise_for_status()
        return res.json()

    def evaluate_risk(self, crop: str) -> Dict[str, Any]:
        c = crop.lower().strip().replace(" ", "")
        data = self.fetch_weather()
        hourly = data.get("hourly", {})

        temps = hourly.get("temperature_2m", [])[-24:]
        rhs = hourly.get("relative_humidity_2m", [])[-24:]
        rain_probs = hourly.get("precipitation_probability", [])[-24:]

        avg_temp = sum(temps) / len(temps)
        avg_rh = sum(rhs) / len(rhs)
        max_rain = max(rain_probs) if rain_probs else 0

        # Calculate high moisture/dew hours
        wet_hours = sum(1 for r in rhs if r >= 88.0)
        risk_score = 15.0
        threat = "General Foliar Stress"

        # 1. Tomato & Potato (Late Blight - Wallin Index)
        if c in ["tomato", "potato"]:
            threat = "Late Blight (Phytophthora infestans)"
            hours = sum(1 for t, r in zip(temps, rhs) if 15.0 <= t <= 22.0 and r >= 90.0)
            risk_score = 65.0 + (hours * 4) if hours >= 8 else (avg_rh * 0.35)

        # 2. Rice (Rice Blast)
        elif c == "rice":
            threat = "Rice Blast (Magnaporthe oryzae)"
            hours = sum(1 for t, r in zip(temps, rhs) if 24.0 <= t <= 28.0 and r >= 90.0)
            risk_score = 70.0 + (hours * 4) if hours >= 6 else (avg_rh * 0.3)

        # 3. Ragi / Finger Millet (Ragi Blast - Pyricularia grisea)
        elif c in ["ragi", "fingermillet"]:
            threat = "Ragi Blast (Pyricularia grisea)"
            hours = sum(1 for t, r in zip(temps, rhs) if 22.0 <= t <= 29.0 and r >= 85.0)
            risk_score = 65.0 + (hours * 3.5) if hours >= 7 else (avg_rh * 0.3)

        # 4. Sugarcane (Red Rot & Rust)
        elif c == "sugarcane":
            threat = "Red Rot & Rust (Colletotrichum falcatum)"
            risk_score = 75.0 if (avg_temp >= 28.0 and avg_rh >= 80.0 and max_rain > 50) else (avg_rh * 0.35)

        # 5. Banana (Black Sigatoka)
        elif c == "banana":
            threat = "Black Sigatoka (Pseudocercospora fijiensis)"
            hours = sum(1 for t, r in zip(temps, rhs) if 23.0 <= t <= 28.0 and r >= 85.0)
            risk_score = 70.0 + (hours * 3) if hours >= 8 else (avg_rh * 0.35)

        # 6. Coconut (Bud Rot / Leaf Blight)
        elif c == "coconut":
            threat = "Bud Rot (Phytophthora palmivora)"
            risk_score = 80.0 if (avg_rh >= 85.0 and wet_hours >= 10 and max_rain >= 60) else (avg_rh * 0.3)

        # 7. Onion (Purple Blotch & Downy Mildew)
        elif c == "onion":
            threat = "Purple Blotch (Alternaria porri)"
            hours = sum(1 for t, r in zip(temps, rhs) if 20.0 <= t <= 25.0 and r >= 85.0)
            risk_score = 65.0 + (hours * 4) if hours >= 6 else (avg_rh * 0.3)

        # 8. Black Pepper / Spices (Quick Wilt / Foot Rot)
        elif c in ["blackpepper", "spices", "pepper"]:
            threat = "Quick Wilt (Phytophthora capsici)"
            risk_score = 85.0 if (wet_hours >= 12 and avg_temp >= 22.0 and max_rain >= 50) else (avg_rh * 0.35)

        # 9. Rubber (Abnormal Leaf Fall)
        elif c == "rubber":
            threat = "Abnormal Leaf Fall (Phytophthora meadii)"
            risk_score = 80.0 if (avg_rh >= 90.0 and avg_temp <= 26.0 and wet_hours >= 8) else (avg_rh * 0.3)

        risk_score = round(min(100.0, max(10.0, risk_score)), 1)
        alert = "CRITICAL (HIGH)" if risk_score >= 70 else ("MODERATE" if risk_score >= 40 else "LOW")

        return {
            "crop": crop.capitalize(),
            "location": {"latitude": self.lat, "longitude": self.lon},
            "risk_score_percent": risk_score,
            "alert_level": alert,
            "primary_threat": threat,
            "metrics": {
                "avg_temperature_c": round(avg_temp, 1),
                "avg_relative_humidity": round(avg_rh, 1),
                "max_rain_probability": max_rain,
                "wet_hours_last_24h": wet_hours
            }
        }

if __name__ == "__main__":
    engine = CropRiskEngine()
    for crop_name in ["tomato", "rice", "ragi", "sugarcane", "banana", "coconut", "onion", "black pepper", "rubber"]:
        res = engine.evaluate_risk(crop_name)
        print(f"[{res['alert_level']}] {res['crop']}: {res['risk_score_percent']}% -> Threat: {res['primary_threat']}")