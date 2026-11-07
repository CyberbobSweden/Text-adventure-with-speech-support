import type { Location } from "@/types";
import { VILLAGE_LOCATIONS } from "./village";
import { FOREST_LOCATIONS } from "./forest";
import { CAVE_LOCATIONS } from "./cave";
import { DUNGEON_LOCATIONS } from "./dungeon";
import { CRYPT_LOCATIONS } from "./crypt";
import { SEWER_LOCATIONS } from "./sewers";
import { UNDERGROUND_CITY_LOCATIONS } from "./underground_city";
import { RUINS_LOCATIONS } from "./ruins";
import { CASTLE_LOCATIONS } from "./castle";
import { ANCIENT_TEMPLE_LOCATIONS } from "./ancient_temple";
import { ICE_CAVES_LOCATIONS } from "./ice_caves";
import { VOLCANO_LOCATIONS } from "./volcano";
import { DESERT_LOCATIONS } from "./desert";
import { MOUNTAINS_LOCATIONS } from "./mountains";
import { SWAMP_LOCATIONS } from "./swamp";

/**
 * This is the full hand-authored world for the current milestone: a
 * connected, playable slice spanning village -> forest -> cave -> dungeon
 * -> crypt -> sewers -> underground city gate, matching the example map
 * in the design doc (Forest — Village — Cave, with Old Well and a
 * downward branch).
 *
 * SCALING TO 1000+ LOCATIONS
 * ---------------------------
 * Don't hand-write 1000 rooms in one file. Instead:
 *
 * 1. Keep hand-authoring landmark locations (quest hubs, bosses, unique
 *    set-pieces) exactly like this — one object per file per region.
 * 2. For "filler" rooms (long mine corridors, repetitive crypt cells,
 *    endless dark-forest paths), write a per-region generator
 *    (see `worldGenerator.ts`) that stitches procedurally-described rooms
 *    onto the hand-authored landmarks using the same `Location` shape.
 *    The player never sees the difference — a `Location` is a
 *    `Location`, whether it was typed by hand or assembled from a
 *    template pool (feature phrases, ambient sound sets, name components
 *    by region).
 * 3. Load regions lazily (dynamic `import()`) so the client never has to
 *    hold all 1000+ rooms in memory at once — only the current region
 *    plus its immediate neighbors.
 */
export const ALL_LOCATIONS: Location[] = [
  ...VILLAGE_LOCATIONS,
  ...FOREST_LOCATIONS,
  ...CAVE_LOCATIONS,
  ...DUNGEON_LOCATIONS,
  ...CRYPT_LOCATIONS,
  ...SEWER_LOCATIONS,
  ...UNDERGROUND_CITY_LOCATIONS,
  ...RUINS_LOCATIONS,
  ...CASTLE_LOCATIONS,
  ...ANCIENT_TEMPLE_LOCATIONS,
  ...ICE_CAVES_LOCATIONS,
  ...VOLCANO_LOCATIONS,
  ...DESERT_LOCATIONS,
  ...MOUNTAINS_LOCATIONS,
  ...SWAMP_LOCATIONS,
];

export const LOCATIONS_BY_ID: Record<string, Location> = Object.fromEntries(
  ALL_LOCATIONS.map((loc) => [loc.id, loc])
);

export function getLocation(id: string): Location | undefined {
  return LOCATIONS_BY_ID[id];
}

export const STARTING_LOCATION_ID = "village_square";
