import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface MobileScreenControl {
  /** True once the browser has offered an installable-app prompt (mainly Android Chrome). */
  canInstall: boolean;
  /** Triggers the native "Add to Home Screen" prompt. */
  promptInstall: () => void;
  /** True if already running installed, with no browser chrome. */
  isStandalone: boolean;
  /** True if the Fullscreen API is available (mainly Android Chrome in a plain tab; not iOS Safari). */
  canFullscreen: boolean;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

/**
 * A plain browser tab can never fully hide its address bar/system UI —
 * that's a genuine platform limitation, not something a web page can
 * override. There are exactly two real ways to get a chrome-less,
 * full-screen game view on mobile:
 *
 * 1. Install as a PWA ("Add to Home Screen"). Once launched from the home
 *    screen icon, `display: fullscreen` in the manifest takes over
 *    completely — no address bar, no nav bar, ever. This is the real fix.
 * 2. The Fullscreen API (`requestFullscreen`), which works in a plain
 *    Android Chrome tab (hides the system nav bar) but is NOT supported
 *    by iOS Safari outside of installed PWAs — Apple simply doesn't
 *    expose it there. So this is a nice-to-have fallback, not a
 *    guarantee, and the hook hides the button entirely where it can't work.
 */
export function useMobileScreenControl(): MobileScreenControl {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const isStandalone =
    typeof window !== "undefined" &&
    (window.matchMedia?.("(display-mode: fullscreen)").matches ||
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari's own flag for "launched from home screen"
      (navigator as unknown as { standalone?: boolean }).standalone === true);

  const promptInstall = useCallback(() => {
    if (!installEvent) return;
    installEvent.prompt();
    installEvent.userChoice.finally(() => setInstallEvent(null));
  }, [installEvent]);

  const canFullscreen = typeof document !== "undefined" && Boolean(document.documentElement.requestFullscreen);

  const toggleFullscreen = useCallback(() => {
    if (!canFullscreen) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    } else {
      document.documentElement.requestFullscreen().catch(() => undefined);
    }
  }, [canFullscreen]);

  return {
    canInstall: Boolean(installEvent) && !isStandalone,
    promptInstall,
    isStandalone: Boolean(isStandalone),
    canFullscreen: canFullscreen && !isStandalone,
    isFullscreen,
    toggleFullscreen,
  };
}
