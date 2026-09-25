export type LandUnit = 'acre' | 'guntha' | 'cent';

export interface DosageCalculationResult {
  rawAreaAcres: number;
  totalWaterLitres: number;
  totalProductFormatted: string;
  totalProductValue: number;
  totalProductUnit: string;
  waitingPeriodDays: number | null;
  activeIngredient: string;
  safetyNotes: string;
  verificationStatus: string;
  warningNote?: string;
}

export function convertToAcres(area: number, unit: LandUnit): number {
  if (unit === 'guntha') return area / 40; // 1 Acre = 40 Gunthas
  if (unit === 'cent') return area / 100; // 1 Acre = 100 Cents
  return area;
}

export function calculateDosage(
  areaValue: number,
  unit: LandUnit,
  labelDoseText: string,
  waterPerAcreL: number,
  waitingPeriod: number | null,
  activeIngredient: string,
  safetyNotes: string,
  verificationStatus: string
): DosageCalculationResult {
  const acres = convertToAcres(areaValue, unit);

  if (acres <= 0 || isNaN(acres)) {
    throw new Error('Please enter a valid positive land area.');
  }

  // Calculate required spray water
  const totalWater = Math.round(acres * (waterPerAcreL || 200));

  let totalProductValue = 0;
  let totalProductUnit = 'g';
  let formatted = '';

  // Parse label dose pattern e.g. "2.0 g/L", "2.5 g/L", "1.0 mL/L", "1.2 g/L"
  const perLitreMatch = labelDoseText.match(/([\d.]+)\s*(g|ml|g\/l|ml\/l|g\/kg)/i);

  if (perLitreMatch) {
    const rate = parseFloat(perLitreMatch[1]);
    const rateUnit = perLitreMatch[2].toLowerCase().replace('/l', '');

    if (rateUnit.includes('ml')) {
      const mlTotal = rate * totalWater;
      totalProductUnit = mlTotal >= 1000 ? 'L' : 'mL';
      totalProductValue = mlTotal >= 1000 ? mlTotal / 1000 : mlTotal;
      formatted = mlTotal >= 1000 ? `${(mlTotal / 1000).toFixed(2)} Litres` : `${Math.round(mlTotal)} mL`;
    } else {
      const gTotal = rate * totalWater;
      totalProductUnit = gTotal >= 1000 ? 'kg' : 'g';
      totalProductValue = gTotal >= 1000 ? gTotal / 1000 : gTotal;
      formatted = gTotal >= 1000 ? `${(gTotal / 1000).toFixed(2)} kg` : `${Math.round(gTotal)} grams`;
    }
  } else {
    // Fallback estimation
    formatted = labelDoseText || 'Refer to certified agronomist';
  }

  let warningNote: string | undefined;
  if (verificationStatus !== 'ready_for_app') {
    warningNote = 'Official agronomist label check is pending for this dosage in your state. Confirm with local KVK or Agriculture Officer before application.';
  }

  return {
    rawAreaAcres: Math.round(acres * 100) / 100,
    totalWaterLitres: totalWater,
    totalProductFormatted: formatted,
    totalProductValue,
    totalProductUnit,
    waitingPeriodDays: waitingPeriod,
    activeIngredient,
    safetyNotes,
    verificationStatus,
    warningNote,
  };
}
