import type { GameState, Location } from "@/types";
import { world } from "@/world/World";
import { ALL_LOCATIONS } from "@/world/locations";

const CELL_WIDTH = 11;

interface GridCell {
  location?: Location;
  status: "unknown" | "known" | "visited" | "current";
}

/**
 * Renders a text/ASCII map of the player's current z-level (floor),
 * centered loosely on the player, respecting fog of war: unvisited-but-
 * known locations render as "?", unvisited-and-unknown locations don't
 * render at all, exactly like the design doc's example.
 */
export class MapSystem {
  /** Call whenever the player enters a location, to reveal its neighbors as "known". */
  revealNeighbors(state: GameState, locationId: string): void {
    const loc = world.getLocation(locationId);
    if (!loc) return;
    state.world.visitedLocationIds.add(locationId);
    state.world.knownLocationIds.add(locationId);
    for (const exit of world.visibleExits(loc, state)) {
      state.world.knownLocationIds.add(exit.to);
    }
  }

  renderAscii(state: GameState): string {
    const currentLoc = world.getLocation(state.player.currentLocationId);
    if (!currentLoc?.mapPosition) {
      return "The map has no record of this place. (No coordinates set.)";
    }
    const z = currentLoc.mapPosition.z;

    const relevant = ALL_LOCATIONS.filter(
      (l) =>
        l.mapPosition?.z === z &&
        (state.world.knownLocationIds.has(l.id) || state.world.visitedLocationIds.has(l.id))
    );

    if (relevant.length === 0) {
      return "You have no map for this place yet.";
    }

    const xs = relevant.map((l) => l.mapPosition!.x);
    const ys = relevant.map((l) => l.mapPosition!.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const grid: GridCell[][] = [];
    for (let y = minY; y <= maxY; y++) {
      const row: GridCell[] = [];
      for (let x = minX; x <= maxX; x++) {
        const loc = relevant.find((l) => l.mapPosition!.x === x && l.mapPosition!.y === y);
        if (!loc) {
          row.push({ status: "unknown" });
          continue;
        }
        const status =
          loc.id === state.player.currentLocationId
            ? "current"
            : state.world.visitedLocationIds.has(loc.id)
            ? "visited"
            : "known";
        row.push({ location: loc, status });
      }
      grid.push(row);
    }

    const lines: string[] = [];
    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
      const row = grid[rowIdx];
      const labelLine = row
        .map((cell) => this.cellLabel(cell).padStart(CELL_WIDTH).padEnd(CELL_WIDTH))
        .join("");
      lines.push(labelLine);

      if (rowIdx < grid.length - 1) {
        const connectorLine = row
          .map((cell) => (cell.location ? this.verticalConnector(cell) : "").padEnd(CELL_WIDTH))
          .join("");
        lines.push(connectorLine);
      }
    }

    const horizontalConnectors = this.buildHorizontalConnectors(grid);

    // Interleave horizontal connector rows between label rows
    const finalLines: string[] = [];
    let li = 0;
    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
      finalLines.push(lines[li++]);
      finalLines.push(horizontalConnectors[rowIdx] ?? "");
      if (rowIdx < grid.length - 1) {
        finalLines.push(lines[li++]);
      }
    }

    return finalLines.filter((l) => l.trim().length > 0).join("\n");
  }

  private cellLabel(cell: GridCell): string {
    if (cell.status === "unknown" || !cell.location) return "";
    if (cell.status === "current") return `[${this.shortName(cell.location.name)}]`;
    if (cell.status === "known") return "?";
    return this.shortName(cell.location.name);
  }

  private shortName(name: string): string {
    return name.length > 9 ? name.slice(0, 8) + "\u2026" : name;
  }

  private verticalConnector(cell: GridCell): string {
    return cell.location ? "|" : "";
  }

  private buildHorizontalConnectors(grid: GridCell[][]): string[] {
    return grid.map((row) =>
      row
        .map((cell, i) => {
          if (i === row.length - 1) return cell.location ? "" : "";
          const next = row[i + 1];
          return cell.location && next.location ? "----".padEnd(CELL_WIDTH) : "".padEnd(CELL_WIDTH);
        })
        .join("")
    );
  }

  /** Compact legend shown under the map. */
  legend(): string {
    return "[YOU]  visited room  ?  known-but-unvisited  (blank)  undiscovered";
  }
}

export const mapSystem = new MapSystem();
