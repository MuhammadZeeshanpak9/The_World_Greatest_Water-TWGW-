"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { m } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { useFormSubmit, isValidEmail } from "@/lib/forms";
import { isSafeRedirectPath } from "@/lib/validation";

type Errors = Partial<Record<"email" | "password", string>>;

export default function LoginForm() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const { status, errorMessage, submit } = useFormSubmit();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justReset = searchParams.get("reset") === "success";

  const update = (field: keyof typeof values) => (value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Errors = {};
    if (!isValidEmail(values.email)) nextErrors.email = "Enter a valid email address.";
    if (!values.password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    submit(async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to sign in");

      const redirect = searchParams.get("redirect");
      router.push(isSafeRedirectPath(redirect) ? redirect! : "/account");
      router.refresh();
    });
  };

  return (
    <section className="bg-white py-24 md:py-32">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-[480px] rounded-[20px] glass-card-light p-8  md:p-12"
      >
        {status === "success" ? (
          <p className="flex items-center justify-center gap-2 py-8 font-inter text-[14px] font-semibold uppercase tracking-[0.15em] text-violet">
            ✓ Signed In Successfully
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {justReset && (
              <p className="flex items-center justify-center gap-2 rounded-lg bg-teal/10 px-4 py-3 font-inter text-[13px] font-semibold text-teal">
                <Check size={16} /> Password updated — please sign in
              </p>
            )}

            <FormField
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={update("email")}
              placeholder="you@example.com"
              required
              error={errors.email}
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={update("password")}
              placeholder="••••••••"
              required
              error={errors.password}
            />

            {status === "error" && errorMessage && (
              <p className="text-center font-inter text-[13px] text-red-600">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="group mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
            >
              {status === "submitting" ? "Signing In…" : "Sign In"}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            <Link
              href="/forgot-password"
              className="text-center font-inter text-[13px] text-violet hover:text-violet-mid"
            >
              Forgot password?
            </Link>

            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-violet/15" />
              <span className="font-inter text-[11px] uppercase tracking-[0.2em] text-muted">
                or
              </span>
              <span className="h-px flex-1 bg-violet/15" />
            </div>

            <Link
              href="/register"
              className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-brand  font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white btn-glow transition-transform hover:scale-[1.02]"
            >
              Create An Account
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </form>
        )}
      </m.div>
    </section>
  );
}
