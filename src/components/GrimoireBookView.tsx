import React, { useState } from 'react';
import { Plant, AlchemicalRecipe } from '../types/herb';
import { BIOMES_METADATA, RARITY_METADATA, FORAGING_RULES } from '../data/herbalistData';
import { BotanicalIllustration } from './BotanicalIllustration';
import { BookOpen, ChevronLeft, ChevronRight, Bookmark, Sparkles, AlertTriangle, Shield, Clock, Coins, Flame } from 'lucide-react';

interface GrimoireBookViewProps {
  plants: Plant[];
  recipes: AlchemicalRecipe[];
  onSelectPlant: (plant: Plant) => void;
  onNavigateToPdf: () => void;
  onNavigateToAlchimie?: () => void;
}

export const GrimoireBookView: React.FC<GrimoireBookViewProps> = ({
  plants,
  recipes,
  onSelectPlant,
  onNavigateToPdf,
  onNavigateToAlchimie,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedBiomeFilter, setSelectedBiomeFilter] = useState<string>('all');

  const filteredPlants = selectedBiomeFilter === 'all'
    ? plants
    : plants.filter(p => p.biome === selectedBiomeFilter);

  // Pages structure:
  // Page 0: Cover / Title & Preface
  // Page 1: Chapter 1 - Rules & Methods (Cueillette & Alchimie)
  // Pages 2 ... N: Herbarium (2 plants per spread or 1 detailed plant per page)
  // Last pages: Recipes & Tables
  const totalPlantPages = Math.ceil(filteredPlants.length / 2);
  const totalPages = 2 + totalPlantPages + 2; // Cover + Rules + Plants + Recipes + Tables

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 flex flex-col items-center">
      {/* Top Reading Toolbar */}
      <div className="w-full max-w-5xl mb-6 bg-[#251e18] p-3 rounded-lg border border-[#524136] flex flex-wrap items-center justify-between gap-3 text-sm text-[#e6d8c3] shadow-md">
        <div className="flex items-center gap-3">
          <Bookmark className="w-5 h-5 text-[#d4af37]" />
          <span className="font-serif font-bold text-[#fef08a]">
            {currentPage === 0 && 'Page de Garde & Prologue'}
            {currentPage === 1 && 'Chapitre I : L\'Art de l\'Herboriste & Cueillette'}
            {currentPage >= 2 && currentPage < 2 + totalPlantPages && `Chapitre II : L'Herbier Illustré (Folio ${currentPage - 1})`}
            {currentPage === 2 + totalPlantPages && 'Chapitre III : L\'Atelier & Concoctions'}
            {currentPage === 2 + totalPlantPages + 1 && 'Chapitre IV : Tables de Rencontres Aléatoires'}
          </span>
        </div>

        {/* Quick jump biomes if in Herbier */}
        {currentPage >= 2 && currentPage < 2 + totalPlantPages && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#a89988]">Biome :</span>
            <select
              value={selectedBiomeFilter}
              onChange={(e) => {
                setSelectedBiomeFilter(e.target.value);
                setCurrentPage(2);
              }}
              className="bg-[#181310] border border-[#59473b] rounded px-2 py-1 text-[#f5ecd7] text-xs focus:outline-none"
            >
              <option value="all">Tous les biotopes ({plants.length})</option>
              <option value="foret">Forêts</option>
              <option value="caverne">Cavernes & Souterrains</option>
              <option value="montagne">Montagnes</option>
              <option value="marais">Marais</option>
              <option value="plaine">Plaines</option>
              <option value="desert">Déserts</option>
              <option value="aquatique">Côtes & Eaux</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#382b22] text-[#e2d5c3] hover:bg-[#4a392e] disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>
          <span className="px-2 font-mono text-xs text-[#d4af37]">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#382b22] text-[#e2d5c3] hover:bg-[#4a392e] disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <span>Suivant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateToPdf}
            className="ml-2 px-3 py-1.5 rounded bg-[#92400e] text-white hover:bg-[#b45309] font-serif text-xs font-semibold shadow transition"
          >
            Voir Version PDF A4
          </button>
        </div>
      </div>

      {/* Main Tome / Grimoire Paper Book Container */}
      <div className="w-full max-w-5xl bg-[#f7f2e7] text-[#2c1810] rounded-xl shadow-2xl border-4 border-[#3e2b20] p-6 sm:p-12 relative overflow-hidden transition-all duration-300 min-h-[750px]">
        {/* Subtle aged parchment background texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `radial-gradient(#b45309 0.75px, transparent 0.75px), radial-gradient(#78350f 0.75px, #f7f2e7 0.75px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Ornate corner borders */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#854d0e]" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#854d0e]" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#854d0e]" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#854d0e]" />

        {/* ================= PAGE 0: COVER / PREFACE ================= */}
        {currentPage === 0 && (
          <div className="relative z-10 flex flex-col items-center justify-center text-center py-8">
            <div className="w-20 h-20 rounded-full border-2 border-[#854d0e] flex items-center justify-center mb-6 bg-[#f0e6d2] shadow-inner text-[#854d0e]">
              <BookOpen className="w-10 h-10" />
            </div>

            <div className="text-xs uppercase tracking-widest text-[#854d0e] font-serif font-bold mb-2">
              Traité Universel d'Herboristerie Médiévale-Fantastique
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-[#3a1d0f] tracking-wide mb-4 leading-tight">
              LE GUIDE DE L'HERBORISTE
            </h1>

            <div className="w-48 h-0.5 bg-[#854d0e]/60 my-2" />

            <h2 className="text-lg sm:text-xl font-serif italic text-[#633a1e] max-w-2xl mb-8">
              Compendium de Flore Médicinale, Vénéneuse & Arcanique pour Donjons & Dragons 5e et Maîtres du Jeu
            </h2>

            {/* Central Frontispice Plate */}
            <div className="my-4 p-4 rounded-lg bg-[#efe7d5] border border-[#c4a47c] max-w-md shadow-md">
              <BotanicalIllustration
                plant={plants[0]}
                size="md"
                showPlateDetails={false}
                className="mx-auto"
              />
              <p className="text-xs font-serif italic text-[#78350f] mt-3">
                « Dans chaque racine réside un mystère, dans chaque feuille sommeille une vertu. »
              </p>
            </div>

            <div className="mt-8 max-w-2xl text-left bg-[#f4ecd8]/90 p-5 rounded border border-[#d8c2a3] text-sm leading-relaxed font-serif">
              <p className="mb-3 font-semibold text-[#451a03]">
                À l'attention de l'apothicaire, du rôdeur, du druide et du Maître de Donjon :
              </p>
              <p className="text-[#3b271d]">
                Ce guide a été rédigé pour offrir aux aventuriers un système clair, visuel et prêt à l'emploi. Chaque plante comporte sa planche botanique illustrative, ses conditions de biotope, ses tests de cueillette (DD), ses méthodes de préparation (infusion, décoction, onguent, poudre) et ses effets mécaniques rigoureusement calibrés pour les règles du jeu de rôle fantastique.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setCurrentPage(1)}
                className="px-6 py-2.5 bg-[#78350f] text-[#fef08a] font-serif font-bold rounded shadow hover:bg-[#8e3f13] transition"
              >
                Ouvrir le Grimoire →
              </button>
              <button
                onClick={onNavigateToPdf}
                className="px-6 py-2.5 bg-[#3d281a] text-[#f5ebd7] font-serif font-bold rounded border border-[#854d0e] hover:bg-[#523724] transition shadow"
              >
                Générer le PDF à Imprimer
              </button>
            </div>
          </div>
        )}

        {/* ================= PAGE 1: CHAPTER I - RULES ================= */}
        {currentPage === 1 && (
          <div className="relative z-10">
            <div className="text-center mb-8 border-b-2 border-[#854d0e]/40 pb-4">
              <span className="text-xs uppercase tracking-widest text-[#854d0e] font-bold font-serif">
                Chapitre Premier
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#3a1d0f] mt-1">
                L'Art de l'Herboriste & Principes de Cueillette
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-serif leading-relaxed text-[#331c12]">
              <div>
                <h3 className="text-lg font-bold text-[#78350f] mb-2 flex items-center gap-2 border-b border-[#c4a47c] pb-1">
                  <Bookmark className="w-4 h-4 text-[#854d0e]" />
                  Le Serment et l'Éthique Végétale
                </h3>
                <p className="mb-3">
                  <span className="float-left text-4xl font-serif font-bold text-[#78350f] pr-2 leading-none">L</span>
                  'herboriste avisé ne pille jamais la nature : il préserve la souche mère et ne récolte que le tiers des pousses d'un même bosquet. Les instruments de fer brut sont déconseillés pour les herbes magiques, car le métal froid en altère les effluves arcaniques ; on leur préférera la corne, le bois durci ou l'argent purifié.
                </p>
                <p className="mb-4">
                  Les cycles de récolte jouent un rôle prépondérant : la rosée matinale préserve les huiles volatiles, tandis que les plantes vénéneuses concentrent leur suc le plus mortel aux heures arides du zénith ou sous la froide clarté de la pleine lune.
                </p>

                <h3 className="text-lg font-bold text-[#78350f] mb-2 flex items-center gap-2 border-b border-[#c4a47c] pb-1">
                  <Clock className="w-4 h-4 text-[#854d0e]" />
                  Déroulement d'une Séance de Cueillette
                </h3>
                <p className="mb-2">
                  Lorsqu'un personnage recherche des plantes au cours d'un voyage ou d'une halte :
                </p>
                <ul className="list-disc list-inside space-y-1 mb-4 text-xs">
                  <li><strong>Recherche Rapide (1 heure) :</strong> 1 seul jet de recherche possible, applique un malus de -2 au résultat.</li>
                  <li><strong>Fouille Approfondie (4 heures) :</strong> Jet normal. Permet de trouver 1d4 doses supplémentaires en cas de succès critique.</li>
                  <li><strong>Test de Compétence :</strong> Test de Sagesse (Survie) ou d'Intelligence (Nature). Le bonus de maîtrise s'applique si le personnage maîtrise le Kit d'Herboristerie.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#78350f] mb-2 flex items-center gap-2 border-b border-[#c4a47c] pb-1">
                  <Shield className="w-4 h-4 text-[#854d0e]" />
                  Échelle des Difficultés (DD)
                </h3>
                <div className="bg-[#efe8d8] rounded border border-[#c4a47c] p-3 mb-4 space-y-2 text-xs">
                  {FORAGING_RULES.difficultyTable.map((d, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-[#dfd0bd] pb-1 last:border-0 last:pb-0">
                      <span className="font-bold text-[#78350f] font-mono">{d.dc}</span>
                      <span className="text-[#3a2519]">{d.result}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-[#78350f] mb-2 flex items-center gap-2 border-b border-[#c4a47c] pb-1">
                  <Sparkles className="w-4 h-4 text-[#854d0e]" />
                  Modificateurs Météorologiques
                </h3>
                <div className="space-y-1.5 mb-4 text-xs">
                  {FORAGING_RULES.weatherModifiers.map((w, i) => (
                    <div key={i} className="flex justify-between p-1.5 rounded bg-[#f4ebd7]">
                      <span className="italic">{w.condition}</span>
                      <span className="font-bold text-[#854d0e]">{w.modifier}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-[#78350f] mb-2 flex items-center gap-2 border-b border-[#c4a47c] pb-1">
                  <Coins className="w-4 h-4 text-[#854d0e]" />
                  Conservation des Spécimens
                </h3>
                <p className="text-xs">
                  Les feuilles fraîches flétrissent en 3 jours si elles ne sont pas traitées. Le séchage au pressoir prolonge leur efficacité jusqu'à 6 mois, tandis que la macération dans l'huile de lin ou l'alcool de grain conserve les principes actifs pendant 1 à 2 années pleines.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-between border-t border-[#c4a47c] pt-4 text-xs font-serif text-[#78350f]">
              <span>— Page 2 —</span>
              <button
                onClick={() => setCurrentPage(2)}
                className="font-bold hover:underline"
              >
                Poursuivre vers l'Herbier Illustré →
              </button>
            </div>
          </div>
        )}

        {/* ================= PAGES 2 ... N: HERBARIUM PLANTS ================= */}
        {currentPage >= 2 && currentPage < 2 + totalPlantPages && (
          <div className="relative z-10">
            {/* Header of Herbarium section */}
            <div className="flex flex-wrap items-center justify-between border-b-2 border-[#854d0e]/40 pb-3 mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#854d0e] font-bold font-serif">
                  Chapitre II : L'Herbier Illustré
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#3a1d0f]">
                  Catalogue Botanique & Fiches d'Herbes
                </h2>
              </div>
              <span className="text-xs font-serif italic text-[#78350f]">
                Spécimens {((currentPage - 2) * 2) + 1} à {Math.min(filteredPlants.length, (currentPage - 2) * 2 + 2)} sur {filteredPlants.length}
              </span>
            </div>

            {/* Two plant profiles side by side (Book Spread layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPlants
                .slice((currentPage - 2) * 2, (currentPage - 2) * 2 + 2)
                .map((plant) => {
                  const biomeInfo = BIOMES_METADATA[plant.biome];
                  const rarityInfo = RARITY_METADATA[plant.rarity];

                  return (
                    <div
                      key={plant.id}
                      className="bg-[#faf6ee] rounded-lg border border-[#c4a47c] p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition"
                    >
                      <div>
                        {/* Title & Latin Binomial */}
                        <div className="flex justify-between items-start gap-2 border-b border-[#e2d5c3] pb-2 mb-3">
                          <div>
                            <h3 className="text-xl font-serif font-bold text-[#3a1b0e]">
                              {plant.name}
                            </h3>
                            <div className="text-xs font-serif italic text-[#78350f]">
                              {plant.latinName}
                            </div>
                          </div>
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

                        {/* Plant Illustration & Quick Meta */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start mb-4">
                          <BotanicalIllustration
                            plant={plant}
                            size="md"
                            showPlateDetails={true}
                            className="shrink-0 cursor-pointer"
                          />
                          <div className="text-xs space-y-1.5 font-serif w-full">
                            <div className="flex justify-between border-b border-[#ecd9c2] pb-1">
                              <span className="text-[#78350f] font-semibold">Habitat :</span>
                              <span className="font-medium text-[#2d4a22]">{biomeInfo.label}</span>
                            </div>
                            <div className="flex justify-between border-b border-[#ecd9c2] pb-1">
                              <span className="text-[#78350f] font-semibold">DD Récolte :</span>
                              <span className="font-mono font-bold text-[#b45309]">DD {plant.dcHarvest}</span>
                            </div>
                            <div className="flex justify-between border-b border-[#ecd9c2] pb-1">
                              <span className="text-[#78350f] font-semibold">Saison :</span>
                              <span>{plant.season}</span>
                            </div>
                            <div className="flex justify-between border-b border-[#ecd9c2] pb-1">
                              <span className="text-[#78350f] font-semibold">Partie :</span>
                              <span className="truncate max-w-[130px]">{plant.partsUsed}</span>
                            </div>
                            <div className="flex justify-between border-b border-[#ecd9c2] pb-1">
                              <span className="text-[#78350f] font-semibold">Méthode :</span>
                              <span>{plant.preparationMethod}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                              <span className="text-[#78350f] font-semibold">Valeur :</span>
                              <span className="font-bold text-[#854d0e]">{plant.value}</span>
                            </div>
                          </div>
                        </div>

                        {/* Description & Botanical Appearance */}
                        <p className="text-xs font-serif text-[#3a261c] mb-3 leading-relaxed">
                          {plant.description}
                        </p>

                        {/* D&D Game Effects Box */}
                        <div className="bg-[#f0e7d3] p-3 rounded border border-[#cfbca2] mb-3 space-y-2">
                          <div className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#78350f] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
                            Effets en Jeu (D&D 5e / JDR)
                          </div>
                          {plant.gameEffects.map((eff, idx) => (
                            <div key={idx} className="text-xs font-serif">
                              <span className="font-bold text-[#451a03]">{eff.title} : </span>
                              <span className="text-[#2b1810]">{eff.description}</span>
                              {eff.duration && (
                                <span className="block text-[10px] text-[#78350f] italic mt-0.5">
                                  Durée : {eff.duration}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Toxicity warning if any */}
                        {plant.toxicityWarning && (
                          <div className="bg-[#fee2e2]/60 border border-[#fca5a5] p-2 rounded mb-2 flex items-start gap-1.5 text-[11px] text-[#991b1b] font-serif">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span><strong>Avertissement :</strong> {plant.toxicityWarning}</span>
                          </div>
                        )}

                        {/* Druidic Lore */}
                        <blockquote className="text-[11px] font-serif italic text-[#633a1e] border-l-2 border-[#854d0e] pl-2 py-0.5 mt-2">
                          {plant.druidicLore}
                        </blockquote>
                      </div>

                      {/* Detail button */}
                      <button
                        onClick={() => onSelectPlant(plant)}
                        className="mt-4 w-full py-1.5 bg-[#ebdcc4] hover:bg-[#dfcdb1] text-[#451a03] text-xs font-serif font-bold rounded border border-[#c4a47c] transition"
                      >
                        Consulter la fiche détaillée & Recettes associées
                      </button>
                    </div>
                  );
                })}
            </div>

            <div className="mt-8 flex justify-between border-t border-[#c4a47c] pt-4 text-xs font-serif text-[#78350f]">
              <span>— Folio {currentPage + 1} —</span>
              <span>Guide de l'Herboriste</span>
            </div>
          </div>
        )}

        {/* ================= CHAPTER III: ALCHEMY RECIPES ================= */}
        {currentPage === 2 + totalPlantPages && (
          <div className="relative z-10">
            <div className="text-center mb-8 border-b-2 border-[#854d0e]/40 pb-4">
              <span className="text-xs uppercase tracking-widest text-[#854d0e] font-bold font-serif">
                Chapitre III
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#3a1d0f] mt-1">
                Traité des Concoctions & Potions Alchimiques
              </h2>
            </div>

            <p className="text-sm font-serif text-[#331c12] mb-6 max-w-2xl mx-auto text-center italic">
              « Toute herbe cueillie n'est que promesse. C'est dans le creuset de l'alchimiste, sous l'action mesurée de la flamme et de l'alambic, que la sève révèle sa souveraine puissance. »
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipes.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-[#faf6ee] rounded-lg border border-[#c4a47c] p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start border-b border-[#ecd9c2] pb-2 mb-2">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#3a1a0d]">
                        {rec.name}
                      </h4>
                      <span className="text-[11px] font-serif uppercase tracking-wider text-[#78350f]">
                        {rec.category} · DD d'Alchimie {rec.difficultyDC}
                      </span>
                    </div>
                    <span className="font-bold text-xs font-mono text-[#b45309]">
                      {rec.marketPrice}
                    </span>
                  </div>

                  <div className="text-xs space-y-2 font-serif text-[#331c12]">
                    <div>
                      <span className="font-semibold text-[#78350f]">Ingrédients requis :</span>
                      <ul className="list-disc list-inside mt-0.5 text-[11px] text-[#451a03]">
                        {rec.ingredients.map((ing, i) => (
                          <li key={i}>
                            <strong>{ing.quantity}x {ing.plantName}</strong> ({ing.part})
                          </li>
                        ))}
                        {rec.additionalComponents.map((comp, i) => (
                          <li key={i} className="italic text-[#6b4c35]">{comp}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#f0e7d3] p-2 rounded border border-[#d8c2a3]">
                      <span className="font-bold text-[#451a03]">Effet : </span>
                      <span>{rec.effect}</span>
                    </div>

                    <div className="flex justify-between text-[11px] text-[#78350f] pt-1">
                      <span>Temps de brassage : {rec.brewingTime}</span>
                      <span>Conservation : {rec.shelfLife}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Random Potion Generator Highlight Callout */}
            {onNavigateToAlchimie && (
              <div className="mt-6 p-4 rounded-xl bg-[#ede3cf] border-2 border-[#b45309] text-center font-serif shadow-md">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#b45309] block mb-1">
                  Nouveauté de l'Atelier
                </span>
                <h4 className="text-base font-bold text-[#3a1d0f] mb-1">
                  Expérimentations Alchimiques & Breuvages Chaotiques
                </h4>
                <p className="text-xs text-[#523724] max-w-xl mx-auto mb-3">
                  Vous combinez des ingrédients rares sans suivre de recette établie ? Générez instantanément une table d'effets aléatoires (d20) personnalisée selon les composants choisis !
                </p>
                <button
                  onClick={onNavigateToAlchimie}
                  className="px-5 py-2 rounded bg-[#78350f] hover:bg-[#8e3f13] text-[#fef08a] font-bold text-xs shadow transition inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#fde047]" />
                  <span>Ouvrir le Générateur de Table d'Effets Aléatoires</span>
                </button>
              </div>
            )}

            <div className="mt-8 flex justify-between border-t border-[#c4a47c] pt-4 text-xs font-serif text-[#78350f]">
              <span>— Page {currentPage + 1} —</span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                className="font-bold hover:underline"
              >
                Passer aux Tables Aléatoires →
              </button>
            </div>
          </div>
        )}

        {/* ================= CHAPTER IV: RANDOM FORAGING TABLES ================= */}
        {currentPage === 2 + totalPlantPages + 1 && (
          <div className="relative z-10">
            <div className="text-center mb-8 border-b-2 border-[#854d0e]/40 pb-4">
              <span className="text-xs uppercase tracking-widest text-[#854d0e] font-bold font-serif">
                Chapitre IV : Outil pour le Maître du Jeu
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#3a1d0f] mt-1">
                Tables de Cueillette Aléatoire (d20)
              </h2>
            </div>

            <p className="text-xs font-serif text-[#331c12] mb-6 text-center max-w-2xl mx-auto">
              Lancez 1d20 lorsque les aventuriers cherchent des herbes. Ajoutez le modificateur de Sagesse (Survie) ou d'Intelligence (Nature) du joueur.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-serif">
              {/* Forest & Woods Table */}
              <div className="bg-[#faf6ee] p-4 rounded-lg border border-[#c4a47c]">
                <h4 className="font-bold text-sm text-[#2d6a4f] mb-2 border-b border-[#c4a47c] pb-1 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Table de Forêt & Bois Anciens
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between py-0.5 border-b border-[#ecd9c2]">
                    <span className="font-mono font-bold text-[#854d0e]">1 - 7</span>
                    <span>Herbe aux Fées (1d4 doses)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#ecd9c2]">
                    <span className="font-mono font-bold text-[#854d0e]">8 - 12</span>
                    <span>Belladone Noire (1 dose)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#ecd9c2]">
                    <span className="font-mono font-bold text-[#854d0e]">13 - 17</span>
                    <span>Athelas / Feuille Royale (1d2 doses)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#ecd9c2]">
                    <span className="font-mono font-bold text-[#854d0e]">18 - 19</span>
                    <span>Écorce de Chêne-Vermeil (1 morceau)</span>
                  </div>
                  <div className="flex justify-between py-0.5 font-bold text-[#b45309]">
                    <span className="font-mono">20+</span>
                    <span>Fleur de Lune sacrée (1 corolle étincelante)</span>
                  </div>
                </div>
              </div>

              {/* Caves & Underdark Table */}
              <div className="bg-[#faf6ee] p-4 rounded-lg border border-[#c4a47c]">
                <h4 className="font-bold text-sm text-[#6b21a8] mb-2 border-b border-[#c4a47c] pb-1 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Table de Cavernes & Outreterre
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between py-0.5 border-b border-[#ecd9c2]">
                    <span className="font-mono font-bold text-[#854d0e]">1 - 8</span>
                    <span>Mousse Luminescente (2d4 poignées)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#ecd9c2]">
                    <span className="font-mono font-bold text-[#854d0e]">9 - 14</span>
                    <span>Champignon Céphale (1d2 sporophores)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#ecd9c2]">
                    <span className="font-mono font-bold text-[#854d0e]">15 - 18</span>
                    <span>Mandragore Criarde (1 racine intacte)</span>
                  </div>
                  <div className="flex justify-between py-0.5 font-bold text-[#b45309]">
                    <span className="font-mono">19+</span>
                    <span>Racine d'Ombre des profondeurs (1 fiole)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-[#f0e7d3] rounded border border-[#cfbca2] text-center font-serif">
              <h5 className="font-bold text-sm text-[#451a03] mb-1">
                Souhaitez-vous générer ou imprimer le guide complet ?
              </h5>
              <p className="text-xs text-[#523724] mb-3">
                La mise en page d'exportation A4 regroupe l'intégralité des 16 planches botaniques illustrées, les tables et recettes dans un format prêt pour reliure ou classeur.
              </p>
              <button
                onClick={onNavigateToPdf}
                className="px-6 py-2 bg-[#92400e] text-[#fef08a] font-serif font-bold rounded shadow hover:bg-[#b45309] transition text-xs"
              >
                Accéder à l'Exportation PDF A4 →
              </button>
            </div>

            <div className="mt-8 flex justify-between border-t border-[#c4a47c] pt-4 text-xs font-serif text-[#78350f]">
              <span>— Page {currentPage + 1} — Fin du Grimoire</span>
              <span>© Le Guide de l'Herboriste</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
