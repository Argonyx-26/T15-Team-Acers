import React from 'react';
import { ShieldCheck, AlertTriangle, FileCheck, Check, Ban } from 'lucide-react';

export const SafetyProtocolsSection: React.FC = () => {
  return (
    <div className="bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl p-6 sm:p-8 text-[#E5E5E5]">
      <div className="max-w-3xl mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#E95420] uppercase tracking-wider mb-1.5">
          <ShieldCheck className="w-4 h-4 text-[#E95420]" />
          <span>Strict Agronomic Verification Standard</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#FFFFFF]">
          Responsible AI in Agriculture: Safety Before Chemicals
        </h3>
        <p className="text-xs sm:text-sm text-[#AEA79F] mt-2 leading-relaxed">
          Generic AI tools frequently hallucinate dangerous or prohibited chemical mixtures. AgroPulse enforces a strict five-step safety protocol where cultural sanitation and biological controls precede chemical escalation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rule 1 */}
        <div className="bg-[#141414] border border-[#2E2E2E] rounded-xl p-4 flex gap-3">
          <div className="w-6 h-6 rounded-full bg-[#2A160F] text-[#E95420] border border-[#E95420]/40 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
            1
          </div>
          <div>
            <h5 className="font-semibold text-xs text-[#FFFFFF] mb-1">
              Active Ingredients, Never Solely Brand Names
            </h5>
            <p className="text-[11px] text-[#AEA79F] leading-relaxed">
              Commercial brand formulations vary across manufacturers. Recommendations always display the active chemical molecule (e.g. <em>Mancozeb 75% WP</em>, <em>Spiromesifen 22.9% SC</em>) and generic equivalents.
            </p>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="bg-[#141414] border border-[#2E2E2E] rounded-xl p-4 flex gap-3">
          <div className="w-6 h-6 rounded-full bg-[#2A160F] text-[#E95420] border border-[#E95420]/40 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
            2
          </div>
          <div>
            <h5 className="font-semibold text-xs text-[#FFFFFF] mb-1">
              Mandatory Pre-Harvest Interval (PHI)
            </h5>
            <p className="text-[11px] text-[#AEA79F] leading-relaxed">
              Every chemical display requires a registered waiting period before harvest. Farmers are informed of mandatory days to protect food safety and consumer health.
            </p>
          </div>
        </div>

        {/* Rule 3 */}
        <div className="bg-[#141414] border border-[#2E2E2E] rounded-xl p-4 flex gap-3">
          <div className="w-6 h-6 rounded-full bg-[#2A160F] text-[#E95420] border border-[#E95420]/40 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
            3
          </div>
          <div>
            <h5 className="font-semibold text-xs text-[#FFFFFF] mb-1">
              Prohibition of Unverified Tank-Mixing
            </h5>
            <p className="text-[11px] text-[#AEA79F] leading-relaxed">
              The engine explicitly forbids suggesting unapproved pesticide/fungicide tank cocktails, which can trigger phytotoxicity or rapid chemical resistance.
            </p>
          </div>
        </div>

        {/* Rule 4 */}
        <div className="bg-[#141414] border border-[#2E2E2E] rounded-xl p-4 flex gap-3">
          <div className="w-6 h-6 rounded-full bg-[#2A160F] text-[#E95420] border border-[#E95420]/40 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
            4
          </div>
          <div>
            <h5 className="font-semibold text-xs text-[#FFFFFF] mb-1">
              Decision Support, Not Guaranteed Infallibility
            </h5>
            <p className="text-[11px] text-[#AEA79F] leading-relaxed">
              Predictions under 70% confidence or blurry captures trigger a human escalation warning prompting the farmer to consult their local Krishi Vigyan Kendra (KVK).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
