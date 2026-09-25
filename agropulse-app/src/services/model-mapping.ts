export const MODEL_CLASS_LABELS = [
  'Background_without_leaves',
  'Banana___Cordana',
  'Banana___Healthy',
  'Banana___Pestalotiopsis',
  'Banana___Sigatoka',
  'Coconut___Healthy',
  'Coconut___Leaf_Spot',
  'Coconut___Pest_Damage',
  'Coconut___Yellowing',
  'Rice___Bacterial_leaf_blight',
  'Rice___Brown_spot',
  'Rice___Leaf_smut',
  'Sugarcane___Healthy',
  'Sugarcane___Mosaic',
  'Sugarcane___RedRot',
  'Sugarcane___Rust',
  'Sugarcane___Yellow',
] as const;

export type ModelClassLabel = (typeof MODEL_CLASS_LABELS)[number];

export type ModelPrediction = {
  classIndex: number;
  label: ModelClassLabel;
  confidence: number;
  isNonLeaf?: boolean;
};

const ADVISORY_KEY_BY_LABEL: Record<ModelClassLabel, string> = {
  Background_without_leaves: 'invalid_capture',
  Banana___Cordana: 'banana_cordana',
  Banana___Healthy: 'healthy',
  Banana___Pestalotiopsis: 'banana_pestalotiopsis',
  Banana___Sigatoka: 'banana_sigatoka',
  Coconut___Healthy: 'healthy',
  Coconut___Leaf_Spot: 'coconut_leaf_spot',
  Coconut___Pest_Damage: 'coconut_pest_damage',
  Coconut___Yellowing: 'coconut_yellowing',
  Rice___Bacterial_leaf_blight: 'rice_bacterial_leaf_blight',
  Rice___Brown_spot: 'rice_brown_spot',
  Rice___Leaf_smut: 'rice_leaf_smut',
  Sugarcane___Healthy: 'healthy',
  Sugarcane___Mosaic: 'sugarcane_mosaic',
  Sugarcane___RedRot: 'sugarcane_red_rot',
  Sugarcane___Rust: 'sugarcane_rust',
  Sugarcane___Yellow: 'sugarcane_yellow',
};

export function pickTopPrediction(scores: number[]): ModelPrediction | null {
  if (scores.length !== MODEL_CLASS_LABELS.length) return null;
  const classIndex = scores.reduce((bestIndex, score, index) => score > scores[bestIndex] ? index : bestIndex, 0);
  const rawConfidence = scores[classIndex];
  const label = MODEL_CLASS_LABELS[classIndex];
  return {
    classIndex,
    label,
    confidence: Math.max(0, Math.min(1, rawConfidence)),
    isNonLeaf: label === 'Background_without_leaves',
  };
}

export function resolveAdvisoryKey(label: ModelClassLabel): string | null {
  return ADVISORY_KEY_BY_LABEL[label] ?? null;
}

export function isAdvisoryReady(label: ModelClassLabel, availableKeys: readonly string[]): boolean {
  const advisoryKey = resolveAdvisoryKey(label);
  return advisoryKey !== null && availableKeys.includes(advisoryKey);
}