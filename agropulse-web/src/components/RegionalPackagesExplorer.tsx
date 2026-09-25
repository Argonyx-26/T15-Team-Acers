import React, { useState } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, MapPin, Search } from 'lucide-react';
import { TARGET_DISTRICTS } from '../data/districts';

export const RegionalPackagesExplorer: React.FC = () => {
  const [selectedState, setSelectedState] = useState<'All' | 'Karnataka' | 'Kerala' | 'Tamil Nadu'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistricts = TARGET_DISTRICTS.filter((d) => {
    const matchesState = selectedState === 'All' || d.state === selectedState;
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.primaryCrops.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
      d.climateZone.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesState && matchesSearch;
  });

  const INSTITUTIONS = [
    {
      state: 'Karnataka',
      name: 'UAS Bangalore & UAS Dharwad',
      type: 'State Agricultural Universities',
      scope: 'Ragi, Tomato, Rice, Maize, Pulses Package of Practices',
      url: 'https://uasbangalore.edu.in/',
    },
    {
      state: 'Kerala',
      name: 'Kerala Agricultural University (KAU)',
      type: 'Package of Practices (Crops & Plantation)',
      scope: 'Paddy (Kuttanad/Palakkad), Coconut, Rubber, Spices',
      url: 'https://kau.in/',
    },
    {
      state: 'Kerala',
      name: 'ICAR-CPCRI & ICAR-IISR',
      type: 'National Research Institutes',
      scope: 'Coconut Bud Rot Protocols, Black Pepper Foot Rot',
      url: 'https://cpcri.icar.gov.in/',
    },
    {
      state: 'Tamil Nadu',
      name: 'Tamil Nadu Agricultural University (TNAU)',
      type: 'Agritech Crop Protection Portal',
      scope: 'Cauvery Delta Rice, Banana, Tomato, Onion Purple Blotch',
      url: 'https://agritech.tnau.ac.in/',
    },
    {
      state: 'Tamil Nadu',
      name: 'ICAR-NRCB & ICAR-DOGR',
      type: 'Commodity Research Institutes',
      scope: 'Banana Fusarium Wilt / Panama, Onion Disease Protocols',
      url: 'https://nrcb.icar.gov.in/',
    },
  ];

  return (
    <div className="bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl p-6 text-[#E5E5E5]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#2E2E2E] pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#E95420] uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Authoritative Agronomic Evidence</span>
          </div>
          <h3 className="text-xl font-bold font-serif text-[#FFFFFF]">
            State Packages of Practices & District Registry
          </h3>
          <p className="text-xs text-[#AEA79F] mt-0.5">
            Advisories conform to certified recommendations from ICAR and State Agricultural Universities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#AEA79F] font-mono">Filter State:</span>
          <div className="flex bg-[#141414] border border-[#2E2E2E] rounded-lg p-0.5 text-xs">
            {(['All', 'Karnataka', 'Kerala', 'Tamil Nadu'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedState(st)}
                className={`px-3 py-1 rounded font-medium transition-all ${
                  selectedState === st ? 'bg-[#E95420] text-white font-semibold shadow-sm' : 'text-[#AEA79F] hover:text-[#FFFFFF]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Institutional Authorities Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {INSTITUTIONS.filter((ins) => selectedState === 'All' || ins.state === selectedState)
          .slice(0, 3)
          .map((inst, idx) => (
            <a
              key={idx}
              href={inst.url}
              target="_blank"
              rel="noreferrer"
              className="bg-[#141414] border border-[#2E2E2E] hover:border-[#E95420] p-3 rounded-xl transition-all block group"
            >
              <div className="flex items-center justify-between text-xs text-[#E95420] font-mono mb-1">
                <span>{inst.state} Authority</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h5 className="font-semibold text-xs text-[#FFFFFF] group-hover:text-[#E95420] transition-colors">
                {inst.name}
              </h5>
              <p className="text-[11px] text-[#888888] mt-1">{inst.scope}</p>
            </a>
          ))}
      </div>

      {/* District Coverage Table */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="text-xs font-mono text-[#AEA79F]">
            Showing {filteredDistricts.length} Target Agro-Climatic Districts
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#888888]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search district, crop, or zone..."
              className="bg-[#141414] border border-[#2E2E2E] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#FFFFFF] placeholder-[#888888] focus:outline-none focus:border-[#E95420] w-64"
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto border border-[#2E2E2E] rounded-xl bg-[#141414]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A1A1A] text-[#AEA79F] font-mono uppercase text-[10px] tracking-wider sticky top-0 border-b border-[#2E2E2E]">
              <tr>
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Major Crops</th>
                <th className="py-2.5 px-3">Agro-Climatic Zone</th>
                <th className="py-2.5 px-3 text-right">Coordinates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424] text-[#CCCCCC]">
              {filteredDistricts.map((d, index) => (
                <tr key={index} className="hover:bg-[#1E1E1E] transition-colors">
                  <td className="py-2 px-3 font-semibold text-[#FFFFFF]">{d.name}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                        d.state === 'Karnataka'
                          ? 'bg-[#2A160F] text-[#E95420] border border-[#E95420]/40'
                          : d.state === 'Kerala'
                          ? 'bg-[#182830] text-[#78cbe8] border border-[#203c48]'
                          : 'bg-[#2A2016] text-[#FF9B54] border border-[#50341E]'
                      }`}
                    >
                      {d.state}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[#E0E0E0]">{d.primaryCrops.join(', ')}</td>
                  <td className="py-2 px-3 text-[#AEA79F]">{d.climateZone}</td>
                  <td className="py-2 px-3 text-right font-mono text-[11px] text-[#888888]">
                    {d.lat.toFixed(2)}°N, {d.lon.toFixed(2)}°E
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
