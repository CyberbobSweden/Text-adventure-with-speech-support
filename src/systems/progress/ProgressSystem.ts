import type { GameState } from "@/types";
import { ALL_LOCATIONS } from "@/world/locations";
import { QUESTS } from "@/data/quests";
import { MONSTERS } from "@/entities/monsters";

const WEIGHTS = {
  exploration: 0.6,
  quests: 0.2,
  monsters: 0.2,
};

export interface CompletionBreakdown {
  percent: number;
  locationsVisited: number;
  totalLocations: number;
  questsCompleted: number;
  totalQuests: number;
  monstersDefeated: number;
  totalMonsters: number;
}

/**
 * A rough, honest "how much of the world have you seen" number rather
 * than a strict 100%-achievable checklist — some locations are mutually
 * exclusive shortcuts (e.g. the one-way Lake Ledge -> Ossuary path), so
 * no single playthrough is realistically meant to hit 100%. That's fine;
 * this is meant to motivate exploration, not gate an achievement.
 */
export function getCompletion(state: GameState): CompletionBreakdown {
  const totalLocations = ALL_LOCATIONS.length;
  const locationsVisited = state.world.visitedLocationIds.size;

  const totalQuests = Object.keys(QUESTS).length;
  const questsCompleted = Object.values(state.quests).filter((s) => s === "completed").length;

  const totalMonsters = Object.keys(MONSTERS).length;
  const uniqueDefeated = new Set(
    [...state.world.defeatedMonsters].map((key) => key.split(":")[1])
  );
  const monstersDefeated = uniqueDefeated.size;

  const explorationScore = totalLocations > 0 ? locationsVisited / totalLocations : 0;
  const questScore = totalQuests > 0 ? questsCompleted / totalQuests : 0;
  const monsterScore = totalMonsters > 0 ? monstersDefeated / totalMonsters : 0;

  const percent = Math.min(
    100,
    Math.round(
      (explorationScore * WEIGHTS.exploration +
        questScore * WEIGHTS.quests +
        monsterScore * WEIGHTS.monsters) *
        100
    )
  );

  return {
    percent,
    locationsVisited,
    totalLocations,
    questsCompleted,
    totalQuests,
    monstersDefeated,
    totalMonsters,
  };
}
