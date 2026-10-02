import React, { useState } from 'react';
import { AlchemicalRecipe, Plant } from '../types/herb';
import { FlaskConical, Sparkles, Flame, CheckCircle, XCircle, Clock, ShieldCheck, Dices, Wand2, BookOpen, Skull } from 'lucide-react';
import { RandomPotionTableGenerator } from './RandomPotionTableGenerator';
import { AdvancedAlchemicalLab } from './AdvancedAlchemicalLab';

interface AlchemicalWorkshopProps {
  recipes: AlchemicalRecipe[];
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  onNavigateToPoisons?: () => void;
}

export const AlchemicalWorkshop: React.FC<AlchemicalWorkshopProps> = ({
  recipes,
  plants,
  onSelectPlant,
  onNavigateToPoisons,
}) => {
  const [subTab, setSubTab] = useState<'recettes' | 'atelier_avance' | 'table_aleatoire'>('atelier_avance');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeRecipe, setActiveRecipe] = useState<AlchemicalRecipe>(recipes[0]);
  const [alchemistBonus, setAlchemistBonus] = useState<number>(5);
  const [brewResult, setBrewResult] = useState<{
    roll: number;
    total: number;
    success: boolean;
    critSuccess?: boolean;
    critFail?: boolean;
  } | null>(null);

  const filteredRecipes = selectedCategory === 'all'
    ? recipes
    : recipes.filter(r => r.category === selectedCategory);

  const handleBrewAttempt = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + alchemistBonus;
    const success = d20 === 20 || (d20 !== 1 && total >= activeRecipe.difficultyDC);

    setBrewResult({
      roll: d20,
      total,
      success,
      critSuccess: d20 === 20,
      critFail: d20 === 1,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Title */}
      <div className="mb-6 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#d4af37] drop-shadow flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-[#a855f7]" />
            Atelier d'Alchimie & de Concoction
          </h2>
          <p className="text-sm text-[#c4b5a5] italic font-serif">
            Transformez vos herbes sauvages en potions miraculeuses, baumes protecteurs et poisons subtils
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex bg-[#1f1915] p-1 rounded-xl border border-[#4a3b32] shadow-inner gap-1 flex-wrap">
          <button
            onClick={() => setSubTab('atelier_avance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-serif transition ${
              subTab === 'atelier_avance'
                ? 'bg-[#854d0e] text-white font-bold shadow ring-1 ring-[#fde047]'
                : 'text-[#e9d5ff] hover:text-white hover:bg-[#2c2018]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#c084fc] animate-pulse" />
            <span>Atelier d'Alchimie Avancé (Plantes & Minéraux)</span>
          </button>

          <button
            onClick={() => setSubTab('recettes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-serif transition ${
              subTab === 'recettes'
                ? 'bg-[#b45309] text-white font-bold shadow'
                : 'text-[#d7c9b8] hover:text-white hover:bg-[#2c2018]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#fde047]" />
            <span>Recettes Officielles ({recipes.length})</span>
          </button>

          <button
            onClick={() => setSubTab('table_aleatoire')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-serif transition ${
              subTab === 'table_aleatoire'
                ? 'bg-[#b45309] text-white font-bold shadow'
                : 'text-[#fef08a] hover:text-white hover:bg-[#2c2018]'
            }`}
          >
            <Wand2 className="w-4 h-4 text-[#fde047]" />
            <span>Table d'Effets Aléatoires</span>
          </button>

          {onNavigateToPoisons && (
            <button
              onClick={onNavigateToPoisons}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-serif text-[#fca5a5] hover:bg-[#381414] border border-[#ef4444]/40 transition"
            >
              <Skull className="w-3.5 h-3.5 text-[#ef4444]" />
              <span>Compendium des Poisons</span>
            </button>
          )}
        </div>
      </div>

      {subTab === 'atelier_avance' ? (
        <AdvancedAlchemicalLab plants={plants} onSelectPlant={onSelectPlant} />
      ) : subTab === 'table_aleatoire' ? (
        <RandomPotionTableGenerator plants={plants} />
      ) : (
        /* Main Grid: Left Recipes list, Right Brewing Station */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recipes Catalogue */}
        <div className="lg:col-span-7 space-y-4">
          {/* Categories Tab */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'potion', 'onguent', 'poison', 'teinture'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-serif capitalize transition ${
                  selectedCategory === cat
                    ? 'bg-[#d4af37] text-[#1c140d] font-bold shadow'
                    : 'bg-[#261d17] text-[#d7c9b8] hover:bg-[#382b22] border border-[#524136]'
                }`}
              >
                {cat === 'all' ? 'Toutes les Concoctions' : cat + 's'}
              </button>
            ))}
          </div>

          {/* Recipe Cards List */}
          <div className="space-y-3">
            {filteredRecipes.map((rec) => {
              const isSelected = activeRecipe.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => {
                    setActiveRecipe(rec);
                    setBrewResult(null);
                  }}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#3b271b] border-[#d4af37] text-white shadow-lg'
                      : 'bg-[#241c16] border-[#4a3a2e] text-[#e6d8c3] hover:border-[#854d0e]'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-base text-[#fef08a]">
                          {rec.name}
                        </h4>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#181310] text-[#cbd5e1] border border-[#524136]">
                          {rec.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#a89988] font-serif mt-0.5">
                        DD Alchimie : <strong className="text-[#fde047]">DD {rec.difficultyDC}</strong> · Durée : {rec.brewingTime}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#fde047] bg-[#181310] px-2.5 py-1 rounded border border-[#59473b]">
                      {rec.marketPrice}
                    </span>
                  </div>

                  <p className="text-xs font-serif text-[#d7c9b8] mb-2 line-clamp-2">
                    {rec.effect}
                  </p>

                  <div className="text-[11px] font-serif flex flex-wrap gap-1 items-center text-[#c4b5a5]">
                    <span className="text-[#a89988]">Ingrédients :</span>
                    {rec.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="bg-[#181310] px-2 py-0.5 rounded border border-[#4a392d] text-[#fef08a]"
                      >
                        {ing.quantity}x {ing.plantName}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Brewing Crucible / Alambic */}
        <div className="lg:col-span-5">
          <div className="bg-[#f7f2e7] text-[#2c1810] rounded-xl border-4 border-[#5c3e29] p-6 shadow-2xl sticky top-24">
            <div className="text-center border-b-2 border-[#854d0e]/30 pb-3 mb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#854d0e] font-serif font-bold">
                Creuset & Alambic d'Herboriste
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#3a1d0f]">
                {activeRecipe.name}
              </h3>
            </div>

            {/* Ingredients Check list */}
            <div className="bg-[#efe8d8] rounded-lg border border-[#c4a47c] p-3 text-xs font-serif mb-4">
              <span className="font-bold text-[#78350f] uppercase tracking-wider text-[10px] block mb-1">
                Formule & Matières Premières
              </span>
              <ul className="space-y-1">
                {activeRecipe.ingredients.map((ing, i) => {
                  const targetPlant = plants.find(p => p.id === ing.plantId);
                  return (
                    <li key={i} className="flex justify-between items-center">
                      <span
                        onClick={() => targetPlant && onSelectPlant(targetPlant)}
                        className="text-[#451a03] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        • {ing.quantity}x {ing.plantName} ({ing.part})
                      </span>
                      <span className="text-[10px] text-[#78350f] italic">Requis</span>
                    </li>
                  );
                })}
                {activeRecipe.additionalComponents.map((comp, i) => (
                  <li key={i} className="text-[#6b4c35] italic">
                    + {comp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Effect in detail */}
            <div className="bg-[#f4ecd8] p-3 rounded border border-[#dfd0bd] text-xs font-serif mb-4">
              <span className="font-bold text-[#78350f] block mb-0.5">Propriétés de la Concoction :</span>
              <p className="text-[#3b271d]">{activeRecipe.effect}</p>
              <div className="mt-2 pt-2 border-t border-[#dfd0bd] flex justify-between text-[11px] text-[#78350f]">
                <span>Conservation : {activeRecipe.shelfLife}</span>
                <span>Prix estimé : {activeRecipe.marketPrice}</span>
              </div>
            </div>

            {/* Simulation controls */}
            <div className="border-t border-[#c4a47c] pt-4 mb-4">
              <div className="flex items-center justify-between text-xs font-serif mb-3">
                <label className="text-[#78350f] font-semibold">
                  Bonus d'Alchimiste / Outils (Int + Maîtrise) :
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={alchemistBonus}
                    onChange={(e) => setAlchemistBonus(parseInt(e.target.value) || 0)}
                    className="w-14 bg-white border border-[#c4a47c] rounded px-2 py-1 text-center font-mono font-bold text-[#451a03]"
                  />
                </div>
              </div>

              <button
                onClick={handleBrewAttempt}
                className="w-full py-2.5 bg-[#78350f] hover:bg-[#8e3f13] text-[#fef08a] font-serif font-bold text-sm rounded shadow transition flex items-center justify-center gap-2"
              >
                <Dices className="w-5 h-5 text-[#fde047]" />
                <span>Tenter la Concoction (DD {activeRecipe.difficultyDC})</span>
              </button>
            </div>

            {/* Result card if rolled */}
            {brewResult && (
              <div
                className={`p-3 rounded-lg border text-xs font-serif animate-fade-in ${
                  brewResult.success
                    ? 'bg-[#dcfce7] border-[#86efac] text-[#14532d]'
                    : 'bg-[#fee2e2] border-[#fca5a5] text-[#7f1d1d]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {brewResult.success ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-[#16a34a]" />
                      <span>
                        {brewResult.critSuccess ? 'Réussite Critique Légendaire !' : 'Concoction Réussie !'}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-[#dc2626]" />
                      <span>
                        {brewResult.critFail ? 'Échec Critique : Le chaudron explose !' : 'Échec de la Concoction'}
                      </span>
                    </>
                  )}
                </div>
                <p>
                  Jet : <strong>1d20 ({brewResult.roll})</strong> + bonus ({alchemistBonus}) ={' '}
                  <strong>{brewResult.total}</strong> contre DD {activeRecipe.difficultyDC}.
                </p>
                <p className="mt-1 text-[11px] italic">
                  {brewResult.success
                    ? `Vous obtenez 1 fiole de ${activeRecipe.name} d'une pureté parfaite.`
                    : 'Les réactifs se sont troublés et ont perdu leurs propriétés curatives.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
