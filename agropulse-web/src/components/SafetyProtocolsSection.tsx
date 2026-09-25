import React from 'react';
import { ShieldCheck, AlertTriangle, FileCheck, Check, Ban } from 'lucide-react';

export const SafetyProtocolsSection: React.FC = () => {
  return (
    <div className="bg-[#14231b] border border-[#273e31] rounded-2xl p-6 sm:p-8 text-[#e0ece3]">
      <div className="max-w-3xl mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#f5a65b] uppercase tracking-wider mb-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Strict Agronomic Verification Standard</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#f2f7f3]">
          Responsible AI in Agriculture: Safety Before Chemicals
        </h3>
        <p className="text-xs sm:text-sm text-[#8ca898] mt-2 leading-relaxed">
          Generic AI tools frequently hallucinate dangerous or prohibited chemical mixtures. AgroPulse enforces a strict five-step safety protocol where cultural sanitation and biological controls precede chemical escalation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rule 1 */}
        <div className="bg-[#101b15] border border-[#22382c] rounded-xl p-4 flex gap-3">
          <div className="w-6 h-6 rounded-full bg-[#1b3324] text-[#9ed871] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
            1
          </div>
          <div>
            <h5 className="font-semibold text-xs text-[#f0f7f2] mb-1">
              Active Ingredients, Never Solely Brand Names
            </h5>
            <p className="text-[11px] text-[#7d9b8b] leading-relaxed">
              Commercial brand formulations vary across manufacturers. Recommendations always display the active chemical molecule (e.g. <em>Mancozeb 75% WP</em>, <em>Spiromesifen 22.9% SC</em>) and generic equivalents.
            </p>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="bg-[#101b15] border border-[#22382c] rounded-xl p-4 flex gap-3">
          <div className="w-6 h-6 rounded-full bg-[#1b3324] text-[#9ed871] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
            2
          </div>
          <div>
            <h5 className="font-semibold text-xs text-[#f0f7f2] mb-1">
              Mandatory Pre-Harvest Interval (PHI)
            </h5>
            <p className="text-[11px] text-[#7d9b8b] leading-relaxed">
              Every chemical display requires a registered waiting period before harvest. Farmers are informed of mandatory days to protect food safety and consumer health.
            </p>
          </div>
        </div>

        {/* Rule 3 */}
        <div className="bg-[#101b15] border border-[#22382c] rounded-xl p-4 flex gap-3">
          <div className="w-6 h-6 rounded-full bg-[#1b3324] text-[#9ed871] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
            3
          </div>
          <div>
            <h5 className="font-semibold text-xs text-[#f0f7f2] mb-1">
              Prohibition of Unverified Tank-Mixing
            </h5>
            <p className="text-[11px] text-[#7d9b8b] leading-relaxed">
              The engine explicitly forbids suggesting unapproved pesticide/fungicide tank cocktails, which can trigger phytotoxicity or rapid chemical resistance.
            </p>
          </div>
        </div>

        {/* Rule 4 */}
        <div className="bg-[#101b15] border border-[#22382c] rounded-xl p-4 flex gap-3">
          <div className="w-6 h-6 rounded-full bg-[#1b3324] text-[#9ed871] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
            4
          </div>
          <div>
            <h5 className="font-semibold text-xs text-[#f0f7f2] mb-1">
              Decision Support, Not Guaranteed Infallibility
            </h5>
            <p className="text-[11px] text-[#7d9b8b] leading-relaxed">
              Predictions under 70% confidence or blurry captures trigger a human escalation warning prompting the farmer to consult their local Krishi Vigyan Kendra (KVK).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
