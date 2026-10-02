import React from 'react';
import { Mineral } from '../types/mineral';

interface MineralIllustrationProps {
  mineral: Mineral;
  size?: 'sm' | 'md' | 'lg' | 'print';
  showPlateDetails?: boolean;
  className?: string;
}

export const MineralIllustration: React.FC<MineralIllustrationProps> = ({
  mineral,
  size = 'md',
  showPlateDetails = true,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-40 h-48',
    lg: 'w-56 h-64',
    print: 'w-36 h-44',
  };

  const color = mineral.color;
  const accent = mineral.accentColor;

  const renderShape = () => {
    switch (mineral.category) {
      case 'metal_magique':
        return (
          <g>
            <polygon
              points="45,95 155,95 175,145 25,145"
              fill={color}
              stroke="#1c1917"
              strokeWidth="2"
            />
            <polygon
              points="60,65 140,65 155,95 45,95"
              fill={accent}
              opacity="0.85"
              stroke="#1c1917"
              strokeWidth="1.5"
            />
            <polygon
              points="60,65 45,95 25,145 35,115"
              fill="#000000"
              opacity="0.25"
            />
            <polygon
              points="140,65 155,95 175,145 160,115"
              fill="#ffffff"
              opacity="0.3"
            />
            <circle cx="100" cy="115" r="16" fill="none" stroke="#1c1917" strokeWidth="1.5" opacity="0.6" />
            <path d="M100,103 L100,127 M92,111 L108,119 M92,119 L108,111" stroke="#1c1917" strokeWidth="1.5" opacity="0.7" />
            <line x1="65" y1="70" x2="135" y2="70" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
            <line x1="50" y1="100" x2="150" y2="100" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
          </g>
        );

      case 'mineral_alchimique':
        return (
          <g>
            <path
              d="M100,45 C75,85 55,120 55,145 C55,175 75,185 100,185 C125,185 145,175 145,145 C145,120 125,85 100,45 Z"
              fill={color}
              stroke="#1c1917"
              strokeWidth="2"
            />
            <path
              d="M100,55 C82,90 68,125 68,145 C68,168 82,176 100,176 C118,176 132,168 132,145 C132,125 118,90 100,55 Z"
              fill={accent}
              opacity="0.7"
            />
            <path d="M85,38 Q100,25 90,15 Q105,10 95,5" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.6" />
            <path d="M115,38 Q100,25 110,15" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.6" />
            <ellipse cx="90" cy="135" rx="10" ry="18" fill="#ffffff" opacity="0.5" transform="rotate(-20 90 135)" />
            <circle cx="120" cy="155" r="5" fill="#ffffff" opacity="0.6" />
          </g>
        );

      case 'roche_tellurique':
        return (
          <g>
            <polygon
              points="100,30 145,75 165,140 120,185 50,170 35,105 65,55"
              fill={color}
              stroke="#1c1917"
              strokeWidth="2"
            />
            <polygon
              points="100,30 145,75 105,115 65,55"
              fill={accent}
              opacity="0.65"
              stroke="#1c1917"
              strokeWidth="1.2"
            />
            <polygon
              points="145,75 165,140 120,135 105,115"
              fill="#000000"
              opacity="0.4"
              stroke="#1c1917"
              strokeWidth="1"
            />
            <polygon
              points="105,115 120,185 50,170 80,135"
              fill={color}
              stroke="#1c1917"
              strokeWidth="1.2"
            />
            <line x1="100" y1="30" x2="105" y2="115" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
            <line x1="105" y1="115" x2="50" y2="170" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
          </g>
        );

      case 'sel_reactif':
        return (
          <g>
            <polygon
              points="60,80 110,50 160,80 110,110"
              fill={color}
              stroke="#1c1917"
              strokeWidth="1.8"
            />
            <polygon
              points="60,80 110,110 110,165 60,135"
              fill={accent}
              opacity="0.85"
              stroke="#1c1917"
              strokeWidth="1.8"
            />
            <polygon
              points="110,110 160,80 160,135 110,165"
              fill="#000000"
              opacity="0.2"
              stroke="#1c1917"
              strokeWidth="1.8"
            />
            <polygon
              points="135,115 165,95 185,115 155,135"
              fill={color}
              opacity="0.9"
              stroke="#1c1917"
              strokeWidth="1.5"
            />
            <polygon
              points="135,115 155,135 155,165 135,145"
              fill={accent}
              stroke="#1c1917"
              strokeWidth="1.5"
            />
            <line x1="60" y1="80" x2="110" y2="50" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
            <line x1="110" y1="50" x2="160" y2="80" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
          </g>
        );

      case 'cristal_brut':
      default:
        return (
          <g>
            <polygon
              points="100,25 125,80 120,165 80,165 75,80"
              fill={color}
              stroke="#1c1917"
              strokeWidth="2"
            />
            <polygon
              points="100,25 125,80 100,165 100,80"
              fill={accent}
              opacity="0.75"
              stroke="#1c1917"
              strokeWidth="1.2"
            />
            <polygon
              points="55,75 80,115 75,175 45,165 40,115"
              fill={color}
              opacity="0.85"
              stroke="#1c1917"
              strokeWidth="1.5"
            />
            <polygon
              points="145,65 165,105 155,170 125,165 125,105"
              fill={accent}
              opacity="0.75"
              stroke="#1c1917"
              strokeWidth="1.5"
            />
            <line x1="100" y1="20" x2="100" y2="10" stroke={accent} strokeWidth="2" opacity="0.6" />
            <line x1="90" y1="25" x2="80" y2="18" stroke={accent} strokeWidth="1.5" opacity="0.6" />
            <line x1="110" y1="25" x2="120" y2="18" stroke={accent} strokeWidth="1.5" opacity="0.6" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-2 rounded-lg bg-[#f7f2e7] border-2 border-[#b89f82] shadow-sm select-none ${sizeMap[size]} ${className}`}
    >
      <div className="absolute inset-1 border border-[#c9b49b] pointer-events-none rounded opacity-60" />

      {showPlateDetails && size !== 'sm' && (
        <div className="w-full text-center pb-1 border-b border-[#d8c5b0] text-[9px] font-serif uppercase tracking-widest text-[#78543d] font-bold">
          Planche Minérale · {mineral.category.replace('_', ' ')}
        </div>
      )}

      <div className="flex-1 flex items-center justify-center w-full">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-40 drop-shadow-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="100"
            cy="110"
            r="65"
            fill={accent}
            opacity="0.15"
            filter="blur(10px)"
          />
          {renderShape()}
        </svg>
      </div>

      {showPlateDetails && size !== 'sm' && (
        <div className="w-full text-center pt-1 border-t border-[#d8c5b0]">
          <div className="text-[10px] font-serif font-bold text-[#3d2415] truncate">
            {mineral.name}
          </div>
          <div className="text-[8px] font-serif italic text-[#78543d] truncate">
            {mineral.latinOrScientificName}
          </div>
        </div>
      )}
    </div>
  );
};
