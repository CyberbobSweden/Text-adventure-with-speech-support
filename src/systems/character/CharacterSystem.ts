import type { GameState, PlayerClass } from "@/types";
import { getClass } from "@/data/classes";
import { getItem } from "@/entities/items";

/** Simple, tunable XP curve: 100 * level^1.5, rounded to nearest 10. */
function xpForLevel(level: number): number {
  return Math.round((100 * Math.pow(level, 1.5)) / 10) * 10;
}

export class CharacterSystem {
  createNewPlayer(name: string, playerClass: PlayerClass): GameState["player"] {
    const def = getClass(playerClass);
    const maxHealth = def.hitDie * 3 + def.baseStats.constitution;
    const maxMana = def.manaDie * 3 + def.baseStats.intelligence;
    const equipment: GameState["player"]["equipment"] = {};
    for (const itemId of def.startingItemIds) {
      const item = getItem(itemId);
      if (item?.equipSlot && !equipment[item.equipSlot]) {
        equipment[item.equipSlot] = itemId;
      }
    }
    return {
      name,
      class: playerClass,
      level: 1,
      xp: 0,
      xpToNextLevel: xpForLevel(1),
      stats: { ...def.baseStats },
      health: maxHealth,
      maxHealth,
      mana: maxMana,
      maxMana,
      gold: 20,
      inventory: def.startingItemIds.map((itemId) => ({ itemId, quantity: 1 })),
      equipment,
      currentLocationId: "village_square",
      torchLit: false,
      turnsSinceRest: 0,
    };
  }

  /** Returns level-up narration lines, if any level-ups occurred. */
  grantXp(state: GameState, amount: number): string[] {
    const messages: string[] = [];
    const player = state.player;
    player.xp += amount;
    messages.push(`You gain ${amount} XP.`);

    while (player.xp >= player.xpToNextLevel) {
      player.xp -= player.xpToNextLevel;
      player.level += 1;
      player.xpToNextLevel = xpForLevel(player.level);
      const def = getClass(player.class);
      const healthGain = Math.round(def.hitDie * 0.6) + 2;
      const manaGain = def.manaDie > 0 ? Math.round(def.manaDie * 0.6) + 1 : 0;
      player.maxHealth += healthGain;
      player.health = player.maxHealth;
      player.maxMana += manaGain;
      player.mana = player.maxMana;
      messages.push(
        `*** You reach level ${player.level}! (+${healthGain} max health${
          manaGain ? `, +${manaGain} max mana` : ""
        }) ***`
      );
    }
    return messages;
  }

  rest(state: GameState): string {
    state.player.health = state.player.maxHealth;
    state.player.mana = state.player.maxMana;
    state.player.turnsSinceRest = 0;
    return "You rest. Your wounds close and your strength returns.";
  }
}

export const characterSystem = new CharacterSystem();
