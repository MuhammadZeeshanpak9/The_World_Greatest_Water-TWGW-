"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { useFormSubmit, isValidEmail } from "@/lib/forms";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const { status, submit } = useFormSubmit();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(undefined);

    submit(async () => {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
    });
  };

  return (
    <section className="bg-white py-24 md:py-32">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-[480px] rounded-[20px] glass-card-light p-8 md:p-12"
      >
        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <p className="flex items-center gap-2 font-inter text-[14px] font-semibold uppercase tracking-[0.15em] text-violet">
              <Check size={18} /> Check your email for reset instructions
            </p>
            <Link
              href="/login"
              className="font-inter text-[13px] text-violet hover:text-violet-mid"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required
              error={error}
            />

            <button
              type="submit"
              disabled={status === "submitting"}
              className="group mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Send Reset Link"}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            <Link
              href="/login"
              className="text-center font-inter text-[13px] text-violet hover:text-violet-mid"
            >
              Back to Sign In
            </Link>
          </form>
        )}
      </m.div>
    </section>
  );
}
