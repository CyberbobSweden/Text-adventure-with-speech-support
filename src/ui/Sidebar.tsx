import { useState } from "react";
import type { GameState } from "@/types";
import { inventorySystem } from "@/systems/inventory/InventorySystem";
import { questSystem } from "@/systems/quests/QuestSystem";
import { mapSystem } from "@/systems/map/MapSystem";
import { getItem } from "@/entities/items";
import { saveSystem } from "@/systems/save/SaveSystem";
import { getCompletion } from "@/systems/progress/ProgressSystem";

type Tab = "inventory" | "character" | "quests" | "map" | "save";

interface Props {
  state: GameState;
  onCommand: (cmd: string) => void;
  onLoadState: (state: GameState) => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "inventory", label: "Inventory" },
  { id: "character", label: "Character" },
  { id: "quests", label: "Quests" },
  { id: "map", label: "Map" },
  { id: "save", label: "Save" },
];

export function Sidebar({ state, onCommand, onLoadState }: Props) {
  const [tab, setTab] = useState<Tab>("inventory");

  return (
    <div className="flex h-full flex-col border border-crt-amberDim/50 bg-crt-panel/60 font-mono text-crt-amber">
      <div className="flex flex-wrap border-b border-crt-amberDim/40 text-xs">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-2 py-2 uppercase tracking-wide transition-colors ${
              tab === t.id ? "bg-crt-amberDim/30 text-crt-amber" : "text-crt-amberDim hover:text-crt-amber"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 text-sm">
        {tab === "inventory" && <InventoryPanel state={state} onCommand={onCommand} />}
        {tab === "character" && <CharacterPanel state={state} />}
        {tab === "quests" && <QuestPanel state={state} />}
        {tab === "map" && <MapPanel state={state} />}
        {tab === "save" && <SavePanel state={state} onLoadState={onLoadState} />}
      </div>
    </div>
  );
}

function InventoryPanel({ state, onCommand }: { state: GameState; onCommand: (cmd: string) => void }) {
  if (state.player.inventory.length === 0) {
    return <p className="opacity-70">Your pack is empty.</p>;
  }
  return (
    <ul className="space-y-2">
      {state.player.inventory.map((slot) => {
        const item = getItem(slot.itemId);
        if (!item) return null;
        const equipped = Object.values(state.player.equipment).includes(slot.itemId);
        return (
          <li key={slot.itemId} className="border-b border-crt-amberDim/20 pb-2">
            <div className="flex items-center justify-between">
              <span>
                {item.name}
                {item.stackable && slot.quantity > 1 ? ` x${slot.quantity}` : ""}
              </span>
              {equipped && <span className="text-[10px] text-crt-green">EQUIPPED</span>}
            </div>
            <div className="mt-1 flex gap-2 text-[10px] text-crt-amberDim">
              {item.equipSlot && (
                <button className="hover:text-crt-amber" onClick={() => onCommand(`equip ${item.name}`)}>
                  equip
                </button>
              )}
              {(item.type === "potion" || item.type === "food") && (
                <button
                  className="hover:text-crt-amber"
                  onClick={() => onCommand(`${item.type === "potion" ? "drink" : "eat"} ${item.name}`)}
                >
                  use
                </button>
              )}
              <button className="hover:text-crt-amber" onClick={() => onCommand(`drop ${item.name}`)}>
                drop
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function CharacterPanel({ state }: { state: GameState }) {
  const p = state.player;
  const s = p.stats;
  const completion = getCompletion(state);
  return (
    <div className="space-y-3">
      <div>
        <div className="text-base">{p.name}</div>
        <div className="text-xs opacity-70">
          Level {p.level} {p.class} · {state.difficulty}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        {Object.entries(s).map(([key, value]) => (
          <div key={key} className="flex justify-between border-b border-crt-amberDim/20 py-1">
            <span className="uppercase opacity-70">{key.slice(0, 3)}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
      <div className="text-xs opacity-70">
        XP {p.xp} / {p.xpToNextLevel}
      </div>
      <div className="border-t border-crt-amberDim/20 pt-2">
        <div className="mb-1 flex justify-between text-xs">
          <span className="opacity-70">World completion</span>
          <span>{completion.percent}%</span>
        </div>
        <div className="h-1.5 w-full border border-crt-amberDim/40 bg-crt-panel">
          <div
            className="h-full bg-crt-green"
            style={{ width: `${completion.percent}%` }}
          />
        </div>
        <div className="mt-2 space-y-0.5 text-[10px] opacity-60">
          <div>Locations: {completion.locationsVisited}/{completion.totalLocations}</div>
          <div>Quests: {completion.questsCompleted}/{completion.totalQuests}</div>
          <div>Monsters defeated: {completion.monstersDefeated}/{completion.totalMonsters}</div>
        </div>
      </div>
    </div>
  );
}

function QuestPanel({ state }: { state: GameState }) {
  const text = questSystem.listDescription(state);
  return <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{text}</pre>;
}

function MapPanel({ state }: { state: GameState }) {
  if (!state.unlockedCommands.has("map")) {
    return <p className="opacity-70">You have no map yet. Find something to draw one with.</p>;
  }
  return (
    <pre className="whitespace-pre-wrap font-mono text-[10px] leading-tight sm:text-xs">
      {mapSystem.renderAscii(state)}
      {"\n\n"}
      {mapSystem.legend()}
    </pre>
  );
}

function SavePanel({ state, onLoadState }: { state: GameState; onLoadState: (s: GameState) => void }) {
  const completion = getCompletion(state);
  return (
    <div className="space-y-3 text-xs">
      <div className="border border-crt-amberDim/40 p-3">
        <div className="mb-1 flex justify-between">
          <span className="opacity-70">World completion</span>
          <span className="text-crt-green">{completion.percent}%</span>
        </div>
        <div className="h-1.5 w-full border border-crt-amberDim/40 bg-crt-panel">
          <div className="h-full bg-crt-green" style={{ width: `${completion.percent}%` }} />
        </div>
      </div>
      <button
        className="w-full border border-crt-amberDim/50 px-3 py-2 hover:bg-crt-amberDim/20"
        onClick={() => saveSystem.saveToLocalStorage(state)}
      >
        Save to browser
      </button>
      <button
        className="w-full border border-crt-amberDim/50 px-3 py-2 hover:bg-crt-amberDim/20 disabled:opacity-40"
        disabled={!saveSystem.hasLocalSave()}
        onClick={() => {
          const loaded = saveSystem.loadFromLocalStorage();
          if (loaded) onLoadState(loaded);
        }}
      >
        Load from browser
      </button>
      <button
        className="w-full border border-crt-amberDim/50 px-3 py-2 hover:bg-crt-amberDim/20"
        onClick={() => saveSystem.downloadAsFile(state)}
      >
        Download save file (.json)
      </button>
      <label className="block w-full cursor-pointer border border-crt-amberDim/50 px-3 py-2 text-center hover:bg-crt-amberDim/20">
        Load save file…
        <input
          type="file"
          accept="application/json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const loaded = await saveSystem.loadFromUploadedFile(file);
            onLoadState(loaded);
          }}
        />
      </label>
    </div>
  );
}
