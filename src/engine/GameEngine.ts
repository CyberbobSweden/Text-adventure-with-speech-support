import type {
  CommandResult,
  Direction,
  GameState,
  ParsedCommand,
} from "@/types";
import { parser } from "@/parser/Parser";
import { world } from "@/world/World";
import { getItem, findItemByName } from "@/entities/items";
import { getMonster, applyDifficulty } from "@/entities/monsters";
import { getNpc } from "@/entities/npc";
import { getClass } from "@/data/classes";
import { inventorySystem } from "@/systems/inventory/InventorySystem";
import { characterSystem } from "@/systems/character/CharacterSystem";
import { combatSystem } from "@/systems/combat/CombatSystem";
import { questSystem } from "@/systems/quests/QuestSystem";
import { mapSystem } from "@/systems/map/MapSystem";
import { saveSystem } from "@/systems/save/SaveSystem";
import { getCompletion } from "@/systems/progress/ProgressSystem";
import { DEATH_BANNER, VICTORY_BANNER } from "@/data/asciiArt";
import { getRank, nextRankThreshold } from "@/data/ranks";

const WAYSTONE_FLAGS = [
  "activated_ice_waystone",
  "activated_fire_waystone",
  "activated_sand_waystone",
  "activated_peak_waystone",
  "activated_marsh_waystone",
];

/** Runtime combat encounter tracked outside GameState (not persisted mid-fight). */
interface ActiveEncounter {
  monsterId: string;
  currentHealth: number;
}

/**
 * The single entry point for turning player input into narration.
 * Owns no rendering — returns plain text the UI layer displays however
 * it likes (terminal scrollback, log panel, etc.).
 */
export class GameEngine {
  private encounter: ActiveEncounter | null = null;

  constructor(private state: GameState) {}

  getState(): GameState {
    return this.state;
  }

  /** Entry point called by the UI for every line the player submits. */
  execute(rawInput: string): CommandResult {
    const cmd = parser.parse(rawInput);
    if (!cmd.verb) {
      return { text: "...", turnConsumed: false };
    }

    const result = this.dispatch(cmd);
    if (result.turnConsumed) {
      this.state.turnCount += 1;
      this.state.player.turnsSinceRest += 1;
    }
    this.state.log.push({
      turn: this.state.turnCount,
      text: result.text,
      kind: result.kind ?? "narration",
    });
    return result;
  }

  // ---------------------------------------------------------------------
  // Dispatch
  // ---------------------------------------------------------------------

  private dispatch(cmd: ParsedCommand): CommandResult {
    // While in combat, most verbs are reinterpreted as combat actions.
    if (this.encounter && ["attack", "cast", "shoot", "flee", "look"].includes(cmd.verb)) {
      return this.handleCombatTurn(cmd);
    }

    switch (cmd.verb) {
      case "go":
        return this.handleGo(cmd);
      case "look":
        return this.handleLook(cmd);
      case "inspect":
        return this.handleInspect(cmd);
      case "search":
        return this.handleSearch(cmd);
      case "listen":
      case "smell":
      case "taste":
        return this.handleSense(cmd);
      case "take":
        return this.handleTake(cmd);
      case "drop":
        return this.handleDrop(cmd);
      case "put":
        return this.handlePut(cmd);
      case "wear":
      case "equip":
        return this.handleEquip(cmd);
      case "unequip":
        return this.handleUnequip(cmd);
      case "inventory":
        return { text: inventorySystem.listDescription(this.state), turnConsumed: false };
      case "attack":
        return this.handleAttackStart(cmd);
      case "cast":
        return this.handleCast(cmd);
      case "drink":
        return this.handleDrink(cmd);
      case "eat":
        return this.handleEat(cmd);
      case "use":
        return this.handleUse(cmd);
      case "open":
      case "close":
      case "unlock":
      case "lock":
      case "push":
      case "pull":
      case "read":
      case "pray":
      case "sit":
      case "climb":
      case "dig":
        return this.handleFeatureInteraction(cmd);
      case "talk":
      case "ask":
        return this.handleTalk(cmd);
      case "buy":
        return this.handleBuy(cmd);
      case "stats":
        return { text: this.renderStats(), turnConsumed: false };
      case "spells":
        return { text: this.renderSpells(), turnConsumed: false };
      case "quests":
        return { text: questSystem.listDescription(this.state), turnConsumed: false };
      case "completion":
        return { text: this.renderCompletion(), turnConsumed: false };
      case "score":
        return { text: this.renderScore(), turnConsumed: false };
      case "xyzzy":
        return { text: this.renderXyzzy(), turnConsumed: true };
      case "plugh":
        return this.handlePlugh();
      case "swear":
        return { text: this.renderSwear(), turnConsumed: true };
      case "sing":
        return { text: this.renderSing(), turnConsumed: true };
      case "dance":
        return { text: this.renderDance(), turnConsumed: true };
      case "count":
        return { text: this.renderCount(cmd), turnConsumed: true };
      case "zork":
        return { text: this.renderZork(), turnConsumed: true };
      case "yell":
        return this.handleYell();
      case "journal":
        return this.handleJournal();
      case "map":
        return this.handleMap();
      case "light":
        return this.handleLight();
      case "rest":
        return this.handleRest();
      case "save":
        return this.handleSave();
      case "help":
        return { text: this.renderHelp(), turnConsumed: false };
      case "hint":
        return { text: this.renderHint(), turnConsumed: false };
      case "swim":
      case "hide":
      case "sneak":
        return { text: `You ${cmd.verb}, but nothing happens yet. (Not implemented in this area.)`, turnConsumed: true };
      default:
        return { text: `I don't understand "${cmd.rawInput}".`, turnConsumed: false };
    }
  }

  // ---------------------------------------------------------------------
  // Movement / observation
  // ---------------------------------------------------------------------

  private handleGo(cmd: ParsedCommand): CommandResult {
    const loc = this.currentLocation();
    const direction = cmd.directObject as Direction | undefined;
    if (!direction) return { text: "Go where?", turnConsumed: false };

    const exit = world.findExit(loc, direction, this.state);
    if (!exit) return { text: `You can't go ${direction} from here.`, turnConsumed: false };
    if (exit.locked) {
      const keyOwned = exit.keyItemId && inventorySystem.hasItem(this.state, exit.keyItemId);
      if (!keyOwned) return { text: "That way is locked.", turnConsumed: false };
    }

    this.state.player.currentLocationId = exit.to;
    mapSystem.revealNeighbors(this.state, exit.to);
    this.state.world.flags.add(`entered_${exit.to}`);
    const flagMessages = questSystem.onFlagSet(this.state, `entered_${exit.to}`);

    const arrival = this.describeLocation(true);
    const encounterText = this.maybeStartEncounter();

    return {
      text: [arrival, ...flagMessages, encounterText].filter(Boolean).join("\n\n"),
      turnConsumed: true,
    };
  }

  private handleLook(cmd: ParsedCommand): CommandResult {
    if (this.encounter) return this.describeEncounter();
    if (cmd.directObject && ["north", "south", "east", "west", "up", "down", "in", "out"].includes(cmd.directObject)) {
      const loc = this.currentLocation();
      const exit = world.findExit(loc, cmd.directObject as Direction, this.state);
      if (!exit) return { text: `You see nothing special that way.`, turnConsumed: false };
      return { text: exit.description ?? `You see a path leading ${exit.direction}.`, turnConsumed: false };
    }
    if (cmd.directObject === "map") return this.handleMap();
    return { text: this.describeLocation(false), turnConsumed: false };
  }

  private handleInspect(cmd: ParsedCommand): CommandResult {
    if (!cmd.directObject) return { text: "Inspect what?", turnConsumed: false };
    if (["me", "myself", "self"].includes(cmd.directObject.toLowerCase())) {
      return { text: this.renderSelfInspection(), turnConsumed: false };
    }
    const loc = this.currentLocation();
    const feature = world.findFeature(loc, cmd.directObject);
    if (feature) {
      if (feature.id === "trophy_case") {
        return { text: this.renderTrophyCase(), turnConsumed: false };
      }
      return { text: feature.onInspect ?? feature.description, turnConsumed: false };
    }
    const item = findItemByName(cmd.directObject);
    if (item && (inventorySystem.hasItem(this.state, item.id) || this.locationHasItem(item.id))) {
      return { text: item.description, turnConsumed: false };
    }
    return { text: "You see nothing special about that.", turnConsumed: false };
  }

  private renderSelfInspection(): string {
    const p = this.state.player;
    const wounded = p.health < p.maxHealth * 0.4 ? " You look worse for wear." : "";
    return `You are ${p.name}, a level ${p.level} ${p.class}. As handsome/formidable as ever.${wounded}`;
  }

  private renderTrophyCase(): string {
    if (this.state.world.trophyCase.length === 0) {
      return "An empty glass-fronted trophy case. (try: put <item> in case)";
    }
    const names = this.state.world.trophyCase.map((id) => getItem(id)?.name ?? id);
    return `The trophy case holds: ${names.join(", ")}.`;
  }

  private handleSearch(cmd: ParsedCommand): CommandResult {
    const loc = this.currentLocation();
    if (cmd.directObject) {
      const feature = world.findFeature(loc, cmd.directObject);
      if (feature?.searchable && feature.searchResult) {
        if (feature.searchResult.revealsExit) {
          this.state.world.revealedExits.add(`${loc.id}:${feature.searchResult.revealsExit}`);
        }
        for (const itemId of feature.searchResult.itemIds ?? []) {
          inventorySystem.addItem(this.state, itemId);
        }
        return { text: feature.searchResult.text, turnConsumed: true };
      }
    }
    return { text: "You search around, but find nothing new.", turnConsumed: true };
  }

  private handleSense(cmd: ParsedCommand): CommandResult {
    const loc = this.currentLocation();
    const feature = cmd.directObject ? world.findFeature(loc, cmd.directObject) : undefined;
    const interaction = feature?.interactions?.[cmd.verb as "listen" | "smell" | "taste"];
    if (interaction) return { text: interaction.text, turnConsumed: true };
    if (loc.ambientSounds?.length) {
      const pick = loc.ambientSounds[Math.floor(Math.random() * loc.ambientSounds.length)];
      return { text: `You ${cmd.verb}: ${pick}.`, turnConsumed: true };
    }
    return { text: `You ${cmd.verb}, but notice nothing unusual.`, turnConsumed: true };
  }

  // ---------------------------------------------------------------------
  // Items
  // ---------------------------------------------------------------------

  private handleTake(cmd: ParsedCommand): CommandResult {
    if (!cmd.directObject) return { text: "Take what?", turnConsumed: false };
    if (["me", "myself", "self"].includes(cmd.directObject.toLowerCase())) {
      return { text: "You take yourself rather too seriously. Nothing else changes.", turnConsumed: false };
    }
    const item = findItemByName(cmd.directObject);
    if (!item || !this.locationHasItem(item.id)) {
      return { text: "You don't see that here.", turnConsumed: false };
    }
    this.removeItemFromLocation(item.id);
    inventorySystem.addItem(this.state, item.id);
    const unlockMsg = this.maybeUnlockCommand(item.id);
    if (item.id === "sunken_crown") {
      return {
        text: [
          VICTORY_BANNER,
          "",
          "You lift the crown from the altar. Whatever wore it last has nothing left to say about it.",
          "The weight of it is more than metal. You've found the heart of this current story — " +
            "there's still a wide world left to explore, but you've closed the book on the Lich King.",
        ].join("\n"),
        turnConsumed: true,
      };
    }
    return { text: [`You take the ${item.name}.`, unlockMsg].filter(Boolean).join(" "), turnConsumed: true };
  }

  /** "put sword in case" / "place crown in trophy case" — Zork-style scoring. */
  private handlePut(cmd: ParsedCommand): CommandResult {
    if (!cmd.directObject) return { text: "Put what where?", turnConsumed: false };
    const destination = cmd.indirectObject ?? "";
    if (!destination.includes("case")) {
      return { text: "Put it where, exactly? (try: put <item> in case)", turnConsumed: false };
    }
    if (this.state.player.currentLocationId !== "village_square") {
      return { text: "There's no trophy case here. The only one you've found is in the Village Square.", turnConsumed: false };
    }
    const item = inventorySystem.findInInventory(this.state, cmd.directObject);
    if (!item) return { text: "You don't have that.", turnConsumed: false };

    const isTrophyWorthy =
      item.type === "treasure" ||
      item.type === "jewelry" ||
      item.type === "rune" ||
      item.rarity === "legendary" ||
      item.rarity === "epic" ||
      item.rarity === "artifact";
    if (!isTrophyWorthy) {
      return { text: `The ${item.name} doesn't seem like trophy case material.`, turnConsumed: false };
    }

    inventorySystem.removeItem(this.state, item.id);
    this.state.world.trophyCase.push(item.id);
    const points = { common: 20, uncommon: 40, rare: 80, epic: 150, legendary: 250, artifact: 500 }[item.rarity] ?? 20;
    this.state.score += points;
    return {
      text: `You place the ${item.name} in the trophy case. (+${points} points) Score: ${this.state.score}`,
      turnConsumed: true,
    };
  }

  private handleDrop(cmd: ParsedCommand): CommandResult {
    if (!cmd.directObject) return { text: "Drop what?", turnConsumed: false };
    const item = inventorySystem.findInInventory(this.state, cmd.directObject);
    if (!item) return { text: "You don't have that.", turnConsumed: false };
    inventorySystem.removeItem(this.state, item.id);
    this.addItemToLocation(item.id);
    return { text: `You drop the ${item.name}.`, turnConsumed: true };
  }

  private handleEquip(cmd: ParsedCommand): CommandResult {
    if (!cmd.directObject) return { text: "Wear/equip what?", turnConsumed: false };
    const item = inventorySystem.findInInventory(this.state, cmd.directObject);
    if (!item) return { text: "You don't have that.", turnConsumed: false };
    return { text: inventorySystem.equip(this.state, item.id), turnConsumed: true };
  }

  private handleUnequip(cmd: ParsedCommand): CommandResult {
    if (!cmd.directObject) return { text: "Remove what?", turnConsumed: false };
    const item = findItemByName(cmd.directObject);
    const slot = item?.equipSlot;
    if (!slot) return { text: "You aren't wearing that.", turnConsumed: false };
    return { text: inventorySystem.unequip(this.state, slot), turnConsumed: true };
  }

  private handleDrink(cmd: ParsedCommand): CommandResult {
    return this.consume(cmd, "potion");
  }
  private handleEat(cmd: ParsedCommand): CommandResult {
    return this.consume(cmd, "food");
  }

  private consume(cmd: ParsedCommand, expectedType: "potion" | "food"): CommandResult {
    if (!cmd.directObject) return { text: `${expectedType === "potion" ? "Drink" : "Eat"} what?`, turnConsumed: false };
    const item = inventorySystem.findInInventory(this.state, cmd.directObject);
    if (!item) return { text: "You don't have that.", turnConsumed: false };
    if (item.type !== expectedType) return { text: `You can't ${expectedType === "potion" ? "drink" : "eat"} that.`, turnConsumed: false };

    inventorySystem.removeItem(this.state, item.id);
    const lines = [`You ${expectedType === "potion" ? "drink" : "eat"} the ${item.name}.`];
    if (item.effect?.heal) {
      this.state.player.health = Math.min(this.state.player.maxHealth, this.state.player.health + item.effect.heal);
      lines.push(`You recover ${item.effect.heal} health.`);
    }
    if (item.effect?.mana) {
      this.state.player.mana = Math.min(this.state.player.maxMana, this.state.player.mana + item.effect.mana);
      lines.push(`You recover ${item.effect.mana} mana.`);
    }
    return { text: lines.join(" "), turnConsumed: true };
  }

  private handleUse(cmd: ParsedCommand): CommandResult {
    if (!cmd.directObject) return { text: "Use what?", turnConsumed: false };
    const item = inventorySystem.findInInventory(this.state, cmd.directObject);
    if (!item) return { text: "You don't have that.", turnConsumed: false };
    if (item.type === "potion" || item.type === "food") return this.consume(cmd, item.type);
    if (item.isLightSource) return this.handleLight();
    return { text: `Nothing happens when you use the ${item.name}.`, turnConsumed: true };
  }

  // ---------------------------------------------------------------------
  // Feature interactions (open/close/unlock/push/pull/read/pray/sit/dig)
  // ---------------------------------------------------------------------

  private handleFeatureInteraction(cmd: ParsedCommand): CommandResult {
    const loc = this.currentLocation();
    if (!cmd.directObject) return { text: `${cmd.verb} what?`, turnConsumed: false };
    const feature = world.findFeature(loc, cmd.directObject);
    if (!feature) return { text: "You don't see that here.", turnConsumed: false };

    const interaction = feature.interactions?.[cmd.verb as keyof typeof feature.interactions];
    if (!interaction) return { text: `Nothing happens.`, turnConsumed: true };

    if (interaction.requiresItemId && !inventorySystem.hasItem(this.state, interaction.requiresItemId)) {
      const requiredItem = getItem(interaction.requiresItemId);
      return { text: `You need ${requiredItem?.name ?? "something"} for that.`, turnConsumed: false };
    }
    if (interaction.requiresFlag && !this.state.world.flags.has(interaction.requiresFlag)) {
      return { text: "Nothing happens yet.", turnConsumed: true };
    }

    const lines = [interaction.text];
    if (interaction.grantsItemId) {
      inventorySystem.addItem(this.state, interaction.grantsItemId);
      const item = getItem(interaction.grantsItemId);
      lines.push(`You now have: ${item?.name ?? "an item"}.`);
    }
    if (interaction.revealsExit) {
      this.state.world.revealedExits.add(`${loc.id}:${interaction.revealsExit}`);
      lines.push(`A path to the ${interaction.revealsExit} is revealed.`);
    }
    if (interaction.setsFlag) {
      this.state.world.flags.add(interaction.setsFlag);
      lines.push(...questSystem.onFlagSet(this.state, interaction.setsFlag));
      if (WAYSTONE_FLAGS.includes(interaction.setsFlag) && WAYSTONE_FLAGS.every((f) => this.state.world.flags.has(f))) {
        this.state.world.flags.add("all_waystones_activated");
        lines.push(...questSystem.onFlagSet(this.state, "all_waystones_activated"));
      }
    }
    return { text: lines.join(" "), turnConsumed: true };
  }

  // ---------------------------------------------------------------------
  // Dialogue / commerce
  // ---------------------------------------------------------------------

  private handleTalk(cmd: ParsedCommand): CommandResult {
    const loc = this.currentLocation();
    if (!loc.npcIds?.length) return { text: "There's no one here to talk to.", turnConsumed: false };

    const npcQuery = cmd.verb === "ask" ? cmd.directObject : cmd.directObject;
    const npc = loc.npcIds.map(getNpc).find((n) => n && npcQuery && n.name.toLowerCase().includes(npcQuery.toLowerCase()));
    const targetNpc = npc ?? getNpc(loc.npcIds[0]);
    if (!targetNpc) return { text: "There's no one here to talk to.", turnConsumed: false };

    const topic = cmd.verb === "ask" ? cmd.indirectObject ?? cmd.directObject : undefined;
    const node =
      (topic &&
        targetNpc.dialogue.find(
          (d) => d.topic === topic || d.synonyms?.some((s) => s === topic)
        )) ??
      targetNpc.dialogue.find((d) => d.topic === "greeting");

    if (!node) return { text: `${targetNpc.name} has nothing to say about that.`, turnConsumed: true };

    const lines = [`${targetNpc.name}: ${node.text}`];
    if (node.setsFlag) {
      this.state.world.flags.add(node.setsFlag);
    }
    if (node.startsQuestId) {
      const msg = questSystem.startQuest(this.state, node.startsQuestId);
      if (msg) lines.push(msg);
    }
    return { text: lines.join("\n"), turnConsumed: true, kind: "dialogue" };
  }

  private handleBuy(cmd: ParsedCommand): CommandResult {
    const loc = this.currentLocation();
    const npc = loc.npcIds?.map(getNpc).find((n) => n?.shopInventory);
    if (!npc?.shopInventory) return { text: "There's nothing to buy here.", turnConsumed: false };
    if (!cmd.directObject) return { text: "Buy what?", turnConsumed: false };

    const offer = npc.shopInventory.find((o) => getItem(o.itemId)?.name.toLowerCase().includes(cmd.directObject!.toLowerCase()));
    if (!offer) return { text: `${npc.name} doesn't sell that.`, turnConsumed: false };
    if (this.state.player.gold < offer.price) return { text: "You can't afford that.", turnConsumed: false };

    this.state.player.gold -= offer.price;
    inventorySystem.addItem(this.state, offer.itemId);
    const item = getItem(offer.itemId);
    return { text: `You buy the ${item?.name} for ${offer.price} gold.`, turnConsumed: true };
  }

  // ---------------------------------------------------------------------
  // Combat
  // ---------------------------------------------------------------------

  private maybeStartEncounter(): string {
    const loc = this.currentLocation();
    const monsterId = loc.monsterIds?.find(
      (id) => !this.state.world.defeatedMonsters.has(`${loc.id}:${id}`)
    );
    if (!monsterId) return "";
    const monster = this.getLiveMonster(monsterId);
    if (!monster) return "";
    this.encounter = { monsterId, currentHealth: monster.health };
    const weapon = getItem(inventorySystem.equippedWeaponId(this.state) ?? "");
    const weaponLine = weapon
      ? `You're wielding your ${weapon.name}.`
      : `You're unarmed — try \`equip <weapon>\` or \`attack ${monster.name.toLowerCase()} with <item>\`.`;
    const spellHint = getClass(this.state.player.class).abilities.length
      ? " You can also `cast <spell>` (see `spells`), or `flee`."
      : " You can `flee` if it turns bad.";
    return `A ${monster.name} blocks your way! ${monster.description}\n${weaponLine}${spellHint}`;
  }

  private describeEncounter(): CommandResult {
    if (!this.encounter) return { text: "There's nothing to fight.", turnConsumed: false };
    const monster = this.getLiveMonster(this.encounter.monsterId)!;
    return {
      text: `${monster.name}: ${this.encounter.currentHealth}/${monster.health} HP. ${monster.description}`,
      turnConsumed: false,
    };
  }

  private handleAttackStart(cmd: ParsedCommand): CommandResult {
    if (!this.encounter) {
      const loc = this.currentLocation();
      const monsterId = cmd.directObject
        ? loc.monsterIds?.find((id) => getMonster(id)?.name.toLowerCase().includes(cmd.directObject!.toLowerCase()))
        : loc.monsterIds?.[0];
      if (!monsterId || this.state.world.defeatedMonsters.has(`${loc.id}:${monsterId}`)) {
        return { text: "There's nothing here to attack.", turnConsumed: false };
      }
      const monster = this.getLiveMonster(monsterId)!;
      this.encounter = { monsterId, currentHealth: monster.health };
    }
    return this.handleCombatTurn({ ...cmd, verb: "attack" });
  }

  /** Fetches a monster's stats scaled to the player's chosen difficulty. */
  private getLiveMonster(id: string) {
    const monster = getMonster(id);
    return monster ? applyDifficulty(monster, this.state.difficulty) : undefined;
  }

  /** "attack goblin with sword" / "kill goblin with dagger" — swap weapon on the fly if owned. */
  private maybeEquipForAttack(cmd: ParsedCommand): string | undefined {
    if (!cmd.indirectObject) return undefined;
    const item = inventorySystem.findInInventory(this.state, cmd.indirectObject);
    if (!item || item.equipSlot !== "mainHand") return undefined;
    if (this.state.player.equipment.mainHand === item.id) return undefined;
    inventorySystem.equip(this.state, item.id);
    return `You draw your ${item.name}.`;
  }

  private handleCast(cmd: ParsedCommand): CommandResult {
    if (!this.encounter) return { text: "There's nothing to cast a spell at.", turnConsumed: false };
    const def = getClass(this.state.player.class);
    const ability = def.abilities.find((a) => cmd.directObject && a.name.toLowerCase().includes(cmd.directObject.toLowerCase())) ?? def.abilities[0];
    if (!ability) return { text: "You don't know any spells.", turnConsumed: false };
    if (this.state.player.mana < ability.manaCost) return { text: "You don't have enough mana.", turnConsumed: false };
    this.state.player.mana -= ability.manaCost;
    return this.handleCombatTurn({ ...cmd, verb: "cast" }, ability.damage);
  }

  private handleCombatTurn(cmd: ParsedCommand, abilityDamage?: [number, number]): CommandResult {
    if (!this.encounter) return { text: "There's nothing to fight.", turnConsumed: false };
    const monster = this.getLiveMonster(this.encounter.monsterId)!;
    const loc = this.currentLocation();

    if (cmd.verb === "flee") {
      const result = combatSystem.attemptFlee();
      if (result.success) this.encounter = null;
      return { text: result.text, turnConsumed: true, kind: "combat" };
    }
    if (cmd.verb === "look") return this.describeEncounter();

    let equipMsg: string | undefined;
    if (cmd.verb === "attack") {
      equipMsg = this.maybeEquipForAttack(cmd);
    }

    const outcome = combatSystem.resolvePlayerAttack(this.state, monster, this.encounter.currentHealth, abilityDamage);
    if (equipMsg) outcome.lines.unshift(equipMsg);
    if (outcome.monsterDefeated) {
      const monsterId = this.encounter.monsterId;
      this.state.world.defeatedMonsters.add(`${loc.id}:${monsterId}`);
      const defeatFlag = `defeated_${monsterId}_at_${loc.id}`;
      this.state.world.flags.add(defeatFlag);
      this.state.score += Math.round(monster.xpReward / 4);
      outcome.lines.push(...questSystem.onFlagSet(this.state, defeatFlag));
      this.encounter = null;
    } else {
      this.encounter.currentHealth = Math.max(0, this.encounter.currentHealth - outcome.damageDealt);
    }
    if (outcome.playerDefeated) {
      return { text: [...outcome.lines, this.renderDefeat()].join("\n"), turnConsumed: true, kind: "combat" };
    }
    return { text: outcome.lines.join("\n"), turnConsumed: true, kind: "combat" };
  }

  private renderDefeat(): string {
    // Soft-fail: respawn at the starting village with a health penalty, no permadeath.
    this.state.player.currentLocationId = "village_square";
    this.state.player.health = Math.max(1, Math.round(this.state.player.maxHealth * 0.3));
    this.encounter = null;
    return [
      DEATH_BANNER,
      "",
      "You wake in the village square, wounds bound by someone you don't recognize. You live to try again.",
    ].join("\n");
  }

  // ---------------------------------------------------------------------
  // Meta / system commands
  // ---------------------------------------------------------------------

  private handleJournal(): CommandResult {
    if (!this.state.unlockedCommands.has("journal")) {
      return { text: "You have nothing to write in yet.", turnConsumed: false };
    }
    const entries = this.state.log
      .filter((l) => l.kind === "narration")
      .slice(-10)
      .map((l) => `Turn ${l.turn}: ${l.text.split("\n")[0]}`);
    return { text: entries.length ? entries.join("\n") : "Your journal is empty.", turnConsumed: false };
  }

  private handleMap(): CommandResult {
    if (!this.state.unlockedCommands.has("map")) {
      return { text: "You have no map. Perhaps you should draw one, if you had the means.", turnConsumed: false };
    }
    return { text: `${mapSystem.renderAscii(this.state)}\n\n${mapSystem.legend()}`, turnConsumed: false };
  }

  private handleLight(): CommandResult {
    const hasTorch = inventorySystem.hasItem(this.state, "torch") || inventorySystem.hasItem(this.state, "lantern");
    if (!hasTorch) return { text: "You have nothing to light.", turnConsumed: false };
    this.state.player.torchLit = true;
    return { text: "Your light source flares to life, pushing back the dark.", turnConsumed: true };
  }

  private handleRest(): CommandResult {
    const loc = this.currentLocation();
    if (!loc.isSafe) return { text: "This doesn't feel like a safe place to rest.", turnConsumed: false };
    return { text: characterSystem.rest(this.state), turnConsumed: true };
  }

  private handleSave(): CommandResult {
    saveSystem.saveToLocalStorage(this.state);
    return { text: "Game saved.", turnConsumed: false };
  }

  private renderStats(): string {
    const p = this.state.player;
    const s = p.stats;
    return [
      `${p.name} — Level ${p.level} ${p.class}`,
      `HP: ${p.health}/${p.maxHealth}   MP: ${p.mana}/${p.maxMana}   Gold: ${p.gold}`,
      `XP: ${p.xp}/${p.xpToNextLevel}`,
      `STR ${s.strength}  DEX ${s.dexterity}  WIS ${s.wisdom}  CON ${s.constitution}  INT ${s.intelligence}  CHA ${s.charisma}  LUCK ${s.luck}`,
    ].join("\n");
  }

  private renderScore(): string {
    const rank = getRank(this.state.score);
    const next = nextRankThreshold(this.state.score);
    const lines = [`Score: ${this.state.score} points. Rank: ${rank}.`];
    if (next !== null) lines.push(`(${next - this.state.score} points to the next rank.)`);
    if (this.state.world.trophyCase.length) {
      const names = this.state.world.trophyCase.map((id) => getItem(id)?.name ?? id);
      lines.push(`Trophy case: ${names.join(", ")}.`);
    } else {
      lines.push(`Trophy case: empty. (Bring treasures to the Village Square: put <item> in case)`);
    }
    return lines.join("\n");
  }

  private renderXyzzy(): string {
    return "A hollow voice says, \"Nice try.\" Nothing happens. (Some traditions are worth keeping.)";
  }

  /** A magic word older than this game — Colossal Cave Adventure's teleport-home easter egg. */
  private handlePlugh(): CommandResult {
    if (this.state.player.currentLocationId === "village_square") {
      return { text: "Nothing happens. (You're already home.)", turnConsumed: false };
    }
    this.state.player.currentLocationId = "village_square";
    mapSystem.revealNeighbors(this.state, "village_square");
    return {
      text: [
        "A word older than this world moves your feet before your mind catches up.",
        "",
        this.describeLocation(true),
      ].join("\n"),
      turnConsumed: true,
    };
  }

  private renderSwear(): string {
    const lines = [
      "You swear an oath that would make a sailor blush. Nothing happens, but you feel a little better.",
      "You curse the darkness, the damp, and whoever built stairs this steep. It doesn't help.",
      "You let out a word you learned from Old Tomas at the tavern. Somewhere, distantly, a goblin agrees.",
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  private renderSing(): string {
    if (this.state.player.class === "Bard") {
      return "You sing. For a moment, even the dark seems to be listening. (You feel faintly more inspired, if nothing else.)";
    }
    return "You attempt a tune. It goes about as well as you'd expect. Something in the dark politely does not comment.";
  }

  private renderDance(): string {
    return "You dance, alone, in the dark, several hundred feet underground. No one is impressed. You feel great, though.";
  }

  private renderCount(cmd: ParsedCommand): string {
    const noun = cmd.directObject ?? "things";
    const n = 10000 + Math.floor(Math.random() * 90000);
    return `You count. There are ${n.toLocaleString()} ${noun} here, which is of no value at all.`;
  }

  private renderZork(): string {
    return "That's a different game, in a different dungeon, in a different empire. This one's yours.";
  }

  private handleYell(): CommandResult {
    const loc = this.currentLocation();
    if (!this.encounter && loc.monsterIds?.some((id) => !this.state.world.defeatedMonsters.has(`${loc.id}:${id}`))) {
      const encounterText = this.maybeStartEncounter();
      if (encounterText) {
        return {
          text: ["You yell, loud enough to wake the dead — or worse, whatever's still alive down here.", "", encounterText].join("\n"),
          turnConsumed: true,
          kind: "combat",
        };
      }
    }
    return { text: "You yell. Your own echo is the only thing that answers.", turnConsumed: true };
  }

  private renderCompletion(): string {
    const c = getCompletion(this.state);
    return [
      `World completion: ${c.percent}%`,
      `  Locations explored: ${c.locationsVisited}/${c.totalLocations}`,
      `  Quests completed: ${c.questsCompleted}/${c.totalQuests}`,
      `  Monsters defeated: ${c.monstersDefeated}/${c.totalMonsters}`,
    ].join("\n");
  }

  private renderSpells(): string {
    const def = getClass(this.state.player.class);
    if (def.abilities.length === 0) {
      return `${this.state.player.class}s don't cast spells. Rely on your weapon and your wits (try: attack <target>).`;
    }
    const lines = def.abilities.map(
      (a) => `  ${a.name} — ${a.manaCost} MP — ${a.description} (cast ${a.name.toLowerCase()})`
    );
    return [`Known spells/abilities (you have ${this.state.player.mana}/${this.state.player.maxMana} MP):`, ...lines].join(
      "\n"
    );
  }

  private renderHelp(): string {
    return [
      "Common commands:",
      "  look, look <direction>, inspect <thing>, search",
      "  go <direction> (or just: north / n / south / s / east / e / west / w / up / down)",
      "  take <item>, drop <item>, put <item> in case, wear/equip <item>, inventory",
      "  attack <monster>, attack <monster> with <weapon>, cast <spell>, spells, flee",
      "  drink <potion>, eat <food>, use <item>",
      "  open/close/unlock/push/pull/read/pray/sit/climb/dig <feature>",
      "  talk <npc>, ask <npc> about <topic>, buy <item>",
      "  stats, quests, map, journal, rest, save, hint, completion, score",
    ].join("\n");
  }

  private renderHint(): string {
    if (!this.state.unlockedCommands.has("map") && this.state.world.flags.has("learned_map_lore")) {
      return "Hint: paper and something to write with might let you draw what you've explored.";
    }
    return "Hint: try `look`, `search`, or talk to people in the village — they know more than they say at first. (Also: some old adventuring traditions still work here, if you remember any magic words.)";
  }

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------

  private currentLocation() {
    const loc = world.getLocation(this.state.player.currentLocationId);
    if (!loc) throw new Error(`Player is in an unknown location: ${this.state.player.currentLocationId}`);
    return loc;
  }

  private locationHasItem(itemId: string): boolean {
    const loc = this.currentLocation();
    const overrides = this.state.world.locationItemOverrides[loc.id];
    if (overrides) return overrides.includes(itemId);
    return loc.itemIds?.includes(itemId) ?? false;
  }

  private removeItemFromLocation(itemId: string): void {
    const loc = this.currentLocation();
    const current = this.state.world.locationItemOverrides[loc.id] ?? [...(loc.itemIds ?? [])];
    this.state.world.locationItemOverrides[loc.id] = current.filter((id) => id !== itemId);
  }

  private addItemToLocation(itemId: string): void {
    const loc = this.currentLocation();
    const current = this.state.world.locationItemOverrides[loc.id] ?? [...(loc.itemIds ?? [])];
    this.state.world.locationItemOverrides[loc.id] = [...current, itemId];
  }

  private maybeUnlockCommand(itemId: string): string {
    const item = getItem(itemId);
    if (!item?.unlocksCommand) return "";
    if (this.state.unlockedCommands.has(item.unlocksCommand)) return "";
    this.state.unlockedCommands.add(item.unlocksCommand);
    if (item.unlocksCommand === "map") return "(You can now use the `map` command.)";
    if (item.unlocksCommand === "journal") return "(You can now use the `journal` command.)";
    return `(New command unlocked: ${item.unlocksCommand})`;
  }

  private describeLocation(isArrival: boolean): string {
    const loc = this.currentLocation();
    const alreadyVisited = this.state.world.visitedLocationIds.has(loc.id);
    mapSystem.revealNeighbors(this.state, loc.id);

    const heading = `== ${loc.name} ==`;
    const body = !alreadyVisited || !isArrival ? loc.longDescription : loc.shortDescription;
    const itemsHere = this.state.world.locationItemOverrides[loc.id] ?? loc.itemIds ?? [];
    const itemLines = itemsHere.length
      ? `You see: ${itemsHere.map((id) => getItem(id)?.name ?? id).join(", ")}.`
      : "";
    const monsterLines = (loc.monsterIds ?? [])
      .map((id) => {
        const defeated = this.state.world.defeatedMonsters.has(`${loc.id}:${id}`);
        const monster = getMonster(id);
        if (!monster) return null;
        if (defeated) return `The remains of a ${monster.name} lie here.`;
        if (this.encounter?.monsterId === id) return null; // already announced by the encounter line
        return `A ${monster.name} is here.`;
      })
      .filter((l): l is string => Boolean(l));
    const exits = world.visibleExits(loc, this.state).map((e) => e.direction);
    const exitLine = exits.length ? `Exits: ${exits.join(", ")}.` : "There are no obvious exits.";
    const darkWarning = loc.isDark && !this.state.player.torchLit ? "It's too dark to see much. (try: light torch)" : "";

    return [heading, body, itemLines, ...monsterLines, darkWarning, exitLine].filter(Boolean).join("\n");
  }
}
