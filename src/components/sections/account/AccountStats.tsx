"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type AccountData = {
  profile: { full_name: string | null; email: string; created_at: string } | null;
  stats: { totalOrders: number; totalSpent: number; activeSubscriptions: number };
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatMemberSince(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function AccountStats() {
  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/account");
        if (!res.ok) throw new Error("Failed to load account");
        const json = await res.json();
        if (!cancelled) setData(json);
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

  const stats = [
    {
      label: "ORDERS",
      value: `${data?.stats.totalOrders ?? 0} orders`,
      href: "/account/orders",
    },
    {
      label: "TOTAL SPENT",
      value: formatCurrency(data?.stats.totalSpent ?? 0),
      href: "/account/orders",
    },
    {
      label: "SUBSCRIPTIONS",
      value: `${data?.stats.activeSubscriptions ?? 0} active`,
      href: "/account/subscriptions",
    },
    { label: "COURSES", value: "0 enrolled", href: "/account/courses" },
  ];

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {loading ? (
          <div className="h-9 w-64 animate-pulse rounded bg-violet/10" />
        ) : error ? (
          <h2 className="font-cormorant text-[36px] text-ink">Welcome back</h2>
        ) : (
          <>
            <h2 className="font-cormorant text-[36px] text-ink">
              Welcome back{data?.profile?.full_name ? `, ${data.profile.full_name}` : ""}
            </h2>
            <p className="mt-1 font-inter text-[13px] text-muted">
              {data?.profile?.email}
              {data?.profile?.created_at &&
                ` · Member since ${formatMemberSince(data.profile.created_at)}`}
            </p>
          </>
        )}

        {error ? (
          <p className="mt-10 font-inter text-[14px] text-red-600">
            Unable to load your account right now. Please try again later.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <m.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={stat.href}
                  className="group block rounded-[20px] glass-card-light p-6 transition-shadow hover:shadow-[0_20px_50px_rgba(107,47,160,0.12)]"
                >
                  <p className="font-cormorant text-[32px] text-violet">
                    {loading ? (
                      <span className="inline-block h-8 w-16 animate-pulse rounded bg-violet/10 align-middle" />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
                      {stat.label}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-violet opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </div>
                </Link>
              </m.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
