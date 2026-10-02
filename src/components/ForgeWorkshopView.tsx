import React, { useState } from 'react';
import { ForgeRecipe, ForgeCraftResult, Mineral } from '../types/mineral';
import { FORGE_RECIPES, FORGE_RULES_LORE } from '../data/forgeRecipesData';
import { MINERALS_LIST, MINERAL_CATEGORIES_META } from '../data/mineralData';
import { GEMS_LIST } from '../data/gemData';
import { Creature } from '../types/herb';
import { 
  Hammer, 
  Flame, 
  ShieldCheck, 
  Sword, 
  Shield, 
  Wrench, 
  Sparkles, 
  Coins, 
  Dices, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Anvil, 
  Layers, 
  Zap, 
  Scale, 
  Check, 
  Crosshair,
  BookOpen
} from 'lucide-react';

interface ForgeWorkshopViewProps {
  creatures?: Creature[];
  onSelectMineral?: (mineral: Mineral) => void;
  onNavigateToMinerals?: () => void;
}

export const ForgeWorkshopView: React.FC<ForgeWorkshopViewProps> = ({
  creatures = [],
  onSelectMineral,
  onNavigateToMinerals,
}) => {
  // Navigation sub-tab
  const [activeTab, setActiveTab] = useState<'recipes' | 'anvil' | 'lore'>('recipes');

  // Recipe catalog filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<ForgeRecipe>(FORGE_RECIPES[0]);

  // Interactive Anvil state
  const [customTier, setCustomTier] = useState<'Forge de Campagne' | 'Forge de Maître' | 'Enclume Naine Ancestrale' | 'Fourneau Volcanique'>('Forge de Maître');
  const [blacksmithBonus, setBlacksmithBonus] = useState<number>(5); // Force + Outils de forgeron
  const [quenchingMethod, setQuenchingMethod] = useState<string>('Trempe à l\'Huile Alchimique (Flexibilité & Résistance)');
  const [selectedGemInlay, setSelectedGemInlay] = useState<string>('none');
  const [selectedCreatureComponent, setSelectedCreatureComponent] = useState<string>('none');

  // Dice simulation state
  const [forgeDiceMode, setForgeDiceMode] = useState<'virtual' | 'manual'>('virtual');
  const [manualD20, setManualD20] = useState<number>(15);
  const [craftResult, setCraftResult] = useState<ForgeCraftResult | null>(null);
  const [isHammering, setIsHammering] = useState<boolean>(false);

  // Filter recipes
  const filteredRecipes = FORGE_RECIPES.filter((rec) => {
    const matchesCategory = selectedCategory === 'all' || rec.category === selectedCategory;
    const matchesSearch =
      rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.specialProperties.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rec.damageOrAC.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate adjusted craft DC
  const tierModifiers: Record<string, number> = {
    'Forge de Campagne': +2, // harder to maintain heat
    'Forge de Maître': 0,
    'Enclume Naine Ancestrale': -2,
    'Fourneau Volcanique': -3,
  };

  const currentTierMod = tierModifiers[customTier] || 0;
  const effectiveForgeDC = Math.max(8, selectedRecipe.difficultyDC + currentTierMod);

  // Trigger forge hammer strike
  const handleStrikeAnvil = (customRoll?: number) => {
    setIsHammering(true);
    setCraftResult(null);

    setTimeout(() => {
      const d20 = customRoll !== undefined
        ? Math.min(20, Math.max(1, customRoll))
        : (forgeDiceMode === 'manual' ? Math.min(20, Math.max(1, manualD20)) : Math.floor(Math.random() * 20) + 1);

      const total = d20 + blacksmithBonus;
      const critSuccess = d20 === 20;
      const critFail = d20 === 1;
      const success = (total >= effectiveForgeDC || critSuccess) && !critFail;

      let quality: ForgeCraftResult['finalQuality'] = 'Standard';
      let valuePo = selectedRecipe.marketValuePo;
      let effectiveProps = [...selectedRecipe.specialProperties];
      let msg = '';

      if (critSuccess || total >= effectiveForgeDC + 5) {
        quality = 'Chef-d\'œuvre Ancestral (+1)';
        valuePo = Math.round(selectedRecipe.marketValuePo * 1.5);
        effectiveProps.unshift('⭐️ Chef-d\'œuvre : +1 supplémentaire aux jets d\'attaque, de dégâts ou à la CA');
        msg = `Frappe magistrale ! Le marteau a résonné d'une harmonie parfaite. L'acier a absorbé la chaleur sans la moindre micro-fissure. Vous réalisez un Chef-d'œuvre (+50% de valeur) !`;
      } else if (success) {
        quality = 'Qualité Supérieure';
        msg = `Forge réussie (${total} vs DD ${effectiveForgeDC}) ! La pièce refroidit dans son bain d'huile avec un tranchant impeccable et un équilibrage d'armurier.`;
      } else if (critFail) {
        quality = 'Échec Total (Lingots perdus)';
        valuePo = 0;
        effectiveProps = ['Ébréché et irrécupérable'];
        msg = `1 Naturel ! Catastrophe sur l'enclume : la pièce s'est brisée lors du trempage thermique. Le métal est brûlé et les lingots sont perdus.`;
      } else {
        quality = 'Trempe Fragilisée';
        valuePo = Math.round(selectedRecipe.marketValuePo * 0.4);
        effectiveProps = ['Défaut structurel : malus de -1 à l\'efficacité'];
        msg = `Échec de forgeage (${total} vs DD ${effectiveForgeDC}). La température n'était pas uniforme. La pièce présente des porosités et doit être refondue à perte.`;
      }

      // Add gem inlay effect if any
      if (selectedGemInlay !== 'none') {
        const foundGem = GEMS_LIST.find(g => g.id === selectedGemInlay);
        if (foundGem) {
          effectiveProps.push(`💎 Sertissage (${foundGem.name}) : ${foundGem.enchantmentEffect}`);
          valuePo += foundGem.basePriceCut;
        }
      }

      // Add creature component effect if any
      if (selectedCreatureComponent !== 'none') {
        effectiveProps.push(`🐉 Adjonction de Monstre (${selectedCreatureComponent}) : Propriété élémentaire infusée`);
        valuePo += 150;
      }

      setCraftResult({
        roll: d20,
        total,
        dc: effectiveForgeDC,
        success,
        critSuccess,
        critFail,
        itemCreatedName: selectedRecipe.name,
        finalQuality: quality,
        effectiveValuePo: valuePo,
        effectiveProperties: effectiveProps,
        message: msg,
      });

      setIsHammering(false);
    }, 450);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-serif space-y-8 animate-fade-in">
      {/* Forge Header Plaque */}
      <div className="bg-[#1f1612] rounded-xl border-2 border-[#d4af37]/80 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#f97316]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#d97706]/60 uppercase tracking-widest font-mono font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#f97316] animate-pulse" />
                Atelier de Ferronnerie Tellurique & Armurerie Naine
              </span>
              <span className="text-xs text-[#a89988]">Terre de Fangh & D&D 5e</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fef08a] flex items-center gap-3">
              <Hammer className="w-9 h-9 text-[#f59e0b]" />
              La Grande Forge Légendaire
            </h2>

            <p className="text-xs sm:text-sm text-[#c4b5a5] italic mt-1.5 max-w-3xl leading-relaxed">
              Façonnez des armes en Mithril, harnois en Adamantium, épées d'Argent Alchimique et boucliers en écailles de dragon. Sertissez des gemmes arcaniques sur votre enclume et simulez vos frappes au dé.
            </p>
          </div>

          {/* Quick tab switcher */}
          <div className="flex flex-wrap items-center gap-2 bg-[#120e0b] p-1.5 rounded-xl border border-[#3e2e23] shrink-0">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow ${
                activeTab === 'recipes'
                  ? 'bg-[#b45309] text-white ring-1 ring-[#fde047]'
                  : 'text-[#d7c9b8] hover:bg-[#241a14]'
              }`}
            >
              <Sword className="w-4 h-4 text-[#fde047]" />
              <span>Armurerie ({FORGE_RECIPES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('anvil')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow ${
                activeTab === 'anvil'
                  ? 'bg-[#b45309] text-white ring-1 ring-[#fde047]'
                  : 'text-[#d7c9b8] hover:bg-[#241a14]'
              }`}
            >
              <Hammer className="w-4 h-4 text-[#f97316]" />
              <span>L'Enclume Active</span>
            </button>

            <button
              onClick={() => setActiveTab('lore')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow ${
                activeTab === 'lore'
                  ? 'bg-[#b45309] text-white ring-1 ring-[#fde047]'
                  : 'text-[#d7c9b8] hover:bg-[#241a14]'
              }`}
            >
              <Flame className="w-4 h-4 text-[#38bdf8]" />
              <span>Traité Métallurgique</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: ARMORY & RECIPE CATALOG                             */}
      {/* ============================================================== */}
      {activeTab === 'recipes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Filter & List */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search and Filters */}
            <div className="bg-[#1c1511] p-4 rounded-xl border border-[#3e2e23] space-y-3 shadow-md">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#a89988]" />
                <input
                  type="text"
                  placeholder="Rechercher une arme, armure, propriété..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#120e0b] border border-[#4a392d] rounded-lg text-xs text-[#f5ecd7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'Tout' },
                  { id: 'arme', label: '⚔️ Armes' },
                  { id: 'armure', label: '🛡️ Armures' },
                  { id: 'bouclier', label: '🛡️ Boucliers' },
                  { id: 'outil', label: '✂️ Outils' },
                  { id: 'relique', label: '✨ Reliques' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                      selectedCategory === cat.id
                        ? 'bg-[#854d0e] text-white shadow'
                        : 'bg-[#120e0b] text-[#c4b5a5] hover:bg-[#241a14] border border-[#3e2e23]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipe Cards List */}
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredRecipes.map((recipe) => {
                const isSelected = selectedRecipe.id === recipe.id;
                const primaryMineral = MINERALS_LIST.find(m => m.id === recipe.primaryMineralId);

                return (
                  <div
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#3b271a] border-[#d4af37] ring-1 ring-[#d4af37] shadow-lg'
                        : 'bg-[#181310] border-[#3e2e23] hover:border-[#854d0e]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#fef08a] truncate">
                          {recipe.name}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#a89988] flex items-center gap-2">
                        <span>Métal : <strong className="text-[#38bdf8]">{primaryMineral?.name || recipe.primaryMineralId}</strong></span>
                        <span>·</span>
                        <span>{recipe.ingotsCount} lingot(s)</span>
                      </div>

                      <div className="text-[10px] text-[#4ade80] font-mono">
                        {recipe.damageOrAC}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-[#fde047] block">
                        {recipe.marketValuePo} PO
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#120e0b] text-[#cbd5e1] border border-[#3e2e23] inline-block mt-1">
                        DD {recipe.difficultyDC}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Recipe Sheet & Instant Forge Button */}
          <div className="lg:col-span-7 bg-[#1c1612] p-6 sm:p-7 rounded-xl border border-[#4a3b32] space-y-6 shadow-xl">
            {/* Header of selected recipe */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3e2e23] pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#d97706]/50">
                  {selectedRecipe.category.toUpperCase()} · PALIER {selectedRecipe.requiredForgeTier}
                </span>
                <h3 className="text-2xl font-bold text-[#fef08a] mt-1.5">
                  {selectedRecipe.name}
                </h3>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xl font-mono font-extrabold text-[#fde047] block">
                  {selectedRecipe.marketValuePo} Pièces d'Or
                </span>
                <span className="text-[11px] text-[#a89988]">
                  Poids : {selectedRecipe.weightKg} kg · Fabrication : {selectedRecipe.forgeTime}
                </span>
              </div>
            </div>

            {/* Required Materials Card */}
            <div className="bg-[#140f0c] p-4 rounded-xl border border-[#3e2e23] space-y-3">
              <h4 className="text-xs font-bold text-[#fde047] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#f59e0b]" />
                Composants & Matériaux de Forge Requis
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#1f1612] border border-[#3e2e23] flex items-center justify-between">
                  <div>
                    <span className="text-[#a89988] block text-[10px]">Métal Primaire :</span>
                    <strong className="text-[#38bdf8] text-sm">
                      {MINERALS_LIST.find(m => m.id === selectedRecipe.primaryMineralId)?.name || selectedRecipe.primaryMineralId}
                    </strong>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-[#2b1f17] text-[#fde047] border border-[#524136]">
                    {selectedRecipe.ingotsCount} lingot(s)
                  </span>
                </div>

                {selectedRecipe.creatureComponent && (
                  <div className="p-2.5 rounded-lg bg-[#1f1612] border border-[#3e2e23] flex items-center justify-between">
                    <div>
                      <span className="text-[#a89988] block text-[10px]">Élément de Monstre :</span>
                      <strong className="text-[#f87171] text-xs">
                        {selectedRecipe.creatureComponent}
                      </strong>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#450a0a] text-[#fca5a5]">
                      Bestiaire
                    </span>
                  </div>
                )}

                {selectedRecipe.gemId && (
                  <div className="p-2.5 rounded-lg bg-[#1f1612] border border-[#3e2e23] flex items-center justify-between">
                    <div>
                      <span className="text-[#a89988] block text-[10px]">Sertissage Recommandé :</span>
                      <strong className="text-[#fde047] text-xs">
                        {GEMS_LIST.find(g => g.id === selectedRecipe.gemId)?.name || 'Gemme Arcanique'}
                      </strong>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#3b271a] text-[#fde047]">
                      Lapidaire
                    </span>
                  </div>
                )}

                <div className="p-2.5 rounded-lg bg-[#1f1612] border border-[#3e2e23] flex items-center justify-between">
                  <div>
                    <span className="text-[#a89988] block text-[10px]">Seuil de Difficulté :</span>
                    <strong className="text-[#fde047] text-sm font-mono">
                      DD {selectedRecipe.difficultyDC}
                    </strong>
                  </div>
                  <span className="text-[10px] text-[#c4b5a5]">
                    Force + Forgeron
                  </span>
                </div>
              </div>
            </div>

            {/* Special Properties & Game Effects */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#fde047] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#fde047]" />
                Propriétés Armurières & Effets en Jeu (D&D 5e)
              </h4>

              <div className="bg-[#241a14] p-3 rounded-lg border border-[#523d2e] font-mono text-sm font-bold text-[#4ade80]">
                Efficacité : {selectedRecipe.damageOrAC}
              </div>

              <div className="space-y-2">
                {selectedRecipe.specialProperties.map((prop, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#181310] border border-[#3e2e23] text-xs text-[#e6d8c3] flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                    <span>{prop}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Lore */}
            <div className="space-y-2 text-xs text-[#c4b5a5] leading-relaxed pt-2 border-t border-[#3e2e23]">
              <p className="italic text-[#e6d8c3]">
                « {selectedRecipe.description} »
              </p>
              <div className="bg-[#140f0c] p-3 rounded border border-[#2e2118] text-[11px] text-[#a89988]">
                <strong>Chronique Naine : </strong>{selectedRecipe.historicalLore}
              </div>
            </div>

            {/* Direct Action Button: Load on Anvil */}
            <button
              onClick={() => setActiveTab('anvil')}
              className="w-full py-3 bg-[#b45309] hover:bg-[#d97706] text-white font-bold text-sm rounded-xl shadow-xl transition flex items-center justify-center gap-2"
            >
              <Hammer className="w-5 h-5 text-[#fde047]" />
              <span>Chauffer le Métal & Forger cette Pièce sur l'Enclume</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: THE INTERACTIVE ANVIL (FORGE SIMULATOR)             */}
      {/* ============================================================== */}
      {activeTab === 'anvil' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls: Workshop Setup */}
          <div className="lg:col-span-7 bg-[#1c1612] p-6 sm:p-7 rounded-xl border border-[#4a3b32] space-y-6 shadow-xl">
            <div className="border-b border-[#3e2e23] pb-3">
              <h3 className="text-xl font-bold text-[#fde047] flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#f97316]" />
                Foyer, Enclume & Paramètres de Forgeage
              </h3>
              <p className="text-xs text-[#a89988] italic mt-0.5">
                Pièce sélectionnée : <strong className="text-[#fef08a]">{selectedRecipe.name}</strong>
              </p>
            </div>

            {/* 1. Furnace / Forge Tier */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#fef08a] uppercase tracking-wider">
                1. Qualité du Foyer & Température
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { tier: 'Forge de Campagne', desc: '800°C - 1100°C (+2 au DD)', mod: +2 },
                  { tier: 'Forge de Maître', desc: '1200°C - 1800°C (DD normal)', mod: 0 },
                  { tier: 'Enclume Naine Ancestrale', desc: '1900°C - 2400°C (-2 au DD)', mod: -2 },
                  { tier: 'Fourneau Volcanique', desc: '2500°C - 3200°C (-3 au DD)', mod: -3 },
                ].map((item) => (
                  <button
                    key={item.tier}
                    type="button"
                    onClick={() => setCustomTier(item.tier as any)}
                    className={`p-3 rounded-lg border text-left transition ${
                      customTier === item.tier
                        ? 'bg-[#3b271a] border-[#d4af37] ring-1 ring-[#d4af37] text-[#fef08a]'
                        : 'bg-[#140f0c] border-[#3e2e23] text-[#c4b5a5] hover:bg-[#261d17]'
                    }`}
                  >
                    <div className="font-bold text-xs">{item.tier}</div>
                    <div className="text-[10px] text-[#a89988] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Quenching Method */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#fef08a] uppercase tracking-wider">
                2. Méthode de Trempe Thermique
              </label>
              <select
                value={quenchingMethod}
                onChange={(e) => setQuenchingMethod(e.target.value)}
                className="w-full bg-[#120e0b] border border-[#524136] rounded-lg p-2.5 text-xs text-[#f5ecd7] focus:outline-none focus:border-[#d4af37]"
              >
                <option value="Trempe à l'Huile Alchimique (Flexibilité & Résistance)">
                  🧴 Trempe à l'Huile Alchimique (Équilibre & Flexibilité)
                </option>
                <option value="Trempe à l'Eau Froide de Source (Dureté de fil maximale)">
                  💧 Trempe à l'Eau de Source (Tranchant maximal / risque d'éclat)
                </option>
                <option value="Trempe au Sang de Monstre (Infusion mystique)">
                  🩸 Trempe au Sang de Monstre (Infusion élémentaire mystique)
                </option>
              </select>
            </div>

            {/* 3. Gem Inlay Option */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#fef08a] uppercase tracking-wider">
                3. Sertissage de Gemme Arcanique (Optionnel)
              </label>
              <select
                value={selectedGemInlay}
                onChange={(e) => setSelectedGemInlay(e.target.value)}
                className="w-full bg-[#120e0b] border border-[#524136] rounded-lg p-2.5 text-xs text-[#f5ecd7] focus:outline-none focus:border-[#d4af37]"
              >
                <option value="none">Aucun sertissage (Métal pur)</option>
                {GEMS_LIST.map((gem) => (
                  <option key={gem.id} value={gem.id}>
                    💎 {gem.name} (+{gem.basePriceCut} PO) : {gem.enchantmentEffect}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Monster Component Infusion */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#fef08a] uppercase tracking-wider">
                4. Composant de Monstre d'Adjonction (Optionnel)
              </label>
              <select
                value={selectedCreatureComponent}
                onChange={(e) => setSelectedCreatureComponent(e.target.value)}
                className="w-full bg-[#120e0b] border border-[#524136] rounded-lg p-2.5 text-xs text-[#f5ecd7] focus:outline-none focus:border-[#d4af37]"
              >
                <option value="none">Aucun composant animal</option>
                <option value="Écailles Dorsales de Dragon Vert">Écailles Dorsales de Dragon Vert (Résistance Poison/Acide)</option>
                <option value="Crinière de Loup-Garou">Crinière de Loup-Garou (Affinité Sang & Lune)</option>
                <option value="Griffe de Griffon Géant">Griffe de Griffon Géant (Perforation de cuirasses)</option>
                <option value="Venin de Basilic Cristallisé">Venin de Basilic Cristallisé (Enduit toxique persistant)</option>
              </select>
            </div>

            {/* 5. Blacksmith Skill Bonus */}
            <div>
              <label className="block text-xs font-bold text-[#a89988] mb-1">
                Bonus d'Artisan (Force + Maîtrise Outils de Forgeron) : <strong className="text-[#fde047]">+{blacksmithBonus}</strong>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={blacksmithBonus}
                  onChange={(e) => setBlacksmithBonus(parseInt(e.target.value) || 0)}
                  className="flex-1 accent-[#d4af37]"
                />
                <span className="font-mono font-bold text-[#fde047] w-8 text-right">
                  +{blacksmithBonus}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: The Anvil Strike & Results */}
          <div className="lg:col-span-5 space-y-6">
            {/* The Big DC Plaque */}
            <div className="bg-[#241a12] rounded-xl border-2 border-[#d4af37] p-6 shadow-2xl text-center space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#fcd34d] block">
                Seuil de Forge Requis sur l'Enclume
              </span>

              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-[#181310] border-4 border-[#fde047] shadow-xl">
                <span className="text-4xl font-mono font-extrabold text-[#fde047]">
                  DD {effectiveForgeDC}
                </span>
              </div>

              <div className="text-xs text-[#a89988] space-y-1 font-mono">
                <div>Base Recette : <strong>DD {selectedRecipe.difficultyDC}</strong></div>
                <div>Modificateur Foyer ({customTier.split(' ')[0]}) : <strong>{currentTierMod >= 0 ? `+${currentTierMod}` : currentTierMod}</strong></div>
              </div>
            </div>

            {/* Hammer Strike Controls */}
            <div className="bg-[#1c1612] p-6 rounded-xl border border-[#4a3b32] space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-[#3e2e23] pb-2">
                <h4 className="font-bold text-sm text-[#fde047] flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-[#f59e0b]" />
                  Martelage & Trempe
                </h4>

                <div className="flex items-center gap-1 bg-[#140f0c] p-0.5 rounded border border-[#3e2e23]">
                  <button
                    type="button"
                    onClick={() => setForgeDiceMode('virtual')}
                    className={`px-2 py-0.5 rounded text-[10px] transition ${
                      forgeDiceMode === 'virtual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                    }`}
                  >
                    Dé Virtuel
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgeDiceMode('manual')}
                    className={`px-2 py-0.5 rounded text-[10px] transition ${
                      forgeDiceMode === 'manual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                    }`}
                  >
                    Jet Manuel
                  </button>
                </div>
              </div>

              {forgeDiceMode === 'manual' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-[#a89988]">Résultat dé réel (1-20) :</label>
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
                    onClick={() => handleStrikeAnvil(manualD20)}
                    disabled={isHammering}
                    className="w-full py-3 bg-[#b45309] hover:bg-[#d97706] text-white font-bold text-sm rounded-xl shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Hammer className={`w-5 h-5 text-[#fde047] ${isHammering ? 'animate-bounce' : ''}`} />
                    <span>Valider ma Frappe ({manualD20}) vs DD {effectiveForgeDC}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStrikeAnvil()}
                  disabled={isHammering}
                  className="w-full py-3.5 bg-[#b45309] hover:bg-[#d97706] text-white font-bold text-sm rounded-xl shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Hammer className={`w-5 h-5 text-[#fde047] ${isHammering ? 'animate-spin' : ''}`} />
                  <span>{isHammering ? 'Martelage de l\'enclume...' : `Battre le Métal (d20 + ${blacksmithBonus})`}</span>
                </button>
              )}

              {/* Crafting Outcome Card */}
              {craftResult && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-2.5 transition animate-fade-in ${
                    craftResult.critSuccess
                      ? 'bg-[#14532d]/40 border-[#22c55e] text-[#86efac]'
                      : craftResult.success
                      ? 'bg-[#1e3a5f]/40 border-[#38bdf8] text-[#bae6fd]'
                      : craftResult.critFail
                      ? 'bg-[#450a0a]/50 border-[#ef4444] text-[#fca5a5]'
                      : 'bg-[#3b271a]/50 border-[#f59e0b] text-[#fde047]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-bold border-b border-current/20 pb-1.5">
                    <span>d20:{craftResult.roll} + {blacksmithBonus} = {craftResult.total} (DD {craftResult.dc})</span>
                    <span>{craftResult.finalQuality}</span>
                  </div>

                  <p className="font-serif leading-relaxed text-xs">
                    {craftResult.message}
                  </p>

                  {craftResult.success && (
                    <div className="pt-2 border-t border-current/20 space-y-1.5">
                      <div className="flex justify-between items-center font-bold">
                        <span>Valeur Marchande Finale :</span>
                        <span className="font-mono text-[#fde047] text-sm">{craftResult.effectiveValuePo} PO</span>
                      </div>
                      <div className="space-y-1">
                        <strong className="block text-[11px]">Propriétés Actives :</strong>
                        {craftResult.effectiveProperties.map((p, i) => (
                          <div key={i} className="text-[11px] pl-2 border-l border-current/40">
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 3: DWARVEN METALLURGY LORE                             */}
      {/* ============================================================== */}
      {activeTab === 'lore' && (
        <div className="bg-[#1c1612] p-6 sm:p-8 rounded-xl border border-[#4a3b32] space-y-8 shadow-xl">
          <div className="border-b border-[#3e2e23] pb-4">
            <h3 className="text-2xl font-bold text-[#fde047] flex items-center gap-2.5">
              <Flame className="w-6 h-6 text-[#f97316]" />
              {FORGE_RULES_LORE.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#c4b5a5] italic mt-1 leading-relaxed">
              {FORGE_RULES_LORE.overview}
            </p>
          </div>

          {/* Tier table */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#fef08a] uppercase tracking-wider">
              Les 4 Paliers de Foyers de Forge & Combustibles Nains
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FORGE_RULES_LORE.tierDescriptions.map((tier, idx) => (
                <div key={idx} className="bg-[#241c16] p-4 rounded-xl border border-[#4d3a2e] space-y-2">
                  <div className="flex justify-between items-center border-b border-[#3e2e23] pb-1.5">
                    <strong className="text-sm text-[#fde047]">{tier.tier}</strong>
                    <span className="font-mono text-xs font-bold text-[#f97316]">{tier.temp}</span>
                  </div>
                  <div className="text-xs text-[#d7c9b8] space-y-1">
                    <div><span className="text-[#a89988]">Outillage : </span>{tier.tools}</div>
                    <div><span className="text-[#a89988]">Métaux usinables : </span><strong className="text-[#38bdf8]">{tier.items}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quenching lore */}
          <div className="space-y-3 pt-2 border-t border-[#3e2e23]">
            <h4 className="font-bold text-sm text-[#fef08a] uppercase tracking-wider">
              Secrets de Trempe Thermique
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FORGE_RULES_LORE.quenchingMethods.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#140f0c] border border-[#3e2e23] space-y-1 text-xs">
                  <strong className="text-[#fde047] block text-xs">{q.method}</strong>
                  <p className="text-[#c4b5a5]">{q.effect}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
