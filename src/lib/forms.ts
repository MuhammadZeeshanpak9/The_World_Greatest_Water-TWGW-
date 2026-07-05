"use client";

import { useCallback, useEffect, useState } from "react";

export type FormStatus = "idle" | "submitting" | "success" | "error";

/**
 * Shared submit lifecycle for client-only forms (no backend exists yet —
 * `submit` runs whatever async task it's given and tracks status/error).
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
