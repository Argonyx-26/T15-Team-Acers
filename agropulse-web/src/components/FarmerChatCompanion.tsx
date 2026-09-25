/**
 * FarmerChatCompanion — Real LLM & Grounded Agricultural Chat Assistant.
 *
 * Architecture:
 *  • Dual-Engine Design:
 *      1. Instant Grounded Expert Engine: zero wait, 100% offline, exact knapsack math & live weather spray window.
 *      2. In-Browser Neural LLM (SmolLM2-360M-Instruct): streaming WebWorker tokens for freeform natural conversation.
 *  • Multilingual: English, Kannada (ಕನ್ನಡ), and Hindi (हिन्दी).
 *  • Always interactive: farmers can chat immediately without waiting for model download!
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { RiskTelemetry } from '../services/riskService';
import { SoilProfile } from '../data/soilData';
import { TreatmentDetail, TREATMENTS_DATABASE } from './AICompanionDashboard';
import { useLLMChat, ChatMessage } from '../hooks/useLLMChat';
import { FarmerChatService } from '../services/farmerChatService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  source?: 'llm' | 'instant_expert';
}

interface Props {
  currentCrop: string;
  targetClass: string;
  weatherTelemetry: RiskTelemetry | null;
  soilProfile: SoilProfile | null;
  activeLanguage: 'en' | 'kn' | 'hi';
  onLanguageChange: (lang: 'en' | 'kn' | 'hi') => void;
}

/* ── System Prompt Builder for SmolLM2 ───────────────────────────────── */
function buildSystemPrompt(
  treatment: TreatmentDetail,
  weather: RiskTelemetry | null,
  soil: SoilProfile | null,
  lang: 'en' | 'kn' | 'hi'
): string {
  const langName = lang === 'kn' ? 'Kannada' : lang === 'hi' ? 'Hindi' : 'English';

  return `You are AgroPulse AI, an expert agricultural companion for farmers in Karnataka and Southern India.
You provide precise, practical, and grounded crop advice.

DIAGNOSED SPECIMEN CONTEXT:
- Crop: ${treatment.crop}
- Diagnosis: ${treatment.diseaseEn}
- Pathogen: ${treatment.pathogenType}
- Severity: ${treatment.severity}
- Chemical: ${treatment.chemicalName}
- Dose per Acre: ${treatment.dosePerAcre} in ${treatment.waterPerAcre}
- 16L Knapsack Sprayer Dose: ${treatment.dosePer16LKnapsack}
- Pre-Harvest Interval (PHI): ${treatment.waitingPeriodDays}
- Safety PPE: ${treatment.safetyPPE}
- Organic Option: ${treatment.organicCurative}
- Cultural Practice: ${treatment.preventivePractice}

LIVE WEATHER TELEMETRY:
- Temp: ${weather?.currentTemperature?.toFixed(1) ?? '28'}°C
- Humidity: ${weather?.currentHumidity ?? 75}%
- Wind: ${weather?.windSpeedKmH?.toFixed(1) ?? '10.5'} km/h (${(weather?.windSpeedKmH ?? 10) < 15 ? 'SAFE for spraying' : 'CAUTION high wind drift'})
- Rain Chance: ${weather?.maxRainProbability ?? 20}% (${(weather?.maxRainProbability ?? 20) > 50 ? 'RAIN RISK - delay spray' : 'Low rain risk'})

SOIL PROFILE (${soil?.districtName ?? 'Field'}):
- Soil Type: ${soil?.soilType ?? 'Sandy loam'}
- pH: ${soil?.phRange ?? '6.5-7.5'}

INSTRUCTIONS:
1. Respond in ${langName}.
2. Keep answers concise, clear, and farmer-oriented.
3. For dosages, state exact measurements step-by-step.
4. If asked about spraying today, correlate directly with wind and rain telemetry.
5. Offer organic alternatives when requested.`;
}

/* ── Quick-reply chips ────────────────────────────────────────────────── */
const QUICK_CHIPS = {
  en: [
    'How do I mix for my 16L sprayer?',
    'Is today safe for spraying?',
    'What are the organic alternatives?',
    'How many days before harvest can I spray?',
    'What PPE do I need?',
    'What caused this disease?',
  ],
  kn: [
    '೧೬ ಲೀಟರ್ ಪಂಪಿಗೆ ಔಷಧಿ ಎಷ್ಟು?',
    'ಇಂದು ಸಿಂಪಡಿಸಬಹುದೇ?',
    'ಸಾವಯವ ಪರಿಹಾರ ಏನು?',
    'ಕಟಾವಿಗೆ ಎಷ್ಟು ದಿನ ಮುಂಚೆ ಸಿಂಪಡಿಸಬೇಕು?',
    'ಯಾವ ಸುರಕ್ಷತಾ ಸಲಕರಣೆ ಬೇಕು?',
    'ಈ ರೋಗ ಏಕೆ ಬಂತು?',
  ],
  hi: [
    '16 लीटर पंप के लिए मात्रा क्या है?',
    'क्या आज स्प्रे करना सुरक्षित है?',
    'जैविक विकल्प क्या हैं?',
    'कटाई से कितने दिन पहले स्प्रे करें?',
    'कौन सी सुरक्षा सामग्री चाहिए?',
    'यह रोग क्यों लगा?',
  ],
};

export const FarmerChatCompanion: React.FC<Props> = ({
  currentCrop,
  targetClass,
  weatherTelemetry,
  soilProfile,
  activeLanguage,
  onLanguageChange,
}) => {
  const treatment: TreatmentDetail =
    TREATMENTS_DATABASE[targetClass] ??
    TREATMENTS_DATABASE['Rice___Bacterial_leaf_blight'];

  const { load, chat, status: llmStatus, statusText, isGenerating, modelReady } = useLLMChat();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [hasRequestedModel, setHasRequestedModel] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const historyRef = useRef<ChatMessage[]>([]);

  /* Auto-scroll on new message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingId]);

  /* Reset messages on new leaf diagnosis */
  useEffect(() => {
    historyRef.current = [];
    let welcomeText = '';
    if (!targetClass) {
      welcomeText =
        activeLanguage === 'kn'
          ? `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ **ಆಗ್ರೋಪಲ್ಸ್ ಎಐ ಕೃಷಿ ಮಿತ್ರ**.\n\nಮೇಲೆ ನಿಮ್ಮ ಬೆಳೆಯ ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಲೈವ್ ಕ್ಯಾಮೆರಾದಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.\n\nನಾನು ರೋಗವನ್ನು ಪತ್ತೆಹಚ್ಚಿ, ನಿಖರವಾದ ಕೀಟನಾಶಕ ಪ್ರಮಾಣ, ಸಿಂಪರಣಾ ಹವಾಮಾನ ಹಾಗೂ ಸಾವಯವ ಸಲಹೆಗಳನ್ನು ನೀಡುತ್ತೇನೆ!`
          : activeLanguage === 'hi'
          ? `नमस्ते! मैं आपका **एग्रोपल्स एआई कृषि मित्र** हूँ।\n\nकृपया ऊपर अपनी फसल की पत्ती की फोटो अपलोड करें या लाइव कैमरे से स्कैन करें।\n\nमैं तुरंत रोग पहचानकर कीटनाशक की मात्रा, स्प्रे का मौसम एवं जैविक उपचार बताऊंगा!`
          : `👋 Welcome! I am your **AgroPulse AI Companion**.\n\nPlease upload or capture a leaf photo above in Box 1.\n\nI will instantly identify your crop, diagnose foliar diseases, calculate 16L knapsack dilution ratios, check local spray weather, and guide you on safe application!`;
    } else {
      welcomeText =
        activeLanguage === 'kn'
          ? `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ **ಆಗ್ರೋಪಲ್ಸ್ ಎಐ ಕೃಷಿ ಮಿತ್ರ**.\n\nನಿಮ್ಮ **${treatment.crop}** ಬೆಳೆಯಲ್ಲಿ **${treatment.diseaseKn}** ಪತ್ತೆಯಾಗಿದೆ.\n\n೧೬ ಲೀಟರ್ ಪಂಪಿನ ಔಷಧ ಪ್ರಮಾಣ, ಸಿಂಪರಣಾ ಹವಾಮಾನ, ಎಲ್ಲಿ ಖರೀದಿಸಬೇಕು ಅಥವಾ ಸಾವಯವ ಪರಿಹಾರಗಳ ಬಗ್ಗೆ ಕೆಳಗೆ ನೇರವಾಗಿ ಕೇಳಿ.`
          : activeLanguage === 'hi'
          ? `नमस्ते! मैं आपका **एग्रोपल्स एआई कृषि मित्र** हूँ।\n\nआपकी **${treatment.crop}** फसल में **${treatment.diseaseHi}** पाया गया है।\n\n१६ लीटर पंप की खुराक, स्प्रे के लिए मौसम, दवा कहाँ से खरीदें या जैविक उपचार के बारे में नीचे बेझिझक पूछें।`
          : `👋 Welcome! I am your **AgroPulse AI Companion**.\n\nI have analyzed your **${treatment.crop}** foliage and identified **${treatment.diseaseEn}**.\n\nAsk me anytime about 16L knapsack mixing math, today's spray weather window, where to buy certified treatments, or organic biocontrol alternatives.`;
    }

    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: welcomeText,
        timestamp: now(),
        source: 'instant_expert',
      },
    ]);
  }, [targetClass, activeLanguage]);

  /* ── Load model on user request ────────────────────────────────────── */
  const handleLoadModel = () => {
    setHasRequestedModel(true);
    load();
  };

  /* ── Send message ─────────────────────────────────────────────────── */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isGenerating) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: now(),
      };

      const assistantId = `a-${Date.now()}`;
      setInput('');

      // If Neural LLM is ready, use it with streaming
      if (modelReady) {
        const assistantPlaceholder: Message = {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: now(),
          isStreaming: true,
          source: 'llm',
        };

        setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
        setStreamingId(assistantId);
        historyRef.current.push({ role: 'user', content: trimmed });

        const systemPrompt = buildSystemPrompt(
          treatment,
          weatherTelemetry,
          soilProfile,
          activeLanguage
        );
        const history: ChatMessage[] = [
          { role: 'system', content: systemPrompt },
          ...historyRef.current.slice(-8),
          { role: 'user', content: trimmed },
        ];

        chat(
          history,
          (_delta, full) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: full, isStreaming: true } : m
              )
            );
          },
          (full) => {
            const finalText = full || 'Response completed.';
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: finalText, isStreaming: false, source: 'llm' }
                  : m
              )
            );
            setStreamingId(null);
            historyRef.current.push({ role: 'assistant', content: finalText });
          },
          380
        );
        return;
      }

      // If LLM not loaded, provide instant grounded agricultural response
      const assistantPlaceholder: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: now(),
        isStreaming: true,
        source: 'instant_expert',
      };

      setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
      setStreamingId(assistantId);

      try {
        const reply = await FarmerChatService.getResponse(
          trimmed,
          treatment,
          weatherTelemetry,
          soilProfile,
          activeLanguage
        );

        // Smooth streaming animation effect
        const fullText = reply.text;
        let charIndex = 0;
        const interval = setInterval(() => {
          charIndex += Math.max(3, Math.floor(fullText.length / 30));
          if (charIndex >= fullText.length) {
            clearInterval(interval);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: fullText, isStreaming: false, source: 'instant_expert' }
                  : m
              )
            );
            setStreamingId(null);
          } else {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: fullText.slice(0, charIndex), isStreaming: true }
                  : m
              )
            );
          }
        }, 15);
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    'AgroPulse AI encountered a temporary issue. Please try again.',
                  isStreaming: false,
                }
              : m
          )
        );
        setStreamingId(null);
      }
    },
    [
      chat,
      isGenerating,
      modelReady,
      treatment,
      weatherTelemetry,
      soilProfile,
      activeLanguage,
    ]
  );

  /* ── Voice input ──────────────────────────────────────────────────── */
  const toggleVoice = () => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const rec = new SR();
    rec.lang =
      activeLanguage === 'kn'
        ? 'kn-IN'
        : activeLanguage === 'hi'
        ? 'hi-IN'
        : 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      sendMessage(transcript);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  /* ── Keyboard send ─────────────────────────────────────────────────── */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const chips = QUICK_CHIPS[activeLanguage];

  return (
    <div className="flex flex-col h-full min-h-[580px] bg-[#141414] rounded-xl border border-[#2E2E2E] overflow-hidden shadow-xl">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-[#2E2E2E]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E95420]/15 border border-[#E95420]/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#E95420]" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              AgroPulse AI Companion
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                  modelReady
                    ? 'bg-emerald-950/70 border-emerald-700 text-emerald-400'
                    : llmStatus === 'loading'
                    ? 'bg-amber-950/70 border-amber-700 text-amber-400'
                    : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                }`}
              >
                {modelReady
                  ? '● Neural LLM (SmolLM2-360M)'
                  : llmStatus === 'loading'
                  ? '● Downloading 360M LLM…'
                  : '● Grounded Expert AI'}
              </span>
            </div>
            <div className="text-[10px] text-[#AEA79F] flex items-center gap-1.5">
              <span>{treatment.crop}: {treatment.diseaseEn.split('(')[0].trim()}</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">Instant Responses Active</span>
            </div>
          </div>
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-1 bg-[#111111] p-1 rounded-lg border border-[#2E2E2E]">
          {(['en', 'kn', 'hi'] as const).map((lng) => (
            <button
              key={lng}
              onClick={() => onLanguageChange(lng)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                activeLanguage === lng
                  ? 'bg-[#E95420] text-white shadow-sm'
                  : 'text-[#AEA79F] hover:text-white'
              }`}
            >
              {lng === 'en' ? 'EN' : lng === 'kn' ? 'ಕನ್ನಡ' : 'हिन्दी'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Status Bar / Model Download Banner ──────────────────────── */}
      {!hasRequestedModel && !modelReady && (
        <div className="px-4 py-2 bg-[#1A1A1A] border-b border-[#2E2E2E] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#AEA79F]">
            <Sparkles className="w-3.5 h-3.5 text-[#E95420]" />
            <span>
              Instant agronomic answers active. Want freeform conversational LLM?
            </span>
          </div>
          <button
            onClick={handleLoadModel}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#262626] hover:bg-[#333333] border border-[#3E3E3E] text-white text-[11px] font-semibold transition-colors"
          >
            <Download className="w-3 h-3 text-[#E95420]" />
            Load SmolLM2 (360M)
          </button>
        </div>
      )}

      {hasRequestedModel && !modelReady && (
        <div className="px-4 py-2 bg-amber-950/30 border-b border-amber-800/40 text-xs flex items-center justify-between text-amber-300">
          <div className="flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{statusText || 'Downloading SmolLM2-360M neural model…'}</span>
          </div>
          <span className="text-[10px] text-amber-400/80">
            You can keep chatting below!
          </span>
        </div>
      )}

      {/* ── Chat messages ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
                msg.role === 'assistant'
                  ? 'bg-[#E95420]/20 border border-[#E95420]/40'
                  : 'bg-[#2E2E2E] border border-[#3A3A3A]'
              }`}
            >
              {msg.role === 'assistant' ? (
                <Bot className="w-3.5 h-3.5 text-[#E95420]" />
              ) : (
                <User className="w-3.5 h-3.5 text-[#AEA79F]" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative group ${
                msg.role === 'user'
                  ? 'bg-[#E95420] text-white rounded-tr-sm shadow-md'
                  : 'bg-[#1E1E1E] border border-[#2E2E2E] text-[#E8E8E8] rounded-tl-sm'
              }`}
            >
              {/* Message Content with bold highlights */}
              <div className="whitespace-pre-wrap break-words">
                {msg.content.split(/\*\*(.+?)\*\*/g).map((part, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="text-white font-semibold">
                      {part}
                    </strong>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>

              {/* Streaming cursor */}
              {msg.isStreaming && (
                <span className="inline-block w-2 h-4 bg-[#E95420] ml-1 animate-pulse rounded-sm align-middle" />
              )}

              {/* Footer row with timestamp and source badge */}
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5 text-[10px]">
                <span
                  className={msg.role === 'user' ? 'text-orange-200' : 'text-[#666]'}
                >
                  {msg.timestamp}
                </span>

                {msg.role === 'assistant' && !msg.isStreaming && (
                  <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] text-[#777]">
                      {msg.source === 'llm' ? 'SmolLM2-360M' : 'AgroPulse Domain Engine'}
                    </span>
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="p-1 hover:text-white rounded"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {isGenerating && !streamingId && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#E95420]/20 border border-[#E95420]/40 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-[#E95420]" />
            </div>
            <div className="bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#E95420] animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#E95420] animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#E95420] animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
                <span className="text-[11px] text-[#888] ml-1">
                  AgroPulse AI is typing…
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Quick-reply chips ─────────────────────────────────────────── */}
      <div className="px-4 pb-2 border-t border-[#222222] pt-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-[#AEA79F] font-mono uppercase tracking-wide">
            Suggested questions
          </span>
          <span className="text-[9px] text-[#666]">Tap to ask immediately</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              disabled={isGenerating}
              className="px-2.5 py-1.5 rounded-full bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#E95420]/60 hover:text-white text-[11px] text-[#AEA79F] transition-all disabled:opacity-40"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input area ───────────────────────────────────────────────── */}
      <div className="px-4 pb-4 pt-1">
        <div
          className={`flex items-end gap-2 bg-[#1A1A1A] border rounded-xl p-2 transition-colors ${
            isGenerating
              ? 'border-[#2E2E2E] opacity-90'
              : 'border-[#333] focus-within:border-[#E95420]/70'
          }`}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            placeholder={
              isGenerating
                ? 'AgroPulse AI is replying…'
                : activeLanguage === 'kn'
                ? 'ಔಷಧ ಪ್ರಮಾಣ, ಸಿಂಪರಣಾ ಹವಾಮಾನ ಅಥವಾ ಸಾವಯವ ಪರಿಹಾರದ ಬಗ್ಗೆ ಕೇಳಿ…'
                : activeLanguage === 'hi'
                ? 'दवा की मात्रा, स्प्रे का मौसम, या जैविक उपचार के बारे में पूछें…'
                : 'Ask about mixing math, safe spray window, organic biocontrol…'
            }
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#555] focus:outline-none resize-none max-h-24 leading-relaxed py-1 px-1"
            style={{ minHeight: '36px' }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 96) + 'px';
            }}
          />

          {/* Voice button */}
          <button
            onClick={toggleVoice}
            disabled={isGenerating}
            className={`p-2 rounded-lg transition-all flex-shrink-0 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'text-[#AEA79F] hover:text-white hover:bg-[#2E2E2E] disabled:opacity-40'
            }`}
            title={isListening ? 'Stop recording' : 'Voice input'}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Send button */}
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isGenerating}
            className="p-2 rounded-lg bg-[#E95420] hover:bg-[#FF6332] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-md"
            title="Send message"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between mt-1.5 px-1">
          <span className="text-[10px] text-[#555]">
            ⌨ Enter to send · Shift+Enter for new line · Multilingual Voice active
          </span>
          {messages.length > 1 && (
            <button
              onClick={() => {
                historyRef.current = [];
                setMessages([messages[0]]);
              }}
              className="text-[10px] text-[#666] hover:text-[#AEA79F] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default FarmerChatCompanion;
