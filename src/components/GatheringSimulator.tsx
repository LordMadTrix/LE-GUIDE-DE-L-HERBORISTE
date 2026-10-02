import React, { useState } from 'react';
import { Plant, BiomeType } from '../types/herb';
import { BIOMES_METADATA } from '../data/herbalistData';
import { BotanicalIllustration } from './BotanicalIllustration';
import { Compass, Dices, Sparkles, Sun, CloudRain, Snowflake, Moon, Trees, CheckCircle2, AlertCircle, BookMarked } from 'lucide-react';

interface GatheringSimulatorProps {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  onNavigateToGuide?: () => void;
}

export const GatheringSimulator: React.FC<GatheringSimulatorProps> = ({
  plants,
  onSelectPlant,
  onNavigateToGuide,
}) => {
  const [selectedBiome, setSelectedBiome] = useState<BiomeType>('foret');
  const [searchDuration, setSearchDuration] = useState<'1h' | '4h'>('4h');
  const [weatherCondition, setWeatherCondition] = useState<number>(0); // modifier
  const [weatherLabel, setWeatherLabel] = useState<string>('Climat standard / Tempéré');
  const [skillBonus, setSkillBonus] = useState<number>(4);
  const [isMoonlit, setIsMoonlit] = useState<boolean>(false);
  const [diceMode, setDiceMode] = useState<'virtual' | 'manual'>('virtual');
  const [manualD20, setManualD20] = useState<number>(12);

  const [lastRoll, setLastRoll] = useState<{
    d20: number;
    d20Alt?: number;
    modifier: number;
    total: number;
    foundPlants: { plant: Plant; quantity: number }[];
    flavorText: string;
  } | null>(null);

  const handleForageRoll = (customRoll?: number) => {
    let d20: number;
    let r1 = 0;
    let r2 = 0;

    if (customRoll !== undefined) {
      d20 = Math.min(20, Math.max(1, customRoll));
    } else if (diceMode === 'manual') {
      d20 = Math.min(20, Math.max(1, manualD20));
    } else {
      // Dice roll with advantage if moonlit and night
      r1 = Math.floor(Math.random() * 20) + 1;
      r2 = Math.floor(Math.random() * 20) + 1;
      d20 = isMoonlit ? Math.max(r1, r2) : r1;
    }

    // Duration modifier: 1h gives -2 penalty
    const durationMod = searchDuration === '1h' ? -2 : 0;
    const totalMod = skillBonus + weatherCondition + durationMod;
    const finalTotal = d20 + totalMod;

    // Filter plants in that biome
    const biomePlants = plants.filter(p => p.biome === selectedBiome);

    // Determine plants found according to roll
    const found: { plant: Plant; quantity: number }[] = [];
    let flavor = '';

    if (finalTotal < 10) {
      flavor = 'Après de longues recherches, vos mains ne trouvent que des ronces sèches et des mousses stériles.';
    } else {
      // Find candidate plants that match the DC
      const candidates = biomePlants.filter(p => p.dcHarvest <= finalTotal);
      if (candidates.length > 0) {
        // Sort descending by DC to give the best available
        candidates.sort((a, b) => b.dcHarvest - a.dcHarvest);
        const topPlant = candidates[0];
        const qty = searchDuration === '4h' ? Math.floor(Math.random() * 3) + 1 : 1;
        found.push({ plant: topPlant, quantity: qty });

        // Add a common second plant if roll was very high
        if (finalTotal >= 16 && candidates.length > 1) {
          const secondPlant = candidates[candidates.length - 1];
          if (secondPlant.id !== topPlant.id) {
            found.push({ plant: secondPlant, quantity: Math.floor(Math.random() * 2) + 1 });
          }
        }

        flavor = `Excellente trouvaille ! Vous apercevez des spécimens vigoureux au creux de la végétation.`;
      } else {
        flavor = 'Le biotope est hostile et vos recherches ne donnent aucun résultat concluant.';
      }
    }

    setLastRoll({
      d20,
      d20Alt: isMoonlit ? (r1 === d20 ? r2 : r1) : undefined,
      modifier: totalMod,
      total: finalTotal,
      foundPlants: found,
      flavorText: flavor,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#d4af37] drop-shadow flex items-center gap-3">
            <Compass className="w-8 h-8 text-[#4ade80]" />
            Simulateur de Cueillette & Recherches Botaniques
          </h2>
          <p className="text-sm text-[#c4b5a5] italic font-serif">
            Générez les récoltes de vos séances de jeu selon les règles D&D 5e et conditions environnementales
          </p>
        </div>

        {onNavigateToGuide && (
          <button
            onClick={onNavigateToGuide}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#3b271b] hover:bg-[#4a3424] text-[#fef08a] border border-[#d4af37]/60 font-serif font-bold text-xs shadow transition shrink-0"
          >
            <BookMarked className="w-4 h-4 text-[#fde047]" />
            <span>Guide du Récolteur & Calculateur DD</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 bg-[#241c16] rounded-xl border border-[#4d3a2e] p-5 sm:p-6 text-sm text-[#e6d8c3] shadow-xl space-y-5">
          {/* Biome Selection */}
          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-[#a89988] mb-2 font-bold">
              1. Sélectionnez le Biome Exploré
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(BIOMES_METADATA).map(([key, data]) => {
                const isSelected = selectedBiome === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedBiome(key as BiomeType)}
                    className={`p-2.5 rounded-lg border text-left font-serif transition ${
                      isSelected
                        ? 'bg-[#451a03] border-[#fde047] text-[#fef08a] shadow'
                        : 'bg-[#181310] border-[#3e2e23] text-[#c4b5a5] hover:border-[#854d0e]'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{data.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Duration */}
          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-[#a89988] mb-2 font-bold">
              2. Temps Consacré à la Cueillette
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSearchDuration('1h')}
                className={`p-3 rounded-lg border text-left font-serif transition ${
                  searchDuration === '1h'
                    ? 'bg-[#3b271b] border-[#d4af37] text-[#fef08a]'
                    : 'bg-[#181310] border-[#3e2e23] text-[#c4b5a5]'
                }`}
              >
                <div className="font-bold text-xs">Fouille Rapide (1 heure)</div>
                <div className="text-[11px] text-[#a89988] mt-0.5">Pénalité de -2 au jet</div>
              </button>
              <button
                onClick={() => setSearchDuration('4h')}
                className={`p-3 rounded-lg border text-left font-serif transition ${
                  searchDuration === '4h'
                    ? 'bg-[#3b271b] border-[#d4af37] text-[#fef08a]'
                    : 'bg-[#181310] border-[#3e2e23] text-[#c4b5a5]'
                }`}
              >
                <div className="font-bold text-xs">Fouille Approfondie (4 heures)</div>
                <div className="text-[11px] text-[#a89988] mt-0.5">Jet normal, récolte maximale</div>
              </button>
            </div>
          </div>

          {/* Weather and Moon Modifiers */}
          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-[#a89988] mb-2 font-bold">
              3. Météo & Conditions d'Éclairage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Printemps ensoleillé', mod: 2, icon: Sun },
                { label: 'Temps doux', mod: 0, icon: Trees },
                { label: 'Pluie / Brume', mod: -2, icon: CloudRain },
                { label: 'Grand froid / Tempête', mod: -4, icon: Snowflake },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setWeatherCondition(item.mod);
                    setWeatherLabel(item.label);
                  }}
                  className={`p-2 rounded border text-center font-serif text-xs transition ${
                    weatherCondition === item.mod && weatherLabel === item.label
                      ? 'bg-[#451a03] border-[#fde047] text-[#fef08a]'
                      : 'bg-[#181310] border-[#3e2e23] text-[#c4b5a5]'
                  }`}
                >
                  <item.icon className="w-4 h-4 mx-auto mb-1 text-[#d4af37]" />
                  <div className="truncate text-[11px]">{item.label}</div>
                  <div className="font-mono text-[10px] text-[#fde047]">
                    {item.mod > 0 ? `+${item.mod}` : item.mod}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="moonlit"
                checked={isMoonlit}
                onChange={(e) => setIsMoonlit(e.target.checked)}
                className="w-4 h-4 rounded text-[#d4af37] focus:ring-0"
              />
              <label htmlFor="moonlit" className="text-xs font-serif text-[#fef08a] cursor-pointer flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-[#38bdf8]" />
                Nuit de pleine lune (Avantage au jet pour herbes nocturnes)
              </label>
            </div>
          </div>

          {/* Skill bonus */}
          <div className="flex items-center justify-between border-t border-[#3e2e23] pt-4">
            <div>
              <span className="font-serif font-bold text-xs text-[#fef08a] block">
                Bonus de Compétence du Joueur
              </span>
              <span className="text-[11px] font-serif text-[#a89988]">
                Sagesse (Survie) ou Intelligence (Nature) + Kit d'herboristerie
              </span>
            </div>
            <input
              type="number"
              min="-2"
              max="15"
              value={skillBonus}
              onChange={(e) => setSkillBonus(parseInt(e.target.value) || 0)}
              className="w-16 bg-[#181310] border border-[#59473b] rounded px-2 py-1 text-center font-mono font-bold text-[#fde047] text-base"
            />
          </div>

          {/* Dice Mode Toggle: Dé Virtuel ou Saisie Manuelle */}
          <div className="bg-[#181310] p-3 rounded-lg border border-[#3e2e23] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#fef08a] flex items-center gap-1.5">
                <Dices className="w-3.5 h-3.5 text-[#d4af37]" />
                Mode de Lancer
              </span>
              <div className="flex items-center gap-1 bg-[#241c16] p-0.5 rounded border border-[#3e2e23]">
                <button
                  type="button"
                  onClick={() => setDiceMode('virtual')}
                  className={`px-2 py-0.5 rounded text-[10px] transition ${
                    diceMode === 'virtual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                  }`}
                >
                  Dé Virtuel
                </button>
                <button
                  type="button"
                  onClick={() => setDiceMode('manual')}
                  className={`px-2 py-0.5 rounded text-[10px] transition ${
                    diceMode === 'manual' ? 'bg-[#854d0e] text-white font-bold' : 'text-[#a89988]'
                  }`}
                >
                  Jet Manuel (Dé Réel)
                </button>
              </div>
            </div>

            {diceMode === 'manual' && (
              <div className="flex items-center justify-between pt-1 border-t border-[#2e2118]">
                <label className="text-[11px] text-[#cbd5e1]">
                  Résultat de votre dé physique d20 (1 à 20) :
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={manualD20}
                  onChange={(e) => setManualD20(parseInt(e.target.value) || 1)}
                  className="w-16 bg-[#120e0b] border border-[#d4af37] rounded px-2 py-1 text-center font-mono font-bold text-[#fde047] text-base focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Roll Button */}
          <button
            onClick={() => handleForageRoll()}
            className="w-full py-3 bg-[#b45309] hover:bg-[#d97706] text-white font-serif font-bold text-base rounded-lg shadow-lg transition flex items-center justify-center gap-2"
          >
            <Dices className="w-5 h-5 text-[#fef08a] animate-bounce" />
            <span>
              {diceMode === 'manual'
                ? `Valider mon Jet Manuel (${manualD20}) + Bonus (${skillBonus >= 0 ? `+${skillBonus}` : skillBonus})`
                : 'Lancer le Jet de Cueillette d20'}
            </span>
          </button>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6">
          <div className="bg-[#f7f2e7] text-[#2c1810] rounded-xl border-4 border-[#5c3e29] p-6 shadow-2xl min-h-[460px] flex flex-col justify-between">
            <div>
              <div className="text-center border-b-2 border-[#854d0e]/30 pb-3 mb-4">
                <span className="text-[10px] uppercase tracking-widest text-[#854d0e] font-serif font-bold">
                  Compte-Rendu de Cueillette
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#3a1d0f]">
                  Résultats sur le Terrain
                </h3>
              </div>

              {lastRoll ? (
                <div className="space-y-4">
                  {/* Dice breakdown */}
                  <div className="bg-[#efe8d8] p-3 rounded-lg border border-[#c4a47c] flex items-center justify-between font-serif text-xs">
                    <div>
                      <span className="text-[#78350f] font-semibold block">Résultat du Jet :</span>
                      <span>
                        d20 (<strong>{lastRoll.d20}</strong>) {lastRoll.modifier >= 0 ? `+ ${lastRoll.modifier}` : `${lastRoll.modifier}`}
                        {lastRoll.d20Alt && ` [Jet sous avantage, rejet : ${lastRoll.d20Alt}]`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-[#78350f] block">Score Total</span>
                      <span className="text-2xl font-mono font-extrabold text-[#b45309]">
                        {lastRoll.total}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-serif italic text-[#523724] bg-[#faf6ee] p-2.5 rounded border border-[#dfd0bd]">
                    {lastRoll.flavorText}
                  </p>

                  {/* Plants Found */}
                  {lastRoll.foundPlants.length > 0 ? (
                    <div className="space-y-3">
                      <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#78350f] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                        Spécimens Récoltés ({lastRoll.foundPlants.length})
                      </div>

                      {lastRoll.foundPlants.map(({ plant, quantity }, idx) => (
                        <div
                          key={idx}
                          onClick={() => onSelectPlant(plant)}
                          className="bg-[#faf6ee] p-3 rounded-lg border border-[#c4a47c] flex items-center gap-3 cursor-pointer hover:shadow-md transition"
                        >
                          <BotanicalIllustration
                            plant={plant}
                            size="sm"
                            showPlateDetails={false}
                            className="w-16 h-16 shrink-0"
                          />
                          <div className="text-xs font-serif w-full">
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-[#3a1d0f] text-sm hover:underline">
                                {plant.name}
                              </span>
                              <span className="font-bold text-[#b45309] font-mono text-sm">
                                {quantity} dose(s)
                              </span>
                            </div>
                            <div className="text-[11px] text-[#78350f] italic">
                              {plant.latinName} · DD {plant.dcHarvest}
                            </div>
                            <p className="text-[11px] text-[#451a03] line-clamp-1 mt-1">
                              {plant.gameEffects[0]?.title} : {plant.gameEffects[0]?.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-[#fee2e2]/60 border border-[#fca5a5] rounded text-center text-xs font-serif text-[#991b1b]">
                      <AlertCircle className="w-5 h-5 mx-auto mb-1 text-[#dc2626]" />
                      <span>Aucune herbe remarquable n'a pu être identifiée avec ce score.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-[#78350f] font-serif">
                  <Compass className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#854d0e]" />
                  <p className="text-base font-bold mb-1">Aucune expédition en cours</p>
                  <p className="text-xs max-w-xs mx-auto text-[#6b4c35]">
                    Configurez votre environnement à gauche et cliquez sur « Lancer le Jet de Cueillette » pour simuler la récolte d'herbes.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-[#c4a47c] pt-3 text-[11px] font-serif text-[#78350f] flex justify-between">
              <span>Règles D&D 5e / AD&D</span>
              <span>Guide de l'Herboriste</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
