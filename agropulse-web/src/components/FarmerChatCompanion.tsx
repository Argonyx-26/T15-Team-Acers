import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Droplets,
  AlertTriangle
} from 'lucide-react';
import { RiskTelemetry } from '../services/riskService';
import { SoilProfile } from '../data/soilData';
import { TreatmentDetail, TREATMENTS_DATABASE } from './AICompanionDashboard';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  lang?: 'en' | 'kn' | 'hi';
  timestamp: string;
  intent?: string;
}

interface FarmerChatCompanionProps {
  currentCrop: string;
  targetClass: string;
  weatherTelemetry: RiskTelemetry | null;
  soilProfile: SoilProfile | null;
  activeLanguage: 'en' | 'kn' | 'hi';
  onLanguageChange: (lang: 'en' | 'kn' | 'hi') => void;
}

export const FarmerChatCompanion: React.FC<FarmerChatCompanionProps> = ({
  currentCrop,
  targetClass,
  weatherTelemetry,
  soilProfile,
  activeLanguage,
  onLanguageChange
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const treatment: TreatmentDetail = TREATMENTS_DATABASE[targetClass] || TREATMENTS_DATABASE['Rice___Bacterial_leaf_blight'];

  // Initialize Welcome Message
  useEffect(() => {
    const welcomeTexts = {
      en: `Namaste! I am your AgroPulse AI Agricultural Companion. I have diagnosed ${treatment.diseaseEn} on your ${currentCrop}. Ask me about 16L knapsack mixing math, spray timing with today's weather, organic alternatives, or safety instructions.`,
      kn: `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಆಗ್ರೋಪಲ್ಸ್ ಕೃಷಿ AI ಸಹಾಯಕ. ನಿಮ್ಮ ${currentCrop} ಬೆಳೆಯಲ್ಲಿ ${treatment.diseaseKn} ರೋಗ ಪತ್ತೆಯಾಗಿದೆ. ೧೬ ಲೀಟರ್ ಪಂಪಿಗೆ ಔಷಧಿ ಪ್ರಮಾಣ, ಇಂದಿನ ಮಳೆ ವಾತಾವರಣ, ಸಾವಯವ ಪರಿಹಾರ ಅಥವಾ ಸುರಕ್ಷತೆ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ.`,
      hi: `नमस्ते! मैं आपका एग्रोपल्स कृषि AI साथी हूँ। आपकी ${currentCrop} फसल में ${treatment.diseaseHi} की पहचान हुई है। १६ लीटर पंप की खुराक, आज के मौसम में स्प्रे का समय, जैविक उपाय या सुरक्षा नियमों के बारे में पूछें।`
    };

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: welcomeTexts[activeLanguage],
        lang: activeLanguage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [targetClass, currentCrop, activeLanguage]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Setup Web Speech Recognition for voice queries
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, [activeLanguage, targetClass, weatherTelemetry, soilProfile]);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech-to-Text is not supported by your browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = activeLanguage === 'kn' ? 'kn-IN' : activeLanguage === 'hi' ? 'hi-IN' : 'en-US';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Text-to-Speech Playback
  const handleSpeakMessage = (msgId: string, text: string, lang?: 'en' | 'kn' | 'hi') => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    const l = lang || activeLanguage;
    utterance.lang = l === 'kn' ? 'kn-IN' : l === 'hi' ? 'hi-IN' : 'en-US';

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingMessageId(msgId);
  };

  // Intelligent Conversational Intent Router
  const generateAIResponse = (query: string): { text: string; intent: string; lang: 'en' | 'kn' | 'hi' } => {
    const qLower = query.toLowerCase();
    let lang = activeLanguage;

    // Detect language in query
    if (/[ಅ-ಹ]/u.test(query)) lang = 'kn';
    else if (/[अ-ह]/u.test(query)) lang = 'hi';

    const wind = weatherTelemetry?.windSpeedKmH ?? 11.5;
    const rain = weatherTelemetry?.maxRainProbability ?? 20;
    const humidity = weatherTelemetry?.currentHumidity ?? 78;

    // 1. Knapsack Sprayer Dilution
    if (qLower.includes('knapsack') || qLower.includes('tank') || qLower.includes('16l') || qLower.includes('dose') || qLower.includes('scoop') || qLower.includes('dilution') || query.includes('ಪಂಪ್') || query.includes('ಪ್ರಮಾಣ') || query.includes('ಪಂಪಿಗೆ') || query.includes('पंप') || query.includes('मात्रा') || query.includes('खुराक')) {
      if (lang === 'kn') {
        return {
          text: `೧೬ ಲೀಟರ್ ನ್ಯಾಪ್‌ಸ್ಯಾಕ್ ಪಂಪಿಗೆ ಔಷಧದ ಪ್ರಮಾಣ: ${treatment.dosePer16LKnapsack}. ಎಕರೆಗೆ ಒಟ್ಟು ೨೦೦ ಲೀಟರ್ ನೀರಿಗೆ ಸುಮಾರು ೧೨ ರಿಂದ ೧೩ ಪಂಪ್ ಬೇಕಾಗುತ್ತದೆ. ಔಷಧವನ್ನು ಮೊದಲು ಸಣ್ಣ ಬಕೆಟ್ ನೀರಿನಲ್ಲಿ ಸಂಪೂರ್ಣವಾಗಿ ಕರಗಿಸಿ ನಂತರ ಪಂಪಿಗೆ ಹಾಕಿ ಚೆನ್ನಾಗಿ ಬೆರೆಸಿ.`,
          intent: 'knapsack_dilution',
          lang
        };
      }
      if (lang === 'hi') {
        return {
          text: `१६ लीटर नैपसैक पंप के लिए खुराक: ${treatment.dosePer16LKnapsack}। प्रति एकड़ २०० लीटर पानी के लिए लगभग १२ से १३ पंप की आवश्यकता होगी। दवा को पहले एक बाल्टी में घोल लें, फिर पंप में डालकर अच्छी तरह हिलाएं।`,
          intent: 'knapsack_dilution',
          lang
        };
      }
      return {
        text: `For a standard 16-Litre knapsack sprayer, add: ${treatment.dosePer16LKnapsack}. You will need approximately ${treatment.knapsackTanksPerAcre} to cover one acre (${treatment.waterPerAcre}). Always pre-dilute powders into a slurry in a bucket before pouring into the knapsack tank.`,
        intent: 'knapsack_dilution',
        lang
      };
    }

    // 2. Weather & Spray Timing Window
    if (qLower.includes('weather') || qLower.includes('rain') || qLower.includes('wind') || qLower.includes('spray today') || qLower.includes('tonight') || query.includes('ಮಳೆ') || query.includes('ಗಾಳಿ') || query.includes('ಸಿಂಪಡಿಸಬಹುದೇ') || query.includes('मौसम') || query.includes('बारिश') || query.includes('हवा') || query.includes('स्प्रे')) {
      const rainRisk = rain > 45;
      const windRisk = wind > 18.0;

      if (lang === 'kn') {
        if (rainRisk) {
          return {
            text: `ಇಂದು ಮಳೆಯ ಸಂಭವ ${rain}% ಇದೆ. ಸಿಂಪಡಿಸಿದ ೩-೪ ಗಂಟೆಗಳಲ್ಲಿ ಮಳೆ ಬಂದರೆ ಔಷಧ ತೊಳೆದುಹೋಗುತ್ತದೆ, ಆದ್ದರಿಂದ ಸಿಂಪರಣೆಯನ್ನು ಮುಂದೂಡಿ.`,
            intent: 'weather_timing',
            lang
          };
        }
        if (windRisk) {
          return {
            text: `ಗಾಳಿಯ ವೇಗ ${wind.toFixed(1)} km/h ಇದೆ (ಹೆಚ್ಚು). ಔಷಧ ಪಕ್ಕದ ಗದ್ದೆಗೆ ಹಾರುವ ಅಪಾಯವಿದೆ. ಸಂಜೆ ಗಾಳಿ ಕಡಿಮೆಯಾದ ನಂತರ ಸಿಂಪಡಿಸಿ.`,
            intent: 'weather_timing',
            lang
          };
        }
        return {
          text: `ಪ್ರಸ್ತುತ ಹವಾಮಾನವು ಸಿಂಪರಣೆಗೆ ಸುರಕ್ಷಿತವಾಗಿದೆ (ಗಾಳಿ: ${wind.toFixed(1)} km/h, ಆರ್ದ್ರತೆ: ${humidity}%). ಎಲೆಗಳ ಮೇಲಿನ ಇಬ್ಬನಿ ಒಣಗಿದ ನಂತರ ಸಿಂಪಡಿಸಿ.`,
          intent: 'weather_timing',
          lang
        };
      }

      if (lang === 'hi') {
        if (rainRisk) {
          return {
            text: `आज बारिश की संभावना ${rain}% है। छिड़काव के तुरंत बाद बारिश से दवा धुल जाएगी, इसलिए मौसम साफ होने तक रुकें।`,
            intent: 'weather_timing',
            lang
          };
        }
        if (windRisk) {
          return {
            text: `हवा की गति ${wind.toFixed(1)} km/h है। तेज हवा में स्प्रे बहकर अन्य पौधों पर जा सकता है। शाम को छिड़काव करें।`,
            intent: 'weather_timing',
            lang
          };
        }
        return {
          text: `मौसम छिड़काव के अनुकूल है (हवा: ${wind.toFixed(1)} km/h, आर्द्रता: ${humidity}%)। पत्तियों की ओस सूखने पर ही स्प्रे करें।`,
          intent: 'weather_timing',
          lang
        };
      }

      if (rainRisk) {
        return {
          text: `High rain risk detected (${rain}% probability). Rain within 3-4 hours after spraying washes away active chemical film. Hold off application until dry skies return.`,
          intent: 'weather_timing',
          lang
        };
      }
      if (windRisk) {
        return {
          text: `Wind speed is elevated (${wind.toFixed(1)} km/h). Spray droplets will drift away from target foliage. Postpone until evening calm (<15 km/h).`,
          intent: 'weather_timing',
          lang
        };
      }
      return {
        text: `Weather conditions are optimal for foliar application (Wind: ${wind.toFixed(1)} km/h, Humidity: ${humidity}%). Apply after morning dew has fully evaporated.`,
        intent: 'weather_timing',
        lang
      };
    }

    // 3. Organic & Cultural Alternatives
    if (qLower.includes('organic') || qLower.includes('natural') || qLower.includes('neem') || qLower.includes('bio') || qLower.includes('cow') || query.includes('ಸಾವಯವ') || query.includes('ಬೇವಿನ') || query.includes('ಜೈವಿಕ') || query.includes('जैविक') || query.includes('नीम') || query.includes('प्राकृतिक')) {
      if (lang === 'kn') {
        return {
          text: `ಸಾವಯವ ಪರಿಹಾರ: ${treatment.organicCurative} ಜೊತೆಗೆ ಕೃಷಿ ಪದ್ಧತಿ: ${treatment.preventivePractice}`,
          intent: 'organic_alternative',
          lang
        };
      }
      if (lang === 'hi') {
        return {
          text: `जैविक विकल्प: ${treatment.organicCurative} इसके अतिरिक्त: ${treatment.preventivePractice}`,
          intent: 'organic_alternative',
          lang
        };
      }
      return {
        text: `Organic / Biological Solution: ${treatment.organicCurative} Agronomic cultural practice: ${treatment.preventivePractice}`,
        intent: 'organic_alternative',
        lang
      };
    }

    // 4. Pre-Harvest Interval (PHI)
    if (qLower.includes('harvest') || qLower.includes('phi') || qLower.includes('wait') || qLower.includes('sell') || qLower.includes('eating') || query.includes('ಕೊಯ್ಲು') || query.includes('ಕಟಾವು') || query.includes('ಮಾರಾಟ') || query.includes('कटाई') || query.includes('तोड़')) {
      if (lang === 'kn') {
        return {
          text: `ಕಾಯುವ ಅವಧಿ (PHI): ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಿದ ನಂತರ ${treatment.waitingPeriodDays} ರವರೆಗೆ ಬೆಳೆಯನ್ನು ಕೊಯ್ಲು ಮಾಡಬಾರದು ಅಥವಾ ಮಾರಾಟ ಮಾಡಬಾರದು. ಇದು ಕೀಟನಾಶಕದ ವಿಷಾಂಶ ಮಾನವ ದೇಹ ಸೇರದಂತೆ ತಡೆಯುತ್ತದೆ.`,
          intent: 'phi',
          lang
        };
      }
      if (lang === 'hi') {
        return {
          text: `प्रतीक्षा अवधि (PHI): दवा छिड़कने के बाद ${treatment.waitingPeriodDays} तक फसल की कटाई या बिक्री न करें ताकि रासायनिक अवशेष पूरी तरह नष्ट हो जाएं।`,
          intent: 'phi',
          lang
        };
      }
      return {
        text: `Pre-Harvest Interval (PHI): You must strictly wait ${treatment.waitingPeriodDays} after spraying before harvesting for market sale or human consumption.`,
        intent: 'phi',
        lang
      };
    }

    // 5. Safety, Animals & Honeybees
    if (qLower.includes('safe') || qLower.includes('cow') || qLower.includes('cattle') || qLower.includes('animal') || qLower.includes('bee') || qLower.includes('ppe') || query.includes('ಸುರಕ್ಷತೆ') || query.includes('ಹಸು') || query.includes('ದನ') || query.includes('ಜೇನು') || query.includes('सुरक्षा') || query.includes('गाय') || query.includes('मधुमक्खी')) {
      if (lang === 'kn') {
        return {
          text: `ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆ: ${treatment.safetyPPE} ಜೇನುನೊಣಗಳ ಹಾರಾಟವಿರುವ ಬೆಳಗಿನ ಸಮಯದಲ್ಲಿ ಸಿಂಪಡಿಸಬೇಡಿ. ಸಿಂಪಡಿಸುವಾಗ ರಬ್ಬರ್ ಕೈಗವಸು ಮತ್ತು ಮಾಸ್ಕ್ ಧರಿಸಿ.`,
          intent: 'safety',
          lang
        };
      }
      if (lang === 'hi') {
        return {
          text: `सुरक्षा निर्देश: ${treatment.safetyPPE} जब मधुमक्खियां सक्रिय हों तब स्प्रे न करें। दस्ताने और फेस मास्क अवश्य पहनें।`,
          intent: 'safety',
          lang
        };
      }
      return {
        text: `Safety Advisory: ${treatment.safetyPPE} Never spray when pollinators (honeybees) are actively visiting blossoms in early morning.`,
        intent: 'safety',
        lang
      };
    }

    // 6. Default Fallback
    if (lang === 'kn') {
      return {
        text: `${treatment.diseaseKn} ರೋಗಕ್ಕೆ ಶಿಫಾರಸು ಮಾಡಲಾದ ಔಷಧ: ${treatment.chemicalName}. ಪ್ರಮಾಣ: ೧೬ ಲೀಟರ್ ಪಂಪಿಗೆ ${treatment.dosePer16LKnapsack} (ಎಕರೆಗೆ ${treatment.dosePerAcre}). ಕಾಯುವ ಅವಧಿ: ${treatment.waitingPeriodDays}.`,
        intent: 'general_guidance',
        lang
      };
    }
    if (lang === 'hi') {
      return {
        text: `${treatment.diseaseHi} के लिए अनुशंसित रसायन: ${treatment.chemicalName}। खुराक: १६ लीटर पंप में ${treatment.dosePer16LKnapsack} (प्रति एकड़ ${treatment.dosePerAcre})। प्रतीक्षा अवधि: ${treatment.waitingPeriodDays}।`,
        intent: 'general_guidance',
        lang
      };
    }
    return {
      text: `For ${treatment.diseaseEn}, the recommended product is ${treatment.chemicalName}. Knapsack rate: ${treatment.dosePer16LKnapsack} per 16L tank (Total: ${treatment.dosePerAcre} in ${treatment.waterPerAcre}). Waiting period is ${treatment.waitingPeriodDays}.`,
      intent: 'general_guidance',
      lang
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = generateAIResponse(query);
      const assistantMessage: Message = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: aiReply.text,
        lang: aiReply.lang,
        intent: aiReply.intent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 450);
  };

  const quickChips = [
    { label: activeLanguage === 'kn' ? '೧೬ ಲೀಟರ್ ಪಂಪಿಗೆ ಎಷ್ಟು?' : activeLanguage === 'hi' ? '१६ लीटर पंप में खुराक?' : 'Dose per 16L knapsack?', query: 'How much pesticide per 16L knapsack tank?' },
    { label: activeLanguage === 'kn' ? 'ಇಂದು ಮಳೆಯಲ್ಲಿ ಸಿಂಪಡಿಸಬಹುದೇ?' : activeLanguage === 'hi' ? 'क्या आज छिड़काव सुरक्षित है?' : 'Can I spray today?', query: 'Is weather suitable to spray today?' },
    { label: activeLanguage === 'kn' ? 'ಸಾವಯವ ಬೇವಿನ ಪರಿಹಾರವೇನು?' : activeLanguage === 'hi' ? 'जैविक नीम का विकल्प?' : 'Organic alternatives?', query: 'What organic and biological alternatives can I use?' },
    { label: activeLanguage === 'kn' ? 'ಕೊಯ್ಲು ಮಾಡಲು ಎಷ್ಟು ದಿನ ಕಾಯಬೇಕು?' : activeLanguage === 'hi' ? 'कटाई कब कर सकते हैं?' : 'Harvest waiting days?', query: 'When can I safely harvest the crop after spraying?' },
    { label: activeLanguage === 'kn' ? 'ದನಕರು ಮತ್ತು ಜೇನಿಗೆ ಸುರಕ್ಷಿತವೇ?' : activeLanguage === 'hi' ? 'पशुओं और मधुमक्खियों की सुरक्षा?' : 'Safety for cattle & bees?', query: 'Is this treatment safe for grazing cattle and honeybees?' }
  ];

  return (
    <div className="bg-[#141414] border border-[#2E2E2E] rounded-xl flex flex-col h-[520px] shadow-inner">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-[#2E2E2E] bg-[#1A1A1A] rounded-t-xl flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E95420] to-[#77216F] flex items-center justify-center text-white shadow">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white font-serif">AgroPulse Farmer Companion</h4>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-[#AEA79F] font-mono">
              Fused Context: {currentCrop} · {treatment.diseaseEn.split('(')[0]} · {soilProfile?.districtName}
            </p>
          </div>
        </div>

        {/* Language Quick Switch */}
        <div className="flex items-center gap-1 bg-[#111111] p-0.5 rounded-lg border border-[#2E2E2E]">
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              activeLanguage === 'en' ? 'bg-[#E95420] text-white font-bold' : 'text-[#AEA79F] hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('kn')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              activeLanguage === 'kn' ? 'bg-[#E95420] text-white font-bold' : 'text-[#AEA79F] hover:text-white'
            }`}
          >
            ಕನ್ನಡ
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('hi')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              activeLanguage === 'hi' ? 'bg-[#E95420] text-white font-bold' : 'text-[#AEA79F] hover:text-white'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-[#333333]">
        {messages.map((m) => {
          const isAssistant = m.sender === 'assistant';
          const isSpeaking = speakingMessageId === m.id;

          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-7 h-7 rounded-full bg-[#E95420]/20 border border-[#E95420]/40 flex items-center justify-center text-[#E95420] flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed relative group ${
                  isAssistant
                    ? 'bg-[#1E1E1E] text-white border border-[#2E2E2E] rounded-tl-sm'
                    : 'bg-[#E95420] text-white rounded-tr-sm shadow-md'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 border-t border-white/10 text-[9px] text-[#AEA79F]">
                  <span className="font-mono">{m.timestamp}</span>

                  {isAssistant && (
                    <button
                      type="button"
                      onClick={() => handleSpeakMessage(m.id, m.text, m.lang)}
                      className="text-[#AEA79F] hover:text-[#E95420] flex items-center gap-1 transition-colors"
                      title="Read advice aloud"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3 h-3 text-[#E95420] animate-pulse" />
                          <span className="text-[#E95420]">Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {!isAssistant && (
                <div className="w-7 h-7 rounded-full bg-[#333333] border border-[#444444] flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-[#AEA79F]" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#AEA79F]">
            <div className="w-6 h-6 rounded-full bg-[#E95420]/20 flex items-center justify-center text-[#E95420]">
              <Bot className="w-3 h-3" />
            </div>
            <div className="flex space-x-1 bg-[#1E1E1E] px-3 py-2 rounded-xl border border-[#2E2E2E]">
              <span className="w-1.5 h-1.5 bg-[#E95420] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-[#E95420] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-[#E95420] rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="px-3 py-2 bg-[#1A1A1A] border-t border-[#2E2E2E] overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
        {quickChips.map((chip, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendMessage(chip.query)}
            className="px-2.5 py-1 rounded-full bg-[#262626] hover:bg-[#E95420]/20 hover:border-[#E95420]/40 text-[#AEA79F] hover:text-white border border-[#333333] text-[10px] transition-all flex items-center gap-1 shrink-0"
          >
            <Sparkles className="w-2.5 h-2.5 text-[#E95420]" />
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[#1A1A1A] rounded-b-xl border-t border-[#2E2E2E] flex items-center gap-2">
        <button
          type="button"
          onClick={toggleVoiceRecording}
          title={isListening ? 'Stop listening' : 'Speak your question'}
          className={`p-2.5 rounded-lg border transition-all ${
            isListening
              ? 'bg-red-950/80 border-red-600 text-red-300 animate-pulse'
              : 'bg-[#262626] border-[#333333] text-[#AEA79F] hover:text-white hover:border-[#E95420]'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={
            activeLanguage === 'kn'
              ? 'ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...'
              : activeLanguage === 'hi'
              ? 'कृषि प्रश्न यहाँ लिखें...'
              : 'Ask AgroPulse AI about mixing, timing, or safety...'
          }
          className="flex-1 bg-[#111111] border border-[#333333] rounded-lg px-3 py-2 text-xs text-white placeholder-[#777777] focus:outline-none focus:border-[#E95420] transition-colors"
        />

        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className="p-2.5 rounded-lg bg-[#E95420] hover:bg-[#77216F] text-white disabled:opacity-40 transition-colors shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
