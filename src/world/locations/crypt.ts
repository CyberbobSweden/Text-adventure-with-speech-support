import type { Location } from "@/types";

export const CRYPT_LOCATIONS: Location[] = [
  {
    id: "crypt_corridor",
    name: "Crypt Corridor",
    region: "crypt",
    shortDescription: "A long hall lined with sealed alcoves.",
    longDescription:
      "Dozens of stone alcoves line the walls, each sealed with a name-plate too " +
      "worn to read. Dust lies thick except for a single dragged trail down the " +
      "center of the floor — something has been through here recently.",
    exits: [
      { direction: "up", to: "dungeon_entrance" },
      { direction: "east", to: "ossuary" },
      { direction: "west", to: "forgotten_crypt" },
      { direction: "north", to: "catacombs_entrance" },
    ],
    monsterIds: ["skeleton_warrior"],
    isDark: true,
    tags: ["crypt", "underground"],
    mapPosition: { x: 2, y: -3, z: -3 },
  },
  {
    id: "ossuary",
    name: "Ossuary",
    region: "crypt",
    shortDescription: "Bones, sorted and stacked with unsettling care.",
    longDescription:
      "Femurs and skulls are arranged floor to ceiling in deliberate patterns — " +
      "not a mass grave, but a monument. Whoever built this wanted the dead " +
      "remembered, or wanted something to feed on them in an orderly fashion.",
    exits: [
      { direction: "west", to: "crypt_corridor" },
      { direction: "east", to: "bone_chapel" },
    ],
    itemIds: ["scroll_of_fireball"],
    monsterIds: ["crypt_wraith"],
    isDark: true,
    tags: ["crypt", "underground"],
    mapPosition: { x: 3, y: -3, z: -3 },
  },
  {
    id: "bone_chapel",
    name: "Bone Chapel",
    region: "crypt",
    shortDescription: "An altar built entirely from interlocked bones.",
    longDescription:
      "Every surface — walls, floor, the altar itself — is bone, fitted together " +
      "with a mason's precision. Whatever congregation once knelt here believed in " +
      "something that outlasted their bodies.",
    exits: [{ direction: "west", to: "ossuary" }],
    features: [
      {
        id: "bone_altar",
        name: "altar",
        description: "An altar of fitted bone, worn smooth at the edges from touch.",
        interactions: {
          pray: {
            text:
              "You kneel. For a moment the chapel feels less like a tomb and more " +
              "like a promise someone kept for a very long time.",
            setsFlag: "prayed_at_bone_chapel",
          },
        },
      },
    ],
    monsterIds: ["crypt_vampire"],
    isDark: true,
    tags: ["crypt", "underground", "boss"],
    mapPosition: { x: 4, y: -3, z: -3 },
  },
  {
    id: "forgotten_crypt",
    name: "Forgotten Crypt",
    region: "crypt",
    shortDescription: "The air here is colder than it has any right to be.",
    longDescription:
      "A single sarcophagus dominates the room, its lid cracked and shifted, just " +
      "enough to suggest it was opened from the inside. Frost rims every surface " +
      "despite the depth. This is the room from the old map's warning.",
    exits: [{ direction: "east", to: "crypt_corridor" }],
    features: [
      {
        id: "sarcophagus",
        name: "sarcophagus",
        description: "A stone coffin, lid ajar. Cold radiates from the gap.",
        interactions: {
          open: {
            text:
              "Inside, wrapped in rotted silk, lies a wax-sealed letter and a " +
              "seal bearing a crest you don't recognize — yet.",
            grantsItemId: "crypt_seal",
            setsFlag: "opened_forgotten_sarcophagus",
          },
        },
      },
    ],
    monsterIds: ["lich_apprentice"],
    isDark: true,
    tags: ["crypt", "underground", "boss"],
    mapPosition: { x: 1, y: -3, z: -3 },
  },
  {
    id: "catacombs_entrance",
    name: "Catacombs Entrance",
    region: "crypt",
    shortDescription: "Roughly-cut stairs descend from the graveyard above.",
    longDescription:
      "The passage down from the graveyard opens into worked stone far older than " +
      "any grave above it — as if the village had been built on top of something, " +
      "rather than beside it.",
    exits: [
      { direction: "up", to: "graveyard" },
      { direction: "south", to: "crypt_corridor" },
      { direction: "east", to: "catacombs_gallery" },
    ],
    isDark: true,
    tags: ["crypt", "underground", "shortcut"],
    mapPosition: { x: 1, y: -2, z: -3 },
  },
  {
    id: "catacombs_gallery",
    name: "Catacombs Gallery",
    region: "crypt",
    shortDescription: "A long gallery of shelved remains, floor to ceiling.",
    longDescription:
      "Bones are shelved here by the thousand, sorted with an obsessive, ancient " +
      "care. A faint draft moves through, coming from somewhere deeper than this " +
      "gallery was built to go.",
    exits: [
      { direction: "west", to: "catacombs_entrance" },
      { direction: "south", to: "hidden_reliquary", hidden: true, description: "A gap behind a loose shelf." },
    ],
    monsterIds: ["skeleton_warrior"],
    features: [
      {
        id: "loose_shelf",
        name: "shelf",
        synonyms: ["loose shelf", "bone shelf"],
        description: "One shelf sits slightly askew, as if it's been moved and replaced many times.",
        searchable: true,
        searchResult: {
          text: "You shift the shelf aside and find a passage behind it, easy to miss unless you were looking.",
          revealsExit: "south",
        },
      },
    ],
    isDark: true,
    tags: ["crypt", "underground"],
    mapPosition: { x: 2, y: -2, z: -3 },
  },
  {
    id: "hidden_reliquary",
    name: "Hidden Reliquary",
    region: "crypt",
    shortDescription: "A small, secret room lined with reliquary boxes.",
    longDescription:
      "Someone hid this room on purpose. Dozens of small carved boxes line shelves " +
      "cut directly into the rock, each one sealed with wax stamped with the same " +
      "unfamiliar crest you've seen before.",
    exits: [
      { direction: "north", to: "catacombs_gallery" },
      { direction: "down", to: "sealed_vault" },
    ],
    itemIds: ["ancient_tome", "rune_of_warding"],
    isSafe: true,
    tags: ["crypt", "underground", "treasure"],
    mapPosition: { x: 2, y: -1, z: -3 },
  },
  {
    id: "sealed_vault",
    name: "Sealed Vault",
    region: "crypt",
    shortDescription: "A door that was sealed shut, and stayed that way.",
    longDescription:
      "Whoever sealed this vault meant it to stay sealed forever — the door is " +
      "fused to the frame with something that looks less like rust and more like " +
      "deliberate ruin, applied on purpose, from the outside.",
    exits: [{ direction: "up", to: "hidden_reliquary" }],
    itemIds: ["gold_coin_pile", "silver_ring"],
    monsterIds: ["crypt_wraith"],
    isDark: true,
    tags: ["crypt", "underground", "treasure"],
    mapPosition: { x: 2, y: 0, z: -3 },
  },
];
