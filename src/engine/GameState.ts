import type { Difficulty, GameState, PlayerClass } from "@/types";
import { characterSystem } from "@/systems/character/CharacterSystem";
import { STARTING_LOCATION_ID } from "@/world/locations";
import { QUESTS } from "@/data/quests";

export function createNewGame(
  playerName: string,
  playerClass: PlayerClass,
  difficulty: Difficulty = "normal"
): GameState {
  const player = characterSystem.createNewPlayer(playerName, playerClass);
  player.currentLocationId = STARTING_LOCATION_ID;

  const quests: GameState["quests"] = {};
  const questProgress: GameState["questProgress"] = {};
  for (const quest of Object.values(QUESTS)) {
    if (quest.autoStart) {
      quests[quest.id] = "active";
      questProgress[quest.id] = quest.stages[0]?.id ?? "";
    }
  }

  return {
    player,
    world: {
      visitedLocationIds: new Set(),
      knownLocationIds: new Set([STARTING_LOCATION_ID]),
      locationItemOverrides: {},
      defeatedMonsters: new Set(),
      flags: new Set(),
      revealedExits: new Set(),
      trophyCase: [],
    },
    quests,
    questProgress,
    turnCount: 0,
    log: [],
    unlockedCommands: new Set(["look", "go", "inventory", "stats", "help", "quests"]),
    seed: `${playerName}-${Date.now()}`,
    difficulty,
    score: 0,
  };
}
