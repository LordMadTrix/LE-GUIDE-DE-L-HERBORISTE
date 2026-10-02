export type PoisonVector = 'contact' | 'ingestion' | 'inhalation' | 'blessure';

export type PoisonOrigin = 'vegetale' | 'minerale' | 'animale_monstre' | 'alchimique';

export type ConditionEffect = 
  | 'Empoisonné'
  | 'Paralysé'
  | 'Inconscient'
  | 'Aveuglé'
  | 'Pétrifié'
  | 'Épuisement'
  | 'Étourdi'
  | 'Halluciné';

export interface AntidoteRecipe {
  name: string;
  preparationType: 'Infusion d\'urgence' | 'Électuaire à avaler' | 'Onguent cautérisant' | 'Émétique gastrique' | 'Filtre purificateur';
  requiredPlants: string[];
  requiredMinerals?: string[];
  craftDC: number;
  preparationTime: string;
  effect: string;
}

export interface Poison {
  id: string;
  name: string;
  latinOrScientificName: string;
  origin: PoisonOrigin;
  vector: PoisonVector;
  rarity: 'Commune' | 'Peu commune' | 'Rare' | 'Très rare' | 'Légendaire';
  saveDC: number;
  saveType: 'Constitution' | 'Sagesse';
  delay: string; // Ex: 'Immédiat (1 tour)', '10 minutes', '1 heure'
  damageFormula: string; // Ex: '3d6 dégâts de poison'
  conditions: ConditionEffect[];
  legality: 'Strictement Interdit (Marché Noir)' | 'Usage Médical Encadré' | 'Toléré pour la Chasse';
  blackMarketPricePo: number;
  description: string;
  symptoms: string;
  gameMechanics: string;
  antidote: AntidoteRecipe;
  loreAnecdote: string;
}

export interface PoisonSaveRoll {
  roll: number;
  total: number;
  dc: number;
  success: boolean;
  critSuccess: boolean;
  critFail: boolean;
  damageTaken: string;
  conditionApplied: string;
  narrativeMessage: string;
}
