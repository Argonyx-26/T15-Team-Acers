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
      <div className="bg-[#192720] border border-[#273f32] rounded-xl p-4 text-[#cfdec4]">
        <div className="flex items-center gap-2 mb-2 text-[#9ed871]">
          <ShieldCheck className="w-5 h-5" />
          <h4 className="font-semibold text-sm">No Chemical Treatment Prescribed</h4>
        </div>
        <p className="text-xs text-[#9bb3a4] leading-relaxed">
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
    <div className="bg-[#192720] border border-[#2b4437] rounded-xl p-4 text-[#e2ece4]">
      <div className="flex items-center justify-between mb-3 border-b border-[#253c30] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#273d32] flex items-center justify-center text-[#f5a65b]">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#f0f7f2]">Field Dosage & Dilution Calculator</h4>
            <p className="text-xs text-[#829e8f]">Calculated from certified package-of-practices</p>
          </div>
        </div>

        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#253d30] text-[#a1c4b1] border border-[#324f3f]">
          Rule: {advisory.waterVolumeLPerAcre}L / Acre
        </span>
      </div>

      {/* Input row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-[#9cb5a8] mb-1.5">
            Plot Size / Land Area
          </label>
          <div className="flex rounded-lg overflow-hidden border border-[#2e473a] bg-[#121f19]">
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={area || ''}
              onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent px-3 py-2 text-sm text-[#f0f7f2] focus:outline-none"
              placeholder="e.g. 1.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#9cb5a8] mb-1.5">
            Measurement Unit
          </label>
          <div className="grid grid-cols-3 gap-1 bg-[#121f19] p-1 rounded-lg border border-[#2e473a]">
            {(['acre', 'guntha', 'cent'] as LandUnit[]).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`py-1.5 text-xs font-medium rounded capitalize transition-all ${
                  unit === u ? 'bg-[#9ed871] text-[#0f1d16] font-semibold' : 'text-[#8daaa0] hover:text-[#e0ece3]'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {calcError ? (
        <div className="p-3 rounded-lg bg-[#381e19] border border-[#5a2e25] text-xs text-[#ffb0a0]">
          {calcError}
        </div>
      ) : result ? (
        <div className="space-y-3">
          {/* Main Computed Numbers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#121e18] border border-[#24392e] rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-[#7e9c8c] mb-1 font-mono uppercase tracking-wider">
                <Droplets className="w-3.5 h-3.5 text-[#5ea3e8]" />
                <span>Total Spray Water</span>
              </div>
              <div className="text-xl font-bold font-mono text-[#f0f7f2]">
                {result.totalWaterLitres} <span className="text-xs font-normal text-[#89a496]">Litres</span>
              </div>
              <div className="text-[11px] text-[#6e8c7b] mt-0.5">
                ≈ {Math.ceil(result.totalWaterLitres / 16)} knapsack tanks (16L each)
              </div>
            </div>

            <div className="bg-[#121e18] border border-[#24392e] rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-[#7e9c8c] mb-1 font-mono uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5 text-[#f5a65b]" />
                <span>Chemical Product</span>
              </div>
              <div className="text-xl font-bold font-mono text-[#9ed871]">
                {result.totalProductFormatted}
              </div>
              <div className="text-[11px] text-[#89a496] mt-0.5 truncate" title={result.activeIngredient}>
                {result.activeIngredient}
              </div>
            </div>
          </div>

          {/* Safety & PHI Banner */}
          <div className="bg-[#14231b] border border-[#253c30] rounded-lg p-3 text-xs space-y-2">
            <div className="flex items-center justify-between text-[#8cb19d]">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#f5a65b]" />
                Pre-Harvest Waiting Period (PHI):
              </span>
              <span className="font-mono font-bold text-[#f5a65b]">
                {result.waitingPeriodDays ? `${result.waitingPeriodDays} Days` : 'N/A'}
              </span>
            </div>

            {advisory.genericAlternative && (
              <div className="flex items-center justify-between text-[#7c9d8c] pt-1 border-t border-[#1e3328]">
                <span>Registered Generic Equivalents:</span>
                <span className="font-medium text-[#c8dcd0]">{advisory.genericAlternative}</span>
              </div>
            )}

            <div className="pt-1.5 border-t border-[#1e3328] text-[#8aa395] text-[11px] leading-relaxed">
              <strong className="text-[#f0f7f2]">Operator Safety:</strong> {result.safetyNotes}
            </div>
          </div>

          {/* Verification Status Warning */}
          {result.warningNote && (
            <div className="bg-[#2c1e14] border border-[#52331f] rounded-lg p-2.5 flex items-start gap-2 text-xs text-[#f5bf94]">
              <AlertTriangle className="w-4 h-4 text-[#f5a65b] shrink-0 mt-0.5" />
              <p className="leading-tight">{result.warningNote}</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
