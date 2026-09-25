import os
import shutil
import json
import random
from pathlib import Path

random.seed(42)

BASE_DIR = Path(".")
DEST_DIR = BASE_DIR / "curated_dataset"

train_dir = DEST_DIR / "train"
val_dir = DEST_DIR / "val"
train_dir.mkdir(parents=True, exist_ok=True)
val_dir.mkdir(parents=True, exist_ok=True)

class_sources = {}

# 1. Tomato & Potato (PlantVillage)
for p in BASE_DIR.glob("raw_plantvillage/**/Tomato*"):
    if p.is_dir(): class_sources[p.name] = p
for p in BASE_DIR.glob("raw_plantvillage/**/Potato*"):
    if p.is_dir(): class_sources[p.name] = p

# 2. Rice
for p in BASE_DIR.glob("raw_rice/**"):
    if p.is_dir() and any(f.suffix.lower() in [".jpg", ".jpeg", ".png"] for f in p.iterdir()):
        class_sources[f"Rice___{p.name.replace(' ', '_')}"] = p

# 3. Sugarcane
for p in BASE_DIR.glob("raw_sugarcane/**"):
    if p.is_dir() and any(f.suffix.lower() in [".jpg", ".jpeg", ".png"] for f in p.iterdir()) and p.name != "raw_sugarcane":
        class_sources[f"Sugarcane___{p.name.replace(' ', '_')}"] = p

# 4. Banana
for p in BASE_DIR.glob("raw_banana/**"):
    if p.is_dir() and any(f.suffix.lower() in [".jpg", ".jpeg", ".png"] for f in p.iterdir()) and p.name not in ["raw_banana", "OriginalSet", "AugmentedSet"]:
        class_sources[f"Banana___{p.name.replace(' ', '_')}"] = p

# 5. Coconut
for p in BASE_DIR.glob("raw_coconut/**"):
    if p.is_dir() and any(f.suffix.lower() in [".jpg", ".jpeg", ".png"] for f in p.iterdir()) and p.name != "raw_coconut":
        class_sources[f"Coconut___{p.name.replace(' ', '_')}"] = p

print(f"\n[+] Total target crop classes detected: {len(class_sources)}")
for k in sorted(class_sources.keys()):
    print(f"  - {k}")

valid_exts = {".jpg", ".jpeg", ".png"}

for class_name, src_folder in class_sources.items():
    images = [img for img in src_folder.iterdir() if img.suffix.lower() in valid_exts]
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

    for f in train_files: shutil.copy2(f, target_train / f.name)
    for f in val_files: shutil.copy2(f, target_val / f.name)

# Export updated class mapping
classes_sorted = sorted(list(class_sources.keys()))
class_to_idx = {name: idx for idx, name in enumerate(classes_sorted)}
idx_to_class = {idx: name for idx, name in enumerate(classes_sorted)}

with open(DEST_DIR / "class_mapping.json", "w") as f:
    json.dump({"idx_to_class": idx_to_class, "class_to_idx": class_to_idx}, f, indent=4)

print(f"\n[SUCCESS] Class mapping updated with {len(classes_sorted)} classes.")