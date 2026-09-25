import os
import shutil
import json
import random
from pathlib import Path

# Fix seed for reproducible splits
random.seed(42)

BASE_DIR = Path(".")
DEST_DIR = BASE_DIR / "curated_dataset"

train_dir = DEST_DIR / "train"
val_dir = DEST_DIR / "val"
train_dir.mkdir(parents=True, exist_ok=True)
val_dir.mkdir(parents=True, exist_ok=True)

class_sources = {}

# 1. Filter Tomato and Potato from PlantVillage
for p in BASE_DIR.glob("raw_plantvillage/**/Tomato*"):
    if p.is_dir():
        class_sources[p.name] = p

for p in BASE_DIR.glob("raw_plantvillage/**/Potato*"):
    if p.is_dir():
        class_sources[p.name] = p

# 2. Filter Rice classes
for p in BASE_DIR.glob("raw_rice/**"):
    if p.is_dir() and any(f.suffix.lower() in [".jpg", ".jpeg", ".png"] for f in p.iterdir()):
        clean_name = f"Rice___{p.name.replace(' ', '_')}"
        class_sources[clean_name] = p

print(f"\n[+] Total target crop classes detected: {len(class_sources)}")
for k in sorted(class_sources.keys()):
    print(f"  - {k}")

# 3. Create 80/20 Train/Validation Split using pure Python
valid_extensions = {".jpg", ".jpeg", ".png"}

for class_name, src_folder in class_sources.items():
    images = [img for img in src_folder.iterdir() if img.suffix.lower() in valid_extensions]
    if not images:
        continue

    random.shuffle(images)
    split_idx = int(len(images) * 0.80)
    train_files = images[:split_idx]
    val_files = images[split_idx:]

    target_train = train_dir / class_name
    target_val = val_dir / class_name
    target_train.mkdir(parents=True, exist_ok=True)
    target_val.mkdir(parents=True, exist_ok=True)

    for f in train_files:
        shutil.copy2(f, target_train / f.name)
    for f in val_files:
        shutil.copy2(f, target_val / f.name)

    print(f"Processed {class_name}: {len(train_files)} train, {len(val_files)} val")

# 4. Generate class_mapping.json for Visweshwara
classes_sorted = sorted(list(class_sources.keys()))
class_to_idx = {name: idx for idx, name in enumerate(classes_sorted)}
idx_to_class = {idx: name for idx, name in enumerate(classes_sorted)}

with open(DEST_DIR / "class_mapping.json", "w") as f:
    json.dump({"idx_to_class": idx_to_class, "class_to_idx": class_to_idx}, f, indent=4)

print(f"\n[DONE] Dataset curated at: {DEST_DIR.resolve()}")
print(f"[DONE] class_mapping.json created successfully.")