"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { Sparkles } from "lucide-react";
import ChatWindow from "./ChatWindow";
import ProactiveTrigger from "./ProactiveTrigger";

/** Owns the floating ChatBubble + its open ChatWindow. Hidden on /admin/* and /chat. */
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

  return (
    <>
      <ProactiveTrigger onTrigger={() => setHasUnread(true)} chatOpen={open} />

      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
        <AnimatePresence>
          {open && (
            <m.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 sm:static sm:inset-auto"
            >
              <div className="h-full w-full sm:h-auto sm:w-auto">
                <ChatWindow mode="floating" onClose={() => setOpen(false)} />
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
            animate={{
              y: [0, -8, 0],
              boxShadow: [
                "0 8px 30px rgba(94,45,145,0.4)",
                "0 15px 45px rgba(94,45,145,0.85)",
                "0 8px 30px rgba(94,45,145,0.4)",
              ],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full text-white"
            style={{
              background: "#5e2d91",
            }}
          >
            <m.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
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
