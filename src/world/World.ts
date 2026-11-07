import type { Direction, Exit, Feature, GameState, Location } from "@/types";
import { getLocation } from "./locations";

/**
 * Stateless queries over the static world graph, aware of runtime state
 * (revealed hidden exits, etc.) where needed. This is the only module
 * that should reach into `locations/index.ts` directly — everything else
 * goes through here so the storage/generation strategy can change later
 * without touching command handlers.
 */
export class World {
  getLocation(id: string): Location | undefined {
    return getLocation(id);
  }

  /** Exits visible to the player right now (hidden ones excluded unless revealed). */
  visibleExits(location: Location, state: GameState): Exit[] {
    return location.exits.filter((exit) => {
      if (!exit.hidden) return true;
      return state.world.revealedExits.has(`${location.id}:${exit.direction}`);
    });
  }

  findExit(location: Location, direction: Direction, state: GameState): Exit | undefined {
    return this.visibleExits(location, state).find((e) => e.direction === direction);
  }

  findFeature(location: Location, query: string): Feature | undefined {
    const q = query.toLowerCase();
    return location.features?.find(
      (f) =>
        f.name.toLowerCase() === q ||
        f.name.toLowerCase().includes(q) ||
        f.synonyms?.some((s) => s.toLowerCase() === q)
    );
  }

  /** All locations reachable from `id` within `depth` hops, ignoring hidden exits. */
  neighborhood(id: string, depth: number, state: GameState): Set<string> {
    const seen = new Set<string>([id]);
    let frontier = [id];
    for (let i = 0; i < depth; i++) {
      const next: string[] = [];
      for (const locId of frontier) {
        const loc = this.getLocation(locId);
        if (!loc) continue;
        for (const exit of this.visibleExits(loc, state)) {
          if (!seen.has(exit.to)) {
            seen.add(exit.to);
            next.push(exit.to);
          }
        }
      }
      frontier = next;
    }
    return seen;
  }
}

export const world = new World();
