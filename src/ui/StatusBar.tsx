import type { GameState } from "@/types";
import { world } from "@/world/World";

interface Props {
  state: GameState;
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-1.5 w-full bg-crt-panel border border-crt-amberDim/40">
      <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

export function StatusBar({ state }: Props) {
  const loc = world.getLocation(state.player.currentLocationId);
  const p = state.player;

  return (
    <div className="border border-crt-amberDim/50 bg-crt-panel/60 px-4 py-3 font-mono text-crt-amber">
      <div className="flex items-baseline justify-between text-xs tracking-widest opacity-80">
        <span>DARK PASSAGES</span>
        <span>TURN {state.turnCount}</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <div className="flex justify-between text-xs">
            <span>HP</span>
            <span>{p.health}/{p.maxHealth}</span>
          </div>
          <Bar value={p.health} max={p.maxHealth} color="#ff4d4d" />
        </div>
        <div>
          <div className="flex justify-between text-xs">
            <span>MP</span>
            <span>{p.mana}/{p.maxMana}</span>
          </div>
          <Bar value={p.mana} max={p.maxMana} color="#5fb3ff" />
        </div>
        <div className="text-xs">
          <div className="opacity-70">GOLD</div>
          <div className="text-sm">{p.gold}</div>
        </div>
        <div className="text-xs">
          <div className="opacity-70">LOCATION</div>
          <div className="truncate text-sm">{loc?.name ?? "Unknown"}</div>
        </div>
      </div>
    </div>
  );
}
