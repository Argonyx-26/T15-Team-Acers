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
        bg: 'bg-[#3d1814]',
        border: 'border-[#662820]',
        text: 'text-[#ff7865]',
        icon: <ShieldAlert className="w-4 h-4 text-[#ff7865]" />,
      };
    }
    if (level.includes('MODERATE')) {
      return {
        bg: 'bg-[#3b2713]',
        border: 'border-[#5f3f1e]',
        text: 'text-[#f5a65b]',
        icon: <AlertCircle className="w-4 h-4 text-[#f5a65b]" />,
      };
    }
    return {
      bg: 'bg-[#183123]',
      border: 'border-[#29543b]',
      text: 'text-[#9ed871]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#9ed871]" />,
    };
  };

  return (
    <div className="bg-[#192720] border border-[#2b4437] rounded-xl p-5 text-[#e2ece4]">
      {/* Header with district and crop selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-[#24392e] pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#9ed871] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#9ed871] animate-ping" />
            <span>24-Hour Microclimate Telemetry</span>
          </div>
          <h3 className="text-lg font-bold font-serif text-[#f2f7f3]">Epidemiological Disease Risk</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Crop Selector */}
          <div className="flex bg-[#121f19] border border-[#2d4739] rounded-lg p-0.5 text-xs">
            {(['Tomato', 'Potato', 'Rice'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCropChange && onCropChange(c)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  currentCrop === c ? 'bg-[#9ed871] text-[#0f1d16] font-semibold' : 'text-[#87a393] hover:text-[#e2ece4]'
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
            className="p-1.5 rounded-lg bg-[#121f19] border border-[#2d4739] text-[#87a393] hover:text-[#9ed871] transition-all disabled:opacity-50"
            title="Refresh weather"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#9ed871]' : ''}`} />
          </button>
        </div>
      </div>

      {/* District Selector & Coordinates */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-[#121e18] border border-[#24392e] p-2.5 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#f5a65b]" />
          <span className="text-[#88a595]">Target Region:</span>
          <select
            value={selectedDistrict.name}
            onChange={(e) => {
              const d = TARGET_DISTRICTS.find((item) => item.name === e.target.value);
              if (d) setSelectedDistrict(d);
            }}
            className="bg-[#1a2c22] text-[#e0ece3] border border-[#2f493b] rounded px-2 py-1 focus:outline-none font-medium cursor-pointer"
          >
            {TARGET_DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.state})
              </option>
            ))}
          </select>
        </div>

        <div className="text-[11px] font-mono text-[#6c8a79] flex items-center gap-2">
          <span>{selectedDistrict.lat.toFixed(4)}°N, {selectedDistrict.lon.toFixed(4)}°E</span>
          <span className="w-1 h-1 rounded-full bg-[#3a5847]" />
          <span>{selectedDistrict.climateZone}</span>
        </div>
      </div>

      {telemetry ? (
        <div>
          {/* Main Risk Score Meter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="md:col-span-5 bg-[#121f19] border border-[#253d30] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#799787]">Risk Score</span>
                  <span className="text-[11px] font-mono text-[#8aa395] px-1.5 py-0.5 rounded bg-[#1d3026]">
                    {telemetry.source === 'live' ? 'Live Open-Meteo' : 'Cached Fallback'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-extrabold font-mono text-[#f0f7f2]">{telemetry.riskScore}</span>
                  <span className="text-sm font-mono text-[#6f8d7d]">/ 100</span>
                </div>

                {/* Progress track */}
                <div className="w-full bg-[#203328] h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-500 ${
                      telemetry.riskScore >= 70 ? 'bg-[#ff7865]' : telemetry.riskScore >= 40 ? 'bg-[#f5a65b]' : 'bg-[#9ed871]'
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
                      <div className="text-[11px] text-[#b3c7bc] truncate" title={telemetry.primaryThreat}>
                        Threat: {telemetry.primaryThreat}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Microclimate 4 Key Metrics */}
            <div className="md:col-span-7 grid grid-cols-2 gap-2.5">
              <div className="bg-[#121f19] border border-[#253d30] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-[#7c9989] mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#f5a65b]" />
                  <span>24h Avg Temp</span>
                </div>
                <div className="text-xl font-bold font-mono text-[#f0f7f2]">
                  {telemetry.averageTemperature}°C
                </div>
                <div className="text-[11px] text-[#698777] mt-0.5">
                  Optimal fungal range: 15–22°C
                </div>
              </div>

              <div className="bg-[#121f19] border border-[#253d30] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-[#7c9989] mb-1">
                  <Droplets className="w-3.5 h-3.5 text-[#5ea3e8]" />
                  <span>24h Avg Humidity</span>
                </div>
                <div className="text-xl font-bold font-mono text-[#f0f7f2]">
                  {telemetry.averageHumidity}%
                </div>
                <div className="text-[11px] text-[#698777] mt-0.5">
                  Critical sporulation: ≥90%
                </div>
              </div>

              <div className="bg-[#121f19] border border-[#253d30] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-[#7c9989] mb-1">
                  <CloudRain className="w-3.5 h-3.5 text-[#5ea3e8]" />
                  <span>Max Rain Prob</span>
                </div>
                <div className="text-xl font-bold font-mono text-[#f0f7f2]">
                  {telemetry.maxRainProbability}%
                </div>
                <div className="text-[11px] text-[#698777] mt-0.5">
                  High probability = wash risk
                </div>
              </div>

              <div className="bg-[#121f19] border border-[#253d30] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-[#7c9989] mb-1">
                  <Droplets className="w-3.5 h-3.5 text-[#9ed871]" />
                  <span>Consecutive Wet Hours</span>
                </div>
                <div className="text-xl font-bold font-mono text-[#f0f7f2]">
                  {telemetry.consecutiveWetHours} <span className="text-xs font-normal text-[#89a496]">hrs</span>
                </div>
                <div className="text-[11px] text-[#698777] mt-0.5">
                  Leaf wetness duration
                </div>
              </div>
            </div>
          </div>

          {/* 24-Hour Sparkline Visualizer */}
          <div className="bg-[#121e18] border border-[#24392e] rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-[#8ca898] mb-2 font-mono">
              <span>Past 24 Hours Relative Humidity (RH %)</span>
              <span className="text-[#9ed871]">Threshold ≥ 90% in Red/Amber</span>
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
                        isCritical ? 'bg-[#ff7865]' : isModerate ? 'bg-[#f5a65b]' : 'bg-[#3b5e48]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                      <div className="bg-[#0f1a14] border border-[#2d4739] text-[10px] text-[#f0f7f2] font-mono py-1 px-1.5 rounded whitespace-nowrap shadow-lg">
                        {telemetry.hoursLabels[idx]}: {rh}% RH, {telemetry.hourlyTemps[idx]}°C
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[#5b7566] mt-1.5">
              <span>24h ago</span>
              <span>12h ago</span>
              <span>Present</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-44 flex items-center justify-center text-xs text-[#7e9989]">
          <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[#9ed871]" />
          Connecting to Open-Meteo telemetry stream...
        </div>
      )}
    </div>
  );
};
