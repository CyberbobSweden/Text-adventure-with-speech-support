import type { GameState, Monster } from "@/types";
import { inventorySystem } from "@/systems/inventory/InventorySystem";
import { characterSystem } from "@/systems/character/CharacterSystem";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface CombatOutcome {
  lines: string[];
  monsterDefeated: boolean;
  playerDefeated: boolean;
  damageDealt: number;
}

/**
 * Deliberately simple, readable combat math: one player action resolves
 * to one exchange of blows. There's no hidden initiative queue — this
 * keeps `attack goblin` legible in a text log, which matters more here
 * than simulation depth. Ability/spell effects (stun, burn, etc.) hook in
 * via `abilityId` without touching the base exchange.
 */
export class CombatSystem {
  resolvePlayerAttack(
    state: GameState,
    monster: Monster,
    monsterCurrentHealth: number,
    abilityDamage?: [number, number]
  ): CombatOutcome {
    const lines: string[] = [];
    const [minDmg, maxDmg] = abilityDamage ?? inventorySystem.equippedWeaponDamage(state);
    const strBonus = Math.floor((state.player.stats.strength - 10) / 4);
    const rawDamage = Math.max(1, randInt(minDmg, maxDmg) + strBonus);
    const mitigated = Math.max(1, rawDamage - monster.armor);

    const newHealth = monsterCurrentHealth - mitigated;
    lines.push(`You strike the ${monster.name} for ${mitigated} damage.`);

    if (newHealth <= 0) {
      lines.push(`The ${monster.name} falls.`);
      const xpLines = characterSystem.grantXp(state, monster.xpReward);
      lines.push(...xpLines);
      const gold = randInt(monster.goldReward[0], monster.goldReward[1]);
      if (gold > 0) {
        state.player.gold += gold;
        lines.push(`You find ${gold} gold.`);
      }
      for (const loot of monster.lootTable ?? []) {
        if (Math.random() <= loot.chance) {
          const qty = randInt(loot.minQty ?? 1, loot.maxQty ?? 1);
          inventorySystem.addItem(state, loot.itemId, qty);
          lines.push(`The ${monster.name} dropped something.`);
        }
      }
      return { lines, monsterDefeated: true, playerDefeated: false, damageDealt: mitigated };
    }

    // Monster retaliates
    const monsterDamage = Math.max(1, randInt(monster.damage[0], monster.damage[1]) - inventorySystem.totalArmorValue(state));
    state.player.health -= monsterDamage;
    lines.push(`The ${monster.name} hits you for ${monsterDamage} damage.`);

    if (state.player.health <= 0) {
      state.player.health = 0;
      lines.push("Everything goes dark...");
      return { lines, monsterDefeated: false, playerDefeated: true, damageDealt: mitigated };
    }

    return { lines, monsterDefeated: false, playerDefeated: false, damageDealt: mitigated };
  }

  attemptFlee(): { success: boolean; text: string } {
    const success = Math.random() < 0.6;
    return {
      success,
      text: success ? "You break away and flee." : "You can't get away!",
    };
  }
}

export const combatSystem = new CombatSystem();
