"""AgroPulse Hierarchical Crop & Pathology Smart Inference Engine

Features:
1. Dual-Task Recognition: Autonomous Crop Detection + Disease Pathology Detection
2. Crop-Conditioned Prior & Cross-Validation: Validates user-provided crop against visual leaf morphology (guards against user crop mismatch)
3. Non-Leaf / Out-Of-Distribution (OOD) Rejection (resolves BUG-01)
4. Calibrated Confidence & Shannon Entropy Uncertainty Estimation
5. Real-Time Optical Quality Pre-Check (Luminosity, Glare, Blurry captures)
6. Microclimate Bayesian Prior Fusion
7. Top-5 Ranked Diagnostic Differential Distribution
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
from typing import Dict, Any, Optional, List

import numpy as np
from PIL import Image
import tensorflow as tf


def extract_crop_name(class_name: str) -> str:
    if "Background" in class_name or "non_leaf" in class_name.lower():
        return "Non-Crop"
    if "___" in class_name:
        return class_name.split("___")[0]
    return "Unknown"


def extract_condition_name(class_name: str) -> str:
    if "___" in class_name:
        return class_name.split("___")[1].replace("_", " ")
    return class_name.replace("_", " ")


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

        # Build hierarchical crop domains
        self.crop_to_indices: Dict[str, List[int]] = {}
        for idx_str, c_name in self.idx_to_class.items():
            crop = extract_crop_name(c_name)
            if crop not in self.crop_to_indices:
                self.crop_to_indices[crop] = []
            self.crop_to_indices[crop].append(int(idx_str))

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
        input_crop: Optional[str] = None,
        weather_risk_score: Optional[float] = None,
    ) -> Dict[str, Any]:
        # 1. Load image
        if isinstance(image_input, (str, Path)):
            img = Image.open(image_input).convert("RGB")
        else:
            img = image_input.convert("RGB")

        # 2. Quality check
        quality = self.check_image_quality(img)
        if not quality["valid"]:
            return {
                "status": "REJECTED_QUALITY",
                "message": quality["reason"],
                "prediction": None,
                "detected_crop": "Unknown",
                "crop_confidence_percent": 0.0,
            }

        # 3. Preprocessing (224x224 RGB float32)
        resized = img.resize((224, 224))
        input_data = np.expand_dims(np.array(resized, dtype=np.float32), axis=0)

        self.interpreter.set_tensor(self.input_details[0]["index"], input_data)
        self.interpreter.invoke()

        raw_scores = self.interpreter.get_tensor(self.output_details[0]["index"])[0]
        raw_probabilities = np.array(raw_scores, dtype=np.float32)

        # 4. Hierarchical Crop Recognition (Marginal Probability across Crop Domains)
        crop_marginal_probs: Dict[str, float] = {}
        for crop_name, indices in self.crop_to_indices.items():
            crop_marginal_probs[crop_name] = float(np.sum(raw_probabilities[indices]))

        detected_crop = max(crop_marginal_probs, key=crop_marginal_probs.get)
        detected_crop_confidence = crop_marginal_probs[detected_crop] * 100.0

        # Sort crop distribution
        crop_distribution = {
            k: round(v * 100, 1)
            for k, v in sorted(crop_marginal_probs.items(), key=lambda item: item[1], reverse=True)
        }

        # 5. BUG-01 Non-Leaf Out-Of-Distribution Rejection
        if detected_crop == "Non-Crop" or "Background" in self.idx_to_class[str(np.argmax(raw_probabilities))]:
            entropy = self.compute_entropy(raw_probabilities)
            return {
                "status": "REJECTED_NON_LEAF",
                "message": "Invalid capture: No crop leaf detected. Center a crop leaf inside viewfinder.",
                "detected_crop": "Non-Crop Object",
                "crop_confidence_percent": round(detected_crop_confidence, 1),
                "crop_distribution": crop_distribution,
                "confidence": round(float(np.max(raw_probabilities)) * 100, 1),
                "entropy": round(entropy, 2),
                "prediction": None,
            }

        # 6. User Crop Input Conditioning & Cross-Validation
        crop_verification = "AUTONOMOUS_DETECTION"
        mismatch_warning = None
        probabilities = raw_probabilities.copy()

        if input_crop and input_crop.strip().lower() not in {"auto", "all", "none", ""}:
            normalized_input_crop = input_crop.strip().capitalize()
            # Match crop names (e.g. "Rice", "Banana", "Sugarcane", "Coconut")
            matched_crop_domain = next(
                (c for c in self.crop_to_indices if c.lower() == normalized_input_crop.lower()),
                None
            )

            if matched_crop_domain:
                if detected_crop.lower() != matched_crop_domain.lower() and detected_crop_confidence > 60.0:
                    crop_verification = "CROP_MISMATCH_DETECTED"
                    mismatch_warning = (
                        f"You indicated '{normalized_input_crop}', but visual leaf morphology strongly identifies "
                        f"'{detected_crop}' ({detected_crop_confidence:.1f}% confidence). Proceed with caution."
                    )
                else:
                    crop_verification = "VERIFIED_MATCH"
                    # Apply Bayesian conditioning to refine disease probabilities within the confirmed crop domain
                    indices = self.crop_to_indices[matched_crop_domain]
                    domain_sum = np.sum(probabilities[indices])
                    if domain_sum > 1e-6:
                        conditioned = np.zeros_like(probabilities)
                        conditioned[indices] = probabilities[indices] / domain_sum
                        # Blend conditioned (75%) with unconditioned (25%) for stability
                        probabilities = (0.75 * conditioned) + (0.25 * probabilities)
                        probabilities = probabilities / np.sum(probabilities)

        # 7. Shannon Entropy Uncertainty Check
        entropy = self.compute_entropy(probabilities)

        # 8. Top Diagnosis Candidates
        sorted_indices = np.argsort(probabilities)[::-1]
        top_idx = int(sorted_indices[0])
        top_class = self.idx_to_class[str(top_idx)]
        top_confidence = float(probabilities[top_idx])

        is_uncertain = top_confidence < self.min_confidence or entropy > self.max_entropy

        # 9. Microclimate Prior Bayesian Fusion
        fused_threat_level = "NORMAL"
        weather_note = ""
        if weather_risk_score is not None:
            if weather_risk_score >= 70.0 and ("blight" in top_class.lower() or "rot" in top_class.lower()):
                fused_threat_level = "ELEVATED_EPIDEMIOLOGICAL_RISK"
                weather_note = "High humidity and temperature match pathogen sporulation window."
            elif weather_risk_score < 30.0 and "blight" in top_class.lower():
                weather_note = "Visual match found, but current microclimate disfavors rapid fungal spread."

        top_differential = []
        for i in range(min(5, len(sorted_indices))):
            idx = int(sorted_indices[i])
            c_name = self.idx_to_class[str(idx)]
            if "Background" not in c_name:
                top_differential.append({
                    "class_name": c_name,
                    "crop": extract_crop_name(c_name),
                    "condition": extract_condition_name(c_name),
                    "confidence_percent": round(float(probabilities[idx]) * 100, 1),
                })

        return {
            "status": "DIAGNOSIS_UNCERTAIN" if is_uncertain else "DIAGNOSIS_CONFIRMED",
            "detected_crop": detected_crop,
            "crop_confidence_percent": round(detected_crop_confidence, 1),
            "crop_distribution": crop_distribution,
            "crop_verification": crop_verification,
            "mismatch_warning": mismatch_warning,
            "class_name": top_class,
            "condition_name": extract_condition_name(top_class),
            "confidence_percent": round(top_confidence * 100, 1),
            "uncertainty_entropy": round(entropy, 2),
            "quality": quality,
            "fused_threat_level": fused_threat_level,
            "weather_correlation": weather_note,
            "top_differential": top_differential,
            "requires_human_escalation": is_uncertain,
        }


if __name__ == "__main__":
    engine = SmartCropDiagnosticEngine()
    test_img = sys.argv[1] if len(sys.argv) > 1 else "extracted_test_vectors/rice/rice_leaf_diseases/Bacterial leaf blight/DSC_0365.JPG"
    input_crop_arg = sys.argv[2] if len(sys.argv) > 2 else "Sugarcane"  # Intentionally test mismatch
    result = engine.predict(test_img, input_crop=input_crop_arg, weather_risk_score=78.5)
    print(json.dumps(result, indent=2))
