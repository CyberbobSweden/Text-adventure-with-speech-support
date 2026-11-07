import type { Location } from "@/types";

export const FOREST_LOCATIONS: Location[] = [
  {
    id: "forest_path",
    name: "Forest Path",
    region: "forest",
    shortDescription: "A narrow trail winds between old pines.",
    longDescription:
      "Sunlight breaks through the canopy in thin, moving shafts. The path is well " +
      "worn near the village, less so the farther you look. Birdsong thins out to " +
      "the south.",
    exits: [
      { direction: "north", to: "village_gate" },
      { direction: "south", to: "forest_clearing" },
      { direction: "east", to: "hunters_camp" },
      { direction: "west", to: "river_crossing" },
    ],
    ambientSounds: ["birdsong", "rustling leaves", "creaking branches"],
    tags: ["forest", "surface"],
    mapPosition: { x: 0, y: -2, z: 0 },
  },
  {
    id: "hunters_camp",
    name: "Hunter's Camp",
    region: "forest",
    shortDescription: "A cold fire pit and a lean-to, long abandoned.",
    longDescription:
      "Whoever camped here left in a hurry. A rusted skinning knife lies half-buried " +
      "in the dirt, and the lean-to has partially collapsed under a season of rain.",
    exits: [{ direction: "west", to: "forest_path" }],
    itemIds: ["rusty_dagger", "ration"],
    features: [
      {
        id: "cold_firepit",
        name: "fire pit",
        description: "Ash and charred wood, cold for a long time now.",
        searchable: true,
        searchResult: { text: "Buried in the ash, your fingers find a few coins.", itemIds: ["gold_coin_pile"] },
      },
    ],
    tags: ["forest", "surface"],
    mapPosition: { x: 1, y: -2, z: 0 },
  },
  {
    id: "forest_clearing",
    name: "Forest Clearing",
    region: "forest",
    shortDescription: "A wide clearing under an open sky.",
    longDescription:
      "Wildflowers push up through old, flattened grass. At the clearing's far edge, " +
      "the trees grow closer together and noticeably darker, as if the forest itself " +
      "changes its mind here.",
    exits: [
      { direction: "north", to: "forest_path" },
      { direction: "south", to: "dark_forest_edge" },
      { direction: "east", to: "cave_mouth" },
      { direction: "west", to: "ancient_grove" },
    ],
    monsterIds: ["goblin_scout"],
    tags: ["forest", "surface"],
    mapPosition: { x: 0, y: -3, z: 0 },
  },
  {
    id: "dark_forest_edge",
    name: "Dark Forest Edge",
    region: "dark_forest",
    shortDescription: "The trees close overhead. The light drops away.",
    longDescription:
      "It is not yet night, but you would not know it here. The trees grow tangled " +
      "and close, roots knotting across the path like something trying to keep you " +
      "out — or keep something else in.",
    exits: [
      { direction: "north", to: "forest_clearing" },
      { direction: "south", to: "ruined_shrine", hidden: true },
      { direction: "west", to: "twisted_hollow" },
    ],
    features: [
      {
        id: "carved_root",
        name: "carved root",
        description: "A root has been carved with a spiral, deliberately, long ago.",
        onInspect:
          "The spiral matches nothing you've seen — except, faintly, the shape burned into your torch handle.",
        searchable: true,
        searchResult: {
          text: "Following the spiral's direction, you spot a path you missed before.",
          revealsExit: "south",
        },
      },
    ],
    ambientSounds: ["silence", "a distant crack of wood", "something breathing"],
    monsterIds: ["cave_spider"],
    isDark: true,
    tags: ["forest", "surface", "eerie"],
    mapPosition: { x: 0, y: -4, z: 0 },
  },
  {
    id: "river_crossing",
    name: "River Crossing",
    region: "forest",
    shortDescription: "A shallow river, crossed by a rope bridge.",
    longDescription:
      "The river isn't deep, but it moves fast. A rope bridge, patched more than " +
      "once, is the only dry way across. Somebody keeps it maintained — which means " +
      "somebody uses it.",
    exits: [
      { direction: "east", to: "forest_path" },
      { direction: "south", to: "bandit_camp" },
      { direction: "west", to: "old_bridge" },
    ],
    ambientSounds: ["rushing water", "creaking rope"],
    tags: ["forest", "surface", "water"],
    mapPosition: { x: -1, y: -2, z: 0 },
  },
  {
    id: "old_bridge",
    name: "Old Stone Bridge",
    region: "forest",
    shortDescription: "A much older, sturdier bridge, further upstream.",
    longDescription:
      "Unlike the rope bridge downstream, this one is carved stone, arched and " +
      "solid despite its age. Whoever built it built to last — which raises the " +
      "question of who, and why, out here.",
    exits: [{ direction: "east", to: "river_crossing" }],
    itemIds: ["silver_ring"],
    isSafe: true,
    tags: ["forest", "surface", "landmark"],
    mapPosition: { x: -2, y: -2, z: 0 },
  },
  {
    id: "bandit_camp",
    name: "Bandit Camp",
    region: "forest",
    shortDescription: "Tents around a firepit, and a lookout who spotted you first.",
    longDescription:
      "Whoever camps here didn't expect company from this direction. Crates of " +
      "stolen goods are stacked haphazardly around a well-tended fire. The lookout " +
      "is already reaching for a weapon.",
    exits: [{ direction: "north", to: "river_crossing" }],
    itemIds: ["chainmail", "gold_coin_pile"],
    monsterIds: ["goblin_warband_leader"],
    tags: ["forest", "surface"],
    mapPosition: { x: -1, y: -3, z: 0 },
  },
  {
    id: "ancient_grove",
    name: "Ancient Grove",
    region: "forest",
    shortDescription: "One tree, far older than everything around it.",
    longDescription:
      "The other trees give this one space, as if by agreement. Its trunk is wide " +
      "enough that six people couldn't circle it hand in hand. Carved into the bark, " +
      "at head height, are names — dozens of them, going back further than the " +
      "village's tally at the gate.",
    exits: [{ direction: "east", to: "forest_clearing" }],
    features: [
      {
        id: "carved_names",
        name: "names",
        synonyms: ["carved names", "bark"],
        description: "Names carved into the bark, some fresh, some worn nearly smooth.",
        onInspect:
          "Most names are strangers'. One, near the bottom, is carved deeper than " +
          "the rest, like whoever wrote it wanted to make sure it would last: " +
          "'Maren, who came back.'",
      },
    ],
    itemIds: ["minor_healing_potion"],
    isSafe: true,
    tags: ["forest", "surface", "landmark"],
    mapPosition: { x: -1, y: -3, z: 1 },
  },
  {
    id: "twisted_hollow",
    name: "Twisted Hollow",
    region: "dark_forest",
    shortDescription: "Trees grown into knots too deliberate to be natural.",
    longDescription:
      "The trees here don't grow so much as writhe, trunks knotted into shapes that " +
      "look almost like gestures. Something about the hollow makes you very aware " +
      "of how far you are from anywhere safe.",
    exits: [
      { direction: "east", to: "dark_forest_edge" },
      { direction: "south", to: "witchlight_bog" },
    ],
    monsterIds: ["dark_elf_blade"],
    isDark: true,
    tags: ["dark_forest", "surface", "eerie"],
    mapPosition: { x: -1, y: -4, z: 0 },
  },
  {
    id: "witchlight_bog",
    name: "Witchlight Bog",
    region: "dark_forest",
    shortDescription: "Pale lights hover over black, still water.",
    longDescription:
      "Small lights drift over the bog's surface, always just far enough away to " +
      "not quite be explainable. Old stories call them witchlights and say " +
      "following them never ends well. You believe the stories more, out here.",
    exits: [
      { direction: "north", to: "twisted_hollow" },
      { direction: "south", to: "hollow_altar" },
    ],
    monsterIds: ["cave_spider"],
    isDark: true,
    tags: ["dark_forest", "surface", "eerie", "water"],
    mapPosition: { x: -1, y: -5, z: 0 },
  },
  {
    id: "hollow_altar",
    name: "Hollow Altar",
    region: "dark_forest",
    shortDescription: "A second altar, older and less welcoming than the shrine.",
    longDescription:
      "Unlike the shrine to the east, nothing about this altar invites prayer. It's " +
      "carved with the same spiral as the root you found, repeated obsessively, " +
      "as if whoever made it was trying to convince themselves of something.",
    exits: [{ direction: "north", to: "witchlight_bog" }],
    itemIds: ["rune_of_warding"],
    tags: ["dark_forest", "surface", "eerie", "landmark"],
    mapPosition: { x: -1, y: -6, z: 0 },
  },
];

