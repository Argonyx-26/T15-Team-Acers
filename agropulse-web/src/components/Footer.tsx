import React from 'react';
import { ShieldCheck, AlertCircle, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#23382c] bg-[#0c1410] text-[#7c9989] text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-2">
            <h4 className="font-serif font-bold text-[#f0f7f2] text-sm">AgroPulse Agricultural Decision Support</h4>
            <p className="text-xs text-[#708c7c] max-w-md leading-relaxed">
              Designed for smallholder farms across Karnataka, Kerala, and Tamil Nadu. Combines on-device MobileNetV2 leaf classification, Wallin/Hyre and IRRI microclimate weather risk indices, and vernacular speech advisories.
            </p>
          </div>

          <div>
            <h5 className="font-mono uppercase text-[11px] font-bold text-[#8fa99b] tracking-wider mb-2">Team Acers</h5>
            <ul className="space-y-1 text-[#a5bfb1] text-xs">
              <li>• Visweshwara (Mobile & Web Integration)</li>
              <li>• Preetham (ML Model & Risk Engine)</li>
              <li>• Ishan (Advisory & Dosage Intake)</li>
              <li>• Jyothir (Visual Concepts & UX)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono uppercase text-[11px] font-bold text-[#8fa99b] tracking-wider mb-2">Core Standards</h5>
            <ul className="space-y-1 text-[#86a394] text-xs">
              <li>• ICAR / UAS / KAU / TNAU verified sources</li>
              <li>• Offline-first edge compute</li>
              <li>• Multi-lingual audio accessibility</li>
              <li>• Strict pesticide safety protocols</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1a2c22] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#5e7a6b]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9ed871]" />
            <span>Strict Safety Notice: Recommendations are agricultural decision support, not unconditional guarantees. Verify chemical labels with your local Krishi Vigyan Kendra.</span>
          </div>
          <div>AgroPulse © 2026 T15-Team-Acers</div>
        </div>
      </div>
    </footer>
  );
};
