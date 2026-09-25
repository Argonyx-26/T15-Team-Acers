# AgroPulse model training

The training contract is a 16-class leaf classifier using the labels in
`curated_dataset/class_mapping.json`. The pipeline trains an ImageNet-backed
MobileNetV2 classifier and exports:

- `artifacts/agropulse_leaf_classifier.tflite`
- `artifacts/best.keras`
- `artifacts/training_metrics.json`
- `artifacts/preprocessing.json`

Use Python 3.11 or 3.12. TensorFlow does not currently provide the required
training wheels for Python 3.14.

## Dataset layout

Place the source datasets under `risk-engine/`:

```text
raw_plantvillage/
  Tomato___...
  Potato___...
raw_rice/
  ...
```

Then create the deterministic train/validation split:

```bash
cd agropulse-app/risk-engine
python3 curate_crops.py
```

Start training from the repository root:

```bash
./train-model.sh --epochs 15
```

The model input is RGB `224x224` float32 normalized with `pixel / 127.5 - 1`.
The output is a 16-value softmax vector in the mapping JSON order.
