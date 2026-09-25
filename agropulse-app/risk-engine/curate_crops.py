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

# Clean destination split directories if re-curating
if train_dir.exists():
    shutil.rmtree(train_dir)
if val_dir.exists():
    shutil.rmtree(val_dir)

train_dir.mkdir(parents=True, exist_ok=True)
val_dir.mkdir(parents=True, exist_ok=True)

class_sources = {}

# 1. Check extracted_test_vectors or test vector archives
extracted_root = BASE_DIR / "extracted_test_vectors"
if extracted_root.is_dir():
    # Rice classes
    rice_blb = extracted_root / "rice" / "rice_leaf_diseases" / "Bacterial leaf blight"
    rice_brown = extracted_root / "rice" / "rice_leaf_diseases" / "Brown spot"
    rice_smut = extracted_root / "rice" / "rice_leaf_diseases" / "Leaf smut"
    if rice_blb.is_dir(): class_sources["Rice___Bacterial_leaf_blight"] = rice_blb
    if rice_brown.is_dir(): class_sources["Rice___Brown_spot"] = rice_brown
    if rice_smut.is_dir(): class_sources["Rice___Leaf_smut"] = rice_smut

    # Banana classes
    banana_root = extracted_root / "banana" / "BananaLSD" / "OriginalSet"
    if banana_root.is_dir():
        for b_dir in banana_root.iterdir():
            if b_dir.is_dir():
                clean_name = f"Banana___{b_dir.name.capitalize()}"
                class_sources[clean_name] = b_dir

    # Coconut classes
    coconut_root = extracted_root / "coconut" / "coconut_dicease_dataset"
    if coconut_root.is_dir():
        for c_dir in coconut_root.iterdir():
            if c_dir.is_dir():
                clean_name = f"Coconut___{c_dir.name}"
                class_sources[clean_name] = c_dir

    # Sugarcane classes
    sugarcane_root = extracted_root / "sugarcane"
    if sugarcane_root.is_dir():
        for s_dir in sugarcane_root.iterdir():
            if s_dir.is_dir():
                clean_name = f"Sugarcane___{s_dir.name}"
                class_sources[clean_name] = s_dir

    # Out-Of-Distribution Non-Leaf Background rejection class
    bg_root = extracted_root / "background" / "non_leaf"
    if bg_root.is_dir():
        class_sources["Background_without_leaves"] = bg_root

# 2. Check traditional PlantVillage paths if present
for p in BASE_DIR.glob("raw_plantvillage/**/Tomato*"):
    if p.is_dir():
        class_sources[p.name] = p

for p in BASE_DIR.glob("raw_plantvillage/**/Potato*"):
    if p.is_dir():
        class_sources[p.name] = p

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
    images = sorted(
        (img for img in src_folder.iterdir() if img.suffix.lower() in valid_extensions),
        key=lambda path: path.name,
    )
    if not images:
        continue

    random.shuffle(images)
    split_idx = max(1, min(len(images) - 1, int(len(images) * 0.80)))
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

# 4. Generate class_mapping.json
classes_sorted = sorted(list(class_sources.keys()))
class_to_idx = {name: idx for idx, name in enumerate(classes_sorted)}
idx_to_class = {idx: name for idx, name in enumerate(classes_sorted)}

with open(DEST_DIR / "class_mapping.json", "w") as f:
    json.dump({"idx_to_class": idx_to_class, "class_to_idx": class_to_idx}, f, indent=4)

print(f"\n[DONE] Dataset curated at: {DEST_DIR.resolve()}")
print(f"[DONE] class_mapping.json created successfully with {len(classes_sorted)} classes.")