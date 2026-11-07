import type { Location } from "@/types";

export const VOLCANO_LOCATIONS: Location[] = [
  {
    id: "volcano_entrance",
    name: "Ashen Threshold",
    region: "volcano",
    shortDescription: "Heat hits you before the light does.",
    longDescription:
      "The waystone's chill gives way immediately to dry heat. Ash falls like slow " +
      "snow. Somewhere below, rock is moving in a way rock shouldn't.",
    exits: [
      { direction: "north", to: "hall_of_waystones" },
      { direction: "south", to: "lava_tube" },
    ],
    tags: ["volcano", "frontier"],
    mapPosition: { x: 0, y: 0, z: -11 },
  },
  {
    id: "lava_tube",
    name: "Lava Tube",
    region: "volcano",
    shortDescription: "A tunnel of black glass, still warm to the touch.",
    longDescription:
      "The tube's walls are smooth, glassy rock, cooled from something that once " +
      "flowed here fast enough to carve a tunnel through solid stone. Heat radiates " +
      "from somewhere ahead.",
    exits: [
      { direction: "north", to: "volcano_entrance" },
      { direction: "east", to: "obsidian_chamber" },
      { direction: "south", to: "dragons_lair" },
      { direction: "west", to: "ember_vents" },
    ],
    monsterIds: ["magma_hound"],
    isDark: true,
    tags: ["volcano", "frontier"],
    mapPosition: { x: 0, y: 1, z: -11 },
  },
  {
    id: "ember_vents",
    name: "Ember Vents",
    region: "volcano",
    shortDescription: "Fissures in the rock breathe heat in slow, rhythmic bursts.",
    longDescription:
      "The rock itself seems to breathe here, each fissure exhaling a wave of heat " +
      "on some cycle you can't quite predict. Standing too close for too long " +
      "would be a bad idea.",
    exits: [{ direction: "east", to: "lava_tube" }],
    itemIds: ["scroll_of_fireball"],
    monsterIds: ["magma_hound"],
    isDark: true,
    tags: ["volcano", "frontier"],
    mapPosition: { x: -1, y: 1, z: -11 },
  },
  {
    id: "obsidian_chamber",
    name: "Obsidian Chamber",
    region: "volcano",
    shortDescription: "Walls of black glass, polished by heat alone.",
    longDescription:
      "The whole chamber is obsidian, formed and reformed by heat until it's " +
      "mirror-smooth. Your reflection looks tired in a dozen different warped ways.",
    exits: [{ direction: "west", to: "lava_tube" }],
    itemIds: ["rune_of_warding", "gold_coin_pile"],
    isSafe: true,
    tags: ["volcano", "frontier", "landmark"],
    mapPosition: { x: 1, y: 1, z: -11 },
  },
  {
    id: "dragons_lair",
    name: "Dragon's Lair",
    region: "volcano",
    shortDescription: "A cavern of gold, bone, and heat.",
    longDescription:
      "The heat here is close to unbearable. A hoard fills half the cavern — coin, " +
      "bone, and armor melted into strange new shapes — and something large shifts " +
      "on top of it, disturbed by your torchlight.",
    exits: [{ direction: "north", to: "lava_tube" }],
    itemIds: ["gold_coin_pile"],
    monsterIds: ["young_red_dragon"],
    isDark: true,
    tags: ["volcano", "frontier", "boss", "landmark"],
    mapPosition: { x: 0, y: 2, z: -11 },
  },
];
