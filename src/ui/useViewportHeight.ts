import { useEffect } from "react";

/**
 * Mobile/embedded browsers (including car webviews) are inconsistent about
 * how `100vh` behaves once the on-screen keyboard opens — some shrink the
 * visual viewport without firing a resize on `window`, which is exactly
 * what caused the input bar to end up hidden below the fold. This hook
 * sets a `--app-height` CSS variable from `visualViewport` (falling back
 * to `window.innerHeight`) and keeps it in sync, so layouts using
 * `height: var(--app-height)` always match what's actually visible.
 */
export function useViewportHeight(): void {
  useEffect(() => {
    const setHeight = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${height}px`);
    };

    setHeight();
    window.visualViewport?.addEventListener("resize", setHeight);
    window.addEventListener("resize", setHeight);
    window.addEventListener("orientationchange", setHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", setHeight);
      window.removeEventListener("resize", setHeight);
      window.removeEventListener("orientationchange", setHeight);
    };
  }, []);
}
