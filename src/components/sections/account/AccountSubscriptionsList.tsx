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

export default function AccountSubscriptionsList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

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

  async function handleCancel(id: string) {
    setCancelingId(id);
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to cancel subscription");
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "cancelled" } : s)),
      );
      toast.success("Subscription cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to cancel subscription");
    } finally {
      setCancelingId(null);
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

  const active = subscriptions.filter((s) => s.status === "active");

  if (active.length === 0) {
    return (
      <EmptyState
        icon={RefreshCw}
        heading="No active subscriptions"
        description="Subscribe to ELEV8 WATER for regular deliveries"
        ctaLabel="SUBSCRIBE NOW"
        ctaHref="/subscription"
      />
    );
  }

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-4xl space-y-4 px-6">
        {active.map((sub) => (
          <div
            key={sub.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl glass-card-light p-6"
          >
            <div>
              <p className="font-cormorant text-[22px] text-ink">{sub.product}</p>
              <p className="mt-1 font-inter text-[13px] text-muted">
                {sub.plan} · Next billing {formatDate(sub.next_billing_date)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-inter text-[16px] font-semibold text-violet">
                {formatCurrency(sub.amount)}
              </p>
              <button
                onClick={() => handleCancel(sub.id)}
                disabled={cancelingId === sub.id}
                className="rounded-full border border-red-300 px-4 py-2 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {cancelingId === sub.id ? "Cancelling…" : "Cancel"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
