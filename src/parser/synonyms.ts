/**
 * Every alias maps to one canonical verb. This is the piece that lets
 * "go north" / "north" / "n" / "walk north" / "head north" all behave
 * identically, and "attack" / "kill" / "fight" / "hit" / "stab" collapse
 * into a single combat verb.
 *
 * Adding a new synonym is a one-line change here — nothing else in the
 * engine needs to know about it.
 */

export const VERB_SYNONYMS: Record<string, string> = {
  // Movement
  go: "go",
  walk: "go",
  move: "go",
  head: "go",
  run: "go",
  travel: "go",
  climb: "climb",
  enter: "go",
  leave: "go",
  exit: "go",

  // Looking / senses
  look: "look",
  l: "look",
  view: "look",
  examine: "inspect",
  x: "inspect",
  check: "inspect",
  inspect: "inspect",
  study: "inspect",
  search: "search",
  explore: "search",
  listen: "listen",
  hear: "listen",
  smell: "smell",
  sniff: "smell",
  taste: "taste",

  // Inventory / items
  take: "take",
  get: "take",
  grab: "take",
  pick: "take", // "pick lock" handled specially in Parser
  drop: "drop",
  discard: "drop",
  put: "put",
  place: "put",
  insert: "put",
  give: "give",
  inventory: "inventory",
  i: "inventory",
  inv: "inventory",
  wear: "wear",
  don: "wear",
  equip: "equip",
  wield: "equip",
  hold: "equip",
  remove: "unequip",
  unequip: "unequip",
  doff: "unequip",

  // Combat
  attack: "attack",
  kill: "attack",
  fight: "attack",
  hit: "attack",
  stab: "attack",
  strike: "attack",
  slay: "attack",
  murder: "attack",
  shoot: "shoot",
  fire: "shoot",
  throw: "throw",
  hurl: "throw",
  flee: "flee",
  retreat: "flee",
  cast: "cast",
  spell: "cast",

  // Consumables
  drink: "drink",
  quaff: "drink",
  eat: "eat",
  consume: "eat",
  use: "use",

  // Doors / containers
  open: "open",
  close: "close",
  shut: "close",
  unlock: "unlock",
  lock: "lock",
  push: "push",
  pull: "pull",

  // Interaction
  read: "read",
  pray: "pray",
  sit: "sit",
  dig: "dig",
  swim: "swim",
  hide: "hide",
  sneak: "sneak",

  // Social / commerce
  talk: "talk",
  speak: "talk",
  ask: "ask",
  buy: "buy",
  purchase: "buy",
  sell: "sell",

  // Crafting
  craft: "craft",
  make: "craft",
  combine: "combine",
  merge: "combine",

  // Meta / system
  stats: "stats",
  character: "stats",
  sheet: "stats",
  score: "score",
  points: "score",
  xyzzy: "xyzzy",
  plugh: "plugh",
  swear: "swear",
  curse: "swear",
  sing: "sing",
  dance: "dance",
  count: "count",
  zork: "zork",
  yell: "yell",
  scream: "yell",
  shout: "yell",
  spells: "spells",
  abilities: "spells",
  quests: "quests",
  completion: "completion",
  progress: "completion",
  journal: "journal",
  map: "map",
  save: "save",
  load: "load",
  help: "help",
  hint: "hint",
  rest: "rest",
  sleep: "rest",
  camp: "rest",
  light: "light",
  ignite: "light",
};

export const DIRECTION_WORDS: Record<string, string> = {
  north: "north",
  n: "north",
  south: "south",
  s: "south",
  east: "east",
  e: "east",
  west: "west",
  w: "west",
  up: "up",
  u: "up",
  down: "down",
  d: "down",
  in: "in",
  inside: "in",
  out: "out",
  outside: "out",
};

/** Words the parser strips out entirely — articles and filler. */
export const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "my",
  "please",
  "around",
  "here",
  "now",
]);

/** Prepositions that separate direct object from indirect object. */
export const PREPOSITIONS = new Set([
  "with",
  "using",
  "on",
  "in",
  "at",
  "to",
  "about",
  "from",
  "into",
]);
