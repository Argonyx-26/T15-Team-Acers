import React from 'react';

interface LeafProps {
  type: 'early_blight' | 'late_blight' | 'blb' | 'healthy' | 'spider_mites' | 'brown_spot';
  className?: string;
}

export const LeafIllustrator: React.FC<LeafProps> = ({ type, className = 'w-full h-full' }) => {
  switch (type) {
    case 'early_blight':
      // Solanaceous leaf with concentric target board necrotized spots
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="eb-spot1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2c1a11" />
              <stop offset="40%" stopColor="#4a2e1d" />
              <stop offset="70%" stopColor="#7a5231" />
              <stop offset="90%" stopColor="#c89d38" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#415e37" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="eb-spot2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e130c" />
              <stop offset="45%" stopColor="#462b1b" />
              <stop offset="75%" stopColor="#825c34" />
              <stop offset="100%" stopColor="#c5a43b" stopOpacity="0.7" />
            </radialGradient>
          </defs>
          {/* Main Leaf blade */}
          <path
            d="M100 20 C140 50, 185 100, 160 180 C145 220, 100 235, 100 235 C100 235, 55 220, 40 180 C15 100, 60 50, 100 20 Z"
            fill="#365c37"
            stroke="#203d22"
            strokeWidth="3"
          />
          {/* Primary Vein */}
          <path d="M100 25 Q100 130 100 235" stroke="#254627" strokeWidth="3.5" strokeLinecap="round" />
          {/* Secondary Veins */}
          <path d="M100 70 Q130 65 155 80" stroke="#2a4e2c" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 70 Q70 65 45 80" stroke="#2a4e2c" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 115 Q140 110 160 135" stroke="#2a4e2c" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 115 Q60 110 40 135" stroke="#2a4e2c" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 160 Q135 160 148 185" stroke="#2a4e2c" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 160 Q65 160 52 185" stroke="#2a4e2c" strokeWidth="2" strokeLinecap="round" />

          {/* Early Blight Target Rings 1 */}
          <ellipse cx="75" cy="130" rx="26" ry="24" fill="url(#eb-spot1)" />
          <ellipse cx="75" cy="130" rx="18" ry="16" stroke="#2c1a11" strokeWidth="1.5" fill="none" opacity="0.8" />
          <ellipse cx="75" cy="130" rx="11" ry="10" stroke="#1f120b" strokeWidth="1.5" fill="none" opacity="0.9" />
          <circle cx="75" cy="130" r="4" fill="#150a05" />

          {/* Early Blight Target Rings 2 */}
          <ellipse cx="125" cy="95" rx="20" ry="18" fill="url(#eb-spot2)" />
          <ellipse cx="125" cy="95" rx="13" ry="12" stroke="#25150e" strokeWidth="1.2" fill="none" opacity="0.8" />
          <ellipse cx="125" cy="95" rx="7" ry="6" stroke="#1c0f0a" strokeWidth="1.2" fill="none" opacity="0.9" />

          {/* Smaller secondary lesion */}
          <circle cx="115" cy="170" r="10" fill="#3b2416" />
          <circle cx="115" cy="170" r="14" stroke="#a3822b" strokeWidth="1" opacity="0.6" fill="none" />
        </svg>
      );

    case 'late_blight':
      // Necrotized irregular margins and water-soaked dark lesions
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lb-decay" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e2417" />
              <stop offset="40%" stopColor="#2e2518" />
              <stop offset="85%" stopColor="#4d3a24" />
              <stop offset="100%" stopColor="#687332" />
            </linearGradient>
          </defs>
          {/* Base Leaf */}
          <path
            d="M100 20 C145 45, 180 95, 160 175 C145 220, 100 235, 100 235 C100 235, 55 220, 40 175 C20 95, 55 45, 100 20 Z"
            fill="#2c4d2d"
            stroke="#1b361c"
            strokeWidth="3"
          />
          {/* Veins */}
          <path d="M100 25 Q100 130 100 235" stroke="#1f3b20" strokeWidth="3.5" />
          <path d="M100 75 Q135 70 155 90" stroke="#224223" strokeWidth="2" />
          <path d="M100 75 Q65 70 45 90" stroke="#224223" strokeWidth="2" />
          <path d="M100 125 Q135 125 155 145" stroke="#224223" strokeWidth="2" />
          <path d="M100 125 Q65 125 45 145" stroke="#224223" strokeWidth="2" />

          {/* Late Blight Water-Soaked Necrosis on Tip & Margin */}
          <path
            d="M100 20 C120 32, 135 50, 125 75 C115 100, 85 95, 80 70 C75 45, 88 28, 100 20 Z"
            fill="url(#lb-decay)"
            stroke="#151b11"
            strokeWidth="1.5"
          />
          {/* Lateral necrotic blotch */}
          <path
            d="M160 120 C145 120, 125 135, 130 160 C135 180, 150 185, 160 175 C165 155, 170 135, 160 120 Z"
            fill="#231d16"
            stroke="#474e27"
            strokeWidth="2"
          />
          {/* White mildew fringe indication */}
          <path d="M125 76 Q105 85 85 72" stroke="#e1e8d5" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.85" />
          <path d="M130 158 Q140 170 152 178" stroke="#e1e8d5" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.85" />
        </svg>
      );

    case 'blb':
      // Rice Paddy Blade with characteristic wavy marginal bacterial blight
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Slender Rice Blade */}
          <path
            d="M100 10 C108 50, 115 140, 110 230 C100 235, 90 230, 90 230 C85 140, 92 50, 100 10 Z"
            fill="#3e6b35"
            stroke="#22441c"
            strokeWidth="2.5"
          />
          {/* Parallel Midrib */}
          <line x1="100" y1="12" x2="100" y2="230" stroke="#295422" strokeWidth="2.5" />
          <line x1="95" y1="20" x2="95" y2="225" stroke="#37612e" strokeWidth="1" opacity="0.7" />
          <line x1="105" y1="20" x2="105" y2="225" stroke="#37612e" strokeWidth="1" opacity="0.7" />

          {/* Bacterial Blight Straw-Yellow Wavy Marginal Lesion */}
          <path
            d="M100 10 C106 35, 114 70, 112 110 C110 135, 104 150, 107 175 C110 200, 109 230, 109 230 C104 232, 101 228, 101 220 C100 160, 104 100, 100 10 Z"
            fill="#c9b362"
            stroke="#876822"
            strokeWidth="1.2"
          />
          {/* Bleached drying tip */}
          <path d="M96 10 C99 25, 105 40, 102 60 C98 55, 96 35, 96 10 Z" fill="#dfd29d" />
        </svg>
      );

    case 'spider_mites':
      // Stippled yellow flecked leaf
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 20 C140 50, 185 100, 160 180 C145 220, 100 235, 100 235 C100 235, 55 220, 40 180 C15 100, 60 50, 100 20 Z"
            fill="#456839"
            stroke="#26451e"
            strokeWidth="3"
          />
          <path d="M100 25 Q100 130 100 235" stroke="#2e5225" strokeWidth="3" />
          {/* Dense yellow flecks / stippling */}
          <g fill="#d8c558" opacity="0.9">
            <circle cx="70" cy="90" r="2.5" />
            <circle cx="75" cy="95" r="2" />
            <circle cx="68" cy="102" r="3" />
            <circle cx="82" cy="110" r="2" />
            <circle cx="60" cy="120" r="2.5" />
            <circle cx="120" cy="85" r="2.5" />
            <circle cx="128" cy="92" r="3" />
            <circle cx="135" cy="105" r="2.5" />
            <circle cx="118" cy="115" r="2" />
            <circle cx="125" cy="130" r="3" />
            <circle cx="90" cy="150" r="2.5" />
            <circle cx="108" cy="165" r="2" />
            <circle cx="78" cy="170" r="3" />
            <circle cx="130" cy="155" r="2" />
            <circle cx="140" cy="140" r="2.5" />
          </g>
          {/* Bronzing tone along margins */}
          <path d="M160 140 Q150 175 130 205" stroke="#b07a33" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        </svg>
      );

    case 'brown_spot':
      // Rice brown spot
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 10 C108 50, 115 140, 110 230 C100 235, 90 230, 90 230 C85 140, 92 50, 100 10 Z"
            fill="#3a6632"
            stroke="#21421c"
            strokeWidth="2.5"
          />
          <line x1="100" y1="12" x2="100" y2="230" stroke="#254d1f" strokeWidth="2.5" />
          {/* Scattered round/oval brown spots with yellow halos */}
          <ellipse cx="98" cy="65" rx="6" ry="9" fill="#4d2918" />
          <ellipse cx="98" cy="65" rx="8" ry="12" stroke="#b89d3d" strokeWidth="1.2" fill="none" />

          <ellipse cx="104" cy="115" rx="7" ry="11" fill="#432213" />
          <ellipse cx="104" cy="115" rx="10" ry="14" stroke="#c4a83b" strokeWidth="1.2" fill="none" />

          <ellipse cx="96" cy="165" rx="5" ry="8" fill="#4d2918" />
          <ellipse cx="96" cy="165" rx="7" ry="10" stroke="#b89d3d" strokeWidth="1.2" fill="none" />
        </svg>
      );

    case 'healthy':
    default:
      // Pristine, vigorous green leaf with natural texture and venation
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 20 C145 50, 185 100, 160 180 C145 220, 100 235, 100 235 C100 235, 55 220, 40 180 C15 100, 55 50, 100 20 Z"
            fill="#2f6d35"
            stroke="#1c4721"
            strokeWidth="3"
          />
          {/* Main vein */}
          <path d="M100 25 Q100 130 100 235" stroke="#468f4d" strokeWidth="3.5" strokeLinecap="round" />
          {/* Graceful secondary veins */}
          <path d="M100 65 Q135 60 160 80" stroke="#3e7e45" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M100 65 Q65 60 40 80" stroke="#3e7e45" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M100 110 Q140 108 162 130" stroke="#3e7e45" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M100 110 Q60 108 38 130" stroke="#3e7e45" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M100 155 Q135 155 152 178" stroke="#3e7e45" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M100 155 Q65 155 48 178" stroke="#3e7e45" strokeWidth="2.2" strokeLinecap="round" />
          {/* Subtle leaf sheen */}
          <path
            d="M100 30 C125 55, 140 85, 130 130 C120 110, 110 80, 100 30 Z"
            fill="#4da356"
            opacity="0.25"
          />
        </svg>
      );
  }
};
