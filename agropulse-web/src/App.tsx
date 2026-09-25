import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DiagnosticScanner } from './components/DiagnosticScanner';
import { WeatherRiskCard } from './components/WeatherRiskCard';
import { RegionalPackagesExplorer } from './components/RegionalPackagesExplorer';
import { SafetyProtocolsSection } from './components/SafetyProtocolsSection';
import { Footer } from './components/Footer';

export function App() {
  const [activeCrop, setActiveCrop] = useState<'Tomato' | 'Potato' | 'Rice'>('Tomato');

  return (
    <div className="min-h-screen bg-[#0d1712] text-[#f2f7f3] selection:bg-[#9ed871] selection:text-[#0d1712]">
      {/* Top sticky navbar */}
      <Navbar />

      {/* Main hero & value props */}
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Section 1: Leaf Vision Diagnostic Station */}
        <section id="scanner" className="scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#9ed871] mb-1">
                Module 01 · Vision Diagnostics
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f2f7f3]">
                Crop Leaf Pathology & Vernacular Advisory
              </h2>
            </div>
            <p className="text-xs text-[#809e8e] max-w-sm mt-1 sm:mt-0 text-left sm:text-right">
              On-device classification linked to non-chemical cultural practices, verified dosages, and multi-language audio.
            </p>
          </div>

          <DiagnosticScanner
            onDiseaseSelect={(crop) => {
              if (crop === 'Tomato' || crop === 'Potato' || crop === 'Rice') {
                setActiveCrop(crop);
              }
            }}
          />
        </section>

        {/* Section 2: Microclimate Epidemiological Risk */}
        <section id="weather" className="scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#f5a65b] mb-1">
                Module 02 · Epidemiological Risk
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f2f7f3]">
                Microclimate Disease Forecasting Engine
              </h2>
            </div>
            <p className="text-xs text-[#809e8e] max-w-sm mt-1 sm:mt-0 text-left sm:text-right">
              Mathematical risk modeling from 24h temperature, humidity, and leaf wetness duration across 84 South Indian districts.
            </p>
          </div>

          <WeatherRiskCard
            currentCrop={activeCrop}
            onCropChange={(crop) => setActiveCrop(crop)}
          />
        </section>

        {/* Section 3: Safety & Responsible AI Protocol */}
        <section>
          <SafetyProtocolsSection />
        </section>

        {/* Section 4: Regional Agricultural Authorities & District Registry */}
        <section id="districts" className="scroll-mt-20">
          <RegionalPackagesExplorer />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
