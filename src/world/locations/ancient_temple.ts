import type { Location } from "@/types";

export const ANCIENT_TEMPLE_LOCATIONS: Location[] = [
  {
    id: "temple_antechamber",
    name: "Temple Antechamber",
    region: "ancient_temple",
    shortDescription: "A cold, narrow room before a much larger door.",
    longDescription:
      "The air changes here — colder, stiller, like the temple beyond is holding " +
      "its breath. Faded murals cover the walls: a king, a crown, a court kneeling, " +
      "and then, in the last panel, nothing but a spiral of ash.",
    exits: [
      { direction: "up", to: "archive_hall" },
      { direction: "south", to: "guardian_hall" },
      { direction: "east", to: "meditation_cloister" },
    ],
    isDark: true,
    tags: ["ancient_temple", "underground"],
    mapPosition: { x: 0, y: 0, z: -5 },
  },
  {
    id: "meditation_cloister",
    name: "Meditation Cloister",
    region: "ancient_temple",
    shortDescription: "A small circular room, open to a shaft of unexplained light.",
    longDescription:
      "A narrow shaft somewhere above lets a single column of real daylight reach " +
      "down into this room, impossibly far underground. Whoever built this wanted " +
      "one place in the temple that didn't feel buried.",
    exits: [{ direction: "west", to: "temple_antechamber" }],
    itemIds: ["minor_healing_potion", "mana_draught"],
    isSafe: true,
    tags: ["ancient_temple", "underground", "landmark"],
    mapPosition: { x: 1, y: 0, z: -5 },
  },
  {
    id: "guardian_hall",
    name: "Guardian Hall",
    region: "ancient_temple",
    shortDescription: "Statues line the hall, all facing the same direction.",
    longDescription:
      "Stone figures stand at intervals, armed and armored, all facing the passage " +
      "south. Most are just statues. You will only find out which one isn't when " +
      "it's already moving.",
    exits: [
      { direction: "north", to: "temple_antechamber" },
      { direction: "south", to: "inner_sanctum" },
    ],
    monsterIds: ["dark_elf_blade"],
    isDark: true,
    tags: ["ancient_temple", "underground", "boss"],
    mapPosition: { x: 0, y: -1, z: -5 },
  },
  {
    id: "inner_sanctum",
    name: "Inner Sanctum",
    region: "ancient_temple",
    shortDescription: "A domed chamber, carved with a thousand small figures.",
    longDescription:
      "Every inch of the dome above is carved with tiny kneeling figures, all " +
      "facing inward, toward whatever used to stand at the center of this room. " +
      "Whatever used to stand there is gone. Something else is here instead.",
    exits: [
      { direction: "north", to: "guardian_hall" },
      { direction: "east", to: "temple_treasury" },
      { direction: "south", to: "altar_room" },
    ],
    monsterIds: ["lesser_demon"],
    isDark: true,
    tags: ["ancient_temple", "underground"],
    mapPosition: { x: 0, y: -2, z: -5 },
  },
  {
    id: "temple_treasury",
    name: "Temple Treasury",
    region: "ancient_temple",
    shortDescription: "Gold that was never meant to be spent.",
    longDescription:
      "Grave goods, mostly — the kind of wealth a kingdom buries with its dead " +
      "rather than lets its living spend. A single blade rests on a stand of its " +
      "own, wreathed in flame that never seems to spread or die.",
    exits: [{ direction: "west", to: "inner_sanctum" }],
    itemIds: ["flametongue", "gold_coin_pile"],
    isSafe: true,
    tags: ["ancient_temple", "underground", "treasure"],
    mapPosition: { x: 1, y: -2, z: -5 },
  },
  {
    id: "altar_room",
    name: "Altar of the Unbound King",
    region: "ancient_temple",
    shortDescription: "The last room in the temple. It is not empty.",
    longDescription:
      "A crown sits on a black stone altar, exactly where it must have sat for " +
      "centuries — except the thing standing over it now is the king it belonged " +
      "to, and he has had a very long time to get angry about being forgotten.",
    exits: [{ direction: "north", to: "inner_sanctum" }],
    itemIds: ["sunken_crown"],
    monsterIds: ["ancient_lich_king"],
    isDark: true,
    tags: ["ancient_temple", "underground", "boss", "landmark"],
    mapPosition: { x: 0, y: -3, z: -5 },
  },
];
