import React, { useState } from 'react';
import { Gem, GemCategory, GemLootRoll } from '../types/gem';
import { GEMS_LIST, GEM_CATEGORIES_META, GOLTOR_RULES } from '../data/gemData';
import { GemIllustration } from './GemIllustration';
import { Sparkles, Dices, Calculator, Coins, ShieldCheck, Flame, Scale, Search, CheckCircle } from 'lucide-react';

export const LapidaireView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGem, setSelectedGem] = useState<Gem>(GEMS_LIST[0]);

  // Jewelry Calculator state
  const [calcWeight, setCalcWeight] = useState<number>(1);
  const [calcIsCut, setCalcIsCut] = useState<boolean>(true);
  const [calcPurity, setCalcPurity] = useState<number>(1.0); // multiplier

  // Loot Simulator state
  const [lastLoot, setLastLoot] = useState<GemLootRoll | null>(null);
  const [lootDiceMode, setLootDiceMode] = useState<'virtual' | 'manual'>('virtual');
  const [manualLootD20, setManualLootD20] = useState<number>(12);

  // Filter gems
  const filteredGems = GEMS_LIST.filter((gem) => {
    const matchesSearch =
      gem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gem.magicalAffinity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gem.enchantmentEffect.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'all' || gem.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Calculate estimated price
  const baseRate = calcIsCut ? selectedGem.basePriceCut : selectedGem.basePriceRaw;
  const calculatedPricePo = Math.round(baseRate * calcWeight * calcPurity);

  // Generate random gem loot roll (virtual or manual)
  const handleRollLoot = (customD20?: number) => {
    const d20 = customD20 !== undefined
      ? Math.min(20, Math.max(1, customD20))
      : (lootDiceMode === 'manual' ? Math.min(20, Math.max(1, manualLootD20)) : Math.floor(Math.random() * 20) + 1);

    const randomGem = GEMS_LIST[(d20 - 1) % GEMS_LIST.length];
    const weightRoll = Math.floor(Math.random() * 3) + 1; // 1 to 3 UG
    const isCutRoll = Math.random() > 0.45; // 55% chance cut
    const purityRoll = Math.random();

    let purityLabel: 'Parfaite (+50%)' | 'Standard' | 'Avec inclusions (-25%)' = 'Standard';
    let purityMult = 1.0;

    if (purityRoll > 0.8) {
      purityLabel = 'Parfaite (+50%)';
      purityMult = 1.5;
    } else if (purityRoll < 0.25) {
      purityLabel = 'Avec inclusions (-25%)';
      purityMult = 0.75;
    }

    const baseVal = isCutRoll ? randomGem.basePriceCut : randomGem.basePriceRaw;
    const finalVal = Math.round(baseVal * weightRoll * purityMult);

    setLastLoot({
      d20,
      gem: randomGem,
      weight: weightRoll,
      isCut: isCutRoll,
      purity: purityLabel,
      finalValuePo: finalVal,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Title Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#d97706]/50 uppercase tracking-widest font-mono">
            Supplément Officieux Naheulbeuk & JDR
          </span>
          <span className="text-xs text-[#a89988] font-serif">· Document de référence</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#d4af37] drop-shadow flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#fde047]" />
          Le Lapidaire : Guide des Gemmes & Pierres Précieuses
        </h2>
        <p className="text-sm text-[#c4b5a5] italic font-serif">
          Traité minéralogique, évaluation en Unités Goltor, tables de valeur et effets d'enchantement
        </p>
      </div>

      {/* Quick Goltor Lore Box */}
      <div className="bg-[#241c16] rounded-xl border border-[#4d3a2e] p-4 sm:p-5 mb-8 text-xs font-serif text-[#d7c9b8] shadow-lg">
        <div className="flex items-start gap-3">
          <Scale className="w-6 h-6 text-[#d4af37] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#fef08a]">
              {GOLTOR_RULES.title}
            </h4>
            <p className="text-[#c4b5a5] leading-relaxed">
              {GOLTOR_RULES.intro} {GOLTOR_RULES.definition} {GOLTOR_RULES.cutBonus}
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Catalogue of 20 Gems */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Filter */}
          <div className="bg-[#241c16] p-3 rounded-lg border border-[#4a392d] space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une pierre, un effet, une couleur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181310] border border-[#59473b] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#f5ecd7] placeholder-[#7a6b5c] focus:outline-none focus:border-[#d4af37]"
              />
              <Search className="w-4 h-4 text-[#a89988] absolute left-3 top-2" />
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {['all', 'precieuse', 'fine', 'ornementale', 'magique'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-serif capitalize transition ${
                    selectedCategory === cat
                      ? 'bg-[#d4af37] text-[#1c140d] font-bold shadow'
                      : 'bg-[#181310] text-[#d7c9b8] hover:bg-[#382b22] border border-[#524136]'
                  }`}
                >
                  {cat === 'all' ? 'Toutes les gemmes' : GEM_CATEGORIES_META[cat as GemCategory]?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gem list cards */}
          <div className="space-y-3">
            {filteredGems.map((gem) => {
              const isSelected = selectedGem.id === gem.id;
              const catMeta = GEM_CATEGORIES_META[gem.category];

              return (
                <div
                  key={gem.id}
                  onClick={() => setSelectedGem(gem)}
                  className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex gap-4 items-center ${
                    isSelected
                      ? 'bg-[#3b271b] border-[#d4af37] text-white shadow-lg'
                      : 'bg-[#241c16] border-[#4a3a2e] text-[#e6d8c3] hover:border-[#854d0e]'
                  }`}
                >
                  <div className="w-16 h-20 shrink-0">
                    <GemIllustration
                      gem={gem}
                      size="sm"
                      showPlateDetails={false}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 text-xs font-serif space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-[#fef08a]">{gem.name}</h4>
                        <div className="text-[10px] text-[#a89988]">
                          {catMeta.label} · Dureté Mohs {gem.hardnessMohs}/10
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-xs text-[#fde047]">
                          {gem.basePriceCut} PO (taillée)
                        </span>
                        <div className="text-[10px] text-[#a89988]">
                          {gem.basePriceRaw} PO brut / UG
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#d7c9b8] line-clamp-1">
                      {gem.description}
                    </p>

                    <div className="text-[10px] text-[#38bdf8] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#fde047]" />
                      <span className="truncate"><strong>Sertissage :</strong> {gem.enchantmentEffect}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Gem Details & Tools */}
        <div className="lg:col-span-5 space-y-6">
          {/* Selected Gem Inspection Card */}
          <div className="bg-[#f7f2e7] text-[#2c1810] rounded-xl border-4 border-[#5c3e29] p-5 shadow-2xl">
            <div className="text-center border-b-2 border-[#854d0e]/30 pb-3 mb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#854d0e] font-serif font-bold">
                Planche Gemmologique
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#3a1d0f]">
                {selectedGem.name}
              </h3>
              <span className="text-xs font-serif italic text-[#78350f]">
                {GEM_CATEGORIES_META[selectedGem.category].label} · Échelle de Mohs {selectedGem.hardnessMohs}
              </span>
            </div>

            <div className="flex justify-center mb-4">
              <GemIllustration
                gem={selectedGem}
                size="md"
                showPlateDetails={true}
                className="w-44 h-52 shadow-md"
              />
            </div>

            <div className="space-y-3 font-serif text-xs">
              <p className="text-[#3b271d] leading-relaxed">
                {selectedGem.description}
              </p>

              {/* In-Game Enchantment Effects */}
              <div className="bg-[#f0e7d3] p-2.5 rounded border border-[#cfbca2]">
                <div className="font-bold text-[#451a03] text-xs flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
                  Propriétés d'Enchantement & Sertissage
                </div>
                <p className="text-[#2b1810] text-[11px]">
                  {selectedGem.enchantmentEffect}
                </p>
                <div className="text-[10px] text-[#78350f] italic mt-1">
                  Affinité arcanique : {selectedGem.magicalAffinity}
                </div>
              </div>

              {/* Naheulbeuk Humor & Lore */}
              <div className="bg-[#faf6ee] p-2.5 rounded border-l-4 border-[#854d0e] text-[11px] italic text-[#5c3e29]">
                {selectedGem.naheulbeukLore}
              </div>
            </div>

            {/* Price Table for this stone */}
            <div className="mt-4 pt-3 border-t border-[#c4a47c] grid grid-cols-2 gap-2 text-center text-xs font-serif">
              <div className="bg-[#efe8d8] p-2 rounded border border-[#dfd0bd]">
                <span className="text-[10px] text-[#78350f] uppercase block">Pierre Brute (1 UG)</span>
                <span className="font-mono font-bold text-[#854d0e] text-sm">{selectedGem.basePriceRaw} PO</span>
              </div>
              <div className="bg-[#efe8d8] p-2 rounded border border-[#dfd0bd]">
                <span className="text-[10px] text-[#78350f] uppercase block">Pierre Taillée (1 UG)</span>
                <span className="font-mono font-bold text-[#b45309] text-sm">{selectedGem.basePriceCut} PO</span>
              </div>
            </div>
          </div>

          {/* Jewelry Value Calculator */}
          <div className="bg-[#241c16] rounded-xl border border-[#4d3a2e] p-5 text-xs font-serif text-[#e6d8c3] shadow-xl">
            <h4 className="font-bold text-sm text-[#fef08a] mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#d4af37]" />
              Calculateur d'Évaluation Naine (Goltors)
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Poids en Unités Goltors (UG) :</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 1)}
                    className="w-16 bg-[#181310] border border-[#59473b] rounded px-2 py-1 text-center font-mono font-bold text-[#fde047]"
                  />
                  <span>UG</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span>État de la gemme :</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCalcIsCut(false)}
                    className={`px-2.5 py-1 rounded border text-[11px] ${
                      !calcIsCut ? 'bg-[#78350f] border-[#fde047] text-white' : 'bg-[#181310] border-[#3e2e23]'
                    }`}
                  >
                    Brute
                  </button>
                  <button
                    onClick={() => setCalcIsCut(true)}
                    className={`px-2.5 py-1 rounded border text-[11px] ${
                      calcIsCut ? 'bg-[#78350f] border-[#fde047] text-white' : 'bg-[#181310] border-[#3e2e23]'
                    }`}
                  >
                    Taillée (+150%)
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span>Pureté de la pierre :</span>
                <select
                  value={calcPurity}
                  onChange={(e) => setCalcPurity(parseFloat(e.target.value))}
                  className="bg-[#181310] border border-[#59473b] rounded px-2 py-1 text-xs text-[#f5ecd7]"
                >
                  <option value={1.5}>Parfaite (+50%)</option>
                  <option value={1.0}>Standard (x1.0)</option>
                  <option value={0.75}>Avec inclusions (-25%)</option>
                </select>
              </div>

              <div className="bg-[#181310] p-3 rounded-lg border border-[#4a392d] flex justify-between items-center mt-2">
                <div>
                  <span className="text-[10px] text-[#a89988] uppercase block">Valeur Marchande Estimée</span>
                  <span className="text-lg font-mono font-extrabold text-[#fde047]">
                    {calculatedPricePo} Pièces d'Or
                  </span>
                </div>
                <div className="text-[11px] text-[#c4b5a5] text-right font-mono">
                  soit {calculatedPricePo * 10} PA
                </div>
              </div>
            </div>
          </div>

          {/* Random Loot Generator */}
          <div className="bg-[#241c16] rounded-xl border border-[#4d3a2e] p-5 text-xs font-serif text-[#e6d8c3] shadow-xl space-y-3">
            <div className="flex justify-between items-center border-b border-[#3e2e23] pb-2">
              <h4 className="font-bold text-sm text-[#fef08a] flex items-center gap-2">
                <Dices className="w-4 h-4 text-[#d4af37]" />
                Tirage Aléatoire de Coffre (d20)
              </h4>
              <div className="flex items-center gap-1 bg-[#181310] p-0.5 rounded border border-[#3e2e23]">
                <button
                  type="button"
                  onClick={() => setLootDiceMode('virtual')}
                  className={`px-2 py-0.5 rounded text-[10px] transition ${
                    lootDiceMode === 'virtual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                  }`}
                >
                  Dé Virtuel
                </button>
                <button
                  type="button"
                  onClick={() => setLootDiceMode('manual')}
                  className={`px-2 py-0.5 rounded text-[10px] transition ${
                    lootDiceMode === 'manual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                  }`}
                >
                  Jet Manuel
                </button>
              </div>
            </div>

            {lootDiceMode === 'manual' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-[#a89988]">
                    Votre dé physique (1 à 20) :
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={manualLootD20}
                    onChange={(e) => setManualLootD20(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 bg-[#120e0b] border border-[#d4af37] rounded text-center text-sm font-bold text-[#fde047] font-mono focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => handleRollLoot(manualLootD20)}
                  className="w-full py-2 bg-[#b45309] hover:bg-[#d97706] text-white font-serif font-bold text-xs rounded shadow transition flex items-center justify-center gap-2"
                >
                  <span>Valider mon jet ({manualLootD20})</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleRollLoot()}
                className="w-full py-2 bg-[#b45309] hover:bg-[#d97706] text-white font-serif font-bold text-xs rounded shadow transition flex items-center justify-center gap-2"
              >
                <Dices className="w-4 h-4 text-[#fde047]" />
                <span>Lancer le d20 pour trouver une gemme</span>
              </button>
            )}

            {lastLoot && (
              <div className="mt-3 p-3 bg-[#181310] rounded-lg border border-[#d4af37]/60 space-y-1 animate-fade-in">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#fef08a]">
                    d20 ({lastLoot.d20}) : {lastLoot.gem.name}
                  </span>
                  <span className="font-mono text-[#fde047] font-bold">
                    {lastLoot.finalValuePo} PO
                  </span>
                </div>
                <div className="text-[11px] text-[#a89988]">
                  Poids : <strong>{lastLoot.weight} UG</strong> · État : <strong>{lastLoot.isCut ? 'Taillée' : 'Brute'}</strong> · {lastLoot.purity}
                </div>
                <p className="text-[10px] text-[#38bdf8] pt-1">
                  Sertissage : {lastLoot.gem.enchantmentEffect}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
