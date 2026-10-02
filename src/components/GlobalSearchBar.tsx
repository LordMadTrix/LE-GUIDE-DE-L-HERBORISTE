import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Plant, Creature } from '../types/herb';
import { Gem } from '../types/gem';
import { Mineral } from '../types/mineral';
import { GEMS_LIST, GEM_CATEGORIES_META } from '../data/gemData';
import { MINERALS_LIST, MINERAL_CATEGORIES_META } from '../data/mineralData';
import { RARITY_METADATA, BIOMES_METADATA } from '../data/herbalistData';
import { Search, X, Sparkles, Skull, Leaf, ArrowRight, CornerDownLeft, Pickaxe } from 'lucide-react';

interface GlobalSearchBarProps {
  plants: Plant[];
  creatures: Creature[];
  onSelectPlant: (plant: Plant) => void;
  onSelectCreature: (creature: Creature) => void;
  onSelectGem: (gem: Gem) => void;
  onSelectMineral?: (mineral: Mineral) => void;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  plants,
  creatures,
  onSelectPlant,
  onSelectCreature,
  onSelectGem,
  onSelectMineral,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalize string for accent-insensitive search
  const normalize = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const cleanQuery = normalize(query.trim());

  // Search Results
  const results = useMemo(() => {
    if (!cleanQuery || cleanQuery.length < 1) {
      return { plants: [], gems: [], minerals: [], creatures: [], totalCount: 0 };
    }

    const matchedPlants = plants.filter((p) => {
      const name = normalize(p.name);
      const latin = normalize(p.latinName || '');
      const otherNames = (p.otherNames || []).some((o) => normalize(o).includes(cleanQuery));
      const biome = normalize(BIOMES_METADATA[p.biome]?.label || '');
      return name.includes(cleanQuery) || latin.includes(cleanQuery) || otherNames || biome.includes(cleanQuery);
    });

    const matchedGems = GEMS_LIST.filter((g) => {
      const name = normalize(g.name);
      const category = normalize(g.category);
      const affinity = normalize(g.magicalAffinity || '');
      return name.includes(cleanQuery) || category.includes(cleanQuery) || affinity.includes(cleanQuery);
    });

    const matchedMinerals = MINERALS_LIST.filter((m) => {
      const name = normalize(m.name);
      const latin = normalize(m.latinOrScientificName || '');
      const category = normalize(m.category);
      const forge = normalize(m.forgeUsages || '');
      return name.includes(cleanQuery) || latin.includes(cleanQuery) || category.includes(cleanQuery) || forge.includes(cleanQuery);
    });

    const matchedCreatures = creatures.filter((c) => {
      const name = normalize(c.name);
      const latin = normalize(c.latinName || '');
      const category = normalize(c.category);
      const components = c.components.some((comp) => normalize(comp.name).includes(cleanQuery));
      return name.includes(cleanQuery) || latin.includes(cleanQuery) || category.includes(cleanQuery) || components;
    });

    return {
      plants: matchedPlants,
      gems: matchedGems,
      minerals: matchedMinerals,
      creatures: matchedCreatures,
      totalCount: matchedPlants.length + matchedGems.length + matchedMinerals.length + matchedCreatures.length,
    };
  }, [cleanQuery, plants, creatures]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectPlantItem = (plant: Plant) => {
    onSelectPlant(plant);
    setIsOpen(false);
    setQuery('');
  };

  const handleSelectGemItem = (gem: Gem) => {
    onSelectGem(gem);
    setIsOpen(false);
    setQuery('');
  };

  const handleSelectMineralItem = (mineral: Mineral) => {
    if (onSelectMineral) {
      onSelectMineral(mineral);
    }
    setIsOpen(false);
    setQuery('');
  };

  const handleSelectCreatureItem = (creature: Creature) => {
    onSelectCreature(creature);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 absolute left-3 text-[#a89988] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Rechercher plante, gemme, créature..."
          className="w-full pl-9 pr-14 py-1.5 bg-[#120e0b] border border-[#524136] rounded-lg text-xs font-serif text-[#f4ecd8] placeholder-[#8c7866] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] shadow-inner transition"
        />

        {/* Clear or Shortcut badge */}
        <div className="absolute right-2 flex items-center gap-1">
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-[#a89988] hover:text-[#f4ecd8] rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#241c16] text-[#a89988] border border-[#3e2e23] pointer-events-none">
              ⌘K
            </span>
          )}
        </div>
      </div>

      {/* Floating Results Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#1a1410] border-2 border-[#854d0e] rounded-xl shadow-2xl z-50 overflow-hidden font-serif max-h-[480px] flex flex-col">
          {/* Header count */}
          <div className="px-3 py-2 bg-[#261d17] border-b border-[#3e2e23] flex justify-between items-center text-xs">
            <span className="text-[#a89988]">
              {results.totalCount > 0 ? (
                <>
                  <strong className="text-[#fde047]">{results.totalCount}</strong> résultat(s) pour « {query} »
                </>
              ) : (
                <>Aucun résultat pour « {query} »</>
              )}
            </span>
            <span className="text-[10px] text-[#786554] italic">Entrée ou clic pour ouvrir</span>
          </div>

          <div className="overflow-y-auto divide-y divide-[#2d2119] text-xs">
            {/* Section 1: Plantes */}
            {results.plants.length > 0 && (
              <div className="p-2 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4ade80] flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Plantes & Herbes ({results.plants.length})</span>
                </div>
                {results.plants.slice(0, 5).map((plant) => {
                  const rarityInfo = RARITY_METADATA[plant.rarity];
                  return (
                    <div
                      key={plant.id}
                      onClick={() => handleSelectPlantItem(plant)}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-[#2e2118] cursor-pointer flex items-center justify-between gap-2 group transition"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-[#fef08a] group-hover:text-[#fde047] truncate">
                          {plant.name}
                        </div>
                        <div className="text-[10px] text-[#a89988] truncate italic">
                          {plant.latinName} · {BIOMES_METADATA[plant.biome]?.label.split(' ')[0]}
                        </div>
                      </div>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded border whitespace-nowrap shrink-0"
                        style={{
                          color: rarityInfo?.color || '#d4af37',
                          borderColor: rarityInfo?.border || '#78350f',
                          backgroundColor: rarityInfo?.bg || 'transparent',
                        }}
                      >
                        {rarityInfo?.label || plant.rarity}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Section 2: Gemmes */}
            {results.gems.length > 0 && (
              <div className="p-2 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#38bdf8] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemmes de Fangh ({results.gems.length})</span>
                </div>
                {results.gems.slice(0, 4).map((gem) => {
                  const catMeta = GEM_CATEGORIES_META[gem.category];
                  return (
                    <div
                      key={gem.id}
                      onClick={() => handleSelectGemItem(gem)}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-[#2e2118] cursor-pointer flex items-center justify-between gap-2 group transition"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-[#bae6fd] group-hover:text-[#7dd3fc] truncate">
                          {gem.name}
                        </div>
                        <div className="text-[10px] text-[#a89988] truncate italic">
                          {catMeta?.label || gem.category} · {gem.weightGoltors} Goltor(s)
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#fde047] shrink-0 font-bold">
                        {gem.basePriceRaw} po
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Section 3: Minéraux & Métaux Rares */}
            {results.minerals.length > 0 && (
              <div className="p-2 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f59e0b] flex items-center gap-1.5">
                  <Pickaxe className="w-3.5 h-3.5" />
                  <span>Minéraux & Métaux Rares ({results.minerals.length})</span>
                </div>
                {results.minerals.slice(0, 4).map((mineral) => {
                  const catMeta = MINERAL_CATEGORIES_META[mineral.category];
                  return (
                    <div
                      key={mineral.id}
                      onClick={() => handleSelectMineralItem(mineral)}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-[#2e2118] cursor-pointer flex items-center justify-between gap-2 group transition"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-[#fef08a] group-hover:text-[#fde047] truncate">
                          {mineral.name}
                        </div>
                        <div className="text-[10px] text-[#a89988] truncate italic">
                          {catMeta?.label.split(' ')[0] || mineral.category} · DD Mine {mineral.dcProspect}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#fde047] shrink-0 font-bold">
                        {mineral.basePricePerLingot} po
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Section 4: Créatures */}
            {results.creatures.length > 0 && (
              <div className="p-2 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f87171] flex items-center gap-1.5">
                  <Skull className="w-3.5 h-3.5" />
                  <span>Bestiaire & Monstres ({results.creatures.length})</span>
                </div>
                {results.creatures.slice(0, 4).map((creature) => (
                  <div
                    key={creature.id}
                    onClick={() => handleSelectCreatureItem(creature)}
                    className="px-2.5 py-1.5 rounded-lg hover:bg-[#2e2118] cursor-pointer flex items-center justify-between gap-2 group transition"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-[#fecaca] group-hover:text-[#f87171] truncate">
                        {creature.name}
                      </div>
                      <div className="text-[10px] text-[#a89988] truncate italic">
                        {creature.category} · {creature.components.length} composant(s)
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#b45309]/50 shrink-0">
                      FP {creature.challengeRating}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {results.totalCount === 0 && (
              <div className="p-6 text-center text-xs text-[#a89988] italic space-y-1">
                <p>Aucune plante, gemme ou créature ne correspond à votre recherche.</p>
                <p className="text-[11px] text-[#786554]">
                  Vérifiez l'orthographe ou essayez un nom commun (ex: « lotus », « rubis », « dragon »).
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
