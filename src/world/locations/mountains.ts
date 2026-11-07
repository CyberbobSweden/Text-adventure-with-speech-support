import type { Location } from "@/types";

export const MOUNTAINS_LOCATIONS: Location[] = [
  {
    id: "mountains_entrance",
    name: "High Pass",
    region: "mountains",
    shortDescription: "Thin air, and a wind that never quite stops.",
    longDescription:
      "The waystone opens onto a narrow pass between two peaks, high enough that " +
      "the air feels thin and sharp in your chest. Loose scree shifts underfoot " +
      "with every step.",
    exits: [
      { direction: "east", to: "hall_of_waystones" },
      { direction: "west", to: "cliffside_trail" },
    ],
    tags: ["mountains", "frontier"],
    mapPosition: { x: 0, y: 0, z: -13 },
  },
  {
    id: "cliffside_trail",
    name: "Cliffside Trail",
    region: "mountains",
    shortDescription: "A narrow trail, a long drop on one side.",
    longDescription:
      "The trail hugs the mountainside, barely wide enough for careful footing. " +
      "Far below, clouds fill the valley like something spilled. Something " +
      "circles high overhead, patient.",
    exits: [
      { direction: "east", to: "mountains_entrance" },
      { direction: "north", to: "eagles_nest" },
      { direction: "west", to: "frozen_summit" },
      { direction: "south", to: "hidden_grotto" },
    ],
    tags: ["mountains", "frontier"],
    mapPosition: { x: -1, y: 0, z: -13 },
  },
  {
    id: "hidden_grotto",
    name: "Hidden Grotto",
    region: "mountains",
    shortDescription: "A sheltered pocket of green, tucked out of the wind.",
    longDescription:
      "Somehow, in a fold of rock out of the wind's reach, moss and small flowers " +
      "grow here undisturbed. It's the first quiet, gentle place you've found in a " +
      "long time.",
    exits: [{ direction: "north", to: "cliffside_trail" }],
    itemIds: ["minor_healing_potion", "ration"],
    isSafe: true,
    tags: ["mountains", "frontier", "landmark"],
    mapPosition: { x: -1, y: -1, z: -13 },
  },
  {
    id: "eagles_nest", 
    name: "Roc's Aerie",
    region: "mountains",
    shortDescription: "A nest built from entire trees.",
    longDescription:
      "The nest is built from whole uprooted trees, wedged into a hollow in the " +
      "peak. Bones — deer, goat, and things you don't recognize — are scattered " +
      "beneath it. The shadow you saw earlier gets larger.",
    exits: [{ direction: "south", to: "cliffside_trail" }],
    itemIds: ["gold_coin_pile"],
    monsterIds: ["roc"],
    tags: ["mountains", "frontier", "boss"],
    mapPosition: { x: -1, y: 1, z: -13 },
  },
  {
    id: "frozen_summit",
    name: "Frozen Summit",
    region: "mountains",
    shortDescription: "The highest point you've ever stood on.",
    longDescription:
      "Snow this high never melts. The view is enormous and silent — peaks in " +
      "every direction, and, very far off, what might be smoke rising from a " +
      "mountain that isn't a mountain at all.",
    exits: [{ direction: "east", to: "cliffside_trail" }],
    itemIds: ["rune_of_warding"],
    isSafe: true,
    tags: ["mountains", "frontier", "landmark"],
    mapPosition: { x: -2, y: 0, z: -13 },
  },
];
