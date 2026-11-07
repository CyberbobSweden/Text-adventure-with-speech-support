import { useState } from "react";
import type { Difficulty, PlayerClass } from "@/types";
import { CLASSES } from "@/data/classes";
import { TITLE_BANNER } from "@/data/asciiArt";

interface Props {
  onCreate: (name: string, playerClass: PlayerClass, difficulty: Difficulty) => void;
}

const DIFFICULTIES: { id: Difficulty; label: string; description: string }[] = [
  { id: "easy", label: "Easy", description: "Softer monsters, more forgiving XP. Good for exploring the story." },
  { id: "normal", label: "Normal", description: "The world as designed. Real risk, real reward." },
  { id: "hard", label: "Hard", description: "Tougher monsters, bigger XP payoff. For people who read the Hints file for fun." },
];

export function CharacterCreation({ onCreate }: Props) {
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<PlayerClass | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");

  return (
    <div className="flex h-full w-full items-center justify-center overflow-y-auto p-4">
      <div className="w-full max-w-2xl border border-crt-amberDim/50 bg-crt-panel/60 p-6 font-mono text-crt-amber">
        <pre className="mb-1 overflow-x-auto text-center text-[7px] leading-tight opacity-90 sm:text-[10px]">
          {TITLE_BANNER}
        </pre>
        <p className="mb-6 text-center text-[10px] uppercase tracking-[0.3em] opacity-50">
          a retro text adventure
        </p>
        <p className="mb-6 text-sm opacity-80">
          No map. No journal. Just a torch, a class, and whatever's down there.
        </p>

        <label className="mb-1 block text-xs uppercase tracking-wide opacity-70">Your name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          placeholder="Enter your name…"
          className="mb-6 w-full border border-crt-amberDim/50 bg-transparent px-3 py-2 outline-none placeholder:text-crt-amberDim focus:border-crt-amber"
        />

        <label className="mb-2 block text-xs uppercase tracking-wide opacity-70">Choose your class</label>
        <div className="mb-6 grid max-h-64 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
          {(Object.keys(CLASSES) as PlayerClass[]).map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`border px-2 py-2 text-left text-xs transition-colors ${
                selectedClass === cls
                  ? "border-crt-amber bg-crt-amberDim/30"
                  : "border-crt-amberDim/40 hover:border-crt-amber"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {selectedClass && (
          <p className="mb-6 text-xs italic opacity-70">{CLASSES[selectedClass].description}</p>
        )}

        <label className="mb-2 block text-xs uppercase tracking-wide opacity-70">Difficulty</label>
        <div className="mb-2 grid grid-cols-3 gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              className={`border px-2 py-2 text-xs uppercase tracking-wide transition-colors ${
                difficulty === d.id
                  ? "border-crt-amber bg-crt-amberDim/30"
                  : "border-crt-amberDim/40 hover:border-crt-amber"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="mb-6 text-xs italic opacity-70">
          {DIFFICULTIES.find((d) => d.id === difficulty)?.description}
        </p>

        <button
          disabled={!name.trim() || !selectedClass}
          onClick={() => selectedClass && onCreate(name.trim(), selectedClass, difficulty)}
          className="w-full border border-crt-amber px-4 py-3 uppercase tracking-widest text-crt-amber transition-colors hover:bg-crt-amberDim/30 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Begin
        </button>
      </div>
    </div>
  );
}
