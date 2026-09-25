import React from 'react';
import { Sprout, WifiOff, ShieldCheck, Smartphone } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="border-b border-[#2C2C2C] bg-[#181818]/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#E95420] flex items-center justify-center text-white shadow-sm">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">AgroPulse</span>
              <span className="text-[10px] font-mono uppercase bg-[#242424] text-[#E95420] font-bold px-1.5 py-0.5 rounded border border-[#383838]">
                Team Acers
              </span>
            </div>
            <div className="text-[11px] text-[#AEA79F] hidden sm:block">
              Canonical Edge Diagnostics & Microclimate Risk Engine
            </div>
          </div>
        </div>

        {/* Status badges and links */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-[#222222] border border-[#333333] px-3 py-1.5 rounded-full text-xs font-mono text-[#AEA79F]">
            <span className="w-2 h-2 rounded-full bg-[#E95420]" />
            <span>Offline TFLite (2.8 MB)</span>
          </div>

          <a
            href="#scanner"
            className="text-xs font-medium text-[#CCCCCC] hover:text-[#E95420] transition-colors hidden sm:block px-2"
          >
            Leaf Scanner
          </a>

          <a
            href="#weather"
            className="text-xs font-medium text-[#CCCCCC] hover:text-[#E95420] transition-colors hidden sm:block px-2"
          >
            Weather Risk
          </a>

          <a
            href="#testing-studio"
            className="text-xs font-medium text-white hover:bg-[#ff6332] transition-colors hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#E95420] shadow-sm font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>AI Testing Lab</span>
          </a>

          <a
            href="#districts"
            className="text-xs font-medium text-[#CCCCCC] hover:text-[#E95420] transition-colors hidden lg:block px-2"
          >
            Districts
          </a>

          <div className="h-4 w-px bg-[#333333] hidden sm:block" />

          <a
            href="https://github.com/Argonyx-26/T15-Team-Acers"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-md bg-[#222222] border border-[#333333] text-[#CCCCCC] hover:text-[#E95420] hover:border-[#E95420] transition-all"
            title="Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
