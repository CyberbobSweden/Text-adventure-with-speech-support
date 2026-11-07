/**
 * Core domain types shared across the whole game.
 * Nothing in here has logic — it's the vocabulary every module speaks.
 */

// ---------------------------------------------------------------------------
// World / geography
// ---------------------------------------------------------------------------

export type Region =
  | "surface"
  | "village"
  | "forest"
  | "dark_forest"
  | "castle"
  | "ruins"
  | "dungeon"
  | "mine"
  | "sewers"
  | "underground_city"
  | "ancient_temple"
  | "crypt"
  | "volcano"
  | "ice_caves"
  | "desert"
  | "mountains"
  | "swamp";

export type Direction =
  | "north"
  | "south"
  | "east"
  | "west"
  | "up"
  | "down"
  | "in"
  | "out";

export const DIRECTION_ABBREVIATIONS: Record<string, Direction> = {
  n: "north",
  s: "south",
  e: "east",
  w: "west",
  u: "up",
  d: "down",
};

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
  up: "down",
  down: "up",
  in: "out",
  out: "in",
};

/** A single exit from a location. Can be locked, hidden, or one-way. */
export interface Exit {
  direction: Direction;
  to: string; // Location id
  locked?: boolean;
  keyItemId?: string;
  hidden?: boolean; // Not shown until discovered via `search`
  description?: string; // Optional flavor shown on `look <direction>`
  oneWay?: boolean;
}

/** A feature the player can `inspect`, `search`, `push`, `pull` etc. */
export interface Feature {
  id: string;
  name: string;
  synonyms?: string[];
  description: string;
  onInspect?: string; // Extra text revealed only via `inspect`
  searchable?: boolean;
  searchResult?: { itemIds?: string[]; text: string; revealsExit?: Direction };
  interactions?: Partial<Record<InteractionVerb, InteractionResult>>;
}

export type InteractionVerb =
  | "push"
  | "pull"
  | "open"
  | "close"
  | "unlock"
  | "read"
  | "pray"
  | "sit"
  | "climb"
  | "dig"
  | "listen"
  | "smell"
  | "taste";

export interface InteractionResult {
  text: string;
  revealsExit?: Direction;
  grantsItemId?: string;
  requiresItemId?: string;
  requiresFlag?: string;
  setsFlag?: string;
  triggersEncounterId?: string;
}

export interface Location {
  id: string;
  name: string;
  region: Region;
  /** Short line shown every visit, even after the first. */
  shortDescription: string;
  /** Long, atmospheric text shown on first visit or `look`. */
  longDescription: string;
  exits: Exit[];
  features?: Feature[];
  itemIds?: string[]; // Items lying on the ground, loaded into GameState on first entry
  monsterIds?: string[]; // Monsters present when the player arrives (spawned once)
  npcIds?: string[];
  ambientSounds?: string[]; // Rotated by the audio system
  isDark?: boolean; // Requires a light source
  isSafe?: boolean; // No random encounters, can rest here
  tags?: string[]; // Free-form, used by quests/generators ("water", "underground", ...)
  /** Coordinates used purely for map rendering — not a physics grid. */
  mapPosition?: { x: number; y: number; z: number };
}

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------

export type ItemType =
  | "weapon"
  | "armor"
  | "shield"
  | "potion"
  | "scroll"
  | "book"
  | "key"
  | "tool"
  | "food"
  | "treasure"
  | "quest"
  | "material"
  | "map_tool"
  | "light_source"
  | "jewelry"
  | "rune";

export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "artifact";

export interface ItemEffect {
  stat?: keyof CharacterStats;
  amount?: number;
  heal?: number;
  mana?: number;
  duration?: number; // Turns; omit for permanent
  fireDamageBonus?: number;
}

export interface Item {
  id: string;
  name: string;
  synonyms?: string[];
  type: ItemType;
  rarity: Rarity;
  description: string;
  weight: number;
  value: number;
  stackable?: boolean;
  equipSlot?: EquipSlot;
  damage?: [number, number]; // min, max
  armorValue?: number;
  effect?: ItemEffect;
  unlocksCommand?: string; // e.g. "map" for Old Paper, "journal" for pencil
  isLightSource?: boolean;
  questItem?: boolean;
}

export type EquipSlot =
  | "mainHand"
  | "offHand"
  | "head"
  | "chest"
  | "hands"
  | "feet"
  | "ring"
  | "amulet";

// ---------------------------------------------------------------------------
// Characters / classes / monsters
// ---------------------------------------------------------------------------

export interface CharacterStats {
  strength: number;
  dexterity: number;
  wisdom: number;
  constitution: number;
  intelligence: number;
  charisma: number;
  luck: number;
}

export type PlayerClass =
  | "Knight"
  | "Ranger"
  | "Mage"
  | "Cleric"
  | "Necromancer"
  | "Thief"
  | "Paladin"
  | "Bard"
  | "Monk"
  | "Druid";

export interface ClassDefinition {
  name: PlayerClass;
  description: string;
  baseStats: CharacterStats;
  startingItemIds: string[];
  hitDie: number; // e.g. 10 -> d10 per level
  manaDie: number; // 0 for martial classes
  abilities: SpellOrAbility[];
}

export interface SpellOrAbility {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  minLevel: number;
  damage?: [number, number];
  heal?: number;
  effect?: "burn" | "stun" | "poison" | "buff_strength" | "shield" | "curse";
}

export type MonsterFamily =
  | "goblinoid"
  | "undead"
  | "dragon"
  | "construct"
  | "beast"
  | "demon"
  | "elemental"
  | "humanoid"
  | "ooze"
  | "spider"
  | "vampire"
  | "ghost";

export interface Monster {
  id: string;
  name: string;
  family: MonsterFamily;
  level: number;
  health: number;
  damage: [number, number];
  armor: number;
  xpReward: number;
  goldReward: [number, number];
  lootTable?: LootEntry[];
  description: string;
  abilities?: SpellOrAbility[];
  fleeChance?: number; // 0-1, chance it flees below 20% hp
}

export interface LootEntry {
  itemId: string;
  chance: number; // 0-1
  minQty?: number;
  maxQty?: number;
}

export interface NPC {
  id: string;
  name: string;
  description: string;
  dialogue: DialogueNode[];
  shopInventory?: { itemId: string; price: number }[];
  questGiverFor?: string[]; // Quest ids
}

export interface DialogueNode {
  id: string;
  topic: string; // matched against "ask <npc> about <topic>" / "talk"
  synonyms?: string[];
  text: string;
  requiresFlag?: string;
  setsFlag?: string;
  startsQuestId?: string;
}

// ---------------------------------------------------------------------------
// Quests
// ---------------------------------------------------------------------------

export type QuestStatus = "not_started" | "active" | "completed" | "failed";

export interface QuestStage {
  id: string;
  description: string;
  completeWhenFlag: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  isMain: boolean;
  stages: QuestStage[];
  rewardXp: number;
  rewardGold?: number;
  rewardItemIds?: string[];
  giverNpcId?: string;
  /** Starts tracking automatically at game creation, no NPC required. */
  autoStart?: boolean;
}

// ---------------------------------------------------------------------------
// Game state
// ---------------------------------------------------------------------------

export interface InventorySlot {
  itemId: string;
  quantity: number;
  equipped?: boolean;
}

export interface PlayerState {
  name: string;
  class: PlayerClass;
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: CharacterStats;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  gold: number;
  inventory: InventorySlot[];
  equipment: Partial<Record<EquipSlot, string>>; // itemId per slot
  currentLocationId: string;
  torchLit: boolean;
  turnsSinceRest: number;
}

export interface WorldRuntimeState {
  /** Locations the player has physically entered. */
  visitedLocationIds: Set<string>;
  /** Location ids the player knows exist but hasn't entered (rumor / map edge). */
  knownLocationIds: Set<string>;
  /** Extra items dropped into a location at runtime, keyed by location id. */
  locationItemOverrides: Record<string, string[]>;
  /** Monsters killed permanently (won't respawn), keyed by "locationId:monsterId". */
  defeatedMonsters: Set<string>;
  /** Arbitrary story/world flags, e.g. "found_old_paper", "village_gate_open". */
  flags: Set<string>;
  /** Discovered hidden exits, keyed by "locationId:direction". */
  revealedExits: Set<string>;
  /** Item ids banked in the Village Square trophy case (Zork-style scoring). */
  trophyCase: string[];
}

export type Difficulty = "easy" | "normal" | "hard";

export interface GameState {
  player: PlayerState;
  world: WorldRuntimeState;
  quests: Record<string, QuestStatus>;
  questProgress: Record<string, string /* current stage id */>;
  turnCount: number;
  log: LogEntry[];
  unlockedCommands: Set<string>; // "map", "journal", etc. gated by items
  seed: string;
  difficulty: Difficulty;
  score: number;
}

export interface LogEntry {
  turn: number;
  text: string;
  kind: "narration" | "command_echo" | "system" | "combat" | "dialogue";
}

// ---------------------------------------------------------------------------
// Serialization (JSON save files)
// ---------------------------------------------------------------------------

export interface SaveFileV1 {
  version: 1;
  savedAt: string;
  player: PlayerState;
  world: {
    visitedLocationIds: string[];
    knownLocationIds: string[];
    locationItemOverrides: Record<string, string[]>;
    defeatedMonsters: string[];
    flags: string[];
    revealedExits: string[];
    trophyCase: string[];
  };
  quests: Record<string, QuestStatus>;
  questProgress: Record<string, string>;
  turnCount: number;
  unlockedCommands: string[];
  seed: string;
  difficulty: Difficulty;
  score: number;
}

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

export interface ParsedCommand {
  verb: string; // Normalized canonical verb, e.g. "go", "attack", "take"
  rawInput: string;
  directObject?: string;
  indirectObject?: string;
  preposition?: string;
}

export interface CommandResult {
  text: string;
  turnConsumed: boolean;
  kind?: LogEntry["kind"];
}
