import type { Location } from "@/types";

export const VILLAGE_LOCATIONS: Location[] = [
  {
    id: "village_square",
    name: "Village Square",
    region: "village",
    shortDescription: "The heart of Millbrook, quiet at this hour.",
    longDescription:
      "A cracked cobblestone square, ringed by crooked timber houses. A well sits at " +
      "its center, and somewhere a shutter bangs against its frame in the wind. This " +
      "is the only place in the world that has ever felt entirely safe. A blank " +
      "sheet of old paper has blown up against the well and caught there. Near the " +
      "well, someone long ago bolted an old glass-fronted trophy case to the " +
      "cobblestones — empty, for now.",
    exits: [
      { direction: "north", to: "old_well" },
      { direction: "east", to: "blacksmith" },
      { direction: "west", to: "tavern" },
      { direction: "south", to: "village_gate" },
    ],
    itemIds: ["old_paper"],
    npcIds: ["elder_maren"],
    features: [
      {
        id: "trophy_case",
        name: "trophy case",
        synonyms: ["case"],
        description:
          "A sturdy glass-fronted case, bolted down. It seems built to hold " +
          "something worth showing off. (try: put <item> in case)",
      },
    ],
    ambientSounds: ["distant chatter", "a dog barking", "wind"],
    isSafe: true,
    tags: ["village", "start"],
    mapPosition: { x: 0, y: 0, z: 0 },
  },
  {
    id: "old_well",
    name: "Old Well",
    region: "village",
    shortDescription: "A stone well, its rope frayed and dark with age.",
    longDescription:
      "The well is older than the village around it, some say older than the forest. " +
      "The stones are worn smooth by hands that no longer exist. Cold air rises from " +
      "the shaft below.",
    exits: [
      { direction: "south", to: "village_square" },
      { direction: "north", to: "chapel" },
      {
        direction: "down",
        to: "well_shaft",
        hidden: true,
        description: "A narrow shaft, barely wide enough for a person.",
      },
    ],
    features: [
      {
        id: "well_rope",
        name: "rope",
        description: "An old rope, knotted every few feet, disappearing into the dark.",
        searchable: true,
        searchResult: {
          text: "You find the rope is sturdy enough to climb down.",
          revealsExit: "down",
        },
      },
    ],
    isSafe: true,
    tags: ["village", "water"],
    mapPosition: { x: 0, y: 1, z: 0 },
  },
  {
    id: "blacksmith",
    name: "Blacksmith's Forge",
    region: "village",
    shortDescription: "Heat and hammer-song spill from the open forge.",
    longDescription:
      "The forge glows orange even in daylight. Racks of half-finished blades line " +
      "the walls, and the smith — a woman built like the anvils she works — barely " +
      "looks up when you enter.",
    exits: [
      { direction: "west", to: "village_square" },
      { direction: "east", to: "market_stalls" },
    ],
    npcIds: ["smith_orla"],
    isSafe: true,
    tags: ["village", "shop"],
    mapPosition: { x: 1, y: 0, z: 0 },
  },
  {
    id: "tavern",
    name: "The Broken Wheel Tavern",
    region: "village",
    shortDescription: "Low light, low talk, and the smell of old ale.",
    longDescription:
      "A dozen mismatched tables, most empty. A fire snaps in the hearth. The kind " +
      "of place where travelers trade rumors for a warm meal, if you know how to ask. " +
      "A stub of pencil sits forgotten on Old Tomas's table, next to his empty cup.",
    exits: [
      { direction: "east", to: "village_square" },
      { direction: "west", to: "stables" },
    ],
    itemIds: ["rusty_pencil"],
    npcIds: ["old_tomas"],
    isSafe: true,
    tags: ["village", "rumor"],
    mapPosition: { x: -1, y: 0, z: 0 },
  },
  {
    id: "village_gate",
    name: "Village Gate",
    region: "village",
    shortDescription: "A weathered timber gate marks the edge of safety.",
    longDescription:
      "Beyond the gate, the road gives way to a dirt track, and the dirt track gives " +
      "way to the forest. A hand-painted sign reads: TRAVEL PAST THIS POINT AT YOUR " +
      "OWN RISK. Someone has carved a tally of names beneath it. It is a long tally.",
    exits: [
      { direction: "north", to: "village_square" },
      { direction: "south", to: "forest_path" },
      { direction: "up", to: "watchtower" },
    ],
    isSafe: true,
    tags: ["village", "threshold"],
    mapPosition: { x: 0, y: -1, z: 0 },
  },
  {
    id: "well_shaft",
    name: "Well Shaft",
    region: "village",
    shortDescription: "A tight stone shaft, dripping and dark.",
    longDescription:
      "Rings of mortared stone spiral down past the reach of any lantern from above. " +
      "The rope creaks under your weight. Something down here is older than the well.",
    exits: [
      { direction: "up", to: "old_well" },
      { direction: "down", to: "sewers_entrance" },
    ],
    isDark: true,
    tags: ["underground", "water"],
    mapPosition: { x: 0, y: 1, z: -1 },
  },
  {
    id: "chapel",
    name: "Millbrook Chapel",
    region: "village",
    shortDescription: "A small stone chapel, older than the houses around it.",
    longDescription:
      "Barely large enough for ten people to kneel at once. Candle stubs line the " +
      "windowsills, most of them burned to nothing. The priest left years ago; " +
      "villagers still come to light candles for the ones who went south and never " +
      "came back.",
    exits: [{ direction: "south", to: "old_well" }],
    features: [
      {
        id: "candle_stubs",
        name: "candles",
        description: "Dozens of burned-down candle stubs, some still faintly warm.",
        interactions: {
          pray: {
            text: "You light a candle and say nothing in particular. It helps anyway.",
            setsFlag: "prayed_at_chapel",
          },
        },
      },
    ],
    isSafe: true,
    tags: ["village"],
    mapPosition: { x: 0, y: 2, z: 0 },
  },
  {
    id: "market_stalls",
    name: "Market Stalls",
    region: "village",
    shortDescription: "A handful of stalls, half of them shuttered.",
    longDescription:
      "Dried herbs, root vegetables, and a rack of secondhand traveling gear make up " +
      "what's left of Millbrook's market. An old woman sells rope and rations from a " +
      "cart with a missing wheel.",
    exits: [
      { direction: "west", to: "blacksmith" },
      { direction: "east", to: "millers_house" },
    ],
    npcIds: ["market_agnes"],
    isSafe: true,
    tags: ["village", "shop"],
    mapPosition: { x: 2, y: 0, z: 0 },
  },
  {
    id: "millers_house",
    name: "Miller's House",
    region: "village",
    shortDescription: "A squat house beside a silent mill wheel.",
    longDescription:
      "The mill wheel hasn't turned in years — the stream that fed it dried up or " +
      "was diverted, no one quite remembers which. The miller still lives here, " +
      "mostly out of stubbornness.",
    exits: [{ direction: "west", to: "market_stalls" }],
    itemIds: ["ration", "ration"],
    isSafe: true,
    tags: ["village"],
    mapPosition: { x: 3, y: 0, z: 0 },
  },
  {
    id: "stables",
    name: "Stables",
    region: "village",
    shortDescription: "The smell of hay and horse, and not much else.",
    longDescription:
      "Three stalls, two of them empty. The one occupied horse watches you with the " +
      "weary patience of an animal that has seen a lot of travelers leave and not " +
      "all of them come back.",
    exits: [
      { direction: "east", to: "tavern" },
      { direction: "south", to: "graveyard" },
    ],
    isSafe: true,
    tags: ["village"],
    mapPosition: { x: -2, y: 0, z: 0 },
  },
  {
    id: "graveyard",
    name: "Millbrook Graveyard",
    region: "village",
    shortDescription: "Leaning headstones under old yew trees.",
    longDescription:
      "Most of the stones are worn past reading. One, near the back wall, has been " +
      "recently disturbed — the earth beside it has caved in, revealing a narrow " +
      "passage down into the dark that smells of stone, not soil.",
    exits: [
      { direction: "north", to: "stables" },
      {
        direction: "down",
        to: "catacombs_entrance",
        hidden: true,
        description: "A narrow gap where the ground has given way.",
      },
    ],
    features: [
      {
        id: "disturbed_grave",
        name: "disturbed grave",
        synonyms: ["grave", "caved-in grave"],
        description: "The ground here has collapsed into a passage leading down.",
        searchable: true,
        searchResult: {
          text: "You clear away loose earth and find the passage is wide enough to descend.",
          revealsExit: "down",
        },
      },
    ],
    isSafe: true,
    tags: ["village", "eerie"],
    mapPosition: { x: -2, y: -1, z: 0 },
  },
  {
    id: "watchtower",
    name: "Village Watchtower",
    region: "village",
    shortDescription: "A crumbling wooden watchtower beside the gate.",
    longDescription:
      "From up here you can see the forest stretching south until it disappears into " +
      "haze, and — if you look carefully — the broken silhouette of towers even " +
      "further out, past where any map you've seen agrees to go.",
    exits: [{ direction: "down", to: "village_gate" }],
    itemIds: ["mana_draught"],
    isSafe: true,
    tags: ["village", "vantage"],
    mapPosition: { x: 1, y: -1, z: 0 },
  },
];
