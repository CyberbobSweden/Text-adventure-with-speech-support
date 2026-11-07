import type { Location } from "@/types";

export const SEWER_LOCATIONS: Location[] = [
  {
    id: "sewers_entrance",
    name: "Sewer Entrance",
    region: "sewers",
    shortDescription: "Brick tunnels, ankle-deep in slow water.",
    longDescription:
      "Somewhere below the village, old brickwork gives way to older brickwork. " +
      "The water moving past your boots came from somewhere; where it's going is " +
      "less clear.",
    exits: [
      { direction: "up", to: "well_shaft" },
      { direction: "south", to: "sewer_junction" },
    ],
    monsterIds: ["gelatinous_cube"],
    isDark: true,
    tags: ["sewers", "underground"],
    mapPosition: { x: 0, y: 1, z: -2 },
  },
  {
    id: "sewer_junction",
    name: "Sewer Junction",
    region: "sewers",
    shortDescription: "Three tunnels meet under a crumbling brick arch.",
    longDescription:
      "Water drips from a dozen cracks overhead. Someone scratched an arrow into " +
      "the brick pointing south, a long time ago, and someone else scratched it " +
      "out just as long ago.",
    exits: [
      { direction: "north", to: "sewers_entrance" },
      { direction: "east", to: "rat_nest" },
      { direction: "south", to: "underground_city_gate" },
    ],
    isDark: true,
    tags: ["sewers", "underground"],
    mapPosition: { x: 0, y: 0, z: -2 },
  },
  {
    id: "rat_nest",
    name: "Flooded Nest",
    region: "sewers",
    shortDescription: "A side-chamber, ankle-deep and reeking.",
    longDescription:
      "Refuse and nesting material are piled high against one wall. Something in " +
      "the pile is still moving, in the way that means you should probably back " +
      "out slowly, or finish it quickly.",
    exits: [
      { direction: "west", to: "sewer_junction" },
      { direction: "south", to: "sunken_cistern" },
    ],
    monsterIds: ["giant_spider"],
    itemIds: ["iron_ore"],
    isDark: true,
    tags: ["sewers", "underground"],
    mapPosition: { x: 1, y: 0, z: -2 },
  },
  {
    id: "sunken_cistern",
    name: "Sunken Cistern",
    region: "sewers",
    shortDescription: "A vast underground reservoir, still half full.",
    longDescription:
      "The cistern once supplied water to more people than the village above has " +
      "ever held. Stone columns rise from black water to support a ceiling lost in " +
      "the dark. Something displaces the water, slowly, on the far side.",
    exits: [{ direction: "north", to: "rat_nest" }],
    itemIds: ["minor_healing_potion"],
    monsterIds: ["gelatinous_cube"],
    isDark: true,
    tags: ["sewers", "underground", "water"],
    mapPosition: { x: 1, y: -1, z: -2 },
  },
];
