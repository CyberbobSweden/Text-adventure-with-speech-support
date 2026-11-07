import type { GameState } from "@/types";
import { QUESTS } from "@/data/quests";
import { inventorySystem } from "@/systems/inventory/InventorySystem";
import { characterSystem } from "@/systems/character/CharacterSystem";

export class QuestSystem {
  startQuest(state: GameState, questId: string): string | undefined {
    const quest = QUESTS[questId];
    if (!quest) return undefined;
    if (state.quests[questId] === "active" || state.quests[questId] === "completed") return undefined;
    state.quests[questId] = "active";
    state.questProgress[questId] = quest.stages[0]?.id ?? "";
    return `New quest: ${quest.title}`;
  }

  /** Call after any flag is set — checks whether it advances/completes active quests. */
  onFlagSet(state: GameState, flag: string): string[] {
    const messages: string[] = [];
    for (const quest of Object.values(QUESTS)) {
      if (state.quests[quest.id] !== "active") continue;
      const currentStageId = state.questProgress[quest.id];
      const stageIdx = quest.stages.findIndex((s) => s.id === currentStageId);
      const stage = quest.stages[stageIdx];
      if (!stage || stage.completeWhenFlag !== flag) continue;

      const isLastStage = stageIdx === quest.stages.length - 1;
      if (isLastStage) {
        state.quests[quest.id] = "completed";
        messages.push(`Quest complete: ${quest.title}`);
        const xpLines = characterSystem.grantXp(state, quest.rewardXp);
        messages.push(...xpLines);
        state.score += Math.round(quest.rewardXp / 2);
        if (quest.rewardGold) {
          state.player.gold += quest.rewardGold;
          messages.push(`You receive ${quest.rewardGold} gold.`);
        }
        for (const itemId of quest.rewardItemIds ?? []) {
          inventorySystem.addItem(state, itemId);
          messages.push(`You receive a quest reward.`);
        }
      } else {
        const nextStage = quest.stages[stageIdx + 1];
        state.questProgress[quest.id] = nextStage.id;
        messages.push(`Quest updated: ${quest.title} — ${nextStage.description}`);
      }
    }
    return messages;
  }

  listDescription(state: GameState): string {
    const active = Object.entries(state.quests).filter(([, status]) => status === "active");
    const completed = Object.entries(state.quests).filter(([, status]) => status === "completed");
    if (active.length === 0 && completed.length === 0) return "You have no quests yet.";

    const lines: string[] = [];
    if (active.length) {
      lines.push("Active:");
      for (const [id] of active) {
        const quest = QUESTS[id];
        const stageId = state.questProgress[id];
        const stage = quest.stages.find((s) => s.id === stageId);
        lines.push(`  - ${quest.title}: ${stage?.description ?? "..."}`);
      }
    }
    if (completed.length) {
      lines.push("Completed:");
      for (const [id] of completed) {
        lines.push(`  - ${QUESTS[id].title}`);
      }
    }
    return lines.join("\n");
  }
}

export const questSystem = new QuestSystem();
