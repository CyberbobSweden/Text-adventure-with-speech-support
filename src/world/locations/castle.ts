import type { Location } from "@/types";

export const CASTLE_LOCATIONS: Location[] = [
  {
    id: "castle_gatehouse",
    name: "Castle Gatehouse",
    region: "castle",
    shortDescription: "A portcullis, rusted open and stuck that way.",
    longDescription:
      "The gatehouse portcullis hangs half-raised, rusted solid decades ago. " +
      "Whoever last closed this gate didn't manage to finish the job. Beyond it, " +
      "a courtyard has gone entirely to weeds.",
    exits: [
      { direction: "north", to: "collapsed_keep" },
      { direction: "south", to: "castle_courtyard" },
    ],
    tags: ["castle", "surface"],
    mapPosition: { x: 0, y: -8, z: 0 },
  },
  {
    id: "castle_courtyard",
    name: "Castle Courtyard",
    region: "castle",
    shortDescription: "Weeds and rubble where a courtyard used to be.",
    longDescription:
      "Grass has cracked the flagstones apart, and small trees have taken root in " +
      "what must have once been flowerbeds. The castle rises around you on three " +
      "sides, quiet in a way that doesn't feel entirely empty.",
    exits: [
      { direction: "north", to: "castle_gatehouse" },
      { direction: "east", to: "armory_tower" },
      { direction: "west", to: "castle_chapel" },
      { direction: "south", to: "great_hall" },
    ],
    monsterIds: ["skeleton_warrior"],
    tags: ["castle", "surface"],
    mapPosition: { x: 0, y: -9, z: 0 },
  },
  {
    id: "armory_tower",
    name: "Armory Tower",
    region: "castle",
    shortDescription: "A round tower, racks of weapons rusted to their hooks.",
    longDescription:
      "Spiral stairs wind up through a tower once used to arm a garrison. Most of " +
      "the weapons have rusted past use, but a few — better made, or better cared " +
      "for — have survived.",
    exits: [
      { direction: "west", to: "castle_courtyard" },
      { direction: "up", to: "battlements" },
    ],
    itemIds: ["oak_longbow", "wooden_shield"],
    tags: ["castle", "surface"],
    mapPosition: { x: 1, y: -9, z: 0 },
  },
  {
    id: "battlements",
    name: "Castle Battlements",
    region: "castle",
    shortDescription: "The wall-walk, open to the sky.",
    longDescription:
      "From up here you can see the whole causeway back to the forest, and, in the " +
      "other direction, the land falling away into country no map you've found " +
      "has named — rolling toward mountains pale enough to be snow-capped, or " +
      "just far away.",
    exits: [{ direction: "down", to: "armory_tower" }],
    itemIds: ["scroll_of_fireball"],
    isSafe: true,
    tags: ["castle", "surface", "vantage"],
    mapPosition: { x: 1, y: -8, z: 0 },
  },
  {
    id: "castle_chapel",
    name: "Royal Chapel",
    region: "castle",
    shortDescription: "A grander, colder cousin of the village chapel.",
    longDescription:
      "Stained glass, mostly shattered, still throws colored light across stone " +
      "pews nobody has sat in for a very long time. An inscription over the altar " +
      "names a royal house you've started to recognize.",
    exits: [{ direction: "east", to: "castle_courtyard" }],
    features: [
      {
        id: "royal_inscription",
        name: "inscription",
        description: "Carved letters naming a royal house.",
        onInspect:
          "The house crest matches the wax seal you may have already found in a " +
          "crypt far from here. This castle and that grave belonged to the same " +
          "family.",
      },
    ],
    isSafe: true,
    tags: ["castle", "surface", "lore"],
    mapPosition: { x: -1, y: -9, z: 0 },
  },
  {
    id: "great_hall",
    name: "Great Hall",
    region: "castle",
    shortDescription: "Long tables, collapsed, under a hole in the roof.",
    longDescription:
      "Rain has gotten into this hall for so long that moss covers half the " +
      "banquet tables. The roof failed at some point and never got fixed. Whoever " +
      "ruled here stopped being able to afford repairs long before they stopped " +
      "being king.",
    exits: [
      { direction: "north", to: "castle_courtyard" },
      { direction: "east", to: "castle_library" },
      { direction: "south", to: "castle_throne_room" },
    ],
    tags: ["castle", "surface"],
    mapPosition: { x: 0, y: -10, z: 0 },
  },
  {
    id: "castle_library",
    name: "Castle Library",
    region: "castle",
    shortDescription: "Shelves, mostly collapsed, books mostly ruined.",
    longDescription:
      "Water damage has claimed most of the collection, but a few volumes survived " +
      "in a sealed case near the back — someone's personal effort to save what " +
      "mattered most, even as everything else was lost.",
    exits: [{ direction: "west", to: "great_hall" }],
    itemIds: ["ancient_tome"],
    isSafe: true,
    tags: ["castle", "surface", "lore"],
    mapPosition: { x: 1, y: -10, z: 0 },
  },
  {
    id: "castle_throne_room",
    name: "Castle Throne Room",
    region: "castle",
    shortDescription: "An empty throne, and a feeling of being watched.",
    longDescription:
      "The throne sits exactly where it should, beneath a banner too faded to " +
      "read. Something low and fast circles the edge of your torchlight, breathing " +
      "in a way that isn't quite animal and isn't quite not.",
    exits: [
      { direction: "north", to: "great_hall" },
      {
        direction: "down",
        to: "castle_dungeon_stair",
        hidden: true,
        description: "A gap behind the throne, easy to miss.",
      },
    ],
    features: [
      {
        id: "throne",
        name: "throne",
        description: "An ornate stone throne, undisturbed by the ruin around it.",
        searchable: true,
        searchResult: {
          text: "Behind the throne, a section of wall has been worn smooth by " +
            "repeated use — a hidden stair down, used far more recently than " +
            "anything else in this room.",
          revealsExit: "down",
        },
      },
    ],
    monsterIds: ["young_werewolf"],
    isDark: true,
    tags: ["castle", "surface", "boss"],
    mapPosition: { x: 0, y: -11, z: 0 },
  },
  {
    id: "castle_dungeon_stair",
    name: "Castle Dungeon Stair",
    region: "castle",
    shortDescription: "A spiral stair, descending far past where the castle should end.",
    longDescription:
      "The stair keeps going long after it should have reached ground level, " +
      "cut stone giving way eventually to something rougher — like this castle " +
      "and the dungeon in the hills were connected on purpose, a long time ago.",
    exits: [
      { direction: "up", to: "castle_throne_room" },
      { direction: "down", to: "guard_room" },
    ],
    isDark: true,
    tags: ["castle", "underground", "shortcut"],
    mapPosition: { x: 0, y: -11, z: -1 },
  },
];
