export type GemCategory = 
  | 'precieuse' 
  | 'fine' 
  | 'ornementale' 
  | 'magique';

export type GemCut = 
  | 'brut' 
  | 'cabochon' 
  | 'brillant' 
  | 'coussin' 
  | 'emeraude' 
  | 'goutte' 
  | 'ovale';

export interface Gem {
  id: string;
  name: string;
  category: GemCategory;
  color: string;
  accentColor: string;
  weightGoltors: number; // Poids moyen standard en unités Goltor (système Naheulbeuk)
  basePriceRaw: number; // Prix brut en Pièces d'Or (PO)
  basePriceCut: number; // Prix taillé par joaillier en Pièces d'Or (PO)
  rarity: 'Commune' | 'Peu commune' | 'Rare' | 'Très rare' | 'Légendaire';
  hardnessMohs: number; // Échelle de Mohs (1 à 10)
  originPlaces: string[]; // ex: "Mines naines de Fangh", "Volcans de Glargh"
  description: string;
  visualAspect: string;
  magicalAffinity: string; // Élément ou école de magie
  enchantmentEffect: string; // Effet de sertissage sur arme, armure ou bijou
  naheulbeukLore: string; // Humour ou anecdote typique univers Naheulbeuk/JDR
  cutType: GemCut;
}

export interface GemLootRoll {
  d20: number;
  gem: Gem;
  weight: number;
  isCut: boolean;
  purity: 'Parfaite (+50%)' | 'Standard' | 'Avec inclusions (-25%)';
  finalValuePo: number;
}
