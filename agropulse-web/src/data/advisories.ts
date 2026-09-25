export interface AdvisoryItem {
  id: string;
  modelClass: string;
  crop: 'Tomato' | 'Potato' | 'Rice' | 'Chilli' | 'Sugarcane' | 'Banana' | 'Coconut';
  commonName: string;
  scientificOrPathogen: string;
  severity: 'low' | 'medium' | 'high' | 'none';
  symptoms: string;
  immediateAction: string;
  ecoFriendlyAction: string;
  chemicalAction: string;
  activeIngredient: string;
  labelDose: string;
  waterVolumeLPerAcre: number;
  waitingPeriodDays: number | null;
  safetyNotes: string;
  genericAlternative: string;
  verificationStatus: 'ready_for_app' | 'needs_local_verification' | 'source_pending';
  scripts: {
    en: string;
    kn: string;
    hi: string;
  };
}

export const ADVISORIES_MAP: Record<string, AdvisoryItem> = {
  'Tomato___Early_blight': {
    id: 'tomato-early-blight-001',
    modelClass: 'Tomato___Early_blight',
    crop: 'Tomato',
    commonName: 'Tomato Early Blight',
    scientificOrPathogen: 'Alternaria solani',
    severity: 'medium',
    symptoms: 'Concentric brown rings ("target board" pattern) on older lower leaves, progressive yellow halos, and defoliation from ground upwards.',
    immediateAction: 'Prune and destroy severely infected lower leaves. Disinfect shears and avoid touching wet foliage to prevent spore dispersal.',
    ecoFriendlyAction: 'Increase inter-row spacing for airflow, apply Trichoderma viride enriched compost, and avoid overhead sprinkler irrigation.',
    chemicalAction: 'Mancozeb 75% WP or Chlorothalonil 75% WP at early appearance of lesions.',
    activeIngredient: 'Mancozeb 75% WP',
    labelDose: '2.0 g/L (approx. 400-500 g/acre)',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 7,
    safetyNotes: 'Wear chemical-resistant gloves and protective mask. Avoid spraying in direct midday sun or during bee foraging hours.',
    genericAlternative: 'Dithane M-45 / Indofil M-45',
    verificationStatus: 'needs_local_verification',
    scripts: {
      en: 'Your tomato plants show symptoms of Early Blight. Remove heavily spotted lower leaves immediately and avoid working in wet fields. Use registered copper or mancozeb protectants strictly at label dilution.',
      kn: 'ನಿಮ್ಮ ಟೊಮ್ಯಾಟೊ ಗಿಡಗಳಲ್ಲಿ ಆರಂಭಿಕ ಬ್ಲೈಟ್ ರೋಗದ ಲಕ್ಷಣಗಳಿವೆ. ಬಾಧಿತ ಕೆಳಭಾಗದ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ, ಗಾಳಿಯಾಡುವಂತೆ ಮಾಡಿ ಮತ್ತು ಮೇಲಿನಿಂದ ನೀರು ಹಾಕಬೇಡಿ. ಅಗತ್ಯವಿದ್ದರೆ ಶಿಫಾರಸು ಮಾಡಿದ ಔಷಧಿಯನ್ನು ನಿಯಮಿತವಾಗಿ ಸಿಂಪಡಿಸಿ.',
      hi: 'आपके टमाटर के पौधों में अर्ली ब्लाइट रोग के लक्षण हैं। प्रभावित निचली पत्तियों को तुरंत हटा दें और हवा का आवागमन बढ़ाएं। अनुशंसित सुरक्षात्मक फफूंदनाशक का सही मात्रा में छिड़काव करें।'
    }
  },

  'Tomato___Late_blight': {
    id: 'tomato-late-blight-001',
    modelClass: 'Tomato___Late_blight',
    crop: 'Tomato',
    commonName: 'Tomato Late Blight',
    scientificOrPathogen: 'Phytophthora infestans',
    severity: 'high',
    symptoms: 'Water-soaked irregular pale green to dark brown lesions, white cottony mildew under humid conditions on leaf undersides, rapid vine collapse.',
    immediateAction: 'Rogue out infected plants immediately if spotty; suspend all furrow/overhead irrigation. Alert neighboring growers.',
    ecoFriendlyAction: 'Strict sanitation, copper hydroxide prophylactic spray prior to heavy persistent overcast rains.',
    chemicalAction: 'Metalaxyl-M 4% + Mancozeb 64% WP (curative) or Cymoxanil 8% + Mancozeb 64% WP.',
    activeIngredient: 'Metalaxyl-M + Mancozeb',
    labelDose: '2.5 g/L (approx. 500 g/acre)',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 14,
    safetyNotes: 'Full protective equipment required. Prohibited near open water bodies. Ensure a strict 14-day pre-harvest waiting interval.',
    genericAlternative: 'Ridomil Gold 68 WG equivalent',
    verificationStatus: 'needs_local_verification',
    scripts: {
      en: 'High alert: Late Blight detected. Rapid destructive disease under high humidity. Apply systemic fungicide immediately and avoid overhead watering.',
      kn: 'ಎಚ್ಚರಿಕೆ: ತಡವಾದ ಬ್ಲೈಟ್ (ಲೇಟ್ ಬ್ಲೈಟ್) ರೋಗ ಪತ್ತೆಯಾಗಿದೆ. ಇದು ವೇಗವಾಗಿ ಹರಡುತ್ತದೆ. ತಕ್ಷಣ ಸೂಕ್ತ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಸಿಂಪಡಿಸಿ ಮತ್ತು ಜಮೀನಿನಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.',
      hi: 'चेतावनी: लेट ब्लाइट रोग के लक्षण पाए गए हैं। यह बहुत तेजी से फैलता है। तुरंत उचित कवकनाशी का प्रयोग करें और खेत में पानी का जमाव रोकें।'
    }
  },

  'Tomato___Bacterial_spot': {
    id: 'tomato-bacterial-spot-001',
    modelClass: 'Tomato___Bacterial_spot',
    crop: 'Tomato',
    commonName: 'Tomato Bacterial Spot',
    scientificOrPathogen: 'Xanthomonas campestris pv. vesicatoria',
    severity: 'medium',
    symptoms: 'Small water-soaked dark brown spots that become angular with greasy sheen; yellow margins on leaves; scabby fruit spots.',
    immediateAction: 'Avoid entering field when canopy is wet. Remove heavily affected vines and disinfect all harvesting crates.',
    ecoFriendlyAction: 'Seed treatment with hot water (50°C for 25 min) or Pseudomonas fluorescens @ 10g/kg seed. Crop rotation with non-solanaceous crops.',
    chemicalAction: 'Copper Oxychloride 50% WP combined with Streptomycin Sulphate formulation where approved.',
    activeIngredient: 'Copper Oxychloride 50% WP + Streptomycin',
    labelDose: '2.5 g Copper Oxychloride + 0.1 g Streptocycline per litre',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 10,
    safetyNotes: 'Wear goggles and nitrile gloves. Streptomycin use subject to local agricultural department regulations.',
    genericAlternative: 'Blitox 50 WP',
    verificationStatus: 'needs_local_verification',
    scripts: {
      en: 'Bacterial spot observed. Do not handle wet plants. Apply copper-based protectant and maintain field cleanliness.',
      kn: 'ಟೊಮ್ಯಾಟೊ ಬೆಳೆಯಲ್ಲಿ ಬ್ಯಾಕ್ಟೀರಿಯಾದ ಕಲೆ ರೋಗ ಕಂಡುಬಂದಿದೆ. ಒದ್ದೆಯಾಗಿರುವಾಗ ಗಿಡಗಳನ್ನು ಮುಟ್ಟಬೇಡಿ. ತಾಮ್ರಯುಕ್ತ ಔಷಧಿಯನ್ನು ನಿಯಮಾನುಸಾರ ಬಳಸಿ.',
      hi: 'टमाटर में जीवाणु धब्बा रोग के लक्षण हैं। गीले पौधों को न छुएं। कॉपर युक्त दवा का निर्धारित मात्रा में छिड़काव करें।'
    }
  },

  'Tomato___Leaf_Mold': {
    id: 'tomato-leaf-mold-001',
    modelClass: 'Tomato___Leaf_Mold',
    crop: 'Tomato',
    commonName: 'Tomato Leaf Mold',
    scientificOrPathogen: 'Passalora fulva (Cladosporium)',
    severity: 'medium',
    symptoms: 'Pale green to yellowish blotches on upper leaf surfaces; olive-green velvety mold coating on corresponding underside.',
    immediateAction: 'Reduce greenhouse/polyhouse humidity below 80%. Increase horizontal ventilation.',
    ecoFriendlyAction: 'Thin lower leaves to enhance air passage. Ensure dry leaves during nightfall.',
    chemicalAction: 'Chlorothalonil 75% WP or Azoxystrobin 23% SC.',
    activeIngredient: 'Chlorothalonil 75% WP',
    labelDose: '2.0 g/L',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 7,
    safetyNotes: 'Use respirators inside covered polyhouses. Wash all spray gear thoroughly.',
    genericAlternative: 'Kavach 75 WP',
    verificationStatus: 'needs_local_verification',
    scripts: {
      en: 'Leaf mold identified. Lower humidity in greenhouse or dense canopies immediately. Spray protective fungicide if spreading.',
      kn: 'ಎಲೆ ಬೂಷ್ಟು ರೋಗ ಕಂಡುಬಂದಿದೆ. ತೋಟದಲ್ಲಿ ಗಾಳಿ ಬೆಳಕು ಚೆನ್ನಾಗಿರುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ. ಲೇಬಲ್ ಸೂಚನೆಯಂತೆ ಔಷಧಿ ಬಳಸಿ.',
      hi: 'पत्ती फफूंद के लक्षण हैं। वायु संचरण में सुधार करें और आवश्यकतानुसार अनुमोदित फफूंदनाशक का प्रयोग करें।'
    }
  },

  'Tomato___Septoria_leaf_spot': {
    id: 'tomato-septoria-leaf-spot-001',
    modelClass: 'Tomato___Septoria_leaf_spot',
    crop: 'Tomato',
    commonName: 'Tomato Septoria Leaf Spot',
    scientificOrPathogen: 'Septoria lycopersici',
    severity: 'medium',
    symptoms: 'Numerous small circular spots (1-3mm) with dark brown margins and sunken gray centers with tiny black speckles (pycnidia).',
    immediateAction: 'Mulch ground around plants to prevent soil splash. Prune out lower leaves touched by soil.',
    ecoFriendlyAction: 'Clean crop residue at harvest; sanitize stakes and trellising cages.',
    chemicalAction: 'Mancozeb 75% WP or Zineb 75% WP.',
    activeIngredient: 'Mancozeb 75% WP',
    labelDose: '2.0 g/L',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 7,
    safetyNotes: 'Avoid drift to neighboring leafy greens.',
    genericAlternative: 'Indofil M-45',
    verificationStatus: 'needs_local_verification',
    scripts: {
      en: 'Septoria leaf spot detected. Mulch soil to prevent rain splash onto lower foliage. Treat with protectant fungicide.',
      kn: 'ಸೆಪ್ಟೋರಿಯಾ ಎಲೆ ಚುಕ್ಕೆ ರೋಗ ಕಂಡುಬಂದಿದೆ. ಮಣ್ಣಿನ ಸಿಂಪರಣೆಯಿಂದ ರಕ್ಷಿಸಲು ನೆಲಕ್ಕೆ ಹೊದಿಕೆ ಹಾಕಿ.',
      hi: 'सेप्टोरिया पत्ती धब्बा रोग है। जमीन पर मल्चिंग करें ताकि मिट्टी के छींटे पत्तियों पर न पड़ें।'
    }
  },

  'Tomato___Spider_mites Two-spotted_spider_mite': {
    id: 'tomato-spider-mites-001',
    modelClass: 'Tomato___Spider_mites Two-spotted_spider_mite',
    crop: 'Tomato',
    commonName: 'Two-Spotted Spider Mites',
    scientificOrPathogen: 'Tetranychus urticae',
    severity: 'medium',
    symptoms: 'Fine yellow stippling/flecking on upper leaf surfaces, thin delicate webbing on undersides, leaves turn bronze and brittle.',
    immediateAction: 'Wash underside of leaves with forceful clean water jet in localized hot spots to disrupt webbing.',
    ecoFriendlyAction: 'Apply Neem oil (Azadirachtin 10,000 ppm) @ 2-3 mL/L or introduce predatory mites (Phytoseiulus persimilis).',
    chemicalAction: 'Properly rotated Acaricide like Spiromesifen 22.9% SC or Fenpyroximate 5% EC if threshold exceeded.',
    activeIngredient: 'Spiromesifen 22.9% SC',
    labelDose: '1.0 mL/L (approx. 200 mL/acre)',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 5,
    safetyNotes: 'Do not use synthetic pyrethroids which kill beneficial predatory mites and flare mite populations.',
    genericAlternative: 'Oberon 240 SC',
    verificationStatus: 'needs_local_verification',
    scripts: {
      en: 'Spider mites detected under leaf surfaces. High temperatures and dust favor outbreak. Use neem oil or registered miticide directed underneath leaves.',
      kn: 'ಎಲೆಗಳ ಕೆಳಭಾಗದಲ್ಲಿ ಕೆಂಪು ಜೇಡ ನುಸಿ ಕೀಟಗಳು ಹಾನಿ ಮಾಡುತ್ತಿವೆ. ಬೇವಿನ ಎಣ್ಣೆ ಅಥವಾ ಅನುಮೋದಿತ ನುಸಿ ನಿವಾರಕವನ್ನು ಎಲೆಯ ಕೆಳಭಾಗ ತಾಗುವಂತೆ ಸಿಂಪಡಿಸಿ.',
      hi: 'पत्तियों के नीचे मकड़ी के कीट पाए गए हैं। नीम का तेल या अनुशंसित कीटनाशक पत्तियों के निचले हिस्से पर अच्छी तरह छिड़कें।'
    }
  },

  'Tomato___Target_Spot': {
    id: 'tomato-target-spot-001',
    modelClass: 'Tomato___Target_Spot',
    crop: 'Tomato',
    commonName: 'Tomato Target Spot',
    scientificOrPathogen: 'Corynespora cassiicola',
    severity: 'medium',
    symptoms: 'Pinpoint brown lesions enlarging into circular brown spots with lighter centers and distinct concentric rings across upper canopy leaves.',
    immediateAction: 'Maintain good field drainage and avoid high nitrogen excessive vegetative growth.',
    ecoFriendlyAction: 'Ensure crop rotation and balanced potassium/calcium nutrition.',
    chemicalAction: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC.',
    activeIngredient: 'Azoxystrobin + Difenoconazole',
    labelDose: '1.0 mL/L',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 5,
    safetyNotes: 'Rotate with different FRAC groups to prevent fungicide resistance.',
    genericAlternative: 'Amistar Top',
    verificationStatus: 'needs_local_verification',
    scripts: {
      en: 'Target spot detected on tomato leaves. Improve plant nutrition and spray recommended triazole/strobilurin combo if severe.',
      kn: 'ಟಾರ್ಗೆಟ್ ಸ್ಪಾಟ್ ರೋಗ ಕಂಡುಬಂದಿದೆ. ಸಮತೋಲಿತ ಗೊಬ್ಬರ ನೀಡಿ ಮತ್ತು ತಜ್ಞರು ಸೂಚಿಸಿದ ಔಷಧಿಯನ್ನು ಬಳಸಿ.',
      hi: 'टारगेट स्पॉट रोग के लक्षण हैं। संतुलित पोषक तत्व दें और अनुशंसित फफूंदनाशक का उपयोग करें।'
    }
  },

  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
    id: 'tomato-tylcv-001',
    modelClass: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    crop: 'Tomato',
    commonName: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    scientificOrPathogen: 'Begomovirus (vectored by Whitefly Bemisia tabaci)',
    severity: 'high',
    symptoms: 'Severe stunting, erect bushy growth, leaves curled upwards and cupshaped, pronounced interveinal chlorosis (yellowing), failure to fruit.',
    immediateAction: 'Rogue out infected plants immediately in plastic bags to avoid dislodging vector whiteflies.',
    ecoFriendlyAction: 'Install yellow sticky traps (15-20 per acre), use 40-mesh insect netting in nurseries, spray neem oil 5ml/L.',
    chemicalAction: 'Control whitefly vector: Diafenthiuron 50% WP or Spiromesifen 22.9% SC. No chemical cures viral systemic infection.',
    activeIngredient: 'Diafenthiuron 50% WP (Vector control)',
    labelDose: '1.2 g/L',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 7,
    safetyNotes: 'Do not spray when pollinators are visiting flowers.',
    genericAlternative: 'Pegasus 50 WP',
    verificationStatus: 'needs_local_verification',
    scripts: {
      en: 'Tomato Yellow Leaf Curl Virus is transmitted by whiteflies. Virus cannot be cured chemically. Rogue out affected plants and manage whitefly vectors.',
      kn: 'ಹಳದಿ ಎಲೆ ಮುರುಟು ವೈರಸ್ ರೋಗ ಬಿಳಿ ನೊಣಗಳಿಂದ ಹರಡುತ್ತದೆ. ರೋಗಪೀಡಿತ ಗಿಡಗಳನ್ನು ತಕ್ಷಣ ಕಿತ್ತು ನಾಶಮಾಡಿ ಮತ್ತು ಬಿಳಿ ನೊಣ ನಿಯಂತ್ರಣಕ್ಕೆ ಕ್ರಮಕೈಗೊಳ್ಳಿ.',
      hi: 'येलो लीफ कर्ल वायरस सफेद मक्खी द्वारा फैलता है। रोगग्रस्त पौधों को उखाड़कर नष्ट करें और सफेद मक्खी की रोकथाम करें।'
    }
  },

  'Tomato___Tomato_mosaic_virus': {
    id: 'tomato-mosaic-virus-001',
    modelClass: 'Tomato___Tomato_mosaic_virus',
    crop: 'Tomato',
    commonName: 'Tomato Mosaic Virus (ToMV)',
    scientificOrPathogen: 'Tobamovirus (Mechanically transmitted)',
    severity: 'high',
    symptoms: 'Mottling of dark and light green patches on leaves ("mosaic"), leaf distortion/shoestring appearance, internal browning in fruit.',
    immediateAction: 'Wash hands and tools with 20% skimmed milk or trisodium phosphate before handling uninfected plants. Destroy infected plants.',
    ecoFriendlyAction: 'Use certified virus-free seeds, avoid tobacco use by farm laborers near the crop, rotate fields.',
    chemicalAction: 'None (Viral disease). No chemical viricides exist.',
    activeIngredient: 'Sanitization & Vector Control',
    labelDose: 'N/A',
    waterVolumeLPerAcre: 0,
    waitingPeriodDays: null,
    safetyNotes: 'Strict mechanical quarantine. Highly stable virus easily spread on clothes and hands.',
    genericAlternative: 'N/A',
    verificationStatus: 'ready_for_app',
    scripts: {
      en: 'Mosaic virus confirmed. This virus is mechanically transmitted by touch and tools. Remove and burn infected plants, and sterilize hands and equipment.',
      kn: 'ಮೊಸಾಯಿಕ್ ವೈರಸ್ ರೋಗ ಪತ್ತೆಯಾಗಿದೆ. ಇದು ಮುಟ್ಟುವುದರಿಂದ ಮತ್ತು ಉಪಕರಣಗಳಿಂದ ಹರಡುತ್ತದೆ. ಪೀಡಿತ ಗಿಡಗಳನ್ನು ಸುಟ್ಟುಹಾಕಿ ಮತ್ತು ಉಪಕರಣಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ.',
      hi: 'मोज़ेक वायरस की पहचान हुई है। यह हाथों और औजारों से फैलता है। प्रभावित पौधों को नष्ट करें और औजारों को साफ रखें।'
    }
  },

  'Tomato___healthy': {
    id: 'tomato-healthy-001',
    modelClass: 'Tomato___healthy',
    crop: 'Tomato',
    commonName: 'Tomato (Healthy foliage)',
    scientificOrPathogen: 'No pathogen detected',
    severity: 'none',
    symptoms: 'Vibrant green uniform leaf color, normal leaf turgor, no necrotic spots or abnormal curling.',
    immediateAction: 'No curative spray necessary. Continue routine field scouting.',
    ecoFriendlyAction: 'Maintain regular drip fertigation, keep root zone aerated, and monitor microclimate weather risk scores.',
    chemicalAction: 'None required. Avoid unnecessary pesticide applications to protect natural predators.',
    activeIngredient: 'None',
    labelDose: 'N/A',
    waterVolumeLPerAcre: 0,
    waitingPeriodDays: null,
    safetyNotes: 'Preserve beneficial predator insect populations.',
    genericAlternative: 'N/A',
    verificationStatus: 'ready_for_app',
    scripts: {
      en: 'Leaf appears healthy with no visible stress or fungal infection. Continue regular irrigation and routine monitoring.',
      kn: 'ಎಲೆಯು ಆರೋಗ್ಯಕರವಾಗಿದೆ ಮತ್ತು ಯಾವುದೇ ರೋಗದ ಲಕ್ಷಣಗಳಿಲ್ಲ. ಅನಗತ್ಯ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ.',
      hi: 'पत्ती पूरी तरह स्वस्थ है और कोई रोग नहीं है। अनावश्यक रसायनों के प्रयोग से बचें।'
    }
  },

  'Potato___Early_blight': {
    id: 'potato-early-blight-001',
    modelClass: 'Potato___Early_blight',
    crop: 'Potato',
    commonName: 'Potato Early Blight',
    scientificOrPathogen: 'Alternaria solani',
    severity: 'medium',
    symptoms: 'Small dark brown to black spots with concentric rings appearing first on lower leaves, foliage dries and droops.',
    immediateAction: 'Ensure adequate nitrogen and potassium fertilization as stressed crops succumb early.',
    ecoFriendlyAction: 'Avoid overhead sprinkler irrigation late in the day. Ensure good field drainage.',
    chemicalAction: 'Mancozeb 75% WP or Propineb 70% WP at first visual appearance.',
    activeIngredient: 'Propineb 70% WP',
    labelDose: '2.0 g/L (approx. 400 g/acre)',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 14,
    safetyNotes: 'Wear boots, gloves and face cover.',
    genericAlternative: 'Antracol 70 WP',
    verificationStatus: 'needs_local_verification',
    scripts: {
      en: 'Potato early blight detected. Manage canopy moisture and apply protective fungicide like Propineb or Mancozeb as per label.',
      kn: 'ಆಲೂಗಡ್ಡೆಯಲ್ಲಿ ಆರಂಭಿಕ ಬ್ಲೈಟ್ ರೋಗ ಕಂಡುಬಂದಿದೆ. ನೀರಿನ ನಿರ್ವಹಣೆ ಸರಿಯಾಗಿ ಮಾಡಿ ಮತ್ತು ರಕ್ಷಣಾತ್ಮಕ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ.',
      hi: 'आलू में अर्ली ब्लाइट के लक्षण हैं। खेत में नमी संतुलित रखें और अनुशंसित कवकनाशी का छिड़काव करें।'
    }
  },

  'Potato___Late_blight': {
    id: 'potato-late-blight-001',
    modelClass: 'Potato___Late_blight',
    crop: 'Potato',
    commonName: 'Potato Late Blight',
    scientificOrPathogen: 'Phytophthora infestans',
    severity: 'high',
    symptoms: 'Rapidly spreading dark water-soaked lesions on leaf margins and tips, white fungal down underneath leaves in wet weather, foul odor.',
    immediateAction: 'Halt irrigation immediately. Apply systemic fungicide immediately across entire field block.',
    ecoFriendlyAction: 'Plant certified disease-free seed tubers; dehaulm crop 10-14 days prior to harvest to prevent tuber rot.',
    chemicalAction: 'Dimethomorph 50% WP or Cymoxanil 8% + Mancozeb 64% WP.',
    activeIngredient: 'Dimethomorph 50% WP',
    labelDose: '1.0 g/L (approx. 200-250 g/acre)',
    waterVolumeLPerAcre: 250,
    waitingPeriodDays: 14,
    safetyNotes: 'Do not harvest prematurely. Check safety interval before lifting tubers.',
    genericAlternative: 'Acrobat 50 WP',
    verificationStatus: 'needs_local_verification',
    scripts: {
      en: 'Critical threat: Late Blight on potato. Immediate spray with systemic fungicide required. Do not delay.',
      kn: 'ತೀವ್ರ ಎಚ್ಚರಿಕೆ: ಆಲೂಗಡ್ಡೆ ಲೇಟ್ ಬ್ಲೈಟ್ ರೋಗ ಕಂಡುಬಂದಿದೆ. ತಕ್ಷಣ ಅನುಮೋದಿತ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಸಿಂಪಡಿಸಿ.',
      hi: 'अति गंभीर चेतावनी: आलू में लेट ब्लाइट का संक्रमण है। बिना देरी किए तुरंत प्रणालीगत कवकनाशी का छिड़काव करें।'
    }
  },

  'Potato___healthy': {
    id: 'potato-healthy-001',
    modelClass: 'Potato___healthy',
    crop: 'Potato',
    commonName: 'Potato (Healthy foliage)',
    scientificOrPathogen: 'No pathogen detected',
    severity: 'none',
    symptoms: 'Robust dark green leaves, smooth surface, vigorous canopy growth without wilting or spotting.',
    immediateAction: 'Maintain current cultural practices.',
    ecoFriendlyAction: 'Continue earthing up ridges to protect tubers from greening and tuber moth.',
    chemicalAction: 'None needed.',
    activeIngredient: 'None',
    labelDose: 'N/A',
    waterVolumeLPerAcre: 0,
    waitingPeriodDays: null,
    safetyNotes: 'No hazard.',
    genericAlternative: 'N/A',
    verificationStatus: 'ready_for_app',
    scripts: {
      en: 'Potato canopy is healthy. Maintain hill earthing-up and continue monitoring local weather risk.',
      kn: 'ಆಲೂಗಡ್ಡೆ ಗಿಡಗಳು ಆರೋಗ್ಯಕರವಾಗಿವೆ. ಮಣ್ಣು ಏರಿಸುವ ಕೆಲಸ ಮುಂದುವರಿಸಿ.',
      hi: 'आलू की फसल स्वस्थ है। नियमित मिट्टी चढ़ाने का कार्य जारी रखें।'
    }
  },

  'Rice___Bacterial_leaf_blight': {
    id: 'rice-bacterial-leaf-blight-001',
    modelClass: 'Rice___Bacterial_leaf_blight',
    crop: 'Rice',
    commonName: 'Rice Bacterial Leaf Blight (BLB / Kresek)',
    scientificOrPathogen: 'Xanthomonas oryzae pv. oryzae',
    severity: 'high',
    symptoms: 'Water-soaked wavy lesions from leaf tips downwards, turning straw-yellow or bleached white; milky bacterial ooze droplets in early mornings.',
    immediateAction: 'Drain field temporarily for 3-4 days to arrest bacterial progression; delay top-dressing of nitrogen fertilizer.',
    ecoFriendlyAction: 'Apply Pseudomonas fluorescens @ 5g/L; apply muriate of potash (potassium) to strengthen plant cell walls.',
    chemicalAction: 'Copper Oxychloride 50% WP + Streptomycin Sulphate formulation where authorized by local package of practices.',
    activeIngredient: 'Copper Oxychloride 50% WP + Streptomycin',
    labelDose: '2.5 g Copper Oxychloride + 0.1 g Streptocycline per litre',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 20,
    safetyNotes: 'Keep livestock out of treated fields for minimum 7 days.',
    genericAlternative: 'Blitox 50 WP',
    verificationStatus: 'needs_local_verification',
    scripts: {
      en: 'Bacterial Leaf Blight detected in paddy. Drain excess field water, pause nitrogen urea application, and spray copper bactericide.',
      kn: 'ಭತ್ತದ ಬೆಳೆಯಲ್ಲಿ ದುಂಡಾಣು ಎಲೆ ಕವಚ ರೋಗ (ಬಿಎಲ್‌ಬಿ) ಕಂಡುಬಂದಿದೆ. ಗದ್ದೆಯಿಂದ ನೀರು ಬಸಿದು ತೆಗೆಯಿರಿ, ಯೂರಿಯಾ ಗೊಬ್ಬರ ಹಾಕುವುದನ್ನು ನಿಲ್ಲಿಸಿ.',
      hi: 'धान की फसल में जीवाणु झुलसा (बीएलबी) के लक्षण हैं। खेत से पानी निकालें, यूरिया देना बंद करें और कॉपर दवा का छिड़काव करें।'
    }
  },

  'Rice___Brown_spot': {
    id: 'rice-brown-spot-001',
    modelClass: 'Rice___Brown_spot',
    crop: 'Rice',
    commonName: 'Rice Brown Spot',
    scientificOrPathogen: 'Bipolaris oryzae (Cochliobolus miyabeanus)',
    severity: 'medium',
    symptoms: 'Oval to circular brown spots on leaves with yellow halos; gray center on older spots; also affects grains causing grain discoloration.',
    immediateAction: 'Correct soil nutritional deficiencies (especially silicon, potassium, and zinc). Avoid moisture stress.',
    ecoFriendlyAction: 'Seed treatment with Trichoderma viride @ 5g/kg seed; ensure soil is well aerated.',
    chemicalAction: 'Propiconazole 25% EC or Mancozeb 75% WP.',
    activeIngredient: 'Propiconazole 25% EC',
    labelDose: '1.0 mL/L (approx. 200 mL/acre)',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 30,
    safetyNotes: 'Avoid drift to aquatic ponds; highly toxic to fish.',
    genericAlternative: 'Tilt 25 EC',
    verificationStatus: 'needs_local_verification',
    scripts: {
      en: 'Rice brown spot observed. Check soil nutrients and apply Propiconazole or Mancozeb if spots proliferate across the boot leaf.',
      kn: 'ಭತ್ತದಲ್ಲಿ ಕಂದು ಚುಕ್ಕೆ ರೋಗ ಕಂಡುಬಂದಿದೆ. ಮಣ್ಣಿನ ಪೋಷಕಾಂಶಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ ಮತ್ತು ಲೇಬಲ್ ಸೂಚನೆಯಂತೆ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ.',
      hi: 'धान में भूरा धब्बा रोग के लक्षण हैं। पोटाश और जिंक की कमी पूरी करें और आवश्यक होने पर अनुशंसित फफूंदनाशक छिड़कें।'
    }
  },

  'Rice___Leaf_smut': {
    id: 'rice-leaf-smut-001',
    modelClass: 'Rice___Leaf_smut',
    crop: 'Rice',
    commonName: 'Rice Leaf Smut',
    scientificOrPathogen: 'Entyloma oryzae',
    severity: 'low',
    symptoms: 'Small, slightly raised angular black spots scattered on leaf blades; heavily infected leaves turn yellow and die prematurely.',
    immediateAction: 'Scout field to verify threshold. Usually does not cause major yield decline unless late-stage severe infection occurs.',
    ecoFriendlyAction: 'Maintain clean field bunds, eliminate volunteer weeds, and balance fertilizer application.',
    chemicalAction: 'Carbendazim 50% WP or Mancozeb 75% WP if flag leaf is endangered.',
    activeIngredient: 'Mancozeb 75% WP',
    labelDose: '2.0 g/L',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 21,
    safetyNotes: 'Standard PPE required during spraying.',
    genericAlternative: 'Bavistin 50 WP',
    verificationStatus: 'needs_local_verification',
    scripts: {
      en: 'Rice leaf smut detected. Minor disease in most conditions. Maintain balanced nutrition and monitor flag leaf.',
      kn: 'ಭತ್ತದಲ್ಲಿ ಎಲೆ ಕಾಡಿಗೆ ರೋಗದ ಕಪ್ಪು ಚುಕ್ಕೆಗಳು ಕಂಡುಬಂದಿವೆ. ಸಾಮಾನ್ಯವಾಗಿ ಇದು ಹೆಚ್ಚು ಹಾನಿ ಮಾಡುವುದಿಲ್ಲ, ನಿಗಾವಹಿಸಿ.',
      hi: 'धान में लीफ स्मट के लक्षण हैं। संतुलित खाद दें और ध्वज पत्ती की सुरक्षा पर ध्यान दें।'
    }
  },

  'Sugarcane___RedRot': {
    id: 'sugarcane-red-rot-001',
    modelClass: 'Sugarcane___RedRot',
    crop: 'Sugarcane',
    commonName: 'Sugarcane Red Rot',
    scientificOrPathogen: 'Colletotrichum falcatum',
    severity: 'high',
    symptoms: 'Discoloration of third or fourth leaf from top, drying of crown, internal stalk reddening with characteristic transverse white patches.',
    immediateAction: 'Uproot and burn diseased clumps immediately. Avoid letting irrigation water flow from infected to healthy fields.',
    ecoFriendlyAction: 'Dip seed setts in Trichoderma viride culture @ 10g/L prior to planting; practice crop rotation with paddy or green manure.',
    chemicalAction: 'Sett treatment with Carbendazim 50% WP @ 1g/L for 15 minutes before planting.',
    activeIngredient: 'Carbendazim 50% WP',
    labelDose: '1.0 g/L (sett treatment dip)',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 60,
    safetyNotes: 'Wear chemical-resistant gloves during sett dipping. Dispose of treated dip solution safely away from waterways.',
    genericAlternative: 'Bavistin 50 WP',
    verificationStatus: 'ready_for_app',
    scripts: {
      en: 'Red Rot detected in sugarcane. This is a serious fungal disease. Uproot infected clumps immediately and ensure all future seed setts are treated with fungicide.',
      kn: 'ಕಬ್ಬಿನ ಬೆಳೆಯಲ್ಲಿ ಕೆಂಪು ಕೊಳೆ ರೋಗ ಕಂಡುಬಂದಿದೆ. ಬಾಧಿತ ಕಬ್ಬನ್ನು ತಕ್ಷಣ ಬುಡಸಮೇತ ಕಿತ್ತು ಸುಟ್ಟುಹಾಕಿ. ಮುಂದಿನ ಬಿತ್ತನೆಗೆ ಶಿಲೀಂಧ್ರನಾಶಕದಿಂದ ಬೀಜೋಪಚಾರ ಮಾಡಿ.',
      hi: 'गन्ने में लाल सड़न रोग की पुष्टि हुई है। प्रभावित पौधों को तुरंत उखाड़कर जला दें और आगामी बुवाई के लिए बीजोपचार अवश्य करें।'
    }
  },

  'Banana___Sigatoka': {
    id: 'banana-sigatoka-001',
    modelClass: 'Banana___Sigatoka',
    crop: 'Banana',
    commonName: 'Banana Sigatoka Leaf Spot',
    scientificOrPathogen: 'Pseudocercospora musae (Mycosphaerella musicola)',
    severity: 'high',
    symptoms: 'Narrow yellowish-green specks turning dark brown with sunken gray centers, large leaf areas collapse and scorch prematurely.',
    immediateAction: 'Cut off and incinerate severely spotted leaves. Maintain drainage ditches to keep orchard humidity low.',
    ecoFriendlyAction: 'Apply 1% Bordeaux mixture with mineral oil sticker at the onset of monsoon. Increase plant spacing.',
    chemicalAction: 'Propiconazole 25% EC @ 1mL/L or Propineb 70% WP @ 2g/L.',
    activeIngredient: 'Propiconazole 25% EC',
    labelDose: '1.0 mL/L (approx. 200 mL/acre)',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 30,
    safetyNotes: 'Do not spray during flowering when bees are active. Full PPE required.',
    genericAlternative: 'Tilt 25 EC',
    verificationStatus: 'ready_for_app',
    scripts: {
      en: 'Sigatoka leaf spot identified on banana. Cut and remove heavily infected leaves, and spray registered triazole fungicide with sticker.',
      kn: 'ಬಾಳೆಯಲ್ಲಿ ಸಿಗಾಟೋಕಾ ಎಲೆ ಚುಕ್ಕೆ ರೋಗ ಕಂಡುಬಂದಿದೆ. ಹಾನಿಗೊಳಗಾದ ಎಲೆಗಳನ್ನು ಕತ್ತರಿಸಿ ನಾಶಮಾಡಿ ಮತ್ತು ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಸಿಂಪಡಿಸಿ.',
      hi: 'केले में सिगाटोका पत्ती धब्बा रोग है। अधिक प्रभावित पत्तियों को काटकर नष्ट करें और अनुमोदित फफूंदनाशक का छिड़काव करें।'
    }
  },

  'Coconut___Leaf_Spot': {
    id: 'coconut-leaf-spot-001',
    modelClass: 'Coconut___Leaf_Spot',
    crop: 'Coconut',
    commonName: 'Coconut Grey Leaf Spot / Blight',
    scientificOrPathogen: 'Pestalotiopsis palmarum',
    severity: 'medium',
    symptoms: 'Yellowish brown spots with dark margins on leaflets, enlarging and turning ashy grey with tiny black fruiting bodies.',
    immediateAction: 'Cut and burn severely blighted lower fronds during crown cleaning before the monsoon.',
    ecoFriendlyAction: 'Apply root feeding with neem cake, ensure adequate potassium and boron application to palm basin.',
    chemicalAction: 'Foliar spray with Copper Oxychloride 50% WP @ 3g/L or 1% Bordeaux mixture on lower canopy.',
    activeIngredient: 'Copper Oxychloride 50% WP',
    labelDose: '3.0 g/L (1-2 L solution per palm)',
    waterVolumeLPerAcre: 200,
    waitingPeriodDays: 14,
    safetyNotes: 'Use safety harness when spraying tall palms. Avoid spray drift during wind.',
    genericAlternative: 'Blitox 50 WP',
    verificationStatus: 'ready_for_app',
    scripts: {
      en: 'Grey leaf spot detected on coconut fronds. Clean the crown, prune damaged lower leaves, and spray Bordeaux mixture or copper oxychloride.',
      kn: 'ತೆಂಗಿನ ಮರದಲ್ಲಿ ಎಲೆ ಕರಕಲು ರೋಗ ಕಂಡುಬಂದಿದೆ. ಸುಳಿಯನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ, ಒಣಗಿದ ಗರಿಗಳನ್ನು ಕತ್ತರಿಸಿ ಬೋರ್ಡೋ ಮಿಶ್ರಣ ಸಿಂಪಡಿಸಿ.',
      hi: 'नारियल के पत्तों पर धब्बा रोग है। सूखे पत्तों की छंटाई करें और कॉपर ऑक्सीक्लोराइड या बोर्डो मिश्रण का छिड़काव करें।'
    }
  }
};
