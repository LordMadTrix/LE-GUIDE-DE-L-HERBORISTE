export type MineralCategory = 
  | 'metal_magique' 
  | 'mineral_alchimique' 
  | 'roche_tellurique' 
  | 'sel_reactif'
  | 'cristal_brut';

export interface Mineral {
  id: string;
  name: string;
  latinOrScientificName: string;
  category: MineralCategory;
  color: string;
  accentColor: string;
  hardnessMohs: number; // 1 to 10
  rarity: 'Commune' | 'Peu commune' | 'Rare' | 'Très rare' | 'Légendaire';
  density: string;
  meltingPoint: string;
  originGeology: string[];
  dcProspect: number;
  dcSmelt: number;
  basePricePerLingot: number; // en PO
  description: string;
  visualAspect: string;
  forgeUsages: string;
  alchemicalProperties: string;
  synergies: string;
  jdrNotes: string;
}

export interface MineralExtractionRoll {
  roll: number;
  total: number;
  dc: number;
  success: boolean;
  critSuccess: boolean;
  critFail: boolean;
  quantityMined: number;
  message: string;
}

export interface ForgeRecipe {
  id: string;
  name: string;
  category: 'arme' | 'armure' | 'bouclier' | 'outil' | 'relique';
  primaryMineralId: string;
  ingotsCount: number;
  creatureComponent?: string;
  gemId?: string;
  difficultyDC: number;
  forgeTime: string;
  requiredForgeTier: 'Forge de Campagne' | 'Forge de Maître' | 'Enclume Naine Ancestrale' | 'Fourneau Volcanique';
  marketValuePo: number;
  weightKg: number;
  damageOrAC: string;
  specialProperties: string[];
  description: string;
  historicalLore: string;
}

export interface ForgeCraftResult {
  roll: number;
  total: number;
  dc: number;
  success: boolean;
  critSuccess: boolean;
  critFail: boolean;
  itemCreatedName: string;
  finalQuality: 'Chef-d\'œuvre Ancestral (+1)' | 'Qualité Supérieure' | 'Standard' | 'Trempe Fragilisée' | 'Échec Total (Lingots perdus)';
  effectiveValuePo: number;
  effectiveProperties: string[];
  message: string;
}
