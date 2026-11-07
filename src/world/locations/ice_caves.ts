import type { Location } from "@/types";

export const ICE_CAVES_LOCATIONS: Location[] = [
  {
    id: "ice_caves_entrance",
    name: "Ice Cave Mouth",
    region: "ice_caves",
    shortDescription: "The waystone's light fades into blue-white cold.",
    longDescription:
      "Stepping through the waystone feels like stepping through a held breath. " +
      "On the other side: ice, in every direction, glowing faintly blue where the " +
      "light finds it.",
    exits: [
      { direction: "south", to: "hall_of_waystones" },
      { direction: "north", to: "frozen_passage" },
    ],
    tags: ["ice_caves", "frontier"],
    mapPosition: { x: 0, y: 0, z: -10 },
  },
  {
    id: "frozen_passage",
    name: "Frozen Passage",
    region: "ice_caves",
    shortDescription: "Ice walls, smooth as glass, closing in slightly.",
    longDescription:
      "The passage narrows as it goes, ice pressing in from both sides. Every " +
      "surface is slick. Somewhere ahead, something cracks — ice settling, you hope.",
    exits: [
      { direction: "south", to: "ice_caves_entrance" },
      { direction: "east", to: "crystal_chamber" },
      { direction: "north", to: "frost_giant_lair" },
    ],
    monsterIds: ["young_werewolf"],
    isDark: true,
    tags: ["ice_caves", "frontier"],
    mapPosition: { x: 0, y: 1, z: -10 },
  },
  {
    id: "crystal_chamber",
    name: "Crystal Chamber",
    region: "ice_caves",
    shortDescription: "Ice crystals the size of pillars, lit from within.",
    longDescription:
      "Enormous crystals of clear ice fill this chamber, each one catching and " +
      "bending the faint light until the whole room seems to glow. Something " +
      "about it makes you want to whisper.",
    exits: [{ direction: "west", to: "frozen_passage" }],
    itemIds: ["rune_of_warding", "mana_draught"],
    isSafe: true,
    tags: ["ice_caves", "frontier", "landmark"],
    mapPosition: { x: 1, y: 1, z: -10 },
  },
  {
    id: "frost_giant_lair",
    name: "Frost Giant's Lair",
    region: "ice_caves",
    shortDescription: "Bones — some clearly not from animals — litter the ice.",
    longDescription:
      "The cave opens into a wide hollow, floor packed with old bones and torn " +
      "hide. Whatever lives here is large enough that you heard it breathing " +
      "before you saw it.",
    exits: [
      { direction: "south", to: "frozen_passage" },
      { direction: "east", to: "ice_shrine" },
    ],
    itemIds: ["lantern"],
    monsterIds: ["frost_giant"],
    isDark: true,
    tags: ["ice_caves", "frontier", "boss"],
    mapPosition: { x: 0, y: 2, z: -10 },
  },
  {
    id: "ice_shrine",
    name: "Frozen Shrine",
    region: "ice_caves",
    shortDescription: "A shrine encased entirely in clear ice.",
    longDescription:
      "Whatever this shrine once honored is frozen solid beneath a shell of ice so " +
      "clear you can see the carvings inside perfectly, untouched, waiting for a " +
      "thaw that will probably never come.",
    exits: [{ direction: "west", to: "frost_giant_lair" }],
    itemIds: ["rune_of_warding"],
    isSafe: true,
    tags: ["ice_caves", "frontier", "landmark"],
    mapPosition: { x: 1, y: 2, z: -10 },
  },
];
