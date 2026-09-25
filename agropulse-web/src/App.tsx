import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DiagnosticScanner } from './components/DiagnosticScanner';
import { WeatherRiskCard } from './components/WeatherRiskCard';
import { ModelTestingStudio } from './components/ModelTestingStudio';
import { RegionalPackagesExplorer } from './components/RegionalPackagesExplorer';
import { SafetyProtocolsSection } from './components/SafetyProtocolsSection';
import { Footer } from './components/Footer';

export function App() {
  const [activeCrop, setActiveCrop] = useState<'Tomato' | 'Potato' | 'Rice'>('Tomato');

  return (
    <div className="min-h-screen bg-[#111111] text-[#f7f7f7] selection:bg-[#E95420] selection:text-white">
      {/* Top sticky navbar */}
      <Navbar />

      {/* Main hero & value props */}
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Section 1: Leaf Vision Diagnostic Station */}
        <section id="scanner" className="scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 pb-2 border-b border-[#262626]">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#E95420] mb-1 font-bold">
                Module 01 · Vision Diagnostics
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Crop Leaf Pathology & Vernacular Advisory
              </h2>
            </div>
            <p className="text-xs text-[#AEA79F] max-w-sm mt-1 sm:mt-0 text-left sm:text-right">
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
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 pb-2 border-b border-[#262626]">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#E95420] mb-1 font-bold">
                Module 02 · Epidemiological Risk
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Microclimate Disease Forecasting Engine
              </h2>
            </div>
            <p className="text-xs text-[#AEA79F] max-w-sm mt-1 sm:mt-0 text-left sm:text-right">
              Mathematical risk modeling from 24h temperature, humidity, and leaf wetness duration across 84 South Indian districts.
            </p>
          </div>

          <WeatherRiskCard
            currentCrop={activeCrop}
            onCropChange={(crop) => setActiveCrop(crop)}
          />
        </section>

        {/* Section 3: AI Model Testing Studio & Benchmark Workbench */}
        <section id="testing-studio" className="scroll-mt-20">
          <ModelTestingStudio />
        </section>

        {/* Section 4: Safety & Responsible AI Protocol */}
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
