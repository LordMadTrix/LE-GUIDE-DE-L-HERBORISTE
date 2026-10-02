/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Plant, AlchemicalRecipe } from './types/herb';
import { INITIAL_PLANTS, ALCHEMY_RECIPES } from './data/herbalistData';
import { HeaderNav, ActiveTab } from './components/HeaderNav';
import { GrimoireBookView } from './components/GrimoireBookView';
import { HerbierExplorer } from './components/HerbierExplorer';
import { AlchemicalWorkshop } from './components/AlchemicalWorkshop';
import { GatheringSimulator } from './components/GatheringSimulator';
import { PdfExportView } from './components/PdfExportView';
import { LapidaireView } from './components/LapidaireView';
import { BestiaryView } from './components/BestiaryView';
import { MineralExplorerView } from './components/MineralExplorerView';
import { HarvesterGuideView } from './components/HarvesterGuideView';
import { ForgeWorkshopView } from './components/ForgeWorkshopView';
import { PoisonsCompendiumView } from './components/PoisonsCompendiumView';
import { INITIAL_CREATURES } from './data/bestiaryData';
import { Creature } from './types/herb';
import { PlantDetailModal } from './components/PlantDetailModal';
import { AddCustomPlantModal } from './components/AddCustomPlantModal';
import { Feather, BookOpen, Compass, Printer, Heart } from 'lucide-react';

export default function App() {
  const [plants, setPlants] = useState<Plant[]>(() => {
    try {
      const saved = localStorage.getItem('dnd_herbalist_custom_plants');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep any user-created homebrew plants and merge with all 32 standard plants
          const customPlants = parsed.filter((p: Plant) => p.custom);
          return [...customPlants, ...INITIAL_PLANTS];
        }
      }
    } catch (e) {
      console.error('Error loading saved plants', e);
    }
    return INITIAL_PLANTS;
  });

  const [recipes] = useState<AlchemicalRecipe[]>(ALCHEMY_RECIPES);
  const [activeTab, setActiveTab] = useState<ActiveTab>('grimoire');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedCreatureId, setSelectedCreatureId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Theme state: 'sombre' (Grimoire sombre) | 'parchemin' (Thème Parchemin clair)
  const [theme, setTheme] = useState<'sombre' | 'parchemin'>(() => {
    try {
      const savedTheme = localStorage.getItem('dnd_herbalist_theme');
      if (savedTheme === 'parchemin' || savedTheme === 'sombre') {
        return savedTheme;
      }
    } catch (e) {
      console.error('Error loading saved theme', e);
    }
    return 'sombre';
  });

  const handleToggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'sombre' ? 'parchemin' : 'sombre';
      try {
        localStorage.setItem('dnd_herbalist_theme', next);
      } catch (e) {
        console.error('Error saving theme', e);
      }
      return next;
    });
  };

  // Favorites state: plants & creatures
  const [favoritePlantIds, setFavoritePlantIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dnd_herbalist_favorite_plants');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading favorite plants', e);
    }
    return ['athelas', 'lotus_dor', 'fleur_de_lune'];
  });

  const [favoriteCreatureIds, setFavoriteCreatureIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dnd_herbalist_favorite_creatures');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading favorite creatures', e);
    }
    return ['dragon_vert', 'loup_garou'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('dnd_herbalist_favorite_plants', JSON.stringify(favoritePlantIds));
    } catch (e) {
      console.error('Error saving favorite plants', e);
    }
  }, [favoritePlantIds]);

  useEffect(() => {
    try {
      localStorage.setItem('dnd_herbalist_favorite_creatures', JSON.stringify(favoriteCreatureIds));
    } catch (e) {
      console.error('Error saving favorite creatures', e);
    }
  }, [favoriteCreatureIds]);

  const handleToggleFavoritePlant = (id: string) => {
    setFavoritePlantIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleToggleFavoriteCreature = (id: string) => {
    setFavoriteCreatureIds(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  // Creatures Bestiary state
  const [creatures, setCreatures] = useState<Creature[]>(() => {
    try {
      const saved = localStorage.getItem('dnd_herbalist_custom_creatures');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customOnly = parsed.filter((c: Creature) => c.custom);
          return [...customOnly, ...INITIAL_CREATURES];
        }
      }
    } catch (e) {
      console.error('Error loading saved creatures', e);
    }
    return INITIAL_CREATURES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('dnd_herbalist_custom_creatures', JSON.stringify(creatures));
    } catch (e) {
      console.error('Error saving creatures', e);
    }
  }, [creatures]);

  const handleAddCreature = (newCreature: Creature) => {
    setCreatures((prev) => [newCreature, ...prev]);
  };

  // Save plants on custom additions
  useEffect(() => {
    try {
      localStorage.setItem('dnd_herbalist_custom_plants', JSON.stringify(plants));
    } catch (e) {
      console.error('Error saving plants', e);
    }
  }, [plants]);

  const handleAddPlant = (newPlant: Plant) => {
    setPlants((prev) => [newPlant, ...prev]);
  };

  return (
    <div
      className={`min-h-screen ${
        theme === 'parchemin'
          ? 'theme-parchemin bg-[#f7f1e5] text-[#2b1810]'
          : 'bg-[#140f0c] text-[#f4ecd8]'
      } flex flex-col selection:bg-[#854d0e] selection:text-white transition-colors duration-200`}
    >
      {/* Top Navigation with Global Search */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        plantCount={plants.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        plants={plants}
        creatures={creatures}
        onSelectPlant={(plant) => setSelectedPlant(plant)}
        onSelectCreature={(creature) => {
          setSelectedCreatureId(creature.id);
          setActiveTab('bestiaire');
        }}
      />

      {/* Main Tab View */}
      <main className="flex-1">
        {activeTab === 'grimoire' && (
          <GrimoireBookView
            plants={plants}
            recipes={recipes}
            onSelectPlant={(plant) => setSelectedPlant(plant)}
            onNavigateToPdf={() => setActiveTab('pdf_export')}
            onNavigateToAlchimie={() => setActiveTab('alchimie')}
          />
        )}

        {activeTab === 'herbier' && (
          <HerbierExplorer
            plants={plants}
            onSelectPlant={(plant) => setSelectedPlant(plant)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            favoritePlantIds={favoritePlantIds}
            onToggleFavoritePlant={handleToggleFavoritePlant}
          />
        )}

        {activeTab === 'alchimie' && (
          <AlchemicalWorkshop
            recipes={recipes}
            plants={plants}
            onSelectPlant={(plant) => setSelectedPlant(plant)}
            onNavigateToPoisons={() => setActiveTab('poisons')}
          />
        )}

        {activeTab === 'poisons' && (
          <PoisonsCompendiumView
            plants={plants}
            onSelectPlant={(plant) => setSelectedPlant(plant)}
            onNavigateToAlchemy={() => setActiveTab('alchimie')}
          />
        )}

        {activeTab === 'cueillette' && (
          <GatheringSimulator
            plants={plants}
            onSelectPlant={(plant) => setSelectedPlant(plant)}
            onNavigateToGuide={() => setActiveTab('guide_recolteur')}
          />
        )}

        {activeTab === 'guide_recolteur' && (
          <HarvesterGuideView
            plants={plants}
            onSelectPlant={(plant) => setSelectedPlant(plant)}
            onNavigateToSimulator={() => setActiveTab('cueillette')}
          />
        )}

        {activeTab === 'bestiaire' && (
          <BestiaryView
            creatures={creatures}
            onAddCreature={handleAddCreature}
            favoriteCreatureIds={favoriteCreatureIds}
            onToggleFavoriteCreature={handleToggleFavoriteCreature}
            selectedCreatureId={selectedCreatureId}
            onSelectCreature={(c) => setSelectedCreatureId(c.id)}
            onSelectHerbByName={(herbName) => {
              const found = plants.find(p => p.name.toLowerCase().includes(herbName.toLowerCase()));
              if (found) {
                setSelectedPlant(found);
              }
            }}
          />
        )}

        {activeTab === 'mineraux' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <MineralExplorerView onNavigateToForge={() => setActiveTab('forge')} />
          </div>
        )}

        {activeTab === 'forge' && (
          <ForgeWorkshopView
            creatures={creatures}
            onNavigateToMinerals={() => setActiveTab('mineraux')}
          />
        )}

        {activeTab === 'lapidaire' && (
          <LapidaireView />
        )}

        {activeTab === 'pdf_export' && (
          <PdfExportView
            plants={plants}
            recipes={recipes}
            creatures={creatures}
            favoritePlantIds={favoritePlantIds}
            favoriteCreatureIds={favoriteCreatureIds}
            onToggleFavoritePlant={handleToggleFavoritePlant}
          />
        )}
      </main>

      {/* Detail Inspection Modal */}
      <PlantDetailModal
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
        recipes={recipes}
        isFavorite={selectedPlant ? favoritePlantIds.includes(selectedPlant.id) : false}
        onToggleFavorite={handleToggleFavoritePlant}
      />

      {/* Add Custom Homebrew Plant Modal */}
      <AddCustomPlantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPlant={handleAddPlant}
      />

      {/* Subtle Ancient Fantasy Footer (Hidden in Print) */}
      <footer className="bg-[#100c0a] border-t border-[#36271e] py-6 px-4 text-center text-xs text-[#8a796b] font-serif no-print">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#d4af37]">
            <Feather className="w-4 h-4" />
            <span className="font-bold tracking-wider uppercase text-[11px]">
              Guide de l'Herboriste & Lapidaire de Fangh
            </span>
          </div>
          <p className="text-[#a89988]">
            Inspiré des traités d'herboristerie médiévaux-fantastiques et du supplément des Gemmes & Pierres Précieuses (Le Donjon de Naheulbeuk & D&D).
            Tous les profils de plantes, tables de gemmes en Goltors et règles de jeu sont prévus pour un usage fluide en séance.
          </p>
          <div className="flex justify-center items-center gap-4 pt-2 text-[11px] text-[#b3a191]">
            <button
              onClick={() => setActiveTab('grimoire')}
              className="hover:text-[#fde047] transition"
            >
              Mode Grimoire
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('herbier')}
              className="hover:text-[#fde047] transition"
            >
              Herbier ({plants.length} plantes)
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('lapidaire')}
              className="hover:text-[#fde047] transition"
            >
              Lapidaire (20 gemmes)
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('pdf_export')}
              className="text-[#f59e0b] font-bold hover:underline"
            >
              Exportation PDF A4
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
