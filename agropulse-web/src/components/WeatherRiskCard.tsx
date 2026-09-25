import React, { useState, useEffect } from 'react';
import { CloudRain, Thermometer, Droplets, RefreshCw, AlertCircle, ShieldAlert, CheckCircle2, MapPin } from 'lucide-react';
import { fetchLiveWeatherRisk, RiskTelemetry } from '../services/riskService';
import { TARGET_DISTRICTS, DistrictInfo } from '../data/districts';

interface WeatherRiskCardProps {
  currentCrop: 'Tomato' | 'Potato' | 'Rice';
  onCropChange?: (crop: 'Tomato' | 'Potato' | 'Rice') => void;
}

export const WeatherRiskCard: React.FC<WeatherRiskCardProps> = ({ currentCrop, onCropChange }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo>(TARGET_DISTRICTS[2]); // Kolar
  const [telemetry, setTelemetry] = useState<RiskTelemetry | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'hourly'>('metrics');

  const loadWeather = async (district: DistrictInfo, crop: 'Tomato' | 'Potato' | 'Rice') => {
    setLoading(true);
    try {
      const data = await fetchLiveWeatherRisk(crop, district.name, district.lat, district.lon);
      setTelemetry(data);
    } catch {
      // Handled internally in service with cached fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedDistrict, currentCrop);
  }, [selectedDistrict, currentCrop]);

  const getAlertBadge = (level: string) => {
    if (level.includes('CRITICAL')) {
      return {
        bg: 'bg-[#2A160F]',
        border: 'border-[#E95420]/60',
        text: 'text-[#E95420]',
        icon: <ShieldAlert className="w-4 h-4 text-[#E95420]" />,
      };
    }
    if (level.includes('MODERATE')) {
      return {
        bg: 'bg-[#281810]',
        border: 'border-[#E95420]/40',
        text: 'text-[#FF7A45]',
        icon: <AlertCircle className="w-4 h-4 text-[#FF7A45]" />,
      };
    }
    return {
      bg: 'bg-[#173022]',
      border: 'border-[#274f37]',
      text: 'text-[#38B44A]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#38B44A]" />,
    };
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl p-5 text-[#E5E5E5]">
      {/* Header with district and crop selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-[#2E2E2E] pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#E95420] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#E95420] animate-ping" />
            <span>24-Hour Microclimate Telemetry</span>
          </div>
          <h3 className="text-lg font-bold font-serif text-[#FFFFFF]">Epidemiological Disease Risk</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Crop Selector */}
          <div className="flex bg-[#141414] border border-[#2E2E2E] rounded-lg p-0.5 text-xs">
            {(['Tomato', 'Potato', 'Rice'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCropChange && onCropChange(c)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  currentCrop === c ? 'bg-[#E95420] text-white font-semibold shadow-sm' : 'text-[#AEA79F] hover:text-[#FFFFFF]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => loadWeather(selectedDistrict, currentCrop)}
            disabled={loading}
            className="p-1.5 rounded-lg bg-[#141414] border border-[#2E2E2E] text-[#AEA79F] hover:text-[#E95420] transition-all disabled:opacity-50"
            title="Refresh weather"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#E95420]' : ''}`} />
          </button>
        </div>
      </div>

      {/* District Selector & Coordinates */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-[#141414] border border-[#2E2E2E] p-2.5 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#E95420]" />
          <span className="text-[#AEA79F]">Target Region:</span>
          <select
            value={selectedDistrict.name}
            onChange={(e) => {
              const d = TARGET_DISTRICTS.find((item) => item.name === e.target.value);
              if (d) setSelectedDistrict(d);
            }}
            className="bg-[#1E1E1E] text-[#FFFFFF] border border-[#2E2E2E] rounded px-2 py-1 focus:outline-none font-medium cursor-pointer"
          >
            {TARGET_DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.state})
              </option>
            ))}
          </select>
        </div>

        <div className="text-[11px] font-mono text-[#AEA79F] flex items-center gap-2">
          <span>{selectedDistrict.lat.toFixed(4)}°N, {selectedDistrict.lon.toFixed(4)}°E</span>
          <span className="w-1 h-1 rounded-full bg-[#444444]" />
          <span>{selectedDistrict.climateZone}</span>
        </div>
      </div>

      {telemetry ? (
        <div>
          {/* Main Risk Score Meter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="md:col-span-5 bg-[#141414] border border-[#2E2E2E] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#AEA79F]">Risk Score</span>
                  <span className="text-[11px] font-mono text-[#AEA79F] px-1.5 py-0.5 rounded bg-[#1E1E1E] border border-[#2E2E2E]">
                    {telemetry.source.includes('live') ? 'Live Telemetry' : 'Cached Fallback'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-extrabold font-mono text-[#FFFFFF]">{telemetry.riskScore}</span>
                  <span className="text-sm font-mono text-[#888888]">/ 100</span>
                </div>

                {/* Progress track */}
                <div className="w-full bg-[#2E2E2E] h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-500 ${
                      telemetry.riskScore >= 70 ? 'bg-[#E95420]' : telemetry.riskScore >= 40 ? 'bg-[#FF7A45]' : 'bg-[#38B44A]'
                    }`}
                    style={{ width: `${telemetry.riskScore}%` }}
                  />
                </div>
              </div>

              {/* Threat classification */}
              {(() => {
                const badge = getAlertBadge(telemetry.alertLevel);
                return (
                  <div className={`p-2.5 rounded-lg border ${badge.bg} ${badge.border} flex items-center gap-2`}>
                    {badge.icon}
                    <div>
                      <div className={`text-xs font-bold font-mono tracking-wide ${badge.text}`}>
                        {telemetry.alertLevel} ALERT
                      </div>
                      <div className="text-[11px] text-[#CCCCCC] truncate" title={telemetry.primaryThreat}>
                        Threat: {telemetry.primaryThreat}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Microclimate 4 Key Metrics */}
            <div className="md:col-span-7 grid grid-cols-2 gap-2.5">
              <div className="bg-[#141414] border border-[#2E2E2E] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-[#AEA79F] mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#E95420]" />
                  <span>24h Avg Temp</span>
                </div>
                <div className="text-xl font-bold font-mono text-[#FFFFFF]">
                  {telemetry.averageTemperature}°C
                </div>
                <div className="text-[11px] text-[#888888] mt-0.5">
                  Optimal fungal range: 15–22°C
                </div>
              </div>

              <div className="bg-[#141414] border border-[#2E2E2E] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-[#AEA79F] mb-1">
                  <Droplets className="w-3.5 h-3.5 text-[#E95420]" />
                  <span>24h Avg Humidity</span>
                </div>
                <div className="text-xl font-bold font-mono text-[#FFFFFF]">
                  {telemetry.averageHumidity}%
                </div>
                <div className="text-[11px] text-[#888888] mt-0.5">
                  Critical sporulation: ≥90%
                </div>
              </div>

              <div className="bg-[#141414] border border-[#2E2E2E] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-[#AEA79F] mb-1">
                  <CloudRain className="w-3.5 h-3.5 text-[#E95420]" />
                  <span>Max Rain Prob</span>
                </div>
                <div className="text-xl font-bold font-mono text-[#FFFFFF]">
                  {telemetry.maxRainProbability}%
                </div>
                <div className="text-[11px] text-[#888888] mt-0.5">
                  High probability = wash risk
                </div>
              </div>

              <div className="bg-[#141414] border border-[#2E2E2E] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-[#AEA79F] mb-1">
                  <Droplets className="w-3.5 h-3.5 text-[#E95420]" />
                  <span>Consecutive Wet Hours</span>
                </div>
                <div className="text-xl font-bold font-mono text-[#FFFFFF]">
                  {telemetry.consecutiveWetHours} <span className="text-xs font-normal text-[#AEA79F]">hrs</span>
                </div>
                <div className="text-[11px] text-[#888888] mt-0.5">
                  Leaf wetness duration
                </div>
              </div>
            </div>
          </div>

          {/* 24-Hour Sparkline Visualizer */}
          <div className="bg-[#141414] border border-[#2E2E2E] rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-[#AEA79F] mb-2 font-mono">
              <span>Past 24 Hours Relative Humidity (RH %)</span>
              <span className="text-[#E95420]">Threshold ≥ 90% in Red/Amber</span>
            </div>

            <div className="h-16 flex items-end gap-1 pt-2">
              {telemetry.hourlyRH.map((rh, idx) => {
                const heightPercent = Math.max(15, (rh / 100) * 100);
                const isCritical = rh >= 90;
                const isModerate = rh >= 85 && rh < 90;
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                  >
                    <div
                      className={`w-full rounded-t transition-all ${
                        isCritical ? 'bg-[#E95420]' : isModerate ? 'bg-[#FF7A45]' : 'bg-[#333333]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                      <div className="bg-[#111111] border border-[#2E2E2E] text-[10px] text-[#FFFFFF] font-mono py-1 px-1.5 rounded whitespace-nowrap shadow-lg">
                        {telemetry.hoursLabels[idx]}: {rh}% RH, {telemetry.hourlyTemps[idx]}°C
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[#888888] mt-1.5">
              <span>24h ago</span>
              <span>12h ago</span>
              <span>Present</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-44 flex items-center justify-center text-xs text-[#AEA79F]">
          <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[#E95420]" />
          Connecting to Open-Meteo telemetry stream...
        </div>
      )}
    </div>
  );
};
