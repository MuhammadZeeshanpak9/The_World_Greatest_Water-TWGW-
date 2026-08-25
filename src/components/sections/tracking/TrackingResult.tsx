"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageSearch } from "lucide-react";

type TrackingEvent = { status: string; detail: string; date: string | null; location: string | null };

type TrackingData = {
  found: boolean;
  order_number?: string;
  carrier?: string | null;
  service?: string | null;
  status?: string;
  estimated_delivery?: string | null;
  events?: TrackingEvent[];
  message?: string;
};

const STATUS_STYLES: Record<string, string> = {
  PRE_TRANSIT: "bg-amber-100 text-amber-700",
  TRANSIT: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  RETURNED: "bg-red-100 text-red-700",
  FAILURE: "bg-red-100 text-red-700",
  UNKNOWN: "bg-muted/10 text-muted",
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TrackingResult({ trackingNumber }: { trackingNumber: string }) {
  const [data, setData] = useState<TrackingData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/shipping/tracking/${encodeURIComponent(trackingNumber)}`);
        if (!res.ok) throw new Error("Failed to load tracking");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [trackingNumber]);

  if (error) {
    return (
      <section className="bg-white py-24 text-center md:py-32">
        <p className="font-inter text-red-600">Unable to load tracking information right now.</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-2xl space-y-4 px-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-violet/5" />
          ))}
        </div>
      </section>
    );
  }

  if (!data.found) {
    return (
      <section className="bg-white py-24 text-center md:py-32">
        <div className="mx-auto max-w-md px-6">
          <PackageSearch size={32} className="mx-auto text-violet/40" />
          <p className="mt-4 font-cormorant text-2xl text-ink">
            Tracking information not yet available.
          </p>
          <p className="mt-2 font-inter text-[14px] text-muted">
            Please check back in 24 hours after shipping.
          </p>
          <Link href="/contact" className="mt-6 inline-block font-inter text-[13px] text-violet hover:underline">
            Contact us about a delivery issue
          </Link>
        </div>
      </section>
    );
  }

  const events = data.events ?? [];

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-6">
        <div className="rounded-2xl glass-card-light p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              {data.order_number && (
                <p className="font-cormorant text-[22px] text-ink">{data.order_number}</p>
              )}
              <p className="mt-1 font-inter text-[13px] text-muted">
                {data.carrier ?? "Carrier"} {data.service ? `— ${data.service}` : ""}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 font-inter text-[10px] font-semibold uppercase tracking-[0.15em] ${
                STATUS_STYLES[data.status ?? "UNKNOWN"] ?? STATUS_STYLES.UNKNOWN
              }`}
            >
              {(data.status ?? "unknown").replace(/_/g, " ")}
            </span>
          </div>

          {data.estimated_delivery && (
            <p className="mt-4 font-inter text-[13px] text-body">
              Estimated delivery: <strong>{formatDate(data.estimated_delivery)}</strong>
            </p>
          )}

          {data.message && (
            <p className="mt-4 font-inter text-[13px] text-muted italic">{data.message}</p>
          )}

          {events.length > 0 && (
            <div className="mt-6 flex flex-col gap-4 border-t border-violet/10 pt-6">
              {events.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet" />
                  <div>
                    <p className="font-inter text-[13px] text-ink">{event.detail}</p>
                    <p className="mt-0.5 font-inter text-[12px] text-muted">
                      {[formatDate(event.date), event.location].filter(Boolean).join(" — ") || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-6 text-center font-inter text-[13px] text-muted">
          Delivery issue? <Link href="/contact" className="text-violet hover:underline">Contact us</Link>
        </p>
      </div>
    </section>
  );
}
