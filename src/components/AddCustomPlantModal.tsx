import React, { useState } from 'react';
import { Plant, BiomeType, RarityType } from '../types/herb';
import { BIOMES_METADATA, RARITY_METADATA } from '../data/herbalistData';
import { X, Plus, Sparkles, Feather } from 'lucide-react';

interface AddCustomPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlant: (plant: Plant) => void;
}

export const AddCustomPlantModal: React.FC<AddCustomPlantModalProps> = ({
  isOpen,
  onClose,
  onAddPlant,
}) => {
  const [name, setName] = useState('');
  const [latinName, setLatinName] = useState('');
  const [biome, setBiome] = useState<BiomeType>('foret');
  const [rarity, setRarity] = useState<RarityType>('peu_commune');
  const [dcHarvest, setDcHarvest] = useState<number>(14);
  const [season, setSeason] = useState<any>('Printemps');
  const [partsUsed, setPartsUsed] = useState('Feuilles et sève');
  const [preparationMethod, setPreparationMethod] = useState<any>('Infusion');
  const [preparationTime, setPreparationTime] = useState('30 minutes');
  const [value, setValue] = useState('40 po');
  const [description, setDescription] = useState('');
  const [botanicalAppearance, setBotanicalAppearance] = useState('');
  const [effectTitle, setEffectTitle] = useState('Effet Curatif');
  const [effectDesc, setEffectDesc] = useState('Restaure 2d6 points de vie lorsqu\'appliquée.');
  const [effectDuration, setEffectDuration] = useState('Instantané');
  const [toxicityWarning, setToxicityWarning] = useState('');
  const [druidicLore, setDruidicLore] = useState('');
  const [illustrationType, setIllustrationType] = useState<any>('flower');
  const [accentColor, setAccentColor] = useState('#10b981');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlant: Plant = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      latinName: latinName.trim() || `${name.trim()} Silvestris`,
      biome,
      rarity,
      dcHarvest: Number(dcHarvest) || 12,
      preparationMethod,
      preparationTime,
      season,
      partsUsed,
      value,
      description: description || `Plante mystérieuse originaire des ${BIOMES_METADATA[biome].label}.`,
      botanicalAppearance: botanicalAppearance || 'Spécimen végétal aux propriétés remarquables.',
      gameEffects: [
        {
          title: effectTitle || 'Effet Magique',
          description: effectDesc || 'Effet alchimique en cours d\'étude.',
          duration: effectDuration || undefined,
        },
      ],
      toxicityWarning: toxicityWarning.trim() || undefined,
      druidicLore: druidicLore.trim() || '« Une plante aux vertus vénérées par les gardiens de la forêt. »',
      illustrationType,
      accentColor,
      custom: true,
    };

    onAddPlant(newPlant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm no-print overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#f7f2e7] text-[#2c1810] rounded-xl border-4 border-[#5c3e29] shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#ebdcc4] hover:bg-[#dfcdb1] text-[#451a03] border border-[#c4a47c] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b-2 border-[#854d0e]/30 pb-3 mb-5 pr-10">
          <div className="flex items-center gap-2">
            <Feather className="w-6 h-6 text-[#854d0e]" />
            <h3 className="text-2xl font-serif font-bold text-[#3a1d0f]">
              Créer une Nouvelle Plante pour le Grimoire
            </h3>
          </div>
          <p className="text-xs text-[#78350f] font-serif italic mt-1">
            Ajoutez votre propre spécimen botanique fantastique. Il sera immédiatement intégré à l'herbier et aux exports PDF !
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-serif text-xs">
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#78350f] font-bold mb-1">Nom commun *</label>
              <input
                type="text"
                required
                placeholder="Ex: Épine d'Argent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-[#c4a47c] rounded px-3 py-1.5 focus:outline-none focus:border-[#854d0e]"
              />
            </div>
            <div>
              <label className="block text-[#78350f] font-bold mb-1">Nom binominal / latin</label>
              <input
                type="text"
                placeholder="Ex: Spina Argentea"
                value={latinName}
                onChange={(e) => setLatinName(e.target.value)}
                className="w-full bg-white border border-[#c4a47c] rounded px-3 py-1.5 focus:outline-none focus:border-[#854d0e]"
              />
            </div>
          </div>

          {/* Biome, Rarity, DC */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#78350f] font-bold mb-1">Biotope</label>
              <select
                value={biome}
                onChange={(e) => setBiome(e.target.value as BiomeType)}
                className="w-full bg-white border border-[#c4a47c] rounded px-2.5 py-1.5 focus:outline-none"
              >
                {Object.entries(BIOMES_METADATA).map(([key, data]) => (
                  <option key={key} value={key}>{data.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#78350f] font-bold mb-1">Rareté</label>
              <select
                value={rarity}
                onChange={(e) => setRarity(e.target.value as RarityType)}
                className="w-full bg-white border border-[#c4a47c] rounded px-2.5 py-1.5 focus:outline-none"
              >
                {Object.entries(RARITY_METADATA).map(([key, data]) => (
                  <option key={key} value={key}>{data.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#78350f] font-bold mb-1">DD Récolte (Survie/Nature)</label>
              <input
                type="number"
                min="5"
                max="30"
                value={dcHarvest}
                onChange={(e) => setDcHarvest(parseInt(e.target.value) || 10)}
                className="w-full bg-white border border-[#c4a47c] rounded px-3 py-1.5 font-mono font-bold text-[#b45309]"
              />
            </div>
          </div>

          {/* Visual type & highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#78350f] font-bold mb-1">Type Botanique</label>
              <select
                value={illustrationType}
                onChange={(e) => setIllustrationType(e.target.value)}
                className="w-full bg-white border border-[#c4a47c] rounded px-2.5 py-1.5 focus:outline-none"
              >
                <option value="flower">Fleur & Corolle</option>
                <option value="root">Racine & Tubercule</option>
                <option value="mushroom">Champignon & Spores</option>
                <option value="shrub">Arbrisseau & Baies</option>
                <option value="vine">Liane & Vrilles</option>
                <option value="aquatic">Algue & Récif</option>
                <option value="moss">Mousse & Lichen</option>
                <option value="succulent">Cactus & Épines</option>
              </select>
            </div>
            <div>
              <label className="block text-[#78350f] font-bold mb-1">Teinte de la Planche</label>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-full h-8 cursor-pointer rounded border border-[#c4a47c] bg-white p-1"
              />
            </div>
            <div>
              <label className="block text-[#78350f] font-bold mb-1">Valeur estimée</label>
              <input
                type="text"
                placeholder="Ex: 50 po"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-white border border-[#c4a47c] rounded px-3 py-1.5"
              />
            </div>
          </div>

          {/* Description & Game Effects */}
          <div>
            <label className="block text-[#78350f] font-bold mb-1">Description & Vertus Botaniques</label>
            <textarea
              rows={2}
              placeholder="Décrivez l'aspect de la plante, son parfum, son comportement..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-[#c4a47c] rounded p-2 focus:outline-none"
            />
          </div>

          {/* D&D Mechanical Effect */}
          <div className="bg-[#efe8d8] p-3 rounded border border-[#c4a47c] space-y-2">
            <span className="font-bold text-[#78350f] uppercase tracking-wider text-[10px] block">
              Effet Mécanique D&D 5e / JDR
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Titre de l'effet (ex: Restauration Majeure)"
                value={effectTitle}
                onChange={(e) => setEffectTitle(e.target.value)}
                className="bg-white border border-[#c4a47c] rounded px-2.5 py-1"
              />
              <input
                type="text"
                placeholder="Durée (ex: 1 heure, Instantané)"
                value={effectDuration}
                onChange={(e) => setEffectDuration(e.target.value)}
                className="bg-white border border-[#c4a47c] rounded px-2.5 py-1"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Détail des règles (points de vie rendus, bonus aux jets, sauvegarde requise...)"
              value={effectDesc}
              onChange={(e) => setEffectDesc(e.target.value)}
              className="w-full bg-white border border-[#c4a47c] rounded p-2 focus:outline-none"
            />
          </div>

          {/* Toxicity warning & Lore */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#991b1b] font-bold mb-1">Danger / Toxicité (Optionnel)</label>
              <input
                type="text"
                placeholder="Ex: Toxique si bouilli sans sel"
                value={toxicityWarning}
                onChange={(e) => setToxicityWarning(e.target.value)}
                className="w-full bg-white border border-[#c4a47c] rounded px-3 py-1.5 text-[#991b1b]"
              />
            </div>
            <div>
              <label className="block text-[#78350f] font-bold mb-1">Citation / Lore Druidique</label>
              <input
                type="text"
                placeholder="Ex: « Les fées dansent là où elle fleurit. »"
                value={druidicLore}
                onChange={(e) => setDruidicLore(e.target.value)}
                className="w-full bg-white border border-[#c4a47c] rounded px-3 py-1.5 italic"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-[#c4a47c] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ebdcc4] text-[#451a03] font-serif rounded border border-[#c4a47c] hover:bg-[#dfcdb1]"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#78350f] hover:bg-[#8e3f13] text-[#fef08a] font-serif font-bold rounded shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#fde047]" />
              <span>Inscrire au Grimoire</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
