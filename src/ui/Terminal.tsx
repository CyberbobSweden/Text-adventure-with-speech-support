import { useEffect, useRef, useState } from "react";
import type { LogEntry, Region } from "@/types";
import { useVoiceControl } from "@/ui/useVoiceControl";
import { ambientAudio } from "@/systems/audio/AmbientAudioSystem";

interface Props {
  log: LogEntry[];
  onSubmit: (input: string) => void;
  currentRegion: Region;
}

const KIND_COLOR: Record<LogEntry["kind"], string> = {
  narration: "text-crt-amber",
  command_echo: "text-crt-amberDim",
  system: "text-crt-blue",
  combat: "text-crt-red",
  dialogue: "text-crt-green",
};

export function Terminal({ log, onSubmit, currentRegion }: Props) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRowRef = useRef<HTMLDivElement>(null);
  const lastSpokenTurn = useRef<number>(-1);

  function runCommand(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setHistory((h) => [...h, trimmed]);
    setHistoryIdx(null);
    setInput("");
  }

  const voice = useVoiceControl((transcript) => runCommand(transcript));

  useEffect(() => {
    if (voice.listening) ambientAudio.duck();
    else ambientAudio.unduck();
  }, [voice.listening]);

  useEffect(() => {
    ambientAudio.setVolume(soundOn ? 0.35 : 0);
  }, [soundOn]);

  useEffect(() => {
    if (soundOn) ambientAudio.setRegion(currentRegion);
  }, [soundOn, currentRegion]);

  // Hands-free loop: whenever a new response lands while hands-free mode
  // is on, read it aloud, then start listening again automatically.
  useEffect(() => {
    if (!voice.handsFree) return;
    const last = log[log.length - 1];
    if (!last || last.turn === lastSpokenTurn.current) return;
    lastSpokenTurn.current = last.turn;
    voice.speak(last.text, () => voice.resumeListening());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log, voice.handsFree]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [log]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // When the on-screen keyboard opens, the visible viewport shrinks. Make sure
  // the input row (and not just the log) stays on-screen instead of sliding
  // out from under the keyboard.
  useEffect(() => {
    const scrollInputIntoView = () => {
      inputRowRef.current?.scrollIntoView({ block: "end" });
    };
    window.visualViewport?.addEventListener("resize", scrollInputIntoView);
    return () => window.visualViewport?.removeEventListener("resize", scrollInputIntoView);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInput(history[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === null) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(null);
        setInput("");
      } else {
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    }
  }

  return (
    <div
      className="flex h-full flex-col border border-crt-amberDim/50 bg-crt-panel/60"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 text-sm leading-relaxed">
        {log.map((entry, i) => (
          <pre
            key={i}
            className={`mb-3 whitespace-pre-wrap font-mono ${KIND_COLOR[entry.kind]} animate-flicker`}
          >
            {entry.text}
          </pre>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-crt-amberDim/40 px-4 py-2 text-[10px] uppercase tracking-widest">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!ambientAudio.isEnabled) ambientAudio.init();
            setSoundOn((prev) => !prev);
          }}
          className={`border px-2 py-1 font-mono ${
            soundOn ? "border-crt-green text-crt-green" : "border-crt-amberDim/50 text-crt-amberDim hover:text-crt-amber"
          }`}
        >
          {soundOn ? "🔊 Sound ON" : "🔈 Sound OFF"}
        </button>
        {voice.supported && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                voice.listenOnce();
              }}
              disabled={voice.listening || voice.handsFree}
              className={`border px-2 py-1 font-mono ${
                voice.listening ? "border-crt-red text-crt-red" : "border-crt-amberDim/50 text-crt-amberDim hover:text-crt-amber"
              } disabled:opacity-40`}
            >
              {voice.listening ? "● Listening…" : "🎤 Voice"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                voice.toggleHandsFree();
              }}
              className={`border px-2 py-1 font-mono ${
                voice.handsFree ? "border-crt-green text-crt-green" : "border-crt-amberDim/50 text-crt-amberDim hover:text-crt-amber"
              }`}
            >
              {voice.handsFree ? "🔊 Hands-free ON" : "Hands-free (driving mode)"}
            </button>
          </>
        )}
      </div>
      <div ref={inputRowRef} className="flex items-center gap-2 border-t border-crt-amberDim/40 px-4 py-3">
        <span className="text-crt-amber">{">"}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent font-mono text-crt-amber outline-none placeholder:text-crt-amberDim"
          placeholder="type a command… (try: look)"
          autoComplete="off"
          spellCheck={false}
        />
        <span className="h-4 w-2 animate-blink bg-crt-amber" />
      </div>
    </div>
  );
}
