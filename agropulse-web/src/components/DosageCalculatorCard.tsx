import React, { useState } from 'react';
import { Calculator, AlertTriangle, ShieldCheck, Clock, Droplets, Info } from 'lucide-react';
import { calculateDosage, LandUnit } from '../services/dosageCalculator';
import { AdvisoryItem } from '../data/advisories';

interface DosageCalculatorCardProps {
  advisory: AdvisoryItem;
}

export const DosageCalculatorCard: React.FC<DosageCalculatorCardProps> = ({ advisory }) => {
  const [area, setArea] = useState<number>(1);
  const [unit, setUnit] = useState<LandUnit>('acre');

  if (advisory.severity === 'none' || advisory.waterVolumeLPerAcre === 0) {
    return (
      <div className="bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl p-4 text-[#CCCCCC]">
        <div className="flex items-center gap-2 mb-2 text-[#38B44A]">
          <ShieldCheck className="w-5 h-5 text-[#38B44A]" />
          <h4 className="font-semibold text-sm">No Chemical Treatment Prescribed</h4>
        </div>
        <p className="text-xs text-[#AEA79F] leading-relaxed">
          The detected condition indicates healthy foliage or non-chemical management. Continue preventive field scouting and maintain standard drip/aeration practices.
        </p>
      </div>
    );
  }

  let result;
  let calcError = '';
  try {
    result = calculateDosage(
      area,
      unit,
      advisory.labelDose,
      advisory.waterVolumeLPerAcre,
      advisory.waitingPeriodDays,
      advisory.activeIngredient,
      advisory.safetyNotes,
      advisory.verificationStatus
    );
  } catch (err: any) {
    calcError = err?.message || 'Invalid input';
  }

  return (
    <div className="bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl p-4 text-[#E5E5E5]">
      <div className="flex items-center justify-between mb-3 border-b border-[#2E2E2E] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2A160F] flex items-center justify-center text-[#E95420]">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#FFFFFF]">Field Dosage & Dilution Calculator</h4>
            <p className="text-xs text-[#AEA79F]">Calculated from certified package-of-practices</p>
          </div>
        </div>

        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#141414] text-[#AEA79F] border border-[#2E2E2E]">
          Rule: {advisory.waterVolumeLPerAcre}L / Acre
        </span>
      </div>

      {/* Input row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-[#AEA79F] mb-1.5">
            Plot Size / Land Area
          </label>
          <div className="flex rounded-lg overflow-hidden border border-[#2E2E2E] bg-[#141414]">
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={area || ''}
              onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent px-3 py-2 text-sm text-[#FFFFFF] focus:outline-none"
              placeholder="e.g. 1.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#AEA79F] mb-1.5">
            Measurement Unit
          </label>
          <div className="grid grid-cols-3 gap-1 bg-[#141414] p-1 rounded-lg border border-[#2E2E2E]">
            {(['acre', 'guntha', 'cent'] as LandUnit[]).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`py-1.5 text-xs font-medium rounded capitalize transition-all ${
                  unit === u ? 'bg-[#E95420] text-white font-semibold shadow-sm' : 'text-[#AEA79F] hover:text-[#FFFFFF]'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {calcError ? (
        <div className="p-3 rounded-lg bg-[#2A160F] border border-[#E95420]/50 text-xs text-[#FFB69B]">
          {calcError}
        </div>
      ) : result ? (
        <div className="space-y-3">
          {/* Main Computed Numbers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#141414] border border-[#2E2E2E] rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-[#AEA79F] mb-1 font-mono uppercase tracking-wider">
                <Droplets className="w-3.5 h-3.5 text-[#E95420]" />
                <span>Total Spray Water</span>
              </div>
              <div className="text-xl font-bold font-mono text-[#FFFFFF]">
                {result.totalWaterLitres} <span className="text-xs font-normal text-[#AEA79F]">Litres</span>
              </div>
              <div className="text-[11px] text-[#888888] mt-0.5">
                ≈ {Math.ceil(result.totalWaterLitres / 16)} knapsack tanks (16L each)
              </div>
            </div>

            <div className="bg-[#141414] border border-[#2E2E2E] rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-[#AEA79F] mb-1 font-mono uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5 text-[#E95420]" />
                <span>Chemical Product</span>
              </div>
              <div className="text-xl font-bold font-mono text-[#E95420]">
                {result.totalProductFormatted}
              </div>
              <div className="text-[11px] text-[#888888] mt-0.5 truncate" title={result.activeIngredient}>
                {result.activeIngredient}
              </div>
            </div>
          </div>

          {/* Safety & PHI Banner */}
          <div className="bg-[#141414] border border-[#2E2E2E] rounded-lg p-3 text-xs space-y-2">
            <div className="flex items-center justify-between text-[#AEA79F]">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#E95420]" />
                Pre-Harvest Waiting Period (PHI):
              </span>
              <span className="font-mono font-bold text-[#E95420]">
                {result.waitingPeriodDays ? `${result.waitingPeriodDays} Days` : 'N/A'}
              </span>
            </div>

            {advisory.genericAlternative && (
              <div className="flex items-center justify-between text-[#AEA79F] pt-1 border-t border-[#242424]">
                <span>Registered Generic Equivalents:</span>
                <span className="font-medium text-[#CCCCCC]">{advisory.genericAlternative}</span>
              </div>
            )}

            <div className="pt-1.5 border-t border-[#242424] text-[#AEA79F] text-[11px] leading-relaxed">
              <strong className="text-[#FFFFFF]">Operator Safety:</strong> {result.safetyNotes}
            </div>
          </div>

          {/* Verification Status Warning */}
          {result.warningNote && (
            <div className="bg-[#2A160F] border border-[#E95420]/50 rounded-lg p-2.5 flex items-start gap-2 text-xs text-[#FFB69B]">
              <AlertTriangle className="w-4 h-4 text-[#E95420] shrink-0 mt-0.5" />
              <p className="leading-tight">{result.warningNote}</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
