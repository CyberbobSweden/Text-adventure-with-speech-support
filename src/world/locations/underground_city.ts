import type { Location } from "@/types";

export const UNDERGROUND_CITY_LOCATIONS: Location[] = [
  {
    id: "underground_city_gate",
    name: "Gate of the Sunken City",
    region: "underground_city",
    shortDescription: "A vast stone gate, half-buried, still standing.",
    longDescription:
      "Beyond the sewers, the brick gives way to something far older: a gate " +
      "carved with a script no living scholar has translated, tall enough for " +
      "giants and wide enough for armies. Whatever built this expected visitors.",
    exits: [
      { direction: "north", to: "sewer_junction" },
      { direction: "south", to: "sunken_plaza" },
    ],
    monsterIds: ["skeleton_warrior"],
    isDark: true,
    tags: ["underground_city", "underground", "landmark"],
    mapPosition: { x: 0, y: 2, z: -2 },
  },
  {
    id: "sunken_plaza",
    name: "Sunken Plaza",
    region: "underground_city",
    shortDescription: "A vast circular plaza, cracked open by roots and time.",
    longDescription:
      "This was once the heart of a city that had no business being underground — " +
      "the architecture is too grand, too deliberate, to have been built in the " +
      "dark. Whoever lived here meant to be seen. A dry fountain sits at the " +
      "center, its statue long since fallen.",
    exits: [
      { direction: "north", to: "underground_city_gate" },
      { direction: "east", to: "collapsed_market" },
      { direction: "west", to: "archive_hall" },
      { direction: "down", to: "throne_approach" },
    ],
    isSafe: true,
    tags: ["underground_city", "underground", "landmark"],
    mapPosition: { x: 0, y: 1, z: -4 },
  },
  {
    id: "collapsed_market",
    name: "Collapsed Market",
    region: "underground_city",
    shortDescription: "Stalls of stone, still standing, still empty.",
    longDescription:
      "Rows of stone market stalls line a wide avenue, each one carved rather than " +
      "built — permanent fixtures for a city that assumed it would last forever. " +
      "Some still hold pottery, perfectly preserved and utterly worthless now.",
    exits: [{ direction: "west", to: "sunken_plaza" }],
    itemIds: ["gold_coin_pile", "silver_ring"],
    monsterIds: ["dark_elf_blade"],
    isDark: true,
    tags: ["underground_city", "underground"],
    mapPosition: { x: 1, y: 1, z: -4 },
  },
  {
    id: "archive_hall",
    name: "Archive Hall",
    region: "underground_city",
    shortDescription: "Shelves of stone tablets stretch into the dark.",
    longDescription:
      "Thousands of carved tablets line shelves cut directly into the walls. Most " +
      "are in the same untranslated script as the gate above — but a few, near " +
      "the entrance, are in a hand you almost recognize.",
    exits: [
      { direction: "east", to: "sunken_plaza" },
      { direction: "down", to: "temple_antechamber" },
      { direction: "north", to: "scriptorium" },
    ],
    features: [
      {
        id: "tablets",
        name: "tablets",
        synonyms: ["stone tablets", "carvings"],
        description: "Rows of carved stone tablets, most untranslatable.",
        onInspect:
          "One tablet, newer than the rest, is carved in a script you recognize " +
          "from the seal you found in the crypt above. It names a kingdom, and a " +
          "king, and says only that the king is 'unbound, and waiting.'",
      },
    ],
    itemIds: ["ancient_tome"],
    isSafe: true,
    tags: ["underground_city", "underground", "lore"],
    mapPosition: { x: -1, y: 1, z: -4 },
  },
  {
    id: "scriptorium",
    name: "Scriptorium",
    region: "underground_city",
    shortDescription: "Writing desks, still set with dried ink.",
    longDescription:
      "Dozens of small desks face the same direction, each one still holding the " +
      "tools of a scribe who never finished their work: dried ink, a stylus, a " +
      "tablet half-carved and abandoned mid-sentence.",
    exits: [{ direction: "south", to: "archive_hall" }],
    itemIds: ["ancient_tome", "mana_draught"],
    isSafe: true,
    tags: ["underground_city", "underground", "lore"],
    mapPosition: { x: -1, y: 2, z: -4 },
  },
  {
    id: "throne_approach",
    name: "Approach to the Sunken Throne",
    region: "underground_city",
    shortDescription: "A wide processional hall, lined with broken banners.",
    longDescription:
      "Whatever banners once hung here have rotted to threads. The hall slopes " +
      "gently downward, toward a set of doors easily three times your height, " +
      "standing very slightly ajar.",
    exits: [
      { direction: "up", to: "sunken_plaza" },
      { direction: "south", to: "sunken_throne_room" },
      { direction: "down", to: "hall_of_waystones" },
    ],
    isDark: true,
    tags: ["underground_city", "underground"],
    mapPosition: { x: 0, y: 0, z: -4 },
  },
  {
    id: "sunken_throne_room",
    name: "Sunken Throne Room",
    region: "underground_city",
    shortDescription: "An empty throne, and a room that remembers being full.",
    longDescription:
      "The throne itself is intact, carved from a single slab of black stone. " +
      "Everything else in the room has been disturbed, overturned, or clawed apart " +
      "— except the throne, which nothing in this room has dared to touch.",
    exits: [{ direction: "north", to: "throne_approach" }],
    itemIds: ["rune_of_warding"],
    monsterIds: ["fire_elemental"],
    isDark: true,
    tags: ["underground_city", "underground", "boss", "treasure"],
    mapPosition: { x: 0, y: -1, z: -4 },
  },
  {
    id: "hall_of_waystones",
    name: "Hall of Waystones",
    region: "underground_city",
    shortDescription: "Five carved stones stand in a perfect circle.",
    longDescription:
      "Each waystone bears a different rune — ice, flame, sand, peak, and marsh — " +
      "and each hums faintly under your hand, like something enormous breathing " +
      "very slowly, very far away. This is how the old kingdom reached the rest of " +
      "the world without ever leaving the dark.",
    exits: [
      { direction: "up", to: "throne_approach" },
      { direction: "north", to: "ice_caves_entrance", hidden: true, description: "A path of cold air, opened by the frost waystone." },
      { direction: "south", to: "volcano_entrance", hidden: true, description: "A path of heat, opened by the fire waystone." },
      { direction: "east", to: "desert_entrance", hidden: true, description: "A path of dry wind, opened by the sand waystone." },
      { direction: "west", to: "mountains_entrance", hidden: true, description: "A path of thin air, opened by the peak waystone." },
      { direction: "down", to: "swamp_entrance", hidden: true, description: "A path of wet rot, opened by the marsh waystone." },
    ],
    features: [
      {
        id: "ice_waystone",
        name: "ice waystone",
        synonyms: ["frost waystone", "ice rune"],
        description: "A waystone carved with a rune of frost.",
        interactions: {
          read: {
            text: "The frost rune flares cold-white. A path opens north, into biting cold.",
            revealsExit: "north",
            setsFlag: "activated_ice_waystone",
          },
        },
      },
      {
        id: "fire_waystone",
        name: "fire waystone",
        synonyms: ["flame waystone", "fire rune"],
        description: "A waystone carved with a rune of flame.",
        interactions: {
          read: {
            text: "The flame rune flares amber-hot. A path opens south, into heat and ash.",
            revealsExit: "south",
            setsFlag: "activated_fire_waystone",
          },
        },
      },
      {
        id: "sand_waystone",
        name: "sand waystone",
        synonyms: ["desert waystone", "sand rune"],
        description: "A waystone carved with a rune of sand.",
        interactions: {
          read: {
            text: "The sand rune flares pale gold. A path opens east, into dry wind.",
            revealsExit: "east",
            setsFlag: "activated_sand_waystone",
          },
        },
      },
      {
        id: "peak_waystone",
        name: "peak waystone",
        synonyms: ["mountain waystone", "peak rune"],
        description: "A waystone carved with a rune of high stone.",
        interactions: {
          read: {
            text: "The peak rune flares pale grey. A path opens west, into thin air.",
            revealsExit: "west",
            setsFlag: "activated_peak_waystone",
          },
        },
      },
      {
        id: "marsh_waystone",
        name: "marsh waystone",
        synonyms: ["swamp waystone", "marsh rune"],
        description: "A waystone carved with a rune of standing water.",
        interactions: {
          read: {
            text: "The marsh rune flares murky green. A path opens down, into wet rot.",
            revealsExit: "down",
            setsFlag: "activated_marsh_waystone",
          },
        },
      },
    ],
    isSafe: true,
    tags: ["underground_city", "underground", "landmark", "hub"],
    mapPosition: { x: 0, y: -2, z: -4 },
  },
];
