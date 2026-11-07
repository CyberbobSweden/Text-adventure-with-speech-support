import type { Difficulty, Monster, MonsterFamily } from "@/types";

/**
 * Hand-authored monsters. For the "300+ monsters" ambition from the design
 * doc, see `generateVariant` below — every archetype here can be scaled
 * into tiered variants (Weak/Elder/Ancient, elemental-touched, etc.)
 * without hand-writing each one. Hand-author the memorable ones (bosses,
 * unique named monsters), generate the filler.
 */
export const MONSTERS: Record<string, Monster> = {
  goblin_scout: {
    id: "goblin_scout",
    name: "Goblin Scout",
    family: "goblinoid",
    level: 1,
    health: 12,
    damage: [1, 4],
    armor: 0,
    xpReward: 8,
    goldReward: [1, 5],
    description: "A wiry goblin clutching a crude spear, more nervous than dangerous.",
    lootTable: [{ itemId: "rusty_dagger", chance: 0.2 }],
    fleeChance: 0.3,
  },
  goblin_warband_leader: {
    id: "goblin_warband_leader",
    name: "Goblin Warband Leader",
    family: "goblinoid",
    level: 4,
    health: 34,
    damage: [3, 8],
    armor: 2,
    xpReward: 30,
    goldReward: [10, 25],
    description: "Scarred and snarling, wearing the boots of a knight it killed.",
    lootTable: [{ itemId: "iron_sword", chance: 0.15 }],
  },
  cave_spider: {
    id: "cave_spider",
    name: "Cave Spider",
    family: "spider",
    level: 2,
    health: 14,
    damage: [2, 5],
    armor: 0,
    xpReward: 12,
    goldReward: [0, 2],
    description: "Fist-sized, fast, and venomous — it skitters along the ceiling.",
    lootTable: [{ itemId: "spider_silk", chance: 0.5 }],
  },
  giant_spider: {
    id: "giant_spider",
    name: "Giant Spider",
    family: "spider",
    level: 7,
    health: 60,
    damage: [5, 12],
    armor: 2,
    xpReward: 70,
    goldReward: [5, 15],
    description: "The size of a wagon wheel, its mandibles drip with paralytic venom.",
    lootTable: [{ itemId: "spider_silk", chance: 0.9, minQty: 2, maxQty: 4 }],
  },
  skeleton_warrior: {
    id: "skeleton_warrior",
    name: "Skeleton Warrior",
    family: "undead",
    level: 3,
    health: 22,
    damage: [3, 7],
    armor: 3,
    xpReward: 18,
    goldReward: [2, 10],
    description: "Bones held together by old magic, still wearing rusted mail.",
  },
  crypt_wraith: {
    id: "crypt_wraith",
    name: "Crypt Wraith",
    family: "ghost",
    level: 9,
    health: 55,
    damage: [6, 13],
    armor: 5,
    xpReward: 95,
    goldReward: [0, 0],
    description: "A cold shape that drains warmth from the air around it.",
    abilities: [
      {
        id: "chill_touch",
        name: "Chill Touch",
        description: "A freezing grasp that saps strength.",
        manaCost: 0,
        minLevel: 1,
        damage: [4, 9],
        effect: "curse",
      },
    ],
  },
  mimic: {
    id: "mimic",
    name: "Mimic",
    family: "construct",
    level: 5,
    health: 40,
    damage: [4, 11],
    armor: 4,
    xpReward: 45,
    goldReward: [15, 40],
    description: "It looked exactly like a treasure chest. That was the point.",
    lootTable: [{ itemId: "gold_coin_pile", chance: 0.8 }],
  },
  gelatinous_cube: {
    id: "gelatinous_cube",
    name: "Gelatinous Cube",
    family: "ooze",
    level: 6,
    health: 70,
    damage: [3, 9],
    armor: 0,
    xpReward: 55,
    goldReward: [0, 5],
    description:
      "A translucent cube slides down the corridor, half-dissolved bones visible inside it.",
  },
  dark_elf_blade: {
    id: "dark_elf_blade",
    name: "Dark Elf Blade-Dancer",
    family: "humanoid",
    level: 8,
    health: 48,
    damage: [6, 12],
    armor: 3,
    xpReward: 80,
    goldReward: [20, 45],
    description: "Moves like water. Twin curved blades never stop moving.",
  },
  lesser_demon: {
    id: "lesser_demon",
    name: "Lesser Demon",
    family: "demon",
    level: 10,
    health: 90,
    damage: [8, 16],
    armor: 4,
    xpReward: 120,
    goldReward: [10, 30],
    description: "Sulfur-scented and clawed, it grins with too many teeth.",
  },
  young_werewolf: {
    id: "young_werewolf",
    name: "Young Werewolf",
    family: "beast",
    level: 6,
    health: 65,
    damage: [5, 11],
    armor: 1,
    xpReward: 60,
    goldReward: [5, 15],
    description: "Half-changed, caught between man and wolf, snarling at the moon.",
  },
  crypt_vampire: {
    id: "crypt_vampire",
    name: "Vampire Thrall",
    family: "vampire",
    level: 12,
    health: 110,
    damage: [8, 18],
    armor: 3,
    xpReward: 150,
    goldReward: [20, 60],
    description: "Pale and quick, it hisses at the light of your torch.",
  },
  lich_apprentice: {
    id: "lich_apprentice",
    name: "Lich Apprentice",
    family: "undead",
    level: 15,
    health: 130,
    damage: [10, 20],
    armor: 6,
    xpReward: 220,
    goldReward: [30, 80],
    description: "A withered spellcaster who traded mortality for power, and lost.",
    abilities: [
      {
        id: "bone_spikes",
        name: "Bone Spikes",
        description: "Shards of bone erupt from the ground.",
        manaCost: 10,
        minLevel: 1,
        damage: [8, 15],
      },
    ],
  },
  cave_troll: {
    id: "cave_troll",
    name: "Cave Troll",
    family: "beast",
    level: 11,
    health: 160,
    damage: [10, 22],
    armor: 5,
    xpReward: 180,
    goldReward: [15, 40],
    description: "Hunched and immense, it regenerates wounds almost as fast as it takes them.",
  },
  stone_ogre: {
    id: "stone_ogre",
    name: "Stone Ogre",
    family: "beast",
    level: 9,
    health: 120,
    damage: [9, 17],
    armor: 6,
    xpReward: 140,
    goldReward: [10, 25],
    description: "Skin like cracked granite. Its club splinters wood in one blow.",
  },
  fire_elemental: {
    id: "fire_elemental",
    name: "Fire Elemental",
    family: "elemental",
    level: 13,
    health: 140,
    damage: [10, 20],
    armor: 2,
    xpReward: 200,
    goldReward: [0, 10],
    description: "A column of living flame, roaring where it touches stone.",
  },
  young_red_dragon: {
    id: "young_red_dragon",
    name: "Young Red Dragon",
    family: "dragon",
    level: 20,
    health: 320,
    damage: [18, 35],
    armor: 10,
    xpReward: 600,
    goldReward: [100, 300],
    description:
      "Barely an adult by dragon reckoning, and still large enough to blot out the tunnel mouth.",
    lootTable: [
      { itemId: "flametongue", chance: 0.1 },
      { itemId: "gold_coin_pile", chance: 1, minQty: 3, maxQty: 8 },
    ],
    abilities: [
      {
        id: "fire_breath",
        name: "Fire Breath",
        description: "A gout of searing flame.",
        manaCost: 0,
        minLevel: 1,
        damage: [15, 28],
        effect: "burn",
      },
    ],
  },
  ancient_lich_king: {
    id: "ancient_lich_king",
    name: "The Lich King, Unbound",
    family: "undead",
    level: 30,
    health: 500,
    damage: [20, 40],
    armor: 12,
    xpReward: 1500,
    goldReward: [200, 500],
    description:
      "Once a king. Now a will with no body it needs, and a grudge with no end it wants.",
    abilities: [
      {
        id: "soul_drain",
        name: "Soul Drain",
        description: "Drains life to heal itself.",
        manaCost: 15,
        minLevel: 1,
        damage: [12, 24],
      },
    ],
  },

  // --- Frontier regions (reached via the Hall of Waystones) --------------
  frost_giant: {
    id: "frost_giant",
    name: "Frost Giant",
    family: "beast",
    level: 18,
    health: 260,
    damage: [14, 26],
    armor: 7,
    xpReward: 420,
    goldReward: [40, 90],
    description: "Taller than the cave it stands in has any right to allow.",
  },
  magma_hound: {
    id: "magma_hound",
    name: "Magma Hound",
    family: "elemental",
    level: 14,
    health: 150,
    damage: [11, 19],
    armor: 3,
    xpReward: 210,
    goldReward: [5, 15],
    description: "A dog-shaped fracture in the world, glowing where its joints should be.",
  },
  sandworm: {
    id: "sandworm",
    name: "Sandworm",
    family: "beast",
    level: 19,
    health: 300,
    damage: [16, 30],
    armor: 5,
    xpReward: 480,
    goldReward: [30, 70],
    description: "The dune moves before it does. By then it's usually too late.",
  },
  roc: {
    id: "roc",
    name: "Roc",
    family: "beast",
    level: 17,
    health: 220,
    damage: [13, 24],
    armor: 4,
    xpReward: 380,
    goldReward: [20, 50],
    description: "A bird large enough that its shadow gives you several seconds' warning.",
  },
  bog_witch: {
    id: "bog_witch",
    name: "Bog Witch",
    family: "humanoid",
    level: 16,
    health: 190,
    damage: [10, 22],
    armor: 2,
    xpReward: 340,
    goldReward: [25, 60],
    description: "She was probably a person once. The swamp has had a long time to change that.",
    abilities: [
      {
        id: "hex",
        name: "Hex",
        description: "A curse that saps strength and vitality.",
        manaCost: 8,
        minLevel: 1,
        damage: [6, 12],
        effect: "curse",
      },
    ],
  },
};

/** Multiplier presets used to auto-generate scaled variants of any base monster. */
const VARIANT_TIERS: {
  suffix: string;
  namePrefix: string;
  healthMult: number;
  damageMult: number;
  levelDelta: number;
  xpMult: number;
}[] = [
  { suffix: "weak", namePrefix: "Weakened", healthMult: 0.6, damageMult: 0.7, levelDelta: -1, xpMult: 0.6 },
  { suffix: "elder", namePrefix: "Elder", healthMult: 1.6, damageMult: 1.4, levelDelta: 3, xpMult: 1.8 },
  { suffix: "ancient", namePrefix: "Ancient", healthMult: 2.5, damageMult: 2.0, levelDelta: 8, xpMult: 3.2 },
];

/**
 * Generates a scaled variant of a base monster on demand (e.g. for deep
 * dungeon floors that want a harder version of an early enemy). This is
 * how a hand-authored roster of ~20 becomes hundreds of distinct
 * encounters without bloating this file — floors/zones pick a base id
 * and a tier key at generation time.
 */
export function generateVariant(baseId: string, tierSuffix: string): Monster | undefined {
  const base = MONSTERS[baseId];
  const tier = VARIANT_TIERS.find((t) => t.suffix === tierSuffix);
  if (!base || !tier) return undefined;
  return {
    ...base,
    id: `${baseId}_${tier.suffix}`,
    name: `${tier.namePrefix} ${base.name}`,
    level: Math.max(1, base.level + tier.levelDelta),
    health: Math.round(base.health * tier.healthMult),
    damage: [
      Math.round(base.damage[0] * tier.damageMult),
      Math.round(base.damage[1] * tier.damageMult),
    ],
    xpReward: Math.round(base.xpReward * tier.xpMult),
  };
}

export function getMonster(id: string): Monster | undefined {
  return MONSTERS[id] ?? tryGenerateFromId(id);
}

function tryGenerateFromId(id: string): Monster | undefined {
  const match = Object.keys(MONSTERS).find((base) => id.startsWith(`${base}_`));
  if (!match) return undefined;
  const suffix = id.slice(match.length + 1);
  return generateVariant(match, suffix);
}

export function monstersByFamily(family: MonsterFamily): Monster[] {
  return Object.values(MONSTERS).filter((m) => m.family === family);
}

const DIFFICULTY_MULTIPLIERS: Record<Difficulty, { health: number; damage: number; xp: number }> = {
  easy: { health: 0.7, damage: 0.7, xp: 1.25 },
  normal: { health: 1, damage: 1, xp: 1 },
  hard: { health: 1.35, damage: 1.3, xp: 1.2 },
};

/**
 * Applies the player's chosen difficulty to a monster's combat stats.
 * Chosen once at character creation, applied every fight — easy mode
 * makes monsters noticeably softer and more generous with XP; hard mode
 * does the opposite, with a bigger XP bump to compensate for the risk.
 */
export function applyDifficulty(monster: Monster, difficulty: Difficulty): Monster {
  const mult = DIFFICULTY_MULTIPLIERS[difficulty];
  if (mult.health === 1 && mult.damage === 1 && mult.xp === 1) return monster;
  return {
    ...monster,
    health: Math.max(1, Math.round(monster.health * mult.health)),
    damage: [
      Math.max(1, Math.round(monster.damage[0] * mult.damage)),
      Math.max(1, Math.round(monster.damage[1] * mult.damage)),
    ],
    xpReward: Math.round(monster.xpReward * mult.xp),
  };
}
