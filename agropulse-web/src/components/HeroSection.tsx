import React from 'react';
import { Camera, CloudRain, Volume2, ShieldCheck, ArrowDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-[#21382b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182a20] border border-[#2d4b39] text-[#9ed871] text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9ed871]" />
            <span>AGROPULSE · FIELD INTELLIGENCE MVP</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#f2f7f3] leading-[1.15]">
            A calmer, safer way to read the field.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#9cb4a6] leading-relaxed font-sans max-w-2xl">
            Offline-first crop health diagnosis and microclimate disease forecasting for smallholder farmers across Karnataka, Kerala, and Tamil Nadu.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#scanner"
              className="py-3 px-5 rounded-xl bg-[#9ed871] hover:bg-[#8ec763] text-[#0f1d16] font-semibold text-sm transition-all shadow-lg shadow-[#0f2117] inline-flex items-center gap-2"
            >
              <span>Launch Diagnostic Station</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <a
              href="#weather"
              className="py-3 px-5 rounded-xl bg-[#14231b] hover:bg-[#1b2f24] border border-[#273f32] text-[#cfdec4] font-medium text-sm transition-all"
            >
              Check District Microclimate Risk
            </a>
          </div>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="bg-[#14221b] border border-[#25392e] rounded-xl p-5 hover:border-[#385946] transition-all">
            <div className="w-9 h-9 rounded-lg bg-[#1f3327] flex items-center justify-center text-[#9ed871] mb-3">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#f0f7f2] mb-1">On-Device Vision</h3>
            <p className="text-xs text-[#87a393] leading-relaxed">
              MobileNetV2 classifier recognizing 16 pathology classes across Tomato, Potato, and Rice without internet connectivity.
            </p>
          </div>

          <div className="bg-[#14221b] border border-[#25392e] rounded-xl p-5 hover:border-[#385946] transition-all">
            <div className="w-9 h-9 rounded-lg bg-[#1f3327] flex items-center justify-center text-[#f5a65b] mb-3">
              <CloudRain className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#f0f7f2] mb-1">Microclimate Risk Indices</h3>
            <p className="text-xs text-[#87a393] leading-relaxed">
              Computes Wallin/Hyre Late Blight and IRRI Blast thresholds from 24h temperature, humidity, and leaf wetness duration.
            </p>
          </div>

          <div className="bg-[#14221b] border border-[#25392e] rounded-xl p-5 hover:border-[#385946] transition-all">
            <div className="w-9 h-9 rounded-lg bg-[#1f3327] flex items-center justify-center text-[#78cbe8] mb-3">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#f0f7f2] mb-1">Kannada & Hindi Speech</h3>
            <p className="text-xs text-[#87a393] leading-relaxed">
              Reads actionable treatments aloud with explicit active ingredient details, pre-harvest waiting periods, and safety warnings.
            </p>
          </div>
        </div>

        {/* Verification & Metrics Ribbon */}
        <div className="mt-8 pt-6 border-t border-[#1d3126] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold font-mono text-[#f0f7f2]">16</div>
            <div className="text-[11px] font-mono uppercase text-[#739281] tracking-wider mt-0.5">Model Classes Mapped</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#9ed871]">84</div>
            <div className="text-[11px] font-mono uppercase text-[#739281] tracking-wider mt-0.5">KA, KL, TN Districts</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#f5a65b]">100%</div>
            <div className="text-[11px] font-mono uppercase text-[#739281] tracking-wider mt-0.5">Offline-Ready Core</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#78cbe8]">3</div>
            <div className="text-[11px] font-mono uppercase text-[#739281] tracking-wider mt-0.5">Supported Languages</div>
          </div>
        </div>
      </div>
    </div>
  );
};
