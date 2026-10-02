import React, { useState } from 'react';
import { Plant, BiomeType, RarityType } from '../types/herb';
import { BIOMES_METADATA, RARITY_METADATA } from '../data/herbalistData';
import { BotanicalIllustration } from './BotanicalIllustration';
import { Search, Filter, Sparkles, AlertTriangle, Coins, Eye, PlusCircle, Heart } from 'lucide-react';

interface HerbierExplorerProps {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  onOpenAddModal: () => void;
  favoritePlantIds: string[];
  onToggleFavoritePlant: (id: string) => void;
}

export const HerbierExplorer: React.FC<HerbierExplorerProps> = ({
  plants,
  onSelectPlant,
  onOpenAddModal,
  favoritePlantIds,
  onToggleFavoritePlant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBiome, setSelectedBiome] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'dc' | 'rarity'>('name');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.gameEffects.some(e => e.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBiome = selectedBiome === 'all' || plant.biome === selectedBiome;
    const matchesRarity = selectedRarity === 'all' || plant.rarity === selectedRarity;
    const matchesFav = !showFavoritesOnly || favoritePlantIds.includes(plant.id);

    return matchesSearch && matchesBiome && matchesRarity && matchesFav;
  });

  const sortedPlants = [...filteredPlants].sort((a, b) => {
    if (sortBy === 'dc') return a.dcHarvest - b.dcHarvest;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rarity') {
      const order: Record<RarityType, number> = {
        commune: 1,
        peu_commune: 2,
        rare: 3,
        tres_rare: 4,
        legendaire: 5,
      };
      return (order[b.rarity] || 0) - (order[a.rarity] || 0);
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#d4af37] drop-shadow">
            Herbier Général des Terres Sauvages
          </h2>
          <p className="text-sm text-[#c4b5a5] italic font-serif">
            Répertoire illustré des herbes et fongus magiques, classés selon leur biotope et rareté
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#78350f] text-[#fef08a] hover:bg-[#8e3f13] border border-[#d97706]/40 font-serif font-bold text-xs rounded shadow transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#fde047]" />
          <span>Créer une Plante Personnalisée</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#241c16] border border-[#4d3a2e] rounded-xl p-4 sm:p-5 mb-8 shadow-lg text-sm text-[#e6d8c3]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search text input */}
          <div className="relative">
            <label className="block text-xs font-serif uppercase tracking-wider text-[#a89988] mb-1">
              Rechercher une plante
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Athelas, poison, vision..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181310] border border-[#59473b] rounded-md pl-9 pr-3 py-2 text-sm text-[#f5ecd7] placeholder-[#7a6b5c] focus:outline-none focus:border-[#d4af37]"
              />
              <Search className="w-4 h-4 text-[#a89988] absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Biome filter */}
          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-[#a89988] mb-1">
              Biotope / Milieu Naturel
            </label>
            <select
              value={selectedBiome}
              onChange={(e) => setSelectedBiome(e.target.value)}
              className="w-full bg-[#181310] border border-[#59473b] rounded-md px-3 py-2 text-sm text-[#f5ecd7] focus:outline-none focus:border-[#d4af37]"
            >
              <option value="all">Tous les biotopes</option>
              {Object.entries(BIOMES_METADATA).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rarity filter */}
          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-[#a89988] mb-1">
              Degré de Rareté
            </label>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="w-full bg-[#181310] border border-[#59473b] rounded-md px-3 py-2 text-sm text-[#f5ecd7] focus:outline-none focus:border-[#d4af37]"
            >
              <option value="all">Toutes les raretés</option>
              {Object.entries(RARITY_METADATA).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort order */}
          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-[#a89988] mb-1">
              Trier par
            </label>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#181310] border border-[#59473b] rounded-md px-3 py-2 text-sm text-[#f5ecd7] focus:outline-none focus:border-[#d4af37]"
              >
                <option value="name">Nom alphabétique (A-Z)</option>
                <option value="dc">Difficulté de récolte (DD)</option>
                <option value="rarity">Rareté décroissante</option>
              </select>
            </div>
          </div>
        </div>

        {/* Counter of active filters */}
        <div className="mt-3 pt-3 border-t border-[#3d2f25] flex flex-wrap justify-between items-center gap-2 text-xs text-[#a89988]">
          <div className="flex items-center gap-3">
            <span>
              Affichage de <strong className="text-[#fde047]">{sortedPlants.length}</strong> plante(s) trouvée(s)
            </span>
            <button
              onClick={() => setShowFavoritesOnly(prev => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-serif transition border ${
                showFavoritesOnly
                  ? 'bg-rose-950 text-rose-300 border-rose-600 font-bold shadow'
                  : 'bg-[#181310] text-[#d7c9b8] hover:bg-[#2c2018] border-[#524136]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
              <span>Favoris ({favoritePlantIds.length})</span>
            </button>
          </div>

          {(selectedBiome !== 'all' || selectedRarity !== 'all' || searchQuery || showFavoritesOnly) && (
            <button
              onClick={() => {
                setSelectedBiome('all');
                setSelectedRarity('all');
                setSearchQuery('');
                setShowFavoritesOnly(false);
              }}
              className="text-[#d4af37] hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Plants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPlants.map((plant) => {
          const biomeInfo = BIOMES_METADATA[plant.biome];
          const rarityInfo = RARITY_METADATA[plant.rarity];
          const isFav = favoritePlantIds.includes(plant.id);

          return (
            <div
              key={plant.id}
              onClick={() => onSelectPlant(plant)}
              className="bg-[#faf6ee] rounded-xl border-2 border-[#c4a47c] p-4 text-[#2c1810] shadow-md hover:shadow-xl hover:border-[#854d0e] transition flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-[#e2d5c3] pb-2 mb-3">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#3a1b0e] group-hover:text-[#854d0e] transition">
                      {plant.name}
                    </h3>
                    <div className="text-xs font-serif italic text-[#78350f]">
                      {plant.latinName}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Favorite Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavoritePlant(plant.id);
                      }}
                      title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      className={`p-1.5 rounded-full transition-transform hover:scale-110 ${
                        isFav
                          ? 'bg-rose-100 text-rose-600 shadow-sm'
                          : 'text-[#9c8978] hover:text-rose-600 hover:bg-rose-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
                    </button>

                    <span
                      className="text-[10px] font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                      style={{
                        color: rarityInfo.color,
                        borderColor: rarityInfo.border,
                        backgroundColor: rarityInfo.bg,
                      }}
                    >
                      {rarityInfo.label}
                    </span>
                  </div>
                </div>

                {/* Botanical Plate & Quick Metadata */}
                <div className="flex gap-3 mb-3">
                  <div className="w-28 shrink-0">
                    <BotanicalIllustration
                      plant={plant}
                      size="sm"
                      showPlateDetails={false}
                      className="w-full h-28"
                    />
                  </div>
                  <div className="text-xs font-serif space-y-1 w-full text-[#3a261c]">
                    <div className="flex justify-between border-b border-[#ecd9c2] pb-0.5">
                      <span className="text-[#78350f] font-semibold">Habitat :</span>
                      <span className="text-right truncate max-w-[100px]">{biomeInfo.label}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#ecd9c2] pb-0.5">
                      <span className="text-[#78350f] font-semibold">DD Récolte :</span>
                      <span className="font-mono font-bold text-[#b45309]">DD {plant.dcHarvest}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#ecd9c2] pb-0.5">
                      <span className="text-[#78350f] font-semibold">Saison :</span>
                      <span className="text-right truncate max-w-[100px]">{plant.season}</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-[#78350f] font-semibold">Valeur :</span>
                      <span className="font-bold text-[#854d0e]">{plant.value}</span>
                    </div>
                  </div>
                </div>

                {/* Short Excerpt */}
                <p className="text-xs font-serif text-[#4a362b] line-clamp-2 mb-3">
                  {plant.description}
                </p>

                {/* Primary Game Effect Highlight */}
                <div className="bg-[#f0e7d3] p-2 rounded border border-[#dfd0bc] mb-2">
                  <div className="text-[11px] font-serif font-bold text-[#78350f] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#b45309]" />
                    {plant.gameEffects[0]?.title}
                  </div>
                  <p className="text-[11px] font-serif text-[#331c12] line-clamp-2 mt-0.5">
                    {plant.gameEffects[0]?.description}
                  </p>
                </div>

                {plant.toxicityWarning && (
                  <div className="flex items-center gap-1 text-[10px] text-[#991b1b] font-serif font-bold">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span className="truncate">Toxique / Avertissement</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-2 border-t border-[#e2d5c3] flex items-center justify-between text-xs font-serif">
                <span className="text-[#78350f] italic">Cliquer pour examiner</span>
                <span className="flex items-center gap-1 font-bold text-[#854d0e] group-hover:translate-x-1 transition-transform">
                  <Eye className="w-3.5 h-3.5" />
                  Voir la fiche
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {sortedPlants.length === 0 && (
        <div className="bg-[#2b211a] border border-[#524136] rounded-xl p-12 text-center text-[#c4b5a5] max-w-lg mx-auto">
          <p className="font-serif text-lg text-[#fef08a] mb-2">Aucune herbe trouvée</p>
          <p className="text-xs font-serif mb-4">
            Aucun spécimen ne correspond aux critères de recherche actuels. Essayez de réinitialiser vos filtres.
          </p>
          <button
            onClick={() => {
              setSelectedBiome('all');
              setSelectedRarity('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#78350f] text-white font-serif rounded text-xs hover:bg-[#8e3f13]"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};
