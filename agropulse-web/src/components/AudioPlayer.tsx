import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, Globe } from 'lucide-react';

interface AudioPlayerProps {
  scripts: {
    en: string;
    kn: string;
    hi: string;
  };
  cropName: string;
  diseaseName: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ scripts, cropName, diseaseName }) => {
  const [selectedLang, setSelectedLang] = useState<'kn' | 'hi' | 'en'>('kn');
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setVoiceNotice('');
    }
  };

  const handlePlay = (lang: 'kn' | 'hi' | 'en') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceNotice('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    if (isPlaying && selectedLang === lang) {
      handleStop();
      return;
    }

    setSelectedLang(lang);
    const textToSpeak = scripts[lang];
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.84; // measured, clear pacing for field workers

    const langTag = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.lang = langTag;

    // Search for matching native voice
    const matchedVoice = availableVoices.find(
      (v) => v.lang.toLowerCase() === langTag.toLowerCase() || v.lang.toLowerCase().startsWith(lang)
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      setVoiceNotice(`Using natural ${matchedVoice.name}`);
    } else {
      setVoiceNotice(
        lang === 'kn'
          ? 'Kannada voice not installed natively; playing on system synthesizer'
          : lang === 'hi'
          ? 'Hindi voice not installed natively; playing on system synthesizer'
          : 'Playing standard English audio'
      );
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      setVoiceNotice('');
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setVoiceNotice('Audio playback interrupted');
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl p-4 text-[#E5E5E5]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2A160F] flex items-center justify-center text-[#E95420]">
            <Volume2 className="w-4 h-4 text-[#E95420]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#FFFFFF]">Field Audio Advisory</h4>
            <p className="text-xs text-[#AEA79F]">Vernacular speech for non-reading operators</p>
          </div>
        </div>

        {isPlaying && (
          <div className="flex items-center gap-1">
            <span className="w-1 h-3 bg-[#E95420] animate-pulse rounded-full" />
            <span className="w-1 h-5 bg-[#E95420] animate-pulse delay-75 rounded-full" />
            <span className="w-1 h-2 bg-[#E95420] animate-pulse delay-150 rounded-full" />
            <span className="w-1 h-4 bg-[#E95420] animate-pulse delay-100 rounded-full" />
          </div>
        )}
      </div>

      {/* Language selectors */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button
          type="button"
          onClick={() => handlePlay('kn')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
            selectedLang === 'kn' && isPlaying
              ? 'bg-[#E95420] text-white border-[#E95420] shadow-sm'
              : 'bg-[#141414] hover:bg-[#1E1E1E] text-[#CCCCCC] border-[#2E2E2E]'
          }`}
        >
          {isPlaying && selectedLang === 'kn' ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
          <span>ಕನ್ನಡ (Kannada)</span>
        </button>

        <button
          type="button"
          onClick={() => handlePlay('hi')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
            selectedLang === 'hi' && isPlaying
              ? 'bg-[#E95420] text-white border-[#E95420] shadow-sm'
              : 'bg-[#141414] hover:bg-[#1E1E1E] text-[#CCCCCC] border-[#2E2E2E]'
          }`}
        >
          {isPlaying && selectedLang === 'hi' ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
          <span>हिन्दी (Hindi)</span>
        </button>

        <button
          type="button"
          onClick={() => handlePlay('en')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
            selectedLang === 'en' && isPlaying
              ? 'bg-[#E95420] text-white border-[#E95420] shadow-sm'
              : 'bg-[#141414] hover:bg-[#1E1E1E] text-[#CCCCCC] border-[#2E2E2E]'
          }`}
        >
          {isPlaying && selectedLang === 'en' ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
          <span>English</span>
        </button>
      </div>

      {/* Transcript Card */}
      <div className="bg-[#141414] border border-[#2E2E2E] rounded-lg p-3 text-xs leading-relaxed text-[#CCCCCC]">
        <div className="flex items-center justify-between text-[11px] text-[#AEA79F] mb-1.5 font-mono uppercase tracking-wider">
          <span>{selectedLang === 'kn' ? 'Kannada Transcript' : selectedLang === 'hi' ? 'Hindi Transcript' : 'English Transcript'}</span>
          {isPlaying && <span className="text-[#E95420] font-semibold">Broadcasting</span>}
        </div>
        <p className="font-sans text-[13px] text-[#FFFFFF]">{scripts[selectedLang]}</p>
      </div>

      {voiceNotice && (
        <p className="text-[11px] text-[#AEA79F] mt-2 flex items-center gap-1.5 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E95420]" />
          {voiceNotice}
        </p>
      )}
    </div>
  );
};
