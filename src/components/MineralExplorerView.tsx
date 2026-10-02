import React, { useState } from 'react';
import { Mineral, MineralCategory, MineralExtractionRoll } from '../types/mineral';
import { MINERALS_LIST, MINERAL_CATEGORIES_META } from '../data/mineralData';
import { MineralIllustration } from './MineralIllustration';
import { 
  Pickaxe, 
  Flame, 
  Hammer, 
  FlaskConical, 
  Coins, 
  Dices, 
  Layers, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Info,
  Scale
} from 'lucide-react';

interface MineralExplorerViewProps {
  onNavigateToForge?: () => void;
}

export const MineralExplorerView: React.FC<MineralExplorerViewProps> = ({
  onNavigateToForge,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMineral, setSelectedMineral] = useState<Mineral>(MINERALS_LIST[0]);

  // Mining Simulator state
  const [minerBonus, setMinerBonus] = useState<number>(3);
  const [miningDiceMode, setMiningDiceMode] = useState<'virtual' | 'manual'>('virtual');
  const [manualMiningD20, setManualMiningD20] = useState<number>(14);
  const [miningResult, setMiningResult] = useState<MineralExtractionRoll | null>(null);

  // Metal Forge Calculator state
  const [lingotCount, setLingotCount] = useState<number>(1);
  const [isDwarvenForged, setIsDwarvenForged] = useState<boolean>(false);

  // Filtered minerals
  const filteredMinerals = MINERALS_LIST.filter((min) => {
    const matchesSearch =
      min.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      min.latinOrScientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      min.forgeUsages.toLowerCase().includes(searchQuery.toLowerCase()) ||
      min.alchemicalProperties.toLowerCase().includes(searchQuery.toLowerCase()) ||
      min.originGeology.some(o => o.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || min.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Roll extraction check (virtual or manual)
  const handleRollExtraction = (customD20?: number) => {
    const d20 = customD20 !== undefined
      ? Math.min(20, Math.max(1, customD20))
      : (miningDiceMode === 'manual' ? Math.min(20, Math.max(1, manualMiningD20)) : Math.floor(Math.random() * 20) + 1);

    const total = d20 + minerBonus;
    const dc = selectedMineral.dcProspect;
    const critSuccess = d20 === 20;
    const critFail = d20 === 1;
    const success = (total >= dc || critSuccess) && !critFail;

    let quantity = 0;
    let message = '';

    if (critSuccess) {
      quantity = Math.floor(Math.random() * 3) + 3; // 3 to 5 lingots
      message = `Coup de pioche magistral ! Une géode de pureté exceptionnelle mise au jour (+${quantity} lingots/blocs bruts de ${selectedMineral.name}).`;
    } else if (success) {
      quantity = Math.floor(Math.random() * 2) + 1; // 1 to 2 lingots
      message = `Filon exploité avec succès. Les parois de roche cèdent sous vos coups (+${quantity} lingot/bloc brut).`;
    } else if (critFail) {
      message = `Éboulement ou fissure toxique ! Votre pioche s'est brisée ou une poche de gaz a jailli (1d6 dégâts contondants ou poison).`;
    } else {
      message = `Roche trop dure ou veine épuisée. Vos efforts n'ont dégagé que de la caillasse stérile (DD ${dc} non atteint).`;
    }

    setMiningResult({
      roll: d20,
      total,
      dc,
      success,
      critSuccess,
      critFail,
      quantityMined: quantity,
      message,
    });
  };

  // Calculate forge / trade value
  const baseValue = selectedMineral.basePricePerLingot * lingotCount;
  const calculatedValue = isDwarvenForged ? Math.round(baseValue * 1.5) : baseValue;

  return (
    <div className="space-y-8 animate-fade-in font-serif">
      {/* Intro Header */}
      <div className="bg-[#1f1915] rounded-xl border border-[#4a3b32] p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3e2e23] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#d97706]/50 uppercase tracking-widest font-mono">
                Traité de Minéralogie & Métallurgie de Fangh
              </span>
              <span className="text-xs text-[#a89988]">
                {MINERALS_LIST.length} métaux, roches et minéraux alchimiques
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#d4af37] flex items-center gap-2.5">
              <Pickaxe className="w-6 h-6 text-[#f59e0b]" />
              Minéraux, Minerais & Métaux Rares
            </h3>
            <p className="text-xs text-[#c4b5a5] italic mt-1 max-w-3xl">
              De l'inestimable Mithril léger des profondeurs naines à l'Adamantium céleste, en passant par le Vif-Argent liquide et le Sel gemme protecteur : tout ce dont l'artisan, le forgeron et l'alchimiste ont besoin.
            </p>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap gap-3 items-center justify-between pt-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a89988]" />
            <input
              type="text"
              placeholder="Rechercher par minéral, forge, alchimie ou gisement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#120e0b] border border-[#524136] rounded-lg text-xs font-serif text-[#f4ecd8] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#120e0b] border border-[#524136] rounded-lg px-3 py-2 text-xs font-serif text-[#f4ecd8] focus:outline-none"
            >
              <option value="all">Toutes les catégories ({MINERALS_LIST.length})</option>
              {Object.entries(MINERAL_CATEGORIES_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left List, Right Detailed Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Mineral Catalog */}
        <div className="lg:col-span-5 space-y-3 max-h-[850px] overflow-y-auto pr-1">
          {filteredMinerals.length === 0 ? (
            <div className="p-8 text-center bg-[#1a1410] rounded-xl border border-[#3e2e23] text-sm text-[#a89988] italic">
              Aucun minéral ne correspond à vos filtres.
            </div>
          ) : (
            filteredMinerals.map((mineral) => {
              const isSelected = selectedMineral.id === mineral.id;
              const catMeta = MINERAL_CATEGORIES_META[mineral.category];

              return (
                <div
                  key={mineral.id}
                  onClick={() => {
                    setSelectedMineral(mineral);
                    setMiningResult(null);
                  }}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer flex gap-4 items-center ${
                    isSelected
                      ? 'bg-[#3d2719] border-[#d4af37] shadow-lg text-[#fef08a]'
                      : 'bg-[#1a1410] border-[#3e2e23] text-[#d7c9b8] hover:bg-[#261d17]'
                  }`}
                >
                  <MineralIllustration mineral={mineral} size="sm" showPlateDetails={false} className="shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-bold text-sm text-[#fef08a] truncate">
                        {mineral.name}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-[#fde047] shrink-0">
                        {mineral.basePricePerLingot} po/lingot
                      </span>
                    </div>

                    <div className="text-[11px] text-[#a89988] italic truncate">
                      {mineral.latinOrScientificName}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded border font-bold"
                        style={{
                          color: catMeta?.color || '#38bdf8',
                          borderColor: catMeta?.color || '#38bdf8',
                          backgroundColor: '#181310',
                        }}
                      >
                        {catMeta?.label.split(' ')[0] || mineral.category}
                      </span>
                      <span className="text-[10px] text-[#cbd5e1] font-mono">
                        Dureté : {mineral.hardnessMohs}/10
                      </span>
                      <span className="text-[10px] text-[#fcd34d] font-mono">
                        DD Mine : {mineral.dcProspect}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Mineral Dossier & Mining Simulator */}
        <div className="lg:col-span-7 space-y-6">
          {/* Detailed Mineral Sheet */}
          <div className="bg-[#1c1612] rounded-xl border-2 border-[#5c4033] p-6 text-[#f4ecd8] shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start border-b border-[#4d3a2e] pb-5">
              <MineralIllustration
                mineral={selectedMineral}
                size="md"
                className="shrink-0 mx-auto sm:mx-0 shadow-lg"
              />

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded border"
                    style={{
                      color: MINERAL_CATEGORIES_META[selectedMineral.category]?.color || '#38bdf8',
                      borderColor: MINERAL_CATEGORIES_META[selectedMineral.category]?.color || '#38bdf8',
                      backgroundColor: '#1f1915',
                    }}
                  >
                    {MINERAL_CATEGORIES_META[selectedMineral.category]?.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#b45309]/50 font-mono">
                    Rareté : {selectedMineral.rarity}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#d4af37]">
                  {selectedMineral.name}
                </h3>
                <p className="text-xs text-[#a89988] italic">
                  {selectedMineral.latinOrScientificName}
                </p>

                {/* Quick specs grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
                  <div className="bg-[#140f0c] p-2 rounded border border-[#3e2e23]">
                    <span className="text-[10px] text-[#a89988] block">Dureté de Mohs</span>
                    <span className="font-bold text-[#fde047] font-mono">{selectedMineral.hardnessMohs} / 10</span>
                  </div>
                  <div className="bg-[#140f0c] p-2 rounded border border-[#3e2e23]">
                    <span className="text-[10px] text-[#a89988] block">Prix au lingot/bloc</span>
                    <span className="font-bold text-[#fde047] font-mono">{selectedMineral.basePricePerLingot} PO</span>
                  </div>
                  <div className="bg-[#140f0c] p-2 rounded border border-[#3e2e23] col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#a89988] block">DD Prospection / Mine</span>
                    <span className="font-bold text-[#fde047] font-mono">DD {selectedMineral.dcProspect}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Geological Origin & Description */}
            <div className="space-y-3 text-xs leading-relaxed text-[#d7c9b8]">
              <div>
                <h4 className="font-bold text-[#fde047] uppercase tracking-wider text-[11px] mb-1">
                  Description & Aspect Visuel :
                </h4>
                <p>{selectedMineral.description}</p>
                <p className="mt-1 text-[#a89988] italic">{selectedMineral.visualAspect}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#fde047] uppercase tracking-wider text-[11px] mb-1">
                  Gisements & Origine Géologique :
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMineral.originGeology.map((geo, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#261d17] border border-[#3e2e23] text-[#cbd5e1]">
                      📍 {geo}
                    </span>
                  ))}
                </div>
                <div className="mt-1 text-[11px] text-[#a89988]">
                  Densité : <strong className="text-[#f4ecd8]">{selectedMineral.density}</strong> · Fusion : <strong className="text-[#f4ecd8]">{selectedMineral.meltingPoint}</strong>
                </div>
              </div>
            </div>

            {/* Forge & Metallurgy Usages */}
            <div className="bg-[#241a12] p-4 rounded-xl border border-[#78350f]/60 space-y-2">
              <h4 className="font-bold text-[#fcd34d] flex items-center gap-2 text-xs uppercase tracking-wider">
                <Hammer className="w-4 h-4 text-[#f59e0b]" />
                Propriétés de Forge & Armurerie :
              </h4>
              <p className="text-xs text-[#fef3c7] leading-relaxed">
                {selectedMineral.forgeUsages}
              </p>
            </div>

            {/* Alchemical & Medicinal Properties */}
            <div className="bg-[#181a24] p-4 rounded-xl border border-[#3b82f6]/40 space-y-2">
              <h4 className="font-bold text-[#93c5fd] flex items-center gap-2 text-xs uppercase tracking-wider">
                <FlaskConical className="w-4 h-4 text-[#38bdf8]" />
                Usages Alchimiques & Solvants :
              </h4>
              <p className="text-xs text-[#e0f2fe] leading-relaxed">
                {selectedMineral.alchemicalProperties}
              </p>
            </div>

            {/* Synergies with Herbalism */}
            <div className="bg-[#131f18] p-4 rounded-xl border border-[#10b981]/40 space-y-2">
              <h4 className="font-bold text-[#6ee7b7] flex items-center gap-2 text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#34d399]" />
                Synergies avec les Plantes du Grimoire :
              </h4>
              <p className="text-xs text-[#ecfdf5] leading-relaxed">
                {selectedMineral.synergies}
              </p>
            </div>

            {/* JDR / Lore Notes */}
            <div className="p-3 rounded-lg bg-[#140f0c] border border-[#3e2e23] text-xs text-[#a89988] flex items-start gap-2 italic">
              <Info className="w-4 h-4 text-[#eab308] shrink-0 mt-0.5" />
              <span>{selectedMineral.jdrNotes}</span>
            </div>
          </div>

          {/* Interactive Tools: Mining Simulator (Virtual or Manual d20) & Forge Calculator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tool 1: Mining Simulator */}
            <div className="bg-[#1c1612] p-5 rounded-xl border border-[#4a3b32] space-y-4">
              <div className="flex items-center justify-between border-b border-[#3e2e23] pb-2">
                <h4 className="font-bold text-sm text-[#fde047] flex items-center gap-2">
                  <Pickaxe className="w-4 h-4 text-[#f59e0b]" />
                  Simulateur d'Extraction Minière
                </h4>
                <div className="flex items-center gap-1 bg-[#181310] p-0.5 rounded border border-[#3e2e23]">
                  <button
                    onClick={() => setMiningDiceMode('virtual')}
                    className={`px-2 py-0.5 rounded text-[10px] transition ${
                      miningDiceMode === 'virtual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                    }`}
                  >
                    Dé Virtuel
                  </button>
                  <button
                    onClick={() => setMiningDiceMode('manual')}
                    className={`px-2 py-0.5 rounded text-[10px] transition ${
                      miningDiceMode === 'manual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                    }`}
                  >
                    Jet Manuel
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#a89988] mb-1">
                    Bonus de Mineur / Athlétisme : <strong className="text-[#fde047]">+{minerBonus}</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={minerBonus}
                    onChange={(e) => setMinerBonus(parseInt(e.target.value))}
                    className="w-full accent-[#d4af37]"
                  />
                </div>

                {miningDiceMode === 'manual' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <label className="text-[#a89988] shrink-0">
                        Votre jet sur votre dé physique (d20) :
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={manualMiningD20}
                        onChange={(e) => setManualMiningD20(parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 bg-[#120e0b] border border-[#d4af37] rounded text-center text-sm font-bold text-[#fde047] font-mono focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleRollExtraction(manualMiningD20)}
                      className="w-full py-2.5 rounded-lg bg-[#b45309] hover:bg-[#d97706] text-white font-bold flex items-center justify-center gap-2 shadow-lg transition"
                    >
                      <CheckCircle className="w-4 h-4 text-[#fde047]" />
                      <span>Valider mon jet ({manualMiningD20}) vs DD {selectedMineral.dcProspect}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRollExtraction()}
                    className="w-full py-2.5 rounded-lg bg-[#b45309] hover:bg-[#d97706] text-white font-bold flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <Dices className="w-4 h-4 text-[#fde047]" />
                    <span>Lancer le d20 pour extraire {selectedMineral.name}</span>
                  </button>
                )}

                {/* Roll Result Display */}
                {miningResult && (
                  <div
                    className={`p-3 rounded-lg border text-xs space-y-1.5 transition ${
                      miningResult.critSuccess
                        ? 'bg-[#14532d]/40 border-[#22c55e] text-[#86efac]'
                        : miningResult.success
                        ? 'bg-[#1e3a5f]/40 border-[#38bdf8] text-[#bae6fd]'
                        : miningResult.critFail
                        ? 'bg-[#450a0a]/50 border-[#ef4444] text-[#fca5a5]'
                        : 'bg-[#291b16] border-[#78350f] text-[#fde047]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono font-bold">
                      <span className="flex items-center gap-1.5">
                        {miningResult.success ? (
                          <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#ef4444]" />
                        )}
                        {miningResult.critSuccess
                          ? 'RÉUSSITE CRITIQUE (20 NATUREL) !'
                          : miningResult.success
                          ? 'EXTRACTION RÉUSSIE !'
                          : miningResult.critFail
                          ? 'ÉCHEC CRITIQUE (1 NATUREL) !'
                          : 'ÉCHEC DE LA VEINE'}
                      </span>
                      <span>
                        d20:{miningResult.roll} + {minerBonus} = {miningResult.total} (DD {miningResult.dc})
                      </span>
                    </div>
                    <p className="font-serif leading-relaxed">{miningResult.message}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tool 2: Forge & Metallurgy Valuator */}
            <div className="bg-[#1c1612] p-5 rounded-xl border border-[#4a3b32] space-y-4">
              <div className="flex items-center justify-between border-b border-[#3e2e23] pb-2">
                <h4 className="font-bold text-sm text-[#fde047] flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#eab308]" />
                  Estimateur de Valeur en Forge
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2b1f17] text-[#cbd5e1] border border-[#524136]">
                  Marché de Fangh
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#a89988] mb-1">
                    Quantité de lingots ou blocs : <strong className="text-[#fde047]">{lingotCount}</strong>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={lingotCount}
                    onChange={(e) => setLingotCount(parseInt(e.target.value))}
                    className="w-full accent-[#d4af37]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="dwarvenForge"
                    checked={isDwarvenForged}
                    onChange={(e) => setIsDwarvenForged(e.target.checked)}
                    className="accent-[#d4af37] rounded"
                  />
                  <label htmlFor="dwarvenForge" className="text-[#d7c9b8] cursor-pointer">
                    Lingot affiné par un maître forgeron nain (+50% de valeur)
                  </label>
                </div>

                {/* Final Estimated Price */}
                <div className="bg-[#120e0b] p-3 rounded-lg border border-[#3e2e23] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#a89988] block">Valeur marchande totale</span>
                    <span className="font-bold text-lg text-[#fde047] font-mono">
                      {calculatedValue.toLocaleString('fr-FR')} PO
                    </span>
                  </div>
                  <Scale className="w-6 h-6 text-[#d4af37]" />
                </div>

                {onNavigateToForge && (
                  <button
                    onClick={onNavigateToForge}
                    className="w-full mt-2 py-2 bg-[#b45309] hover:bg-[#d97706] text-white font-bold text-xs rounded-lg shadow transition flex items-center justify-center gap-2"
                  >
                    <Hammer className="w-4 h-4 text-[#fde047]" />
                    <span>Ouvrir la Grande Forge pour travailler ce métal</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
