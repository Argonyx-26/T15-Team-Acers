"""Train and export the AgroPulse Hierarchical Crop & Pathology Recognition Model.

Features:
1. Dual-Task Recognition: Autonomous Crop Detection + Disease Pathology Detection
2. Out-of-Distribution (OOD) Non-Leaf Rejection (Background_without_leaves) to resolve BUG-01
3. Class-Balanced Loss Weighting for minority classes (Coconut, Rice) vs majority (Sugarcane, Banana)
4. Two-Stage Fine-Tuning: Stage 1 (Frozen base + Head) + Stage 2 (MobileNetV2 unfreeze from layer 100)
5. Robust Data Augmentation (Rotation, Zoom, Contrast, Brightness, Flip)
6. Dynamic Learning Rate Scheduling with ReduceLROnPlateau
7. Hierarchical Crop Mapping export for Bayesian Crop-Conditioned Inference
8. Optimized Float32 Mobile Quantization (TFLite)
"""

from __future__ import annotations

import argparse
import json
import math
import os
from pathlib import Path
from typing import Dict, List, Tuple

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

import numpy as np
import tensorflow as tf

IMAGE_SIZE = (224, 224)
DEFAULT_BATCH_SIZE = 32
DEFAULT_EPOCHS = 16
SEED = 42


def load_class_names(mapping_path: Path) -> list[str]:
    mapping = json.loads(mapping_path.read_text())
    names = [mapping["idx_to_class"][str(index)] for index in range(len(mapping["idx_to_class"]))]
    print(f"[+] Loaded {len(names)} classes from {mapping_path}")
    return names


def get_crop_from_class(class_name: str) -> str:
    if "Background" in class_name or "non_leaf" in class_name.lower():
        return "Non-Crop"
    if "___" in class_name:
        return class_name.split("___")[0]
    return "Unknown"


def compute_class_weights(dataset_root: Path, class_names: list[str]) -> Dict[int, float]:
    """Compute smoothed inverse-frequency weights to balance minority crops."""
    train_dir = dataset_root / "train"
    counts = []
    for c in class_names:
        c_dir = train_dir / c
        if c_dir.is_dir():
            n = sum(1 for p in c_dir.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"})
            counts.append(max(1, n))
        else:
            counts.append(1)

    total = sum(counts)
    K = len(class_names)
    weights = {}
    print("\n--- Balanced Class Weights ---")
    for i, (c, count) in enumerate(zip(class_names, counts)):
        # Square root smoothed inverse frequency
        w = float(round((total / (K * count)) ** 0.5, 3))
        weights[i] = w
        print(f"  [{i:>2}] {c:<30} (n={count:>3}) -> weight: {w:.3f}")
    return weights


def make_datasets(dataset_root: Path, class_names: list[str], batch_size: int):
    common = {
        "labels": "inferred",
        "label_mode": "categorical",
        "class_names": class_names,
        "image_size": IMAGE_SIZE,
        "batch_size": batch_size,
        "seed": SEED,
    }
    train = tf.keras.utils.image_dataset_from_directory(dataset_root / "train", shuffle=True, **common)
    validation = tf.keras.utils.image_dataset_from_directory(dataset_root / "val", shuffle=False, **common)
    autotune = tf.data.AUTOTUNE
    return train.prefetch(autotune), validation.prefetch(autotune)


def build_model(class_count: int) -> tuple[tf.keras.Model, tf.keras.Model]:
    augmentation = tf.keras.Sequential(
        [
            tf.keras.layers.RandomFlip("horizontal_and_vertical"),
            tf.keras.layers.RandomRotation(0.15),
            tf.keras.layers.RandomZoom(0.15),
            tf.keras.layers.RandomContrast(0.15),
            tf.keras.layers.RandomTranslation(0.08, 0.08),
        ],
        name="agronomic_augmentation",
    )
    base = tf.keras.applications.MobileNetV2(
        input_shape=(*IMAGE_SIZE, 3),
        include_top=False,
        weights="imagenet",
    )
    base.trainable = False

    inputs = tf.keras.Input(shape=(*IMAGE_SIZE, 3), name="image")
    x = augmentation(inputs)
    x = tf.keras.layers.Rescaling(1.0 / 127.5, offset=-1)(x)
    x = base(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dropout(0.35)(x)
    x = tf.keras.layers.Dense(192, activation="relu", kernel_regularizer=tf.keras.regularizers.l2(1e-4))(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dropout(0.25)(x)
    outputs = tf.keras.layers.Dense(class_count, activation="softmax", name="scores")(x)

    model = tf.keras.Model(inputs, outputs, name="agropulse_hierarchical_classifier")
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.08),
        metrics=["accuracy"],
    )
    return model, base


def export_tflite(model: tf.keras.Model, output_path: Path) -> None:
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    model_bytes = converter.convert()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(model_bytes)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", type=Path, default=Path("curated_dataset"))
    parser.add_argument("--output", type=Path, default=Path("artifacts"))
    parser.add_argument("--epochs", type=int, default=DEFAULT_EPOCHS)
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE)
    args = parser.parse_args()

    mapping_path = args.dataset / "class_mapping.json"
    class_names = load_class_names(mapping_path)
    class_weights = compute_class_weights(args.dataset, class_names)
    train, validation = make_datasets(args.dataset, class_names, args.batch_size)

    args.output.mkdir(parents=True, exist_ok=True)
    stage1_epochs = max(4, int(args.epochs * 0.4))
    stage2_epochs = max(4, args.epochs - stage1_epochs)

    # Build crop-to-class mapping dictionary
    crop_mapping = {}
    for idx, c_name in enumerate(class_names):
        crop = get_crop_from_class(c_name)
        if crop not in crop_mapping:
            crop_mapping[crop] = []
        crop_mapping[crop].append({"class_name": c_name, "class_index": idx})

    print(f"\n[+] Active Crop Domains: {list(crop_mapping.keys())}")
    (args.output / "crop_hierarchy.json").write_text(json.dumps(crop_mapping, indent=2))

    print(f"\n[+] Initializing MobileNetV2 with {len(class_names)} target pathologies...")
    model, base = build_model(len(class_names))

    # --- STAGE 1: Feature Extraction (Classification Head) ---
    print(f"\n--- STAGE 1: Training Classification Head ({stage1_epochs} epochs, lr=1e-3) ---")
    callbacks_stage1 = [
        tf.keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=4, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=2, min_lr=1e-5),
        tf.keras.callbacks.ModelCheckpoint(args.output / "best.keras", monitor="val_accuracy", save_best_only=True),
    ]
    model.fit(
        train,
        validation_data=validation,
        epochs=stage1_epochs,
        class_weight=class_weights,
        callbacks=callbacks_stage1
    )

    # --- STAGE 2: Deep Convolutional Fine-Tuning ---
    print(f"\n--- STAGE 2: Deep Convolutional Fine-Tuning ({stage2_epochs} epochs, lr=4e-5) ---")
    base.trainable = True
    # Unfreeze top layers from layer 95 onward for richer leaf texture adaptation
    for layer in base.layers[:95]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=4e-5),
        loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.08),
        metrics=["accuracy"],
    )
    callbacks_stage2 = [
        tf.keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=4, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=2, min_lr=5e-6),
        tf.keras.callbacks.ModelCheckpoint(args.output / "best.keras", monitor="val_accuracy", save_best_only=True),
    ]
    model.fit(
        train,
        validation_data=validation,
        epochs=stage2_epochs,
        class_weight=class_weights,
        callbacks=callbacks_stage2
    )

    # --- EVALUATION & EXPORT ---
    print("\n--- Final Model Evaluation on Validation Set ---")
    metrics = model.evaluate(validation, return_dict=True)
    val_acc = metrics["accuracy"] * 100
    val_loss = metrics["loss"]
    print(f"Final Validation Accuracy: {val_acc:.2f}% | Loss: {val_loss:.4f}")

    tflite_path = args.output / "agropulse_leaf_classifier.tflite"
    print(f"\n[+] Quantizing and exporting TFLite model to {tflite_path}...")
    export_tflite(model, tflite_path)

    # Save preprocessing and crop hierarchy metadata
    (args.output / "training_metrics.json").write_text(json.dumps(metrics, indent=2))
    (args.output / "preprocessing.json").write_text(json.dumps({
        "input_size": list(IMAGE_SIZE),
        "color_order": "RGB",
        "input_dtype": "float32",
        "normalization": "pixel / 127.5 - 1",
        "output": "softmax scores in class_mapping.json order",
        "num_classes": len(class_names),
        "crop_domains": list(crop_mapping.keys()),
        "crop_hierarchy": crop_mapping,
        "ood_rejection_class": "Background_without_leaves",
        "recommended_min_confidence": 0.65,
        "entropy_uncertainty_threshold": 1.75
    }, indent=2) + "\n")

    print(f"\n[DONE] Hierarchical Crop AI Model Exported: {tflite_path}")


if __name__ == "__main__":
    main()
