"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { useFormSubmit } from "@/lib/forms";
import { isStrongPassword } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";

type Errors = { password?: string; confirmPassword?: string };

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const { status, errorMessage, submit } = useFormSubmit();

  useEffect(() => {
    const tokenHash = searchParams.get("token_hash") ?? searchParams.get("token");

    if (!tokenHash) {
      router.replace("/forgot-password");
      return;
    }

    async function verify() {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash!,
        type: "recovery",
      });
      if (error) {
        router.replace("/forgot-password");
        return;
      }
      setVerified(true);
      setVerifying(false);
    }

    verify();
    // Verify the recovery token exactly once on mount — re-running on searchParams identity
    // changes would re-trigger verifyOtp unnecessarily.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Errors = {};
    if (!isStrongPassword(password)) {
      nextErrors.password =
        "At least 8 characters, with an uppercase letter, a number, and a special character.";
    }
    if (confirmPassword !== password) nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    submit(async () => {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to update password");

      router.push("/login?reset=success");
    });
  };

  if (verifying) {
    return (
      <section className="bg-white py-24 text-center md:py-32">
        <p className="font-inter text-body">Verifying your reset link…</p>
      </section>
    );
  }

  if (!verified) return null;

  return (
    <section className="bg-white py-24 md:py-32">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-[480px] rounded-[20px] glass-card-light p-8 md:p-12"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormField
            label="New Password"
            name="password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
            error={errors.password}
          />
          <FormField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="••••••••"
            required
            error={errors.confirmPassword}
          />

          {status === "error" && errorMessage && (
            <p className="text-center font-inter text-[13px] text-red-600">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="group mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
          >
            {status === "submitting" ? "Updating…" : "Update Password"}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </m.div>
    </section>
  );
}
