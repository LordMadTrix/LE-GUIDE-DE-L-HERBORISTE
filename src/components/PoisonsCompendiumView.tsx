import React, { useState } from 'react';
import { Poison, PoisonVector, PoisonOrigin, ConditionEffect, PoisonSaveRoll } from '../types/poison';
import { POISONS_LIST, POISON_VECTORS_META, POISON_CONDITIONS_META } from '../data/poisonsData';
import { Plant } from '../types/herb';
import { 
  Skull, 
  ShieldAlert, 
  FlaskConical, 
  HeartPulse, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Dices, 
  Coins, 
  Clock, 
  Activity, 
  Eye, 
  Droplets, 
  Sparkles, 
  Info,
  Scale,
  ShieldCheck,
  Zap,
  Bookmark,
  ExternalLink
} from 'lucide-react';

interface PoisonsCompendiumViewProps {
  plants: Plant[];
  onSelectPlant?: (plant: Plant) => void;
  onNavigateToAlchemy?: () => void;
}

export const PoisonsCompendiumView: React.FC<PoisonsCompendiumViewProps> = ({
  plants,
  onSelectPlant,
  onNavigateToAlchemy,
}) => {
  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVector, setSelectedVector] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedPoison, setSelectedPoison] = useState<Poison>(POISONS_LIST[0]);

  // Simulation test roll states
  const [conBonus, setConBonus] = useState<number>(3); // Constitution saving throw modifier
  const [diceMode, setDiceMode] = useState<'virtual' | 'manual'>('virtual');
  const [manualD20, setManualD20] = useState<number>(12);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [saveResult, setSaveResult] = useState<PoisonSaveRoll | null>(null);

  // Active guide sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'compendium' | 'conditions_rules' | 'detection_lore'>('compendium');

  // Filtered list
  const filteredPoisons = POISONS_LIST.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.latinOrScientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.antidote.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.antidote.requiredPlants.some(rp => rp.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchVector = selectedVector === 'all' || p.vector === selectedVector;
    const matchCondition = selectedCondition === 'all' || p.conditions.includes(selectedCondition as ConditionEffect);
    const matchOrigin = selectedOrigin === 'all' || p.origin === selectedOrigin;

    return matchSearch && matchVector && matchCondition && matchOrigin;
  });

  // Handle saving throw against the poison
  const handleRollSavingThrow = (customRoll?: number) => {
    setIsRolling(true);
    setSaveResult(null);

    setTimeout(() => {
      const d20 = customRoll !== undefined
        ? Math.min(20, Math.max(1, customRoll))
        : (diceMode === 'manual' ? Math.min(20, Math.max(1, manualD20)) : Math.floor(Math.random() * 20) + 1);

      const total = d20 + conBonus;
      const critSuccess = d20 === 20;
      const critFail = d20 === 1;
      const success = (total >= selectedPoison.saveDC || critSuccess) && !critFail;

      let dmg = selectedPoison.damageFormula;
      let cond = selectedPoison.conditions.join(', ');
      let msg = '';

      if (critSuccess) {
        dmg = 'Aucun dégât';
        cond = 'Aucune condition (Immunité)';
        msg = `20 Naturel ! Métabolisme d'acier : vos anticorps et votre sang vigoureux neutralisent la toxine avant qu'elle n'atteigne le cœur !`;
      } else if (success) {
        dmg = `Dégâts réduits de moitié (${selectedPoison.damageFormula} / 2)`;
        cond = 'Condition évitée';
        msg = `Sauvegarde réussie (${total} vs DD ${selectedPoison.saveDC}) ! Votre organisme encaisse le choc sans succomber aux effets paralysants.`;
      } else if (critFail) {
        dmg = `Dégâts maximisés critiques (${selectedPoison.damageFormula} MAX)`;
        cond = `${cond} (Durée doublée)`;
        msg = `1 Naturel ! Effondrement immédiat : la toxine foudroie votre système nerveux sans aucune résistance !`;
      } else {
        msg = `Sauvegarde échouée (${total} vs DD ${selectedPoison.saveDC}). Les toxines se répandent dans vos veines : vous subissez ${selectedPoison.damageFormula} et contractez la condition [${cond}].`;
      }

      setSaveResult({
        roll: d20,
        total,
        dc: selectedPoison.saveDC,
        success,
        critSuccess,
        critFail,
        damageTaken: dmg,
        conditionApplied: cond,
        narrativeMessage: msg,
      });

      setIsRolling(false);
    }, 350);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-serif space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#1f1515] rounded-xl border-2 border-[#ef4444]/60 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#ef4444]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#450a0a] text-[#fca5a5] border border-[#ef4444]/50 uppercase tracking-widest font-mono font-bold flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5 text-[#ef4444] animate-pulse" />
                Traité de Toxicologie, Venins & Remèdes d'Urgence
              </span>
              <span className="text-xs text-[#a89988]">Règles D&D 5e & Législation de Fangh</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fecaca] flex items-center gap-3">
              <Skull className="w-9 h-9 text-[#ef4444]" />
              Compendium des Poisons & Antidotes
            </h2>

            <p className="text-xs sm:text-sm text-[#c4b5a5] italic mt-1.5 max-w-3xl leading-relaxed">
              Consultez les toxines végétales, venins de monstres et poisons minéraux. Découvrez leurs effets de condition (Paralysé, Empoisonné, Pétrifié), simulez vos jets de sauvegarde et préparez les remèdes botaniques associés.
            </p>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex flex-wrap items-center gap-2 bg-[#140b0b] p-1.5 rounded-xl border border-[#3e1a1a] shrink-0">
            <button
              onClick={() => setActiveSubTab('compendium')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow ${
                activeSubTab === 'compendium'
                  ? 'bg-[#991b1b] text-white ring-1 ring-[#f87171]'
                  : 'text-[#d7c9b8] hover:bg-[#281212]'
              }`}
            >
              <Skull className="w-4 h-4 text-[#ef4444]" />
              <span>Les {POISONS_LIST.length} Poisons</span>
            </button>

            <button
              onClick={() => setActiveSubTab('conditions_rules')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow ${
                activeSubTab === 'conditions_rules'
                  ? 'bg-[#991b1b] text-white ring-1 ring-[#f87171]'
                  : 'text-[#d7c9b8] hover:bg-[#281212]'
              }`}
            >
              <Activity className="w-4 h-4 text-[#38bdf8]" />
              <span>Règles des Conditions</span>
            </button>

            <button
              onClick={() => setActiveSubTab('detection_lore')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow ${
                activeSubTab === 'detection_lore'
                  ? 'bg-[#991b1b] text-white ring-1 ring-[#f87171]'
                  : 'text-[#d7c9b8] hover:bg-[#281212]'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-[#fde047]" />
              <span>Détection & Marché Noir</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUB-TAB 1: COMPENDIUM OF POISONS                               */}
      {/* ============================================================== */}
      {activeSubTab === 'compendium' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Filter & Poison List */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Filter controls */}
            <div className="bg-[#1a1010] p-4 rounded-xl border border-[#3e1e1e] space-y-3 shadow-md">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#a89988]" />
                <input
                  type="text"
                  placeholder="Rechercher poison, symptôme, antidote..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#120808] border border-[#4a2222] rounded-lg text-xs text-[#f5ecd7] focus:outline-none focus:border-[#ef4444]"
                />
              </div>

              {/* Vector pills */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#a89988] uppercase tracking-wider block font-bold">
                  Vecteur d'Inoculation :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedVector('all')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      selectedVector === 'all' ? 'bg-[#991b1b] text-white' : 'bg-[#120808] text-[#c4b5a5] border border-[#381a1a]'
                    }`}
                  >
                    Tous
                  </button>
                  {Object.entries(POISON_VECTORS_META).map(([key, meta]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedVector(key)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        selectedVector === key ? 'bg-[#991b1b] text-white' : 'bg-[#120808] text-[#c4b5a5] border border-[#381a1a]'
                      }`}
                    >
                      {meta.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition pills */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#a89988] uppercase tracking-wider block font-bold">
                  Condition Infligée :
                </span>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setSelectedCondition('all')}
                    className={`px-2 py-0.5 rounded text-[10px] transition ${
                      selectedCondition === 'all' ? 'bg-[#991b1b] text-white font-bold' : 'bg-[#120808] text-[#c4b5a5] border border-[#381a1a]'
                    }`}
                  >
                    Toutes
                  </button>
                  {Object.keys(POISON_CONDITIONS_META).map((cond) => (
                    <button
                      key={cond}
                      onClick={() => setSelectedCondition(cond)}
                      className={`px-1.5 py-0.5 rounded text-[10px] transition ${
                        selectedCondition === cond ? 'bg-[#991b1b] text-white font-bold' : 'bg-[#120808] text-[#c4b5a5] border border-[#381a1a]'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Poison Cards Scrollable List */}
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredPoisons.map((poison) => {
                const isSelected = selectedPoison.id === poison.id;
                const vectorMeta = POISON_VECTORS_META[poison.vector];

                return (
                  <div
                    key={poison.id}
                    onClick={() => {
                      setSelectedPoison(poison);
                      setSaveResult(null);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#3b1515] border-[#ef4444] ring-1 ring-[#ef4444] shadow-lg'
                        : 'bg-[#190e0e] border-[#381a1a] hover:border-[#7f1d1d]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#fecaca] truncate">
                          {poison.name}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#a89988] flex items-center gap-2">
                        <span style={{ color: vectorMeta.color }}>{vectorMeta.label}</span>
                        <span>·</span>
                        <span className="text-[#f87171] font-mono">{poison.damageFormula}</span>
                      </div>

                      {/* Condition badges */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {poison.conditions.map((cond, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#3b0b0b] text-[#fca5a5] border border-[#7f1d1d]"
                          >
                            {cond}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-[#fde047] block">
                        DD {poison.saveDC}
                      </span>
                      <span className="text-[10px] text-[#cbd5e1] font-mono block mt-1">
                        {poison.blackMarketPricePo} PO
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Poison Detail Dossier & Antidote Recipe */}
          <div className="lg:col-span-7 bg-[#1c1212] p-6 sm:p-7 rounded-xl border border-[#4a2424] space-y-6 shadow-xl">
            
            {/* Header of selected poison */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#381a1a] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#450a0a] text-[#fca5a5] border border-[#ef4444]/40">
                    {POISON_VECTORS_META[selectedPoison.vector].label} · ORIGINE {selectedPoison.origin.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-[#fde047] font-mono font-bold">
                    {selectedPoison.legality}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#fecaca] mt-1.5">
                  {selectedPoison.name}
                </h3>
                <span className="text-xs italic text-[#a89988]">
                  {selectedPoison.latinOrScientificName}
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-2xl font-mono font-extrabold text-[#fde047] block">
                  DD {selectedPoison.saveDC} {selectedPoison.saveType}
                </span>
                <span className="text-[11px] text-[#cbd5e1]">
                  Prix Marché Noir : {selectedPoison.blackMarketPricePo} PO
                </span>
              </div>
            </div>

            {/* Damage & Clinical Symptoms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#261212] border border-[#4a2222] space-y-1">
                <span className="text-[10px] text-[#a89988] block font-bold uppercase">
                  Dégâts & Délai d'Incubation :
                </span>
                <div className="font-mono text-sm font-bold text-[#ef4444]">
                  {selectedPoison.damageFormula}
                </div>
                <div className="text-[11px] text-[#cbd5e1]">
                  Délai : {selectedPoison.delay}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#261212] border border-[#4a2222] space-y-1">
                <span className="text-[10px] text-[#a89988] block font-bold uppercase">
                  Conditions Toxiques Infligées :
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {selectedPoison.conditions.map((cond, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-[#450a0a] text-[#fca5a5] border border-[#ef4444] text-[11px] font-bold"
                    >
                      ⚠️ {cond}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Medical Symptoms & Rules Details */}
            <div className="space-y-3 text-xs">
              <div>
                <strong className="text-[#fde047] block text-xs uppercase tracking-wider mb-1">
                  Symptômes Cliniques Visibles :
                </strong>
                <p className="text-[#e6d8c3] leading-relaxed bg-[#170c0c] p-2.5 rounded border border-[#381818]">
                  {selectedPoison.symptoms}
                </p>
              </div>

              <div>
                <strong className="text-[#ef4444] block text-xs uppercase tracking-wider mb-1">
                  Mécanique de Jeu (D&D 5e) :
                </strong>
                <p className="text-[#cbd5e1] leading-relaxed bg-[#170c0c] p-2.5 rounded border border-[#381818]">
                  {selectedPoison.gameMechanics}
                </p>
              </div>
            </div>

            {/* ========================================================== */}
            {/* THE GOLDEN ANTIDOTE & REMEDY CARD                          */}
            {/* ========================================================== */}
            <div className="bg-[#1f1a14] rounded-xl border-2 border-[#d4af37] p-4 sm:p-5 space-y-3 shadow-lg">
              <div className="flex justify-between items-start border-b border-[#4d3a2e] pb-2">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-[#4ade80]" />
                  <div>
                    <span className="text-[10px] text-[#4ade80] uppercase tracking-wider font-bold block">
                      Remède Thérapeutique & Antidote Officiel
                    </span>
                    <h4 className="text-base font-bold text-[#fde047]">
                      {selectedPoison.antidote.name}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#fde047] block">
                    DD Confection {selectedPoison.antidote.craftDC}
                  </span>
                  <span className="text-[10px] text-[#a89988]">
                    {selectedPoison.antidote.preparationTime}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-[#e6d8c3]">
                  <strong className="text-[#a89988]">Plantes Médicinales Requises : </strong>
                  {selectedPoison.antidote.requiredPlants.map((plantName, idx) => {
                    const foundPlant = plants.find(p => p.name.toLowerCase().includes(plantName.toLowerCase()));
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => foundPlant && onSelectPlant && onSelectPlant(foundPlant)}
                        className="px-2 py-0.5 rounded bg-[#2b1f14] border border-[#d4af37]/60 text-[11px] font-bold text-[#fef08a] hover:bg-[#451a03] transition flex items-center gap-1"
                        title={foundPlant ? 'Voir la fiche botanique complète' : undefined}
                      >
                        <span>🌿 {plantName}</span>
                        {foundPlant && <ExternalLink className="w-3 h-3 text-[#d4af37]" />}
                      </button>
                    );
                  })}
                </div>

                {selectedPoison.antidote.requiredMinerals && (
                  <div className="flex flex-wrap items-center gap-2 text-[#e6d8c3]">
                    <strong className="text-[#a89988]">Minéral / Catalyseur Tellurique : </strong>
                    {selectedPoison.antidote.requiredMinerals.map((minName, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#1e293b] border border-[#38bdf8]/50 text-[11px] font-bold text-[#38bdf8]">
                        ⛏️ {minName}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-[11px] text-[#4ade80] italic pt-1 border-t border-[#3e2e23]">
                  <strong>Effet Curatif : </strong>{selectedPoison.antidote.effect}
                </p>
              </div>

              {onNavigateToAlchemy && (
                <button
                  onClick={onNavigateToAlchemy}
                  className="w-full py-2 bg-[#b45309] hover:bg-[#d97706] text-white font-bold text-xs rounded-lg shadow transition flex items-center justify-center gap-2 mt-2"
                >
                  <FlaskConical className="w-4 h-4 text-[#fde047]" />
                  <span>Concocter cet Antidote dans l'Atelier d'Alchimie</span>
                </button>
              )}
            </div>

            {/* Anecdote from Fangh lore */}
            <div className="p-3 bg-[#170e0e] rounded-lg border border-[#3e1a1a] text-xs text-[#c4b5a5] italic leading-relaxed">
              <strong>Chronique de la Milice : </strong>« {selectedPoison.loreAnecdote} »
            </div>

            {/* ========================================================== */}
            {/* CONSTITUTION SAVING THROW TEST SIMULATOR                   */}
            {/* ========================================================== */}
            <div className="bg-[#190e0e] p-5 rounded-xl border border-[#4a2222] space-y-4">
              <div className="flex justify-between items-center border-b border-[#3e1a1a] pb-2">
                <h4 className="font-bold text-sm text-[#fecaca] flex items-center gap-2">
                  <Dices className="w-4 h-4 text-[#ef4444]" />
                  Simulateur de Jet de Sauvegarde (Constitution) vs DD {selectedPoison.saveDC}
                </h4>

                <div className="flex items-center gap-1 bg-[#120808] p-0.5 rounded border border-[#3e1a1a]">
                  <button
                    type="button"
                    onClick={() => setDiceMode('virtual')}
                    className={`px-2 py-0.5 rounded text-[10px] transition ${
                      diceMode === 'virtual' ? 'bg-[#991b1b] text-white font-bold' : 'text-[#a89988]'
                    }`}
                  >
                    Dé Virtuel
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiceMode('manual')}
                    className={`px-2 py-0.5 rounded text-[10px] transition ${
                      diceMode === 'manual' ? 'bg-[#991b1b] text-white font-bold' : 'text-[#a89988]'
                    }`}
                  >
                    Jet Manuel
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#a89988] mb-1">
                    Bonus de Sauvegarde Constitution du Personnage : <strong className="text-[#fde047]">+{conBonus}</strong>
                  </label>
                  <input
                    type="range"
                    min="-2"
                    max="12"
                    value={conBonus}
                    onChange={(e) => setConBonus(parseInt(e.target.value) || 0)}
                    className="w-full accent-[#ef4444]"
                  />
                </div>

                {diceMode === 'manual' ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="text-[#a89988]">Résultat sur votre dé physique d20 (1-20) :</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={manualD20}
                        onChange={(e) => setManualD20(parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 bg-[#120808] border border-[#ef4444] rounded text-center text-sm font-bold text-[#fecaca] font-mono focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleRollSavingThrow(manualD20)}
                      disabled={isRolling}
                      className="w-full py-2.5 bg-[#991b1b] hover:bg-[#b91c1c] text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-[#fde047]" />
                      <span>Valider mon jet ({manualD20}) vs DD {selectedPoison.saveDC}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRollSavingThrow()}
                    disabled={isRolling}
                    className="w-full py-3 bg-[#991b1b] hover:bg-[#b91c1c] text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Dices className={`w-4 h-4 text-[#fde047] ${isRolling ? 'animate-spin' : ''}`} />
                    <span>Lancer le d20 de Constitution (+{conBonus})</span>
                  </button>
                )}

                {/* Outcome card */}
                {saveResult && (
                  <div
                    className={`p-3.5 rounded-lg border text-xs space-y-1.5 transition animate-fade-in ${
                      saveResult.critSuccess
                        ? 'bg-[#14532d]/40 border-[#22c55e] text-[#86efac]'
                        : saveResult.success
                        ? 'bg-[#1e3a5f]/40 border-[#38bdf8] text-[#bae6fd]'
                        : saveResult.critFail
                        ? 'bg-[#450a0a]/50 border-[#ef4444] text-[#fca5a5]'
                        : 'bg-[#3b1515] border-[#ef4444] text-[#fecaca]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono font-bold">
                      <span>d20:{saveResult.roll} + {conBonus} = {saveResult.total} (DD {saveResult.dc})</span>
                      <span>{saveResult.success ? 'RÉUSSI' : 'ÉCHEC'}</span>
                    </div>
                    <p className="font-serif leading-relaxed">{saveResult.narrativeMessage}</p>
                    <div className="text-[11px] pt-1 border-t border-current/20 flex justify-between font-mono">
                      <span>Dégâts : <strong>{saveResult.damageTaken}</strong></span>
                      <span>État : <strong>{saveResult.conditionApplied}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: CONDITIONS OFFICIAL D&D RULES                       */}
      {/* ============================================================== */}
      {activeSubTab === 'conditions_rules' && (
        <div className="bg-[#1c1212] p-6 sm:p-8 rounded-xl border border-[#4a2424] space-y-6 shadow-xl">
          <div className="border-b border-[#381a1a] pb-4">
            <h3 className="text-2xl font-bold text-[#fecaca] flex items-center gap-2.5">
              <Activity className="w-6 h-6 text-[#ef4444]" />
              Guide des Conditions Toxiques & Effets de Statut (D&D 5e)
            </h3>
            <p className="text-xs sm:text-sm text-[#c4b5a5] italic mt-1 leading-relaxed">
              Règles officielles et pénalités précises infligées aux joueurs ou créatures victimes de poisons et venins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(POISON_CONDITIONS_META).map(([key, data]) => (
              <div key={key} className="bg-[#241212] p-4 rounded-xl border border-[#4a2222] space-y-2">
                <div className="flex justify-between items-center border-b border-[#381a1a] pb-1.5">
                  <h4 className="font-bold text-base text-[#fde047]">
                    ⚠️ {data.label}
                  </h4>
                  <span className="text-[10px] text-[#a89988] italic">{data.desc}</span>
                </div>
                <p className="text-xs text-[#e6d8c3] leading-relaxed">
                  <strong>Effets en combat : </strong>{data.dndRule}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 3: POISON DETECTION & LORE                             */}
      {/* ============================================================== */}
      {activeSubTab === 'detection_lore' && (
        <div className="bg-[#1c1212] p-6 sm:p-8 rounded-xl border border-[#4a2424] space-y-6 shadow-xl">
          <div className="border-b border-[#381a1a] pb-4">
            <h3 className="text-2xl font-bold text-[#fde047] flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-[#ef4444]" />
              Détection des Poisons, Législation & Secrets de Survie
            </h3>
            <p className="text-xs sm:text-sm text-[#c4b5a5] italic mt-1 leading-relaxed">
              Comment identifier un verre empoisonné lors d'un banquet noble et ce que risque un aventurier pris avec des flacons prohibés dans sa besace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#e6d8c3]">
            <div className="bg-[#241212] p-4 rounded-xl border border-[#4a2222] space-y-2">
              <h4 className="font-bold text-sm text-[#fde047] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#38bdf8]" />
                Indices de Détection Sensorielle
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-[#cbd5e1] leading-relaxed">
                <li><strong>Odeur d'Amande Amère :</strong> Révèle la présence de dérivés de ciguë ou de noyaux d'abricot sauvage.</li>
                <li><strong>Test de la Cuillère d'Argent :</strong> L'argent alchimique noircit immédiatement au contact du soufre et des sèves corrosives.</li>
                <li><strong>Gouttelette sur le Pain :</strong> Versée sur de la mie de pain, une boisson empoisonnée forme un halo verdâtre ou fait fuir les mouches.</li>
              </ul>
            </div>

            <div className="bg-[#241212] p-4 rounded-xl border border-[#4a2222] space-y-2">
              <h4 className="font-bold text-sm text-[#fde047] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#f59e0b]" />
                Législation & Milice de Fangh
              </h4>
              <p className="text-[#cbd5e1] leading-relaxed">
                Posséder un poison de catégorie « Strictement Interdit » sans brevet royal d'apothicaire est puni de confiscation, d'une amende de 100 PO par fiole et d'un séjour de 3 mois dans les geôles humides de la cité.
              </p>
              <div className="p-2 rounded bg-[#170808] border border-[#ef4444]/40 text-[#fca5a5] text-[11px]">
                <strong>Règle Rôliste :</strong> Si un aventurier tente de revendre un poison sans passer par la Guilde des Voleurs, un test de Tromperie ou Charisme DD 14 est requis pour ne pas éveiller les soupçons d'un indicateur de la Garde.
              </div>
            </div>

            <div className="bg-[#241212] p-4 rounded-xl border border-[#4a2222] space-y-2">
              <h4 className="font-bold text-sm text-[#fde047] flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-[#4ade80]" />
                Gestes de Premiers Soins
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-[#cbd5e1] leading-relaxed">
                <li><strong>Garrot Lâche :</strong> Ralentit la progression veineuse sans gangrener le membre blessé.</li>
                <li><strong>Lavement à l'Eau Pure :</strong> Dilue l'acide superficiel et stoppe les dégâts continus.</li>
                <li><strong>Prise d'Émétique :</strong> Efficace uniquement dans les 30 minutes suivant l'ingestion orale.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
