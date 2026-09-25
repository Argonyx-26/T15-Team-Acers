import React from 'react';
import { Camera, CloudRain, Volume2, ShieldCheck, ArrowDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-[#2C2C2C] bg-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#222222] border border-[#383838] text-[#E95420] text-xs font-mono font-bold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E95420] animate-pulse" />
            <span>AGROPULSE · CANONICAL INTELLIGENCE ARCHITECTURE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15]">
            A reliable, offline-first way to diagnose crops in the field.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#AEA79F] leading-relaxed max-w-2xl font-normal">
            Autonomous crop identification, leaf disease pathology classification, and microclimate epidemiological forecasting for smallholder farmers across Karnataka, Kerala, and Tamil Nadu.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#scanner"
              className="py-3 px-6 rounded-md bg-[#E95420] hover:bg-[#ff6332] text-white font-bold text-sm transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Launch Diagnostic Station</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <a
              href="#testing-studio"
              className="py-3 px-6 rounded-md bg-[#222222] hover:bg-[#2A2A2A] border border-[#383838] hover:border-[#E95420] text-white font-medium text-sm transition-all"
            >
              Open AI Testing Lab
            </a>
          </div>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          <div className="bg-[#1E1E1E] border border-[#2E2E2E] rounded-md p-6 hover:border-[#E95420] transition-all">
            <div className="w-10 h-10 rounded-md bg-[#2A160F] border border-[#442211] flex items-center justify-center text-[#E95420] mb-4">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1.5">Dual-Task Edge Vision</h3>
            <p className="text-xs text-[#AEA79F] leading-relaxed">
              MobileNetV2 classifier autonomously identifying crop family (Rice, Banana, Sugarcane, Coconut) and 17 pathology classes with 91.7% accuracy offline.
            </p>
          </div>

          <div className="bg-[#1E1E1E] border border-[#2E2E2E] rounded-md p-6 hover:border-[#E95420] transition-all">
            <div className="w-10 h-10 rounded-md bg-[#222222] border border-[#383838] flex items-center justify-center text-[#E95420] mb-4">
              <CloudRain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1.5">Bayesian Microclimate Fusion</h3>
            <p className="text-xs text-[#AEA79F] leading-relaxed">
              Computes Wallin/Hyre Late Blight and IRRI Blast thresholds from 24h temperature, humidity, and leaf wetness duration across 84 South Indian districts.
            </p>
          </div>

          <div className="bg-[#1E1E1E] border border-[#2E2E2E] rounded-md p-6 hover:border-[#E95420] transition-all">
            <div className="w-10 h-10 rounded-md bg-[#222222] border border-[#383838] flex items-center justify-center text-[#E95420] mb-4">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1.5">Multilingual Voice Protocols</h3>
            <p className="text-xs text-[#AEA79F] leading-relaxed">
              Reads actionable treatments aloud in Kannada, Hindi, and English with strict non-chemical cultural first-step guidelines and dosage calculations.
            </p>
          </div>
        </div>

        {/* Verification & Metrics Ribbon */}
        <div className="mt-10 pt-6 border-t border-[#262626] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-[#181818] p-3 rounded-md border border-[#282828]">
            <div className="text-2xl font-bold font-mono text-white">17</div>
            <div className="text-[10px] font-mono uppercase text-[#AEA79F] tracking-wider mt-0.5">Classes Calibrated</div>
          </div>
          <div className="bg-[#181818] p-3 rounded-md border border-[#282828]">
            <div className="text-2xl font-bold font-mono text-[#E95420]">91.7%</div>
            <div className="text-[10px] font-mono uppercase text-[#AEA79F] tracking-wider mt-0.5">Validation Accuracy</div>
          </div>
          <div className="bg-[#181818] p-3 rounded-md border border-[#282828]">
            <div className="text-2xl font-bold font-mono text-white">84</div>
            <div className="text-[10px] font-mono uppercase text-[#AEA79F] tracking-wider mt-0.5">Districts Mapped</div>
          </div>
          <div className="bg-[#181818] p-3 rounded-md border border-[#282828]">
            <div className="text-2xl font-bold font-mono text-[#E95420]">2.8 MB</div>
            <div className="text-[10px] font-mono uppercase text-[#AEA79F] tracking-wider mt-0.5">Offline Edge TFLite</div>
          </div>
        </div>
      </div>
    </div>
  );
};
