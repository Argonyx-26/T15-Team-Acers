import axios from 'axios';

export type RiskCrop = 'tomato' | 'potato' | 'rice';

export type RiskReport = {
  crop: string;
  riskScore: number;
  alertLevel: 'LOW' | 'MODERATE' | 'CRITICAL (HIGH)';
  primaryThreat: string;
  averageTemperature: number;
  averageHumidity: number;
  maxRainProbability: number;
  consecutiveWetHours: number;
};

type HourlyWeather = {
  temperature_2m?: number[];
  relative_humidity_2m?: number[];
  precipitation_probability?: number[];
};

export function evaluateRisk(
  crop: RiskCrop,
  temperatures: number[],
  humidities: number[],
  rainProbabilities: number[] = [],
): RiskReport {
  const recentTemperatures = temperatures.slice(-24);
  const recentHumidities = humidities.slice(-24);
  const recentRain = rainProbabilities.slice(-24);
  const averageTemperature = recentTemperatures.reduce((sum, value) => sum + value, 0) / recentTemperatures.length;
  const averageHumidity = recentHumidities.reduce((sum, value) => sum + value, 0) / recentHumidities.length;

  let consecutiveWetHours = 0;
  let maxConsecutiveWetHours = 0;
  recentHumidities.forEach((humidity) => {
    consecutiveWetHours = humidity >= 88 ? consecutiveWetHours + 1 : 0;
    maxConsecutiveWetHours = Math.max(maxConsecutiveWetHours, consecutiveWetHours);
  });

  const isRice = crop === 'rice';
  const qualifyingHours = recentTemperatures.filter((temperature, index) => {
    const humidity = recentHumidities[index] ?? 0;
    return isRice
      ? temperature >= 24 && temperature <= 28 && humidity >= 90
      : temperature >= 15 && temperature <= 22 && humidity >= 90;
  }).length;

  let riskScore: number;
  if (isRice) {
    riskScore = qualifyingHours >= 8 || maxConsecutiveWetHours >= 10
      ? Math.min(100, 65 + qualifyingHours * 4.5)
      : qualifyingHours >= 4
        ? 45 + qualifyingHours * 3.5
        : Math.max(10, averageHumidity * 0.25 + qualifyingHours * 2.5);
  } else {
    riskScore = qualifyingHours >= 10 || maxConsecutiveWetHours >= 12
      ? Math.min(100, 60 + qualifyingHours * 4)
      : qualifyingHours >= 5 || maxConsecutiveWetHours >= 8
        ? 40 + qualifyingHours * 3.5
        : Math.max(10, averageHumidity * 0.3 + qualifyingHours * 2);
  }

  const boundedScore = Math.round(Math.min(100, Math.max(0, riskScore)) * 10) / 10;
  return {
    crop: crop[0].toUpperCase() + crop.slice(1),
    riskScore: boundedScore,
    alertLevel: boundedScore >= 70 ? 'CRITICAL (HIGH)' : boundedScore >= 40 ? 'MODERATE' : 'LOW',
    primaryThreat: isRice ? 'Rice Blast (Magnaporthe oryzae)' : 'Late Blight (Phytophthora infestans)',
    averageTemperature: Math.round(averageTemperature * 10) / 10,
    averageHumidity: Math.round(averageHumidity * 10) / 10,
    maxRainProbability: recentRain.length ? Math.max(...recentRain) : 0,
    consecutiveWetHours: maxConsecutiveWetHours,
  };
}

export async function fetchRiskReport(crop: RiskCrop, latitude = 12.9716, longitude = 77.5946) {
  const response = await axios.get<{ hourly: HourlyWeather }>('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude,
      longitude,
      hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability',
      past_days: 1,
      forecast_days: 1,
      timezone: 'auto',
    },
    timeout: 7000,
  });
  const hourly = response.data.hourly;
  return evaluateRisk(crop, hourly.temperature_2m ?? [], hourly.relative_humidity_2m ?? [], hourly.precipitation_probability ?? []);
}