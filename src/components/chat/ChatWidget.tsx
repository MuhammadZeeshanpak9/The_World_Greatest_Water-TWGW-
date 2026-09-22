"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { Sparkles } from "lucide-react";
import ChatWindow from "./ChatWindow";
import ProactiveTrigger from "./ProactiveTrigger";
import { useIsMobileOrLandscapePhone, usePrefersReducedMotion, useScrollLock, useVisualViewportVars } from "@/lib/hooks";

/** Owns the floating ChatBubble + its open ChatWindow. Hidden on /admin/* and /chat. */
export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  // width < 640 (matches the sm: classes below) OR a touch device shorter
  // than 500px tall — the latter catches landscape phones (e.g. 667x375,
  // 844x390), which are wider than the portrait breakpoint but still too
  // short for the fixed-size desktop popover, without misclassifying real
  // touch tablets in landscape (see useIsMobileOrLandscapePhone's own doc).
  const isMobile = useIsMobileOrLandscapePhone(640, 500);
  const prefersReducedMotion = usePrefersReducedMotion();

  // On mobile the open chat is a fixed, visual-viewport-sized full-screen
  // takeover (see the className below), so background scroll must be locked
  // the same way the mobile menu locks it. Desktop/tablet keeps its normal
  // floating popover and never locks scroll.
  useScrollLock(open && isMobile);
  // Keeps --visual-viewport-height/--visual-viewport-offset-top current
  // while the chat is open on mobile, so the wrapper below can position/size
  // itself against the actually-visible area (i.e. above the on-screen
  // keyboard, and not shifted off-screen when iOS scrolls the layout
  // viewport) instead of a static fixed inset-0.
  useVisualViewportVars(open && isMobile);

  // Close on route change, mobile only — desktop's floating popover doesn't
  // lock scroll or take over the screen, so there's nothing to clean up
  // there; leaving it open across a desktop navigation is the pre-existing,
  // unchanged behavior.
  useEffect(() => {
    if (!isMobile) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const hidden = pathname?.startsWith("/admin") || pathname === "/chat";
  if (hidden) return null;

  function handleOpen() {
    setOpen(true);
    setHasUnread(false);
  }

  return (
    <>
      <ProactiveTrigger onTrigger={() => setHasUnread(true)} chatOpen={open} />

      {/* bottom offset stacks the cookie banner's live height (0 when dismissed/never
          shown) on top of the resting 1.5rem gap, plus a safe-area-inset fallback for
          notched devices, so the bubble never sits under the banner. */}
      <div
        className="fixed right-6 z-[9999] flex flex-col items-end gap-4"
        style={{ bottom: "calc(1.5rem + var(--cookie-banner-height, 0px) + env(safe-area-inset-bottom, 0px))" }}
      >
        <AnimatePresence>
          {open && (
            <m.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              // isMobile here also covers landscape phones (see
              // useIsMobileOrLandscapePhone above), which plain sm: media
              // queries can't express (a 667/844px-wide landscape phone is
              // past the sm breakpoint on width alone) — so layout mode is
              // driven from JS state, not Tailwind's sm: variant, on this
              // wrapper and in ChatWindow's own panel sizing.
              className={
                isMobile
                  ? "fixed inset-x-0 bottom-auto top-[var(--visual-viewport-offset-top,0px)]"
                  : "static inset-auto"
              }
              style={
                isMobile
                  ? {
                      // Same --cookie-banner-height variable the bubble uses
                      // (set by CookieConsent.tsx), subtracted from the
                      // visual-viewport height so the OPEN chat window's
                      // bottom edge also clears the banner while it's still
                      // showing — previously only the closed bubble's own
                      // bottom offset accounted for the banner, so the open
                      // panel could still overlap it underneath.
                      height: "calc(var(--visual-viewport-height, 100dvh) - var(--cookie-banner-height, 0px))",
                    }
                  : undefined
              }
            >
              <div className={isMobile ? "h-full w-full" : "h-auto w-auto"}>
                <ChatWindow mode="floating" onClose={() => setOpen(false)} forceMobileLayout={isMobile} />
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {!open && (
          <m.button
            type="button"
            onClick={handleOpen}
            aria-label="Open ELEV8 V.A. chat"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            animate={
              prefersReducedMotion
                ? { boxShadow: "0 8px 30px rgba(94,45,145,0.4)" }
                : {
                    y: [0, -8, 0],
                    boxShadow: [
                      "0 8px 30px rgba(94,45,145,0.4)",
                      "0 15px 45px rgba(94,45,145,0.85)",
                      "0 8px 30px rgba(94,45,145,0.4)",
                    ],
                  }
            }
            transition={
              prefersReducedMotion ? { duration: 0 } : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
            }
            className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full text-white"
            style={{
              background: "#5e2d91",
            }}
          >
            <m.div
              animate={prefersReducedMotion ? { rotate: 0 } : { rotate: [0, 8, -8, 0] }}
              transition={
                prefersReducedMotion ? { duration: 0 } : { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <Sparkles size={20} />
            </m.div>

            {hasUnread && (
              <m.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full font-inter text-[9px] font-bold text-white"
                style={{ background: "#ef4444" }}
              >
                1
              </m.span>
            )}
          </m.button>
        )}
      </div>
    </>
  );
}
