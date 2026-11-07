import { useCallback, useEffect, useRef, useState } from "react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { SpeechRecognition as NativeSpeech } from "@capacitor-community/speech-recognition";

export interface VoiceControl {
  supported: boolean;
  listening: boolean;
  handsFree: boolean;
  toggleHandsFree: () => void;
  listenOnce: () => void;
  /** Re-open the mic if (and only if) hands-free is still on. Safe to call from stale closures. */
  resumeListening: () => void;
  speak: (text: string, onDone?: () => void) => void;
  stopSpeaking: () => void;
}

/** The game is written in English, so both recognition and TTS use English. */
const VOICE_LANG = "en-US";
const RESTART_DELAY_MS = 600;
const WATCHDOG_MS = 4000;

/** Android foreground microphone service (see android/.../VoiceServicePlugin.java). */
interface VoiceServicePlugin {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  requestNotificationPermission: () => Promise<void>;
}
const VoiceService = registerPlugin<VoiceServicePlugin>("VoiceService");
const IS_NATIVE = Capacitor.isNativePlatform();

interface WakeLockSentinelLike {
  release: () => Promise<void>;
}

/**
 * Speech-to-text (Web Speech API `SpeechRecognition`) and text-to-speech
 * (`SpeechSynthesis`), wired into a hands-free loop:
 *   listen -> submit -> speak the response -> listen again.
 *
 * Designed for phone + Bluetooth headset / smart glasses (e.g. Meta Ray-Ban):
 *  - never opens the mic while the game is speaking (otherwise it hears itself),
 *  - keeps the screen awake while hands-free is on (Wake Lock API),
 *  - restarts recognition after silence / transient errors,
 *  - a watchdog restarts listening if nothing ended up being spoken,
 *  - skips ASCII-art banners when reading aloud.
 *
 * Compatibility: good on Android Chrome and desktop Chrome. iOS Safari's Web
 * Speech support is limited/unreliable, and locked-down in-car browsers may
 * disable the microphone. Voice controls are hidden when unsupported.
 */
export function useVoiceControl(onCommand: (text: string) => void): VoiceControl {
  const [supported] = useState(
    () =>
      IS_NATIVE ||
      (typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition))
  );
  const [listening, setListening] = useState(false);
  const [handsFree, setHandsFree] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const handsFreeRef = useRef(false);
  const listeningRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nativeSessionRef = useRef(0);
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);
  const onCommandRef = useRef(onCommand);

  useEffect(() => {
    onCommandRef.current = onCommand;
  }, [onCommand]);

  const setListeningBoth = useCallback((value: boolean) => {
    listeningRef.current = value;
    setListening(value);
  }, []);

  const clearTimers = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  // --- Screen wake lock -----------------------------------------------------
  const acquireWakeLock = useCallback(async () => {
    try {
      const nav = navigator as Navigator & {
        wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
      };
      if (!nav.wakeLock || wakeLockRef.current) return;
      wakeLockRef.current = await nav.wakeLock.request("screen");
    } catch {
      wakeLockRef.current = null;
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    const lock = wakeLockRef.current;
    wakeLockRef.current = null;
    lock?.release().catch(() => undefined);
  }, []);

  useEffect(() => {
    // The browser drops the lock when the tab is hidden; take it back on return.
    const onVisibility = () => {
      if (document.visibilityState === "visible" && handsFreeRef.current) {
        wakeLockRef.current = null;
        void acquireWakeLock();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimers();
      releaseWakeLock();
    };
  }, [acquireWakeLock, releaseWakeLock, clearTimers]);

  // --- Recognition ----------------------------------------------------------
  const isSpeaking = () =>
    typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking;

  const listenOnce = useCallback(() => {
    if (!supported) return;
    clearTimers();

    // Don't open the mic while the game is talking — it would transcribe itself.
    if (isSpeaking()) {
      if (handsFreeRef.current) {
        restartTimerRef.current = setTimeout(() => listenOnce(), 400);
      }
      return;
    }
    if (listeningRef.current) return;

    if (IS_NATIVE) {
      const session = ++nativeSessionRef.current;
      let gotResult = false;
      setListeningBoth(true);
      NativeSpeech.start({ language: VOICE_LANG, maxResults: 1, partialResults: false, popup: false })
        .then((res) => {
          const transcript = res?.matches?.[0]?.trim();
          if (transcript && session === nativeSessionRef.current) {
            gotResult = true;
            onCommandRef.current(transcript);
            if (handsFreeRef.current) {
              watchdogRef.current = setTimeout(() => {
                if (handsFreeRef.current && !isSpeaking() && !listeningRef.current) listenOnce();
              }, WATCHDOG_MS);
            }
          }
        })
        .catch(() => undefined)
        .finally(() => {
          if (session !== nativeSessionRef.current) return; // stale session
          setListeningBoth(false);
          if (!gotResult && handsFreeRef.current && !restartTimerRef.current) {
            restartTimerRef.current = setTimeout(() => listenOnce(), RESTART_DELAY_MS);
          }
        });
      return;
    }

    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = VOICE_LANG;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    let gotResult = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1]?.[0]?.transcript;
      if (transcript?.trim()) {
        gotResult = true;
        onCommandRef.current(transcript.trim());
        // Watchdog: normally the response gets spoken and that restarts the
        // mic. If nothing is spoken (empty response, TTS failure), restart anyway.
        if (handsFreeRef.current) {
          watchdogRef.current = setTimeout(() => {
            if (handsFreeRef.current && !isSpeaking() && !listeningRef.current) listenOnce();
          }, WATCHDOG_MS);
        }
      }
    };

    recognition.onerror = (event) => {
      if (recognitionRef.current !== recognition) return; // stale session
      setListeningBoth(false);
      const fatal =
        event.error === "not-allowed" || event.error === "service-not-allowed" || event.error === "aborted";
      if (!fatal && handsFreeRef.current) {
        restartTimerRef.current = setTimeout(() => listenOnce(), RESTART_DELAY_MS);
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current !== recognition) return; // stale session
      setListeningBoth(false);
      // Silence / timeout with no result: keep the loop alive.
      if (!gotResult && handsFreeRef.current && !restartTimerRef.current) {
        restartTimerRef.current = setTimeout(() => listenOnce(), RESTART_DELAY_MS);
      }
    };

    setListeningBoth(true);
    try {
      recognition.start();
    } catch {
      setListeningBoth(false);
    }
  }, [supported, clearTimers, setListeningBoth]);

  const resumeListening = useCallback(() => {
    if (handsFreeRef.current) listenOnce();
  }, [listenOnce]);

  // --- Speech output --------------------------------------------------------
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback((text: string, onDone?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onDone?.();
      return;
    }
    // Drop lines that are mostly symbols (ASCII-art banners, rules, box drawing).
    const lines = text.split("\n").filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      const letters = (trimmed.match(/[A-Za-z]/g) ?? []).length;
      return letters / trimmed.length > 0.5;
    });
    const clean = lines
      .join("\n")
      .replace(/[=_*`#|]/g, "")
      .replace(/\n+/g, ". ")
      .slice(0, 600);
    if (!clean.trim()) {
      onDone?.();
      return;
    }
    // Close the mic while talking so the game doesn't hear itself.
    if (listeningRef.current) {
      if (IS_NATIVE) {
        nativeSessionRef.current++;
        void NativeSpeech.stop().catch(() => undefined);
      }
      recognitionRef.current?.abort();
      listeningRef.current = false;
      setListening(false);
    }
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = VOICE_LANG;
    utterance.rate = 1.05;
    utterance.onend = () => onDone?.();
    utterance.onerror = () => onDone?.();
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  // --- Hands-free toggle ----------------------------------------------------
  const toggleHandsFree = useCallback(() => {
    const next = !handsFreeRef.current;
    handsFreeRef.current = next;
    setHandsFree(next);
    if (next) {
      if (IS_NATIVE) {
        // Ask for mic + notification permission, then start the foreground
        // service that keeps listening alive with the screen locked.
        void (async () => {
          try {
            await NativeSpeech.requestPermissions();
            await VoiceService.requestNotificationPermission();
            await VoiceService.start();
          } catch {
            /* service is best-effort; recognition still works with screen on */
          }
          if (handsFreeRef.current) listenOnce();
        })();
      } else {
        void acquireWakeLock();
        listenOnce();
      }
    } else {
      clearTimers();
      stopSpeaking();
      if (IS_NATIVE) {
        nativeSessionRef.current++;
        void NativeSpeech.stop().catch(() => undefined);
        void VoiceService.stop().catch(() => undefined);
      }
      recognitionRef.current?.abort();
      setListeningBoth(false);
      releaseWakeLock();
    }
  }, [acquireWakeLock, releaseWakeLock, clearTimers, listenOnce, stopSpeaking, setListeningBoth]);

  return { supported, listening, handsFree, toggleHandsFree, listenOnce, resumeListening, speak, stopSpeaking };
}
