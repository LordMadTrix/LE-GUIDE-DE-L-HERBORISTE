export type BiomeType = 
  | 'foret' 
  | 'marais' 
  | 'montagne' 
  | 'caverne' 
  | 'plaine' 
  | 'aquatique' 
  | 'desert';

export type RarityType = 
  | 'commune' 
  | 'peu_commune' 
  | 'rare' 
  | 'tres_rare' 
  | 'legendaire';

export type EffectCategory = 
  | 'soin' 
  | 'poison' 
  | 'buff' 
  | 'utilitaire' 
  | 'sensorial' 
  | 'elementaire';

export interface Plant {
  id: string;
  name: string;
  latinName: string;
  otherNames?: string[];
  biome: BiomeType;
  rarity: RarityType;
  dcHarvest: number; // DD de récolte (Survie / Nature)
  dcAlchemy?: number; // DD d'alchimie
  preparationTime: string;
  preparationMethod: 'Cataplasme' | 'Infusion' | 'Décoction' | 'Macération' | 'Poudre' | 'Distillation' | 'Séchage';
  season: 'Printemps' | 'Été' | 'Automne' | 'Hiver' | 'Toute l\'année' | 'Nuits de pleine lune';
  partsUsed: string; // ex: "Feuilles et racines fraîches"
  value: string; // ex: "25 po"
  description: string;
  botanicalAppearance: string;
  gameEffects: {
    title: string;
    description: string;
    duration?: string;
    saveDc?: number;
  }[];
  toxicityWarning?: string;
  druidicLore: string;
  illustrationType: 'flower' | 'root' | 'mushroom' | 'vine' | 'shrub' | 'aquatic' | 'moss' | 'tree_bark' | 'succulent';
  accentColor: string; // hex for botanical highlights
  custom?: boolean;
}

export interface AlchemicalRecipe {
  id: string;
  name: string;
  category: 'potion' | 'onguent' | 'poison' | 'teinture';
  rarity: RarityType;
  difficultyDC: number;
  brewingTime: string;
  ingredients: {
    plantId: string;
    plantName: string;
    quantity: number;
    part: string;
  }[];
  additionalComponents: string[];
  effect: string;
  shelfLife: string;
  marketPrice: string;
}

export interface ForagingResult {
  roll: number;
  total: number;
  success: boolean;
  plantsFound: {
    plant: Plant;
    quantity: number;
  }[];
  eventNotes?: string;
}

export type CreatureCategory =
  | 'Monstruosité'
  | 'Plante Monstrueuse'
  | 'Dragon'
  | 'Fée'
  | 'Bête Géante'
  | 'Mort-Vivant'
  | 'Aberration'
  | 'Fiélon';

export interface CreatureHarvestComponent {
  id: string;
  name: string;
  type: 'Venin & Glande' | 'Organe & Cœur' | 'Sang & Fluide' | 'Écailles & Cuir' | 'Os & Crocs' | 'Spores & Sève' | 'Essence Magique';
  harvestDC: number;
  harvestSkill: 'Survie' | 'Nature' | 'Médecine';
  harvestTime: string;
  shelfLife: string;
  marketValue: string;
  alchemicalProperties: string;
  synergyWithHerbs: string;
  hazardOnFail?: string;
}

export interface Creature {
  id: string;
  name: string;
  latinName?: string;
  category: CreatureCategory;
  challengeRating: string; // FP (ex: "1/2", "2", "5", "8", "13")
  environment: BiomeType[];
  description: string;
  tacticsAndLore: string;
  harvestRisks: string;
  components: CreatureHarvestComponent[];
  custom?: boolean;
}

