import React, { useState, useRef, useEffect } from 'react';
import { Plant, AlchemicalRecipe, Creature } from '../types/herb';
import { BIOMES_METADATA, RARITY_METADATA, FORAGING_RULES } from '../data/herbalistData';
import { GEMS_LIST, GOLTOR_RULES, GEM_CATEGORIES_META } from '../data/gemData';
import { BotanicalIllustration } from './BotanicalIllustration';
import { GemIllustration } from './GemIllustration';
import { 
  Printer, 
  Download, 
  BookOpen, 
  Sparkles, 
  AlertTriangle, 
  Shield, 
  Check, 
  Settings2, 
  FileText, 
  Scale, 
  Heart, 
  User, 
  Crosshair, 
  Sliders, 
  CheckCircle, 
  Compass, 
  Skull, 
  FlaskConical, 
  X
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PlayerProfile {
  name: string;
  role: string;
  survieBonus: number; // Sagesse (Survie) pour cueillette
  natureBonus: number; // Intelligence (Nature) pour identification
  toolBonus: number;   // Dextérité (Herboristerie / Alchimie / Dépeçage)
  tools: string;
}

interface PdfExportViewProps {
  plants: Plant[];
  recipes: AlchemicalRecipe[];
  creatures?: Creature[];
  favoritePlantIds?: string[];
  favoriteCreatureIds?: string[];
  onToggleFavoritePlant?: (id: string) => void;
}

export const PdfExportView: React.FC<PdfExportViewProps> = ({
  plants,
  recipes,
  creatures = [],
  favoritePlantIds = [],
  favoriteCreatureIds = [],
  onToggleFavoritePlant,
}) => {
  // Mode selection: 'pocket_booklet' (Livret de poche personnalisé) or 'full_grimoire' (Grand grimoire complet)
  const [exportMode, setExportMode] = useState<'pocket_booklet' | 'full_grimoire'>('pocket_booklet');

  // Player skill profile (persisted in localStorage)
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem('dnd_herbalist_player_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading player profile', e);
    }
    return {
      name: 'Eldrin Feuille-d\'Argent',
      role: 'Rôdeur Sylvestre (Niv. 4)',
      survieBonus: 5,
      natureBonus: 3,
      toolBonus: 4,
      tools: 'Trousse d\'Herboristerie, Matériel d\'Alchimie',
    };
  });

  const [showProfileEditor, setShowProfileEditor] = useState<boolean>(true);

  // Print settings
  const [printTheme, setPrintTheme] = useState<'parchment' | 'light'>('parchment');
  const [includeCover, setIncludeCover] = useState<boolean>(true);
  const [includeRules, setIncludeRules] = useState<boolean>(true);
  const [includeHerbarium, setIncludeHerbarium] = useState<boolean>(true);
  const [includeRecipes, setIncludeRecipes] = useState<boolean>(true);
  const [includeCreatures, setIncludeCreatures] = useState<boolean>(true);
  const [includeTables, setIncludeTables] = useState<boolean>(true);
  const [includeGems, setIncludeGems] = useState<boolean>(false); // off by default in pocket booklet
  const [selectedBiomeFilter, setSelectedBiomeFilter] = useState<string>('all');
  const [maxDcFilter, setMaxDcFilter] = useState<number>(0); // 0 = no filter

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<string>('');

  const printContainerRef = useRef<HTMLDivElement>(null);

  // Save profile to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('dnd_herbalist_player_profile', JSON.stringify(playerProfile));
    } catch (e) {
      console.error('Error saving player profile', e);
    }
  }, [playerProfile]);

  // Determine active plants according to export mode and favorites
  const effectiveFavoritePlantIds = favoritePlantIds.length > 0 
    ? favoritePlantIds 
    : ['athelas', 'lotus_dor', 'fleur_de_lune', 'racine_de_givrecoeur', 'mousse_phosphorescente'];

  const targetPlants = exportMode === 'pocket_booklet'
    ? plants.filter(p => effectiveFavoritePlantIds.includes(p.id))
    : plants;

  // Filter by biome and/or player skill DC
  const filteredPlantsForPdf = targetPlants.filter(p => {
    const matchBiome = selectedBiomeFilter === 'all' || p.biome === selectedBiomeFilter;
    const matchDc = maxDcFilter === 0 || p.dcHarvest <= maxDcFilter;
    return matchBiome && matchDc;
  });

  // Group plants 2 per A4 page for optimal readable layout
  const plantPairs: Plant[][] = [];
  for (let i = 0; i < filteredPlantsForPdf.length; i += 2) {
    plantPairs.push(filteredPlantsForPdf.slice(i, i + 2));
  }

  // Target recipes: in pocket mode, recipes utilizing the player's plants
  const targetRecipes = exportMode === 'pocket_booklet'
    ? recipes.filter(r => r.ingredients.some(ing => filteredPlantsForPdf.some(p => p.name.toLowerCase().includes(ing.plantName.toLowerCase()))))
    : recipes;

  // Target creatures: in pocket mode, favorited creatures
  const targetCreatures = exportMode === 'pocket_booklet'
    ? creatures.filter(c => favoriteCreatureIds.includes(c.id))
    : creatures;

  // Native high-resolution browser print
  const handleNativePrint = () => {
    window.print();
  };

  // Direct jsPDF generation
  const handleDirectPdfDownload = async () => {
    if (!printContainerRef.current) return;
    setIsGeneratingPdf(true);
    setPdfProgress('Préparation du livret pour la gravure PDF...');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = printContainerRef.current.querySelectorAll<HTMLElement>('.pdf-page');

      for (let i = 0; i < pages.length; i++) {
        setPdfProgress(`Rendu de la page ${i + 1} sur ${pages.length}...`);
        const pageEl = pages[i];

        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: printTheme === 'parchment' ? '#f7f2e7' : '#ffffff',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }

      setPdfProgress('Finalisation du fichier PDF...');
      const fileName = exportMode === 'pocket_booklet'
        ? `Livret-Poche-${playerProfile.name.replace(/\s+/g, '_')}.pdf`
        : 'Grimoire-Herboriste-Complet.pdf';
      pdf.save(fileName);
    } catch (err) {
      console.error('Erreur de génération PDF:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress('');
    }
  };

  // Quick helper to calculate player chance for a DC
  const calculatePlayerChances = (dc: number, bonus: number) => {
    const neededOnD20 = dc - bonus;
    if (neededOnD20 <= 1) {
      return { label: 'Quasi-automatique (dès 2+)', color: 'text-green-600', bg: 'bg-green-50 border-green-300', percent: '95%' };
    }
    if (neededOnD20 <= 10) {
      return { label: `Accessible (${neededOnD20}+ au d20)`, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-300', percent: `${(21 - neededOnD20) * 5}%` };
    }
    if (neededOnD20 <= 15) {
      return { label: `Défi Modéré (${neededOnD20}+ au d20)`, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-300', percent: `${(21 - neededOnD20) * 5}%` };
    }
    return { label: `Périlleux (${Math.min(20, neededOnD20)}+ au d20)`, color: 'text-red-700', bg: 'bg-red-50 border-red-300', percent: `${Math.max(5, (21 - Math.min(20, neededOnD20)) * 5)}%` };
  };

  let pageCounter = 1;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      {/* ============================================================== */}
      {/* TOP CONFIGURATION BANNER (Excluded from print)                  */}
      {/* ============================================================== */}
      <div className="max-w-5xl mx-auto mb-8 bg-[#241c16] rounded-xl border-2 border-[#d4af37]/60 p-5 sm:p-6 text-[#f4ecd8] shadow-2xl no-print space-y-6">
        
        {/* Main Header & Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#4d3a2e]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#d97706]/50 uppercase tracking-widest font-mono">
                Impression & Export Haute Résolution A4
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fde047] flex items-center gap-2">
              <FileText className="w-7 h-7 text-[#d4af37]" />
              {exportMode === 'pocket_booklet'
                ? `Livret de Poche de ${playerProfile.name}`
                : 'Grand Grimoire d\'Étude Complet'}
            </h2>
            <p className="text-xs text-[#c4b5a5] italic font-serif mt-1">
              {exportMode === 'pocket_booklet'
                ? 'Export compact calibré uniquement avec vos fiches favorites et vos bonus de dés réels.'
                : 'Grimoire encyclopédique de référence avec l\'ensemble des planches botaniques et règles complètes.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleNativePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#b45309] hover:bg-[#d97706] text-white font-serif font-bold text-sm rounded shadow-lg transition"
            >
              <Printer className="w-4 h-4 text-[#fde047]" />
              <span>Imprimer mon Livret (A4)</span>
            </button>

            <button
              onClick={handleDirectPdfDownload}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#3b271b] hover:bg-[#4a3424] text-[#fef08a] border border-[#d4af37]/60 font-serif font-bold text-sm rounded shadow transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Génération...' : 'Télécharger (.PDF)'}</span>
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        {isGeneratingPdf && (
          <div className="p-3 bg-[#451a03] rounded border border-[#f59e0b] text-xs font-serif text-[#fef08a] flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-[#fde047]" />
            <span>{pdfProgress}</span>
          </div>
        )}

        {/* Preset Selector: Livret de Poche vs Grand Grimoire */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => {
              setExportMode('pocket_booklet');
              setIncludeGems(false);
              setIncludeRules(false);
            }}
            className={`p-4 rounded-xl border-2 text-left transition flex items-start gap-3.5 ${
              exportMode === 'pocket_booklet'
                ? 'bg-[#3d2719] border-[#d4af37] ring-1 ring-[#d4af37] shadow-lg'
                : 'bg-[#181310] border-[#3e2e23] hover:border-[#854d0e]'
            }`}
          >
            <Heart className={`w-6 h-6 shrink-0 mt-1 ${exportMode === 'pocket_booklet' ? 'text-[#ef4444] fill-[#ef4444]' : 'text-[#a89988]'}`} />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-sm text-[#fef08a]">
                  🎒 Mon Livret de Poche Personnalisé
                </h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#451a03] text-[#fcd34d] font-mono font-bold">
                  Favoris & Compétences
                </span>
              </div>
              <p className="text-xs text-[#c4b5a5] italic mt-1 leading-relaxed">
                Imprime <strong>uniquement vos fiches marquées en favoris</strong> ({filteredPlantsForPdf.length} plantes), avec les jets de dés annotés directement pour votre personnage.
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              setExportMode('full_grimoire');
              setIncludeGems(true);
              setIncludeRules(true);
            }}
            className={`p-4 rounded-xl border-2 text-left transition flex items-start gap-3.5 ${
              exportMode === 'full_grimoire'
                ? 'bg-[#3d2719] border-[#d4af37] ring-1 ring-[#d4af37] shadow-lg'
                : 'bg-[#181310] border-[#3e2e23] hover:border-[#854d0e]'
            }`}
          >
            <BookOpen className={`w-6 h-6 shrink-0 mt-1 ${exportMode === 'full_grimoire' ? 'text-[#38bdf8]' : 'text-[#a89988]'}`} />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-sm text-[#fef08a]">
                  📜 Grand Grimoire d'Étude Complet
                </h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e293b] text-[#38bdf8] font-mono font-bold">
                  Toutes les 32+ fiches
                </span>
              </div>
              <p className="text-xs text-[#c4b5a5] italic mt-1 leading-relaxed">
                Le tome complet pour le Maître du Jeu ou la bibliothèque : totalité des plantes, gemmes, règles détaillées et tables d20.
              </p>
            </div>
          </button>
        </div>

        {/* Player Profile & Skills Configuration Box */}
        <div className="bg-[#181310] rounded-xl border border-[#4a392d] p-4 text-xs font-serif space-y-4">
          <div className="flex items-center justify-between border-b border-[#3e2e23] pb-2">
            <h4 className="font-bold text-sm text-[#fde047] flex items-center gap-2">
              <User className="w-4 h-4 text-[#d4af37]" />
              Profil & Compétences du Joueur (Annotées sur chaque fiche du livret)
            </h4>
            <button
              onClick={() => setShowProfileEditor(!showProfileEditor)}
              className="text-[#a89988] hover:text-[#fde047] flex items-center gap-1 text-[11px]"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showProfileEditor ? 'Masquer' : 'Modifier les compétences'}</span>
            </button>
          </div>

          {showProfileEditor && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <div>
                <label className="block text-[#a89988] mb-1">Nom de l'Aventurier / PJ</label>
                <input
                  type="text"
                  value={playerProfile.name}
                  onChange={(e) => setPlayerProfile({ ...playerProfile, name: e.target.value })}
                  className="w-full bg-[#120e0b] border border-[#524136] rounded px-2.5 py-1.5 text-xs text-[#f5ecd7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[#a89988] mb-1">Classe, Ordre ou Titre</label>
                <input
                  type="text"
                  value={playerProfile.role}
                  onChange={(e) => setPlayerProfile({ ...playerProfile, role: e.target.value })}
                  className="w-full bg-[#120e0b] border border-[#524136] rounded px-2.5 py-1.5 text-xs text-[#f5ecd7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[#a89988] mb-1">
                  Bonus Sagesse (Survie) : <strong className="text-[#fde047]">+{playerProfile.survieBonus}</strong>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={playerProfile.survieBonus}
                    onChange={(e) => setPlayerProfile({ ...playerProfile, survieBonus: parseInt(e.target.value) || 0 })}
                    className="flex-1 accent-[#d4af37]"
                  />
                  <span className="font-mono font-bold text-[#fde047] w-6 text-right">
                    +{playerProfile.survieBonus}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#a89988] mb-1">
                  Bonus Trousse d'Herboristerie : <strong className="text-[#fde047]">+{playerProfile.toolBonus}</strong>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={playerProfile.toolBonus}
                    onChange={(e) => setPlayerProfile({ ...playerProfile, toolBonus: parseInt(e.target.value) || 0 })}
                    className="flex-1 accent-[#d4af37]"
                  />
                  <span className="font-mono font-bold text-[#fde047] w-6 text-right">
                    +{playerProfile.toolBonus}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Skill-based Filtering Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2e2118]">
            <div className="flex items-center gap-2">
              <span className="text-[#a89988]">Filtre selon mon niveau :</span>
              <button
                onClick={() => setMaxDcFilter(maxDcFilter === 0 ? playerProfile.survieBonus + 10 : 0)}
                className={`px-2.5 py-1 rounded text-[11px] font-serif border transition ${
                  maxDcFilter > 0
                    ? 'bg-[#854d0e] text-white border-[#fde047] font-bold'
                    : 'bg-[#120e0b] text-[#c4b5a5] border-[#524136] hover:border-[#854d0e]'
                }`}
              >
                {maxDcFilter > 0
                  ? `Seulement plantes accessibles (DD ≤ ${playerProfile.survieBonus + 10})`
                  : `Filtrer les plantes à ma portée (DD ≤ ${playerProfile.survieBonus + 10})`}
              </button>
            </div>

            <div className="text-[11px] text-[#fcd34d]">
              {filteredPlantsForPdf.length} plante(s) prête(s) pour l'impression
            </div>
          </div>
        </div>

        {/* Fine-tuning Checkboxes & Options */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-serif text-[#c4b5a5] pt-1">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[#fde047] font-bold">Thème Papier :</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="printTheme"
                checked={printTheme === 'parchment'}
                onChange={() => setPrintTheme('parchment')}
                className="text-[#d4af37]"
              />
              <span>Parchemin Enluminé</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="printTheme"
                checked={printTheme === 'light'}
                onChange={() => setPrintTheme('light')}
                className="text-[#d4af37]"
              />
              <span>Blanc Pur (Économique)</span>
            </label>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[#fde047] font-bold">Sections du Livret :</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCover}
                onChange={(e) => setIncludeCover(e.target.checked)}
                className="text-[#d4af37]"
              />
              <span>Page de Couverture</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHerbarium}
                onChange={(e) => setIncludeHerbarium(e.target.checked)}
                className="text-[#d4af37]"
              />
              <span>Planches Botaniques ({filteredPlantsForPdf.length})</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRecipes}
                onChange={(e) => setIncludeRecipes(e.target.checked)}
                className="text-[#d4af37]"
              />
              <span>Recettes Alchimiques ({targetRecipes.length})</span>
            </label>
            {targetCreatures.length > 0 && (
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCreatures}
                  onChange={(e) => setIncludeCreatures(e.target.checked)}
                  className="text-[#d4af37]"
                />
                <span>Bestiaire ({targetCreatures.length})</span>
              </label>
            )}
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRules}
                onChange={(e) => setIncludeRules(e.target.checked)}
                className="text-[#d4af37]"
              />
              <span>Règles D&D 5e</span>
            </label>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* THE PRINTABLE A4 PAGES CONTAINER                               */}
      {/* ============================================================== */}
      <div
        ref={printContainerRef}
        className="flex flex-col items-center gap-8 print:gap-0 print:m-0"
      >
        {/* ================= PAGE 1: COVER PAGE ================= */}
        {includeCover && (
          <div
            className={`pdf-page page-break relative w-[210mm] min-h-[297mm] p-[16mm] shadow-2xl print:shadow-none flex flex-col justify-between ${
              printTheme === 'parchment' ? 'bg-[#f7f2e7] text-[#2c1810]' : 'bg-white text-black'
            }`}
            style={{ boxSizing: 'border-box' }}
          >
            {/* Ornamental Frame Border */}
            <div className="absolute inset-[10mm] border-2 border-[#854d0e] pointer-events-none" />
            <div className="absolute inset-[12mm] border border-[#854d0e]/40 pointer-events-none" />
            {/* Corner ornaments */}
            <div className="absolute top-[10mm] left-[10mm] w-6 h-6 border-t-4 border-l-4 border-[#854d0e]" />
            <div className="absolute top-[10mm] right-[10mm] w-6 h-6 border-t-4 border-r-4 border-[#854d0e]" />
            <div className="absolute bottom-[10mm] left-[10mm] w-6 h-6 border-b-4 border-l-4 border-[#854d0e]" />
            <div className="absolute bottom-[10mm] right-[10mm] w-6 h-6 border-b-4 border-r-4 border-[#854d0e]" />

            {/* Top Header */}
            <div className="text-center pt-6">
              <div className="text-xs uppercase tracking-[0.3em] font-serif font-bold text-[#854d0e] mb-2">
                {exportMode === 'pocket_booklet'
                  ? 'Aide de Terrain Personnalisée · Donjons & Dragons 5e'
                  : 'Aide de Jeu Officieuse pour Jeux de Rôle Médiévaux-Fantastiques & D&D 5e'}
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-extrabold tracking-wider text-[#3a1d0f] leading-tight mb-2">
                {exportMode === 'pocket_booklet' ? 'LIVRET DE POCHE DE L\'HERBORISTE' : 'GUIDE DE L\'HERBORISTE'}
              </h1>
              <div className="w-40 h-1 bg-[#854d0e] mx-auto my-3" />
              <p className="text-base font-serif italic text-[#633a1e] max-w-lg mx-auto">
                {exportMode === 'pocket_booklet'
                  ? `Recueil de Terrain Spécifique & Fiches Favorites préparées pour ${playerProfile.name}`
                  : 'Traité Botanique des Plantes Médicinales, Vénéneuses & Arcaniques'}
              </p>
            </div>

            {/* Central Art & Character Sheet Badge */}
            {exportMode === 'pocket_booklet' ? (
              <div className="my-4 space-y-4 max-w-lg mx-auto w-full">
                {/* Character Sheet Banner */}
                <div className="bg-[#ede4d1] p-4 rounded-xl border-2 border-[#854d0e] shadow-sm font-serif space-y-3">
                  <div className="flex justify-between items-center border-b border-[#c4a47c] pb-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#854d0e] tracking-widest block">
                        Aventurier Titulaire
                      </span>
                      <h3 className="text-xl font-bold text-[#2d180d]">
                        {playerProfile.name}
                      </h3>
                      <span className="text-xs italic text-[#78350f]">
                        {playerProfile.role}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-[#854d0e] bg-[#f7f2e7] flex items-center justify-center font-bold text-[#854d0e] shadow">
                      <User className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#f7f2e7] p-2 rounded border border-[#c4a47c]">
                      <span className="text-[10px] text-[#78350f] block font-bold">Survie (Cueillette)</span>
                      <span className="text-lg font-mono font-extrabold text-[#854d0e]">
                        +{playerProfile.survieBonus}
                      </span>
                      <span className="text-[9px] text-[#a89988] block">d20 + {playerProfile.survieBonus}</span>
                    </div>

                    <div className="bg-[#f7f2e7] p-2 rounded border border-[#c4a47c]">
                      <span className="text-[10px] text-[#78350f] block font-bold">Nature (Botanique)</span>
                      <span className="text-lg font-mono font-extrabold text-[#854d0e]">
                        +{playerProfile.natureBonus}
                      </span>
                      <span className="text-[9px] text-[#a89988] block">d20 + {playerProfile.natureBonus}</span>
                    </div>

                    <div className="bg-[#f7f2e7] p-2 rounded border border-[#c4a47c]">
                      <span className="text-[10px] text-[#78350f] block font-bold">Trousse Herboristerie</span>
                      <span className="text-lg font-mono font-extrabold text-[#854d0e]">
                        +{playerProfile.toolBonus}
                      </span>
                      <span className="text-[9px] text-[#a89988] block">Incision / Alchimie</span>
                    </div>
                  </div>

                  {/* Quick Roll Threshold Table for Player */}
                  <div className="bg-[#fdfbf7] p-2.5 rounded border border-[#c4a47c] text-[11px] space-y-1">
                    <div className="font-bold text-[#854d0e] text-xs border-b border-[#ecd9c2] pb-1">
                      Barème de Récolte avec votre Bonus (+{playerProfile.survieBonus}) :
                    </div>
                    <div className="flex justify-between text-[#2d180d]">
                      <span>Dé ≤ {Math.max(1, 9 - playerProfile.survieBonus)} (Total 1-9) :</span>
                      <span className="italic text-[#78350f]">Recherche infructueuse</span>
                    </div>
                    <div className="flex justify-between text-[#2d180d]">
                      <span>Dé {Math.max(1, 10 - playerProfile.survieBonus)} à {14 - playerProfile.survieBonus} (Total 10-14) :</span>
                      <span className="font-medium text-emerald-800">Plantes Communes trouvées</span>
                    </div>
                    <div className="flex justify-between text-[#2d180d]">
                      <span>Dé {Math.max(1, 15 - playerProfile.survieBonus)} à {19 - playerProfile.survieBonus} (Total 15-19) :</span>
                      <span className="font-medium text-amber-800">Plantes Rares trouvées</span>
                    </div>
                    <div className="flex justify-between text-[#2d180d]">
                      <span>Dé {Math.max(1, 20 - playerProfile.survieBonus)}+ (Total 20+) :</span>
                      <span className="font-bold text-[#854d0e]">Plantes Très Rares & Floraison Majeure</span>
                    </div>
                  </div>
                </div>

                {/* Favorite Plants Summary in Pocket Booklet */}
                <div className="p-3 bg-[#ede4d1]/70 rounded-lg border border-[#c4a47c] font-serif text-xs">
                  <div className="font-bold text-[#78350f] mb-1">
                    Fiches Favorites Sélectionnées pour cette Expédition ({filteredPlantsForPdf.length}) :
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {filteredPlantsForPdf.map((p) => (
                      <span key={p.id} className="px-2 py-0.5 rounded bg-[#f7f2e7] border border-[#c4a47c] text-[10px] font-bold text-[#3a1d0f]">
                        🌿 {p.name} (DD {p.dcHarvest})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Full Grimoire Central Art */
              <div className="my-6 flex flex-col items-center">
                <div className="p-4 bg-[#ede4d1] rounded-2xl border-4 border-[#854d0e] shadow-lg">
                  <BotanicalIllustration
                    plant={plants[0]}
                    size="lg"
                    showPlateDetails={false}
                    className="w-48 h-48 sm:w-60 sm:h-60"
                  />
                </div>
              </div>
            )}

            {/* Bottom Colophon */}
            <div className="text-center font-serif text-xs text-[#78350f] border-t-2 border-[#854d0e]/40 pt-4 pb-2">
              <p className="font-bold mb-1">
                {exportMode === 'pocket_booklet' ? 'Édition Personnalisée de Poche' : 'Volume Complet de Consultation'}
              </p>
              <p className="text-[10px] text-[#8c6747]">
                Compilé d'après les manuscrits des druides de Fangh · Règles de cueillette compatibles 5e édition
              </p>
            </div>
          </div>
        )}

        {/* ================= OPTIONAL PAGE: RULES & CONVERSION ================= */}
        {includeRules && (
          <div
            className={`pdf-page page-break relative w-[210mm] min-h-[297mm] p-[16mm] shadow-2xl print:shadow-none flex flex-col justify-between ${
              printTheme === 'parchment' ? 'bg-[#f7f2e7] text-[#2c1810]' : 'bg-white text-black'
            }`}
            style={{ boxSizing: 'border-box' }}
          >
            <div>
              <div className="flex justify-between items-center text-[10px] font-serif uppercase tracking-widest text-[#78350f] border-b border-[#854d0e]/40 pb-2 mb-4">
                <span>Le Guide de l'Herboriste</span>
                <span>Règles de Cueillette & Mécaniques</span>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-[#3a1d0f]">
                  Règles de Cueillette & Préparation
                </h2>
                <div className="w-24 h-0.5 bg-[#854d0e] mx-auto mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-6 text-xs font-serif leading-relaxed">
                <div>
                  <h3 className="font-bold text-sm text-[#78350f] mb-1 border-b border-[#c4a47c] pb-1">
                    Mécaniques de Jeu (D&D 5e)
                  </h3>
                  <p className="mb-2">
                    Lors d'une halte ou d'un voyage en milieu naturel, le joueur peut déclarer une séance de cueillette :
                  </p>
                  <ul className="list-disc list-inside space-y-1 mb-3 text-[11px]">
                    <li><strong>Recherche Rapide (1h) :</strong> 1 seul jet avec malus de -2.</li>
                    <li><strong>Recherche Approfondie (4h) :</strong> Jet normal sans pénalité.</li>
                    <li><strong>Jet de Compétence :</strong> Test de Sagesse (Survie) ou d'Intelligence (Nature) + Maîtrise d'outils.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#78350f] mb-1 border-b border-[#c4a47c] pb-1">
                    Table des Degrés de Difficulté (DD)
                  </h3>
                  <div className="bg-[#efe8d8] p-2.5 rounded border border-[#c4a47c] mb-3 text-[11px] space-y-1.5">
                    {FORAGING_RULES.difficultyTable.map((d, i) => (
                      <div key={i} className="flex justify-between border-b border-[#e2d5c3] pb-1 last:border-0 last:pb-0">
                        <strong className="text-[#854d0e] font-mono">{d.dc}</strong>
                        <span>{d.result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-serif text-[#78350f] border-t border-[#854d0e]/40 pt-2">
              <span>Le Guide de l'Herboriste</span>
              <span>— Page {pageCounter++} —</span>
            </div>
          </div>
        )}

        {/* ================= THE HERBARIUM ENTRIES (FAVORITES OR ALL) ================= */}
        {includeHerbarium &&
          plantPairs.map((pair, pageIdx) => (
            <div
              key={pageIdx}
              className={`pdf-page page-break relative w-[210mm] min-h-[297mm] p-[16mm] shadow-2xl print:shadow-none flex flex-col justify-between ${
                printTheme === 'parchment' ? 'bg-[#f7f2e7] text-[#2c1810]' : 'bg-white text-black'
              }`}
              style={{ boxSizing: 'border-box' }}
            >
              <div>
                <div className="flex justify-between items-center text-[10px] font-serif uppercase tracking-widest text-[#78350f] border-b border-[#854d0e]/40 pb-2 mb-4">
                  <span>{exportMode === 'pocket_booklet' ? `Livret de Poche · ${playerProfile.name}` : 'Le Guide de l\'Herboriste'}</span>
                  <span>{exportMode === 'pocket_booklet' ? 'Fiches Favorites de Terrain' : `Chapitre II : L'Herbier Illustré (Planches ${pageIdx * 2 + 1} & ${pageIdx * 2 + 2})`}</span>
                </div>

                {/* Two Plant Cards Stacked Vertically on this A4 Page */}
                <div className="space-y-6">
                  {pair.map((plant) => {
                    const biomeInfo = BIOMES_METADATA[plant.biome];
                    const rarityInfo = RARITY_METADATA[plant.rarity];
                    const chanceInfo = calculatePlayerChances(plant.dcHarvest, playerProfile.survieBonus);

                    return (
                      <div
                        key={plant.id}
                        className="bg-[#fbf8f0] p-4 rounded-lg border border-[#c4a47c] shadow-sm page-break-avoid"
                      >
                        {/* Plant Header */}
                        <div className="flex justify-between items-start border-b border-[#e2d5c3] pb-2 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-serif font-bold text-[#3a1d0f]">
                                {plant.name}
                              </h3>
                              <span
                                className="text-[9px] font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                                style={{
                                  color: rarityInfo.color,
                                  borderColor: rarityInfo.border,
                                  backgroundColor: rarityInfo.bg,
                                }}
                              >
                                {rarityInfo.label}
                              </span>
                            </div>
                            <div className="text-xs font-serif italic text-[#78350f]">
                              {plant.latinName}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-serif font-bold text-[#854d0e] block">
                              {biomeInfo?.label || plant.biome}
                            </span>
                            <span className="text-[10px] font-mono text-[#78350f]">
                              Saison : {plant.season}
                            </span>
                          </div>
                        </div>

                        {/* Plant Body Layout: Left Illustration, Right Botanical & Game Data */}
                        <div className="flex gap-4">
                          <BotanicalIllustration
                            plant={plant}
                            size="print"
                            className="shrink-0 w-32 h-44"
                          />

                          <div className="flex-1 text-xs font-serif space-y-2">
                            {/* Player Personalized Skill Check Badge */}
                            <div className={`p-2 rounded border text-[11px] ${chanceInfo.bg} flex items-center justify-between`}>
                              <div>
                                <span className="font-bold text-[#3a1d0f] block">
                                  🎲 Jet pour {playerProfile.name} :
                                </span>
                                <span className="font-mono font-bold text-[#78350f]">
                                  d20 + {playerProfile.survieBonus} (Survie) vs DD {plant.dcHarvest}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className={`font-bold block ${chanceInfo.color}`}>
                                  {chanceInfo.label}
                                </span>
                                <span className="text-[9px] text-[#78350f]">
                                  Chances de réussite : <strong>{chanceInfo.percent}</strong>
                                </span>
                              </div>
                            </div>

                            {/* Botanical Details */}
                            <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#f4ecd8] p-2 rounded">
                              <div>
                                <span className="font-bold text-[#854d0e]">Parties : </span>
                                <span>{plant.partsUsed}</span>
                              </div>
                              <div>
                                <span className="font-bold text-[#854d0e]">Préparation : </span>
                                <span>{plant.preparationMethod} ({plant.preparationTime})</span>
                              </div>
                            </div>

                            {/* Medicinal & Game Effects */}
                            <div className="space-y-1">
                              <span className="font-bold text-[#3a1d0f] block text-[11px]">
                                Effets Thérapeutiques & Magiques :
                              </span>
                              {plant.gameEffects.map((eff, i) => (
                                <div key={i} className="pl-2 border-l-2 border-[#854d0e] text-[11px]">
                                  <strong className="text-[#854d0e]">{eff.title} : </strong>
                                  <span>{eff.description}</span>
                                </div>
                              ))}
                            </div>

                            {/* Toxicity warning if any */}
                            {plant.toxicityWarning && (
                              <div className="flex items-center gap-1.5 text-[10px] text-red-800 bg-red-50 p-1.5 rounded border border-red-200">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span><strong>Toxicité : </strong>{plant.toxicityWarning}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Page Footer */}
              <div className="flex justify-between items-center text-[10px] font-serif text-[#78350f] border-t border-[#854d0e]/40 pt-2">
                <span>{exportMode === 'pocket_booklet' ? `Livret de Poche · ${playerProfile.name}` : 'Le Guide de l\'Herboriste'}</span>
                <span>— Page {pageCounter++} —</span>
              </div>
            </div>
          ))}

        {/* ================= OPTIONAL PAGE: CREATURES / BESTIARY FAVORITES ================= */}
        {includeCreatures && targetCreatures.length > 0 && (
          <div
            className={`pdf-page page-break relative w-[210mm] min-h-[297mm] p-[16mm] shadow-2xl print:shadow-none flex flex-col justify-between ${
              printTheme === 'parchment' ? 'bg-[#f7f2e7] text-[#2c1810]' : 'bg-white text-black'
            }`}
            style={{ boxSizing: 'border-box' }}
          >
            <div>
              <div className="flex justify-between items-center text-[10px] font-serif uppercase tracking-widest text-[#78350f] border-b border-[#854d0e]/40 pb-2 mb-4">
                <span>{exportMode === 'pocket_booklet' ? `Livret de Poche · ${playerProfile.name}` : 'Le Guide de l\'Herboriste'}</span>
                <span>Bestiaire & Anatomie de Dépeçage</span>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-[#3a1d0f]">
                  Composants de Monstres & Dépeçage
                </h2>
                <div className="w-24 h-0.5 bg-[#854d0e] mx-auto mt-1" />
              </div>

              <div className="space-y-4">
                {targetCreatures.slice(0, 2).map((creature) => (
                  <div key={creature.id} className="bg-[#fbf8f0] p-4 rounded-lg border border-[#c4a47c] space-y-3">
                    <div className="flex justify-between items-start border-b border-[#e2d5c3] pb-2">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-[#3a1d0f]">
                          🐉 {creature.name}
                        </h3>
                        <span className="text-xs italic text-[#78350f]">
                          {creature.category} · Facteur de Puissance FP {creature.challengeRating}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#451a03] text-[#fcd34d]">
                        Incision : d20 + {playerProfile.toolBonus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {creature.components.map((comp) => {
                        const harvestChance = calculatePlayerChances(comp.harvestDC, playerProfile.toolBonus);
                        return (
                          <div key={comp.id} className="p-2.5 rounded bg-[#f4ecd8] border border-[#d8c5b0] space-y-1">
                            <div className="flex justify-between items-start">
                              <strong className="text-[#854d0e] text-xs">{comp.name}</strong>
                              <span className="text-[10px] font-mono text-[#78350f]">{comp.marketValue}</span>
                            </div>
                            <div className="text-[11px] text-[#331c12]">
                              DD Récolte : <strong>DD {comp.harvestDC} ({comp.harvestSkill})</strong>
                            </div>
                            <div className={`p-1 rounded text-[10px] font-bold ${harvestChance.color}`}>
                              Jet PJ : d20 + {playerProfile.toolBonus} ({harvestChance.label})
                            </div>
                            <p className="text-[10px] text-[#78350f] italic">
                              {comp.alchemicalProperties}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-serif text-[#78350f] border-t border-[#854d0e]/40 pt-2">
              <span>Bestiaire & Dépeçage</span>
              <span>— Page {pageCounter++} —</span>
            </div>
          </div>
        )}

        {/* ================= OPTIONAL PAGE: ALCHEMICAL RECIPES ================= */}
        {includeRecipes && targetRecipes.length > 0 && (
          <div
            className={`pdf-page page-break relative w-[210mm] min-h-[297mm] p-[16mm] shadow-2xl print:shadow-none flex flex-col justify-between ${
              printTheme === 'parchment' ? 'bg-[#f7f2e7] text-[#2c1810]' : 'bg-white text-black'
            }`}
            style={{ boxSizing: 'border-box' }}
          >
            <div>
              <div className="flex justify-between items-center text-[10px] font-serif uppercase tracking-widest text-[#78350f] border-b border-[#854d0e]/40 pb-2 mb-4">
                <span>{exportMode === 'pocket_booklet' ? `Livret de Poche · ${playerProfile.name}` : 'Le Guide de l\'Herboriste'}</span>
                <span>Recettes & Concoctions Alchimiques</span>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-[#3a1d0f]">
                  {exportMode === 'pocket_booklet'
                    ? 'Recettes Alchimiques Réalisables avec vos Herbes'
                    : 'Recettes Alchimiques du Grimoire'}
                </h2>
                <div className="w-24 h-0.5 bg-[#854d0e] mx-auto mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-serif">
                {targetRecipes.slice(0, 6).map((recipe) => {
                  const alchemyChance = calculatePlayerChances(recipe.difficultyDC, playerProfile.toolBonus);
                  return (
                    <div
                      key={recipe.id}
                      className="bg-[#fbf8f0] p-3 rounded-lg border border-[#c4a47c] space-y-2 shadow-sm"
                    >
                      <div className="flex justify-between items-start border-b border-[#ecd9c2] pb-1">
                        <div>
                          <strong className="text-sm text-[#3a1d0f] block">{recipe.name}</strong>
                          <span className="text-[10px] uppercase text-[#854d0e] font-bold">{recipe.category}</span>
                        </div>
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[#f4ecd8] border border-[#c4a47c]">
                          DD {recipe.difficultyDC}
                        </span>
                      </div>

                      <div className={`p-1.5 rounded text-[10px] ${alchemyChance.bg} flex justify-between items-center`}>
                        <span className="text-[#3a1d0f]">Jet : <strong>d20 + {playerProfile.toolBonus}</strong></span>
                        <span className={`font-bold ${alchemyChance.color}`}>{alchemyChance.percent} succès</span>
                      </div>

                      <div className="text-[11px] text-[#451a03]">
                        <strong>Ingrédients : </strong>
                        <span>{recipe.ingredients.map(ing => `${ing.quantity}x ${ing.plantName}`).join(', ')}</span>
                      </div>

                      <p className="text-[11px] text-[#2d180d] italic">
                        {recipe.effect}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-serif text-[#78350f] border-t border-[#854d0e]/40 pt-2">
              <span>Recettes Alchimiques</span>
              <span>— Page {pageCounter++} —</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
