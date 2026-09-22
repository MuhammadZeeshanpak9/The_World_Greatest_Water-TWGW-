"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Send, X, Sparkles } from "lucide-react";
import LanguageSelector, { detectBrowserLanguage } from "./LanguageSelector";
import LeadCapture from "./LeadCapture";
import EscalationPanel from "./EscalationPanel";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

function makeMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return { id: crypto.randomUUID(), role, content, createdAt: Date.now() };
}

const SUGGESTIONS = [
  "What makes ELEV8 WATER different?",
  "Tell me about the 12 bottles",
  "How does the Wellness membership work?",
  "I'd like to speak with a human",
];

const MAX_LEN = 500;

/* ── Typing indicator ── */
function TypingDots() {
  return (
    <div className="flex justify-start">
      <div
        className="inline-flex items-center gap-1.5 rounded-2xl px-4 py-3"
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full"
            style={{ background: "#fff", opacity: 0.6, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatWindow({
  mode = "floating",
  onClose,
  language: controlledLanguage,
  onLanguageChange,
  showLanguageSelector = true,
  forceMobileLayout = false,
}: {
  mode?: "floating" | "full";
  onClose?: () => void;
  language?: string;
  onLanguageChange?: (code: string) => void;
  showLanguageSelector?: boolean;
  /** Floating mode only. Set by ChatWidget from its own
   * useIsMobileOrLandscapePhone check — true whenever the caller's wrapper
   * is using the mobile full-screen layout, including landscape phones that
   * are past the `sm` width breakpoint. Overrides the `sm:` panel-sizing
   * classes below, since plain Tailwind breakpoints can't express that
   * width-OR-(touch-and-short) condition. */
  forceMobileLayout?: boolean;
}) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [internalLanguage, setInternalLanguage] = useState(detectBrowserLanguage);
  const language = controlledLanguage ?? internalLanguage;
  const setLanguage = onLanguageChange ?? setInternalLanguage;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [leadDismissed, setLeadDismissed] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const hasMessages = messages.length > 0;
  const isFull = mode === "full";

  useEffect(() => {
    fetch("/api/chat/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, page_url: window.location.pathname }),
    })
      .then((r) => r.json())
      .then((d) => setSessionId(d.session_id))
      .catch(() => setErrorText("Unable to start session."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const showEscalation = !!lastAssistant?.content.toLowerCase().includes("human");

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || !sessionId || sending) return;
    setErrorText(null);
    setMessages((p) => [...p, makeMessage("user", trimmed)]);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, session_id: sessionId, language }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorText(data.error ?? "Something went wrong."); setSending(false); return; }
      const reply = makeMessage("assistant", data.response);
      setMessages((p) => {
        const next = [...p, reply];
        const count = next.filter((m) => m.role === "assistant").length;
        if (count === 1 && !leadDismissed) setShowLead(true);
        return next;
      });
    } catch { setErrorText("Something went wrong. Please try again."); }
    finally { setSending(false); }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  /* ══════════════════════════════════════
     FLOATING MODE — crystal glass window
  ══════════════════════════════════════ */
  if (!isFull) {
    return (
      <div
        className={
          forceMobileLayout
            ? "flex h-full w-full flex-col overflow-hidden rounded-none"
            : "flex h-full w-full flex-col overflow-hidden rounded-none sm:h-[560px] sm:w-[380px] sm:max-w-[calc(100vw-2rem)] sm:rounded-2xl"
        }
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Mobile (incl. landscape phones via forceMobileLayout): this panel
            just fills its parent wrapper (h-full above). The wrapper itself
            (in ChatWidget.tsx) is what's actually pinned to the visual
            viewport's top/height via --visual-viewport-offset-top and
            --visual-viewport-height, so no separate maxHeight is needed
            here — sizing the wrapper correctly is what keeps the header and
            input bar on-screen when iOS scrolls the layout viewport for the
            keyboard, not this element having its own cap. */}
        {/* Header */}
        <div
          className="flex shrink-0 items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-bold text-white"
              style={{ background: "linear-gradient(135deg,#5e2d91,#3dd6cb)" }}
            >
              <Sparkles size={14} />
            </div>
            <div>
              <p className="font-cormorant text-[15px] font-semibold leading-none text-white">ELEV8 V.A.</p>
              <p className="font-inter text-[10px] uppercase tracking-[0.12em]" style={{ color: "#3dd6cb" }}>● Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {showLanguageSelector && <LanguageSelector value={language} onChange={setLanguage} compact />}
            {onClose && (
              <button type="button" onClick={onClose} aria-label="Close" style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
          {!hasMessages && (
            <div className="flex flex-col gap-2">
              <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>Try asking:</p>
              {SUGGESTIONS.map((q) => (
                <button key={q} type="button" onClick={() => sendMessage(q)}
                  className="rounded-xl px-3 py-2.5 text-left font-inter text-[12px] transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}>
                  {q}
                </button>
              ))}
            </div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <m.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[80%] rounded-2xl px-3.5 py-2.5 font-inter text-[12px] leading-relaxed"
                  style={msg.role === "user"
                    ? { background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", color: "#fff", borderBottomRightRadius: 6, border: "1px solid rgba(255,255,255,0.3)" }
                    : { background: "rgba(94,45,145,0.25)", backdropFilter: "blur(12px)", border: "1px solid rgba(94,45,145,0.4)", color: "#fff", borderBottomLeftRadius: 6 }}>
                  <p>{msg.content}</p>
                  <span className="mt-1 block text-right text-[10px]" style={{ color: msg.role === "user" ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.5)" }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </m.div>
            ))}
          </AnimatePresence>
          {sending && <TypingDots />}
          {errorText && <p className="font-inter text-[11px]" style={{ color: "#fca5a5" }}>{errorText}</p>}
          <AnimatePresence>
            {showEscalation && <EscalationPanel key="esc" />}
            {showLead && !leadDismissed && sessionId && (
              <LeadCapture key="lead" sessionId={sessionId} onDismiss={() => { setShowLead(false); setLeadDismissed(true); }} />
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div
          className="shrink-0 px-4 pt-3"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            // env() insets are inert without viewport-fit=cover in the page's
            // viewport meta tag (not changed here, see audit report) — this
            // padding is a no-op fallback until that's set, and harmless
            // either way (falls back to the 0.75rem value).
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
          }}
        >
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN))}
              placeholder="Ask me anything…" disabled={!sessionId || sending}
              // text-base (16px) below sm avoids iOS Safari's auto-zoom-on-focus
              // for inputs under 16px, which would disturb this panel's fixed
              // positioning; sm:text-xs (12px) restores the original desktop size.
              className="flex-1 bg-transparent font-inter text-base focus:outline-none disabled:opacity-40 sm:text-xs"
              style={{ color: "#fff" }} />
            <button type="submit" disabled={!sessionId || sending || !input.trim()} aria-label="Send"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all disabled:opacity-30"
              style={{ background: "#5e2d91" }}>
              <Send size={12} style={{ color: "#fff" }} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════
     FULL PAGE MODE — Crystal Glass Omago-style
  ══════════════════════════════════════ */
  return (
    <div className="relative flex h-full w-full flex-col">

      {/* ── LANDING STATE: centered greeting + big input ── */}
      <AnimatePresence>
        {!hasMessages && (
          <m.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-1 flex-col items-center justify-center px-4 pb-8"
          >
            {/* Greeting */}
            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 text-center"
            >
              <p className="mb-2 font-inter text-[12px] uppercase tracking-[0.22em]"
                style={{ color: "rgba(255,255,255,0.6)" }}>
                ELEV8 Virtual Assistant
              </p>
              <h1 className="font-cormorant text-[38px] font-semibold leading-tight md:text-[46px]"
                style={{ color: "#fff", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
                Hi, I&apos;m ELEV8 V.A.
              </h1>
              <p className="mt-2 font-inter text-[14px]"
                style={{ color: "rgba(255,255,255,0.7)" }}>
                How can I elevate your experience today?
              </p>
            </m.div>

            {/* Big input box */}
            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-xl"
            >
              <div
                className="w-full overflow-hidden rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN))}
                  onKeyDown={handleKey}
                  placeholder="Ask anything…"
                  rows={3}
                  disabled={!sessionId}
                  className="w-full resize-none bg-transparent px-5 pt-5 pb-2 font-inter text-[14px] text-white placeholder:text-white/40 focus:outline-none disabled:opacity-40"
                />
                {/* Bottom row of input box */}
                <div className="flex items-center justify-between px-4 pb-4 pt-1">
                  <span className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {input.length > MAX_LEN * 0.8 ? `${input.length}/${MAX_LEN}` : "Shift + Enter for new line"}
                  </span>
                  <button
                    type="button"
                    onClick={() => sendMessage(input)}
                    disabled={!sessionId || sending || !input.trim()}
                    aria-label="Send"
                    className="flex h-9 w-9 items-center justify-center rounded-xl transition-all disabled:opacity-30"
                    style={{ background: "#5e2d91" }}
                    onMouseEnter={(e) => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLElement).style.background = "#4a2270"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5e2d91"; }}
                  >
                    <Send size={15} style={{ color: "#fff" }} />
                  </button>
                </div>
              </div>

              {/* Suggestion chips — below the input */}
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 flex flex-wrap justify-center gap-2"
              >
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="rounded-full px-4 py-2 font-inter text-[12px] transition-all duration-150"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </m.div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* ── CHAT STATE: messages + bottom input bar ── */}
      {hasMessages && (
        <m.div
          key="chat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          {/* Messages scroll area */}
          <div ref={scrollRef} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6 md:px-8">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <m.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[75%] rounded-2xl px-4 py-3 font-inter text-[13px] leading-relaxed"
                    style={
                      msg.role === "user"
                        ? {
                            background: "rgba(255,255,255,0.15)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid rgba(255,255,255,0.25)",
                            color: "#fff",
                            borderBottomRightRadius: 6,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                          }
                        : {
                            background: "rgba(94,45,145,0.25)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid rgba(94,45,145,0.4)",
                            color: "#fff",
                            borderBottomLeftRadius: 6,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                          }
                    }
                  >
                    <p>{msg.content}</p>
                    <span
                      className="mt-1.5 block text-right font-inter text-[10px]"
                      style={{ color: msg.role === "user" ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.5)" }}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </m.div>
              ))}
            </AnimatePresence>
            {sending && <TypingDots />}
            {errorText && (
              <p className="rounded-xl px-4 py-2 font-inter text-[12px]"
                style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                {errorText}
              </p>
            )}
            <AnimatePresence>
              {showEscalation && <EscalationPanel key="esc" />}
              {showLead && !leadDismissed && sessionId && (
                <LeadCapture key="lead" sessionId={sessionId}
                  onDismiss={() => { setShowLead(false); setLeadDismissed(true); }} />
              )}
            </AnimatePresence>
          </div>

          {/* Bottom input bar */}
          <div
            className="shrink-0 px-4 py-4 md:px-8"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(16px)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="flex items-end gap-3 overflow-hidden rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN))}
                onKeyDown={handleKey}
                placeholder="Ask me anything…"
                rows={1}
                disabled={!sessionId || sending}
                className="flex-1 resize-none bg-transparent px-5 py-4 font-inter text-[13px] text-white placeholder:text-white/40 focus:outline-none disabled:opacity-40"
                style={{
                  minHeight: "52px",
                  maxHeight: "120px",
                  overflowY: "auto",
                  lineHeight: "1.5",
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 120) + "px";
                }}
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!sessionId || sending || !input.trim()}
                aria-label="Send message"
                className="m-2.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all disabled:opacity-30"
                style={{ background: "#5e2d91" }}
                onMouseEnter={(e) => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLElement).style.background = "#4a2270"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5e2d91"; }}
              >
                <Send size={15} style={{ color: "#fff" }} />
              </button>
            </div>
            <p className="mt-2 text-center font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              Shift + Enter for new line
            </p>
          </div>
        </m.div>
      )}
    </div>
  );
}
