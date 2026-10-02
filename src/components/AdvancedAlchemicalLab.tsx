import React, { useState, useEffect } from 'react';
import { Plant } from '../types/herb';
import { Mineral } from '../types/mineral';
import { MINERALS_LIST } from '../data/mineralData';
import { 
  FlaskConical, 
  Sparkles, 
  Flame, 
  Layers, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Dices, 
  Coins, 
  Clock, 
  ShieldCheck, 
  Bookmark, 
  BookOpen, 
  RefreshCw,
  Search,
  Zap,
  Droplet
} from 'lucide-react';

interface AdvancedAlchemicalLabProps {
  plants: Plant[];
  onSelectPlant?: (plant: Plant) => void;
}

export interface CustomPotion {
  id: string;
  name: string;
  potionType: 'Potion Buvable' | 'Onguent Dermique' | 'Huile pour Arme' | 'Teinture Corrosive' | 'Poudre à Inhalation';
  rarity: 'Commune' | 'Peu commune' | 'Rare' | 'Très rare' | 'Légendaire';
  baseLiquid: string;
  plantsUsed: Plant[];
  mineralsUsed: Mineral[];
  difficultyDC: number;
  brewingTime: string;
  marketValuePo: number;
  mainEffects: string[];
  sideEffect?: string;
  shelfLife: string;
  flavorText: string;
  createdAt: string;
}

const BASE_LIQUIDS = [
  { id: 'eau_source', name: 'Eau de Source Pure Consacrée', role: 'Base neutre et pure, idéale pour soins et restaurations cellulaires (+1 PV par dé de soin).' },
  { id: 'alcool_orge', name: 'Alcool d\'Orge Distillé à 80°', role: 'Macération violente qui extrait tous les principes actifs et prolonge la durée de conservation à 2 ans.' },
  { id: 'huile_amande', name: 'Huile d\'Amande & Cire Végétale', role: 'Support gras parfait pour onguents, baumes corporels et protection cutanée contre le froid ou l\'acide.' },
  { id: 'vinaigre_acide', name: 'Vinaigre Tellurique Acide', role: 'Catalyseur corrosif augmentant la virulence des poisons et la pénétration des alcaloïdes.' },
  { id: 'lait_jument', name: 'Lait Fermenté des Steppes', role: 'Nourrissant et fortifiant, amplifie les bonus de Force, Constitution et endurance physique.' },
];

export const AdvancedAlchemicalLab: React.FC<AdvancedAlchemicalLabProps> = ({
  plants,
  onSelectPlant,
}) => {
  // Selection states
  const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>(['athelas', 'fleur_de_lune']);
  const [selectedMineralIds, setSelectedMineralIds] = useState<string[]>(['vif_argent']);
  const [selectedLiquidId, setSelectedLiquidId] = useState<string>('eau_source');
  const [customPotionName, setCustomPotionName] = useState<string>('');

  // Search filters for ingredient picker modals
  const [plantSearch, setPlantSearch] = useState<string>('');
  const [mineralSearch, setMineralSearch] = useState<string>('');

  // Brewing simulation states
  const [alchemistBonus, setAlchemistBonus] = useState<number>(5); // Intelligence + Outils d'alchimiste
  const [diceMode, setDiceMode] = useState<'virtual' | 'manual'>('virtual');
  const [manualD20, setManualD20] = useState<number>(14);
  const [isBrewing, setIsBrewing] = useState<boolean>(false);
  const [brewResult, setBrewResult] = useState<{
    roll: number;
    total: number;
    dc: number;
    success: boolean;
    critSuccess: boolean;
    critFail: boolean;
    message: string;
  } | null>(null);

  // Saved Custom Recipes (Grimoire personnel de l'alchimiste)
  const [savedPotions, setSavedPotions] = useState<CustomPotion[]>(() => {
    try {
      const saved = localStorage.getItem('dnd_herbalist_custom_potions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved custom potions', e);
    }
    return [];
  });

  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Persist custom potions in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dnd_herbalist_custom_potions', JSON.stringify(savedPotions));
    } catch (e) {
      console.error('Error saving custom potions', e);
    }
  }, [savedPotions]);

  // Resolve objects
  const activePlants = plants.filter(p => selectedPlantIds.includes(p.id));
  const activeMinerals = MINERALS_LIST.filter(m => selectedMineralIds.includes(m.id));
  const activeLiquid = BASE_LIQUIDS.find(l => l.id === selectedLiquidId) || BASE_LIQUIDS[0];

  // =========================================================================
  // DYNAMIC ALCHEMICAL COMPOUND GENERATOR ENGINE
  // =========================================================================
  const generateCompoundAnalysis = () => {
    const mainEffects: string[] = [];
    let dc = 10;
    let valuePo = 25;
    let prepMinutes = 60;
    let potionType: CustomPotion['potionType'] = 'Potion Buvable';
    let shelfMonths = 6;
    const nameKeywords: string[] = [];

    // Analyze Liquid Base
    if (selectedLiquidId === 'eau_source') {
      mainEffects.push('💧 Base Consacrée : Effets de soin et de récupération maximisés (+1 point fixe par dé de soin).');
      shelfMonths = 6;
    } else if (selectedLiquidId === 'alcool_orge') {
      mainEffects.push('🔥 Macération Alcoolique : Durée des effets prolongée de 50% et absorption métabolique immédiate.');
      shelfMonths = 24;
      dc += 1;
      valuePo += 15;
    } else if (selectedLiquidId === 'huile_amande') {
      potionType = 'Onguent Dermique';
      mainEffects.push('🧴 Formule Onctueuse : S\'applique en massage cutané, conférant une pellicule étanche protectrice.');
      shelfMonths = 12;
      valuePo += 10;
    } else if (selectedLiquidId === 'vinaigre_acide') {
      potionType = 'Teinture Corrosive';
      mainEffects.push('🧪 Acidité Tellurique : Peut être projetée ou enduite sur une arme (ajoute 1d6 dégâts d\'acide).');
      shelfMonths = 18;
      dc += 2;
      valuePo += 20;
    } else if (selectedLiquidId === 'lait_jument') {
      mainEffects.push('🥛 Fortifiant Steppique : Confère 1d8 + 2 Points de Vie Temporaires pendant 4 heures.');
      shelfMonths = 2;
      valuePo += 15;
    }

    // Analyze Plants
    activePlants.forEach(plant => {
      nameKeywords.push(plant.name.split(' ')[0]);
      dc += plant.rarity === 'legendaire' ? 4 : plant.rarity === 'tres_rare' ? 3 : plant.rarity === 'rare' ? 2 : 1;
      valuePo += plant.rarity === 'legendaire' ? 120 : plant.rarity === 'tres_rare' ? 70 : plant.rarity === 'rare' ? 40 : 15;
      prepMinutes += 30;

      // Extract game effects from plant
      if (plant.gameEffects && plant.gameEffects.length > 0) {
        const topEffect = plant.gameEffects[0];
        mainEffects.push(`🌿 ${plant.name} : ${topEffect.title} — ${topEffect.description}`);
      } else {
        mainEffects.push(`🌿 ${plant.name} : Propriétés médicinales et bio-actives de ${plant.partsUsed}.`);
      }
    });

    // Analyze Minerals Catalysts
    activeMinerals.forEach(min => {
      nameKeywords.push(min.name.split(' ')[0]);
      dc += min.rarity === 'Légendaire' ? 5 : min.rarity === 'Très rare' ? 3 : min.rarity === 'Rare' ? 2 : 1;
      valuePo += min.basePricePerLingot * 0.8;
      prepMinutes += 45;

      if (min.id === 'vif_argent') {
        mainEffects.push(`⚗️ Vif-Argent Mercuriel : Accélérateur violent — Déclenche les effets en Action Bonus au lieu d'une Action.`);
      } else if (min.id === 'soufre_volcanique') {
        mainEffects.push(`🌋 Soufre Volcanique : Instabilité pyrotechnique — Libère une onde de choc thermique infligeant 2d6 dégâts de feu en cas de projection.`);
      } else if (min.id === 'sel_gemme_purifie') {
        mainEffects.push(`🧂 Sel Gemme Sacré : Stabilisateur absolu — Purifie le sang buveur et immunise contre les maladies communes pendant 24h.`);
        shelfMonths += 12;
      } else if (min.id === 'mithril') {
        mainEffects.push(`✨ Poussière de Mithril : Allègement éthéré — Le consommateur bénéficie des effets du sort Chute de Plume et +3m de vitesse pendant 1h.`);
      } else if (min.id === 'malachite_alchimique') {
        mainEffects.push(`🛡️ Malachite Alchimique : Neutralisateur de toxines — Avantage à tous les jets de sauvegarde contre le Poison.`);
      } else if (min.id === 'pierre_de_foudre') {
        mainEffects.push(`⚡ Pierre de Foudre : Charge électrique statique — Les attaques au corps-à-corps du consommateur infligent +1d6 dégâts de foudre.`);
      } else if (min.id === 'cendre_tellurique') {
        mainEffects.push(`🪨 Cendre Tellurique : Densification cutanée — La peau prend une texture de roche (+1 à la Classe d'Armure pendant 1h).`);
      } else if (min.id === 'obsidienne') {
        mainEffects.push(`🗡️ Obsidienne Vitreuse : Lame de l'esprit — Immunité temporaire contre les frayeurs magiques et charme psychique.`);
      } else {
        mainEffects.push(`⛏️ ${min.name} : Catalyseur minéralogène apportant ${min.alchemicalProperties}.`);
      }
    });

    // Calculate final Rarity
    let calculatedRarity: CustomPotion['rarity'] = 'Commune';
    if (dc >= 20 || valuePo >= 200) calculatedRarity = 'Légendaire';
    else if (dc >= 17 || valuePo >= 120) calculatedRarity = 'Très rare';
    else if (dc >= 14 || valuePo >= 60) calculatedRarity = 'Rare';
    else if (dc >= 12 || valuePo >= 35) calculatedRarity = 'Peu commune';

    // Side Effect detection (Opposite energies / Naheulbeuk style flavor)
    let sideEffect: string | undefined = undefined;
    const hasFire = activePlants.some(p => p.name.toLowerCase().includes('braise') || p.biome === 'desert') || activeMinerals.some(m => m.id === 'soufre_volcanique' || m.id === 'pyrite_ardente');
    const hasCold = activePlants.some(p => p.name.toLowerCase().includes('givre') || p.biome === 'montagne');
    const hasPoison = activePlants.some(p => p.toxicityWarning !== undefined || p.biome === 'marais');

    if (hasFire && hasCold) {
      sideEffect = '⚠️ Choc Thermique : Le buveur a des frissons brûlants et un hoquet fumant pendant 10 minutes (désavantage aux jets de Discrétion sonore).';
    } else if (hasPoison && activeMinerals.length === 0) {
      sideEffect = '⚠️ Amertume Vénéneuse : Sans sel minéral pour lier les alcaloïdes, la fiole laisse un goût de suie qui rend nauséeux pendant 1 tour.';
    } else if (activePlants.length >= 3 && activeMinerals.length >= 2) {
      sideEffect = '✨ Surdose Alchimique : Les yeux du consommateur luisent d\'une lueur phosphorescente vive pendant toute la durée de la potion.';
    }

    // Default auto-generated title
    const autoName = nameKeywords.length > 0
      ? `${potionType === 'Onguent Dermique' ? 'Baume' : potionType === 'Teinture Corrosive' ? 'Élixir Corrosif' : 'Potion'} de ${nameKeywords.slice(0, 3).join(' & ')}`
      : 'Concoction Mystérieuse Inachevée';

    const hours = Math.floor(prepMinutes / 60);
    const mins = prepMinutes % 60;
    const durationText = hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins} min`;

    return {
      name: customPotionName.trim() || autoName,
      potionType,
      rarity: calculatedRarity,
      baseLiquid: activeLiquid.name,
      plantsUsed: activePlants,
      mineralsUsed: activeMinerals,
      difficultyDC: Math.min(25, dc),
      brewingTime: durationText,
      marketValuePo: Math.round(valuePo),
      mainEffects,
      sideEffect,
      shelfLife: `${shelfMonths} mois`,
      flavorText: `Savante alliance de ${activePlants.length} herbe(s) et ${activeMinerals.length} minéral(aux) distillés dans ${activeLiquid.name.toLowerCase()}.`,
    };
  };

  const currentAnalysis = generateCompoundAnalysis();

  // Handle brewing trial roll
  const handleBrewTest = (customRoll?: number) => {
    setIsBrewing(true);
    setBrewResult(null);

    setTimeout(() => {
      const d20 = customRoll !== undefined
        ? Math.min(20, Math.max(1, customRoll))
        : (diceMode === 'manual' ? Math.min(20, Math.max(1, manualD20)) : Math.floor(Math.random() * 20) + 1);

      const total = d20 + alchemistBonus;
      const critSuccess = d20 === 20;
      const critFail = d20 === 1;
      const success = (total >= currentAnalysis.difficultyDC || critSuccess) && !critFail;

      let msg = '';
      if (critSuccess || total >= currentAnalysis.difficultyDC + 5) {
        msg = `Réussite Magistrale (${total} vs DD ${currentAnalysis.difficultyDC}) ! Condensation parfaite dans le serpentin de cuivre : les principes actifs sont cristallisés sans la moindre impureté. Vous obtenez 2 fioles au lieu d'une !`;
      } else if (success) {
        msg = `Réussite (${total} vs DD ${currentAnalysis.difficultyDC}) ! La fiole s'emplit d'un liquide chatoyant au parfum d'herbes et de minéraux nobles. Prête à l'emploi.`;
      } else if (critFail) {
        msg = `1 Naturel ! Explosion dans l'alambic ! Les vapeurs de mercure et de sève acide ont fait sauter le bouchon de verre (1d4 dégâts d'acide et ingrédients perdus).`;
      } else {
        msg = `Échec de décantation (${total} vs DD ${currentAnalysis.difficultyDC}). Le mélange a surchauffé et a formé un résidu pâteux inerte. Vos ingrédients sont consumés.`;
      }

      setBrewResult({
        roll: d20,
        total,
        dc: currentAnalysis.difficultyDC,
        success,
        critSuccess,
        critFail,
        message: msg,
      });

      setIsBrewing(false);
    }, 400);
  };

  // Save potion to Grimoire
  const handleSaveToGrimoire = () => {
    const newPotion: CustomPotion = {
      id: `custom_potion_${Date.now()}`,
      ...currentAnalysis,
      createdAt: new Date().toLocaleDateString('fr-FR'),
    };

    setSavedPotions(prev => [newPotion, ...prev]);
    setSaveSuccessMsg(`« ${newPotion.name} » a été consignée dans votre grimoire alchimique !`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Remove saved potion
  const handleDeleteSaved = (id: string) => {
    setSavedPotions(prev => prev.filter(p => p.id !== id));
  };

  // Load a saved potion into active lab
  const handleLoadSaved = (potion: CustomPotion) => {
    setSelectedPlantIds(potion.plantsUsed.map(p => p.id));
    setSelectedMineralIds(potion.mineralsUsed.map(m => m.id));
    setCustomPotionName(potion.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle plant selection (max 3)
  const handleTogglePlant = (plantId: string) => {
    if (selectedPlantIds.includes(plantId)) {
      setSelectedPlantIds(selectedPlantIds.filter(id => id !== plantId));
    } else {
      if (selectedPlantIds.length < 3) {
        setSelectedPlantIds([...selectedPlantIds, plantId]);
      }
    }
  };

  // Toggle mineral selection (max 2)
  const handleToggleMineral = (mineralId: string) => {
    if (selectedMineralIds.includes(mineralId)) {
      setSelectedMineralIds(selectedMineralIds.filter(id => id !== mineralId));
    } else {
      if (selectedMineralIds.length < 2) {
        setSelectedMineralIds([...selectedMineralIds, mineralId]);
      }
    }
  };

  return (
    <div className="space-y-8 font-serif">
      {/* Banner */}
      <div className="bg-[#241a15] rounded-xl border-2 border-[#a855f7]/60 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#a855f7]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#3b0764] text-[#e9d5ff] border border-[#c084fc]/50 uppercase tracking-widest font-mono font-bold flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-[#c084fc] animate-pulse" />
                Laboratoire de Concoction Hybride Plantes & Minéraux
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#fde047] flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-[#a855f7]" />
              Atelier d'Alchimie Avancé
            </h3>
            <p className="text-xs sm:text-sm text-[#c4b5a5] italic mt-1 max-w-3xl leading-relaxed">
              Associez jusqu'à 3 plantes botaniques et 2 minéraux telluriques dans votre alambic. Le moteur calcule en direct les synergies d'effets, le DD de préparation et la valeur de votre concoction.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-[#a89988] block">Recettes consignées :</span>
            <span className="text-xl font-mono font-bold text-[#fde047]">
              {savedPotions.length} potion(s)
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Ingredients Matrix, Right Alambic Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: INGREDIENTS SELECTOR (PLANTS + MINERALS + SOLVENT) */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 1. Base Liquid Solvent */}
          <div className="bg-[#1c1612] p-4 sm:p-5 rounded-xl border border-[#4a3b32] space-y-2 shadow-md">
            <label className="block text-xs font-bold text-[#fde047] uppercase tracking-wider flex items-center gap-2">
              <Droplet className="w-4 h-4 text-[#38bdf8]" />
              1. Base Solvante Liquide
            </label>
            <select
              value={selectedLiquidId}
              onChange={(e) => setSelectedLiquidId(e.target.value)}
              className="w-full bg-[#120e0b] border border-[#524136] rounded-lg p-2.5 text-xs text-[#f5ecd7] focus:outline-none focus:border-[#d4af37]"
            >
              {BASE_LIQUIDS.map((liq) => (
                <option key={liq.id} value={liq.id}>
                  {liq.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#a89988] italic pt-1">
              {activeLiquid.role}
            </p>
          </div>

          {/* 2. Plant Selection (Max 3) */}
          <div className="bg-[#1c1612] p-4 sm:p-5 rounded-xl border border-[#4a3b32] space-y-3 shadow-md">
            <div className="flex justify-between items-center border-b border-[#3e2e23] pb-2">
              <label className="text-xs font-bold text-[#fde047] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center text-[10px] font-mono">
                  {selectedPlantIds.length}/3
                </span>
                2. Plantes & Herbes Sauvages (1 à 3)
              </label>

              <div className="relative w-40">
                <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-[#a89988]" />
                <input
                  type="text"
                  placeholder="Filtrer herbe..."
                  value={plantSearch}
                  onChange={(e) => setPlantSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 bg-[#120e0b] border border-[#3e2e23] rounded text-[10px] text-[#f5ecd7] focus:outline-none"
                />
              </div>
            </div>

            {/* Plants Scrollable Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {plants
                .filter(p => p.name.toLowerCase().includes(plantSearch.toLowerCase()) || p.biome.toLowerCase().includes(plantSearch.toLowerCase()))
                .map((plant) => {
                  const isChecked = selectedPlantIds.includes(plant.id);
                  const canSelect = isChecked || selectedPlantIds.length < 3;

                  return (
                    <button
                      key={plant.id}
                      type="button"
                      disabled={!canSelect}
                      onClick={() => handleTogglePlant(plant.id)}
                      className={`p-2 rounded-lg border text-left transition flex flex-col justify-between ${
                        isChecked
                          ? 'bg-[#27381d] border-[#4ade80] text-[#f0fdf4] shadow'
                          : canSelect
                          ? 'bg-[#140f0c] border-[#3e2e23] text-[#c4b5a5] hover:bg-[#261d17]'
                          : 'bg-[#120e0b] border-[#241a14] text-[#6b5b50] opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] truncate">{plant.name}</span>
                        {isChecked && <CheckCircle className="w-3 h-3 text-[#4ade80] shrink-0" />}
                      </div>
                      <span className="text-[9px] text-[#a89988] mt-1 font-mono truncate">
                        {plant.partsUsed}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* 3. Mineral Selection (Max 2) */}
          <div className="bg-[#1c1612] p-4 sm:p-5 rounded-xl border border-[#4a3b32] space-y-3 shadow-md">
            <div className="flex justify-between items-center border-b border-[#3e2e23] pb-2">
              <label className="text-xs font-bold text-[#fde047] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#854d0e] text-white flex items-center justify-center text-[10px] font-mono">
                  {selectedMineralIds.length}/2
                </span>
                3. Minéraux Telluriques & Catalyseurs (1 à 2)
              </label>

              <div className="relative w-40">
                <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-[#a89988]" />
                <input
                  type="text"
                  placeholder="Filtrer minéral..."
                  value={mineralSearch}
                  onChange={(e) => setMineralSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 bg-[#120e0b] border border-[#3e2e23] rounded text-[10px] text-[#f5ecd7] focus:outline-none"
                />
              </div>
            </div>

            {/* Minerals Scrollable Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {MINERALS_LIST
                .filter(m => m.name.toLowerCase().includes(mineralSearch.toLowerCase()) || m.alchemicalProperties.toLowerCase().includes(mineralSearch.toLowerCase()))
                .map((min) => {
                  const isChecked = selectedMineralIds.includes(min.id);
                  const canSelect = isChecked || selectedMineralIds.length < 2;

                  return (
                    <button
                      key={min.id}
                      type="button"
                      disabled={!canSelect}
                      onClick={() => handleToggleMineral(min.id)}
                      className={`p-2 rounded-lg border text-left transition flex flex-col justify-between ${
                        isChecked
                          ? 'bg-[#3d2719] border-[#d4af37] text-[#fef08a] shadow'
                          : canSelect
                          ? 'bg-[#140f0c] border-[#3e2e23] text-[#c4b5a5] hover:bg-[#261d17]'
                          : 'bg-[#120e0b] border-[#241a14] text-[#6b5b50] opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] truncate">{min.name}</span>
                        {isChecked && <CheckCircle className="w-3 h-3 text-[#d4af37] shrink-0" />}
                      </div>
                      <span className="text-[9px] text-[#38bdf8] mt-1 font-mono truncate">
                        {min.basePricePerLingot} PO
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Quick Custom Potion Naming Field */}
          <div className="bg-[#1c1612] p-4 rounded-xl border border-[#4a3b32] space-y-2">
            <label className="block text-xs font-bold text-[#fde047]">
              Nom Personnalisé de votre Création (Optionnel) :
            </label>
            <input
              type="text"
              placeholder={currentAnalysis.name}
              value={customPotionName}
              onChange={(e) => setCustomPotionName(e.target.value)}
              className="w-full bg-[#120e0b] border border-[#524136] rounded-lg p-2.5 text-xs text-[#f5ecd7] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: REAL-TIME COMPOUND ANALYSIS & ALEMBIRE BREWING   */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Potion Identity Card */}
          <div className="bg-[#241c16] rounded-xl border-2 border-[#d4af37] p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-[#3e2e23] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#d97706]/40">
                  {currentAnalysis.potionType} · {currentAnalysis.rarity}
                </span>
                <h4 className="text-2xl font-bold text-[#fef08a] mt-1">
                  {currentAnalysis.name}
                </h4>
                <p className="text-[11px] text-[#c4b5a5] italic mt-0.5">
                  {currentAnalysis.flavorText}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xl font-mono font-extrabold text-[#fde047] block">
                  {currentAnalysis.marketValuePo} PO
                </span>
                <span className="text-[10px] text-[#a89988]">
                  Conservation : {currentAnalysis.shelfLife}
                </span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-[#181310] p-2 rounded border border-[#3e2e23]">
                <span className="text-[10px] text-[#a89988] block">DD Alchimique Requis</span>
                <span className="text-lg font-mono font-bold text-[#fde047]">
                  DD {currentAnalysis.difficultyDC}
                </span>
              </div>

              <div className="bg-[#181310] p-2 rounded border border-[#3e2e23]">
                <span className="text-[10px] text-[#a89988] block">Temps à l'Alambic</span>
                <span className="text-lg font-mono font-bold text-[#38bdf8]">
                  {currentAnalysis.brewingTime}
                </span>
              </div>
            </div>

            {/* Synthesized Effects List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#fde047] uppercase tracking-wider block">
                Propriétés & Effets Cumulés :
              </span>
              <div className="space-y-1.5">
                {currentAnalysis.mainEffects.map((eff, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-[#181310] border border-[#2e2118] text-xs text-[#e6d8c3] leading-relaxed">
                    {eff}
                  </div>
                ))}
              </div>
            </div>

            {/* Unstable Side Effect Alert if any */}
            {currentAnalysis.sideEffect && (
              <div className="p-3 bg-[#451a03]/60 rounded-lg border border-[#f59e0b] text-xs text-[#fed7aa] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-[#fcd34d]">Instabilité / Effet Secondaire :</strong>
                  <span>{currentAnalysis.sideEffect}</span>
                </div>
              </div>
            )}

            {/* Save to personal Grimoire button */}
            <button
              onClick={handleSaveToGrimoire}
              className="w-full py-2.5 bg-[#3b271a] hover:bg-[#4a3424] text-[#fef08a] border border-[#d4af37]/60 font-bold text-xs rounded-lg shadow transition flex items-center justify-center gap-2"
            >
              <Bookmark className="w-4 h-4 text-[#fde047]" />
              <span>Consigner cette Recette dans mon Grimoire Alchimique</span>
            </button>

            {saveSuccessMsg && (
              <div className="p-2 text-center text-xs font-bold text-[#86efac] bg-[#14532d]/40 rounded border border-[#22c55e] animate-pulse">
                {saveSuccessMsg}
              </div>
            )}
          </div>

          {/* Alembic Brewing Simulation Card */}
          <div className="bg-[#1c1612] p-6 rounded-xl border border-[#4a3b32] space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#3e2e23] pb-2">
              <h4 className="font-bold text-sm text-[#fde047] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#f97316]" />
                Test de Concoction à l'Alambic
              </h4>

              {/* Virtual vs Manual Dice */}
              <div className="flex items-center gap-1 bg-[#140f0c] p-0.5 rounded border border-[#3e2e23]">
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

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a89988] mb-1">
                  Bonus Alchimiste (Intelligence + Outils) : <strong className="text-[#fde047]">+{alchemistBonus}</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={alchemistBonus}
                  onChange={(e) => setAlchemistBonus(parseInt(e.target.value) || 0)}
                  className="w-full accent-[#d4af37]"
                />
              </div>

              {diceMode === 'manual' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[#a89988]">Résultat sur votre dé physique (1-20) :</label>
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
                    onClick={() => handleBrewTest(manualD20)}
                    disabled={isBrewing}
                    className="w-full py-3 bg-[#b45309] hover:bg-[#d97706] text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-[#fde047]" />
                    <span>Valider mon jet ({manualD20}) vs DD {currentAnalysis.difficultyDC}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleBrewTest()}
                  disabled={isBrewing}
                  className="w-full py-3 bg-[#b45309] hover:bg-[#d97706] text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FlaskConical className={`w-4 h-4 text-[#fde047] ${isBrewing ? 'animate-spin' : ''}`} />
                  <span>{isBrewing ? 'Distillation en cours...' : `Chauffer l'Alambic (d20 + ${alchemistBonus})`}</span>
                </button>
              )}

              {/* Outcome feedback card */}
              {brewResult && (
                <div
                  className={`p-3 rounded-lg border text-xs space-y-1.5 transition animate-fade-in ${
                    brewResult.critSuccess
                      ? 'bg-[#14532d]/40 border-[#22c55e] text-[#86efac]'
                      : brewResult.success
                      ? 'bg-[#1e3a5f]/40 border-[#38bdf8] text-[#bae6fd]'
                      : brewResult.critFail
                      ? 'bg-[#450a0a]/50 border-[#ef4444] text-[#fca5a5]'
                      : 'bg-[#291b16] border-[#78350f] text-[#fde047]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-bold">
                    <span>d20:{brewResult.roll} + {alchemistBonus} = {brewResult.total} (DD {brewResult.dc})</span>
                    <span>{brewResult.success ? 'DISTILLATION RÉUSSIE' : 'ÉCHEC'}</span>
                  </div>
                  <p className="font-serif leading-relaxed">{brewResult.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SAVED CUSTOM RECIPES GRIMOIRE SHELF                            */}
      {/* ============================================================== */}
      {savedPotions.length > 0 && (
        <div className="bg-[#1c1612] p-6 rounded-xl border border-[#4a3b32] space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-[#3e2e23] pb-3">
            <h4 className="font-bold text-lg text-[#fde047] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#a855f7]" />
              Grimoire des Potions Personnalisées Enregistrées ({savedPotions.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPotions.map((potion) => (
              <div
                key={potion.id}
                className="bg-[#140f0c] p-4 rounded-xl border border-[#3e2e23] space-y-3 flex flex-col justify-between hover:border-[#d4af37] transition"
              >
                <div>
                  <div className="flex justify-between items-start border-b border-[#2e2118] pb-1.5">
                    <div>
                      <strong className="text-sm text-[#fef08a] block">{potion.name}</strong>
                      <span className="text-[10px] text-[#a89988]">{potion.potionType} · {potion.rarity}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#fde047]">{potion.marketValuePo} PO</span>
                  </div>

                  <div className="text-[11px] text-[#cbd5e1] space-y-1 pt-2">
                    <div>
                      <strong className="text-[#a89988]">Ingrédients : </strong>
                      <span>{potion.plantsUsed.map(p => p.name).join(', ')} + {potion.mineralsUsed.map(m => m.name).join(', ')}</span>
                    </div>
                    <div className="text-[10px] text-[#78350f] italic">
                      {potion.baseLiquid}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#2e2118]">
                  <button
                    onClick={() => handleLoadSaved(potion)}
                    className="text-xs text-[#38bdf8] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Charger dans l'Alambic</span>
                  </button>

                  <button
                    onClick={() => handleDeleteSaved(potion.id)}
                    className="text-xs text-[#ef4444] hover:text-[#f87171] p-1"
                    title="Supprimer du grimoire"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
