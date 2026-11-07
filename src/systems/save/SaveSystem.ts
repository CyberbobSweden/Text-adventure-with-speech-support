import type { GameState, SaveFileV1 } from "@/types";

const STORAGE_KEY = "retro-dungeon:save:v1";

/**
 * All persistence is client-side for this milestone: a JSON save file,
 * either kept in localStorage for quick save/load, or exported/imported
 * as a downloadable `.json` the player can back up. This module is the
 * only thing that needs to change when a backend save API arrives later
 * (swap the two methods below for fetch calls; the SaveFileV1 shape and
 * every caller stays identical).
 */
export class SaveSystem {
  serialize(state: GameState): SaveFileV1 {
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      player: state.player,
      world: {
        visitedLocationIds: [...state.world.visitedLocationIds],
        knownLocationIds: [...state.world.knownLocationIds],
        locationItemOverrides: state.world.locationItemOverrides,
        defeatedMonsters: [...state.world.defeatedMonsters],
        flags: [...state.world.flags],
        revealedExits: [...state.world.revealedExits],
        trophyCase: [...state.world.trophyCase],
      },
      quests: state.quests,
      questProgress: state.questProgress,
      turnCount: state.turnCount,
      unlockedCommands: [...state.unlockedCommands],
      seed: state.seed,
      difficulty: state.difficulty,
      score: state.score,
    };
  }

  deserialize(save: SaveFileV1): GameState {
    return {
      player: save.player,
      world: {
        visitedLocationIds: new Set(save.world.visitedLocationIds),
        knownLocationIds: new Set(save.world.knownLocationIds),
        locationItemOverrides: save.world.locationItemOverrides,
        defeatedMonsters: new Set(save.world.defeatedMonsters),
        flags: new Set(save.world.flags),
        revealedExits: new Set(save.world.revealedExits),
        trophyCase: save.world.trophyCase ?? [],
      },
      quests: save.quests,
      questProgress: save.questProgress,
      turnCount: save.turnCount,
      log: [],
      unlockedCommands: new Set(save.unlockedCommands),
      seed: save.seed,
      difficulty: save.difficulty ?? "normal",
      score: save.score ?? 0,
    };
  }

  saveToLocalStorage(state: GameState): void {
    const save = this.serialize(state);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  }

  loadFromLocalStorage(): GameState | undefined {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    try {
      const save = JSON.parse(raw) as SaveFileV1;
      return this.deserialize(save);
    } catch {
      return undefined;
    }
  }

  hasLocalSave(): boolean {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  }

  downloadAsFile(state: GameState, filename = "legends-of-the-deep-save.json"): void {
    const save = this.serialize(state);
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async loadFromUploadedFile(file: File): Promise<GameState> {
    const text = await file.text();
    const save = JSON.parse(text) as SaveFileV1;
    if (save.version !== 1) {
      throw new Error(`Unsupported save version: ${save.version}`);
    }
    return this.deserialize(save);
  }
}

export const saveSystem = new SaveSystem();
