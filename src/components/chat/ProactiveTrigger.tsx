"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "elev8_va_triggered";

/** Delay in ms before the proactive greeting fires for a given path, or null to never fire.
 * `/checkout` fires after 60s of idle (no mouse/key activity) rather than a flat timer. */
function getTriggerConfig(pathname: string): { delayMs: number; idle?: boolean } | null {
  if (pathname === "/") return { delayMs: 30_000 };
  if (pathname.startsWith("/shop")) return { delayMs: 20_000 };
  if (pathname.startsWith("/wellness")) return { delayMs: 0 };
  if (pathname === "/checkout") return { delayMs: 60_000, idle: true };
  if (pathname.startsWith("/courses")) return { delayMs: 45_000 };
  if (pathname.startsWith("/blogs")) return null;
  return null;
}

export default function ProactiveTrigger({
  onTrigger,
  chatOpen,
}: {
  onTrigger: () => void;
  chatOpen: boolean;
}) {
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!pathname) return;

    let alreadyTriggered = false;
    try {
      alreadyTriggered = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // sessionStorage unavailable (private mode, etc.) — treat as not-yet-triggered.
    }
    if (alreadyTriggered || firedRef.current) return;

    const config = getTriggerConfig(pathname);
    if (!config) return;

    function fire() {
      if (firedRef.current || chatOpen) return;
      firedRef.current = true;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Best-effort only.
      }
      onTrigger();
    }

    const delayMs = config.delayMs;
    function resetIdleTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(fire, delayMs);
    }

    if (config.idle) {
      resetIdleTimer();
      const events = ["mousemove", "keydown", "scroll", "touchstart"];
      events.forEach((evt) => window.addEventListener(evt, resetIdleTimer, { passive: true }));
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        events.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
      };
    }

    timerRef.current = setTimeout(fire, config.delayMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
