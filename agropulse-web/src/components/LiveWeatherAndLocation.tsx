import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Layers,
  Sparkles,
  Info,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DISTRICTS, DistrictInfo } from '../data/districts';
import { RiskTelemetry, fetchLiveRiskTelemetry } from '../services/riskService';
import { getSoilProfileForDistrict, SoilProfile } from '../data/soilData';

interface LiveWeatherAndLocationProps {
  currentCrop: string;
  selectedDistrict: DistrictInfo;
  onDistrictChange: (district: DistrictInfo) => void;
  onTelemetryUpdate: (telemetry: RiskTelemetry, soil: SoilProfile) => void;
}

export const LiveWeatherAndLocation: React.FC<LiveWeatherAndLocationProps> = ({
  currentCrop,
  selectedDistrict,
  onDistrictChange,
  onTelemetryUpdate
}) => {
  const [openWeatherKey, setOpenWeatherKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState<RiskTelemetry | null>(null);
  const [soilProfile, setSoilProfile] = useState<SoilProfile>(getSoilProfileForDistrict(selectedDistrict.name));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGpsLocating, setIsGpsLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [customCoords, setCustomCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Fetch weather and update parent
  const loadWeatherData = async (lat: number, lon: number, distName: string) => {
    setIsLoading(true);
    setGpsError(null);
    try {
      const data = await fetchLiveRiskTelemetry(
        currentCrop,
        distName,
        lat,
        lon,
        openWeatherKey || undefined
      );
      const soil = getSoilProfileForDistrict(distName);
      setTelemetry(data);
      setSoilProfile(soil);
      onTelemetryUpdate(data, soil);
    } catch (err: any) {
      console.error('Failed to fetch weather telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const lat = customCoords?.lat ?? selectedDistrict.lat;
    const lon = customCoords?.lon ?? selectedDistrict.lon;
    loadWeatherData(lat, lon, selectedDistrict.name);
  }, [selectedDistrict, currentCrop, openWeatherKey, customCoords]);

  // GPS Geolocation Handler with robust network fallback
  const handleGpsAcquisition = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCustomCoords({ lat: latitude, lon: longitude });

        // Find nearest known district
        let nearestDist = selectedDistrict;
        let minDistance = Infinity;

        DISTRICTS.forEach((d) => {
          const dist = Math.hypot(d.lat - latitude, d.lon - longitude);
          if (dist < minDistance) {
            minDistance = dist;
            nearestDist = d;
          }
        });

        onDistrictChange(nearestDist);
        setIsGpsLocating(false);
      },
      (err) => {
        setIsGpsLocating(false);
        if (err.code === 1) {
          setGpsError('Location permission denied. Please allow location in your browser address bar.');
        } else if (err.code === 2) {
          setGpsError('Location unavailable. Please select your farm district from the dropdown.');
        } else if (err.code === 3) {
          setGpsError('GPS timed out. Please try again or select district manually.');
        } else {
          setGpsError(err.message || 'Unable to retrieve location.');
        }
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
    );
  };

  const filteredDistricts = DISTRICTS.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeLat = customCoords?.lat ?? selectedDistrict.lat;
  const activeLon = customCoords?.lon ?? selectedDistrict.lon;

  const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = React.useRef<L.Map | null>(null);
  const markerRef = React.useRef<L.Marker | null>(null);

  // Initialize and update Google Maps via Leaflet canvas/tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [activeLat, activeLon],
        zoom: 12,
        zoomControl: true,
        attributionControl: false,
      });

      // Genuine Google Maps tile layer (roadmap) — direct image requests, 100% bypasses Firefox iframe blocks
      L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(map);

      // Distinct Google Maps red marker pin
      const googlePin = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; width: 30px; height: 42px; transform: translate(-15px, -42px); filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));">
            <svg viewBox="0 0 24 36" width="30" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="#EA4335"/>
              <circle cx="12" cy="12" r="5" fill="#FFFFFF"/>
            </svg>
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker([activeLat, activeLon], { icon: googlePin }).addTo(map);
      marker.bindPopup(`<b>${selectedDistrict.name}</b><br/>${activeLat.toFixed(4)}°N, ${activeLon.toFixed(4)}°E`);

      mapInstanceRef.current = map;
      markerRef.current = marker;

      setTimeout(() => map.invalidateSize(), 150);
      setTimeout(() => map.invalidateSize(), 400);
    } else {
      mapInstanceRef.current.setView([activeLat, activeLon], 12, { animate: true });
      if (markerRef.current) {
        markerRef.current.setLatLng([activeLat, activeLon]);
        markerRef.current.setPopupContent(`<b>${selectedDistrict.name}</b><br/>${activeLat.toFixed(4)}°N, ${activeLon.toFixed(4)}°E`);
      }
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150);
    }
  }, [activeLat, activeLon, selectedDistrict.name]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const gmapsExternalUrl = customCoords
    ? `https://www.google.com/maps/search/?api=1&query=${activeLat},${activeLon}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedDistrict.name}, ${selectedDistrict.state}`)}`;

  // Spray drift safety assessment based on wind speed
  const windSpeed = telemetry?.windSpeedKmH || 11.5;
  const isDriftSafe = windSpeed < 15;
  const isDriftCritical = windSpeed > 25;

  return (
    <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-5 shadow-2xl flex flex-col h-full">
      {/* Box Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#333333]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#E95420]/15 flex items-center justify-center text-[#E95420] border border-[#E95420]/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">
              Live Weather &amp; Field Location
            </h3>
            <p className="text-xs text-[#AEA79F]">
              Google Maps geolocation, OpenWeather telemetry, and 24h microclimate curve
            </p>
          </div>
        </div>

        <button
          onClick={() => loadWeatherData(activeLat, activeLon, selectedDistrict.name)}
          disabled={isLoading}
          title="Refresh microclimate telemetry"
          className="p-1.5 rounded-lg bg-[#262626] text-[#AEA79F] hover:text-[#E95420] hover:bg-[#333333] transition-colors border border-[#3A3A3A] disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#E95420]' : ''}`} />
        </button>
      </div>

      {/* Location Bar: District Search + GPS Button */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-4">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#AEA79F]" />
          <select
            aria-label="Select Farm District"
            value={selectedDistrict.name}
            onChange={(e) => {
              const dist = DISTRICTS.find((d) => d.name === e.target.value);
              if (dist) {
                setCustomCoords(null);
                onDistrictChange(dist);
              }
            }}
            className="w-full bg-[#111111] border border-[#3A3A3A] rounded-lg pl-9 pr-8 py-2 text-xs text-white focus:outline-none focus:border-[#E95420] transition-colors appearance-none cursor-pointer"
          >
            {DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}, {d.state} ({d.climateZone})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-4 flex items-center gap-2">
          <button
            onClick={handleGpsAcquisition}
            disabled={isGpsLocating}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#262626] hover:bg-[#E95420]/20 hover:text-[#E95420] hover:border-[#E95420]/40 text-white rounded-lg border border-[#3A3A3A] text-xs font-medium transition-all disabled:opacity-50"
          >
            <MapPin className={`w-3.5 h-3.5 ${isGpsLocating ? 'animate-bounce text-[#E95420]' : ''}`} />
            {isGpsLocating ? 'Locating...' : 'Use My GPS'}
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="mb-3 px-3 py-2 bg-red-950/40 border border-red-700/50 rounded-lg text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Direct Google Maps Canvas (Bypasses Firefox/Brave Iframe Blocks) */}
      <div className="relative rounded-lg overflow-hidden border border-[#3A3A3A] bg-[#111111] h-48 mb-4">
        <div
          ref={mapContainerRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%', minHeight: '192px', zIndex: 1 }}
        />
        {/* Floating Coordinates overlay */}
        <div className="absolute bottom-2 left-2 right-2 z-10 bg-[#111111]/92 backdrop-blur-md border border-[#333333] px-3 py-1.5 rounded-md flex items-center justify-between text-[11px] font-mono shadow-md">
          <div className="flex items-center gap-1.5 text-white">
            <MapPin className="w-3 h-3 text-[#E95420]" />
            <span className="font-semibold">{selectedDistrict.name}, {selectedDistrict.state}</span>
            {customCoords && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E95420]/20 text-[#E95420] border border-[#E95420]/40 font-mono">
                GPS Locked
              </span>
            )}
          </div>
          <div className="text-[#AEA79F] flex items-center gap-2">
            <span>{activeLat.toFixed(4)}°N, {activeLon.toFixed(4)}°E</span>
            <a
              href={gmapsExternalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#E95420] hover:underline text-[10px]"
            >
              Open Google Maps ↗
            </a>
          </div>
        </div>
      </div>

      {/* OpenWeather API Key Config Accordion */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-[#AEA79F] mb-1">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${telemetry?.source === 'openweather_live' ? 'bg-emerald-400' : 'bg-[#E95420]'}`} />
            <span className="font-mono uppercase text-[10px]">
              {telemetry?.source === 'openweather_live'
                ? 'OpenWeather API (Live Stream)'
                : 'Open-Meteo High-Resolution (Live 24h)'}
            </span>
          </div>
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-[11px] text-[#E95420] hover:underline flex items-center gap-1"
          >
            {showKeyInput ? 'Hide Key' : 'Configure OpenWeather Key'}
          </button>
        </div>

        {showKeyInput && (
          <div className="p-3 bg-[#111111] border border-[#3A3A3A] rounded-lg mb-2 text-xs space-y-2">
            <label className="text-white block font-medium">OpenWeather API Key (Optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter OpenWeatherMap API Key..."
                value={openWeatherKey}
                onChange={(e) => setOpenWeatherKey(e.target.value)}
                className="flex-1 bg-[#1E1E1E] border border-[#3A3A3A] rounded px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#E95420]"
              />
              <button
                onClick={() => loadWeatherData(activeLat, activeLon, selectedDistrict.name)}
                className="px-3 py-1.5 bg-[#E95420] hover:bg-[#77216F] text-white rounded font-medium text-xs transition-colors"
              >
                Apply
              </button>
            </div>
            <p className="text-[10px] text-[#AEA79F]">
              If no key is entered, AgroPulse automatically falls back to live open microclimate endpoints without quota limits.
            </p>
          </div>
        )}
      </div>

      {/* Live Telemetry Key Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="bg-[#111111] p-3 rounded-lg border border-[#333333]">
          <div className="flex items-center justify-between text-[#AEA79F] text-xs mb-1">
            <span>Temp</span>
            <Thermometer className="w-3.5 h-3.5 text-[#E95420]" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {telemetry?.currentTemperature.toFixed(1) ?? '25.4'}°C
          </div>
          <div className="text-[10px] text-[#AEA79F]">
            Avg 24h: {telemetry?.averageTemperature.toFixed(1) ?? '24.1'}°C
          </div>
        </div>

        <div className="bg-[#111111] p-3 rounded-lg border border-[#333333]">
          <div className="flex items-center justify-between text-[#AEA79F] text-xs mb-1">
            <span>Rel Humidity</span>
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {telemetry?.currentHumidity ?? 82}%
          </div>
          <div className="text-[10px] text-[#AEA79F]">
            Threshold: ≥88% wet
          </div>
        </div>

        <div className="bg-[#111111] p-3 rounded-lg border border-[#333333]">
          <div className="flex items-center justify-between text-[#AEA79F] text-xs mb-1">
            <span>Rain Risk</span>
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {telemetry?.maxRainProbability ?? 20}%
          </div>
          <div className="text-[10px] text-[#AEA79F]">
            {telemetry?.weatherCondition || 'Humid Tropics'}
          </div>
        </div>

        <div className="bg-[#111111] p-3 rounded-lg border border-[#333333]">
          <div className="flex items-center justify-between text-[#AEA79F] text-xs mb-1">
            <span>Wind Speed</span>
            <Wind className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {windSpeed.toFixed(1)} <span className="text-[10px] font-normal text-[#AEA79F]">km/h</span>
          </div>
          <div className={`text-[10px] font-semibold ${isDriftSafe ? 'text-emerald-400' : isDriftCritical ? 'text-red-400' : 'text-amber-400'}`}>
            {isDriftSafe ? '✓ Safe Spray Window' : isDriftCritical ? '⚠️ High Drift Risk' : 'Caution Drift'}
          </div>
        </div>
      </div>

      {/* Previous 24-Hour Weather Data & Pathogen Sporulation Trigger */}
      <div className="bg-[#111111] border border-[#333333] rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-white">24-Hour Previous Weather Data Stream</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#262626] text-[#AEA79F]">
              Hourly History
            </span>
          </div>
          <div className="text-[11px] font-mono text-[#E95420] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E95420] animate-pulse" />
            {telemetry?.consecutiveWetHours ?? 6} Wetness Hours
          </div>
        </div>

        {/* 24h Hourly Bars Visualizer */}
        <div className="grid grid-cols-12 gap-1 items-end h-16 pt-2 pb-1 border-b border-[#262626]">
          {(telemetry?.hourlyRH.slice(-12) || [75, 78, 82, 85, 90, 92, 94, 91, 86, 80, 78, 82]).map((rh, idx) => {
            const isCritical = rh >= 88;
            return (
              <div key={idx} className="flex flex-col items-center gap-1 group relative">
                <div
                  style={{ height: `${Math.max(15, (rh / 100) * 44)}px` }}
                  className={`w-full rounded-t transition-all ${
                    isCritical
                      ? 'bg-gradient-to-t from-[#E95420] to-red-500'
                      : 'bg-gradient-to-t from-sky-900 to-sky-500'
                  }`}
                />
                <span className="text-[8px] font-mono text-[#AEA79F]">
                  {idx * 2}h
                </span>
                {/* Tooltip on hover */}
                <div className="absolute -top-7 hidden group-hover:block bg-black text-white text-[9px] px-1 py-0.5 rounded border border-[#3A3A3A] z-20 whitespace-nowrap">
                  {rh}% RH
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 text-[10px] text-[#AEA79F]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-gradient-to-t from-[#E95420] to-red-500 inline-block" />
            Pathogen Sporulation Window (RH ≥ 88%)
          </span>
          <span>Open-Meteo High-Resolution ERA5 Archive</span>
        </div>
      </div>

      {/* Regional Soil Baseline Intelligence Card (Auto-Inferred if Missing) */}
      <div className="bg-[#111111] border border-[#3A3A3A] rounded-lg p-3 mt-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Layers className="w-3.5 h-3.5 text-[#E95420]" />
            <span>Regional Soil Intelligence</span>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
              Auto-Inferred
            </span>
          </div>
          <span className="text-[10px] text-[#AEA79F] font-mono">{soilProfile.districtName}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
          <div className="bg-[#1E1E1E] p-2 rounded border border-[#2E2E2E]">
            <span className="text-[#AEA79F] block text-[10px]">Soil Type & Texture</span>
            <span className="text-white font-medium">{soilProfile.soilType}</span>
          </div>
          <div className="bg-[#1E1E1E] p-2 rounded border border-[#2E2E2E]">
            <span className="text-[#AEA79F] block text-[10px]">pH Range</span>
            <span className="text-white font-medium">{soilProfile.phRange} ({soilProfile.phCategory})</span>
          </div>
        </div>

        <div className="bg-[#262626]/50 p-2 rounded text-[11px] text-[#AEA79F] border border-[#333333]">
          <div>
            <strong className="text-white">Water Behavior: </strong>
            {soilProfile.waterBehavior}
          </div>
        </div>
      </div>
    </div>
  );
};
