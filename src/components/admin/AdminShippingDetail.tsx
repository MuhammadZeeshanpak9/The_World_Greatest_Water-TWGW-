"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

type Order = {
  id: string;
  order_number: string;
  customer_name: string | null;
  customer_email: string;
  status: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  shipping_address: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  shipping_carrier: string | null;
  shipping_service: string | null;
  tracking_number: string | null;
};

type Rate = { id: string; carrier: string; service: string; rate: number; days: string };
type TrackingEvent = { status: string; detail: string; date: string | null; location: string | null };

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function AdminShippingDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const [rates, setRates] = useState<Rate[] | null>(null);
  const [fetchingRates, setFetchingRates] = useState(false);
  const [ratesMessage, setRatesMessage] = useState<string | null>(null);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [generatingLabel, setGeneratingLabel] = useState(false);

  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[] | null>(null);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to load order");
      setOrder(json.order);
    } catch {
      toast.error("Unable to load order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    // Standard fetch-on-mount pattern — loadOrder's setLoading(true) runs synchronously before
    // the network call, which the set-state-in-effect rule flags (same as useAdminTable.ts).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrder();
  }, [loadOrder]);

  useEffect(() => {
    if (!order?.tracking_number) return;
    fetch(`/api/shipping/tracking/${order.tracking_number}`)
      .then((res) => res.json())
      .then((json) => setTrackingEvents(json.events ?? []))
      .catch(() => setTrackingEvents([]));
  }, [order?.tracking_number]);

  async function handleGetRates() {
    setFetchingRates(true);
    setRatesMessage(null);
    try {
      const res = await fetch("/api/admin/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to fetch rates");
      setRates(json.rates ?? []);
      if (json.message) setRatesMessage(json.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to fetch rates");
    } finally {
      setFetchingRates(false);
    }
  }

  async function handleGenerateLabel() {
    if (!rates) return;
    const rate = rates.find((r) => r.id === selectedRateId);
    if (!rate) return;

    setGeneratingLabel(true);
    try {
      const res = await fetch("/api/shipping/label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          rateId: rate.id,
          carrier: rate.carrier,
          service: rate.service,
          rateAmount: rate.rate,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to generate label");
      toast.success(`Label generated — tracking ${json.tracking_number}`);
      await loadOrder();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to generate label");
    } finally {
      setGeneratingLabel(false);
    }
  }

  if (loading) {
    return <div className="h-40 animate-pulse rounded-xl bg-white/5" />;
  }

  if (!order) {
    return <p className="font-inter text-sm text-white/50">Order not found.</p>;
  }

  return (
    <div>
      <Link
        href="/admin/shipping"
        className="mb-4 inline-flex items-center gap-2 font-inter text-sm text-white/60 hover:text-white"
      >
        <ArrowLeft size={14} /> Back to Shipping
      </Link>

      <h1 className="font-cormorant text-4xl text-white">{order.order_number}</h1>
      <p className="mt-1 font-inter text-sm text-white/50">{order.customer_name ?? order.customer_email}</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-cormorant text-xl text-white">Shipping Address</h2>
          <p className="mt-3 font-inter text-sm text-white/70">
            {order.shipping_address.address1}
            {order.shipping_address.address2 ? `, ${order.shipping_address.address2}` : ""}
            <br />
            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
            <br />
            {order.shipping_address.country}
          </p>

          <h2 className="mt-6 font-cormorant text-xl text-white">Items</h2>
          <ul className="mt-3 space-y-1">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between font-inter text-sm text-white/70">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          {order.tracking_number ? (
            <>
              <h2 className="font-cormorant text-xl text-white">Tracking</h2>
              <p className="mt-2 font-inter text-sm text-white/70">
                {order.shipping_carrier} — {order.shipping_service}
              </p>
              <p className="mt-1 font-inter text-sm text-white">{order.tracking_number}</p>

              {trackingEvents === null ? (
                <div className="mt-4 h-16 animate-pulse rounded-lg bg-white/5" />
              ) : trackingEvents.length === 0 ? (
                <p className="mt-4 font-inter text-xs text-white/40">No tracking history yet.</p>
              ) : (
                <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                  {trackingEvents.map((event, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#6B2FA0]" />
                      <div>
                        <p className="font-inter text-xs text-white/80">{event.detail}</p>
                        <p className="mt-0.5 font-inter text-[11px] text-white/40">
                          {[event.date, event.location].filter(Boolean).join(" — ") || "—"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="font-cormorant text-xl text-white">Generate Label</h2>

              {!rates && (
                <button
                  onClick={handleGetRates}
                  disabled={fetchingRates}
                  className="mt-4 rounded-lg bg-[#6B2FA0] px-4 py-2.5 font-inter text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {fetchingRates ? "Fetching Rates…" : "Get Shipping Rates"}
                </button>
              )}

              {ratesMessage && <p className="mt-3 font-inter text-xs text-white/50">{ratesMessage}</p>}

              {rates && rates.length > 0 && (
                <div className="mt-4 space-y-2">
                  {rates.map((rate) => (
                    <label
                      key={rate.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 has-[:checked]:border-[#6B2FA0]"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="rate"
                          checked={selectedRateId === rate.id}
                          onChange={() => setSelectedRateId(rate.id)}
                          className="h-4 w-4 accent-[#6B2FA0]"
                        />
                        <span className="font-inter text-sm text-white">
                          {rate.carrier} — {rate.service}{" "}
                          <span className="text-white/40">({rate.days} days)</span>
                        </span>
                      </span>
                      <span className="font-inter text-sm font-semibold text-[#6B2FA0]">
                        {formatCurrency(rate.rate)}
                      </span>
                    </label>
                  ))}

                  <button
                    onClick={handleGenerateLabel}
                    disabled={!selectedRateId || generatingLabel}
                    className="mt-2 w-full rounded-lg bg-[#6B2FA0] py-3 font-inter text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {generatingLabel ? "Generating…" : "Generate Label"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
