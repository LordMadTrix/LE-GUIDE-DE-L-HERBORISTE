import React, { useState, useMemo } from 'react';
import { Creature, CreatureHarvestComponent, CreatureCategory, BiomeType } from '../types/herb';
import { BIOMES_METADATA } from '../data/herbalistData';
import { 
  Skull, 
  Search, 
  Plus, 
  Dices, 
  Clock, 
  Coins, 
  ShieldAlert, 
  Sparkles, 
  Crosshair, 
  CheckCircle, 
  XCircle, 
  Flame, 
  Heart,
  Droplets,
  Layers,
  HelpCircle,
  FileText
} from 'lucide-react';

interface BestiaryViewProps {
  creatures: Creature[];
  onAddCreature: (creature: Creature) => void;
  onSelectHerbByName?: (herbName: string) => void;
  favoriteCreatureIds: string[];
  onToggleFavoriteCreature: (id: string) => void;
  selectedCreatureId?: string | null;
  onSelectCreature?: (creature: Creature) => void;
}

export const BestiaryView: React.FC<BestiaryViewProps> = ({
  creatures,
  onAddCreature,
  onSelectHerbByName,
  favoriteCreatureIds,
  onToggleFavoriteCreature,
  selectedCreatureId,
  onSelectCreature,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBiome, setSelectedBiome] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(creatures[0] || null);

  // Sync selected creature if passed from outside (e.g. global search)
  React.useEffect(() => {
    if (selectedCreatureId) {
      const found = creatures.find(c => c.id === selectedCreatureId);
      if (found) {
        setSelectedCreature(found);
      }
    }
  }, [selectedCreatureId, creatures]);

  // Harvesting simulator states
  const [activeHarvestComponent, setActiveHarvestComponent] = useState<CreatureHarvestComponent | null>(null);
  const [harvesterBonus, setHarvesterBonus] = useState<number>(4);
  const [harvestDiceMode, setHarvestDiceMode] = useState<'virtual' | 'manual'>('virtual');
  const [manualHarvestD20, setManualHarvestD20] = useState<number>(12);
  const [harvestRollResult, setHarvestRollResult] = useState<{
    roll: number;
    total: number;
    success: boolean;
    critSuccess: boolean;
    critFail: boolean;
  } | null>(null);

  // Modal for new creature
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newCreatureName, setNewCreatureName] = useState<string>('');
  const [newCreatureCategory, setNewCreatureCategory] = useState<CreatureCategory>('Monstruosité');
  const [newCreatureCR, setNewCreatureCR] = useState<string>('3');
  const [newCreatureBiomes, setNewCreatureBiomes] = useState<BiomeType[]>(['foret']);
  const [newCreatureDesc, setNewCreatureDesc] = useState<string>('');
  const [newCreatureLore, setNewCreatureLore] = useState<string>('');
  const [newCreatureRisks, setNewCreatureRisks] = useState<string>('');

  // Component form inputs for new creature
  const [newCompName, setNewCompName] = useState<string>('');
  const [newCompType, setNewCompType] = useState<CreatureHarvestComponent['type']>('Venin & Glande');
  const [newCompDC, setNewCompDC] = useState<number>(13);
  const [newCompSkill, setNewCompSkill] = useState<'Survie' | 'Nature' | 'Médecine'>('Survie');
  const [newCompTime, setNewCompTime] = useState<string>('20 minutes');
  const [newCompValue, setNewCompValue] = useState<string>('50 po');
  const [newCompAlchemy, setNewCompAlchemy] = useState<string>('');
  const [newCompSynergy, setNewCompSynergy] = useState<string>('');

  // Filtering
  const filteredCreatures = useMemo(() => {
    return creatures.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.latinName && c.latinName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        c.components.some(comp => comp.name.toLowerCase().includes(searchTerm.toLowerCase()) || comp.alchemicalProperties.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchBiome = selectedBiome === 'all' || c.environment.includes(selectedBiome as BiomeType);
      const matchCategory = selectedCategory === 'all' || c.category === selectedCategory;
      const matchFav = !showFavoritesOnly || favoriteCreatureIds.includes(c.id);

      return matchSearch && matchBiome && matchCategory && matchFav;
    });
  }, [creatures, searchTerm, selectedBiome, selectedCategory, showFavoritesOnly, favoriteCreatureIds]);

  // Harvest dice roll (virtual or manual)
  const handleHarvestAttempt = (comp: CreatureHarvestComponent, customRoll?: number) => {
    setActiveHarvestComponent(comp);
    const d20 = customRoll !== undefined
      ? Math.min(20, Math.max(1, customRoll))
      : (harvestDiceMode === 'manual' ? Math.min(20, Math.max(1, manualHarvestD20)) : Math.floor(Math.random() * 20) + 1);

    const total = d20 + harvesterBonus;
    const success = d20 === 20 || (d20 !== 1 && total >= comp.harvestDC);

    setHarvestRollResult({
      roll: d20,
      total,
      success,
      critSuccess: d20 === 20,
      critFail: d20 === 1,
    });
  };

  // Submit new creature
  const handleCreateCreature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreatureName) return;

    const newCreature: Creature = {
      id: `custom_${Date.now()}`,
      name: newCreatureName,
      category: newCreatureCategory,
      challengeRating: newCreatureCR,
      environment: newCreatureBiomes,
      description: newCreatureDesc || 'Créature rencontrée au cours des expéditions.',
      tacticsAndLore: newCreatureLore || 'Comportement observé en milieu sauvage.',
      harvestRisks: newCreatureRisks || 'Prudence recommandée lors du dépeçage.',
      components: [
        {
          id: `comp_${Date.now()}`,
          name: newCompName || 'Organe alchimique',
          type: newCompType,
          harvestDC: newCompDC,
          harvestSkill: newCompSkill,
          harvestTime: newCompTime,
          shelfLife: '3 mois',
          marketValue: newCompValue,
          alchemicalProperties: newCompAlchemy || 'Propriétés réactives pour potions.',
          synergyWithHerbs: newCompSynergy || 'Peut être combiné avec les herbes sauvages.',
        },
      ],
      custom: true,
    };

    onAddCreature(newCreature);
    setSelectedCreature(newCreature);
    setIsAddModalOpen(false);

    // Reset fields
    setNewCreatureName('');
    setNewCreatureDesc('');
    setNewCreatureLore('');
    setNewCompName('');
    setNewCompAlchemy('');
    setNewCompSynergy('');
  };

  const getComponentTypeBadge = (type: CreatureHarvestComponent['type']) => {
    switch (type) {
      case 'Venin & Glande':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">Venin & Toxine</span>;
      case 'Organe & Cœur':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-700">Organe Vital</span>;
      case 'Sang & Fluide':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-700">Fluide Sanguin</span>;
      case 'Écailles & Cuir':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700">Cuirasse & Écailles</span>;
      case 'Os & Crocs':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-900 text-stone-300 border border-stone-600">Os & Crocs</span>;
      case 'Spores & Sève':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-700">Spores & Mycélium</span>;
      case 'Essence Magique':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-600">Essence Magique</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Title & Action Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6 border-b border-[#4d3a2e] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#d97706]/50 uppercase tracking-widest font-mono">
              Module Anatomique & Cynégétique
            </span>
            <span className="text-xs text-[#a89988] font-serif">
              {creatures.length} créatures répertoriées
            </span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#d4af37] drop-shadow flex items-center gap-3">
            <Skull className="w-8 h-8 text-[#dc2626]" />
            Bestiaire & Dépeçage Alchimique
          </h2>
          <p className="text-sm text-[#c4b5a5] italic font-serif mt-1">
            Catalogue des créatures fantastiques, composants organiques récoltables et synergies avec les plantes de l'herboriste
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#b45309] hover:bg-[#d97706] text-white font-serif font-bold text-xs shadow-lg transition"
        >
          <Plus className="w-4 h-4 text-[#fde047]" />
          <span>+ Ajouter une Créature (Homebrew)</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#1f1915] p-4 rounded-xl border border-[#4a3b32] mb-6 flex flex-wrap gap-3 items-center justify-between shadow-inner">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a89988]" />
          <input
            type="text"
            placeholder="Rechercher monstre, organe, venin, propriété alchimique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#120e0b] border border-[#524136] rounded-lg text-xs font-serif text-[#f4ecd8] focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Biome Filter */}
        <select
          value={selectedBiome}
          onChange={(e) => setSelectedBiome(e.target.value)}
          className="bg-[#120e0b] border border-[#524136] rounded-lg px-3 py-2 text-xs font-serif text-[#f4ecd8] focus:outline-none"
        >
          <option value="all">Tous les Biotopes</option>
          {Object.entries(BIOMES_METADATA).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#120e0b] border border-[#524136] rounded-lg px-3 py-2 text-xs font-serif text-[#f4ecd8] focus:outline-none"
        >
          <option value="all">Toutes les Catégories</option>
          <option value="Dragon">Dragons</option>
          <option value="Monstruosité">Monstruosités</option>
          <option value="Plante Monstrueuse">Plantes Monstrueuses</option>
          <option value="Fée">Fées & Nymphes</option>
          <option value="Bête Géante">Bêtes Géantes</option>
          <option value="Mort-Vivant">Morts-Vivants</option>
          <option value="Aberration">Aberrations</option>
        </select>

        {/* Favorites Filter Button */}
        <button
          onClick={() => setShowFavoritesOnly(prev => !prev)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-serif transition border ${
            showFavoritesOnly
              ? 'bg-rose-950 text-rose-300 border-rose-600 font-bold shadow'
              : 'bg-[#120e0b] text-[#d7c9b8] hover:bg-[#2c2018] border-[#524136]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
          <span>Favoris ({favoriteCreatureIds.length})</span>
        </button>
      </div>

      {/* Main Grid: Left Creatures List, Right Creature Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Creatures List */}
        <div className="lg:col-span-5 space-y-3 max-h-[800px] overflow-y-auto pr-1">
          {filteredCreatures.length === 0 ? (
            <div className="p-8 text-center bg-[#1a1410] rounded-xl border border-[#3e2e23] text-sm text-[#a89988] font-serif italic">
              Aucune créature ne correspond à vos filtres.
            </div>
          ) : (
            filteredCreatures.map((creature) => {
              const isSelected = selectedCreature?.id === creature.id;
              const isFav = favoriteCreatureIds.includes(creature.id);

              return (
                <div
                  key={creature.id}
                  onClick={() => {
                    setSelectedCreature(creature);
                    setActiveHarvestComponent(null);
                    setHarvestRollResult(null);
                  }}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer font-serif ${
                    isSelected
                      ? 'bg-[#3d2719] border-[#d4af37] shadow-lg text-[#fef08a]'
                      : 'bg-[#1a1410] border-[#3e2e23] text-[#d7c9b8] hover:bg-[#261d17]'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <div>
                      <h4 className="font-bold text-base text-[#fef08a]">
                        {creature.name}
                      </h4>
                      {creature.latinName && (
                        <p className="text-[11px] text-[#a89988] italic">
                          {creature.latinName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavoriteCreature(creature.id);
                        }}
                        title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        className={`p-1.5 rounded-full transition-transform hover:scale-110 ${
                          isFav
                            ? 'text-rose-400 bg-rose-950/80 border border-rose-700/60 shadow-sm'
                            : 'text-[#9c8978] hover:text-rose-400 hover:bg-[#2b221b]'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#451a03] text-[#fcd34d] border border-[#b45309]/50 whitespace-nowrap">
                        FP {creature.challengeRating}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 my-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#241c16] text-[#cbd5e1] border border-[#524136]">
                      {creature.category}
                    </span>
                    {creature.environment.map(env => (
                      <span key={env} className="text-[10px] px-2 py-0.5 rounded bg-[#1f2937] text-[#93c5fd] border border-[#374151]">
                        {BIOMES_METADATA[env]?.label.split(' ')[0] || env}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-[#a89988] line-clamp-2 leading-relaxed">
                    {creature.description}
                  </p>

                  <div className="mt-2 pt-2 border-t border-[#3e2e23] flex justify-between items-center text-[11px] text-[#eab308]">
                    <span>{creature.components.length} composant(s) récoltable(s)</span>
                    <span className="text-[#a89988]">Consulter la fiche →</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Creature Detailed Sheet & Dissection Lab */}
        <div className="lg:col-span-7">
          {selectedCreature ? (
            <div className="bg-[#1c1612] rounded-xl border-2 border-[#5c4033] p-6 text-[#f4ecd8] font-serif shadow-2xl space-y-6">
              {/* Header Dossier */}
              <div className="border-b border-[#4d3a2e] pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#d97706]/40 uppercase tracking-widest">
                      Fiche Anatomique #{selectedCreature.id}
                    </span>
                    <h3 className="text-2xl font-bold text-[#d4af37] mt-1">
                      {selectedCreature.name}
                    </h3>
                    {selectedCreature.latinName && (
                      <p className="text-xs text-[#a89988] italic">
                        {selectedCreature.latinName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleFavoriteCreature(selectedCreature.id)}
                      title={favoriteCreatureIds.includes(selectedCreature.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      className={`p-2 rounded-lg border transition flex items-center gap-1.5 text-xs ${
                        favoriteCreatureIds.includes(selectedCreature.id)
                          ? 'bg-rose-950 text-rose-300 border-rose-600 shadow-sm'
                          : 'bg-[#241a12] text-[#d7c9b8] hover:text-rose-400 border-[#524136]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favoriteCreatureIds.includes(selectedCreature.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span className="hidden sm:inline font-bold">
                        {favoriteCreatureIds.includes(selectedCreature.id) ? 'Favori' : 'Ajouter aux favoris'}
                      </span>
                    </button>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#fde047] block font-mono">
                        Facteur de Puissance : FP {selectedCreature.challengeRating}
                      </span>
                      <span className="text-[11px] text-[#cbd5e1]">
                        Type : {selectedCreature.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedCreature.environment.map(b => (
                    <span key={b} className="text-xs px-2.5 py-1 rounded bg-[#2a1d15] text-[#fcd34d] border border-[#78350f]">
                      Biotope : {BIOMES_METADATA[b]?.label || b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Anatomy and description */}
              <div className="space-y-2 text-xs leading-relaxed text-[#d7c9b8]">
                <h4 className="font-bold text-[#fde047] uppercase tracking-wider text-[11px]">
                  Description & Physiologie :
                </h4>
                <p>{selectedCreature.description}</p>
                <p className="italic text-[#a89988]">{selectedCreature.tacticsAndLore}</p>
              </div>

              {/* Harvest Risks Notice */}
              {selectedCreature.harvestRisks && (
                <div className="p-3 rounded-lg bg-[#3b1212] border border-[#dc2626] text-xs text-[#fca5a5] flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0 text-[#ef4444]" />
                  <div>
                    <strong className="block text-[#fecaca] mb-0.5">Dangers & Risques de Dépeçage :</strong>
                    <span>{selectedCreature.harvestRisks}</span>
                  </div>
                </div>
              )}

              {/* Harvestable Components Section */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#4d3a2e] pb-2">
                  <h4 className="font-bold text-[#d4af37] uppercase tracking-wider text-sm flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#fde047]" />
                    Composants Récoltables & Applications Alchimiques ({selectedCreature.components.length})
                  </h4>

                  {/* Dice Mode Toggle */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-[#120e0b] p-0.5 rounded border border-[#3e2e23]">
                      <button
                        type="button"
                        onClick={() => setHarvestDiceMode('virtual')}
                        className={`px-2 py-0.5 rounded text-[10px] transition ${
                          harvestDiceMode === 'virtual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                        }`}
                      >
                        Dé Virtuel
                      </button>
                      <button
                        type="button"
                        onClick={() => setHarvestDiceMode('manual')}
                        className={`px-2 py-0.5 rounded text-[10px] transition ${
                          harvestDiceMode === 'manual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                        }`}
                      >
                        Jet Manuel
                      </button>
                    </div>

                    {harvestDiceMode === 'manual' && (
                      <div className="flex items-center gap-1 text-[11px] text-[#cbd5e1]">
                        <span>Mon d20 :</span>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={manualHarvestD20}
                          onChange={(e) => setManualHarvestD20(parseInt(e.target.value) || 1)}
                          className="w-12 bg-[#120e0b] border border-[#d4af37] rounded px-1.5 py-0.5 text-center font-mono font-bold text-[#fde047]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedCreature.components.map((comp) => {
                    const isHarvesting = activeHarvestComponent?.id === comp.id;
                    return (
                      <div
                        key={comp.id}
                        className={`p-4 rounded-xl border transition ${
                          isHarvesting
                            ? 'bg-[#2f1f15] border-[#fde047] ring-1 ring-[#fde047]'
                            : 'bg-[#181310] border-[#3e2e23]'
                        }`}
                      >
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-sm text-[#fef08a]">
                                {comp.name}
                              </h5>
                              {getComponentTypeBadge(comp.type)}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-[#a89988] mt-0.5">
                              <span>DD de Récolte : <strong>DD {comp.harvestDC} ({comp.harvestSkill})</strong></span>
                              <span>•</span>
                              <span>Temps : {comp.harvestTime}</span>
                              <span>•</span>
                              <span className="text-[#fcd34d]">Valeur : {comp.marketValue}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleHarvestAttempt(comp, harvestDiceMode === 'manual' ? manualHarvestD20 : undefined)}
                            className="px-3 py-1.5 rounded bg-[#b45309] hover:bg-[#d97706] text-white font-bold text-xs shadow flex items-center gap-1.5 transition"
                          >
                            <Dices className="w-3.5 h-3.5 text-[#fde047]" />
                            <span>
                              {harvestDiceMode === 'manual' ? `Valider Jet (${manualHarvestD20})` : 'Tenter la Récolte'}
                            </span>
                          </button>
                        </div>

                        {/* Alchemical Properties */}
                        <div className="space-y-1.5 text-xs mt-3 pt-2 border-t border-[#2e2119]">
                          <div>
                            <strong className="text-[#cbd5e1]">Propriétés Alchimiques : </strong>
                            <span className="text-[#d7c9b8]">{comp.alchemicalProperties}</span>
                          </div>

                          <div className="bg-[#241a12] p-2 rounded border border-[#524136]">
                            <strong className="text-[#fde047] flex items-center gap-1.5 mb-0.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#fde047]" />
                              Synergie avec l'Herboristerie :
                            </strong>
                            <span className="text-[#d7c9b8] italic">
                              {comp.synergyWithHerbs}
                            </span>
                          </div>

                          {comp.hazardOnFail && (
                            <div className="text-[11px] text-[#f87171] mt-1">
                              <strong>Échec Critique : </strong> {comp.hazardOnFail}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Harvesting Dice Simulation Result Banner */}
              {harvestRollResult && activeHarvestComponent && (
                <div className="p-4 rounded-xl border-2 border-[#fde047] bg-[#2d1b11] shadow-xl animate-fade-in space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#fde047] text-[#1c140d] font-mono font-extrabold flex items-center justify-center text-xs shadow">
                        {harvestRollResult.roll}
                      </span>
                      <h5 className="font-bold text-sm text-[#fef08a]">
                        Jet de Récolte : {activeHarvestComponent.name}
                      </h5>
                    </div>
                    {harvestRollResult.success ? (
                      <span className="flex items-center gap-1 text-xs text-green-400 font-bold">
                        <CheckCircle className="w-4 h-4" />
                        {harvestRollResult.critSuccess ? 'Réussite Critique Magique !' : 'Prélèvement Réussi !'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-400 font-bold">
                        <XCircle className="w-4 h-4" />
                        {harvestRollResult.critFail ? 'Échec Critique : Incident Toxique !' : 'Composant Détruit'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#d7c9b8]">
                    Jet d20 (<strong>{harvestRollResult.roll}</strong>) + bonus d'herboriste (<strong>{harvesterBonus}</strong>) ={' '}
                    <strong>{harvestRollResult.total}</strong> contre DD <strong>{activeHarvestComponent.harvestDC}</strong>.
                  </p>

                  <p className="text-[11px] italic text-[#fcd34d]">
                    {harvestRollResult.success
                      ? `Vous extrayez délicatement 1 dose de ${activeHarvestComponent.name}. Elle est conditionnée et prête pour l'alchimie.`
                      : harvestRollResult.critFail && activeHarvestComponent.hazardOnFail
                      ? `L'incision a dérapé ! ${activeHarvestComponent.hazardOnFail}`
                      : 'Les glandes ou tissus ont été déchirés au couteau et ont perdu tout principe actif.'}
                  </p>

                  {/* Bonus Adjuster */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#4d3a2e] text-[11px] text-[#a89988]">
                    <span>Modifier votre bonus de compétence ({activeHarvestComponent.harvestSkill}) :</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setHarvesterBonus(b => Math.max(0, b - 1))}
                        className="px-2 py-0.5 rounded bg-[#181310] hover:bg-[#2c2018] border border-[#524136]"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-[#fde047] w-6 text-center">
                        +{harvesterBonus}
                      </span>
                      <button
                        onClick={() => setHarvesterBonus(b => b + 1)}
                        className="px-2 py-0.5 rounded bg-[#181310] hover:bg-[#2c2018] border border-[#524136]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#1c1612] rounded-xl border border-[#4d3a2e] text-sm text-[#a89988] font-serif">
              Sélectionnez une créature dans la colonne de gauche pour consulter son anatomie et ses composants.
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL: ADD CUSTOM CREATURE ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#1c140d] border-2 border-[#854d0e] rounded-xl max-w-2xl w-full p-6 text-[#f4ecd8] font-serif shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#4d3a2e] pb-3">
              <h3 className="text-xl font-bold text-[#d4af37] flex items-center gap-2">
                <Skull className="w-5 h-5 text-[#dc2626]" />
                Ajouter une Créature au Bestiaire
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCreature} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89988] mb-1 font-bold">Nom de la Créature *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Chimère des Gorgones"
                    value={newCreatureName}
                    onChange={(e) => setNewCreatureName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#120e0b] border border-[#524136] rounded text-[#fef08a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#a89988] mb-1 font-bold">Catégorie *</label>
                  <select
                    value={newCreatureCategory}
                    onChange={(e) => setNewCreatureCategory(e.target.value as CreatureCategory)}
                    className="w-full px-3 py-2 bg-[#120e0b] border border-[#524136] rounded text-[#fef08a] focus:outline-none"
                  >
                    <option value="Monstruosité">Monstruosité</option>
                    <option value="Plante Monstrueuse">Plante Monstrueuse</option>
                    <option value="Dragon">Dragon</option>
                    <option value="Fée">Fée</option>
                    <option value="Bête Géante">Bête Géante</option>
                    <option value="Mort-Vivant">Mort-Vivant</option>
                    <option value="Aberration">Aberration</option>
                    <option value="Fiélon">Fiélon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89988] mb-1 font-bold">Facteur de Puissance (FP)</label>
                  <input
                    type="text"
                    placeholder="Ex: 4"
                    value={newCreatureCR}
                    onChange={(e) => setNewCreatureCR(e.target.value)}
                    className="w-full px-3 py-2 bg-[#120e0b] border border-[#524136] rounded text-[#fef08a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#a89988] mb-1 font-bold">Biotope Primaire</label>
                  <select
                    value={newCreatureBiomes[0]}
                    onChange={(e) => setNewCreatureBiomes([e.target.value as BiomeType])}
                    className="w-full px-3 py-2 bg-[#120e0b] border border-[#524136] rounded text-[#fef08a] focus:outline-none"
                  >
                    {Object.entries(BIOMES_METADATA).map(([key, meta]) => (
                      <option key={key} value={key}>{meta.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#a89988] mb-1 font-bold">Description & Mœurs</label>
                <textarea
                  rows={2}
                  placeholder="Aspect physique, taille, comportement..."
                  value={newCreatureDesc}
                  onChange={(e) => setNewCreatureDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#120e0b] border border-[#524136] rounded text-[#fef08a] focus:outline-none"
                />
              </div>

              <div className="border-t border-[#4d3a2e] pt-3">
                <h4 className="font-bold text-[#fde047] mb-2 uppercase text-[11px]">
                  Premier Composant Récoltable
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                  <div>
                    <label className="block text-[#a89988] mb-1">Nom du composant</label>
                    <input
                      type="text"
                      placeholder="Ex: Glande de venin caustique"
                      value={newCompName}
                      onChange={(e) => setNewCompName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#120e0b] border border-[#524136] rounded text-[#fef08a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#a89988] mb-1">Type d'organe</label>
                    <select
                      value={newCompType}
                      onChange={(e) => setNewCompType(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-[#120e0b] border border-[#524136] rounded text-[#fef08a]"
                    >
                      <option value="Venin & Glande">Venin & Glande</option>
                      <option value="Organe & Cœur">Organe & Cœur</option>
                      <option value="Sang & Fluide">Sang & Fluide</option>
                      <option value="Écailles & Cuir">Écailles & Cuir</option>
                      <option value="Os & Crocs">Os & Crocs</option>
                      <option value="Spores & Sève">Spores & Sève</option>
                      <option value="Essence Magique">Essence Magique</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#a89988] mb-1">DD de récolte</label>
                    <input
                      type="number"
                      value={newCompDC}
                      onChange={(e) => setNewCompDC(parseInt(e.target.value) || 12)}
                      className="w-full px-2 py-1.5 bg-[#120e0b] border border-[#524136] rounded text-[#fef08a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-[#a89988] mb-1">Propriété alchimique</label>
                    <input
                      type="text"
                      placeholder="Ex: Poison de blessure violent"
                      value={newCompAlchemy}
                      onChange={(e) => setNewCompAlchemy(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#120e0b] border border-[#524136] rounded text-[#fef08a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#a89988] mb-1">Synergie Herboristerie</label>
                    <input
                      type="text"
                      placeholder="Ex: Combiné avec Belladone..."
                      value={newCompSynergy}
                      onChange={(e) => setNewCompSynergy(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#120e0b] border border-[#524136] rounded text-[#fef08a]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#4d3a2e]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#2c2018] text-[#d7c9b8] hover:bg-[#382b22]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#b45309] hover:bg-[#d97706] text-white font-bold"
                >
                  Enregistrer la Créature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
