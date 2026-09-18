"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";
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

const SUGGESTED_QUESTIONS = [
  "What makes ELEV8 WATER different?",
  "Tell me about the 12 bottles",
  "How does the Wellness membership work?",
  "I'd like to speak with a human",
];

const MAX_MESSAGE_LENGTH = 500;

export default function ChatWindow({
  mode = "floating",
  onClose,
  language: controlledLanguage,
  onLanguageChange,
  showLanguageSelector = true,
}: {
  mode?: "floating" | "full";
  onClose?: () => void;
  language?: string;
  onLanguageChange?: (code: string) => void;
  showLanguageSelector?: boolean;
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

  useEffect(() => {
    fetch("/api/chat/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, page_url: window.location.pathname }),
    })
      .then((res) => res.json())
      .then((data) => setSessionId(data.session_id))
      .catch(() => setErrorText("Unable to start chat session right now."));
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
    const userMsg = makeMessage("user", trimmed);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, session_id: sessionId, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorText(data.error ?? "Something went wrong. Please try again.");
        setSending(false);
        return;
      }
      const assistantMsg = makeMessage("assistant", data.response);
      setMessages((prev) => {
        const next = [...prev, assistantMsg];
        const assistantCount = next.filter((m) => m.role === "assistant").length;
        if (assistantCount === 1 && !leadDismissed) setShowLead(true);
        return next;
      });
    } catch {
      setErrorText("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  const isFull = mode === "full";

  return (
    <div
      className={`glass-card-dark flex flex-col overflow-hidden rounded-2xl ${
        isFull ? "h-full w-full" : "h-[560px] w-[380px] max-w-[calc(100vw-2rem)]"
      }`}
      style={{ background: "#0A0A0A" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#6B2FA0] to-[#4ECDC4] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <h2 className="font-cormorant text-[19px] font-semibold text-white">ELEV8 V.A.</h2>
        </div>
        <div className="flex items-center gap-2">
          {showLanguageSelector && (
            <LanguageSelector value={language} onChange={setLanguage} compact />
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="text-white/90 transition-colors hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2">
            <p className="font-inter text-[12px] text-white/50">Try asking:</p>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-left font-inter text-[12px] text-white/80 transition-colors hover:bg-white/10"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 font-inter text-[13px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#6B2FA0] text-white"
                  : "glass-card-dark text-white/90"
              }`}
            >
              <p>{msg.content}</p>
              <span className="mt-1 block text-[10px] opacity-50">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="glass-card-dark flex gap-1 rounded-2xl px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {errorText && <p className="font-inter text-[11px] text-red-400">{errorText}</p>}

        <AnimatePresence>
          {showEscalation && <EscalationPanel key="escalation" />}
          {showLead && !leadDismissed && sessionId && (
            <LeadCapture
              key="lead"
              sessionId={sessionId}
              onDismiss={() => {
                setShowLead(false);
                setLeadDismissed(true);
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/10 px-3 py-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
          placeholder="Type your message..."
          disabled={!sessionId || sending}
          className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 font-inter text-[13px] text-white placeholder:text-white/40 focus:border-[#6B2FA0] focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!sessionId || sending || !input.trim()}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#6B2FA0] to-[#4ECDC4] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
