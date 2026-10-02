import React, { useState, useMemo } from 'react';
import { Plant } from '../types/herb';
import { GEMS_LIST } from '../data/gemData';
import { Sparkles, Dices, FlaskConical, AlertTriangle, Printer, Copy, Check, RefreshCw, Wand2, ShieldAlert } from 'lucide-react';

interface RandomPotionTableGeneratorProps {
  plants: Plant[];
}

export interface PotionTableEntry {
  roll: string; // e.g. "01-02", "03-04" or "1", "2"...
  d20Value: number;
  type: 'catastrophe' | 'bizarre' | 'mineur' | 'majeur' | 'surpuissant' | 'miracle';
  title: string;
  description: string;
  duration: string;
  synergyOrigin: string;
}

export const RandomPotionTableGenerator: React.FC<RandomPotionTableGeneratorProps> = ({
  plants,
}) => {
  // Pre-filter rare/epic ingredients
  const rarePlants = useMemo(() => {
    return plants.filter(p => ['rare', 'tres_rare', 'legendaire'].includes(p.rarity));
  }, [plants]);

  // Selected ingredients IDs (defaults to 3 iconic rare herbs)
  const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([
    'fleur_de_lune',
    'sang_de_dragon',
    'mandragore_criarde',
  ]);

  const [includeGems, setIncludeGems] = useState<boolean>(true);
  const [selectedGemId, setSelectedGemId] = useState<string>('rubis');

  // Interactive dice testing
  const [d20Roll, setD20Roll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Selected plant objects
  const selectedPlants = useMemo(() => {
    return plants.filter(p => selectedPlantIds.includes(p.id));
  }, [plants, selectedPlantIds]);

  const selectedGem = useMemo(() => {
    return includeGems ? GEMS_LIST.find(g => g.id === selectedGemId) || null : null;
  }, [includeGems, selectedGemId]);

  // Toggle plant selection
  const handleTogglePlant = (id: string) => {
    if (selectedPlantIds.includes(id)) {
      if (selectedPlantIds.length > 1) {
        setSelectedPlantIds(selectedPlantIds.filter(pid => pid !== id));
      }
    } else {
      if (selectedPlantIds.length < 5) {
        setSelectedPlantIds([...selectedPlantIds, id]);
      }
    }
  };

  // Preset cocktails
  const handleApplyPreset = (presetName: string) => {
    switch (presetName) {
      case 'lunaire':
        setSelectedPlantIds(['fleur_de_lune', 'champignon_cephale', 'atigax']);
        setIncludeGems(true);
        setSelectedGemId('pierre_de_lune');
        break;
      case 'titanesque':
        setSelectedPlantIds(['kathkusa', 'sang_de_dragon', 'aconit_tue_loup']);
        setIncludeGems(true);
        setSelectedGemId('rubis');
        break;
      case 'elementaire':
        setSelectedPlantIds(['fleur_de_givre', 'epine_de_braise', 'cactus_fleche_de_fer']);
        setIncludeGems(true);
        setSelectedGemId('saphir');
        break;
      case 'miraculeux':
        setSelectedPlantIds(['lotus_dor', 'mandragore_criarde', 'fleur_olvar']);
        setIncludeGems(true);
        setSelectedGemId('diamant');
        break;
      case 'tenebreux':
        setSelectedPlantIds(['racine_dombre', 'belladone_noire', 'gallowgrass']);
        setIncludeGems(true);
        setSelectedGemId('obsidienne');
        break;
      default:
        break;
    }
    setD20Roll(null);
  };

  // Generate the 20 entries tailored dynamically to the selected ingredients
  const generatedTable: PotionTableEntry[] = useMemo(() => {
    const pNames = selectedPlants.map(p => p.name);
    const gemName = selectedGem ? selectedGem.name : '';
    const mainIngredient = selectedPlants[0] || plants[0];
    const secondaryIngredient = selectedPlants[1] || mainIngredient;
    const thirdIngredient = selectedPlants[2] || secondaryIngredient;

    return [
      {
        roll: '1',
        d20Value: 1,
        type: 'catastrophe',
        title: 'Éruption Gastrique & Fumée Caustique',
        description: `Le mélange entre ${mainIngredient.name} et ${secondaryIngredient.name} se révèle trop instable. Le buveur vomit d'épaisses volutes de fumée sulfureuse, subissant 2d6 dégâts d'acide et étant incapable de parler ou lancer des sorts avec composante verbale pendant 10 minutes.`,
        duration: '10 minutes',
        synergyOrigin: 'Incompatibilité d\'essence végétale',
      },
      {
        roll: '2',
        d20Value: 2,
        type: 'catastrophe',
        title: 'Pétrification Cutanée Partielle',
        description: `La potion cristallise brutalement dans les veines. La peau prend la texture rugueuse de l'écorce ou du basalte. La vitesse de déplacement est divisée par deux et le buveur a un désavantage à tous ses jets de Dextérité pendant 1 heure.`,
        duration: '1 heure',
        synergyOrigin: 'Précipitation minérale instable',
      },
      {
        roll: '3',
        d20Value: 3,
        type: 'bizarre',
        title: 'Bioluminescence Chaotique & Voix Spectrale',
        description: `Tout le corps du buveur se met à luire d'une intense phosphorescence ${mainIngredient.accentColor} visible à 30 mètres (impossible de se cacher). Sa voix résonne comme un écho caverneux doublé en langue sylvestre.`,
        duration: '1 heure',
        synergyOrigin: `Résurgence luminescente de ${mainIngredient.name}`,
      },
      {
        roll: '4',
        d20Value: 4,
        type: 'bizarre',
        title: 'Lévitation Spontanée Involontaire',
        description: `Le corps du buveur devient plus léger que l'air et flotte à 30 centimètres au-dessus du sol. Il flotte sans toucher terre, ce qui l'immunise contre les pièges au sol mais réduit sa vitesse au sol à 4,5 mètres en flottant gauchement.`,
        duration: '30 minutes',
        synergyOrigin: `Volatilité des principes actifs de ${secondaryIngredient.name}`,
      },
      {
        roll: '5',
        d20Value: 5,
        type: 'bizarre',
        title: 'Oreilles de Faune & Ouïe Hyperesthésique',
        description: `Des oreilles animales pointues ou couvertes de feuilles poussent temporairement. Le buveur entend le battement de cœur des créatures à 15 mètres (+3 en Perception auditive), mais devient vulnérable aux dégâts de tonnerre.`,
        duration: '2 heures',
        synergyOrigin: 'Mutation mimétique sylvestre',
      },
      {
        roll: '6',
        d20Value: 6,
        type: 'mineur',
        title: 'Tonique Réparateur Instable',
        description: `Restaure immédiatement 2d4 + 2 points de vie, mais le buveur est pris d'une sensation de froid intense ou de chaleur étouffante qui lui inflige un malus de -1 à son premier jet d'attaque.`,
        duration: 'Instantané (effet secondaire 10 min)',
        synergyOrigin: `Fraction restauratrice de ${mainIngredient.name}`,
      },
      {
        roll: '7',
        d20Value: 7,
        type: 'mineur',
        title: 'Regard des Brumes & Dilatation Pupillaire',
        description: `Les yeux du buveur s'illuminent d'un voile argenté. Il obtient la Vision dans le Noir jusqu'à 18 mètres, mais la lumière vive du plein jour lui inflige un désavantage aux tests de Perception.`,
        duration: '4 heures',
        synergyOrigin: `Affinité oculaire de ${secondaryIngredient.name}`,
      },
      {
        roll: '8',
        d20Value: 8,
        type: 'mineur',
        title: 'Afflux de Vitalité Sanguine',
        description: `Accorde 1d8 + 3 points de vie temporaires. Pendant toute la durée, le sang du personnage coagule instantanément : il est immunisé contre les saignements d'armes tranchantes.`,
        duration: '1 heure',
        synergyOrigin: `Propriétés coagulantes de la décoction`,
      },
      {
        roll: '9',
        d20Value: 9,
        type: 'mineur',
        title: 'Élasticité Musculaire & Bond de Grenouille',
        description: `Les muscles des jambes se gorgent d'une sève tonique. La hauteur et la distance des sauts du personnage sont triplées, et les dégâts de chute sont réduits de 10 points.`,
        duration: '1 heure',
        synergyOrigin: `Sève tonique de ${thirdIngredient.name}`,
      },
      {
        roll: '10',
        d20Value: 10,
        type: 'majeur',
        title: `Élixir Harmonisant de ${mainIngredient.name}`,
        description: `Restaure 3d8 + 4 points de vie et élimine un niveau d'épuisement. Confère en outre la résistance aux dégâts de poison pendant 2 heures.`,
        duration: '2 heures',
        synergyOrigin: `Effet plein de ${mainIngredient.name}`,
      },
      {
        roll: '11',
        d20Value: 11,
        type: 'majeur',
        title: 'Blindage Épidermique Écorce-de-Fer',
        description: `La peau du personnage se durcit en une cuirasse végétale satinée : sa Classe d'Armure ne peut pas être inférieure à 16, et il gagne un bonus de +1 aux jets de sauvegarde de Force.`,
        duration: '1 heure',
        synergyOrigin: `Résine durcie de ${secondaryIngredient.name}`,
      },
      {
        roll: '12',
        d20Value: 12,
        type: 'majeur',
        title: 'Souffle Élémentaire & Résonance Arcanique',
        description: `Le buveur peut souffler, une fois durant la durée du breuvage, un cône de 4,5 mètres d'énergie élémentaire infligeant 3d6 dégâts (Feu, Froid ou Foudre selon les ingrédients) avec JdS Dextérité DD 14 pour demi-dégâts.`,
        duration: '1 heure (ou jusqu\'à utilisation du souffle)',
        synergyOrigin: selectedGem ? `Catalyse cristalline de ${gemName}` : `Énergie élémentaire de ${mainIngredient.name}`,
      },
      {
        roll: '13',
        d20Value: 13,
        type: 'majeur',
        title: 'Vélocité Sylvestre & Réflexes d\'Éclair',
        description: `La vitesse de déplacement augmente de 3 mètres. Le buveur peut effectuer l'action Se Dérober ou Foncer par une action bonus à chaque tour.`,
        duration: '10 minutes',
        synergyOrigin: `Dynamisme végétal de ${thirdIngredient.name}`,
      },
      {
        roll: '14',
        d20Value: 14,
        type: 'majeur',
        title: 'Clarté Psychique & Barrière Mentale',
        description: `Le buveur devient immunisé contre les états Charmé, Effrayé et les tentatives de lecture de pensée. Ses sorts arcaniques ou divins de niveau 1 voient leur portée doublée.`,
        duration: '4 heures',
        synergyOrigin: `Émanations astrales de ${mainIngredient.name}`,
      },
      {
        roll: '15',
        d20Value: 15,
        type: 'majeur',
        title: 'Décharge Alchimique sur les Armes',
        description: `La sueur du buveur exsude un suc magique qui imprègne ses armes de corps à corps : toutes les attaques réussies infligent 1d6 dégâts magiques supplémentaires du type lié aux plantes choisies.`,
        duration: '1 heure',
        synergyOrigin: `Sève combative de ${secondaryIngredient.name}`,
      },
      {
        roll: '16',
        d20Value: 16,
        type: 'surpuissant',
        title: 'Fusion Régénératrice Suprême',
        description: `Au début de chacun de ses tours pendant 1 minute, le personnage regagne automatiquement 3 points de vie tant qu'il a au moins 1 PV. Tout membre tranché ou œil crevé se reconstitue en 1 heure.`,
        duration: 'Régénération active 1 min, guérison permanente',
        synergyOrigin: `Synergie rare entre ${pNames.slice(0, 2).join(' & ')}`,
      },
      {
        roll: '17',
        d20Value: 17,
        type: 'surpuissant',
        title: 'Avatar Élémentaire & Résistance Totale',
        description: `Le corps du buveur s'enveloppe d'une aura flamboyante ou glacée. Il gagne la Résistance à TOUS les dégâts non magiques (contondants, perforants, tranchants) ainsi qu'à l'élément primaire de la potion.`,
        duration: '10 minutes',
        synergyOrigin: selectedGem ? `Alliance magistrale de ${pNames[0]} et du ${gemName}` : `Triple macération rare`,
      },
      {
        roll: '18',
        d20Value: 18,
        type: 'surpuissant',
        title: 'Instinct de Prédateur Primordial & Force 21',
        description: `La valeur de Force ou de Dextérité (au choix du joueur) passe à 21 (+5). Ses attaques au corps à corps portent un coup critique sur un résultat naturel de 19 ou 20 au d20.`,
        duration: '1 heure',
        synergyOrigin: `Concentré de vigueur de ${mainIngredient.name}`,
      },
      {
        roll: '19',
        d20Value: 19,
        type: 'surpuissant',
        title: 'Élixir de Fontaine Astrale',
        description: `Le buveur récupère immédiatement jusqu'à 3 niveaux d'emplacements de sorts dépensés (par ex. un emplacement de niveau 3 ou un de niveau 1 et un de niveau 2) et guérit 4d8 + 8 points de vie.`,
        duration: 'Instantané',
        synergyOrigin: `Résonance arcanique transcendante`,
      },
      {
        roll: '20',
        d20Value: 20,
        type: 'miracle',
        title: 'Chef-d\'Œuvre de l\'Art Alchimique (Miracle Végétal)',
        description: `Perfection absolue du chaudron. Le buveur est intégralement guéri de tous ses PV perdus, toutes maladies, poisons, malédictions et cécités sont dissipés. Il rajeunit biologiquement de 1 an et bénéficie d'une bénédiction : la prochaine fois qu'il devrait tomber à 0 PV dans les 30 prochains jours, il reste à 1 PV avec un bouclier d'énergie divine de 20 PV.`,
        duration: 'Permanent / Déclenchement sous 30 jours',
        synergyOrigin: `Apothéose de tous les ingrédients rares combinés (${pNames.join(', ')}${selectedGem ? ` + ${gemName}` : ''})`,
      },
    ];
  }, [selectedPlants, selectedGem]);

  // Execute roll test
  const handleRollDice = () => {
    setIsRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      setD20Roll(Math.floor(Math.random() * 20) + 1);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * 20) + 1;
        setD20Roll(finalVal);
        setIsRolling(false);
      }
    }, 50);
  };

  // Copy table to clipboard in markdown
  const handleCopyMarkdown = () => {
    const pNames = selectedPlants.map(p => p.name).join(', ');
    const gemStr = selectedGem ? ` + Gemme : ${selectedGem.name}` : '';
    let md = `# Table d'Effets Aléatoires de Potions (d20)\n`;
    md += `**Ingrédients Rares Infusés :** ${pNames}${gemStr}\n\n`;
    md += `| d20 | Type | Effet Alchimique | Durée | Synergie |\n`;
    md += `|-----|------|-------------------|-------|----------|\n`;
    generatedTable.forEach(row => {
      md += `| ${row.roll} | ${row.type.toUpperCase()} | **${row.title}** : ${row.description} | ${row.duration} | ${row.synergyOrigin} |\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentResultEntry = d20Roll !== null
    ? generatedTable.find(e => e.d20Value === d20Roll)
    : null;

  const getTypeBadge = (type: PotionTableEntry['type']) => {
    switch (type) {
      case 'catastrophe':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-700">Catastrophe (Rejet)</span>;
      case 'bizarre':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700">Chaos / Effet Bizarre</span>;
      case 'mineur':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">Effet Mineur</span>;
      case 'majeur':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-700">Effet Majeur</span>;
      case 'surpuissant':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-600">Surpuissant</span>;
      case 'miracle':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-900 text-yellow-200 border border-yellow-500 animate-pulse">Miracle Alchimique</span>;
    }
  };

  return (
    <div className="bg-[#1c1612] rounded-xl border-2 border-[#5c4033] p-5 sm:p-7 text-[#f4ecd8] font-serif shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 border-b border-[#4d3a2e] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#451a03] text-[#fcd34d] border border-[#d97706]/50 uppercase tracking-widest font-mono">
              Laboratoire Magique
            </span>
            <span className="text-xs text-[#a89988]">Générateur d'Effets Instables & Inattendus</span>
          </div>
          <h3 className="text-2xl font-bold text-[#d4af37] flex items-center gap-2.5">
            <Wand2 className="w-7 h-7 text-[#fde047]" />
            Table d'Effets Aléatoires de Potions (Ingrédients Rares)
          </h3>
          <p className="text-xs text-[#c4b5a5] italic mt-0.5">
            Sélectionnez les végétaux précieux et gemmes du grimoire pour forger une table d20 sur mesure avec effets bénéfiques, mutations magiques et rejets alchimiques.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2c2018] hover:bg-[#3d2c20] text-xs font-serif text-[#fcd34d] border border-[#78350f] transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier (Markdown)'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#3b271b] hover:bg-[#523724] text-xs font-serif text-white border border-[#d4af37]/60 transition"
          >
            <Printer className="w-3.5 h-3.5 text-[#fde047]" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Preset Cocktails Bar */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-[#d7c9b8] uppercase tracking-wider block">
          Mélanges Thématiques Recommandés :
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleApplyPreset('lunaire')}
            className="px-2.5 py-1 rounded bg-[#241c16] hover:bg-[#382b22] border border-[#59473b] text-[#93c5fd] hover:border-[#93c5fd]"
          >
            🌙 Breuvage Astral & Divinatoire
          </button>
          <button
            onClick={() => handleApplyPreset('titanesque')}
            className="px-2.5 py-1 rounded bg-[#241c16] hover:bg-[#382b22] border border-[#59473b] text-[#f87171] hover:border-[#f87171]"
          >
            🔥 Fureur Bestiale des Géants
          </button>
          <button
            onClick={() => handleApplyPreset('elementaire')}
            className="px-2.5 py-1 rounded bg-[#241c16] hover:bg-[#382b22] border border-[#59473b] text-[#67e8f9] hover:border-[#67e8f9]"
          >
            ❄️ Concoction Cryo-Flamboyante
          </button>
          <button
            onClick={() => handleApplyPreset('miraculeux')}
            className="px-2.5 py-1 rounded bg-[#241c16] hover:bg-[#382b22] border border-[#59473b] text-[#fde047] hover:border-[#fde047]"
          >
            ✨ Panacée Solaire & Résurrection
          </button>
          <button
            onClick={() => handleApplyPreset('tenebreux')}
            className="px-2.5 py-1 rounded bg-[#241c16] hover:bg-[#382b22] border border-[#59473b] text-[#cbd5e1] hover:border-[#cbd5e1]"
          >
            🌑 Filtre d'Ombre & Paralysie
          </button>
        </div>
      </div>

      {/* Ingredient Selector Box */}
      <div className="bg-[#241c16] p-4 rounded-xl border border-[#4d3a2e] space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#fef08a] uppercase tracking-wide">
              1. Choisissez 1 à 4 Ingrédients Rares du Manuel ({selectedPlantIds.length}/4 sélectionnés) :
            </span>
            <span className="text-[11px] text-[#a89988]">
              {rarePlants.length} plantes rares répertoriées
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
            {rarePlants.map(plant => {
              const isSelected = selectedPlantIds.includes(plant.id);
              return (
                <button
                  key={plant.id}
                  onClick={() => handleTogglePlant(plant.id)}
                  className={`p-2 rounded-lg text-left text-xs transition border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#451a03] border-[#fde047] text-[#fef08a] shadow'
                      : 'bg-[#181310] border-[#3e2e23] text-[#d7c9b8] hover:bg-[#2c2018]'
                  }`}
                >
                  <div className="font-bold truncate">{plant.name}</div>
                  <div className="text-[10px] text-[#a89988] truncate italic">
                    {plant.biome} · {plant.rarity}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Gem additive from Naheulbeuk */}
        <div className="pt-2 border-t border-[#3e2e23] flex flex-wrap items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-[#d7c9b8]">
            <input
              type="checkbox"
              checked={includeGems}
              onChange={(e) => setIncludeGems(e.target.checked)}
              className="accent-[#d4af37]"
            />
            <span>
              Ajouter une poudre de <strong>Gemme de Naheulbeuk</strong> comme catalyseur
            </span>
          </label>

          {includeGems && (
            <div className="flex items-center gap-2">
              <span className="text-[#a89988]">Gemme :</span>
              <select
                value={selectedGemId}
                onChange={(e) => setSelectedGemId(e.target.value)}
                className="bg-[#181310] border border-[#59473b] rounded px-2 py-1 text-xs text-[#fde047] focus:outline-none"
              >
                {GEMS_LIST.map(gem => (
                  <option key={gem.id} value={gem.id}>
                    {gem.name} ({gem.category})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Selected Ingredients Banner */}
      <div className="bg-[#2a1d15] p-3 rounded-lg border border-[#78350f] flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs">
          <span className="text-[#a89988] mr-2">Composition du Chaudron :</span>
          <span className="text-[#fef08a] font-bold">
            {selectedPlants.map(p => p.name).join(' + ')}
            {selectedGem ? ` + Poudre de ${selectedGem.name}` : ''}
          </span>
        </div>

        {/* Dice Roller Button */}
        <button
          onClick={handleRollDice}
          disabled={isRolling}
          className="px-4 py-2 rounded bg-[#b45309] hover:bg-[#d97706] text-white font-bold text-xs shadow-lg transition flex items-center gap-2"
        >
          <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
          <span>{isRolling ? 'Le chaudron bouillonne...' : 'Lancer le d20 & Goûter'}</span>
        </button>
      </div>

      {/* Highlight of current D20 Roll */}
      {currentResultEntry && (
        <div className="p-4 rounded-xl border-2 border-[#fde047] bg-[#3a2012] shadow-2xl animate-fade-in space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#fde047] text-[#1c140d] font-mono font-extrabold flex items-center justify-center text-sm shadow">
                {currentResultEntry.d20Value}
              </span>
              <h4 className="text-base font-bold text-[#fef08a]">
                Résultat d20 ({currentResultEntry.roll}) : {currentResultEntry.title}
              </h4>
            </div>
            {getTypeBadge(currentResultEntry.type)}
          </div>

          <p className="text-sm text-[#f5ecd7] leading-relaxed pl-10">
            {currentResultEntry.description}
          </p>

          <div className="text-[11px] text-[#cbd5e1] pl-10 flex gap-4 pt-1">
            <span><strong>Durée :</strong> {currentResultEntry.duration}</span>
            <span><strong>Origine :</strong> {currentResultEntry.synergyOrigin}</span>
          </div>
        </div>
      )}

      {/* The Full D20 Table */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[#fde047]" />
            Table Complète des 20 Résultats Possibles au d20
          </h4>
          <span className="text-[11px] text-[#a89988]">
            Chaque résultat s'adapte automatiquement à votre sélection d'ingrédients
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#4d3a2e]">
          <table className="w-full text-left text-xs border-collapse font-serif">
            <thead>
              <tr className="bg-[#241c16] text-[#fef08a] border-b border-[#4d3a2e]">
                <th className="p-2.5 text-center w-12 font-mono">d20</th>
                <th className="p-2.5 w-36">Catégorie</th>
                <th className="p-2.5">Effet Concocté & Conséquences de Jeu</th>
                <th className="p-2.5 w-28">Durée</th>
                <th className="p-2.5 w-44">Synergie Végétale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d2c20]">
              {generatedTable.map((row) => {
                const isSelected = d20Roll === row.d20Value;
                return (
                  <tr
                    key={row.d20Value}
                    className={`transition ${
                      isSelected
                        ? 'bg-[#572f17] text-white font-medium ring-2 ring-[#fde047] z-10'
                        : row.d20Value % 2 === 0
                        ? 'bg-[#181310]/70 hover:bg-[#2c2018]'
                        : 'bg-[#1f1814]/70 hover:bg-[#2c2018]'
                    }`}
                  >
                    <td className="p-2.5 text-center font-mono font-bold text-[#fde047]">
                      {row.roll}
                    </td>
                    <td className="p-2.5">
                      {getTypeBadge(row.type)}
                    </td>
                    <td className="p-2.5">
                      <strong className="text-[#fef08a] block mb-0.5">
                        {row.title}
                      </strong>
                      <span className="text-[#d7c9b8] leading-relaxed text-[11px]">
                        {row.description}
                      </span>
                    </td>
                    <td className="p-2.5 text-[11px] text-[#cbd5e1] whitespace-nowrap">
                      {row.duration}
                    </td>
                    <td className="p-2.5 text-[11px] text-[#a89988] italic">
                      {row.synergyOrigin}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
