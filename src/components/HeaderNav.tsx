import React from 'react';
import { BookOpen, Search, FlaskConical, Compass, Printer, PlusCircle, Feather, Sparkles, Skull, Sun, Moon, Pickaxe, BookMarked, Hammer } from 'lucide-react';
import { Plant, Creature } from '../types/herb';
import { GlobalSearchBar } from './GlobalSearchBar';

export type ActiveTab = 'grimoire' | 'herbier' | 'alchimie' | 'poisons' | 'cueillette' | 'guide_recolteur' | 'bestiaire' | 'mineraux' | 'forge' | 'lapidaire' | 'pdf_export';

interface HeaderNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  plantCount: number;
  theme: 'sombre' | 'parchemin';
  onToggleTheme: () => void;
  plants: Plant[];
  creatures: Creature[];
  onSelectPlant: (plant: Plant) => void;
  onSelectCreature: (creature: Creature) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  plantCount,
  theme,
  onToggleTheme,
  plants,
  creatures,
  onSelectPlant,
  onSelectCreature,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#1f1915]/95 backdrop-blur-md border-b border-[#4a3b32] text-[#f4ecd8] shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('grimoire')}>
          <div className="w-10 h-10 rounded-md bg-[#3b281c] border border-[#d4af37]/60 flex items-center justify-center shadow-inner text-[#d4af37]">
            <Feather className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif tracking-wider text-[#d4af37] font-bold drop-shadow">
                Guide de l'Herboriste
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#d97706]/50 uppercase tracking-widest font-mono">
                D&D 5e / JDR
              </span>
            </div>
            <p className="text-xs text-[#c4b5a5] italic font-serif">
              Flore médicinale, magique & vénéneuse · {plantCount} espèces répertoriées
            </p>
          </div>
        </div>

        {/* Global Search Bar (Plantes, Gemmes, Créatures, Minéraux) */}
        <GlobalSearchBar
          plants={plants}
          creatures={creatures}
          onSelectPlant={onSelectPlant}
          onSelectCreature={(creature) => {
            setActiveTab('bestiaire');
            onSelectCreature(creature);
          }}
          onSelectGem={() => {
            setActiveTab('lapidaire');
          }}
          onSelectMineral={() => {
            setActiveTab('mineraux');
          }}
        />

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('grimoire')}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-serif transition-colors ${
              activeTab === 'grimoire'
                ? 'bg-[#3d2719] text-[#fef3c7] border border-[#d4af37]/60 shadow'
                : 'text-[#d7c9b8] hover:bg-[#2c2018] hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden sm:inline">Grimoire Complet</span>
            <span className="sm:hidden">Livre</span>
          </button>

          <button
            onClick={() => setActiveTab('herbier')}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-serif transition-colors ${
              activeTab === 'herbier'
                ? 'bg-[#3d2719] text-[#fef3c7] border border-[#d4af37]/60 shadow'
                : 'text-[#d7c9b8] hover:bg-[#2c2018] hover:text-white'
            }`}
          >
            <Search className="w-4 h-4 text-[#38bdf8]" />
            <span>Herbier & Index</span>
          </button>

          <button
            onClick={() => setActiveTab('alchimie')}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-serif transition-colors ${
              activeTab === 'alchimie'
                ? 'bg-[#3d2719] text-[#fef3c7] border border-[#d4af37]/60 shadow'
                : 'text-[#d7c9b8] hover:bg-[#2c2018] hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-[#a855f7]" />
            <span className="hidden sm:inline">Atelier Alchimie</span>
            <span className="sm:hidden">Alchimie</span>
          </button>

          <button
            onClick={() => setActiveTab('poisons')}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-serif transition-colors ${
              activeTab === 'poisons'
                ? 'bg-[#3d1818] text-[#fecaca] border border-[#ef4444]/60 shadow'
                : 'text-[#d7c9b8] hover:bg-[#2c2018] hover:text-white'
            }`}
          >
            <Skull className="w-4 h-4 text-[#ef4444]" />
            <span className="hidden sm:inline">Poisons & Antidotes</span>
            <span className="sm:hidden">Poisons</span>
          </button>

          <button
            onClick={() => setActiveTab('cueillette')}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-serif transition-colors ${
              activeTab === 'cueillette'
                ? 'bg-[#3d2719] text-[#fef3c7] border border-[#d4af37]/60 shadow'
                : 'text-[#d7c9b8] hover:bg-[#2c2018] hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 text-[#4ade80]" />
            <span className="hidden sm:inline">Simulateur Cueillette</span>
            <span className="sm:hidden">Cueillette</span>
          </button>

          <button
            onClick={() => setActiveTab('guide_recolteur')}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-serif transition-colors ${
              activeTab === 'guide_recolteur'
                ? 'bg-[#3d2719] text-[#fef3c7] border border-[#d4af37]/60 shadow'
                : 'text-[#d7c9b8] hover:bg-[#2c2018] hover:text-white'
            }`}
          >
            <BookMarked className="w-4 h-4 text-[#eab308]" />
            <span className="hidden sm:inline">Guide du Récolteur (DD)</span>
            <span className="sm:hidden">Guide DD</span>
          </button>

          <button
            onClick={() => setActiveTab('bestiaire')}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-serif transition-colors ${
              activeTab === 'bestiaire'
                ? 'bg-[#3d2719] text-[#fef3c7] border border-[#d4af37]/60 shadow'
                : 'text-[#d7c9b8] hover:bg-[#2c2018] hover:text-white'
            }`}
          >
            <Skull className="w-4 h-4 text-[#ef4444]" />
            <span className="hidden sm:inline">Bestiaire & Dépeçage</span>
            <span className="sm:hidden">Bestiaire</span>
          </button>

          <button
            onClick={() => setActiveTab('mineraux')}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-serif transition-colors ${
              activeTab === 'mineraux'
                ? 'bg-[#3d2719] text-[#fef3c7] border border-[#d4af37]/60 shadow'
                : 'text-[#d7c9b8] hover:bg-[#2c2018] hover:text-white'
            }`}
          >
            <Pickaxe className="w-4 h-4 text-[#f59e0b]" />
            <span className="hidden sm:inline">Minéraux & Métaux (16)</span>
            <span className="sm:hidden">Minéraux</span>
          </button>

          <button
            onClick={() => setActiveTab('forge')}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-serif transition-colors ${
              activeTab === 'forge'
                ? 'bg-[#3d2719] text-[#fef3c7] border border-[#d4af37]/60 shadow'
                : 'text-[#d7c9b8] hover:bg-[#2c2018] hover:text-white'
            }`}
          >
            <Hammer className="w-4 h-4 text-[#f97316]" />
            <span className="hidden sm:inline">Forge & Armurerie</span>
            <span className="sm:hidden">Forge</span>
          </button>

          <button
            onClick={() => setActiveTab('lapidaire')}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-serif transition-colors ${
              activeTab === 'lapidaire'
                ? 'bg-[#3d2719] text-[#fef3c7] border border-[#d4af37]/60 shadow'
                : 'text-[#d7c9b8] hover:bg-[#2c2018] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#fde047]" />
            <span className="hidden sm:inline">Gemmes & Joaillerie (20)</span>
            <span className="sm:hidden">Gemmes</span>
          </button>

          <button
            onClick={() => setActiveTab('pdf_export')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded text-sm font-serif font-bold transition-all shadow-md ${
              activeTab === 'pdf_export'
                ? 'bg-[#b45309] text-white ring-2 ring-[#fde047]'
                : 'bg-[#78350f] text-[#fef08a] hover:bg-[#92400e] border border-[#f59e0b]/50'
            }`}
          >
            <Printer className="w-4 h-4 text-[#fde047]" />
            <span>Exporter en PDF</span>
          </button>

          {/* Theme Toggle: Grimoire Sombre <-> Thème Parchemin */}
          <button
            onClick={onToggleTheme}
            title={theme === 'sombre' ? 'Passer en Thème Parchemin (Lecture claire de jour)' : 'Passer en Thème Grimoire Sombre'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-serif transition-colors border shadow-sm ${
              theme === 'sombre'
                ? 'bg-[#2b221b] text-[#fcd34d] hover:bg-[#3d2f25] border-[#78350f]'
                : 'bg-[#faf0dc] text-[#78350f] hover:bg-[#f0dfc2] border-[#b45309] font-bold'
            }`}
          >
            {theme === 'sombre' ? (
              <>
                <Sun className="w-4 h-4 text-[#fde047]" />
                <span className="hidden md:inline">Parchemin</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#78350f]" />
                <span className="hidden md:inline">Grimoire Sombre</span>
              </>
            )}
          </button>

          {/* Quick add custom plant */}
          <button
            onClick={onOpenAddModal}
            title="Ajouter une herbe personnalisée au grimoire"
            className="p-2 rounded bg-[#2b221b] text-[#cbd5e1] hover:text-[#fde047] hover:bg-[#382b22] border border-[#524136] transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  );
};
