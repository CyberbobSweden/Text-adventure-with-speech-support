import type { ClassDefinition, PlayerClass } from "@/types";

const base = (overrides: Partial<Record<string, number>> = {}) => ({
  strength: 10,
  dexterity: 10,
  wisdom: 10,
  constitution: 10,
  intelligence: 10,
  charisma: 10,
  luck: 10,
  ...overrides,
});

export const CLASSES: Record<PlayerClass, ClassDefinition> = {
  Knight: {
    name: "Knight",
    description: "Heavy armor, heavier blade. Built to stand at the front.",
    baseStats: base({ strength: 15, constitution: 14, charisma: 11 }),
    startingItemIds: ["iron_sword", "wooden_shield", "leather_armor", "torch", "ration"],
    hitDie: 10,
    manaDie: 0,
    abilities: [
      {
        id: "shield_bash",
        name: "Shield Bash",
        description: "Slam an enemy with your shield, stunning them briefly.",
        manaCost: 0,
        minLevel: 1,
        damage: [2, 5],
        effect: "stun",
      },
    ],
  },
  Ranger: {
    name: "Ranger",
    description: "At home in any forest, deadly at any range.",
    baseStats: base({ dexterity: 15, wisdom: 12, constitution: 12 }),
    startingItemIds: ["oak_longbow", "rusty_dagger", "leather_armor", "torch", "ration"],
    hitDie: 8,
    manaDie: 4,
    abilities: [
      {
        id: "aimed_shot",
        name: "Aimed Shot",
        description: "A carefully placed arrow.",
        manaCost: 5,
        minLevel: 1,
        damage: [4, 10],
      },
    ],
  },
  Mage: {
    name: "Mage",
    description: "Fragile, and yet the most dangerous thing in most rooms.",
    baseStats: base({ intelligence: 16, wisdom: 13, constitution: 8 }),
    startingItemIds: ["bone_staff", "mana_draught", "torch", "ration"],
    hitDie: 5,
    manaDie: 10,
    abilities: [
      {
        id: "firebolt",
        name: "Firebolt",
        description: "A bolt of searing flame.",
        manaCost: 8,
        minLevel: 1,
        damage: [5, 12],
        effect: "burn",
      },
    ],
  },
  Cleric: {
    name: "Cleric",
    description: "Faith as armor, prayer as weapon.",
    baseStats: base({ wisdom: 15, constitution: 13, strength: 11 }),
    startingItemIds: ["iron_sword", "leather_armor", "minor_healing_potion", "torch"],
    hitDie: 8,
    manaDie: 8,
    abilities: [
      {
        id: "heal",
        name: "Lay on Hands",
        description: "Mend wounds with a whispered prayer.",
        manaCost: 6,
        minLevel: 1,
        heal: 18,
      },
    ],
  },
  Necromancer: {
    name: "Necromancer",
    description: "Power borrowed from the dead, always with interest.",
    baseStats: base({ intelligence: 15, wisdom: 11, constitution: 9 }),
    startingItemIds: ["bone_staff", "ancient_tome", "torch"],
    hitDie: 6,
    manaDie: 9,
    abilities: [
      {
        id: "drain_life",
        name: "Drain Life",
        description: "Siphon the enemy's vitality into your own.",
        manaCost: 9,
        minLevel: 1,
        damage: [4, 9],
        heal: 4,
      },
    ],
  },
  Thief: {
    name: "Thief",
    description: "Every lock is a suggestion. Every shadow is home.",
    baseStats: base({ dexterity: 16, luck: 14, charisma: 12 }),
    startingItemIds: ["rusty_dagger", "rusty_key", "torch", "ration"],
    hitDie: 7,
    manaDie: 2,
    abilities: [
      {
        id: "backstab",
        name: "Backstab",
        description: "A precise strike from the shadows for heavy damage.",
        manaCost: 0,
        minLevel: 1,
        damage: [6, 14],
      },
    ],
  },
  Paladin: {
    name: "Paladin",
    description: "A sword sworn to a cause, and a will that doesn't bend.",
    baseStats: base({ strength: 14, wisdom: 13, constitution: 13 }),
    startingItemIds: ["iron_sword", "wooden_shield", "chainmail", "torch"],
    hitDie: 10,
    manaDie: 5,
    abilities: [
      {
        id: "smite",
        name: "Smite",
        description: "A blow empowered by conviction.",
        manaCost: 7,
        minLevel: 1,
        damage: [5, 13],
      },
    ],
  },
  Bard: {
    name: "Bard",
    description: "Words and music as weapons, charm as armor.",
    baseStats: base({ charisma: 16, dexterity: 12, intelligence: 11 }),
    startingItemIds: ["rusty_dagger", "torch", "ration"],
    hitDie: 6,
    manaDie: 7,
    abilities: [
      {
        id: "inspire",
        name: "Inspiring Verse",
        description: "A rousing tune that steadies the nerves.",
        manaCost: 5,
        minLevel: 1,
        effect: "buff_strength",
      },
    ],
  },
  Monk: {
    name: "Monk",
    description: "No weapon but the body, no armor but discipline.",
    baseStats: base({ dexterity: 14, wisdom: 14, constitution: 13 }),
    startingItemIds: ["torch", "ration"],
    hitDie: 8,
    manaDie: 4,
    abilities: [
      {
        id: "flurry",
        name: "Flurry of Blows",
        description: "A rapid series of strikes.",
        manaCost: 4,
        minLevel: 1,
        damage: [3, 6],
      },
    ],
  },
  Druid: {
    name: "Druid",
    description: "Kinship with beast and root; the wild answers when called.",
    baseStats: base({ wisdom: 15, constitution: 12, intelligence: 12 }),
    startingItemIds: ["bone_staff", "torch", "ration"],
    hitDie: 7,
    manaDie: 8,
    abilities: [
      {
        id: "entangle",
        name: "Entangling Roots",
        description: "Roots burst from the ground to bind an enemy.",
        manaCost: 6,
        minLevel: 1,
        effect: "stun",
      },
    ],
  },
};

export function getClass(name: PlayerClass): ClassDefinition {
  return CLASSES[name];
}
