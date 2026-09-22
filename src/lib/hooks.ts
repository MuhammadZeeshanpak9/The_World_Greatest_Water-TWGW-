"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Tracks vertical scroll position (throttled via rAF). */
export function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return scrollY;
}

/** True when viewport width is below `breakpoint` (default 768). */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

/** True when the viewport should get "phone" full-screen/keyboard-aware
 * chat treatment — width alone (as plain `useIsMobile` checks) misses
 * landscape phones: a 667x375 or 844x390 viewport is wider than a typical
 * portrait `sm` breakpoint but still far too short for a fixed-size desktop
 * popover, which ends up taller than the viewport and pushes its header
 * off-screen.
 *
 * Condition: width < `widthBreakpoint` (default 640, matching the `sm:`
 * classes this drives) OR (the device has touch AND height <
 * `touchHeightBreakpoint` (default 500)).
 *
 * The touch+height branch is deliberately narrow so it only catches phones
 * in landscape, not touch tablets/2-in-1s in landscape: real tablets don't
 * go below ~600px of height even in landscape (e.g. iPad mini landscape is
 * 744px tall; a 1024x768 iPad in landscape is 768px tall), while landscape
 * phone heights top out around 430px (iPhone Pro Max). 500px sits cleanly
 * between those two populations. `hasTouch` (not `isMobile`'s width check)
 * is required specifically so a short, non-touch desktop browser window
 * (e.g. a resized laptop window) is never misclassified as a phone. */
export function useIsMobileOrLandscapePhone(widthBreakpoint = 640, touchHeightBreakpoint = 500): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const widthMq = window.matchMedia(`(max-width: ${widthBreakpoint - 1}px)`);
    const heightMq = window.matchMedia(`(max-height: ${touchHeightBreakpoint - 1}px)`);
    const touchMq = window.matchMedia("(pointer: coarse)");
    const update = () => {
      setIsMobile(widthMq.matches || (touchMq.matches && heightMq.matches));
    };
    update();
    widthMq.addEventListener("change", update);
    heightMq.addEventListener("change", update);
    touchMq.addEventListener("change", update);
    return () => {
      widthMq.removeEventListener("change", update);
      heightMq.removeEventListener("change", update);
      touchMq.removeEventListener("change", update);
    };
  }, [widthBreakpoint, touchHeightBreakpoint]);

  return isMobile;
}

/** True when the user prefers reduced motion. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/** While `active`, tracks `window.visualViewport`'s height and top offset
 * (which shrink/shift when a mobile on-screen keyboard overlays the page)
 * and mirrors them onto CSS custom properties (`--visual-viewport-height`,
 * `--visual-viewport-offset-top`, in px) on `<html>`, so components can size
 * themselves against the actually-visible area via `var(...)` without each
 * needing its own resize listener. Falls back to `window.innerHeight`/`0`
 * when the VisualViewport API itself isn't available, rather than leaving
 * nothing set (so `var(--visual-viewport-height, 100dvh)` callers still get
 * a real, if less precise, value instead of silently falling through to the
 * static fallback on every browser that lacks the API). */
export function useVisualViewportVars(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const vv = window.visualViewport;

    if (!vv) {
      // No VisualViewport support: set a static fallback once from
      // innerHeight so callers still get a value, but there's nothing to
      // listen to for keyboard-open changes on this browser.
      root.style.setProperty("--visual-viewport-height", `${window.innerHeight}px`);
      root.style.setProperty("--visual-viewport-offset-top", "0px");
      return () => {
        root.style.removeProperty("--visual-viewport-height");
        root.style.removeProperty("--visual-viewport-offset-top");
      };
    }

    // Avoid per-event layout thrash: coalesce rapid resize/scroll events
    // (iOS fires both while the keyboard animates in/out) into at most one
    // style write per animation frame, and skip the write entirely when the
    // values haven't actually changed.
    let rafId = 0;
    let lastHeight = -1;
    let lastOffsetTop = -1;
    const update = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const height = vv.height;
        const offsetTop = vv.offsetTop;
        if (height !== lastHeight) {
          lastHeight = height;
          root.style.setProperty("--visual-viewport-height", `${height}px`);
        }
        if (offsetTop !== lastOffsetTop) {
          lastOffsetTop = offsetTop;
          root.style.setProperty("--visual-viewport-offset-top", `${offsetTop}px`);
        }
      });
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      root.style.removeProperty("--visual-viewport-height");
      root.style.removeProperty("--visual-viewport-offset-top");
    };
  }, [active]);
}

// Module-level lock count so multiple simultaneously-open overlays (e.g. the
// mobile menu and the chat panel) share one lock instead of the second
// overlay's cleanup prematurely unlocking scroll while the first is still open.
let scrollLockCount = 0;
let previousHtmlOverflow = "";
let previousBodyOverflow = "";
let previousScrollY = 0;
let previousScrollPathname: string | null = null;

/** Locks page scroll (via `overflow: hidden` on `<html>`/`<body>`) while
 * `active` is true, restoring the previous `overflow` values once the last
 * lock releases. Ref-counted so overlapping overlays (e.g. the mobile menu
 * and the chat panel open at once) compose safely — only the first `active`
 * lock captures the "previous" state, and only the last release restores it.
 *
 * Deliberately does NOT know about route changes: unconditionally calling
 * `window.scrollTo` on release can fight the new page's own scroll position
 * (or the browser's back/forward scroll restoration) if the pathname changed
 * while the overlay was open. Scroll position is restored only when the
 * pathname is still the same as it was when the lock was acquired; otherwise
 * the release only restores `overflow` and leaves scroll position alone.
 * Callers that need "close this overlay when the route changes" (so scroll
 * position naturally stays relevant) should do that themselves — see
 * MobileMenu/ChatWidget, which close on pathname change. */
export function useScrollLock(active: boolean): void {
  const pathname = usePathname();
  const lockedRef = useRef(false);

  useEffect(() => {
    if (!active) return;

    if (scrollLockCount === 0) {
      previousScrollY = window.scrollY;
      previousScrollPathname = pathname;
      previousHtmlOverflow = document.documentElement.style.overflow;
      previousBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    scrollLockCount += 1;
    lockedRef.current = true;

    return () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      scrollLockCount -= 1;
      if (scrollLockCount === 0) {
        document.documentElement.style.overflow = previousHtmlOverflow;
        document.body.style.overflow = previousBodyOverflow;
        if (previousScrollPathname === window.location.pathname) {
          window.scrollTo(0, previousScrollY);
        }
      }
    };
  }, [active, pathname]);
}
