export interface SoilProfile {
  districtName: string;
  state: string;
  soilType: string;
  texture: string;
  phRange: string;
  phCategory: 'Acidic' | 'Near-Neutral' | 'Neutral to Alkaline' | 'Saline/Acid-Sulphate';
  waterBehavior: string;
  waterRetentionRisk: 'High Waterlogging Risk' | 'Drought-Sensitive / Leaching' | 'Moderate / Variable';
  priorityCrops: string[];
  climateContext: string;
  dominantRisks: string;
  managementSignal: string;
}

export const DISTRICT_SOIL_PROFILES: Record<string, SoilProfile> = {
  // Karnataka Red Soil Belt
  'Bengaluru Urban': {
    districtName: 'Bengaluru Urban',
    state: 'Karnataka',
    soilType: 'Red Soil (Gravelly Loam)',
    texture: 'Gravelly loam to clay; iron-rich weathered granite',
    phRange: '6.0 – 6.8',
    phCategory: 'Acidic',
    waterBehavior: 'Moderate moisture retention; drought-sensitive between rains',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Tomato', 'Ragi', 'Vegetables', 'Pulses'],
    climateContext: 'Eastern Dry Zone (800-900 mm rainfall)',
    dominantRisks: 'Mid-season dry spells; blast risk after humid rain swings',
    managementSignal: 'Apply farmyard manure (FYM), conserve moisture, split nitrogen doses.'
  },
  'Bengaluru Rural': {
    districtName: 'Bengaluru Rural',
    state: 'Karnataka',
    soilType: 'Red Sandy Loam',
    texture: 'Weathered gneiss; permeable sandy loam',
    phRange: '5.8 – 6.5',
    phCategory: 'Acidic',
    waterBehavior: 'Fast draining; low water-holding capacity',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Ragi', 'Grapes', 'Tomato', 'Mulberry'],
    climateContext: 'Eastern Dry Zone (750-850 mm rainfall)',
    dominantRisks: 'Moisture stress during fruit set; fungal powdery mildew',
    managementSignal: 'Mulching, balanced N-P-K, soil-test-based lime where needed.'
  },
  'Kolar': {
    districtName: 'Kolar',
    state: 'Karnataka',
    soilType: 'Red Gravelly Loam',
    texture: 'Coarse to medium gravelly loam; deficient in organic carbon',
    phRange: '6.2 – 7.0',
    phCategory: 'Near-Neutral',
    waterBehavior: 'Rapid drainage; susceptible to topsoil drying',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Tomato', 'Potato', 'Mango', 'Ragi'],
    climateContext: 'Eastern Dry Zone; semi-arid drought-prone belt (650-750 mm)',
    dominantRisks: 'High daytime temperatures, sudden monsoon humidity causing Early Blight',
    managementSignal: 'Drip fertigation; avoid flood irrigation; incorporate crop residues.'
  },
  'Chikkaballapur': {
    districtName: 'Chikkaballapur',
    state: 'Karnataka',
    soilType: 'Red Sandy Loam',
    texture: 'Granitic red loam with low clay fraction',
    phRange: '6.0 – 6.8',
    phCategory: 'Acidic',
    waterBehavior: 'Low water retention; requires regular irrigation',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Potato', 'Tomato', 'Grapes', 'Onion'],
    climateContext: 'Eastern Dry Zone (700-800 mm rainfall)',
    dominantRisks: 'Late blight flare-ups during foggy winter mornings; bacterial wilt',
    managementSignal: 'Maintain raised beds, certified pathogen-free seed tubers, prevent pooling.'
  },
  'Mandya': {
    districtName: 'Mandya',
    state: 'Karnataka',
    soilType: 'Red Loam & Channel Alluvium',
    texture: 'Medium-textured red loam under canal command',
    phRange: '6.5 – 7.2',
    phCategory: 'Near-Neutral',
    waterBehavior: 'Good retention under irrigation; lowlands prone to saturation',
    waterRetentionRisk: 'Moderate / Variable',
    priorityCrops: ['Sugarcane', 'Rice', 'Ragi'],
    climateContext: 'Southern Dry Zone (650-750 mm rainfall); Cauvery irrigation basin',
    dominantRisks: 'Waterlogging in cane ratoon; Red Rot and Smut propagation under stagnation',
    managementSignal: 'Ensure field drainage channels; sett dip in carbendazim; avoid water stagnation.'
  },
  'Mysuru': {
    districtName: 'Mysuru',
    state: 'Karnataka',
    soilType: 'Red Sandy Loam & Deep Red Soil',
    texture: 'Clay loam to sandy clay',
    phRange: '6.2 – 7.0',
    phCategory: 'Near-Neutral',
    waterBehavior: 'Moderate retention; good root penetration',
    waterRetentionRisk: 'Moderate / Variable',
    priorityCrops: ['Rice', 'Cotton', 'Pulses', 'Sugarcane'],
    climateContext: 'Southern Dry Zone (750-850 mm rainfall)',
    dominantRisks: 'Bacterial leaf blight in wet paddy; boll rot under humid conditions',
    managementSignal: 'Split nitrogen applications; alternate wetting and drying (AWD) in rice.'
  },
  'Hassan': {
    districtName: 'Hassan',
    state: 'Karnataka',
    soilType: 'Red Loam to Lateritic Loam',
    texture: 'Fine loam with iron concretions',
    phRange: '5.5 – 6.4',
    phCategory: 'Acidic',
    waterBehavior: 'Moderate to high permeability; slope drainage',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Potato', 'Coffee', 'Pepper', 'Ginger'],
    climateContext: 'Southern Transition Zone (900-1100 mm rainfall)',
    dominantRisks: 'Late Blight in kharif potato; Phytophthora quick wilt in pepper',
    managementSignal: 'Ridging; prophylactic copper sprays before continuous monsoon drizzle.'
  },
  'Chikkamagaluru': {
    districtName: 'Chikkamagaluru',
    state: 'Karnataka',
    soilType: 'Laterite & Forest Loam',
    texture: 'Deep, acidic, leached lateritic loam rich in organic matter',
    phRange: '5.0 – 5.8',
    phCategory: 'Acidic',
    waterBehavior: 'Fast percolation; severe nutrient leaching during torrential monsoon',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Coffee', 'Pepper', 'Arecanut', 'Cardamom'],
    climateContext: 'Hilly / Malnad Zone (1800-3000 mm rainfall)',
    dominantRisks: 'Phytophthora foot rot, berry borer, anthracnose under continuous wetness',
    managementSignal: 'Soil-test-based agricultural lime; organic mulch; improve shade management.'
  },
  'Shivamogga': {
    districtName: 'Shivamogga',
    state: 'Karnataka',
    soilType: 'Laterite & Red Sandy Clay Loam',
    texture: 'Red clay loam transitioning to laterite',
    phRange: '5.2 – 6.2',
    phCategory: 'Acidic',
    waterBehavior: 'Fast drainage in uplands; waterlogging in low paddies',
    waterRetentionRisk: 'Moderate / Variable',
    priorityCrops: ['Rice', 'Arecanut', 'Ginger', 'Maize'],
    climateContext: 'Southern Transition / Malnad border (1200-1800 mm)',
    dominantRisks: 'Kole Roga (fruit rot) in arecanut; blast and sheath blight in rice',
    managementSignal: 'Bordeaux mixture canopy spray; drain paddy fields before panicle emergence.'
  },
  'Dharwad': {
    districtName: 'Dharwad',
    state: 'Karnataka',
    soilType: 'Medium to Deep Black Soil',
    texture: 'Clayey vertisol; swelling and shrinking characteristics',
    phRange: '7.5 – 8.2',
    phCategory: 'Neutral to Alkaline',
    waterBehavior: 'High water-holding capacity; deep cracking when dry',
    waterRetentionRisk: 'High Waterlogging Risk',
    priorityCrops: ['Cotton', 'Soybean', 'Chilli', 'Jowar'],
    climateContext: 'Northern Transition Zone (700-800 mm rainfall)',
    dominantRisks: 'Waterlogging and collar rot during heavy rains; sucking pests during dry spells',
    managementSignal: 'Broad-bed furrow (BBF) method; avoid over-irrigation; monitor micronutrients (Zn/Fe).'
  },
  'Belagavi': {
    districtName: 'Belagavi',
    state: 'Karnataka',
    soilType: 'Deep Black Soil (Vertisol)',
    texture: 'Heavy clay; Ca and Mg rich basalt-derived soil',
    phRange: '7.4 – 8.3',
    phCategory: 'Neutral to Alkaline',
    waterBehavior: 'High water retention; slow internal drainage; high saturation risk',
    waterRetentionRisk: 'High Waterlogging Risk',
    priorityCrops: ['Sugarcane', 'Soybean', 'Vegetables', 'Maize'],
    climateContext: 'Northern Transition Zone (800-1100 mm rainfall)',
    dominantRisks: 'Waterlogging leading to sett decay; Rust and Red Rot in sugarcane under high humidity',
    managementSignal: 'Deep furrow drainage; avoid excess flood cycles; apply potash to boost stalk strength.'
  },
  'Ballari': {
    districtName: 'Ballari',
    state: 'Karnataka',
    soilType: 'Black Cotton Soil & Red Sandy Loam',
    texture: 'Deep black vertisol in irrigated pockets; shallow red soil in uplands',
    phRange: '7.8 – 8.5',
    phCategory: 'Neutral to Alkaline',
    waterBehavior: 'High water retention in black soils; rapid evaporation',
    waterRetentionRisk: 'High Waterlogging Risk',
    priorityCrops: ['Chilli', 'Rice', 'Cotton', 'Sunflower'],
    climateContext: 'North Eastern Dry Zone (500-600 mm rainfall)',
    dominantRisks: 'Anthracnose fruit rot in chilli; leaf spot; salinity accumulation under canal seepage',
    managementSignal: 'Maintain field channels to prevent salinity; split nutrient applications.'
  },
  'Raichur': {
    districtName: 'Raichur',
    state: 'Karnataka',
    soilType: 'Deep Black Clay Soil',
    texture: 'High clay fraction (>45%); montmorillonitic',
    phRange: '7.8 – 8.4',
    phCategory: 'Neutral to Alkaline',
    waterBehavior: 'Swelling clay; extremely slow percolation when wet',
    waterRetentionRisk: 'High Waterlogging Risk',
    priorityCrops: ['Rice', 'Cotton', 'Pigeonpea', 'Sunflower'],
    climateContext: 'North Eastern Dry Zone; Tungabhadra command area',
    dominantRisks: 'Paddy blast and sheath blight under canal ponding; salinity in tail-end areas',
    managementSignal: 'AWD irrigation method; test electrical conductivity (EC); gypsum application if saline.'
  },
  'Kalaburagi': {
    districtName: 'Kalaburagi',
    state: 'Karnataka',
    soilType: 'Deep Black Soil',
    texture: 'Heavy clay basaltic soil with high lime nodules',
    phRange: '7.6 – 8.4',
    phCategory: 'Neutral to Alkaline',
    waterBehavior: 'Very high retention; water ponding during intense monsoon showers',
    waterRetentionRisk: 'High Waterlogging Risk',
    priorityCrops: ['Pigeonpea (Tur)', 'Sunflower', 'Jowar', 'Pulses'],
    climateContext: 'North Eastern Transition Zone (700-800 mm rainfall)',
    dominantRisks: 'Fusarium wilt in pigeonpea; phytophthora stem blight under water stagnation',
    managementSignal: 'Ridge and furrow planting; seed treatment with Trichoderma viride.'
  },
  'Dakshina Kannada': {
    districtName: 'Dakshina Kannada',
    state: 'Karnataka',
    soilType: 'Coastal Laterite & Sandy Alluvium',
    texture: 'Coarse to medium laterite; coastal alluvial strip',
    phRange: '4.8 – 5.8',
    phCategory: 'Acidic',
    waterBehavior: 'Extremely fast drainage; heavy nutrient leaching under heavy monsoon',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Arecanut', 'Coconut', 'Rubber', 'Paddy'],
    climateContext: 'Coastal Zone (3500-4000 mm annual monsoon)',
    dominantRisks: 'Mahali / Koleroga (Phytophthora meadii) in arecanut; bud rot in coconut',
    managementSignal: 'Apply 1% Bordeaux mixture before monsoon; lime soil annually; mulch tree basins.'
  },
  'Kodagu': {
    districtName: 'Kodagu',
    state: 'Karnataka',
    soilType: 'Humic Laterite & Forest Soil',
    texture: 'Friable loam rich in forest humus; acidic',
    phRange: '5.0 – 6.0',
    phCategory: 'Acidic',
    waterBehavior: 'High slope runoff; rapid percolation',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Coffee', 'Pepper', 'Cardamom', 'Mandarin'],
    climateContext: 'Hilly Zone (2500-3500 mm rainfall)',
    dominantRisks: 'Pollu disease and foot rot in black pepper; coffee leaf rust',
    managementSignal: 'Trichoderma enriched FYM in vine basins; contour bunding; clean canopy shade.'
  },

  // Kerala Districts
  'Wayanad': {
    districtName: 'Wayanad',
    state: 'Kerala',
    soilType: 'Laterite & Red Loam',
    texture: 'Porous, acidic, well-drained loamy soil',
    phRange: '5.0 – 5.8',
    phCategory: 'Acidic',
    waterBehavior: 'Rapid drainage; susceptible to topsoil erosion on slopes',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Black Pepper', 'Coffee', 'Rice', 'Banana'],
    climateContext: 'High Altitude Zone (2000-2800 mm rainfall)',
    dominantRisks: 'Quick wilt (Phytophthora capsici) in pepper; banana Sigatoka on hill terraces',
    managementSignal: 'Contour planting; biocontrol (Trichoderma); apply lime and avoid injury to vine roots.'
  },
  'Idukki': {
    districtName: 'Idukki',
    state: 'Kerala',
    soilType: 'Forest Soil & Mountain Loam',
    texture: 'High organic carbon loam; acidic; fragile topsoil',
    phRange: '4.8 – 5.6',
    phCategory: 'Acidic',
    waterBehavior: 'Good absorption but heavy leaching on slopes',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Cardamom', 'Tea', 'Black Pepper', 'Rubber'],
    climateContext: 'High Range Zone (2500-3500 mm rainfall)',
    dominantRisks: 'Azhukal disease in cardamom; blister blight in tea; fungal root rot',
    managementSignal: 'Shade regulation; copper oxychloride drenching; terracing to prevent soil wash.'
  },
  'Palakkad': {
    districtName: 'Palakkad',
    state: 'Kerala',
    soilType: 'Palakkad Red Loam & Alluvium',
    texture: 'Gravelly red loam in uplands; riverine alluvium in Bharatapuzha basin',
    phRange: '5.8 – 6.6',
    phCategory: 'Acidic',
    waterBehavior: 'Moderate retention; lowland paddies flood during peak monsoon',
    waterRetentionRisk: 'Moderate / Variable',
    priorityCrops: ['Rice (Palakkad Matta)', 'Coconut', 'Sugarcane', 'Banana'],
    climateContext: 'Central Zone (Palakkad Gap, 1800-2200 mm rainfall)',
    dominantRisks: 'Bacterial leaf blight in Matta rice; sheath rot; blast during humid dry transitions',
    managementSignal: 'Avoid excess urea in kharif; spray streptocycline + copper oxychloride at early symptoms.'
  },
  'Kottayam': {
    districtName: 'Kottayam',
    state: 'Kerala',
    soilType: 'Laterite Loam',
    texture: 'Deep laterite with high clay fraction; gravelly subsoil',
    phRange: '4.8 – 5.5',
    phCategory: 'Acidic',
    waterBehavior: 'Fast infiltration; severe phosphorus fixation',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Natural Rubber', 'Coconut', 'Cocoa', 'Tapioca'],
    climateContext: 'Southern Mid-land (2800-3200 mm rainfall)',
    dominantRisks: 'Abnormal leaf fall (Phytophthora) in rubber; coconut leaf rot',
    managementSignal: 'Bordeaux mixture canopy spraying; apply rock phosphate and dolomite/lime.'
  },
  'Thrissur': {
    districtName: 'Thrissur',
    state: 'Kerala',
    soilType: 'Coastal Alluvium & Kole Soil',
    texture: 'Heavy clay Kole wetland soils (below sea level) and river alluvium',
    phRange: '4.5 – 5.8',
    phCategory: 'Saline/Acid-Sulphate',
    waterBehavior: 'Severe seasonal waterlogging; requires motorized dewatering in Kole lands',
    waterRetentionRisk: 'High Waterlogging Risk',
    priorityCrops: ['Rice (Kole lands)', 'Coconut', 'Banana (Nendran)'],
    climateContext: 'Central Coastal Plain (3000-3400 mm rainfall)',
    dominantRisks: 'Acid-sulphate toxicity; bacterial blight in Kole rice; banana pseudostem borer',
    managementSignal: 'Systematic pumping and lime application; raised mound planting for banana.'
  },
  'Kozhikode': {
    districtName: 'Kozhikode',
    state: 'Kerala',
    soilType: 'Coastal Sand & Midland Laterite',
    texture: 'Sandy coastal belt; lateritic red loam in interior foothills',
    phRange: '5.0 – 6.0',
    phCategory: 'Acidic',
    waterBehavior: 'Very fast permeability; high fertilizer wash-off',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Coconut', 'Arecanut', 'Spices', 'Tapioca'],
    climateContext: 'Northern Coastal Belt (3200-3600 mm rainfall)',
    dominantRisks: 'Bud rot and grey leaf spot in coconut; arecanut stem bleeding',
    managementSignal: 'Clean crown basins before monsoon; apply 1% Bordeaux paste to central bud.'
  },
  'Kasaragod': {
    districtName: 'Kasaragod',
    state: 'Kerala',
    soilType: 'Hardpan Laterite & Coastal Alluvium',
    texture: 'Vesicular laterite with underlying ferric hardpan',
    phRange: '5.0 – 5.8',
    phCategory: 'Acidic',
    waterBehavior: 'Rapid surface runoff on laterite plateaus; droughty in summer',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Coconut', 'Arecanut', 'Rubber', 'Cashew'],
    climateContext: 'Northern Coastal Zone (3400-3800 mm rainfall)',
    dominantRisks: 'Bud rot in coconut; tea mosquito bug and anthracnose in cashew',
    managementSignal: 'Rainwater harvesting in trenches; split nutrient application; crown sanitation.'
  },
  'Alappuzha': {
    districtName: 'Alappuzha',
    state: 'Kerala',
    soilType: 'Kuttanad Acid-Sulphate & Coastal Sand',
    texture: 'Kayal and Karappadam soils rich in organic matter but acidic (Kari soil)',
    phRange: '3.8 – 5.0',
    phCategory: 'Saline/Acid-Sulphate',
    waterBehavior: 'Submerged below sea level; high water table; saltwater intrusion risk',
    waterRetentionRisk: 'High Waterlogging Risk',
    priorityCrops: ['Rice (Kuttanad)', 'Coconut', 'Vegetables'],
    climateContext: 'Below-Sea-Level Wetland Farming (2800-3200 mm rainfall)',
    dominantRisks: 'Acid-sulphate shock; sheath blight; salinity ingress during post-monsoon tides',
    managementSignal: 'Regulate Thanneermukkom bund; heavy lime application; pump out acidic standing water.'
  },

  // Tamil Nadu Districts
  'Coimbatore': {
    districtName: 'Coimbatore',
    state: 'Tamil Nadu',
    soilType: 'Red Soil & Black Calcareous Soil',
    texture: 'Medium deep red loam in western parts; black clayey soil in eastern pockets',
    phRange: '7.2 – 8.2',
    phCategory: 'Near-Neutral',
    waterBehavior: 'Moderate retention; black pockets hold moisture well',
    waterRetentionRisk: 'Moderate / Variable',
    priorityCrops: ['Tomato', 'Coconut', 'Cotton', 'Maize'],
    climateContext: 'Western Zone (650-750 mm rainfall; rain shadow area)',
    dominantRisks: 'Early blight and leaf curl virus in tomato; root rot in coconut under dry heat',
    managementSignal: 'Drip irrigation with fertigation; yellow sticky traps; mancozeb spray for early blight.'
  },
  'Thanjavur': {
    districtName: 'Thanjavur',
    state: 'Tamil Nadu',
    soilType: 'Cauvery River Alluvium',
    texture: 'Deep alluvial silt and clayey loam; highly fertile delta soil',
    phRange: '6.8 – 7.8',
    phCategory: 'Near-Neutral',
    waterBehavior: 'Favorable moisture retention; lowlands subject to flood during NE monsoon',
    waterRetentionRisk: 'High Waterlogging Risk',
    priorityCrops: ['Rice (Kuruvai / Thaladi)', 'Pulses (Blackgram)', 'Banana', 'Sugarcane'],
    climateContext: 'Cauvery Delta Zone (950-1100 mm rainfall; NE monsoon dominant)',
    dominantRisks: 'Bacterial leaf blight and sheath blight during cyclone season; flood stagnation',
    managementSignal: 'Use flood-tolerant paddy varieties (e.g. CR 1009 Sub-1); alternate wetting & drying.'
  },
  'Madurai': {
    districtName: 'Madurai',
    state: 'Tamil Nadu',
    soilType: 'Red Sandy Loam & Black Soil',
    texture: 'Red loam in Vaigai uplands; black soil in Kalligudi/Tirumangalam blocks',
    phRange: '7.0 – 8.0',
    phCategory: 'Near-Neutral',
    waterBehavior: 'Moderate retention; dry spells cause surface crusting',
    waterRetentionRisk: 'Moderate / Variable',
    priorityCrops: ['Rice', 'Cotton', 'Millets', 'Jasmine', 'Pulses'],
    climateContext: 'Southern Zone (750-850 mm rainfall)',
    dominantRisks: 'Bacterial leaf streak; sucking pest complexes during dry sunny periods',
    managementSignal: 'Incorporate coir pith or tank silt; split potassium applications.'
  },
  'Dindigul': {
    districtName: 'Dindigul',
    state: 'Tamil Nadu',
    soilType: 'Red Gravelly Loam & Foothill Soil',
    texture: 'Medium coarse red loam with gravel and quartz fragments',
    phRange: '6.5 – 7.4',
    phCategory: 'Near-Neutral',
    waterBehavior: 'Rapid drainage; fast drying; requires frequent light watering',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Tomato', 'Banana', 'Onion', 'Vegetables', 'Maize'],
    climateContext: 'Southern Zone / Palani Foothills (800-900 mm rainfall)',
    dominantRisks: 'Purple blotch in onion; early blight in tomato; Sigatoka in foothill banana',
    managementSignal: 'Propiconazole or mancozeb foliar sprays with sticker; raised bed planting.'
  },
  'Salem': {
    districtName: 'Salem',
    state: 'Tamil Nadu',
    soilType: 'Red Loam & Black Soil',
    texture: 'Red sandy loam; calcareous black soil in pockets',
    phRange: '7.0 – 7.8',
    phCategory: 'Near-Neutral',
    waterBehavior: 'Moderate permeability; good aeration',
    waterRetentionRisk: 'Moderate / Variable',
    priorityCrops: ['Tapioca', 'Tomato', 'Mango', 'Sugarcane'],
    climateContext: 'North Western Zone (850-950 mm rainfall)',
    dominantRisks: 'Cassava mosaic virus; early blight in tomato; red rot in canal-fed sugarcane',
    managementSignal: 'Dip sugarcane setts before planting; maintain drip lines; rogue out mosaic plants.'
  },
  'Erode': {
    districtName: 'Erode',
    state: 'Tamil Nadu',
    soilType: 'Red Loam & Riverine Alluvial Loam',
    texture: 'Deep alluvial loam along Bhavani/Cauvery; red loam in Bhavanisagar belt',
    phRange: '7.0 – 7.8',
    phCategory: 'Near-Neutral',
    waterBehavior: 'Good retention under canal irrigation',
    waterRetentionRisk: 'Moderate / Variable',
    priorityCrops: ['Turmeric', 'Sugarcane', 'Banana', 'Rice'],
    climateContext: 'Western Zone (700-800 mm rainfall)',
    dominantRisks: 'Rhizome rot in turmeric; leaf spot in banana; sugarcane early shoot borer',
    managementSignal: 'Chlorantraniliprole 18.5% SC application; seed rhizome treatment; avoid water pooling.'
  },
  'Tiruchirappalli': {
    districtName: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    soilType: 'Alluvial Clay Loam & Red Soil',
    texture: 'Heavy alluvial soil in Cauvery floodplains; red gravelly loam in upland blocks',
    phRange: '7.2 – 8.1',
    phCategory: 'Near-Neutral',
    waterBehavior: 'High retention in delta plains; drainage required after heavy rains',
    waterRetentionRisk: 'Moderate / Variable',
    priorityCrops: ['Banana (Grand Naine / Poovan)', 'Rice', 'Cotton', 'Onion'],
    climateContext: 'Cauvery Delta Transition (800-900 mm rainfall)',
    dominantRisks: 'Sigatoka leaf spot in banana; bacterial blight in rice; thrips and purple blotch in onion',
    managementSignal: 'Foliar spray with propiconazole 25% EC (1 ml/L) for Sigatoka; field sanitation.'
  },
  'The Nilgiris': {
    districtName: 'The Nilgiris',
    state: 'Tamil Nadu',
    soilType: 'Humic Laterite & Highland Peaty Loam',
    texture: 'Deep acidic loam with very high organic matter; porous and friable',
    phRange: '4.6 – 5.4',
    phCategory: 'Acidic',
    waterBehavior: 'Excellent drainage; susceptible to slope erosion during SW/NE monsoons',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Potato', 'Tea', 'Carrot', 'Cabbage', 'Garlic'],
    climateContext: 'High Altitude Hilly Zone (1500-2200 mm rainfall, cool 10-20°C)',
    dominantRisks: 'Late Blight (Phytophthora infestans) in potato; tea blister blight',
    managementSignal: 'Apply Mancozeb 75% WP (2 g/L) prophylactically; follow 15-day PHI; terrace farming.'
  },

  // Punjab Representative Districts
  'Jalandhar': {
    districtName: 'Jalandhar',
    state: 'Punjab',
    soilType: 'Indo-Gangetic Alluvial Loam',
    texture: 'Deep alluvial silt loam with neutral to slightly alkaline reaction',
    phRange: '7.2 – 7.9',
    phCategory: 'Near-Neutral',
    waterBehavior: 'Favorable moisture retention; canal and tube-well irrigated',
    waterRetentionRisk: 'Moderate / Variable',
    priorityCrops: ['Potato (Seed Hub)', 'Wheat', 'Rice', 'Maize'],
    climateContext: 'Northern Indo-Gangetic Plain (600-750 mm rainfall; cool fog winter)',
    dominantRisks: 'Late blight during December foggy swings; ground water depletion',
    managementSignal: 'Certified seed potato; preventive mancozeb sprays; monitor tuber rot in storage.'
  },
  'Hoshiarpur': {
    districtName: 'Hoshiarpur',
    state: 'Punjab',
    soilType: 'Kandi Sub-Mountainous Loam',
    texture: 'Coarse loamy sand to gravelly loam along Shivalik foothills',
    phRange: '7.0 – 7.6',
    phCategory: 'Near-Neutral',
    waterBehavior: 'Rapid drainage; erosion prone during monsoon torrents',
    waterRetentionRisk: 'Drought-Sensitive / Leaching',
    priorityCrops: ['Kinnow (Citrus)', 'Potato', 'Maize', 'Wheat'],
    climateContext: 'Sub-Mountainous Undulating Zone (800-1000 mm rainfall)',
    dominantRisks: 'Citrus canker; potato blight; sudden temperature dips',
    managementSignal: 'Drip irrigation; copper fungicide sprays; maintain green cover on slopes.'
  }
};

/**
 * Helper to retrieve a soil profile with automatic fallback
 */
export function getSoilProfileForDistrict(districtName: string): SoilProfile {
  if (DISTRICT_SOIL_PROFILES[districtName]) {
    return DISTRICT_SOIL_PROFILES[districtName];
  }

  // Graceful fallback for any unspecified district
  return {
    districtName: districtName || 'Regional Smallholder Plot',
    state: 'Karnataka',
    soilType: 'Red Loamy Soil (Regional Baseline)',
    texture: 'Medium-textured loam with iron-bearing granite weathering',
    phRange: '6.2 – 6.8',
    phCategory: 'Near-Neutral',
    waterBehavior: 'Moderate permeability; good aeration with split moisture needs',
    waterRetentionRisk: 'Moderate / Variable',
    priorityCrops: ['Tomato', 'Rice', 'Sugarcane', 'Banana', 'Potato'],
    climateContext: 'Agro-climatic South Indian Plateau (750-950 mm rainfall)',
    dominantRisks: 'Fungal leaf spot flare-ups under monsoon humidity swings',
    managementSignal: 'Incorporate organic matter, ensure field drainage, and use certified seed treatments.'
  };
}
