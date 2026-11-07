import { useCallback, useMemo, useState } from "react";
import type { Difficulty, GameState, PlayerClass } from "@/types";
import { createNewGame } from "@/engine/GameState";
import { GameEngine } from "@/engine/GameEngine";
import { world } from "@/world/World";
import { CharacterCreation } from "@/ui/CharacterCreation";
import { StatusBar } from "@/ui/StatusBar";
import { Terminal } from "@/ui/Terminal";
import { Sidebar } from "@/ui/Sidebar";
import { saveSystem } from "@/systems/save/SaveSystem";
import { useViewportHeight } from "@/ui/useViewportHeight";
import { useMobileScreenControl } from "@/ui/useMobileScreenControl";

const INTRO_TEXT =
  "You have no map.\n\nThe village of Millbrook is quiet around you. Somewhere south, " +
  "the road gives way to forest, and the forest gives way to something older.\n\n" +
  "Type `help` for commands, or just start with `look`.";

function ScreenControls({ screen }: { screen: ReturnType<typeof useMobileScreenControl> }) {
  if (!screen.canInstall && !screen.canFullscreen) return null;
  return (
    <div className="pointer-events-none absolute right-2 top-2 z-20 flex gap-2">
      {screen.canInstall && (
        <button
          onClick={screen.promptInstall}
          className="pointer-events-auto border border-crt-amber bg-crt-panel px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-crt-amber hover:bg-crt-amberDim/30"
        >
          📱 Install app
        </button>
      )}
      {screen.canFullscreen && (
        <button
          onClick={screen.toggleFullscreen}
          className="pointer-events-auto border border-crt-amberDim/50 bg-crt-panel px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-crt-amberDim hover:text-crt-amber"
        >
          {screen.isFullscreen ? "⤢ Exit fullscreen" : "⛶ Fullscreen"}
        </button>
      )}
    </div>
  );
}

export default function App() {
  useViewportHeight();
  const screen = useMobileScreenControl();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [engine, setEngine] = useState<GameEngine | null>(null);

  const startGame = useCallback((name: string, playerClass: PlayerClass, difficulty: Difficulty) => {
    const state = createNewGame(name, playerClass, difficulty);
    const difficultyLabel = difficulty === "normal" ? "" : ` (${difficulty} difficulty)`;
    state.log.push({ turn: 0, text: `Welcome, ${name} the ${playerClass}${difficultyLabel}.`, kind: "system" });
    state.log.push({ turn: 0, text: INTRO_TEXT, kind: "narration" });
    const loc = world.getLocation(state.player.currentLocationId);
    if (loc) {
      state.log.push({
        turn: 0,
        text: `== ${loc.name} ==\n${loc.longDescription}`,
        kind: "narration",
      });
    }
    const newEngine = new GameEngine(state);
    setEngine(newEngine);
    setGameState({ ...state });
  }, []);

  const handleCommand = useCallback(
    (input: string) => {
      if (!engine) return;
      engine.execute(input);
      const latest = engine.getState();
      setGameState({ ...latest });
      saveSystem.saveToLocalStorage(latest);
    },
    [engine]
  );

  const handleLoadState = useCallback((loaded: GameState) => {
    const newEngine = new GameEngine(loaded);
    setEngine(newEngine);
    setGameState({ ...loaded });
  }, []);

  const autoLoadIfAvailable = useMemo(() => saveSystem.hasLocalSave(), []);

  if (!gameState || !engine) {
    return (
      <div className="relative overflow-hidden bg-crt-bg" style={{ height: "var(--app-height, 100dvh)", paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)", paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)" }}>
        <div className="crt-overlay" />
        <div className="crt-vignette" />
        <ScreenControls screen={screen} />
        {autoLoadIfAvailable && (
          <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center px-4">
            <button
              className="pointer-events-auto border border-crt-amber bg-crt-panel px-4 py-2 font-mono text-xs uppercase tracking-widest text-crt-amber hover:bg-crt-amberDim/30"
              onClick={() => {
                const loaded = saveSystem.loadFromLocalStorage();
                if (loaded) handleLoadState(loaded);
              }}
            >
              ▶ Continue saved game
            </button>
          </div>
        )}
        <CharacterCreation onCreate={startGame} />
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden bg-crt-bg p-3 sm:p-4"
      style={{ height: "var(--app-height, 100dvh)", paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)", paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)" }}
    >
      <div className="crt-overlay" />
      <div className="crt-vignette" />
      <ScreenControls screen={screen} />
      <div className="mx-auto flex h-full max-w-6xl flex-col gap-3">
        <StatusBar state={gameState} />
        <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden md:grid-cols-[1fr_320px]">
          <Terminal
            log={gameState.log}
            onSubmit={handleCommand}
            currentRegion={world.getLocation(gameState.player.currentLocationId)?.region ?? "village"}
          />
          <Sidebar state={gameState} onCommand={handleCommand} onLoadState={handleLoadState} />
        </div>
      </div>
    </div>
  );
}
