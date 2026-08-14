"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useFormSubmit, isValidEmail, submitWaitlist } from "@/lib/forms";

export default function NotifyMeForm({
  label = "NOTIFY ME →",
  source,
  variant = "solid",
  className = "",
}: {
  label?: string;
  source: string;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const { status, errorMessage, submit } = useFormSubmit();

  if (status === "success") {
    return (
      <p
        className={`flex items-center gap-2 font-inter text-[12px] font-semibold tracking-[0.15em] text-violet uppercase ${className}`}
      >
        <Check size={16} /> You&apos;re on the list
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          variant === "outline"
            ? `rounded border border-violet px-6 py-2.5 font-inter text-[11px] font-semibold tracking-[0.15em] text-violet uppercase transition-colors hover:bg-violet hover:text-white ${className}`
            : `flex h-[52px] items-center gap-2 rounded bg-violet px-8 font-inter text-[12px] font-semibold tracking-[0.15em] text-white uppercase transition-transform duration-300 hover:scale-[1.02] ${className}`
        }
      >
        {label}
      </button>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(undefined);
    submit(() => submitWaitlist(email, source));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-2 sm:flex-row sm:items-start ${className}`}
    >
      <div className="flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="h-[52px] w-full min-w-[220px] rounded border border-violet/20 bg-white px-4 font-inter text-[14px] text-ink placeholder:text-muted focus:border-violet focus:outline-none"
        />
        {(error || (status === "error" && errorMessage)) && (
          <p className="mt-1 font-inter text-[12px] text-red-600">{error ?? errorMessage}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex h-[52px] shrink-0 items-center justify-center gap-2 rounded bg-violet px-6 font-inter text-[12px] font-semibold tracking-[0.15em] text-white uppercase transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Notify Me"}
        <ArrowRight size={15} />
      </button>
    </form>
  );
}
