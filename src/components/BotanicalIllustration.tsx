import React from 'react';
import { Plant } from '../types/herb';

interface BotanicalIllustrationProps {
  plant: Plant;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'print';
  showPlateDetails?: boolean;
  className?: string;
}

export const BotanicalIllustration: React.FC<BotanicalIllustrationProps> = ({
  plant,
  size = 'md',
  showPlateDetails = true,
  className = '',
}) => {
  const accent = plant.accentColor || '#10b981';

  // Size styles
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-44 h-56',
    lg: 'w-64 h-80',
    hero: 'w-full max-w-md h-96',
    print: 'w-full h-64',
  };

  const renderIllustrationContent = () => {
    switch (plant.illustrationType) {
      case 'flower':
        return (
          <g>
            {/* Subtle glow background */}
            <circle cx="100" cy="85" r="45" fill={accent} opacity="0.12" filter="blur(8px)" />
            
            {/* Stem */}
            <path
              d="M 100 85 Q 98 120 102 165 Q 104 185 100 205"
              stroke="#3e5339"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Veined foliage */}
            <path
              d="M 101 135 C 75 125 60 145 55 160 C 70 162 90 152 101 143"
              fill="#4f6e4a"
              stroke="#2e422a"
              strokeWidth="1.5"
            />
            <path d="M 60 155 Q 80 145 98 140" stroke="#2e422a" strokeWidth="1" strokeDasharray="1,1" />

            <path
              d="M 101 150 C 125 140 140 160 145 175 C 130 178 112 168 101 158"
              fill="#4f6e4a"
              stroke="#2e422a"
              strokeWidth="1.5"
            />
            <path d="M 140 170 Q 120 160 102 155" stroke="#2e422a" strokeWidth="1" strokeDasharray="1,1" />

            {/* Calyx */}
            <path d="M 92 88 L 100 96 L 108 88 L 100 82 Z" fill="#3e5339" stroke="#23351e" strokeWidth="1" />

            {/* Petals */}
            <g transform="translate(100, 80)">
              {/* Radial petals */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <g key={i} transform={`rotate(${angle})`}>
                  <path
                    d="M 0 0 C -12 -20 -15 -38 0 -48 C 15 -38 12 -20 0 0"
                    fill={i % 2 === 0 ? '#fdf8ea' : '#f5edd4'}
                    stroke="#594632"
                    strokeWidth="1.2"
                  />
                  {/* Subtle inner vein tint */}
                  <path
                    d="M 0 -5 L 0 -42"
                    stroke={accent}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                </g>
              ))}
              {/* Inner Corollarium */}
              <circle cx="0" cy="0" r="14" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="10" fill="#fef08a" />
              {/* Stamen dots */}
              {[0, 60, 120, 180, 240, 300].map((deg, idx) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <circle
                    key={idx}
                    cx={Math.cos(rad) * 6}
                    cy={Math.sin(rad) * 6}
                    r="1.5"
                    fill="#92400e"
                  />
                );
              })}
              <circle cx="0" cy="0" r="2.5" fill="#451a03" />
            </g>

            {/* Floating magical spores if mystical */}
            {['fleur_de_lune', 'lotus_dor', 'athelas'].includes(plant.id) && (
              <g opacity="0.8">
                <circle cx="65" cy="50" r="2" fill={accent} />
                <circle cx="138" cy="45" r="1.5" fill={accent} />
                <circle cx="150" cy="100" r="2.5" fill={accent} />
                <circle cx="48" cy="110" r="1.8" fill={accent} />
              </g>
            )}
          </g>
        );

      case 'root':
        return (
          <g>
            {/* Ground surface line */}
            <path d="M 30 75 Q 100 70 170 75" stroke="#78350f" strokeWidth="2" strokeDasharray="3,3" />
            <text x="35" y="68" fill="#78350f" fontSize="7" fontFamily="Crimson Pro" fontStyle="italic">Humus & roche</text>

            {/* Top foliage sprout */}
            <path d="M 100 72 C 85 45 70 42 60 48 C 75 56 88 64 96 72" fill="#4f6e4a" stroke="#2c3b28" strokeWidth="1.2" />
            <path d="M 100 72 C 105 35 120 30 135 34 C 125 48 112 60 104 72" fill="#3e593a" stroke="#2c3b28" strokeWidth="1.2" />
            <path d="M 98 72 C 95 38 100 25 102 20 C 105 32 104 50 102 72" fill="#5f8559" stroke="#2c3b28" strokeWidth="1.2" />

            {/* Anthropomorphic or knotted root body */}
            {plant.id === 'mandragore_criarde' ? (
              <g>
                {/* Mandrake grotesque body */}
                <path
                  d="M 94 75 C 80 88 78 110 82 125 C 72 135 68 165 72 195 C 78 185 86 160 92 145 C 96 158 106 185 118 198 C 122 170 116 142 110 125 C 116 112 114 88 102 75 Z"
                  fill="#c29b64"
                  stroke="#573a1d"
                  strokeWidth="2"
                />
                {/* Grotesque face markings on root */}
                <circle cx="92" cy="100" r="2.5" fill="#4a3118" />
                <circle cx="104" cy="100" r="2.5" fill="#4a3118" />
                <path d="M 94 114 Q 98 108 102 114" stroke="#4a3118" strokeWidth="1.5" fill="none" />
                {/* Screaming mouth */}
                <ellipse cx="98" cy="120" rx="4" ry="6" fill="#3d220d" stroke="#573a1d" strokeWidth="1" />
                {/* Root hair wrinkles */}
                <path d="M 75 140 Q 60 155 52 175" stroke="#784f27" strokeWidth="1" fill="none" />
                <path d="M 115 142 Q 130 160 138 180" stroke="#784f27" strokeWidth="1" fill="none" />
                <path d="M 95 160 Q 98 185 96 210" stroke="#784f27" strokeWidth="1" fill="none" />
              </g>
            ) : (
              <g>
                {/* Shadow Root knot */}
                <path
                  d="M 96 75 C 84 90 76 115 80 135 C 70 148 55 170 45 195 C 60 188 75 170 86 155 C 92 172 95 198 96 215 C 104 195 112 170 114 150 C 128 170 142 190 155 205 C 145 178 132 155 120 135 C 124 112 118 90 104 75 Z"
                  fill="#2b2623"
                  stroke="#120f0d"
                  strokeWidth="2"
                />
                <circle cx="100" cy="140" r="30" fill={accent} opacity="0.15" filter="blur(6px)" />
                {/* Tendrils */}
                <path d="M 80 110 Q 55 125 40 145" stroke="#3d3733" strokeWidth="1.5" fill="none" />
                <path d="M 118 115 Q 145 130 160 150" stroke="#3d3733" strokeWidth="1.5" fill="none" />
              </g>
            )}
          </g>
        );

      case 'mushroom':
        return (
          <g>
            {/* Ground base */}
            <ellipse cx="100" cy="190" rx="60" ry="12" fill="#3a3028" opacity="0.3" />
            <path d="M 70 185 Q 100 180 130 185" stroke="#4a3b2c" strokeWidth="1.5" />

            {/* Glowing aura */}
            <circle cx="100" cy="95" r="45" fill={accent} opacity="0.15" filter="blur(8px)" />

            {/* Stipe / Foot */}
            <path
              d="M 90 110 Q 86 150 82 188 L 118 188 Q 114 150 110 110 Z"
              fill="#ebdcc7"
              stroke="#594432"
              strokeWidth="1.8"
            />
            {/* Foot rings and fibrils */}
            <path d="M 85 140 Q 100 145 115 140" stroke="#8a6d52" strokeWidth="1" fill="none" />
            <path d="M 83 165 Q 100 170 117 165" stroke="#8a6d52" strokeWidth="1" fill="none" />

            {/* Under-cap gills */}
            <ellipse cx="100" cy="115" rx="55" ry="15" fill="#4a2e4b" stroke="#301831" strokeWidth="1.5" />
            {[-40, -30, -20, -10, 0, 10, 20, 30, 40].map((offset, i) => (
              <line
                key={i}
                x1={100 + offset}
                y1="114"
                x2={100 + offset * 1.2}
                y2="124"
                stroke="#693b6a"
                strokeWidth="1"
              />
            ))}

            {/* Pileus / Brain-like or bell cap */}
            <path
              d="M 45 112 C 40 70 70 45 100 45 C 130 45 160 70 155 112 C 140 120 60 120 45 112 Z"
              fill="#7e4f88"
              stroke="#3c1e43"
              strokeWidth="2"
            />

            {/* Brain fold convolutions */}
            <path
              d="M 65 95 C 60 80 80 75 88 85 C 95 72 115 72 120 85 C 130 75 145 85 140 98"
              stroke="#43224b"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 75 75 C 80 60 100 58 105 68 C 115 58 130 62 130 74"
              stroke="#43224b"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Spore cloud */}
            <g opacity="0.75">
              <circle cx="50" cy="55" r="1.5" fill={accent} />
              <circle cx="68" cy="38" r="2" fill={accent} />
              <circle cx="100" cy="28" r="2.5" fill={accent} />
              <circle cx="132" cy="35" r="1.8" fill={accent} />
              <circle cx="152" cy="58" r="2" fill={accent} />
              <circle cx="140" cy="135" r="1.5" fill={accent} />
            </g>
          </g>
        );

      case 'shrub':
      case 'tree_bark':
        return (
          <g>
            {/* Trunk / branches */}
            <path
              d="M 94 210 Q 96 160 90 120 C 80 100 65 85 50 75"
              stroke="#4a2e1b"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 96 150 Q 110 120 125 90 C 135 75 148 65 160 55"
              stroke="#4a2e1b"
              strokeWidth="4.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 90 120 Q 96 90 100 60"
              stroke="#4a2e1b"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Leaves cluster */}
            <g fill="#365338" stroke="#1f3321" strokeWidth="1.2">
              <ellipse cx="48" cy="72" rx="14" ry="7" transform="rotate(-30 48 72)" />
              <ellipse cx="62" cy="80" rx="14" ry="7" transform="rotate(-15 62 80)" />
              <ellipse cx="158" cy="52" rx="14" ry="7" transform="rotate(25 158 52)" />
              <ellipse cx="140" cy="65" rx="14" ry="7" transform="rotate(35 140 65)" />
              <ellipse cx="98" cy="52" rx="14" ry="7" transform="rotate(-5 98 52)" />
            </g>

            {/* Berries or resin tears */}
            {plant.id === 'belladone_noire' ? (
              <g>
                <circle cx="42" cy="84" r="6" fill="#1e1526" stroke="#483359" strokeWidth="1.5" />
                <circle cx="40" cy="82" r="1.5" fill="#ffffff" opacity="0.6" />
                <circle cx="68" cy="94" r="6.5" fill="#1e1526" stroke="#483359" strokeWidth="1.5" />
                <circle cx="66" cy="92" r="1.5" fill="#ffffff" opacity="0.6" />
                <circle cx="150" cy="74" r="6" fill="#1e1526" stroke="#483359" strokeWidth="1.5" />
                <circle cx="148" cy="72" r="1.5" fill="#ffffff" opacity="0.6" />
              </g>
            ) : (
              /* Dragon blood sap tears */
              <g>
                <path d="M 94 135 C 92 142 90 148 94 154 C 98 148 96 142 94 135 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
                <circle cx="94" cy="154" r="4" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
                <circle cx="93" cy="153" r="1.2" fill="#fca5a5" />

                <path d="M 112 110 C 110 116 109 122 112 127 C 115 122 114 116 112 110 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
                <circle cx="112" cy="127" r="3.5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
              </g>
            )}
          </g>
        );

      case 'vine':
        return (
          <g>
            {/* Twisting spiraling vine */}
            <path
              d="M 60 210 Q 90 170 70 140 T 130 90 T 110 40 T 140 20"
              stroke="#2e592f"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Secondary intertwining stem */}
            <path
              d="M 75 210 Q 110 160 85 130 T 145 80 T 120 30"
              stroke="#1f3d20"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Heart-shaped pointed leaves */}
            {[
              { x: 62, y: 175, rot: -40 },
              { x: 92, y: 135, rot: 30 },
              { x: 80, y: 105, rot: -20 },
              { x: 130, y: 80, rot: 50 },
              { x: 105, y: 45, rot: -30 },
            ].map((lf, i) => (
              <g key={i} transform={`translate(${lf.x}, ${lf.y}) rotate(${lf.rot})`}>
                <path
                  d="M 0 0 C -15 -10 -15 -25 0 -35 C 15 -25 15 -10 0 0"
                  fill="#3f6e3c"
                  stroke="#1c3b1a"
                  strokeWidth="1.2"
                />
                <line x1="0" y1="-2" x2="0" y2="-30" stroke="#1c3b1a" strokeWidth="0.8" />
              </g>
            ))}

            {/* Sharp snake-fang thorns */}
            <polygon points="76,155 86,158 78,162" fill="#854d0e" />
            <polygon points="112,110 102,114 110,118" fill="#854d0e" />
            <polygon points="122,65 132,67 124,72" fill="#854d0e" />

            {/* Tendril spiral curls */}
            <path d="M 130 90 Q 155 95 160 85 Q 165 75 155 75 Q 150 78 152 82" stroke="#2e592f" strokeWidth="1.2" fill="none" />
          </g>
        );

      case 'aquatic':
        return (
          <g>
            {/* Water currents */}
            <path d="M 25 50 Q 100 40 175 50" stroke="#0284c7" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
            <path d="M 25 170 Q 100 160 175 170" stroke="#0284c7" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />

            {/* Sea bottom rock */}
            <path d="M 60 210 Q 100 190 140 210 Z" fill="#334155" stroke="#1e293b" strokeWidth="2" />

            {/* Waving kelp ribbons */}
            <path
              d="M 92 195 Q 65 145 95 110 Q 125 70 85 30"
              stroke="#0f766e"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 105 195 Q 130 145 105 105 Q 80 65 115 25"
              stroke="#115e59"
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 80 195 Q 60 150 75 120 Q 90 90 70 50"
              stroke="#134e4a"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />

            {/* Oxygen vesicles (bladders) glowing */}
            {[
              { cx: 78, cy: 130, r: 5 },
              { cx: 104, cy: 95, r: 6 },
              { cx: 90, cy: 60, r: 4.5 },
              { cx: 110, cy: 150, r: 4 },
            ].map((bubble, i) => (
              <g key={i}>
                <circle cx={bubble.cx} cy={bubble.cy} r={bubble.r} fill="#7dd3fc" stroke="#0284c7" strokeWidth="1.2" opacity="0.9" />
                <circle cx={bubble.cx - 1.5} cy={bubble.cy - 1.5} r={bubble.r / 3} fill="#ffffff" opacity="0.8" />
              </g>
            ))}
          </g>
        );

      case 'moss':
        return (
          <g>
            {/* Curved stone block */}
            <path d="M 40 180 C 40 120 160 120 160 180 L 160 210 L 40 210 Z" fill="#44403c" stroke="#292524" strokeWidth="2" />

            {/* Glowing carpet of lichen */}
            <path
              d="M 40 178 C 60 140 140 140 160 178 C 145 170 120 172 100 168 C 80 172 55 170 40 178 Z"
              fill="#15803d"
              stroke="#14532d"
              strokeWidth="1.5"
            />

            {/* Bioluminescent micro-glow */}
            <circle cx="100" cy="155" r="45" fill={accent} opacity="0.25" filter="blur(10px)" />

            {/* Micro sporophyte stalks */}
            {[55, 70, 85, 100, 115, 130, 145].map((x, i) => (
              <g key={i}>
                <line x1={x} y1="165" x2={x + (i % 2 === 0 ? 3 : -3)} y2="135" stroke="#86efac" strokeWidth="1" />
                <circle cx={x + (i % 2 === 0 ? 3 : -3)} cy="133" r="2.5" fill="#4ade80" stroke="#166534" strokeWidth="0.8" />
              </g>
            ))}

            {/* Spores floating in cave air */}
            <g opacity="0.85">
              <circle cx="60" cy="115" r="2" fill={accent} />
              <circle cx="85" cy="95" r="1.5" fill={accent} />
              <circle cx="115" cy="105" r="2.2" fill={accent} />
              <circle cx="140" cy="120" r="1.8" fill={accent} />
            </g>
          </g>
        );

      case 'succulent':
        return (
          <g>
            {/* Sand ground */}
            <path d="M 30 190 Q 100 185 170 190" stroke="#a16207" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Ribbed Cactus body */}
            <path
              d="M 70 190 C 65 140 70 80 100 80 C 130 80 135 140 130 190 Z"
              fill="#4d7c0f"
              stroke="#365314"
              strokeWidth="2"
            />
            {/* Vertical ridges */}
            <path d="M 85 85 C 80 120 80 160 84 190" stroke="#365314" strokeWidth="1.5" fill="none" />
            <path d="M 100 80 L 100 190" stroke="#365314" strokeWidth="1.8" fill="none" />
            <path d="M 115 85 C 120 120 120 160 116 190" stroke="#365314" strokeWidth="1.5" fill="none" />

            {/* Sharp needle clusters */}
            {[
              { x: 74, y: 110 }, { x: 72, y: 140 }, { x: 74, y: 170 },
              { x: 100, y: 100 }, { x: 100, y: 130 }, { x: 100, y: 160 },
              { x: 126, y: 110 }, { x: 128, y: 140 }, { x: 126, y: 170 },
            ].map((pt, i) => (
              <g key={i}>
                <line x1={pt.x} y1={pt.y} x2={pt.x - 6} y2={pt.y - 3} stroke="#172554" strokeWidth="1.2" />
                <line x1={pt.x} y1={pt.y} x2={pt.x + 6} y2={pt.y - 3} stroke="#172554" strokeWidth="1.2" />
                <line x1={pt.x} y1={pt.y} x2={pt.x} y2={pt.y - 7} stroke="#172554" strokeWidth="1.2" />
                <circle cx={pt.x} cy={pt.y} r="1.5" fill="#fef08a" />
              </g>
            ))}

            {/* Golden desert flower at crown */}
            <g transform="translate(100, 78)">
              <circle cx="0" cy="0" r="10" fill="#facc15" stroke="#854d0e" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="4" fill="#dc2626" />
            </g>
          </g>
        );

      default:
        return (
          <g>
            <circle cx="100" cy="100" r="40" fill={accent} opacity="0.3" />
            <path d="M 100 60 L 100 160" stroke="#3e5339" strokeWidth="3" />
            <circle cx="100" cy="60" r="15" fill="#fef3c7" stroke="#92400e" strokeWidth="1.5" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-3 rounded-lg border border-[#c4a47c]/60 bg-[#fbf7ed] shadow-sm select-none ${sizeMap[size]} ${className}`}
      style={{
        backgroundImage: 'radial-gradient(#ebdcc4 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      {/* Decorative antique frame corners */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#78350f]/60" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#78350f]/60" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#78350f]/60" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#78350f]/60" />

      {/* Plate Header (Ancient Botanical Treatise styling) */}
      {showPlateDetails && size !== 'sm' && (
        <div className="w-full flex justify-between items-center text-[9px] font-serif uppercase tracking-widest text-[#78350f] border-b border-[#e2d0b5] pb-1 mb-1">
          <span className="font-semibold">Planche Bot.</span>
          <span className="italic">{plant.rarity}</span>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 200 230"
        className="w-full h-full object-contain filter drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderIllustrationContent()}

        {/* Anatomical Fig annotations */}
        {showPlateDetails && size !== 'sm' && (
          <g fill="#78350f" fontSize="8" fontFamily="Crimson Pro" fontStyle="italic" opacity="0.85">
            <text x="18" y="215">Fig. 1 Herba viva</text>
            <text x="130" y="215">Fig. 2 Radix</text>
          </g>
        )}
      </svg>

      {/* Plate Footer / Latin Binomial */}
      {showPlateDetails && size !== 'sm' && (
        <div className="w-full text-center border-t border-[#e2d0b5] pt-1 mt-1">
          <div className="text-[11px] font-serif font-bold text-[#3e2723] tracking-wide truncate">
            {plant.name}
          </div>
          <div className="text-[9px] font-serif italic text-[#78350f] truncate">
            {plant.latinName}
          </div>
        </div>
      )}
    </div>
  );
};
