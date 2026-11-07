import type { Item } from "@/types";

/**
 * Central item registry. Locations and loot tables reference items by id
 * only — this file is the single source of truth for what an id means.
 * Add new items here; nothing else needs to change.
 */
export const ITEMS: Record<string, Item> = {
  // --- Progression / map system --------------------------------------
  old_paper: {
    id: "old_paper",
    name: "Old Paper",
    synonyms: ["paper", "parchment"],
    type: "map_tool",
    rarity: "common",
    description:
      "A blank, yellowed sheet of paper. It feels like it wants to hold something.",
    weight: 0,
    value: 0,
    unlocksCommand: "map",
  },
  rusty_pencil: {
    id: "rusty_pencil",
    name: "Rusty Pencil",
    synonyms: ["pencil", "charcoal"],
    type: "tool",
    rarity: "common",
    description: "A stub of a pencil, barely sharp enough to write with.",
    weight: 0,
    value: 0,
    unlocksCommand: "journal",
  },
  enchanted_compass: {
    id: "enchanted_compass",
    name: "Enchanted Compass",
    type: "map_tool",
    rarity: "rare",
    description:
      "Its needle doesn't point north — it points toward the nearest unexplored passage.",
    weight: 1,
    value: 250,
    unlocksCommand: "reveal_exits",
  },

  // --- Light sources ---------------------------------------------------
  torch: {
    id: "torch",
    name: "Torch",
    type: "light_source",
    rarity: "common",
    description: "A wooden torch, unlit. Burns for a while once lit.",
    weight: 2,
    value: 2,
    isLightSource: true,
  },
  lantern: {
    id: "lantern",
    name: "Brass Lantern",
    type: "light_source",
    rarity: "uncommon",
    description: "An old brass lantern. Steadier and longer-lasting than a torch.",
    weight: 3,
    value: 40,
    isLightSource: true,
  },

  // --- Weapons ----------------------------------------------------------
  rusty_dagger: {
    id: "rusty_dagger",
    name: "Rusty Dagger",
    type: "weapon",
    rarity: "common",
    description: "Pitted with rust, but still holds an edge.",
    weight: 1,
    value: 5,
    equipSlot: "mainHand",
    damage: [1, 4],
  },
  iron_sword: {
    id: "iron_sword",
    name: "Iron Sword",
    type: "weapon",
    rarity: "common",
    description: "A serviceable blade, well balanced.",
    weight: 4,
    value: 25,
    equipSlot: "mainHand",
    damage: [3, 8],
  },
  oak_longbow: {
    id: "oak_longbow",
    name: "Oak Longbow",
    type: "weapon",
    rarity: "uncommon",
    description: "A hunter's bow, carved from a single piece of oak.",
    weight: 3,
    value: 35,
    equipSlot: "mainHand",
    damage: [2, 7],
  },
  bone_staff: {
    id: "bone_staff",
    name: "Bone Staff",
    type: "weapon",
    rarity: "uncommon",
    description: "Topped with a yellowed skull fragment. It hums faintly.",
    weight: 3,
    value: 45,
    equipSlot: "mainHand",
    damage: [1, 5],
    effect: { stat: "intelligence", amount: 2 },
  },
  flametongue: {
    id: "flametongue",
    name: "Flametongue",
    type: "weapon",
    rarity: "legendary",
    description:
      "A longsword wreathed in silent flame that never burns its wielder's hand.",
    weight: 4,
    value: 5000,
    equipSlot: "mainHand",
    damage: [6, 14],
    effect: { fireDamageBonus: 4 },
  },

  // --- Armor / shields ----------------------------------------------------
  leather_armor: {
    id: "leather_armor",
    name: "Leather Armor",
    type: "armor",
    rarity: "common",
    description: "Boiled leather, cracked but functional.",
    weight: 6,
    value: 15,
    equipSlot: "chest",
    armorValue: 3,
  },
  chainmail: {
    id: "chainmail",
    name: "Chainmail Hauberk",
    type: "armor",
    rarity: "uncommon",
    description: "Interlocking rings of cold iron.",
    weight: 14,
    value: 60,
    equipSlot: "chest",
    armorValue: 7,
  },
  wooden_shield: {
    id: "wooden_shield",
    name: "Wooden Shield",
    type: "shield",
    rarity: "common",
    description: "Banded in iron, dented from old blows.",
    weight: 5,
    value: 12,
    equipSlot: "offHand",
    armorValue: 2,
  },

  // --- Potions / consumables ------------------------------------------
  minor_healing_potion: {
    id: "minor_healing_potion",
    name: "Minor Healing Potion",
    type: "potion",
    rarity: "common",
    description: "A small vial of red liquid, warm to the touch.",
    weight: 0.5,
    value: 10,
    stackable: true,
    effect: { heal: 20 },
  },
  mana_draught: {
    id: "mana_draught",
    name: "Mana Draught",
    type: "potion",
    rarity: "common",
    description: "Faintly luminous blue liquid that tastes of static.",
    weight: 0.5,
    value: 12,
    stackable: true,
    effect: { mana: 20 },
  },
  ration: {
    id: "ration",
    name: "Dried Rations",
    type: "food",
    rarity: "common",
    description: "Hard bread and salted meat. Not appetizing, but filling.",
    weight: 1,
    value: 2,
    stackable: true,
    effect: { heal: 5 },
  },

  // --- Scrolls / books ---------------------------------------------------
  scroll_of_fireball: {
    id: "scroll_of_fireball",
    name: "Scroll of Fireball",
    type: "scroll",
    rarity: "rare",
    description: "The parchment is warm even before you unroll it.",
    weight: 0.1,
    value: 80,
  },
  ancient_tome: {
    id: "ancient_tome",
    name: "Ancient Tome",
    synonyms: ["tome", "book"],
    type: "book",
    rarity: "rare",
    description:
      "Bound in something that was once alive. The pages describe the fall of a lost kingdom.",
    weight: 3,
    value: 100,
  },

  // --- Keys / quest items -------------------------------------------------
  rusty_key: {
    id: "rusty_key",
    name: "Rusty Key",
    type: "key",
    rarity: "common",
    description: "A small iron key, orange with rust.",
    weight: 0.1,
    value: 0,
  },
  crypt_seal: {
    id: "crypt_seal",
    name: "Crypt Seal",
    type: "quest",
    rarity: "rare",
    description: "A wax seal bearing the crest of a forgotten royal house.",
    weight: 0.1,
    value: 0,
    questItem: true,
  },

  // --- Treasure / crafting materials --------------------------------------
  gold_coin_pile: {
    id: "gold_coin_pile",
    name: "Pile of Gold Coins",
    synonyms: ["gold", "coins", "gold coins", "pile of gold"],
    type: "treasure",
    rarity: "common",
    description: "Coins stamped with the sigil of a kingdom long fallen.",
    weight: 1,
    value: 50,
    stackable: true,
  },
  silver_ring: {
    id: "silver_ring",
    name: "Tarnished Silver Ring",
    synonyms: ["ring"],
    type: "jewelry",
    rarity: "uncommon",
    description: "Etched with runes too worn to read.",
    weight: 0.1,
    value: 40,
    equipSlot: "ring",
  },
  iron_ore: {
    id: "iron_ore",
    name: "Iron Ore",
    type: "material",
    rarity: "common",
    description: "A rough, heavy chunk of unrefined ore.",
    weight: 3,
    value: 4,
    stackable: true,
  },
  spider_silk: {
    id: "spider_silk",
    name: "Spider Silk",
    type: "material",
    rarity: "uncommon",
    description: "Impossibly strong for how light it is.",
    weight: 0.2,
    value: 8,
    stackable: true,
  },
  rune_of_warding: {
    id: "rune_of_warding",
    name: "Rune of Warding",
    synonyms: ["rune"],
    type: "rune",
    rarity: "epic",
    description: "A carved stone that hums when danger is near.",
    weight: 0.5,
    value: 300,
  },
  sunken_crown: {
    id: "sunken_crown",
    name: "Crown of the Sunken King",
    synonyms: ["crown"],
    type: "treasure",
    rarity: "artifact",
    description:
      "Black stone and tarnished gold, still faintly warm. Whoever wore this ruled " +
      "a kingdom that doesn't exist anymore, in a way that suggests it might not " +
      "mind trying again.",
    weight: 1,
    value: 10000,
    questItem: true,
  },
};

export function getItem(id: string): Item | undefined {
  return ITEMS[id];
}

export function findItemByName(query: string): Item | undefined {
  const q = query.trim().toLowerCase();
  return Object.values(ITEMS).find(
    (item) =>
      item.name.toLowerCase() === q ||
      item.name.toLowerCase().includes(q) ||
      item.synonyms?.some((s) => s.toLowerCase() === q)
  );
}
