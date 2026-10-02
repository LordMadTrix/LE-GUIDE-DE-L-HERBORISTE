import React from 'react';
import { Plant, AlchemicalRecipe } from '../types/herb';
import { BIOMES_METADATA, RARITY_METADATA } from '../data/herbalistData';
import { BotanicalIllustration } from './BotanicalIllustration';
import { X, Sparkles, AlertTriangle, Shield, Clock, Compass, Coins, FlaskConical, Feather, Heart } from 'lucide-react';

interface PlantDetailModalProps {
  plant: Plant | null;
  onClose: () => void;
  recipes: AlchemicalRecipe[];
  onSelectRecipe?: (recipe: AlchemicalRecipe) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({
  plant,
  onClose,
  recipes,
  onSelectRecipe,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!plant) return null;

  const biomeInfo = BIOMES_METADATA[plant.biome];
  const rarityInfo = RARITY_METADATA[plant.rarity];

  // Find recipes using this plant
  const associatedRecipes = recipes.filter(r =>
    r.ingredients.some(ing => ing.plantId === plant.id || ing.plantName === plant.name)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in no-print overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#f7f2e7] text-[#2c1810] rounded-xl border-4 border-[#5c3e29] shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        {/* Top Action Buttons (Favorite + Close) */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(plant.id)}
              title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={`p-2 rounded-full border transition ${
                isFavorite
                  ? 'bg-rose-100 text-rose-600 border-rose-400 shadow-sm'
                  : 'bg-[#ebdcc4] hover:bg-[#dfcdb1] text-[#451a03] border-[#c4a47c]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#ebdcc4] hover:bg-[#dfcdb1] text-[#451a03] border border-[#c4a47c] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header */}
        <div className="border-b-2 border-[#854d0e]/40 pb-4 mb-6 pr-10">
          <div className="flex flex-wrap items-center gap-2 mb-1">
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
            <span className="text-xs font-serif text-[#78350f]">
              · {biomeInfo.label}
            </span>
          </div>

          <h2 className="text-3xl font-serif font-bold text-[#3a1d0f]">
            {plant.name}
          </h2>
          <div className="text-sm font-serif italic text-[#78350f] mt-0.5">
            {plant.latinName}
            {plant.otherNames && plant.otherNames.length > 0 && (
              <span className="text-[#59473b] not-italic ml-2">
                (Noms vernaculaires : {plant.otherNames.join(', ')})
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column: Botanical Illustration & Specimen details */}
          <div className="flex flex-col items-center">
            <BotanicalIllustration
              plant={plant}
              size="lg"
              showPlateDetails={true}
              className="w-full max-w-[260px] h-72 shadow-md mb-4"
            />

            <div className="w-full bg-[#efe7d5] rounded-lg border border-[#c4a47c] p-3 text-xs font-serif space-y-2">
              <div className="font-bold text-[#78350f] uppercase tracking-wider text-[10px] border-b border-[#dfd0bd] pb-1">
                Fiche Technique de Récolte
              </div>
              <div className="flex justify-between">
                <span className="text-[#78350f]">Seuil de difficulté :</span>
                <span className="font-mono font-bold text-[#b45309]">DD {plant.dcHarvest} (Survie/Nature)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78350f]">Saison propice :</span>
                <span>{plant.season}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78350f]">Partie utilisée :</span>
                <span className="text-right font-medium">{plant.partsUsed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78350f]">Préparation :</span>
                <span>{plant.preparationMethod} ({plant.preparationTime})</span>
              </div>
              <div className="flex justify-between border-t border-[#dfd0bd] pt-1">
                <span className="text-[#78350f]">Valeur marchande :</span>
                <span className="font-bold text-[#854d0e]">{plant.value}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions & Game Rules */}
          <div className="space-y-4 font-serif text-xs leading-relaxed text-[#331c12]">
            {/* Morphological Description */}
            <div>
              <h4 className="font-bold text-sm text-[#78350f] mb-1 flex items-center gap-1.5">
                <Feather className="w-4 h-4 text-[#854d0e]" />
                Description Morphologique
              </h4>
              <p className="text-[#3b271d] mb-2">{plant.description}</p>
              <p className="text-[#59473b] italic bg-[#faf6ee] p-2.5 rounded border border-[#dfd0bc]">
                <strong>Aspect en nature :</strong> {plant.botanicalAppearance}
              </p>
            </div>

            {/* In-Game Effects */}
            <div>
              <h4 className="font-bold text-sm text-[#78350f] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#b45309]" />
                Vertus & Effets en Jeu (D&D 5e)
              </h4>
              <div className="space-y-2">
                {plant.gameEffects.map((eff, i) => (
                  <div key={i} className="bg-[#f0e7d3] p-2.5 rounded border border-[#cfbca2]">
                    <div className="font-bold text-[#451a03] text-xs">
                      {eff.title}
                      {eff.saveDc && (
                        <span className="ml-2 font-mono text-[10px] bg-[#d97706]/20 px-1 py-0.5 rounded text-[#78350f]">
                          JdS DD {eff.saveDc}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[#2b1810]">{eff.description}</p>
                    {eff.duration && (
                      <span className="block text-[10px] text-[#78350f] italic mt-1">
                        Durée d'action : {eff.duration}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Toxicity alert if any */}
            {plant.toxicityWarning && (
              <div className="bg-[#fee2e2]/70 border border-[#fca5a5] p-2.5 rounded flex items-start gap-2 text-[#991b1b]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Toxicité & Dangerosité :</strong>
                  <span>{plant.toxicityWarning}</span>
                </div>
              </div>
            )}

            {/* Druidic Lore */}
            <div className="bg-[#faf6ee] p-3 rounded border-l-4 border-[#854d0e] italic text-[#5c3e29]">
              {plant.druidicLore}
            </div>
          </div>
        </div>

        {/* Associated Alchemical Recipes Section */}
        {associatedRecipes.length > 0 && (
          <div className="border-t-2 border-[#854d0e]/30 pt-4 mt-6">
            <h4 className="font-serif font-bold text-sm text-[#78350f] mb-3 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#854d0e]" />
              Concoctions Alchimiques associées ({associatedRecipes.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {associatedRecipes.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-[#faf6ee] p-3 rounded border border-[#c4a47c] text-xs font-serif"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-[#451a03]">{rec.name}</span>
                    <span className="font-mono text-[#b45309] font-bold">{rec.marketPrice}</span>
                  </div>
                  <p className="text-[11px] text-[#59473b] mb-1">{rec.effect}</p>
                  <div className="text-[10px] text-[#78350f] italic">
                    Brassage : {rec.brewingTime} · DD {rec.difficultyDC}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-[#c4a47c] flex justify-between items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded bg-[#3d2719] text-[#fef08a] border border-[#854d0e] font-serif font-bold text-xs hover:bg-[#523724] transition shadow flex items-center gap-1.5"
          >
            <span>Imprimer cette Fiche</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-[#78350f] text-[#fef08a] font-serif font-bold text-xs hover:bg-[#8e3f13] transition shadow"
          >
            Fermer la Fiche
          </button>
        </div>
      </div>
    </div>
  );
};
