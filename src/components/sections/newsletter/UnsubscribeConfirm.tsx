"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export default function UnsubscribeConfirm({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleUnsubscribe() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-white py-24 text-center md:py-32">
      <div className="mx-auto max-w-md px-6">
        {status === "done" ? (
          <>
            <Check size={32} className="mx-auto text-teal" />
            <p className="mt-4 font-cormorant text-2xl text-ink">You&apos;re unsubscribed</p>
            <p className="mt-2 font-inter text-[14px] text-body">
              {email} will no longer receive emails from us.
            </p>
          </>
        ) : (
          <>
            <p className="font-cormorant text-2xl text-ink">Unsubscribe {email}?</p>
            <p className="mt-2 font-inter text-[14px] text-body">
              You&apos;ll stop receiving our newsletter and waitlist emails.
            </p>
            <button
              onClick={handleUnsubscribe}
              disabled={status === "submitting"}
              className="mt-8 flex h-[52px] w-full items-center justify-center rounded-full bg-gradient-brand btn-glow px-8 font-inter text-[12px] font-semibold tracking-[0.15em] text-white uppercase transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
            >
              {status === "submitting" ? "Unsubscribing…" : "Confirm Unsubscribe"}
            </button>
            {status === "error" && (
              <p className="mt-4 font-inter text-[13px] text-red-600">
                Something went wrong. Please try again.
              </p>
            )}
          </>
        )}

        <Link
          href="/"
          className="mt-8 inline-block font-inter text-[13px] text-violet hover:underline"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
