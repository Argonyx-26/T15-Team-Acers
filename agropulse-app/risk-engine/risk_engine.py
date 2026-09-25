import json
import requests
from typing import Dict, Any

class CropRiskEngine:
    def __init__(self, lat: float = 12.9716, lon: float = 77.5946):
        """
        Default coordinates set to Bengaluru region (lat=12.9716, lon=77.5946).
        """
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
        response = requests.get(self.api_url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()

    def evaluate_risk(self, crop: str) -> Dict[str, Any]:
        crop = crop.lower()
        data = self.fetch_weather()
        hourly = data.get("hourly", {})

        temps = hourly.get("temperature_2m", [])[-24:]
        rhs = hourly.get("relative_humidity_2m", [])[-24:]
        rain_probs = hourly.get("precipitation_probability", [])[-24:]

        if not temps or not rhs:
            return {"error": "Insufficient weather data received"}

        avg_temp = sum(temps) / len(temps)
        avg_rh = sum(rhs) / len(rhs)
        max_rain_prob = max(rain_probs) if rain_probs else 0

        # Calculate consecutive high humidity / dew hours (surrogate for Leaf Wetness Duration)
        consecutive_wet_hours = 0
        max_consecutive_wet = 0
        for rh in rhs:
            if rh >= 88.0:
                consecutive_wet_hours += 1
                max_consecutive_wet = max(max_consecutive_wet, consecutive_wet_hours)
            else:
                consecutive_wet_hours = 0

        risk_score = 0.0
        primary_threat = "None"
        alert_level = "LOW"

        if crop in ["tomato", "potato"]:
            # Wallin / Hyre Severity Criteria for Late Blight (Phytophthora infestans)
            # Optimal: RH >= 90% and Temp between 15°C and 22°C
            blight_hours = sum(1 for t, r in zip(temps, rhs) if 15.0 <= t <= 22.0 and r >= 90.0)

            if blight_hours >= 10 or max_consecutive_wet >= 12:
                risk_score = min(100.0, 60.0 + (blight_hours * 4.0))
            elif blight_hours >= 5 or max_consecutive_wet >= 8:
                risk_score = 40.0 + (blight_hours * 3.5)
            else:
                risk_score = max(10.0, (avg_rh * 0.3) + (blight_hours * 2.0))

            primary_threat = "Late Blight (Phytophthora infestans)"

        elif crop == "rice":
            # IRRI Criteria for Rice Blast (Magnaporthe oryzae)
            # Optimal: RH >= 92% and Temp between 24°C and 28°C
            blast_hours = sum(1 for t, r in zip(temps, rhs) if 24.0 <= t <= 28.0 and r >= 90.0)

            if blast_hours >= 8 or max_consecutive_wet >= 10:
                risk_score = min(100.0, 65.0 + (blast_hours * 4.5))
            elif blast_hours >= 4:
                risk_score = 45.0 + (blast_hours * 3.5)
            else:
                risk_score = max(10.0, (avg_rh * 0.25) + (blast_hours * 2.5))

            primary_threat = "Rice Blast (Magnaporthe oryzae)"

        else:
            return {"error": f"Crop '{crop}' not supported. Choose tomato, potato, or rice."}

        risk_score = round(min(100.0, max(0.0, risk_score)), 1)

        if risk_score >= 70.0:
            alert_level = "CRITICAL (HIGH)"
        elif risk_score >= 40.0:
            alert_level = "MODERATE"
        else:
            alert_level = "LOW"

        return {
            "crop": crop.capitalize(),
            "location": {"latitude": self.lat, "longitude": self.lon},
            "risk_score_percent": risk_score,
            "alert_level": alert_level,
            "primary_threat": primary_threat,
            "metrics": {
                "avg_temperature_c": round(avg_temp, 1),
                "avg_relative_humidity": round(avg_rh, 1),
                "max_rain_probability": max_rain_prob,
                "consecutive_wet_hours": max_consecutive_wet
            }
        }

if __name__ == "__main__":
    # Test execution for Tomato and Rice
    engine = CropRiskEngine(lat=12.9716, lon=77.5946)
    for c in ["tomato", "rice"]:
        report = engine.evaluate_risk(c)
        print(json.dumps(report, indent=4))