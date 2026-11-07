import type { Location } from "@/types";

export const RUINS_LOCATIONS: Location[] = [
  {
    id: "ruined_shrine",
    name: "Ruined Shrine",
    region: "ruins",
    shortDescription: "Moss-covered stones, arranged with old intent.",
    longDescription:
      "Four standing stones lean toward a fifth, fallen one at the center. Faded " +
      "carvings suggest a god no one living remembers the name of. The air here is " +
      "very still.",
    exits: [
      { direction: "north", to: "dark_forest_edge" },
      { direction: "south", to: "old_causeway" },
    ],
    features: [
      {
        id: "fallen_stone",
        name: "fallen stone",
        synonyms: ["altar", "stone"],
        description: "A cracked stone slab, half-sunk into the earth.",
        interactions: {
          pray: {
            text:
              "You kneel and speak a prayer to a god with no name. For a moment, " +
              "you feel steadier than you have in days.",
            setsFlag: "prayed_at_shrine",
          },
        },
      },
    ],
    itemIds: ["ancient_tome"],
    isSafe: true,
    tags: ["ruins", "surface"],
    mapPosition: { x: 0, y: -5, z: 0 },
  },
  {
    id: "old_causeway",
    name: "Old Causeway",
    region: "ruins",
    shortDescription: "A raised stone road, most of it swallowed by moss.",
    longDescription:
      "The causeway was built wide enough for wagons, once. Now grass grows through " +
      "every seam. It leads, unmistakably, toward the broken silhouette you saw " +
      "from the village watchtower.",
    exits: [
      { direction: "north", to: "ruined_shrine" },
      { direction: "south", to: "collapsed_keep" },
      { direction: "east", to: "broken_aqueduct" },
    ],
    monsterIds: ["young_werewolf"],
    tags: ["ruins", "surface"],
    mapPosition: { x: 0, y: -6, z: 0 },
  },
  {
    id: "broken_aqueduct",
    name: "Broken Aqueduct",
    region: "ruins",
    shortDescription: "A stone aqueduct, snapped clean in half.",
    longDescription:
      "The aqueduct once carried water for miles — you can trace its path across " +
      "the hills from up here, arch after arch, until it simply stops, sheared off " +
      "mid-span by something that wasn't erosion.",
    exits: [{ direction: "west", to: "old_causeway" }],
    itemIds: ["gold_coin_pile"],
    isSafe: true,
    tags: ["ruins", "surface", "landmark"],
    mapPosition: { x: 1, y: -6, z: 0 },
  },
  {
    id: "collapsed_keep",
    name: "Collapsed Outer Keep",
    region: "ruins",
    shortDescription: "The castle's first wall, and the first thing to fall.",
    longDescription:
      "Half the outer keep has slumped into rubble, but enough remains standing " +
      "to show what it once was: the first line of defense for something much " +
      "larger, still mostly intact, further in.",
    exits: [
      { direction: "north", to: "old_causeway" },
      { direction: "south", to: "castle_gatehouse" },
    ],
    monsterIds: ["goblin_warband_leader"],
    tags: ["ruins", "surface"],
    mapPosition: { x: 0, y: -7, z: 0 },
  },
];
