"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { X } from "lucide-react";

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
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
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
      setTimeout(onDismiss, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3 }}
      className="glass-card-dark relative mt-2 rounded-2xl p-4"
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 text-white/40 transition-colors hover:text-white"
      >
        <X size={14} />
      </button>

      {status === "done" ? (
        <p className="pr-4 font-inter text-[12px] text-[#4ECDC4]">
          Thank you — we&apos;ll be in touch.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 pr-4">
          <p className="font-cormorant text-[15px] text-white">
            Stay connected with ELEV8
          </p>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={200}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 font-inter text-[12px] text-white placeholder:text-white/40 focus:border-[#6B2FA0] focus:outline-none"
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 font-inter text-[12px] text-white placeholder:text-white/40 focus:border-[#6B2FA0] focus:outline-none"
          />
          {error && <p className="font-inter text-[11px] text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-1 rounded-full bg-gradient-to-r from-[#6B2FA0] to-[#4ECDC4] px-4 py-2 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? "Sending..." : "Submit"}
          </button>
        </form>
      )}
    </m.div>
  );
}
