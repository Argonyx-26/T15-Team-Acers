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
    <div className="bg-[#17251e] border border-[#273d31] rounded-2xl p-6 text-[#e0ece3]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#23382c] pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#9ed871] uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Authoritative Agronomic Evidence</span>
          </div>
          <h3 className="text-xl font-bold font-serif text-[#f2f7f3]">
            State Packages of Practices & District Registry
          </h3>
          <p className="text-xs text-[#82a090] mt-0.5">
            Advisories conform to certified recommendations from ICAR and State Agricultural Universities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#7e9b8b] font-mono">Filter State:</span>
          <div className="flex bg-[#101b15] border border-[#273d31] rounded-lg p-0.5 text-xs">
            {(['All', 'Karnataka', 'Kerala', 'Tamil Nadu'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedState(st)}
                className={`px-3 py-1 rounded font-medium transition-all ${
                  selectedState === st ? 'bg-[#9ed871] text-[#0f1d16] font-semibold' : 'text-[#84a392] hover:text-[#e0ece3]'
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
              className="bg-[#121f18] border border-[#24392e] hover:border-[#385946] p-3 rounded-xl transition-all block group"
            >
              <div className="flex items-center justify-between text-xs text-[#9ed871] font-mono mb-1">
                <span>{inst.state} Authority</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h5 className="font-semibold text-xs text-[#f0f7f2] group-hover:text-[#9ed871] transition-colors">
                {inst.name}
              </h5>
              <p className="text-[11px] text-[#739281] mt-1">{inst.scope}</p>
            </a>
          ))}
      </div>

      {/* District Coverage Table */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="text-xs font-mono text-[#8aa696]">
            Showing {filteredDistricts.length} Target Agro-Climatic Districts
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6c8a79]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search district, crop, or zone..."
              className="bg-[#101b15] border border-[#263e31] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#f0f7f2] placeholder-[#607e6e] focus:outline-none focus:border-[#9ed871] w-64"
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto border border-[#22362b] rounded-xl bg-[#101b15]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#14231b] text-[#799988] font-mono uppercase text-[10px] tracking-wider sticky top-0 border-b border-[#22362b]">
              <tr>
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Major Crops</th>
                <th className="py-2.5 px-3">Agro-Climatic Zone</th>
                <th className="py-2.5 px-3 text-right">Coordinates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2b22] text-[#cfdec4]">
              {filteredDistricts.map((d, index) => (
                <tr key={index} className="hover:bg-[#15241d] transition-colors">
                  <td className="py-2 px-3 font-semibold text-[#f0f7f2]">{d.name}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                        d.state === 'Karnataka'
                          ? 'bg-[#1b2f23] text-[#9ed871]'
                          : d.state === 'Kerala'
                          ? 'bg-[#1a2d33] text-[#78cbe8]'
                          : 'bg-[#31251a] text-[#f5a65b]'
                      }`}
                    >
                      {d.state}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[#b4ccc0]">{d.primaryCrops.join(', ')}</td>
                  <td className="py-2 px-3 text-[#7d9b8a]">{d.climateZone}</td>
                  <td className="py-2 px-3 text-right font-mono text-[11px] text-[#698776]">
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
