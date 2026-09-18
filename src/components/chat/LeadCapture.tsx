"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

export default function LeadCapture({
  sessionId,
  onDismiss,
}: {
  sessionId: string;
  onDismiss: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email"); return; }
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, name, email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
      setTimeout(onDismiss, 2000);
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "10px",
    padding: "10px 12px",
    fontFamily: "inherit",
    fontSize: "12px",
    color: "#fff",
    outline: "none",
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
      className="relative rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3"
        style={{ color: "rgba(255,255,255,0.5)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
      >
        <X size={14} />
      </button>

      {status === "done" ? (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 pr-4"
        >
          <CheckCircle size={16} style={{ color: "#3dd6cb" }} />
          <p className="font-inter text-[12px] text-white">
            Thank you — we&apos;ll be in touch.
          </p>
        </m.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 pr-4">
          <div>
            <p className="font-cormorant text-[16px] font-semibold text-white">
              Stay connected with ELEV8
            </p>
            <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>
              Get exclusive updates and offers.
            </p>
          </div>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={200}
            style={inputStyle}
            onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; }}
            onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
          />
          <input
            type="email"
            placeholder="Your email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; }}
            onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
          />
          {error && (
            <p className="font-inter text-[11px]" style={{ color: "#fca5a5" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-xl px-4 py-2.5 font-inter text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-all disabled:opacity-50"
            style={{ background: "#5e2d91" }}
            onMouseEnter={(e) => {
              if (!(e.currentTarget as HTMLButtonElement).disabled)
                (e.currentTarget as HTMLElement).style.background = "#4a2270";
            }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5e2d91"; }}
          >
            {status === "submitting" ? "Sending…" : "Stay in Touch"}
          </button>
        </form>
      )}
    </m.div>
  );
}
