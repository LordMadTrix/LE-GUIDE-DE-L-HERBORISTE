import { ForgeRecipe } from '../types/mineral';

export const FORGE_RECIPES: ForgeRecipe[] = [
  // --- ARMES TRANCHANTES & D'ESTOC ---
  {
    id: 'forge_rapiere_mithril',
    name: 'Rapière d\'Étoile en Mithril',
    category: 'arme',
    primaryMineralId: 'mithril',
    ingotsCount: 2,
    gemId: 'gem_saphir',
    difficultyDC: 15,
    forgeTime: '3 jours',
    requiredForgeTier: 'Forge de Maître',
    marketValuePo: 650,
    weightKg: 0.6,
    damageOrAC: '1d8 + Mod Dex perforant',
    specialProperties: [
      'Propriété Finesse & Très Légère',
      'Parade Aérienne : +1 à la CA lors d\'une réaction de parade',
      'Ne s\'oxyde jamais et brille d\'une lueur bleutée à moins de 30m d\'un gobelin'
    ],
    description: 'Forgée dans un fil de Mithril pur martelé mille fois à froid, cette rapière est si légère qu\'elle semble fendre l\'air sans résistance.',
    historicalLore: 'Arme de prédilection des duellistes elfiques de la Passe du Venteux, cette lame ne fatigue jamais le poignet de son porteur même après trois heures d\'assaut ininterrompu.'
  },
  {
    id: 'forge_marteau_adamantium',
    name: 'Masse Fracasse-Roc en Adamantium',
    category: 'arme',
    primaryMineralId: 'adamantium',
    ingotsCount: 4,
    difficultyDC: 18,
    forgeTime: '5 jours',
    requiredForgeTier: 'Enclume Naine Ancestrale',
    marketValuePo: 950,
    weightKg: 4.5,
    damageOrAC: '2d6 + Mod For contondant',
    specialProperties: [
      'Lourd & À deux mains',
      'Impact d\'Adamantium : tout coup réussi contre un objet, porte blindée ou structure est un Coup Critique automatique',
      'Brise-Armure : ignore les résistances naturelles aux dégâts contondants'
    ],
    description: 'Un bloc noir mat d\'Adamantium brut coulé dans un moule gravé de runes de tremblement de terre. L\'impact pulvérise le granit et les boucliers.',
    historicalLore: 'Les briseurs de portes nains de la citadelle de Kazad-Grom utilisent ces masses pour défoncer les sas scellés par la lave sans émousser le métal.'
  },
  {
    id: 'forge_epee_argent_alchimique',
    name: 'Épée Bâtarde d\'Argent Lunaire',
    category: 'arme',
    primaryMineralId: 'argent_alchimique',
    ingotsCount: 3,
    creatureComponent: 'Crinière de Loup-Garou (pour le pommeau)',
    difficultyDC: 14,
    forgeTime: '2 jours',
    requiredForgeTier: 'Forge de Campagne',
    marketValuePo: 420,
    weightKg: 1.8,
    damageOrAC: '1d10 + Mod For/Dex tranchant',
    specialProperties: [
      'Polyvalente (1d8 à une main / 1d10 à deux mains)',
      'Fléau d\'Argent : inflige +2d6 dégâts radiants supplémentaires aux Lycanthropes, Spectres et Démons',
      'Purification de contact : cautérise instantanément les plaies corrompues'
    ],
    description: 'Lame à double tranchant trempée dans l\'eau lustrale et battue d\'argent vierge fondu avec du mercure alchimique stabilisé.',
    historicalLore: 'Commandée par l\'Ordre des Traqueurs de Sang pour nettoyer les forêts maudites de Galdor sans dépendre de prêtres exorcistes.'
  },
  {
    id: 'forge_dague_fer_froid',
    name: 'Dague d\'Hiver en Fer Froid',
    category: 'arme',
    primaryMineralId: 'fer_froid',
    ingotsCount: 1,
    difficultyDC: 13,
    forgeTime: '1 jour',
    requiredForgeTier: 'Forge de Campagne',
    marketValuePo: 180,
    weightKg: 0.5,
    damageOrAC: '1d4 + Mod Dex perforant',
    specialProperties: [
      'Finesse, Légère, Lancer (portée 6m/18m)',
      'Perturbation Féerique : dissipe les illusions et charmes magiques en cas de blessure critique',
      'Ancre Astrale : empêche la cible fée ou diablotin de se téléporter pendant 1 tour'
    ],
    description: 'Taillée dans du fer tellurique n\'ayant jamais connu le feu d\'un fourneau, uniquement martelée par percussion sous l\'eau glaciale.',
    historicalLore: 'Le métal dégage une froideur constante qui brûle la chair des créatures du plan féerique au moindre contact superficiel.'
  },
  {
    id: 'forge_katar_obsidienne',
    name: 'Katar Mortel en Verre d\'Obsidienne',
    category: 'arme',
    primaryMineralId: 'obsidienne',
    ingotsCount: 2,
    difficultyDC: 16,
    forgeTime: '2 jours',
    requiredForgeTier: 'Fourneau Volcanique',
    marketValuePo: 380,
    weightKg: 0.9,
    damageOrAC: '1d6 + Mod Dex perforant/tranchant',
    specialProperties: [
      'Tranchant Moléculaire : coup critique sur 19-20 naturel',
      'Hémorragie Noire : la cible subit 1d4 dégâts de saignement au début de chacun de ses tours jusqu\'à réussite d\'un test de Médecine DD 13',
      'Fragilité tellurique : sur un 1 naturel, le tranchant s\'ébrèche (-1 aux dégâts jusqu\'au réaffûtage)'
    ],
    description: 'Une lame d\'obsidienne volcanique d\'un noir miroitant dont le fil est plus fin qu\'un bistouri chirurgical elfe.',
    historicalLore: 'Arme cérémonielle des assassins de la Faille Ardente, réputée pour infliger des plaies nettes qui refusent de cicatriser.'
  },

  // --- ARMURES & PROTECTIONS D'ÉCAILLES ---
  {
    id: 'forge_haubert_mithril',
    name: 'Haubert Léger en Mithril de Fangh',
    category: 'armure',
    primaryMineralId: 'mithril',
    ingotsCount: 5,
    difficultyDC: 17,
    forgeTime: '7 jours',
    requiredForgeTier: 'Enclume Naine Ancestrale',
    marketValuePo: 1200,
    weightKg: 6.0,
    damageOrAC: 'CA 16 (Armure Moyenne)',
    specialProperties: [
      'AUCUN malus aux tests de Dextérité (Discrétion)',
      'Aucun prérequis de Force requis',
      'Peut être dissimulé entièrement sous une tunique ordinaire de noble ou de voyageur'
    ],
    description: 'Des dizaines de milliers de mailles d\'un blanc argenté d\'une finesse soyeuse, impénétrables aux flèches et aux estocs félons.',
    historicalLore: 'La légende raconte qu\'un roi nain offrit un tel haubert à un voleur agile qui venait de lui rapporter sa chope de bière favorite.'
  },
  {
    id: 'forge_harnois_adamantium',
    name: 'Harnois Complet d\'Adamantium Impénétrable',
    category: 'armure',
    primaryMineralId: 'adamantium',
    ingotsCount: 8,
    difficultyDC: 20,
    forgeTime: '15 jours',
    requiredForgeTier: 'Enclume Naine Ancestrale',
    marketValuePo: 2800,
    weightKg: 28.0,
    damageOrAC: 'CA 18 (Armure Lourde)',
    specialProperties: [
      'Rempart Absolu : tout coup critique infligé au porteur devient une frappe normale ordinaire',
      'Résistance aux chutes : divise par deux les dégâts d\'écrasement ou d\'effondrement',
      'Exige une Force de 15'
    ],
    description: 'Une armure de plaques lourdes et anguleuses d\'un noir d\'abîme réfléchissant la lueur des torches en reflets verdâtres.',
    historicalLore: 'Les gardes d\'élite de l\'Empereur de Fangh portaient ces armures pour encaisser les souffles de balistes et les griffes de béhémoths.'
  },
  {
    id: 'forge_cuirasse_ecailles_dragon',
    name: 'Cuirasse en Écailles de Dragon & Mithril',
    category: 'armure',
    primaryMineralId: 'mithril',
    ingotsCount: 3,
    creatureComponent: 'Écailles de Dragon Vert Dorsales (4x)',
    difficultyDC: 19,
    forgeTime: '6 jours',
    requiredForgeTier: 'Forge de Maître',
    marketValuePo: 1650,
    weightKg: 9.0,
    damageOrAC: 'CA 15 + Mod Dex (max +2)',
    specialProperties: [
      'Résistance au Poison & aux Vapeurs Acides (dégâts divisés par 2)',
      'Avantage aux jets de sauvegarde contre les souffles draconiques et cônes toxiques',
      'Présence Imposante : +1 aux tests d\'Intimidation face aux humanoïdes'
    ],
    description: 'Grandes écailles vertes vernissées serties et rivetées sur un corset de mithril flexible doublé de cuir bouilli.',
    historicalLore: 'Forgée après la célèbre défaite du Grand Ver des Collines Émeraude par les forgerons de Chausey.'
  },
  {
    id: 'forge_bouclier_miroir_argent',
    name: 'Écu Miroir d\'Argent & Vif-Argent',
    category: 'bouclier',
    primaryMineralId: 'argent_alchimique',
    ingotsCount: 3,
    creatureComponent: 'Fiole de Vif-Argent Mercuriel',
    gemId: 'gem_diamant',
    difficultyDC: 16,
    forgeTime: '3 jours',
    requiredForgeTier: 'Forge de Maître',
    marketValuePo: 580,
    weightKg: 2.5,
    damageOrAC: '+2 CA (+3 vs projectiles)',
    specialProperties: [
      'Surface Réflectrice : immunise contre le regard pétrifiant des méduses et basilics',
      'Flash d\'Aveuglement : une fois par repos court, renvoie la lumière du soleil ou d\'une torche pour aveugler un assaillant (JS Dex DD 14)',
      'Bonus de +2 aux sauvegardes contre les sorts de l\'école d\'Enchantement'
    ],
    description: 'Un écu étincelant dont la surface polie au vif-argent renvoie un reflet d\'une netteté parfaite sans la moindre déformation.',
    historicalLore: 'Conçu à l\'origine pour chasser les créatures pétrifiantes dans les cryptes d\'Ulgor sans risquer d\'être changé en statue de sel.'
  },

  // --- OUTILS DE MAÎTRE & RELIQUES ---
  {
    id: 'forge_trousse_herboriste_mithril',
    name: 'Trousse d\'Herboriste de Précision en Mithril',
    category: 'outil',
    primaryMineralId: 'mithril',
    ingotsCount: 1,
    difficultyDC: 14,
    forgeTime: '2 jours',
    requiredForgeTier: 'Forge de Campagne',
    marketValuePo: 320,
    weightKg: 1.2,
    damageOrAC: 'Outil de Maître (+2 aux tests)',
    specialProperties: [
      '+2 à tous les tests de Dextérité pour prélever et inciser les herbes magiques sans détruire leurs sucs',
      'Lames inaltérables ne nécessitant aucun affûtage',
      'Compartiment thermique isolé conservant les fleurs 2 fois plus longtemps (6 jours fraîches)'
    ],
    description: 'Sécateur, scalpel d\'argent et curette forgés dans un alliage de mithril et d\'acier trempé, emballés dans un étui de cuir velouté.',
    historicalLore: 'Le rêve de tout apothicaire d\'expédition : un outil qui ne plie jamais face à une racine de chêne centenaire.'
  },
  {
    id: 'forge_anneau_orichalque_soleil',
    name: 'Bague Runique en Orichalque & Rubis Ardent',
    category: 'relique',
    primaryMineralId: 'orichalque',
    ingotsCount: 1,
    gemId: 'gem_rubis',
    difficultyDC: 18,
    forgeTime: '4 jours',
    requiredForgeTier: 'Fourneau Volcanique',
    marketValuePo: 1400,
    weightKg: 0.1,
    damageOrAC: 'Relique Magique (Harmonisation)',
    specialProperties: [
      'Conducteur Arcanique Suprême : +1 aux jets d\'attaque de sorts et au DD de sauvegarde des sorts du lanceur',
      'Absorption Élémentaire : peut stocker l\'énergie d\'un sort de feu pour en faire bénéficier la prochaine attaque d\'arme (+2d6 feu)',
      'Immunité aux effets de froid extrême non magique'
    ],
    description: 'Anneau de métal doré cuivré luisant d\'une chaleur douce permanente, couronné d\'un rubis taillé en coussin brillant.',
    historicalLore: 'Les mages guerriers de l\'Arène Ardente portaient ces bagues pour canaliser leurs incantations tout en maniant le glaive à bout portant.'
  }
];

export const FORGE_RULES_LORE = {
  title: 'Traité de Métallurgie & Ferronnerie Tellurique de Fangh',
  overview: 'Travailler les métaux magiques et assembler des composants de monstres nécessite un foyer à haute température, des flux alchimiques de protection et une enclume gravée de runes de stabilisation.',
  tierDescriptions: [
    { tier: 'Forge de Campagne', temp: '800°C - 1100°C', tools: 'Foyer portable au charbon de bois, marteau d\'acier ordinaire, bac d\'eau de source.', items: 'Fer froid, argent alchimique, armes et armures courantes.' },
    { tier: 'Forge de Maître', temp: '1200°C - 1800°C', tools: 'Fourneau à soufflet hydraulique, marteaux d\'alliage, huiles de trempe distillées.', items: 'Mithril, orichalque, incrustations d\'écailles de wyverne.' },
    { tier: 'Enclume Naine Ancestrale', temp: '1900°C - 2400°C', tools: 'Enclume de granite noir runique, charbon d\'anthracite des abysses, marteaux bénis.', items: 'Adamantium, hauberts sans coutures, reliques dynastiques.' },
    { tier: 'Fourneau Volcanique', temp: '2500°C - 3200°C', tools: 'Évent de magma direct, pinces d\'obsidienne renforcée, flux de soufre liquide.', items: 'Obsidienne thermo-scellée, orichalque solaire, cristaux stellaires.' },
  ],
  quenchingMethods: [
    { method: 'Trempe à l\'Eau Froide de Source', effect: 'Durcissement maximal du tranchant mais augmente la fragilité aux chocs.' },
    { method: 'Trempe à l\'Huile Alchimique', effect: 'Flexibilité accrue de la lame, résiste aux torsions sans casser.' },
    { method: 'Trempe au Sang de Dragon / Monstre', effect: 'Lie mystiquement les propriétés élémentaires de la créature dans la structure moléculaire du métal.' },
  ]
};
