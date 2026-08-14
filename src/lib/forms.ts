"use client";

import { useCallback, useEffect, useState } from "react";

export type FormStatus = "idle" | "submitting" | "success" | "error";

/**
 * Shared submit lifecycle for forms — `submit` runs whatever async task
 * it's given (typically one of the helpers below) and tracks status/error.
 */
export function useFormSubmit(options?: { resetDelayMs?: number }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = useCallback(async (task: () => Promise<void> | void) => {
    setStatus("submitting");
    setErrorMessage(null);
    try {
      await task();
      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    if (status !== "success" || !options?.resetDelayMs) return;
    const id = setTimeout(() => setStatus("idle"), options.resetDelayMs);
    return () => clearTimeout(id);
  }, [status, options?.resetDelayMs]);

  return { status, errorMessage, submit, reset };
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Posts a public form (contact/apply/gift-cards/join/wellness) to `form_submissions`. */
export async function submitFormSubmission(
  formType: "contact" | "wellness" | "creators" | "join" | "gift-cards",
  fields: Record<string, string>,
) {
  const res = await fetch("/api/public/form-submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ form_type: formType, ...fields }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "Something went wrong. Please try again.");
  }
}

/** Posts an email to the `waitlist` table. */
export async function submitWaitlist(email: string, source: string) {
  const res = await fetch("/api/public/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "Something went wrong. Please try again.");
  }
}
