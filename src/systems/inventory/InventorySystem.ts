import type { GameState, Item } from "@/types";
import { findItemByName, getItem } from "@/entities/items";

export class InventorySystem {
  addItem(state: GameState, itemId: string, quantity = 1): void {
    const item = getItem(itemId);
    if (!item) return;
    const existing = state.player.inventory.find((slot) => slot.itemId === itemId);
    if (item.stackable && existing) {
      existing.quantity += quantity;
      return;
    }
    state.player.inventory.push({ itemId, quantity });
  }

  removeItem(state: GameState, itemId: string, quantity = 1): boolean {
    const slot = state.player.inventory.find((s) => s.itemId === itemId);
    if (!slot || slot.quantity < quantity) return false;
    slot.quantity -= quantity;
    if (slot.quantity <= 0) {
      state.player.inventory = state.player.inventory.filter((s) => s !== slot);
    }
    return true;
  }

  hasItem(state: GameState, itemId: string): boolean {
    return state.player.inventory.some((s) => s.itemId === itemId);
  }

  findInInventory(state: GameState, query: string): Item | undefined {
    const item = findItemByName(query);
    if (!item) return undefined;
    return this.hasItem(state, item.id) ? item : undefined;
  }

  equip(state: GameState, itemId: string): string {
    const item = getItem(itemId);
    if (!item || !item.equipSlot) return "You can't equip that.";
    if (!this.hasItem(state, itemId)) return "You don't have that.";
    state.player.equipment[item.equipSlot] = itemId;
    return `You equip the ${item.name}.`;
  }

  unequip(state: GameState, slot: keyof typeof state.player.equipment): string {
    const itemId = state.player.equipment[slot];
    if (!itemId) return "Nothing is equipped there.";
    delete state.player.equipment[slot];
    const item = getItem(itemId);
    return `You unequip the ${item?.name ?? "item"}.`;
  }

  equippedWeaponId(state: GameState): string | undefined {
    return state.player.equipment.mainHand;
  }

  equippedWeaponDamage(state: GameState): [number, number] {
    const weaponId = state.player.equipment.mainHand;
    const weapon = weaponId ? getItem(weaponId) : undefined;
    return weapon?.damage ?? [1, 2]; // Unarmed fallback
  }

  totalArmorValue(state: GameState): number {
    let total = 0;
    for (const itemId of Object.values(state.player.equipment)) {
      if (!itemId) continue;
      const item = getItem(itemId);
      if (item?.armorValue) total += item.armorValue;
    }
    return total;
  }

  carryWeight(state: GameState): number {
    return state.player.inventory.reduce((sum, slot) => {
      const item = getItem(slot.itemId);
      return sum + (item?.weight ?? 0) * slot.quantity;
    }, 0);
  }

  listDescription(state: GameState): string {
    if (state.player.inventory.length === 0) return "Your inventory is empty.";
    const lines = state.player.inventory.map((slot) => {
      const item = getItem(slot.itemId);
      if (!item) return `- Unknown item x${slot.quantity}`;
      const equippedTag = Object.values(state.player.equipment).includes(slot.itemId)
        ? " (equipped)"
        : "";
      const qty = item.stackable && slot.quantity > 1 ? ` x${slot.quantity}` : "";
      return `- ${item.name}${qty}${equippedTag}`;
    });
    return [`Gold: ${state.player.gold}`, ...lines].join("\n");
  }
}

export const inventorySystem = new InventorySystem();
