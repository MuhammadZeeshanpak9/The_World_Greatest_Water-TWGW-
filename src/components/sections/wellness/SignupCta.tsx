"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { useFormSubmit, isValidEmail } from "@/lib/forms";

export default function SignupCta() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const { status, submit } = useFormSubmit({ resetDelayMs: 5000 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(undefined);
    submit(() => new Promise((resolve) => setTimeout(resolve, 900)));
  };

  return (
    <section className="relative overflow-hidden bg-dark-violet py-24 md:py-32">
      <div
        className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full will-change-transform"
        style={{
          background: "rgba(107,47,160,0.25)",
          filter: "blur(90px)",
          animation: "orbDrift1 18s ease-in-out infinite",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-xl px-6 text-center">
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-cormorant text-[36px] font-semibold text-white md:text-[52px]"
        >
          Sign Up Today To ELEV8 Your Life
        </m.h2>
        <p className="mt-4 font-inter text-base text-white/65">
          And drink your ultra-purified personal water created with you in
          mind.
        </p>

        {status === "success" ? (
          <p className="mt-8 flex items-center justify-center gap-2 font-inter text-[13px] font-semibold uppercase tracking-[0.15em] text-teal">
            <Check size={16} /> You&apos;re on the list
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-4 sm:flex-row"
          >
            <div className="flex-1">
              <FormField
                label="Email"
                name="email"
                type="email"
                tone="dark"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                required
                error={error}
                className="text-left"
              />
            </div>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="group flex h-[52px] items-center justify-center gap-2 self-start rounded bg-gradient-violet px-6 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60 sm:mt-[26px]"
            >
              {status === "submitting" ? "Sending…" : "Sign Up"}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
