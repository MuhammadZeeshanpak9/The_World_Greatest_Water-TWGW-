"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import EmptyState from "@/components/ui/EmptyState";

type Subscription = {
  id: string;
  plan: string;
  product: string;
  status: string;
  amount: number;
  next_billing_date: string | null;
};

type Action = "pause" | "reactivate" | "cancel";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ACTION_STATUS: Record<Action, string> = {
  pause: "paused",
  reactivate: "active",
  cancel: "cancelled",
};

const ACTION_LABEL: Record<Action, string> = {
  pause: "Pause",
  reactivate: "Reactivate",
  cancel: "Cancel",
};

const ACTION_LOADING_LABEL: Record<Action, string> = {
  pause: "Pausing…",
  reactivate: "Reactivating…",
  cancel: "Cancelling…",
};

const ACTION_SUCCESS_MESSAGE: Record<Action, string> = {
  pause: "Subscription paused",
  reactivate: "Subscription reactivated",
  cancel: "Subscription cancelled",
};

export default function AccountSubscriptionsList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actioning, setActioning] = useState<{ id: string; action: Action } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/subscriptions");
        if (!res.ok) throw new Error("Failed to load subscriptions");
        const json = await res.json();
        if (!cancelled) setSubscriptions(json.subscriptions ?? []);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAction(id: string, action: Action) {
    setActioning({ id, action });
    try {
      const nextStatus = ACTION_STATUS[action];
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `Unable to ${action} subscription`);
      setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, status: nextStatus } : s)));
      toast.success(ACTION_SUCCESS_MESSAGE[action]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Unable to ${action} subscription`);
    } finally {
      setActioning(null);
    }
  }

  if (loading) {
    return (
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-4xl space-y-4 px-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-violet/5" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-24 text-center md:py-32">
        <p className="font-inter text-red-600">
          Unable to load your subscriptions right now. Please try again later.
        </p>
      </section>
    );
  }

  const visible = subscriptions.filter((s) => s.status === "active" || s.status === "paused");

  if (visible.length === 0) {
    return (
      <EmptyState
        icon={RefreshCw}
        heading="No active subscriptions yet — launching soon"
        description="Join the waitlist and we'll notify you when subscriptions go live"
        ctaLabel="VIEW PLANS"
        ctaHref="/subscription"
      />
    );
  }

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-4xl space-y-4 px-6">
        {visible.map((sub) => {
          const isPaused = sub.status === "paused";
          const isBusy = actioning?.id === sub.id;
          const busyAction = isBusy ? actioning.action : null;

          return (
            <div
              key={sub.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl glass-card-light p-6"
            >
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-cormorant text-[22px] text-ink">{sub.product}</p>
                  {isPaused && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 font-inter text-[10px] font-semibold tracking-[0.15em] text-amber-700 uppercase">
                      Paused
                    </span>
                  )}
                </div>
                <p className="mt-1 font-inter text-[13px] text-muted">
                  {sub.plan} · Next billing {formatDate(sub.next_billing_date)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-inter text-[16px] font-semibold text-violet">
                  {formatCurrency(sub.amount)}
                </p>
                <button
                  onClick={() => handleAction(sub.id, isPaused ? "reactivate" : "pause")}
                  disabled={isBusy}
                  className="rounded-full border border-violet/30 px-4 py-2 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-violet transition-colors hover:bg-violet/5 disabled:opacity-50"
                >
                  {busyAction === "pause"
                    ? ACTION_LOADING_LABEL.pause
                    : busyAction === "reactivate"
                      ? ACTION_LOADING_LABEL.reactivate
                      : isPaused
                        ? ACTION_LABEL.reactivate
                        : ACTION_LABEL.pause}
                </button>
                <button
                  onClick={() => handleAction(sub.id, "cancel")}
                  disabled={isBusy}
                  className="rounded-full border border-red-300 px-4 py-2 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  {busyAction === "cancel" ? ACTION_LOADING_LABEL.cancel : ACTION_LABEL.cancel}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
