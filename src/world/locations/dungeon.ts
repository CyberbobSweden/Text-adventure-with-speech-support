import type { Location } from "@/types";

export const DUNGEON_LOCATIONS: Location[] = [
  {
    id: "dungeon_entrance",
    name: "Dungeon Entrance",
    region: "dungeon",
    shortDescription: "A collapsed stair leads down into worked stone.",
    longDescription:
      "Where the cave's natural rock gives way to cut stone, a broken stair spirals " +
      "downward. Someone built this. Someone else, later, tried very hard to seal it.",
    exits: [
      { direction: "up", to: "cave_tunnel" },
      { direction: "down", to: "crypt_corridor" },
      { direction: "east", to: "guard_room" },
    ],
    isDark: true,
    tags: ["dungeon", "underground"],
    mapPosition: { x: 2, y: -3, z: -2 },
  },
  {
    id: "guard_room",
    name: "Guard Room",
    region: "dungeon",
    shortDescription: "Rusted weapon racks line a room built for waiting.",
    longDescription:
      "A long table, split down the middle, still holds a game of dice frozen mid-turn. " +
      "Whatever ended that game happened fast enough that no one bothered to pick up the dice.",
    exits: [
      { direction: "west", to: "dungeon_entrance" },
      { direction: "east", to: "cell_block" },
      { direction: "north", to: "armory", locked: true, keyItemId: "rusty_key" },
      { direction: "up", to: "castle_dungeon_stair" },
    ],
    itemIds: ["wooden_shield"],
    monsterIds: ["skeleton_warrior"],
    isDark: true,
    tags: ["dungeon", "underground"],
    mapPosition: { x: 3, y: -3, z: -2 },
  },
  {
    id: "armory",
    name: "Dungeon Armory",
    region: "dungeon",
    shortDescription: "Weapon racks, most empty, a few still worth taking.",
    longDescription:
      "Whoever looted this place first was in a hurry — a few good pieces were left " +
      "behind, tucked in a corner crate as if someone meant to come back for them.",
    exits: [{ direction: "south", to: "guard_room" }],
    itemIds: ["chainmail", "iron_sword"],
    isDark: true,
    tags: ["dungeon", "underground", "treasure"],
    mapPosition: { x: 3, y: -2, z: -2 },
  },
  {
    id: "cell_block",
    name: "Cell Block",
    region: "dungeon",
    shortDescription: "A row of iron-barred cells, doors hanging open.",
    longDescription:
      "Most of the cells are empty, doors long since rusted open. Scratches cover the " +
      "walls of the last one — tally marks, mostly, and one word repeated so many " +
      "times it stopped looking like a word.",
    exits: [
      { direction: "west", to: "guard_room" },
      { direction: "down", to: "treasure_vault" },
      { direction: "south", to: "torture_chamber" },
    ],
    itemIds: ["rusty_key"],
    features: [
      {
        id: "scratched_wall",
        name: "wall",
        synonyms: ["scratches", "tally marks"],
        description: "Hundreds of tally marks, and one repeated word: DEEPER.",
        onInspect:
          "Whoever was kept here counted a very long time, and left one instruction " +
          "for whoever found this cell next: DEEPER.",
      },
    ],
    isDark: true,
    tags: ["dungeon", "underground"],
    mapPosition: { x: 4, y: -3, z: -2 },
  },
  {
    id: "treasure_vault",
    name: "Dungeon Treasure Vault",
    region: "dungeon",
    shortDescription: "A reinforced chamber, guarded by something that never left.",
    longDescription:
      "Whoever built this vault trusted the guardian more than the lock. Coins, a " +
      "jeweled ring, and something wrapped in oilcloth are stacked on a plinth at " +
      "the center of the room.",
    exits: [{ direction: "up", to: "cell_block" }],
    itemIds: ["silver_ring", "rune_of_warding"],
    monsterIds: ["stone_ogre"],
    isDark: true,
    tags: ["dungeon", "underground", "treasure", "boss"],
    mapPosition: { x: 4, y: -4, z: -2 },
  },
  {
    id: "torture_chamber",
    name: "Torture Chamber",
    region: "dungeon",
    shortDescription: "Rusted instruments, and a room that doesn't need explaining.",
    longDescription:
      "Whatever this room was used for stopped a long time ago, but the tools are " +
      "still hung neatly on the walls, each one in its place, as if someone " +
      "intended to come back and use them again.",
    exits: [{ direction: "north", to: "cell_block" }],
    itemIds: ["rusty_dagger"],
    monsterIds: ["skeleton_warrior"],
    isDark: true,
    tags: ["dungeon", "underground"],
    mapPosition: { x: 5, y: -3, z: -2 },
  },
];
