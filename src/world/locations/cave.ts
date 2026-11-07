import type { Location } from "@/types";

export const CAVE_LOCATIONS: Location[] = [
  {
    id: "cave_mouth",
    name: "Cave Mouth",
    region: "forest",
    shortDescription: "A dark opening in the hillside, cool air drifting out.",
    longDescription:
      "The cave entrance is wide enough for three people abreast. The air that " +
      "drifts out smells of wet stone and something faintly metallic. Someone has " +
      "left a torch bracket bolted beside the opening — long empty.",
    exits: [
      { direction: "west", to: "forest_clearing" },
      { direction: "in", to: "cave_tunnel" },
    ],
    tags: ["cave", "threshold"],
    mapPosition: { x: 1, y: -3, z: 0 },
  },
  {
    id: "cave_tunnel",
    name: "Cave Tunnel",
    region: "mine",
    shortDescription: "A rough tunnel, water dripping somewhere ahead.",
    longDescription:
      "The walls are damp limestone, scored with old pick-marks — this tunnel was " +
      "dug by hand, once. Your footsteps echo further than they should.",
    exits: [
      { direction: "out", to: "cave_mouth" },
      { direction: "east", to: "underground_lake" },
      { direction: "down", to: "dungeon_entrance" },
      { direction: "south", to: "mine_shaft" },
    ],
    monsterIds: ["cave_spider"],
    isDark: true,
    tags: ["cave", "underground"],
    mapPosition: { x: 2, y: -3, z: -1 },
  },
  {
    id: "underground_lake",
    name: "Underground Lake",
    region: "mine",
    shortDescription: "Still black water stretches into the dark.",
    longDescription:
      "The cavern opens into a vast chamber. A lake fills most of it, so still it " +
      "looks solid until a drip breaks the surface somewhere out of sight. Faint " +
      "phosphorescent fungus clings to the far wall, just enough to see by. An old " +
      "wooden ladder is bolted to the rock nearby, leading up into a crack in the " +
      "ceiling.",
    exits: [
      { direction: "west", to: "cave_tunnel" },
      {
        direction: "up",
        to: "lake_ledge",
        hidden: true,
        description: "A narrow ledge, reachable by the old ladder.",
      },
    ],
    itemIds: ["silver_ring"],
    features: [
      {
        id: "glowing_fungus",
        name: "fungus",
        description: "Pale blue-green fungus, faintly luminous.",
        interactions: {
          listen: { text: "Water drips somewhere far across the lake. Nothing else moves." },
        },
      },
      {
        id: "old_ladder",
        name: "ladder",
        synonyms: ["wooden ladder", "old ladder"],
        description: "Weathered but solid, bolted into the rock face.",
        interactions: {
          climb: {
            text: "You climb the old ladder up through the crack in the ceiling, onto a narrow ledge.",
            revealsExit: "up",
            setsFlag: "climbed_lake_ladder",
          },
        },
      },
    ],
    monsterIds: ["giant_spider"],
    isDark: true,
    tags: ["cave", "underground", "water"],
    mapPosition: { x: 3, y: -3, z: -1 },
  },
  {
    id: "lake_ledge",
    name: "Lake Ledge",
    region: "mine",
    shortDescription: "A narrow shelf of rock above the underground lake.",
    longDescription:
      "The ledge is barely wide enough to stand on. From up here you can see the " +
      "full span of the lake below, and a second passage leading further into the " +
      "rock, away from the water.",
    exits: [
      { direction: "down", to: "underground_lake" },
      { direction: "east", to: "ossuary", oneWay: true },
    ],
    isDark: true,
    tags: ["cave", "underground", "shortcut"],
    mapPosition: { x: 3, y: -4, z: -1 },
  },
  {
    id: "mine_shaft",
    name: "Old Mine Shaft",
    region: "mine",
    shortDescription: "Timber supports, half-rotted, hold the ceiling up. Barely.",
    longDescription:
      "This was worked by hand before the cave system was ever mapped. Wooden " +
      "supports creak overhead, some cracked clean through. Whoever mined this " +
      "either finished the job or didn't get the chance to.",
    exits: [
      { direction: "north", to: "cave_tunnel" },
      { direction: "south", to: "crystal_vein" },
      { direction: "east", to: "collapsed_shaft" },
    ],
    monsterIds: ["cave_spider"],
    isDark: true,
    tags: ["mine", "underground"],
    mapPosition: { x: 2, y: -4, z: -1 },
  },
  {
    id: "crystal_vein",
    name: "Crystal Vein",
    region: "mine",
    shortDescription: "Raw ore glitters along an exposed rock face.",
    longDescription:
      "Whoever dug this mine stopped right at the richest part of the vein — " +
      "either they ran out of time, or something made them leave in a hurry. " +
      "The ore here is worth more than everything else in the mine combined.",
    exits: [
      { direction: "north", to: "mine_shaft" },
      { direction: "south", to: "flooded_gallery" },
    ],
    itemIds: ["iron_ore", "iron_ore", "gold_coin_pile"],
    isSafe: true,
    tags: ["mine", "underground", "treasure"],
    mapPosition: { x: 2, y: -5, z: -1 },
  },
  {
    id: "flooded_gallery",
    name: "Flooded Gallery",
    region: "mine",
    shortDescription: "The lowest reach of the mine, half-submerged.",
    longDescription:
      "Groundwater claimed this level long ago. Old support beams rise out of the " +
      "water like the ribs of something that didn't survive. Whatever the miners " +
      "were digging toward, they never got there.",
    exits: [{ direction: "north", to: "crystal_vein" }],
    itemIds: ["rusty_dagger"],
    monsterIds: ["gelatinous_cube"],
    isDark: true,
    tags: ["mine", "underground", "water"],
    mapPosition: { x: 2, y: -6, z: -1 },
  },
  {
    id: "collapsed_shaft",
    name: "Collapsed Shaft",
    region: "mine",
    shortDescription: "The tunnel ends in a wall of rubble — mostly.",
    longDescription:
      "A cave-in blocks most of the passage, but a gap near the ceiling still lets " +
      "air through from somewhere else entirely. Something is nesting in the gap.",
    exits: [{ direction: "west", to: "mine_shaft" }],
    itemIds: ["rusty_key"],
    monsterIds: ["cave_spider"],
    isDark: true,
    tags: ["mine", "underground"],
    mapPosition: { x: 3, y: -5, z: -1 },
  },
];
