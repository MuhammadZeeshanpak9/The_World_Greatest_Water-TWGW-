"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import ChatWindow from "./ChatWindow";
import ProactiveTrigger from "./ProactiveTrigger";

const SPARKLE_WAVE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
    <path
      d="M12 3.5l1.4 4.1 4.1 1.4-4.1 1.4L12 14.5l-1.4-4.1-4.1-1.4 4.1-1.4L12 3.5z"
      fill="currentColor"
    />
    <path
      d="M4 16.5c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M4 20c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
    />
  </svg>
);

/** Owns the floating ChatBubble + its open ChatWindow, and the proactive-trigger timer that can
 * also open it — the two need to coordinate through one shared piece of state. Hidden entirely on
 * /admin/* and /chat (dedicated full-page chat already exists there). */
export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const hidden = pathname?.startsWith("/admin") || pathname === "/chat";
  if (hidden) return null;

  function handleOpen() {
    setOpen(true);
    setHasUnread(false);
  }

  function handleProactiveOpen() {
    setHasUnread(true);
  }

  return (
    <>
      <ProactiveTrigger onTrigger={handleProactiveOpen} chatOpen={open} />

      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
        <AnimatePresence>
          {open && (
            <m.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 sm:static sm:inset-auto"
            >
              <div className="h-full w-full sm:h-auto sm:w-auto">
                <ChatWindow mode="floating" onClose={() => setOpen(false)} />
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {!open && (
          <button
            type="button"
            onClick={handleOpen}
            aria-label="Open ELEV8 V.A. chat"
            className="btn-glow relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-br from-[#6B2FA0] to-[#4ECDC4] text-white shadow-[0_10px_40px_rgba(107,47,160,0.5)] transition-transform hover:scale-105"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#6B2FA0]/40" />
            <span className="relative">{SPARKLE_WAVE_ICON}</span>
            {hasUnread && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                1
              </span>
            )}
          </button>
        )}
      </div>
    </>
  );
}
