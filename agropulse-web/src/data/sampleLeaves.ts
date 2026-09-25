export interface SampleLeaf {
  id: string;
  title: string;
  crop: 'Tomato' | 'Potato' | 'Rice' | 'Sugarcane' | 'Banana' | 'Coconut';
  modelClass: string;
  description: string;
  expectedConfidence: number;
  sampleType: 'diseased' | 'healthy';
  svgType: 'early_blight' | 'late_blight' | 'blb' | 'healthy' | 'spider_mites' | 'brown_spot';
}

export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-early-blight',
    title: 'Tomato — Early Blight',
    crop: 'Tomato',
    modelClass: 'Tomato___Early_blight',
    description: 'Lower leaf with distinct dark concentric "target" rings and yellowing margin',
    expectedConfidence: 0.94,
    sampleType: 'diseased',
    svgType: 'early_blight',
  },
  {
    id: 'sample-late-blight',
    title: 'Potato — Late Blight',
    crop: 'Potato',
    modelClass: 'Potato___Late_blight',
    description: 'Rapidly spreading dark water-soaked necrotized leaf tip from humid field',
    expectedConfidence: 0.97,
    sampleType: 'diseased',
    svgType: 'late_blight',
  },
  {
    id: 'sample-rice-blb',
    title: 'Rice — Bacterial Leaf Blight',
    crop: 'Rice',
    modelClass: 'Rice___Bacterial_leaf_blight',
    description: 'Elongated bleached straw-colored lesion along leaf margin with wavy boundary',
    expectedConfidence: 0.91,
    sampleType: 'diseased',
    svgType: 'blb',
  },
  {
    id: 'sample-healthy-tomato',
    title: 'Tomato — Healthy Leaf',
    crop: 'Tomato',
    modelClass: 'Tomato___healthy',
    description: 'Uniform deep green foliage, crisp venation, intact leaf margin',
    expectedConfidence: 0.98,
    sampleType: 'healthy',
    svgType: 'healthy',
  },
  {
    id: 'sample-spider-mites',
    title: 'Tomato — Spider Mite Injury',
    crop: 'Tomato',
    modelClass: 'Tomato___Spider_mites Two-spotted_spider_mite',
    description: 'Yellow stippling across blade with fine bronzing on leaf edges',
    expectedConfidence: 0.89,
    sampleType: 'diseased',
    svgType: 'spider_mites',
  },
  {
    id: 'sample-rice-brown-spot',
    title: 'Rice — Brown Spot',
    crop: 'Rice',
    modelClass: 'Rice___Brown_spot',
    description: 'Multiple round-to-oval brown spots with yellow halos scattered on blade',
    expectedConfidence: 0.92,
    sampleType: 'diseased',
    svgType: 'brown_spot',
  },
  {
    id: 'sample-sugarcane-redrot',
    title: 'Sugarcane — Red Rot',
    crop: 'Sugarcane',
    modelClass: 'Sugarcane___RedRot',
    description: 'Third leaf from crown showing yellowing, midrib lesions, and stalk reddening',
    expectedConfidence: 0.96,
    sampleType: 'diseased',
    svgType: 'late_blight',
  },
  {
    id: 'sample-banana-sigatoka',
    title: 'Banana — Sigatoka Leaf Spot',
    crop: 'Banana',
    modelClass: 'Banana___Sigatoka',
    description: 'Elongated dark brown narrow spots with grayish sunken center on banana lamina',
    expectedConfidence: 0.98,
    sampleType: 'diseased',
    svgType: 'early_blight',
  },
];
