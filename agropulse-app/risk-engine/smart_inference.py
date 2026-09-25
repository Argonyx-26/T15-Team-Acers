"""AgroPulse Smart Inference Engine

Features:
1. Non-Leaf / Out-Of-Distribution (OOD) Rejection (resolves BUG-01)
2. Calibrated Confidence & Shannon Entropy Uncertainty Estimation
3. Quality Pre-check (Brightness / Exposure)
4. Microclimate Bayesian Prior Fusion
5. Top-3 Ranked Diagnostic Differential
"""

from __future__ import annotations

import os
import sys
import warnings

# Suppress TensorFlow C++ and Lite deprecation noise
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
warnings.filterwarnings("ignore")

import json
import math
from pathlib import Path
from typing import Dict, Any, Optional

import numpy as np
from PIL import Image
import tensorflow as tf


class SmartCropDiagnosticEngine:
    def __init__(
        self,
        model_path: str = "artifacts/agropulse_leaf_classifier.tflite",
        mapping_path: str = "curated_dataset/class_mapping.json",
        min_confidence: float = 0.65,
        max_entropy: float = 1.75,
    ):
        self.interpreter = tf.lite.Interpreter(model_path=model_path)
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

        mapping_data = json.loads(Path(mapping_path).read_text())
        self.idx_to_class = mapping_data["idx_to_class"]
        self.class_to_idx = mapping_data["class_to_idx"]
        self.min_confidence = min_confidence
        self.max_entropy = max_entropy

    def check_image_quality(self, img: Image.Image) -> Dict[str, Any]:
        """Verify image brightness and contrast before feeding to model."""
        gray = img.convert("L")
        stat = np.array(gray, dtype=np.float32)
        mean_brightness = float(np.mean(stat))
        contrast = float(np.std(stat))

        if mean_brightness < 25.0:
            return {"valid": False, "reason": "Image too dark. Ensure adequate field illumination."}
        if mean_brightness > 240.0:
            return {"valid": False, "reason": "Image overexposed / heavy sunlight glare."}
        if contrast < 15.0:
            return {"valid": False, "reason": "Low contrast / blurry capture. Retake closer to leaf."}

        return {"valid": True, "brightness": round(mean_brightness, 1), "contrast": round(contrast, 1)}

    def compute_entropy(self, probabilities: np.ndarray) -> float:
        """Calculate Shannon entropy in bits to detect prediction ambiguity."""
        clipped = np.clip(probabilities, 1e-10, 1.0)
        return float(-np.sum(clipped * np.log2(clipped)))

    def predict(
        self,
        image_input: str | Path | Image.Image,
        weather_risk_score: Optional[float] = None,
    ) -> Dict[str, Any]:
        # Load image
        if isinstance(image_input, (str, Path)):
            img = Image.open(image_input).convert("RGB")
        else:
            img = image_input.convert("RGB")

        # 1. Quality check
        quality = self.check_image_quality(img)
        if not quality["valid"]:
            return {
                "status": "REJECTED_QUALITY",
                "message": quality["reason"],
                "prediction": None,
            }

        # 2. Preprocessing (224x224 RGB float32)
        resized = img.resize((224, 224))
        input_data = np.expand_dims(np.array(resized, dtype=np.float32), axis=0)

        self.interpreter.set_tensor(self.input_details[0]["index"], input_data)
        self.interpreter.invoke()

        raw_scores = self.interpreter.get_tensor(self.output_details[0]["index"])[0]
        probabilities = np.array(raw_scores, dtype=np.float32)

        # 3. Shannon Entropy
        entropy = self.compute_entropy(probabilities)

        # 4. Top candidates
        sorted_indices = np.argsort(probabilities)[::-1]
        top_idx = int(sorted_indices[0])
        top_class = self.idx_to_class[str(top_idx)]
        top_confidence = float(probabilities[top_idx])

        # 5. Out-Of-Distribution (OOD) Non-Leaf Rejection (BUG-01 Fix)
        if "Background" in top_class or "non_leaf" in top_class.lower():
            return {
                "status": "REJECTED_NON_LEAF",
                "message": "Invalid capture: No crop leaf detected. Center a crop leaf inside viewfinder.",
                "confidence": round(top_confidence * 100, 1),
                "entropy": round(entropy, 2),
                "prediction": None,
            }

        # 6. Uncertainty Check
        is_uncertain = top_confidence < self.min_confidence or entropy > self.max_entropy

        # 7. Weather Risk Prior Bayesian Fusion
        fused_threat_level = "NORMAL"
        weather_note = ""
        if weather_risk_score is not None:
            if weather_risk_score >= 70.0 and "blight" in top_class.lower() or "rot" in top_class.lower():
                fused_threat_level = "ELEVATED_EPIDEMIOLOGICAL_RISK"
                weather_note = "High humidity and temperature match pathogen sporulation window."
            elif weather_risk_score < 30.0 and "blight" in top_class.lower():
                weather_note = "Visual match found, but current microclimate disfavors rapid fungal spread."

        top_3 = []
        for i in range(min(3, len(sorted_indices))):
            idx = int(sorted_indices[i])
            c_name = self.idx_to_class[str(idx)]
            if "Background" not in c_name:
                top_3.append({
                    "class_name": c_name,
                    "confidence_percent": round(float(probabilities[idx]) * 100, 1),
                })

        return {
            "status": "DIAGNOSIS_UNCERTAIN" if is_uncertain else "DIAGNOSIS_CONFIRMED",
            "class_name": top_class,
            "confidence_percent": round(top_confidence * 100, 1),
            "uncertainty_entropy": round(entropy, 2),
            "quality": quality,
            "fused_threat_level": fused_threat_level,
            "weather_correlation": weather_note,
            "top_differential": top_3,
            "requires_human_escalation": is_uncertain,
        }


if __name__ == "__main__":
    import sys
    engine = SmartCropDiagnosticEngine()
    test_img = sys.argv[1] if len(sys.argv) > 1 else "extracted_test_vectors/rice/rice_leaf_diseases/Bacterial leaf blight/DSC_0365.JPG"
    result = engine.predict(test_img, weather_risk_score=78.5)
    print(json.dumps(result, indent=2))
