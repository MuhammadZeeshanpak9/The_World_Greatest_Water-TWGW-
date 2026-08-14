"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (locked) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 429) {
        setLocked(true);
        setError("Too many login attempts. Please try again in 15 minutes.");
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(typeof body.error === "string" ? body.error : "Invalid credentials");
        if (typeof body.remainingAttempts === "number") {
          setRemainingAttempts(body.remainingAttempts);
        }
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0A1E] px-4">
      <div className="w-full max-w-[480px] rounded-2xl border border-white/10 bg-white/5 p-10">
        <div className="text-center">
          <h1 className="font-cormorant text-3xl text-white">ELEV8 WATER</h1>
          <p className="mt-2 font-inter text-[11px] font-semibold tracking-[0.25em] text-[#6B2FA0] uppercase">
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block font-inter text-xs text-white/50">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={locked}
              className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white placeholder:text-white/30 focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none disabled:opacity-50"
              placeholder="admin@theworldsgreatestwater.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block font-inter text-xs text-white/50">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={locked}
                className="w-full rounded-lg bg-white/[0.08] px-4 py-3 pr-11 font-inter text-sm text-white placeholder:text-white/30 focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none disabled:opacity-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 font-inter text-sm text-[#EF4444]">
              {error}
              {remainingAttempts !== null && remainingAttempts > 0 && !locked && (
                <span className="mt-1 block text-xs text-[#EF4444]/80">
                  {remainingAttempts} attempt{remainingAttempts === 1 ? "" : "s"} remaining
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || locked}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6B2FA0] py-3 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                SIGN IN <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
