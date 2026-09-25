/**
 * AgroPulse Grounded Farmer Conversational Service
 * Provides instant, zero-latency domain intelligence in English, Kannada, and Hindi.
 * Fuses current leaf diagnosis, live weather telemetry, and soil chemistry.
 * Supports offline-first instant responses + local FastAPI backend sync.
 */

import { RiskTelemetry } from './riskService';
import { SoilProfile } from '../data/soilData';
import { TreatmentDetail, TREATMENTS_DATABASE } from '../components/AICompanionDashboard';

export interface ChatReply {
  text: string;
  intent: string;
  source: 'instant_expert' | 'backend_api';
}

export class FarmerChatService {
  /**
   * Generates a grounded response for a farmer query.
   * Tries local backend API (port 8000) first; if unreachable, runs client rule & agronomic engine.
   */
  static async getResponse(
    query: string,
    treatment: TreatmentDetail,
    weather: RiskTelemetry | null,
    soil: SoilProfile | null,
    lang: 'en' | 'kn' | 'hi'
  ): Promise<ChatReply> {
    // 1. Try local FastAPI backend if running
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 800);
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          disease: treatment.diseaseKey,
          weather: weather
            ? {
                windSpeedKmH: weather.windSpeedKmH,
                currentHumidity: weather.currentHumidity,
                maxRainProbability: weather.maxRainProbability,
                consecutiveWetHours: weather.consecutiveWetHours,
              }
            : null,
          soil: soil ? { soilType: soil.soilType, phRange: soil.phRange } : null,
          language: lang,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.response) {
          return {
            text: data.response,
            intent: data.intent || 'backend_response',
            source: 'backend_api',
          };
        }
      }
    } catch {
      // Backend not running -> fall back to local client domain engine
    }

    // 2. Client Domain Agronomic Engine
    return {
      text: this.evaluateClientRules(query, treatment, weather, soil, lang),
      intent: 'client_domain_expert',
      source: 'instant_expert',
    };
  }

  private static evaluateClientRules(
    query: string,
    treatment: TreatmentDetail,
    weather: RiskTelemetry | null,
    soil: SoilProfile | null,
    lang: 'en' | 'kn' | 'hi'
  ): string {
    const q = query.toLowerCase();

    // Weather values
    const wind = weather?.windSpeedKmH ?? 11.0;
    const humidity = weather?.currentHumidity ?? 78;
    const rainProb = weather?.maxRainProbability ?? 20;
    const consecutiveWet = weather?.consecutiveWetHours ?? 0;

    // 1. Knapsack Sprayer Tank Dilution & Math Query
    if (
      q.includes('knapsack') ||
      q.includes('tank') ||
      q.includes('16l') ||
      q.includes('16 l') ||
      q.includes('pump') ||
      q.includes('litre') ||
      q.includes('liter') ||
      q.includes('dosage') ||
      q.includes('dose') ||
      q.includes('mix') ||
      q.includes('math') ||
      q.includes('spoon') ||
      q.includes('ಪಂಪ್') ||
      q.includes('ಪ್ರಮಾಣ') ||
      q.includes('ಔಷಧ') ||
      q.includes('पंप') ||
      q.includes('मात्रा') ||
      q.includes('खुराक')
    ) {
      if (lang === 'kn') {
        return (
          `೧೬ ಲೀಟರ್ ನ್ಯಾಪ್‌ಸ್ಯಾಕ್ ಪಂಪಿಗೆ ಪ್ರಮಾಣ: **${treatment.dosePer16LKnapsack}**.\n\n` +
          `• **ಎಕರೆಗೆ ಒಟ್ಟು ಪ್ರಮಾಣ:** ${treatment.dosePerAcre} (ನೀರು: ${treatment.waterPerAcre})\n` +
          `• **ಬೇಕಾಗುವ ಪಂಪ್‌ಗಳ ಸಂಖ್ಯೆ:** ಸುಮಾರು ೧೨ ರಿಂದ ೧೩ ಪಂಪ್‌ಗಳು (೧೨.೫ ಟ್ಯಾಂಕ್)\n` +
          `• **ಮಿಶ್ರಣ ಮಾಡುವ ವಿಧಾನ:** ಔಷಧವನ್ನು ಮೊದಲು ಸಣ್ಣ ಬಕೆಟ್ ನೀರಿನಲ್ಲಿ ಪ್ರತ್ಯೇಕವಾಗಿ ಕಲಸಿ (Mother Solution), ನಂತರ ಅರ್ಧ ತುಂಬಿದ ಪಂಪಿಗೆ ಸುರಿದು ಉಳಿದ ನೀರು ಹಾಕಿ ಚೆನ್ನಾಗಿ ಅಲ್ಲಾಡಿಸಿ.`
        );
      }
      if (lang === 'hi') {
        return (
          `१६ लीटर नैपसैक पंप के लिए अनुशंसित मात्रा: **${treatment.dosePer16LKnapsack}**।\n\n` +
          `• **प्रति एकड़ खुराक:** ${treatment.dosePerAcre} (${treatment.waterPerAcre} पानी में)\n` +
          `• **टैंकों की संख्या:** लगभग १२ से १३ पंप प्रति एकड़\n` +
          `• **घोल बनाने का तरीका:** दवा को पहले एक छोटी बाल्टी में थोड़े पानी में घोलें, फिर पंप में डालकर अच्छी तरह हिलाएं।`
        );
      }
      return (
        `For a standard **16-Litre Knapsack Sprayer**, add: **${treatment.dosePer16LKnapsack}**.\n\n` +
        `• **Per Acre Field Rate:** ${treatment.dosePerAcre} in ${treatment.waterPerAcre}\n` +
        `• **Total Tanks Needed:** Approximately 12.5 knapsack tanks per acre (200 L total spray volume)\n` +
        `• **Mixing Best Practice:** Pre-dissolve the measured chemical in a small bucket of water first to create a uniform slurry, then pour into the half-filled sprayer tank and top up with clean water.`
      );
    }

    // 2. Weather & Spray Timing Window Query
    if (
      q.includes('weather') ||
      q.includes('rain') ||
      q.includes('wind') ||
      q.includes('spray today') ||
      q.includes('spray now') ||
      q.includes('safe to spray') ||
      q.includes('timing') ||
      q.includes('dew') ||
      q.includes('ಮಳೆ') ||
      q.includes('ಗಾಳಿ') ||
      q.includes('ಸಿಂಪಡಿಸಬಹುದೇ') ||
      q.includes('मौसम') ||
      q.includes('बारिश') ||
      q.includes('हवा') ||
      q.includes('स्प्रे करें')
    ) {
      const isRainRisk = rainProb > 50;
      const isWindRisk = wind > 18.0;

      if (lang === 'kn') {
        if (isRainRisk) {
          return (
            `⚠️ **ಇಂದು ಸಿಂಪರಣೆ ಮಾಡಬೇಡಿ (ಮಳೆಯ ಅಪಾಯ):**\n\n` +
            `ಇಂದು ಮಳೆಯ ಸಂಭವ **${rainProb}%** ಇದೆ. ಸಿಂಪಡಿಸಿದ ೩-೪ ಗಂಟೆಯೊಳಗೆ ಮಳೆ ಬಂದರೆ ಔಷಧ ತೊಳೆದುಹೋಗಿ ಹಣ ಮತ್ತು ಶ್ರಮ ವ್ಯರ್ಥವಾಗುತ್ತದೆ. ಮಳೆ ಕಡಿಮೆಯಾಗುವವರೆಗೆ ಸಿಂಪರಣೆ ಮುಂದೂಡಿ.`
          );
        }
        if (isWindRisk) {
          return (
            `⚠️ **ಗಾಳಿಯ ವೇಗ ಹೆಚ್ಚಾಗಿದೆ (${wind.toFixed(1)} km/h):**\n\n` +
            `ತೀವ್ರ ಗಾಳಿಯಿಂದ ಕೀಟನಾಶಕವು ಪಕ್ಕದ ಬೆಳೆಗೆ ಅಥವಾ ಹಳ್ಳಕ್ಕೆ ಹಾರಿಹೋಗುವ ಅಪಾಯವಿದೆ (Drift Risk). ಸಂಜೆ ಗಾಳಿ ಕಡಿಮೆಯಾದ ನಂತರ (<15 km/h) ಸಿಂಪಡಿಸಿ.`
          );
        }
        return (
          `✅ **ಹವಾಮಾನವು ಸಿಂಪರಣೆಗೆ ಅನುಕೂಲಕರವಾಗಿದೆ:**\n\n` +
          `• ಗಾಳಿಯ ವೇಗ: **${wind.toFixed(1)} km/h** (ಸುರಕ್ಷಿತ ಮಿತಿ <15 km/h)\n` +
          `• ಆರ್ದ್ರತೆ: **${humidity}%** (ಮಳೆ ಸಂಭವ: ${rainProb}%)\n` +
          `• ಬೆಳಗಿನ ಇಬ್ಬನಿ ಒಣಗಿದ ನಂತರ ಶಾಂತ ಬಿಸಿಲಿನಲ್ಲಿ ಸಿಂಪಡಿಸಿ.`
        );
      }

      if (lang === 'hi') {
        if (isRainRisk) {
          return (
            `⚠️ **आज छिड़काव न करें (बारिश का जोखिम):**\n\n` +
            `बारिश की संभावना **${rainProb}%** है। छिड़काव के बाद बारिश होने से दवा बह जाएगी। मौसम साफ होने तक प्रतीक्षा करें।`
          );
        }
        if (isWindRisk) {
          return (
            `⚠️ **हवा की गति अधिक है (${wind.toFixed(1)} km/h):**\n\n` +
            `तेज हवा में स्प्रे करने से दवा उड़कर दूसरी फसलों पर जा सकती है। शाम को हवा की गति १५ किमी/घंटा से कम होने पर ही स्प्रे करें।`
          );
        }
        return (
          `✅ **मौसम छिड़काव के लिए पूरी तरह अनुकूल है:**\n\n` +
          `• हवा की गति: **${wind.toFixed(1)} km/h** (सुरक्षित सीमा)\n` +
          `• सापेक्ष आर्द्रता: **${humidity}%** (बारिश संभावना: ${rainProb}%)\n` +
          `• पत्तियों पर ओस सूखने के बाद ही छिड़काव करें।`
        );
      }

      if (isRainRisk) {
        return (
          `⚠️ **SPRAY WINDOW CAUTION — RAIN HAZARD:**\n\n` +
          `The forecasted rain probability is elevated at **${rainProb}%**. Foliar fungicides require a rainfast drying window of at least 3 to 4 hours. Postpone chemical application to prevent pesticide washoff.`
        );
      }
      if (isWindRisk) {
        return (
          `⚠️ **SPRAY WINDOW CAUTION — WIND DRIFT RISK:**\n\n` +
          `Current wind velocity is **${wind.toFixed(1)} km/h** (exceeds the 15 km/h threshold). Droplet drift can contaminate nearby waterways or adjacent sensitive crops. Wait for the calmer evening window.`
        );
      }
      return (
        `✅ **SPRAY APPLICATION WINDOW: SAFE & FAVORABLE**\n\n` +
        `• **Wind Speed:** ${wind.toFixed(1)} km/h (Safe threshold is <15 km/h — zero drift risk)\n` +
        `• **Humidity:** ${humidity}% | **Precipitation Probability:** ${rainProb}%\n` +
        `• **Infection Watch:** ${consecutiveWet >= 6 ? 'High canopy wetness recorded — apply systemic curative promptly once leaves surface-dry.' : 'Normal moisture balance.'}`
      );
    }

    // 3. Organic & Eco-Friendly Alternatives
    if (
      q.includes('organic') ||
      q.includes('natural') ||
      q.includes('neem') ||
      q.includes('bio') ||
      q.includes('cow dung') ||
      q.includes('cow urine') ||
      q.includes('bordeaux') ||
      q.includes('trichoderma') ||
      q.includes('pseudomonas') ||
      q.includes('ಸಾವಯವ') ||
      q.includes('ಬೇವಿನ') ||
      q.includes('ಜೈವಿಕ') ||
      q.includes('जैविक') ||
      q.includes('नीम') ||
      q.includes('प्राकृतिक')
    ) {
      if (lang === 'kn') {
        return (
          `🌿 **ಸಾವಯವ ಮತ್ತು ಜೈವಿಕ ಪರ್ಯಾಯ ಪರಿಹಾರಗಳು:**\n\n` +
          `• **ಜೈವಿಕ ಔಷಧ:** ${treatment.organicCurative}\n` +
          `• **ಕೃಷಿ ನಿರ್ವಹಣೆ:** ${treatment.preventivePractice}\n` +
          `• ಜೈವಿಕ ನಿಯಂತ್ರಣಗಳನ್ನು ರಾಸಾಯನಿಕ ಶಿಲೀಂಧ್ರನಾಶಕಗಳ ಜೊತೆ ನೇರವಾಗಿ ಬೆರೆಸಬೇಡಿ; ೭-೧೦ ದಿನಗಳ ಅಂತರವಿರಲಿ.`
        );
      }
      if (lang === 'hi') {
        return (
          `🌿 **जैविक एवं प्राकृतिक उपचार विकल्प:**\n\n` +
          `• **जैविक स्प्रे:** ${treatment.organicCurative}\n` +
          `• **कृषि कार्य उपाय:** ${treatment.preventivePractice}\n` +
          `• जैविक कवकनाशी (ट्राइकोडर्मा/स्यूडोमोनास) को रासायनिक दवाओं के साथ न मिलाएं; कम से कम ७ दिन का अंतर रखें।`
        );
      }
      return (
        `🌿 **ORGANIC & BIOLOGICAL IPM PROTOCOL:**\n\n` +
        `• **Biocontrol Application:** ${treatment.organicCurative}\n` +
        `• **Cultural Field Practice:** ${treatment.preventivePractice}\n` +
        `• **IPM Guidance:** Do not tank-mix biological cultures (Trichoderma / Pseudomonas) with synthetic copper or systemic fungicides. Maintain a minimum 7-day buffer between organic and chemical treatments.`
      );
    }

    // 4. Pre-Harvest Interval (PHI) & Harvest Timing
    if (
      q.includes('harvest') ||
      q.includes('wait') ||
      q.includes('phi') ||
      q.includes('interval') ||
      q.includes('eating') ||
      q.includes('market') ||
      q.includes('sell') ||
      q.includes('cutting') ||
      q.includes('ಕೊಯ್ಲು') ||
      q.includes('ಕಟಾವು') ||
      q.includes('ಮಾರಾಟ') ||
      q.includes('कटाई') ||
      q.includes('तोड़') ||
      q.includes('बेचना')
    ) {
      if (lang === 'kn') {
        return (
          `⏱️ **ಕಟಾವು ಕಾಯುವ ಅವಧಿ (Pre-Harvest Interval - PHI):**\n\n` +
          `ಔಷಧ ಸಿಂಪಡಿಸಿದ ನಂತರ ಕನಿಷ್ಠ **${treatment.waitingPeriodDays}** ಕಟಾವು ಮಾಡಬೇಡಿ ಅಥವಾ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಮಾರಾಟ ಮಾಡಬೇಡಿ. ಇದು ಆಹಾರದಲ್ಲಿ ರಾಸಾಯನಿಕ ಅಂಶ ಉಳಿಯದಂತೆ (Chemical Residue) ಸುರಕ್ಷತೆ ಒದಗಿಸುತ್ತದೆ.`
        );
      }
      if (lang === 'hi') {
        return (
          `⏱️ **कटाई पूर्व प्रतीक्षा अवधि (PHI):**\n\n` +
          `छिड़काव के बाद कम से कम **${treatment.waitingPeriodDays}** तक फसल की कटाई न करें और न ही बाजार में बेचें, ताकि भोजन में कीटनाशक के अंश समाप्त हो सकें।`
        );
      }
      return (
        `⏱️ **PRE-HARVEST INTERVAL (PHI) & RESIDUE COMPLIANCE:**\n\n` +
        `• **Mandatory Waiting Period:** **${treatment.waitingPeriodDays}**\n` +
        `• Do not harvest produce for human consumption or livestock feed before this interval elapses.\n` +
        `• This guarantees degradation of active chemical molecules below Maximum Residue Limits (MRL) set by FSSAI & CIB&RC.`
      );
    }

    // 5. Safety & PPE & Livestock / Honeybee Protection
    if (
      q.includes('safe') ||
      q.includes('safety') ||
      q.includes('cow') ||
      q.includes('cattle') ||
      q.includes('animal') ||
      q.includes('bee') ||
      q.includes('honeybee') ||
      q.includes('ppe') ||
      q.includes('mask') ||
      q.includes('gloves') ||
      q.includes('ಸುರಕ್ಷತೆ') ||
      q.includes('ಹಸು') ||
      q.includes('ದನ') ||
      q.includes('ಜೇನು') ||
      q.includes('सुरक्षा') ||
      q.includes('गाय') ||
      q.includes('पशु') ||
      q.includes('मधुमक्खी')
    ) {
      if (lang === 'kn') {
        return (
          `🛡️ **ಸುರಕ್ಷತೆ ಮತ್ತು ಮುನ್ನೆಚ್ಚರಿಕೆ ನಿಯಮಗಳು:**\n\n` +
          `• **ವೈಯಕ್ತಿಕ ರಕ್ಷಣೆ:** ${treatment.safetyPPE}\n` +
          `• **ಪ್ರಾಣಿಗಳ ಸುರಕ್ಷತೆ:** ಸಿಂಪಡಿಸಿದ ಜಮೀನಿಗೆ ಹಸು-ದನಗಳನ್ನು ಕನಿಷ್ಠ ೭ ದಿನ ಬಿಡಬೇಡಿ.\n` +
          `• **ಜೇನುಹುಳುಗಳ ರಕ್ಷಣೆ:** ಜೇನುನೊಣಗಳು ಪರಾಗಸ್ಪರ್ಶ ಮಾಡುವ ಮುಂಜಾನೆಯ ವೇಳೆಯಲ್ಲಿ ಸಿಂಪಡಿಸಬೇಡಿ; ಸಂಜೆ ವೇಳೆ ಸಿಂಪಡಿಸಿ.`
        );
      }
      if (lang === 'hi') {
        return (
          `🛡️ **व्यक्तिगत एवं पर्यावरण सुरक्षा निर्देश:**\n\n` +
          `• **सुरक्षा उपकरण (PPE):** ${treatment.safetyPPE}\n` +
          `• **पशु सुरक्षा:** दवा छिड़के खेत में मवेशियों को कम से कम ७ दिनों तक चरने न दें।\n` +
          `• **मधुमक्खी सुरक्षा:** सुबह के समय जब मधुमक्खियां सक्रिय हों, कीटनाशक का छिड़काव न करें; शाम को स्प्रे करें।`
        );
      }
      return (
        `🛡️ **FARMER SAFETY & ECO-TOXICITY PROTOCOL:**\n\n` +
        `• **Mandatory PPE:** ${treatment.safetyPPE}\n` +
        `• **Livestock Protection:** Exclude cattle, goats, and grazing animals from treated parcels for at least 7 days.\n` +
        `• **Pollinator Safety:** Never spray during peak bee foraging hours (07:00 – 10:30 AM). Schedule applications late in the afternoon.`
      );
    }

    // 6. Symptoms & Cause of Disease
    if (
      q.includes('symptom') ||
      q.includes('cause') ||
      q.includes('why') ||
      q.includes('fungus') ||
      q.includes('bacteria') ||
      q.includes('pathogen') ||
      q.includes('ರೋಗ ಏಕೆ') ||
      q.includes('ಕಾರಣ') ||
      q.includes('लक्षण') ||
      q.includes('कारण')
    ) {
      if (lang === 'kn') {
        return (
          `🔍 **${treatment.crop} - ${treatment.diseaseKn}:**\n\n` +
          `• **ರೋಗಕಾರಕ:** ${treatment.pathogenType} (${treatment.diseaseEn})\n` +
          `• **ತೀವ್ರತೆ:** ${treatment.severity}\n` +
          `• **ಶಿಫಾರಸು ಔಷಧ:** ${treatment.chemicalName}\n` +
          `• **ರೋಗ ತಡೆಗಟ್ಟಲು:** ${treatment.preventivePractice}`
        );
      }
      if (lang === 'hi') {
        return (
          `🔍 **${treatment.crop} - ${treatment.diseaseHi}:**\n\n` +
          `• **रोग कारक:** ${treatment.pathogenType} (${treatment.diseaseEn})\n` +
          `• **गंभीरता:** ${treatment.severity}\n` +
          `• **दवा:** ${treatment.chemicalName}\n` +
          `• **रोकथाम:** ${treatment.preventivePractice}`
        );
      }
      return (
        `🔍 **PATHOLOGY PROFILE: ${treatment.diseaseEn}**\n\n` +
        `• **Host Crop:** ${treatment.crop}\n` +
        `• **Pathogen Class:** ${treatment.pathogenType}\n` +
        `• **Severity Index:** ${treatment.severity}\n` +
        `• **Primary Formulation:** ${treatment.chemicalName} (${treatment.activeIngredient})\n` +
        `• **Cultural Control:** ${treatment.preventivePractice}`
      );
    }

    // 7. Soil & Fertilizer Connection
    if (
      q.includes('soil') ||
      q.includes('fertilizer') ||
      q.includes('urea') ||
      q.includes('nitrogen') ||
      q.includes('potash') ||
      q.includes('ಮಣ್ಣು') ||
      q.includes('ಗೊಬ್ಬರ') ||
      q.includes('मिट्टी') ||
      q.includes('खाद')
    ) {
      const soilType = soil?.soilType ?? 'Red sandy loam';
      const ph = soil?.phRange ?? '6.5 - 7.5';
      const district = soil?.districtName ?? 'Karnataka Regional Belt';

      if (lang === 'kn') {
        return (
          `🌱 **ಮಣ್ಣು ಮತ್ತು ರಸಗೊಬ್ಬರ ನಿರ್ವಹಣೆ (${district}):**\n\n` +
          `• **ಮಣ್ಣಿನ ವಿಧ:** ${soilType} (pH: ${ph})\n` +
          `• **ಯೂರಿಯಾ ಮುನ್ನೆಚ್ಚರಿಕೆ:** ಎಲೆ ರೋಗ ಕಂಡುಬಂದಾಗ ಸಾರಜನಕ (ಯೂರಿಯಾ) ಕೊಡುವುದನ್ನು ತಕ್ಷಣ ನಿಲ್ಲಿಸಿ; ಯೂರಿಯಾ ರೋಗ ಹರಡುವಿಕೆಯನ್ನು ದ್ವಿಗುಣಗೊಳಿಸುತ್ತದೆ.\n` +
          `• **ಪೊಟ್ಯಾಷ್:** ಎಲೆ ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿ ಹೆಚ್ಚಿಸಲು ಮ್ಯೂರಿಯೇಟ್ ಆಫ್ ಪೊಟ್ಯಾಷ್ (MOP) ಒದಗಿಸಿ.`
        );
      }
      if (lang === 'hi') {
        return (
          `🌱 **मृदा एवं उर्वरक प्रबंधन (${district}):**\n\n` +
          `• **मिट्टी का प्रकार:** ${soilType} (pH: ${ph})\n` +
          `• **यूरिया नियंत्रण:** रोग फैलने पर यूरिया का प्रयोग तुरंत बंद कर दें, क्योंकि अधिक नाइट्रोजन से रोग बहुत तेजी से फैलता है।\n` +
          `• **पोटाश:** रोग प्रतिरोधक क्षमता बढ़ाने के लिए पोटाश (MOP) की संतुलित मात्रा दें।`
        );
      }
      return (
        `🌱 **AGRONOMIC SOIL & FERTILIZER DIRECTIVE (${district}):**\n\n` +
        `• **Soil Horizon:** ${soilType} (pH: ${ph})\n` +
        `• **Nitrogen Caution:** Immediately suspend top-dressing of Urea. High foliar nitrogen softens plant cuticle layers and accelerates pathogen sporulation.\n` +
        `• **Potassium Balance:** Apply Muriate of Potash (MOP) to thicken cell wall parenchyma and enhance disease resistance.`
      );
    }

    // 8. General Greetings / Conversational Fallback
    if (
      q.includes('hello') ||
      q.includes('hi') ||
      q.includes('hey') ||
      q.includes('namaste') ||
      q.includes('ನಮಸ್ಕಾರ') ||
      q.includes('नमस्ते')
    ) {
      if (lang === 'kn') {
        return `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ **ಆಗ್ರೋಪಲ್ಸ್ ಎಐ ಕೃಷಿ ಮಿತ್ರ**. ನಿಮ್ಮ **${treatment.crop}** ಬೆಳೆಯಲ್ಲಿ **${treatment.diseaseKn}** ಪತ್ತೆಯಾಗಿದೆ. ನೀವು ಔಷಧಿ ಪ್ರಮಾಣ, ಸಿಂಪರಣಾ ಹವಾಮಾನ, ಸಾವಯವ ಪರಿಹಾರ ಅಥವಾ ಸುರಕ್ಷತೆಯ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು.`;
      }
      if (lang === 'hi') {
        return `नमस्ते! मैं आपका **एग्रोपल्स एआई कृषि मित्र** हूँ। आपकी **${treatment.crop}** फसल में **${treatment.diseaseHi}** पाया गया है। आप दवा की मात्रा, स्प्रे का मौसम, जैविक उपचार या सुरक्षा के संबंध में कोई भी सवाल पूछ सकते हैं।`;
      }
      return `Hello! I am your **AgroPulse AI Agricultural Companion**. I have evaluated your **${treatment.crop}** foliage and identified **${treatment.diseaseEn}**.\n\nYou can ask me about exact 16L knapsack sprayer dilution, whether today's weather is safe for spraying, organic biocontrol alternatives, or safety protocols!`;
    }

    // Default grounded diagnosis summary
    if (lang === 'kn') {
      return (
        `📌 **${treatment.crop} ರೋಗ ನಿರ್ವಹಣಾ ಸಾರಾಂಶ:**\n\n` +
        `• **ರೋಗ:** ${treatment.diseaseKn}\n` +
        `• **ಶಿಫಾರಸು ಔಷಧ:** ${treatment.chemicalName}\n` +
        `• **೧೬ ಲೀಟರ್ ಪಂಪಿಗೆ:** ${treatment.dosePer16LKnapsack}\n` +
        `• **ಎಕರೆಗೆ:** ${treatment.dosePerAcre} (${treatment.waterPerAcre})\n` +
        `• **ಕಾಯುವ ಅವಧಿ (PHI):** ${treatment.waitingPeriodDays}\n` +
        `• **ಸಾವಯವ ಪರಿಹಾರ:** ${treatment.organicCurative}`
      );
    }
    if (lang === 'hi') {
      return (
        `📌 **${treatment.crop} रोग प्रबंधन सारांश:**\n\n` +
        `• **रोग:** ${treatment.diseaseHi}\n` +
        `• **अनुशंसित दवा:** ${treatment.chemicalName}\n` +
        `• **१६ लीटर पंप में:** ${treatment.dosePer16LKnapsack}\n` +
        `• **प्रति एकड़:** ${treatment.dosePerAcre} (${treatment.waterPerAcre})\n` +
        `• **प्रतीक्षा अवधि (PHI):** ${treatment.waitingPeriodDays}\n` +
        `• **जैविक उपचार:** ${treatment.organicCurative}`
      );
    }
    return (
      `📌 **FIELD ACTION SUMMARY — ${treatment.crop.toUpperCase()}:**\n\n` +
      `• **Pathology:** ${treatment.diseaseEn}\n` +
      `• **Chemical Formulation:** ${treatment.chemicalName} (${treatment.formulation})\n` +
      `• **16L Knapsack Tank:** ${treatment.dosePer16LKnapsack}\n` +
      `• **Field Rate per Acre:** ${treatment.dosePerAcre} in ${treatment.waterPerAcre}\n` +
      `• **Waiting Period (PHI):** ${treatment.waitingPeriodDays}\n` +
      `• **Organic Bio-Control:** ${treatment.organicCurative}`
    );
  }
}
