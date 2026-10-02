import React, { useState } from 'react';
import { Plant, BiomeType, RarityType } from '../types/herb';
import { BIOMES_METADATA, RARITY_METADATA, FORAGING_RULES } from '../data/herbalistData';
import { 
  BookMarked, 
  Calculator, 
  Compass, 
  Search, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Eye, 
  Scissors, 
  Flame, 
  ShieldCheck, 
  Trees, 
  Mountain, 
  Droplets, 
  EyeOff, 
  Sun, 
  Waves, 
  Dices, 
  Sliders, 
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { BiomeEncountersAndRarityView } from './BiomeEncountersAndRarityView';

interface HarvesterGuideViewProps {
  plants: Plant[];
  onSelectPlant?: (plant: Plant) => void;
  onNavigateToSimulator?: () => void;
}

// Biome Difficulty Modifiers and Environmental Profiles
export const BIOME_DC_PROFILES: Record<BiomeType, {
  name: string;
  baseDcMod: number; // Modificateur de terrain
  terrainDifficulty: 'Facile' | 'Moyen' | 'Difficile' | 'Extrême';
  primarySkill: 'Sagesse (Survie)' | 'Intelligence (Nature)' | 'Mixte';
  hazards: string;
  botanicalTraits: string;
  icon: string;
  color: string;
  optimalTime: string;
}> = {
  foret: {
    name: 'Forêts & Bois Anciens',
    baseDcMod: 0,
    terrainDifficulty: 'Moyen',
    primarySkill: 'Sagesse (Survie)',
    hazards: 'Racines traîtresses, tiques sylvestres, prédateurs camouflés (loups, guenaudes).',
    botanicalTraits: 'Humus riche, sous-bois ombragé, mousses sur les troncs au nord, clairières ensoleillées.',
    icon: 'Trees',
    color: '#15803d',
    optimalTime: 'Matinée après la rosée ou début de printemps.',
  },
  plaine: {
    name: 'Plaines & Prairies Ouvertes',
    baseDcMod: -1,
    terrainDifficulty: 'Facile',
    primarySkill: 'Intelligence (Nature)',
    hazards: 'Soleil de plomb sans abri, terriers d\'animaux cachés dans les hautes herbes, moustiques de ruisseau.',
    botanicalTraits: 'Vaste visibilité, herbacées fleuries annuelles, graminées denses, bordures de chemins.',
    icon: 'Sun',
    color: '#ca8a04',
    optimalTime: 'Plein midi pour les corolles ouvertes sous le soleil.',
  },
  marais: {
    name: 'Marais & Tourbières Fangeuses',
    baseDcMod: +2,
    terrainDifficulty: 'Difficile',
    primarySkill: 'Sagesse (Survie)',
    hazards: 'Sables mouvants, miasmes toxiques, sangsues géantes, eaux croupies nécessitant des bottes étanches.',
    botanicalTraits: 'Mousses spongieuses, sève visqueuse, plantes carnivores, spore de putréfaction.',
    icon: 'Droplets',
    color: '#0f766e',
    optimalTime: 'Crépuscule lorsque les brumes stagnent et les feux-follets s\'éveillent.',
  },
  montagne: {
    name: 'Montagnes & Falaises Rocailleuses',
    baseDcMod: +3,
    terrainDifficulty: 'Extrême',
    primarySkill: 'Sagesse (Survie)',
    hazards: 'Éboulis rocheux, vents violents à 80 km/h, froid mordant, nids de vouivres ou harpies.',
    botanicalTraits: 'Plantes naines tapissantes, racines s\'incrustant dans les failles de granit, fleurs d\'altitude très résistantes.',
    icon: 'Mountain',
    color: '#475569',
    optimalTime: 'Aurore par temps clair avant que les nuages orographiques n\'enveloppent les pics.',
  },
  caverne: {
    name: 'Cavernes & Abysses d\'Outreterre',
    baseDcMod: +3,
    terrainDifficulty: 'Extrême',
    primarySkill: 'Intelligence (Nature)',
    hazards: 'Obscurité aveuglante, champignons hallucinogènes, éboulements, créatures à vision dans le noir (troglodytes).',
    botanicalTraits: 'Fonge bioluminescente, mousses sans chlorophylle, lichens d\'humidité, spores souterraines.',
    icon: 'EyeOff',
    color: '#7e22ce',
    optimalTime: 'Indifférent au jour/nuit ; requiert source lumineuse stable ou vision dans le noir.',
  },
  aquatique: {
    name: 'Côtes, Rives Fluviales & Récifs',
    baseDcMod: +1,
    terrainDifficulty: 'Difficile',
    primarySkill: 'Mixte',
    hazards: 'Courants sous-marins, marées montantes imprévisibles, rochers glissants couverts d\'algues vertes.',
    botanicalTraits: 'Algue laminaire, coraux d\'eau douce, nénuphars géants, tiges flexibles suivant le flot.',
    icon: 'Waves',
    color: '#0284c7',
    optimalTime: 'Marée basse ou matin calme sur les berges fluviales.',
  },
  desert: {
    name: 'Déserts & Terres Arides',
    baseDcMod: +3,
    terrainDifficulty: 'Extrême',
    primarySkill: 'Sagesse (Survie)',
    hazards: 'Déshydratation fulgurante, mirages thermiques, scorpions des sables, tempêtes de poussière.',
    botanicalTraits: 'Succulentes à épines épaisses, tubercules gorgés d\'eau enfouis à 1 mètre sous le sable.',
    icon: 'Flame',
    color: '#ea580c',
    optimalTime: 'Nuit fraîche juste avant l\'aube (floraisons éphémères de 2 heures).',
  },
};

export const HarvesterGuideView: React.FC<HarvesterGuideViewProps> = ({
  plants,
  onSelectPlant,
  onNavigateToSimulator,
}) => {
  // Calculator states
  const [selectedBiome, setSelectedBiome] = useState<BiomeType>('foret');
  const [targetRarity, setTargetRarity] = useState<RarityType>('rare');
  const [weatherCondition, setWeatherCondition] = useState<number>(0); // 0 = standard, +2 rain, +4 storm, -2 moonlight
  const [weatherDescription, setWeatherDescription] = useState<string>('Climat clément / Tempéré (Normal)');
  const [searchDurationMod, setSearchDurationMod] = useState<number>(0); // +2 for 1h, 0 for 4h, -2 for 8h
  const [searchDurationLabel, setSearchDurationLabel] = useState<string>('Recherche standard de 4 heures');
  const [equipmentToolsMod, setEquipmentToolsMod] = useState<number>(-1); // -1 kit herboriste, -2 familier, +1 mains nues
  const [equipmentLabel, setEquipmentLabel] = useState<string>('Trousse d\'Herboristerie entretenue (-1 au DD)');

  // Quick test roller in calculator
  const [testerBonus, setTesterBonus] = useState<number>(4);
  const [testDiceMode, setTestDiceMode] = useState<'virtual' | 'manual'>('virtual');
  const [manualD20, setManualD20] = useState<number>(14);
  const [testResult, setTestResult] = useState<{
    roll: number;
    total: number;
    dc: number;
    success: boolean;
    critSuccess: boolean;
    critFail: boolean;
    message: string;
  } | null>(null);

  // Active guide sub-tab
  const [activeGuideTab, setActiveGuideTab] = useState<'calculator' | 'rules' | 'biomes' | 'encounters' | 'toxics'>('calculator');

  // Compute Base DC by Rarity
  const rarityBaseDcs: Record<RarityType, number> = {
    commune: 10,
    peu_commune: 13,
    rare: 16,
    tres_rare: 19,
    legendaire: 23,
  };

  const baseRarityDc = rarityBaseDcs[targetRarity];
  const biomeProfile = BIOME_DC_PROFILES[selectedBiome];
  const biomeMod = biomeProfile.baseDcMod;

  // Final calculated DC formula
  const calculatedDC = Math.max(5, baseRarityDc + biomeMod + weatherCondition + searchDurationMod + equipmentToolsMod);

  // Find plants in this biome matching this rarity
  const matchingPlants = plants.filter(
    (p) => p.biome === selectedBiome && p.rarity === targetRarity
  );

  // Test roll against calculated DC
  const handleTestRoll = (customD20?: number) => {
    const d20 = customD20 !== undefined
      ? Math.min(20, Math.max(1, customD20))
      : (testDiceMode === 'manual' ? Math.min(20, Math.max(1, manualD20)) : Math.floor(Math.random() * 20) + 1);

    const total = d20 + testerBonus;
    const critSuccess = d20 === 20;
    const critFail = d20 === 1;
    const success = (total >= calculatedDC || critSuccess) && !critFail;

    let msg = '';
    if (critSuccess) {
      msg = `20 Naturel ! Coup de chance extraordinaire : vous découvrez une colonie de spécimens en floraison parfaite avec graines reproductibles (double dose récoltée).`;
    } else if (success) {
      if (total >= calculatedDC + 5) {
        msg = `Réussite éclatante (${total} vs DD ${calculatedDC}) ! Le spécimen est prélevé intact avec 1 dose supplémentaire bonus.`;
      } else {
        msg = `Réussite (${total} vs DD ${calculatedDC}) ! Vous identifiez et taillez 1 dose prête pour le séchage ou l'alchimie.`;
      }
    } else if (critFail) {
      msg = `1 Naturel : Échec critique ! Piqûre de sève vénéneuse ou confusion avec un sosie toxique (1d6 dégâts de poison et perte de 2 heures).`;
    } else {
      msg = `Échec (${total} vs DD ${calculatedDC}). Les recherches n'ont rien donné dans ce secteur : flore stérile ou saison passée.`;
    }

    setTestResult({
      roll: d20,
      total,
      dc: calculatedDC,
      success,
      critSuccess,
      critFail,
      message: msg,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-serif space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="bg-[#1f1915] rounded-xl border border-[#4a3b32] p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3e2e23] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#d97706]/50 uppercase tracking-widest font-mono">
                Manuel Officiel des Maîtres de Jeu & Herboristes
              </span>
              <span className="text-xs text-[#a89988]">Système D&D 5e / JDR Médiéval-Fantastique</span>
            </div>
            <h2 className="text-3xl font-bold text-[#d4af37] flex items-center gap-3">
              <BookMarked className="w-8 h-8 text-[#fde047]" />
              Le Guide du Récolteur & Calculateur de Difficulté (DD)
            </h2>
            <p className="text-xs sm:text-sm text-[#c4b5a5] italic mt-1 max-w-3xl leading-relaxed">
              Comprendre les mécaniques de Degrés de Difficulté (DD / DC), les phases d'investigation botanique, les risques de faux-amis toxiques et calculer le DD exact selon le biome et la météo.
            </p>
          </div>

          {onNavigateToSimulator && (
            <button
              onClick={onNavigateToSimulator}
              className="flex items-center gap-2 px-4 py-2 bg-[#b45309] hover:bg-[#d97706] text-white text-xs font-bold rounded-lg shadow transition"
            >
              <Compass className="w-4 h-4 text-[#fde047]" />
              <span>Aller au Simulateur de Cueillette</span>
            </button>
          )}
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          <button
            onClick={() => setActiveGuideTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition shadow ${
              activeGuideTab === 'calculator'
                ? 'bg-[#b45309] text-white ring-2 ring-[#fde047]'
                : 'bg-[#140f0c] text-[#d7c9b8] hover:bg-[#261d17] border border-[#3e2e23]'
            }`}
          >
            <Calculator className="w-4 h-4 text-[#fde047]" />
            <span>Outil de Calcul de DD par Biome</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('rules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition shadow ${
              activeGuideTab === 'rules'
                ? 'bg-[#b45309] text-white ring-2 ring-[#fde047]'
                : 'bg-[#140f0c] text-[#d7c9b8] hover:bg-[#261d17] border border-[#3e2e23]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#38bdf8]" />
            <span>Les 4 Phases de la Cueillette</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('biomes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition shadow ${
              activeGuideTab === 'biomes'
                ? 'bg-[#b45309] text-white ring-2 ring-[#fde047]'
                : 'bg-[#140f0c] text-[#d7c9b8] hover:bg-[#261d17] border border-[#3e2e23]'
            }`}
          >
            <Trees className="w-4 h-4 text-[#4ade80]" />
            <span>Profils des 8 Biomes</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('encounters')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition shadow ${
              activeGuideTab === 'encounters'
                ? 'bg-[#b45309] text-white ring-2 ring-[#fde047]'
                : 'bg-[#140f0c] text-[#fef08a] hover:bg-[#261d17] border border-[#3e2e23]'
            }`}
          >
            <Dices className="w-4 h-4 text-[#f59e0b]" />
            <span>Rencontres & Table de Rareté</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('toxics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition shadow ${
              activeGuideTab === 'toxics'
                ? 'bg-[#b45309] text-white ring-2 ring-[#fde047]'
                : 'bg-[#140f0c] text-[#d7c9b8] hover:bg-[#261d17] border border-[#3e2e23]'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-[#f87171]" />
            <span>Sosies Toxiques & Échecs Critiques</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: INTERACTIVE DC CALCULATOR BY BIOME                  */}
      {/* ============================================================== */}
      {activeGuideTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 bg-[#1c1612] p-6 rounded-xl border border-[#4a3b32] space-y-6 shadow-xl">
            <div className="border-b border-[#3e2e23] pb-3">
              <h3 className="text-xl font-bold text-[#fde047] flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#f59e0b]" />
                Calculateur de Degré de Difficulté (DD / DC)
              </h3>
              <p className="text-xs text-[#a89988] italic mt-0.5">
                Ajustez les paramètres de terrain, la rareté recherchée et les conditions pour générer le seuil exact du test.
              </p>
            </div>

            {/* 1. Biome Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#fef08a] uppercase tracking-wider">
                1. Type de Biome & Environnement Géographique
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(BIOME_DC_PROFILES).map(([key, bio]) => {
                  const isSelected = selectedBiome === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedBiome(key as BiomeType)}
                      className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#3b271a] border-[#d4af37] ring-1 ring-[#d4af37] text-[#fef08a]'
                          : 'bg-[#140f0c] border-[#3e2e23] text-[#c4b5a5] hover:bg-[#261d17]'
                      }`}
                    >
                      <span className="font-bold text-xs truncate">{bio.name.split(' ')[0]}</span>
                      <div className="flex justify-between items-center text-[10px] text-[#a89988] mt-1 font-mono">
                        <span>{bio.terrainDifficulty}</span>
                        <strong className={bio.baseDcMod > 0 ? 'text-[#f87171]' : bio.baseDcMod < 0 ? 'text-[#4ade80]' : 'text-[#cbd5e1]'}>
                          {bio.baseDcMod > 0 ? `+${bio.baseDcMod}` : bio.baseDcMod}
                        </strong>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Target Rarity */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#fef08a] uppercase tracking-wider">
                2. Rareté de la Plante Ciblée
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.entries(RARITY_METADATA).map(([key, meta]) => {
                  const isSelected = targetRarity === key;
                  const baseDc = rarityBaseDcs[key as RarityType];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTargetRarity(key as RarityType)}
                      className={`p-2.5 rounded-lg border text-center transition ${
                        isSelected
                          ? 'bg-[#3b271a] border-[#d4af37] ring-1 ring-[#d4af37]'
                          : 'bg-[#140f0c] border-[#3e2e23] text-[#c4b5a5] hover:bg-[#261d17]'
                      }`}
                    >
                      <span
                        className="text-[10px] font-bold block"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#fde047] block mt-0.5">
                        Base DD {baseDc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Weather Conditions */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#fef08a] uppercase tracking-wider">
                3. Conditions Météorologiques & Éléments
              </label>
              <select
                value={weatherCondition}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setWeatherCondition(val);
                  const labels: Record<number, string> = {
                    0: 'Climat clément / Tempéré (Normal)',
                    2: 'Pluie battante / Brouillard épais (+2 au DD)',
                    4: 'Tempête de neige / Canicule accablante (+4 au DD)',
                    3: 'Nuit noire sans éclairage (+3 au DD)',
                    '-2': 'Nuit de pleine lune lumineuse (-2 au DD)',
                  };
                  setWeatherDescription(labels[val] || 'Météo particulière');
                }}
                className="w-full bg-[#120e0b] border border-[#524136] rounded-lg p-2.5 text-xs text-[#f5ecd7] focus:outline-none focus:border-[#d4af37]"
              >
                <option value="0">☀️ Climat clément / Tempéré (Modificateur 0)</option>
                <option value="2">🌧️ Pluie battante ou Brouillard épais (+2 au DD)</option>
                <option value="4">❄️ Tempête de neige ou Canicule accablante (+4 au DD)</option>
                <option value="3">🌑 Nuit noire sans torche (+3 au DD)</option>
                <option value="-2">🌕 Nuit de pleine lune lumineuse (-2 au DD pour herbes nocturnes)</option>
              </select>
            </div>

            {/* 4. Search Duration */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#fef08a] uppercase tracking-wider">
                4. Temps Consacré à la Recherche
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { mod: 2, label: 'Fouille Rapide (1h)', desc: '+2 au DD (hâtive)' },
                  { mod: 0, label: 'Recherche Standard (4h)', desc: 'DD normal (recommandé)' },
                  { mod: -2, label: 'Journée Complète (8h)', desc: '-2 au DD (prospection à fond)' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSearchDurationMod(item.mod);
                      setSearchDurationLabel(item.label);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      searchDurationMod === item.mod
                        ? 'bg-[#3b271a] border-[#d4af37] ring-1 ring-[#d4af37] text-[#fef08a]'
                        : 'bg-[#140f0c] border-[#3e2e23] text-[#c4b5a5] hover:bg-[#261d17]'
                    }`}
                  >
                    <span className="font-bold text-xs block">{item.label}</span>
                    <span className="text-[10px] text-[#a89988]">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Tools & Preparation */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#fef08a] uppercase tracking-wider">
                5. Équipement & Outils d'Herboriste
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { mod: -1, label: 'Trousse d\'Herboristerie', desc: '-1 au DD (couteaux & fioles)' },
                  { mod: -2, label: 'Familier / Chien Truffier', desc: '-2 au DD (odorat affûté)' },
                  { mod: 1, label: 'Mains Nues / Couteau seul', desc: '+1 au DD (prélèvement hasardeux)' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setEquipmentToolsMod(item.mod);
                      setEquipmentLabel(item.label);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      equipmentToolsMod === item.mod
                        ? 'bg-[#3d2719] border-[#d4af37] ring-1 ring-[#d4af37] text-[#fef08a]'
                        : 'bg-[#140f0c] border-[#3e2e23] text-[#c4b5a5] hover:bg-[#261d17]'
                    }`}
                  >
                    <span className="font-bold text-xs block">{item.label}</span>
                    <span className="text-[10px] text-[#a89988]">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Results & Live Test Simulator */}
          <div className="lg:col-span-5 space-y-6">
            {/* The Big DC Result Plaque */}
            <div className="bg-[#241a12] rounded-xl border-2 border-[#d4af37] p-6 shadow-2xl text-center space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#fcd34d] block">
                Degré de Difficulté Recommandé (DD)
              </span>

              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-[#181310] border-4 border-[#fde047] shadow-xl">
                <span className="text-4xl font-mono font-extrabold text-[#fde047]">
                  DD {calculatedDC}
                </span>
              </div>

              {/* Mathematical breakdown */}
              <div className="bg-[#181310] p-3 rounded-lg border border-[#3e2e23] text-xs font-mono text-[#cbd5e1] space-y-1">
                <div className="flex justify-between border-b border-[#2e2118] pb-1">
                  <span>Base Rareté ({RARITY_METADATA[targetRarity].label}) :</span>
                  <span className="font-bold text-[#fde047]">{baseRarityDc}</span>
                </div>
                <div className="flex justify-between border-b border-[#2e2118] pb-1">
                  <span>Terrain ({biomeProfile.name.split(' ')[0]}) :</span>
                  <span className={biomeMod > 0 ? 'text-[#f87171] font-bold' : 'text-[#4ade80] font-bold'}>
                    {biomeMod >= 0 ? `+${biomeMod}` : biomeMod}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#2e2118] pb-1">
                  <span>Météo :</span>
                  <span className={weatherCondition > 0 ? 'text-[#f87171] font-bold' : weatherCondition < 0 ? 'text-[#4ade80] font-bold' : 'text-[#a89988]'}>
                    {weatherCondition >= 0 ? `+${weatherCondition}` : weatherCondition}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#2e2118] pb-1">
                  <span>Durée :</span>
                  <span className={searchDurationMod > 0 ? 'text-[#f87171] font-bold' : searchDurationMod < 0 ? 'text-[#4ade80] font-bold' : 'text-[#a89988]'}>
                    {searchDurationMod >= 0 ? `+${searchDurationMod}` : searchDurationMod}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Équipement :</span>
                  <span className={equipmentToolsMod < 0 ? 'text-[#4ade80] font-bold' : 'text-[#f87171] font-bold'}>
                    {equipmentToolsMod >= 0 ? `+${equipmentToolsMod}` : equipmentToolsMod}
                  </span>
                </div>
                <div className="border-t-2 border-[#d4af37] pt-1 flex justify-between font-bold text-sm text-[#fef08a]">
                  <span>TOTAL :</span>
                  <span>DD {calculatedDC}</span>
                </div>
              </div>

              {/* Recommended Skill */}
              <div className="text-xs text-[#d7c9b8] pt-1">
                Compétence conseillée : <strong className="text-[#fde047]">{biomeProfile.primarySkill}</strong>
              </div>
            </div>

            {/* Matching Plants in Database for this Biome & Rarity */}
            <div className="bg-[#1c1612] p-5 rounded-xl border border-[#4a3b32] space-y-3">
              <div className="flex justify-between items-center border-b border-[#3e2e23] pb-2">
                <h4 className="font-bold text-sm text-[#fde047] flex items-center gap-2">
                  <Trees className="w-4 h-4 text-[#4ade80]" />
                  Plantes correspondantes dans le Grimoire ({matchingPlants.length})
                </h4>
              </div>

              {matchingPlants.length === 0 ? (
                <p className="text-xs text-[#a89988] italic">
                  Aucune plante enregistrée avec cette rareté exacte dans ce biome. Vous pouvez utiliser ce DD pour introduire une herbe sauvage homebrew !
                </p>
              ) : (
                <div className="space-y-2">
                  {matchingPlants.map((plant) => (
                    <div
                      key={plant.id}
                      onClick={() => onSelectPlant && onSelectPlant(plant)}
                      className="p-2.5 rounded-lg bg-[#140f0c] border border-[#3e2e23] hover:border-[#d4af37] cursor-pointer transition flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-[#fef08a]">{plant.name}</div>
                        <div className="text-[10px] text-[#a89988] italic">{plant.latinName}</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2b1f17] text-[#cbd5e1] border border-[#524136]">
                        Fiche : DD {plant.dcHarvest}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Banc d'essai : Test Roll Simulator (Virtual or Manual d20) */}
            <div className="bg-[#1c1612] p-5 rounded-xl border border-[#4a3b32] space-y-4">
              <div className="flex justify-between items-center border-b border-[#3e2e23] pb-2">
                <h4 className="font-bold text-sm text-[#fde047] flex items-center gap-2">
                  <Dices className="w-4 h-4 text-[#f59e0b]" />
                  Banc d'Essai : Lancer le Test vs DD {calculatedDC}
                </h4>

                {/* Mode switch */}
                <div className="flex items-center gap-1 bg-[#140f0c] p-0.5 rounded border border-[#3e2e23]">
                  <button
                    type="button"
                    onClick={() => setTestDiceMode('virtual')}
                    className={`px-2 py-0.5 rounded text-[10px] transition ${
                      testDiceMode === 'virtual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                    }`}
                  >
                    Dé Virtuel
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestDiceMode('manual')}
                    className={`px-2 py-0.5 rounded text-[10px] transition ${
                      testDiceMode === 'manual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                    }`}
                  >
                    Jet Manuel
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#a89988] mb-1">
                    Bonus du Joueur (Survie ou Nature) : <strong className="text-[#fde047]">+{testerBonus}</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={testerBonus}
                    onChange={(e) => setTesterBonus(parseInt(e.target.value) || 0)}
                    className="w-full accent-[#d4af37]"
                  />
                </div>

                {testDiceMode === 'manual' ? (
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
                      onClick={() => handleTestRoll(manualD20)}
                      className="w-full py-2.5 bg-[#b45309] hover:bg-[#d97706] text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-[#fde047]" />
                      <span>Valider mon jet ({manualD20}) vs DD {calculatedDC}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleTestRoll()}
                    className="w-full py-2.5 bg-[#b45309] hover:bg-[#d97706] text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2"
                  >
                    <Dices className="w-4 h-4 text-[#fde047]" />
                    <span>Lancer le d20 contre le DD {calculatedDC}</span>
                  </button>
                )}

                {testResult && (
                  <div
                    className={`p-3 rounded-lg border text-xs space-y-1.5 transition ${
                      testResult.critSuccess
                        ? 'bg-[#14532d]/40 border-[#22c55e] text-[#86efac]'
                        : testResult.success
                        ? 'bg-[#1e3a5f]/40 border-[#38bdf8] text-[#bae6fd]'
                        : testResult.critFail
                        ? 'bg-[#450a0a]/50 border-[#ef4444] text-[#fca5a5]'
                        : 'bg-[#291b16] border-[#78350f] text-[#fde047]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono font-bold">
                      <span>
                        d20:{testResult.roll} + {testerBonus} = {testResult.total} (DD {testResult.dc})
                      </span>
                      <span>{testResult.success ? 'RÉUSSI' : 'ÉCHEC'}</span>
                    </div>
                    <p className="font-serif leading-relaxed">{testResult.message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: THE 4 HARVEST PHASES RULES                          */}
      {/* ============================================================== */}
      {activeGuideTab === 'rules' && (
        <div className="bg-[#1c1612] p-6 sm:p-8 rounded-xl border border-[#4a3b32] space-y-8 shadow-xl">
          <div className="border-b border-[#3e2e23] pb-4">
            <h3 className="text-2xl font-bold text-[#fde047] flex items-center gap-2.5">
              <HelpCircle className="w-6 h-6 text-[#38bdf8]" />
              Les 4 Phases de la Cueillette Botanique en Jeu de Rôle
            </h3>
            <p className="text-xs sm:text-sm text-[#c4b5a5] italic mt-1 leading-relaxed">
              Pour éviter qu'une expédition d'herboristerie ne se résume à un simple jet de dé anonyme, découpez l'action en quatre phases tactiques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phase 1 */}
            <div className="bg-[#241c16] p-5 rounded-xl border border-[#4d3a2e] space-y-3">
              <div className="flex items-center gap-3 border-b border-[#3e2e23] pb-2">
                <span className="w-8 h-8 rounded-full bg-[#854d0e] text-white flex items-center justify-center font-bold text-sm font-mono">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-base text-[#fef08a]">
                    Phase 1 : Recherche & Localisation
                  </h4>
                  <span className="text-[11px] text-[#38bdf8] font-mono">Compétence : Sagesse (Survie) ou Perception</span>
                </div>
              </div>
              <p className="text-xs text-[#d7c9b8] leading-relaxed">
                Le personnage scrute le sous-bois, repère l'humidité du sol, suit les sentiers de bêtes brouteuses et analyse les microclimats (versant sud ensoleillé, faille calcaire, pied de chêne centenaire).
              </p>
              <div className="bg-[#181310] p-2.5 rounded border border-[#2e2118] text-[11px] text-[#cbd5e1] space-y-1">
                <strong>Conseil MJ :</strong> Donnez un indice narratif avant le jet : « En approchant de la berge brumeuse, une odeur d'anis douceâtre flotte dans l'air froid... »
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-[#241c16] p-5 rounded-xl border border-[#4d3a2e] space-y-3">
              <div className="flex items-center gap-3 border-b border-[#3e2e23] pb-2">
                <span className="w-8 h-8 rounded-full bg-[#854d0e] text-white flex items-center justify-center font-bold text-sm font-mono">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-base text-[#fef08a]">
                    Phase 2 : Identification Botanique
                  </h4>
                  <span className="text-[11px] text-[#a855f7] font-mono">Compétence : Intelligence (Nature)</span>
                </div>
              </div>
              <p className="text-xs text-[#d7c9b8] leading-relaxed">
                Reconnaître le spécimen exact et s'assurer qu'il ne s'agit pas d'un sosie mortel. Le personnage compte les pétales, observe la pilosité de la tige et frotte une feuille pour sentir son suc.
              </p>
              <div className="bg-[#181310] p-2.5 rounded border border-[#2e2118] text-[11px] text-[#cbd5e1] space-y-1">
                <strong>Règle du Sosie :</strong> En cas d'échec de 5 points sous le DD, le joueur confond la plante avec un faux ami vénéneux (ex: Belladone prise pour une myrtille sauvage).
              </div>
            </div>

            {/* Phase 3 */}
            <div className="bg-[#241c16] p-5 rounded-xl border border-[#4d3a2e] space-y-3">
              <div className="flex items-center gap-3 border-b border-[#3e2e23] pb-2">
                <span className="w-8 h-8 rounded-full bg-[#854d0e] text-white flex items-center justify-center font-bold text-sm font-mono">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-base text-[#fef08a]">
                    Phase 3 : Prélèvement & Coupe Précise
                  </h4>
                  <span className="text-[11px] text-[#10b981] font-mono">Compétence : Dextérité (Trousse d'Herboristerie)</span>
                </div>
              </div>
              <p className="text-xs text-[#d7c9b8] leading-relaxed">
                Une incision brutale peut faire suinter et évaporer les alcaloïdes magiques. Il faut inciser à l'ongle ou avec une lame en bronze au niveau de l'insertion foliaire, sans arracher la motte racinaire stérile.
              </p>
              <div className="bg-[#181310] p-2.5 rounded border border-[#2e2118] text-[11px] text-[#cbd5e1] space-y-1">
                <strong>Outils Nécessaires :</strong> Gants de cuir souple, ciseaux de chirurgien, petite pelle d'argent contre la corruption tellurique.
              </div>
            </div>

            {/* Phase 4 */}
            <div className="bg-[#241c16] p-5 rounded-xl border border-[#4d3a2e] space-y-3">
              <div className="flex items-center gap-3 border-b border-[#3e2e23] pb-2">
                <span className="w-8 h-8 rounded-full bg-[#854d0e] text-white flex items-center justify-center font-bold text-sm font-mono">
                  4
                </span>
                <div>
                  <h4 className="font-bold text-base text-[#fef08a]">
                    Phase 4 : Conditionnement & Préservation
                  </h4>
                  <span className="text-[11px] text-[#f59e0b] font-mono">Procédé : Séchage, Macération ou Alambic</span>
                </div>
              </div>
              <p className="text-xs text-[#d7c9b8] leading-relaxed">
                Une plante fraîche flétrit en 3 jours dans une besace. Pour la conserver, elle doit être mise sous presse entre deux buvards de lin, plongée dans l'alcool neutre, ou distillée le soir même au bivouac.
              </p>
              <div className="bg-[#181310] p-2.5 rounded border border-[#2e2118] text-[11px] text-[#cbd5e1] space-y-1">
                <strong>Durées de Conservation :</strong> Fleur fraîche (3 jours) · Séchée sous presse (6 mois) · Macération huileuse (2 ans).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 3: THE 7 BIOMES COMPARATIVE PROFILES                   */}
      {/* ============================================================== */}
      {activeGuideTab === 'biomes' && (
        <div className="space-y-6">
          <div className="bg-[#1c1612] p-6 rounded-xl border border-[#4a3b32]">
            <h3 className="text-2xl font-bold text-[#d4af37] flex items-center gap-2">
              <Trees className="w-6 h-6 text-[#4ade80]" />
              Profils des 7 Biomes de la Terre de Fangh
            </h3>
            <p className="text-xs text-[#c4b5a5] italic mt-1">
              Chaque écosystème impose des défis physiques et magiques propres influant directement sur le DD final de recherche.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(BIOME_DC_PROFILES).map(([key, bio]) => (
              <div
                key={key}
                className="bg-[#1c1612] rounded-xl border border-[#3e2e23] p-5 space-y-3 shadow-lg hover:border-[#d4af37] transition"
              >
                <div className="flex justify-between items-start border-b border-[#3e2e23] pb-2">
                  <div>
                    <h4 className="font-bold text-base text-[#fef08a]">{bio.name}</h4>
                    <span className="text-[11px] text-[#a89988] italic">Compétence : {bio.primarySkill}</span>
                  </div>
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                      bio.baseDcMod > 0 ? 'bg-[#451a03] text-[#f87171] border-[#ef4444]/40' : 'bg-[#14532d] text-[#86efac] border-[#22c55e]/40'
                    }`}
                  >
                    Mod. DD : {bio.baseDcMod >= 0 ? `+${bio.baseDcMod}` : bio.baseDcMod}
                  </span>
                </div>

                <div className="text-xs space-y-2 text-[#d7c9b8]">
                  <div>
                    <strong className="text-[#fde047] block text-[11px]">Caractéristiques Végétales :</strong>
                    <p className="text-[11px]">{bio.botanicalTraits}</p>
                  </div>

                  <div>
                    <strong className="text-[#f87171] block text-[11px]">Dangers & Faune :</strong>
                    <p className="text-[11px]">{bio.hazards}</p>
                  </div>

                  <div className="pt-2 border-t border-[#2e2118] text-[10px] text-[#38bdf8] flex items-center justify-between">
                    <span>Créneau idéal :</span>
                    <span className="font-medium text-right">{bio.optimalTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 4: HARVESTING ENCOUNTERS & RARITY TABLES              */}
      {/* ============================================================== */}
      {activeGuideTab === 'encounters' && (
        <BiomeEncountersAndRarityView
          plants={plants}
          onSelectPlant={onSelectPlant}
        />
      )}

      {/* ============================================================== */}
      {/* SECTION 5: TOXIC LOOKALIKES & CRITICAL FAILS                   */}
      {/* ============================================================== */}
      {activeGuideTab === 'toxics' && (
        <div className="bg-[#1c1612] p-6 sm:p-8 rounded-xl border border-[#4a3b32] space-y-6 shadow-xl">
          <div className="border-b border-[#3e2e23] pb-4">
            <h3 className="text-2xl font-bold text-[#f87171] flex items-center gap-2.5">
              <AlertTriangle className="w-6 h-6" />
              Table des Sosies Toxiques & Confusions Mortelles
            </h3>
            <p className="text-xs sm:text-sm text-[#c4b5a5] italic mt-1 leading-relaxed">
              En cas d'échec critique (1 naturel) ou si le joueur rate son test d'identification de 5 points ou plus, appliquez l'une des confusions ci-dessous pour pimenter la partie !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                searched: 'Athelas (Feuille Royale)',
                lookalike: 'Fausse-Morelle des Marais',
                consequence: 'Au lieu de soigner les blessures, l\'onguent provoque d\'intenses démangeaisons et un désavantage aux tests de Force pendant 8 heures.',
                dangerLevel: 'Modéré',
              },
              {
                searched: 'Lotus d\'Or Solaire',
                lookalike: 'Bouton d\'Or Pyrophore',
                consequence: 'Explose en poussière urticante dès qu\'on le chauffe dans l\'alambic (2d6 dégâts de feu au visage et aveuglement 1 heure).',
                dangerLevel: 'Très Élevé',
              },
              {
                searched: 'Belladone Vénéneuse (pour antalgique)',
                lookalike: 'Jusquiame Noire Concentrée',
                consequence: 'Provoque des délires hallucinatoires incontrôlables : le joueur voit ses compagnons comme des démons hideux.',
                dangerLevel: 'Grave',
              },
              {
                searched: 'Fleur de Lune Nocturne',
                lookalike: 'Blanche-Givrée des Morts',
                consequence: 'Gèle immédiatement l\'eau de la potion en cristal coupant, brisant la fiole en morceaux dans la sacoche.',
                dangerLevel: 'Matériel',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#241714] border border-[#78350f] space-y-2">
                <div className="flex justify-between items-start border-b border-[#451a03] pb-1.5">
                  <div>
                    <span className="text-[10px] text-[#4ade80] font-bold block">Plante Recherchée :</span>
                    <strong className="text-sm text-[#fef08a]">{item.searched}</strong>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#450a0a] text-[#fca5a5] border border-[#ef4444]/40">
                    {item.dangerLevel}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#f87171] font-bold block">Sosie Toxique Récolté par Erreur :</span>
                  <strong className="text-xs text-[#fca5a5]">{item.lookalike}</strong>
                </div>

                <p className="text-xs text-[#d7c9b8] leading-relaxed pt-1 border-t border-[#3e231b]">
                  {item.consequence}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
