import React from 'react';
import { Gem } from '../types/gem';

interface GemIllustrationProps {
  gem: Gem;
  size?: 'sm' | 'md' | 'lg' | 'print';
  showPlateDetails?: boolean;
  className?: string;
}

export const GemIllustration: React.FC<GemIllustrationProps> = ({
  gem,
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

  const color = gem.color;
  const accent = gem.accentColor;

  const renderFacets = () => {
    switch (gem.cutType) {
      case 'emeraude':
        return (
          <g>
            {/* Emerald octagon cut */}
            <polygon
              points="60,40 140,40 170,70 170,150 140,180 60,180 30,150 30,70"
              fill={color}
              stroke="#1c1917"
              strokeWidth="2"
            />
            {/* Table (inner rectangle with cut corners) */}
            <polygon
              points="75,65 125,65 145,85 145,135 125,155 75,155 55,135 55,85"
              fill={accent}
              opacity="0.75"
              stroke="#1c1917"
              strokeWidth="1.5"
            />
            {/* Step facets */}
            <line x1="60" y1="40" x2="75" y2="65" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            <line x1="140" y1="40" x2="125" y2="65" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            <line x1="170" y1="70" x2="145" y2="85" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            <line x1="170" y1="150" x2="145" y2="135" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            <line x1="140" y1="180" x2="125" y2="155" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            <line x1="60" y1="180" x2="75" y2="155" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            <line x1="30" y1="150" x2="55" y2="135" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            <line x1="30" y1="70" x2="55" y2="85" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            {/* Specular glare */}
            <polygon points="75,65 110,65 125,80 90,80" fill="#ffffff" opacity="0.45" />
          </g>
        );

      case 'coussin':
        return (
          <g>
            {/* Cushion square with rounded sides */}
            <path
              d="M 60 40 Q 100 35 140 40 Q 165 60 165 100 Q 165 140 140 160 Q 100 165 60 160 Q 35 140 35 100 Q 35 60 60 40 Z"
              fill={color}
              stroke="#1c1917"
              strokeWidth="2"
            />
            {/* Center table */}
            <path
              d="M 75 60 Q 100 56 125 60 Q 140 75 140 100 Q 140 125 125 140 Q 100 144 75 140 Q 60 125 60 100 Q 60 75 75 60 Z"
              fill={accent}
              opacity="0.8"
              stroke="#1c1917"
              strokeWidth="1.2"
            />
            {/* Corner diagonal facets */}
            <line x1="60" y1="40" x2="75" y2="60" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />
            <line x1="140" y1="40" x2="125" y2="60" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />
            <line x1="140" y1="160" x2="125" y2="140" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />
            <line x1="60" y1="160" x2="75" y2="140" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />
            {/* Inner kite facets */}
            <polygon points="100,56 115,80 100,100 85,80" fill="#ffffff" opacity="0.35" />
          </g>
        );

      case 'cabochon':
        return (
          <g>
            {/* Smooth domed cabochon */}
            <ellipse cx="100" cy="110" rx="65" ry="50" fill={color} stroke="#1c1917" strokeWidth="2" />
            {/* Color depth gradient */}
            <ellipse cx="95" cy="105" rx="52" ry="38" fill={accent} opacity="0.4" />
            {/* Silky adularescence or chatoyancy stripe if moonstone or cat eye */}
            {gem.id === 'pierre_de_lune' && (
              <path
                d="M 65 80 Q 95 110 135 140"
                stroke="#ffffff"
                strokeWidth="16"
                strokeLinecap="round"
                opacity="0.6"
                filter="blur(3px)"
              />
            )}
            {/* Lapis lazuli pyrite gold flecks */}
            {gem.id === 'lapis_lazuli' && (
              <g fill="#fde047">
                <circle cx="85" cy="95" r="2.5" />
                <circle cx="115" cy="105" r="1.8" />
                <circle cx="75" cy="120" r="2" />
                <circle cx="125" cy="85" r="1.5" />
                <circle cx="100" cy="130" r="2.2" />
              </g>
            )}
            {/* Malachite concentric bands */}
            {gem.id === 'malachite' && (
              <g fill="none" stroke="#064e3b" strokeWidth="3" opacity="0.7">
                <ellipse cx="95" cy="110" rx="40" ry="28" />
                <ellipse cx="95" cy="110" rx="25" ry="16" />
                <ellipse cx="95" cy="110" rx="10" ry="6" />
              </g>
            )}
            {/* Glossy specular crescent highlight */}
            <path
              d="M 65 85 C 80 70 120 70 135 85 C 120 80 80 80 65 85 Z"
              fill="#ffffff"
              opacity="0.75"
            />
          </g>
        );

      case 'goutte':
        return (
          <g>
            {/* Pear / Tear droplet cut */}
            <path
              d="M 100 35 C 125 80 160 115 160 145 C 160 178 133 195 100 195 C 67 195 40 178 40 145 C 40 115 75 80 100 35 Z"
              fill={color}
              stroke="#1c1917"
              strokeWidth="2"
            />
            {/* Inner facet star */}
            <polygon
              points="100,65 125,120 100,165 75,120"
              fill={accent}
              opacity="0.65"
              stroke="#ffffff"
              strokeWidth="1"
            />
            {/* Facet lines */}
            <line x1="100" y1="35" x2="100" y2="65" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />
            <line x1="160" y1="145" x2="125" y2="120" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            <line x1="40" y1="145" x2="75" y2="120" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            <line x1="100" y1="195" x2="100" y2="165" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            {/* Specular glare */}
            <circle cx="85" cy="100" r="10" fill="#ffffff" opacity="0.4" />
          </g>
        );

      case 'brillant':
      default:
        return (
          <g>
            {/* Brilliant round facet cut */}
            <circle cx="100" cy="110" r="60" fill={color} stroke="#1c1917" strokeWidth="2" />
            {/* Table (central octagon) */}
            <polygon
              points="82,75 118,75 138,95 138,125 118,145 82,145 62,125 62,95"
              fill={accent}
              opacity="0.75"
              stroke="#1c1917"
              strokeWidth="1.2"
            />
            {/* Star facets (triangles from table to edge) */}
            <polygon points="100,50 82,75 118,75" fill="#ffffff" opacity="0.3" stroke="#1c1917" strokeWidth="0.8" />
            <polygon points="160,110 138,95 138,125" fill="#ffffff" opacity="0.25" stroke="#1c1917" strokeWidth="0.8" />
            <polygon points="100,170 118,145 82,145" fill="#ffffff" opacity="0.2" stroke="#1c1917" strokeWidth="0.8" />
            <polygon points="40,110 62,125 62,95" fill="#ffffff" opacity="0.35" stroke="#1c1917" strokeWidth="0.8" />
            {/* Corner kites */}
            <polygon points="142,68 118,75 138,95" fill="#ffffff" opacity="0.45" stroke="#1c1917" strokeWidth="0.8" />
            <polygon points="58,68 82,75 62,95" fill="#ffffff" opacity="0.5" stroke="#1c1917" strokeWidth="0.8" />
            {/* Specular light flash */}
            <path d="M 75 80 L 100 85 L 85 105 Z" fill="#ffffff" opacity="0.8" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-2 rounded-lg border border-[#c4a47c]/60 bg-[#fbf7ed] shadow-sm select-none ${sizeMap[size]} ${className}`}
      style={{
        backgroundImage: 'radial-gradient(#ebdcc4 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      {/* Corner brackets */}
      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-[#78350f]/60" />
      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#78350f]/60" />
      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#78350f]/60" />
      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-[#78350f]/60" />

      {/* Header plate label */}
      {showPlateDetails && size !== 'sm' && (
        <div className="w-full flex justify-between items-center text-[8px] font-serif uppercase tracking-widest text-[#78350f] border-b border-[#e2d0b5] pb-0.5 mb-1">
          <span>Lapidaire</span>
          <span className="font-mono">{gem.weightGoltors} UG</span>
        </div>
      )}

      {/* SVG Gem Art */}
      <svg
        viewBox="0 0 200 220"
        className="w-full h-full object-contain filter drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow halo */}
        <circle cx="100" cy="110" r="55" fill={accent} opacity="0.2" filter="blur(8px)" />

        {renderFacets()}

        {/* Small sparkle star */}
        <g transform="translate(135, 75)">
          <path d="M 0 -8 Q 1 -1 8 0 Q 1 1 0 8 Q -1 1 -8 0 Q -1 -1 0 -8 Z" fill="#ffffff" opacity="0.9" />
        </g>
      </svg>

      {/* Footer plate label */}
      {showPlateDetails && size !== 'sm' && (
        <div className="w-full text-center border-t border-[#e2d0b5] pt-0.5 mt-0.5">
          <div className="text-[10px] font-serif font-bold text-[#3e2723] truncate">
            {gem.name}
          </div>
          <div className="text-[8px] font-serif italic text-[#78350f] truncate">
            Taille : {gem.cutType} · Mohs {gem.hardnessMohs}
          </div>
        </div>
      )}
    </div>
  );
};
