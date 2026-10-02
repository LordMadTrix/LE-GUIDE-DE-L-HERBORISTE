import React, { useState } from 'react';
import { BiomeType, Plant } from '../types/herb';
import { BIOMES_METADATA } from '../data/herbalistData';
import { BIOME_RARITY_TABLES, FORAGING_ENCOUNTERS_DATA, ForagingEncounter, BiomeRarityTier } from '../data/foragingEncountersData';
import { 
  Dices, 
  Sparkles, 
  Compass, 
  Trees, 
  Mountain, 
  Droplets, 
  EyeOff, 
  Sun, 
  Waves, 
  Flame, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Layers, 
  ShieldAlert, 
  HelpCircle,
  RefreshCw,
  Bookmark
} from 'lucide-react';

interface BiomeEncountersAndRarityViewProps {
  plants: Plant[];
  onSelectPlant?: (plant: Plant) => void;
}

const BIOME_ICONS: Record<BiomeType, React.ReactNode> = {
  foret: <Trees className="w-4 h-4 text-[#4ade80]" />,
  plaine: <Sun className="w-4 h-4 text-[#fde047]" />,
  marais: <Droplets className="w-4 h-4 text-[#2dd4bf]" />,
  montagne: <Mountain className="w-4 h-4 text-[#cbd5e1]" />,
  caverne: <EyeOff className="w-4 h-4 text-[#c084fc]" />,
  desert: <Sun className="w-4 h-4 text-[#fb923c]" />,
  aquatique: <Waves className="w-4 h-4 text-[#38bdf8]" />,
  volcanique: <Flame className="w-4 h-4 text-[#ef4444]" />,
};

export const BiomeEncountersAndRarityView: React.FC<BiomeEncountersAndRarityViewProps> = ({
  plants,
  onSelectPlant,
}) => {
  const [activeBiome, setActiveBiome] = useState<BiomeType>('foret');
  
  // Encounter generator state
  const [diceMode, setDiceMode] = useState<'virtual' | 'manual'>('virtual');
  const [manualD20, setManualD20] = useState<number>(10);
  const [currentEncounter, setCurrentEncounter] = useState<ForagingEncounter | null>(() => {
    const list = FORAGING_ENCOUNTERS_DATA['foret'];
    return list[0] || null;
  });
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [encounterHistory, setEncounterHistory] = useState<ForagingEncounter[]>([]);

  // Roll an encounter for current biome
  const handleRollEncounter = (customD20?: number) => {
    setIsRolling(true);

    setTimeout(() => {
      const d20 = customD20 !== undefined
        ? Math.min(20, Math.max(1, customD20))
        : (diceMode === 'manual' ? Math.min(20, Math.max(1, manualD20)) : Math.floor(Math.random() * 20) + 1);

      const encounters = FORAGING_ENCOUNTERS_DATA[activeBiome] || FORAGING_ENCOUNTERS_DATA.foret;
      
      // Match encounter by range
      let found = encounters.find(enc => d20 >= enc.rollMin && d20 <= enc.rollMax);
      if (!found) found = encounters[0];

      setCurrentEncounter(found);
      setEncounterHistory(prev => [found!, ...prev.slice(0, 4)]);
      setIsRolling(false);
    }, 280);
  };

  const rarityTiers = BIOME_RARITY_TABLES[activeBiome] || BIOME_RARITY_TABLES.foret;
  const biomeMeta = BIOMES_METADATA[activeBiome];

  return (
    <div className="space-y-8 font-serif animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#1c1410] rounded-xl border border-[#4a3b32] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#d97706]/50 uppercase tracking-widest font-mono font-bold flex items-center gap-1.5">
                <Dices className="w-3.5 h-3.5 text-[#f59e0b]" />
                Générateur Aléatoire de Péripéties & Écologie
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#fde047] flex items-center gap-2.5">
              Rencontres de Récolte & Tables de Rareté
            </h3>
            <p className="text-xs sm:text-sm text-[#c4b5a5] italic mt-1 max-w-3xl leading-relaxed">
              Consultez la distribution des raretés d100 pour chaque biome et simulez les rencontres aléatoires survenant lors d'une expédition de cueillette de 4 heures.
            </p>
          </div>

          <div className="text-left md:text-right shrink-0">
            <span className="text-xs text-[#a89988] block">Biome actif :</span>
            <strong className="text-base text-[#fef08a] flex items-center gap-2 md:justify-end">
              {BIOME_ICONS[activeBiome]}
              {biomeMeta.name}
            </strong>
          </div>
        </div>

        {/* Biome selector bar */}
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-[#3e2e23]">
          {(Object.keys(BIOMES_METADATA) as BiomeType[]).map((biomeKey) => {
            const isSelected = activeBiome === biomeKey;
            const meta = BIOMES_METADATA[biomeKey];

            return (
              <button
                key={biomeKey}
                onClick={() => {
                  setActiveBiome(biomeKey);
                  const firstEnc = FORAGING_ENCOUNTERS_DATA[biomeKey]?.[0] || null;
                  setCurrentEncounter(firstEnc);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow ${
                  isSelected
                    ? 'bg-[#b45309] text-white ring-2 ring-[#fde047]'
                    : 'bg-[#120e0b] text-[#c4b5a5] hover:bg-[#241a14] border border-[#3e2e23]'
                }`}
              >
                {BIOME_ICONS[biomeKey]}
                <span>{meta.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Rarity Table, Right Encounter Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: BIOME COMPONENT RARITY TABLE (d100)               */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#1c1612] p-5 rounded-xl border border-[#4a3b32] space-y-4 shadow-xl">
            <div className="border-b border-[#3e2e23] pb-3">
              <h4 className="text-lg font-bold text-[#fde047] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#f59e0b]" />
                Table de Rareté des Composants · {biomeMeta.name}
              </h4>
              <p className="text-xs text-[#a89988] italic mt-0.5">
                Distribution d100 des chances de trouver chaque palier botanique lors d'une fouille.
              </p>
            </div>

            {/* Tiers List */}
            <div className="space-y-3">
              {rarityTiers.map((tier, idx) => {
                // Find plants from this biome matching this tier rarity
                const rarityKey = tier.rarityName.toLowerCase().replace(' ', '_');
                const matchingPlants = plants.filter(
                  p => p.biome === activeBiome && (
                    p.rarity.toLowerCase() === rarityKey || 
                    (tier.rarityName === 'Peu Commune' && p.rarity === 'peu_commune') ||
                    (tier.rarityName === 'Très Rare' && p.rarity === 'tres_rare')
                  )
                );

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#140f0c] border border-[#3e2e23] space-y-2 hover:border-[#854d0e] transition"
                  >
                    <div className="flex justify-between items-start border-b border-[#2e2118] pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#2b1f14] text-[#fde047] border border-[#524136]">
                          d100 : {tier.range}
                        </span>
                        <strong className="text-sm" style={{ color: tier.rarityColor }}>
                          {tier.rarityName}
                        </strong>
                      </div>

                      <div className="text-right text-xs font-mono">
                        <span className="text-[#fde047] font-bold block">{tier.targetDc}</span>
                        <span className="text-[10px] text-[#a89988]">Rendement : {tier.harvestYield}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#c4b5a5] leading-relaxed">
                      {tier.description}
                    </p>

                    {/* Typical components */}
                    <div className="text-[11px] text-[#a89988] pt-1">
                      <strong className="text-[#d7c9b8]">Spécimens types : </strong>
                      <span>{tier.typicalComponents.join(', ')}</span>
                    </div>

                    {/* Actual plants from Grimoire in this biome */}
                    {matchingPlants.length > 0 && (
                      <div className="pt-2 border-t border-[#2e2118] flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-[#e6d8c3] font-bold">Dans votre grimoire :</span>
                        {matchingPlants.map(plant => (
                          <button
                            key={plant.id}
                            type="button"
                            onClick={() => onSelectPlant && onSelectPlant(plant)}
                            className="px-2 py-0.5 rounded bg-[#241a14] border border-[#523d2e] hover:border-[#d4af37] text-[10px] font-bold text-[#fef08a] transition flex items-center gap-1"
                            title="Ouvrir la fiche botanique"
                          >
                            <span>🌿 {plant.name}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-[#d4af37]" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: FORAGING ENCOUNTERS GENERATOR (d20)              */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#1c1612] p-5 sm:p-6 rounded-xl border border-[#4a3b32] space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#3e2e23] pb-3">
              <div>
                <h4 className="text-lg font-bold text-[#fde047] flex items-center gap-2">
                  <Dices className="w-5 h-5 text-[#f59e0b]" />
                  Péripétie de Récolte · Foyer d'Aventure
                </h4>
                <p className="text-xs text-[#a89988] italic mt-0.5">
                  Tirage sur la table d20 de {biomeMeta.name}
                </p>
              </div>

              {/* Mode switch */}
              <div className="flex items-center gap-1 bg-[#120e0b] p-0.5 rounded border border-[#3e2e23]">
                <button
                  type="button"
                  onClick={() => setDiceMode('virtual')}
                  className={`px-2 py-0.5 rounded text-[10px] transition ${
                    diceMode === 'virtual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                  }`}
                >
                  Dé Virtuel
                </button>
                <button
                  type="button"
                  onClick={() => setDiceMode('manual')}
                  className={`px-2 py-0.5 rounded text-[10px] transition ${
                    diceMode === 'manual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                  }`}
                >
                  Jet Manuel
                </button>
              </div>
            </div>

            {/* Roll trigger section */}
            <div className="space-y-3">
              {diceMode === 'manual' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-[#a89988]">Résultat sur votre dé physique (d20) :</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={manualD20}
                      onChange={(e) => setManualD20(parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 bg-[#120e0b] border border-[#d4af37] rounded text-center text-sm font-bold text-[#fde047] font-mono focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleRollEncounter(manualD20)}
                    disabled={isRolling}
                    className="w-full py-2.5 bg-[#b45309] hover:bg-[#d97706] text-white font-bold text-xs rounded-lg shadow transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-[#fde047]" />
                    <span>Consulter l'événement pour le résultat {manualD20}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleRollEncounter()}
                  disabled={isRolling}
                  className="w-full py-3 bg-[#b45309] hover:bg-[#d97706] text-white font-bold text-sm rounded-lg shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Dices className={`w-4 h-4 text-[#fde047] ${isRolling ? 'animate-spin' : ''}`} />
                  <span>{isRolling ? 'Exploration du biome...' : `Lancer une Rencontre dans ${biomeMeta.name} (d20)`}</span>
                </button>
              )}
            </div>

            {/* Current Encounter Card */}
            {currentEncounter && (
              <div className="bg-[#241a14] rounded-xl border-2 border-[#d4af37]/80 p-5 space-y-3.5 shadow-lg animate-fade-in">
                <div className="flex justify-between items-start border-b border-[#4d3a2e] pb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#3b271a] text-[#fcd34d] border border-[#854d0e]">
                      {currentEncounter.type.toUpperCase().replace('_', ' ')} · d20: {currentEncounter.rollMin}-{currentEncounter.rollMax}
                    </span>
                    <h5 className="text-xl font-bold text-[#fef08a] mt-1.5">
                      {currentEncounter.title}
                    </h5>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#e6d8c3] leading-relaxed">
                  {currentEncounter.description}
                </p>

                {/* Skill check pill */}
                <div className="p-3 bg-[#18120e] rounded-lg border border-[#3e2e23] space-y-1 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-[#fde047] flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-[#38bdf8]" />
                      Test Conseillé : {currentEncounter.checkRequired.skill}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#2b1f14] text-[#fde047] border border-[#524136]">
                      DD {currentEncounter.checkRequired.dc}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#a89988]">
                    Action : {currentEncounter.checkRequired.actionLabel}
                  </div>
                </div>

                {/* Outcomes */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#14532d]/30 border border-[#22c55e]/50 text-[#86efac] flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Réussite du test :</strong>
                      <span>{currentEncounter.successOutcome}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#450a0a]/40 border border-[#ef4444]/50 text-[#fca5a5] flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Échec du test :</strong>
                      <span>{currentEncounter.failureOutcome}</span>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-[11px] text-[#a89988] italic pt-1 border-t border-[#3e2e23]">
                  {currentEncounter.flavorQuote}
                </p>
              </div>
            )}

            {/* Encounter History */}
            {encounterHistory.length > 1 && (
              <div className="pt-2 border-t border-[#3e2e23] space-y-2">
                <span className="text-[10px] text-[#a89988] uppercase tracking-wider font-bold block">
                  Historique des rencontres récentes :
                </span>
                <div className="space-y-1 text-xs">
                  {encounterHistory.slice(1, 4).map((enc, i) => (
                    <div
                      key={i}
                      onClick={() => setCurrentEncounter(enc)}
                      className="p-2 rounded bg-[#140f0c] border border-[#2e2118] text-[#c4b5a5] hover:border-[#854d0e] cursor-pointer flex justify-between items-center"
                    >
                      <span className="truncate">{enc.title}</span>
                      <span className="font-mono text-[10px] text-[#fde047] shrink-0 ml-2">d20:{enc.rollMin}-{enc.rollMax}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
