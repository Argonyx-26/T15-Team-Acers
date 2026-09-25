"""Train and export the AgroPulse Smart Leaf Disease & OOD Rejection Model.

Smart Enhancements:
1. Out-of-Distribution (OOD) Non-Leaf Rejection (Background_without_leaves) to fix BUG-01
2. Two-Stage Training: Stage 1 frozen base + Stage 2 top-layer fine-tuning
3. Label Smoothing (0.08) to reduce overconfident misdiagnoses
4. Batch normalization & L2 regularization for stable mobile quantization
5. Quantized TFLite export with dynamic class support
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

import tensorflow as tf


IMAGE_SIZE = (224, 224)
DEFAULT_BATCH_SIZE = 32
DEFAULT_EPOCHS = 10
SEED = 42


def load_class_names(mapping_path: Path) -> list[str]:
    mapping = json.loads(mapping_path.read_text())
    names = [mapping["idx_to_class"][str(index)] for index in range(len(mapping["idx_to_class"]))]
    print(f"Loaded {len(names)} classes from {mapping_path}")
    return names


def validate_dataset(dataset_root: Path, class_names: list[str]) -> None:
    missing = []
    empty = []
    for split in ("train", "val"):
        for class_name in class_names:
            class_dir = dataset_root / split / class_name
            if not class_dir.is_dir():
                missing.append(str(class_dir))
                continue
            image_count = sum(
                1 for path in class_dir.iterdir()
                if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png"}
            )
            if image_count == 0:
                empty.append(str(class_dir))
    if missing or empty:
        details = []
        if missing:
            details.append("missing directories:\n  " + "\n  ".join(missing))
        if empty:
            details.append("empty directories:\n  " + "\n  ".join(empty))
        raise FileNotFoundError(
            "Dataset is incomplete. Run curate_crops.py after placing raw datasets.\n"
            + "\n".join(details)
        )


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
            tf.keras.layers.RandomFlip("horizontal"),
            tf.keras.layers.RandomRotation(0.1),
            tf.keras.layers.RandomZoom(0.1),
            tf.keras.layers.RandomContrast(0.1),
        ],
        name="augmentation",
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
    x = tf.keras.layers.Dropout(0.3)(x)
    x = tf.keras.layers.Dense(128, activation="relu", kernel_regularizer=tf.keras.regularizers.l2(1e-4))(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    outputs = tf.keras.layers.Dense(class_count, activation="softmax", name="scores")(x)

    model = tf.keras.Model(inputs, outputs, name="agropulse_smart_classifier")
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
    validate_dataset(args.dataset, class_names)
    train, validation = make_datasets(args.dataset, class_names, args.batch_size)

    args.output.mkdir(parents=True, exist_ok=True)
    stage1_epochs = max(3, args.epochs // 2)
    stage2_epochs = max(2, args.epochs - stage1_epochs)

    print(f"\n[+] Building Smart MobileNetV2 architecture with {len(class_names)} classes...")
    model, base = build_model(len(class_names))

    # --- STAGE 1: Feature Extraction (Frozen Base) ---
    print(f"\n--- STAGE 1: Training Classification Head ({stage1_epochs} epochs, lr=1e-3) ---")
    callbacks_stage1 = [
        tf.keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=3, restore_best_weights=True),
        tf.keras.callbacks.ModelCheckpoint(
            args.output / "best.keras", monitor="val_accuracy", save_best_only=True
        ),
    ]
    model.fit(train, validation_data=validation, epochs=stage1_epochs, callbacks=callbacks_stage1)

    # --- STAGE 2: Fine-Tuning Top Convolutional Layers ---
    print(f"\n--- STAGE 2: Fine-Tuning MobileNetV2 Top Layers ({stage2_epochs} epochs, lr=3e-5) ---")
    base.trainable = True
    # Freeze the first 110 layers, fine-tune the top 44 layers
    for layer in base.layers[:110]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=3e-5),
        loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.08),
        metrics=["accuracy"],
    )
    callbacks_stage2 = [
        tf.keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=3, restore_best_weights=True),
        tf.keras.callbacks.ModelCheckpoint(
            args.output / "best.keras", monitor="val_accuracy", save_best_only=True
        ),
    ]
    model.fit(train, validation_data=validation, epochs=stage2_epochs, callbacks=callbacks_stage2)

    # --- EVALUATION & EXPORT ---
    print("\n--- Final Model Evaluation on Validation Set ---")
    metrics = model.evaluate(validation, return_dict=True)
    print(f"Validation Accuracy: {metrics['accuracy']*100:.2f}% | Loss: {metrics['loss']:.4f}")

    tflite_path = args.output / "agropulse_leaf_classifier.tflite"
    print(f"\n[+] Quantizing and exporting TFLite model to {tflite_path}...")
    export_tflite(model, tflite_path)

    (args.output / "training_metrics.json").write_text(json.dumps(metrics, indent=2))
    (args.output / "preprocessing.json").write_text(json.dumps({
        "input_size": list(IMAGE_SIZE),
        "color_order": "RGB",
        "input_dtype": "float32",
        "normalization": "pixel / 127.5 - 1",
        "output": "softmax scores in class_mapping.json order",
        "num_classes": len(class_names),
        "ood_rejection_class": "Background_without_leaves" if "Background_without_leaves" in class_names else None,
        "recommended_min_confidence": 0.65,
        "entropy_uncertainty_threshold": 1.75
    }, indent=2) + "\n")

    print(f"\n[DONE] Smart Model Exported Successfully: {tflite_path}")


if __name__ == "__main__":
    main()
