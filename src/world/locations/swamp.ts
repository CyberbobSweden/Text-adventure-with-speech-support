import type { Location } from "@/types";

export const SWAMP_LOCATIONS: Location[] = [
  {
    id: "swamp_entrance",
    name: "Mire's Edge",
    region: "swamp",
    shortDescription: "Wet rot and standing water, as far as you can see.",
    longDescription:
      "The waystone opens onto a swamp so still it barely seems to move — until " +
      "something unseen shifts in the reeds, and every frog within earshot goes " +
      "quiet at once.",
    exits: [
      { direction: "up", to: "hall_of_waystones" },
      { direction: "south", to: "sunken_ruins" },
    ],
    tags: ["swamp", "frontier"],
    mapPosition: { x: 0, y: 0, z: -14 },
  },
  {
    id: "sunken_ruins",
    name: "Sunken Ruins",
    region: "swamp",
    shortDescription: "Broken columns rising out of black water.",
    longDescription:
      "Stone columns break the surface of the water at odd angles, the remains of " +
      "something that sank slowly enough for moss to claim every inch. It might " +
      "have been a shrine, once.",
    exits: [
      { direction: "north", to: "swamp_entrance" },
      { direction: "east", to: "witch_hut" },
      { direction: "south", to: "drowned_grove" },
    ],
    monsterIds: ["giant_spider"],
    tags: ["swamp", "frontier"],
    mapPosition: { x: 0, y: -1, z: -14 },
  },
  {
    id: "drowned_grove",
    name: "Drowned Grove",
    region: "swamp",
    shortDescription: "Trees standing waist-deep in still black water.",
    longDescription:
      "The trees here have adapted to standing in water that never recedes, roots " +
      "arched above the surface like something trying to climb out. It's quiet in " +
      "a way that feels deliberate rather than peaceful.",
    exits: [{ direction: "north", to: "sunken_ruins" }],
    itemIds: ["spider_silk", "iron_ore"],
    tags: ["swamp", "frontier", "water"],
    mapPosition: { x: 0, y: -2, z: -14 },
  },
  {
    id: "witch_hut",
    name: "Witch's Hut",
    region: "swamp",
    shortDescription: "A hut on stilts, leaning but occupied.",
    longDescription:
      "The hut leans hard to one side but hasn't fallen, propped up by roots that " +
      "seem to have grown around it on purpose. Jars line every shelf inside, " +
      "each one holding something you'd rather not identify.",
    exits: [{ direction: "west", to: "sunken_ruins" }],
    itemIds: ["scroll_of_fireball", "mana_draught"],
    monsterIds: ["bog_witch"],
    tags: ["swamp", "frontier", "boss"],
    mapPosition: { x: 1, y: -1, z: -14 },
  },
];
