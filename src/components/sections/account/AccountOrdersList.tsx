"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { DbOrder } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-teal/15 text-teal",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AccountOrdersList() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<DbOrder | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to load orders");
        const json = await res.json();
        if (!cancelled) setOrders(json.orders ?? []);
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

  async function handleCancelConfirmed() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${cancelTarget.id}/cancel`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to cancel order");
      setOrders((prev) =>
        prev.map((o) => (o.id === cancelTarget.id ? { ...o, status: "cancelled" } : o)),
      );
      toast.success("Order cancelled");
      setCancelTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to cancel order");
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-4xl space-y-4 px-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-violet/5" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-24 text-center md:py-32">
        <p className="font-inter text-red-600">
          Unable to load your orders right now. Please try again later.
        </p>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Box}
        heading="No orders yet"
        description="Your order history will appear here once you make your first purchase"
        ctaLabel="SHOP NOW"
        ctaHref="/shop"
      />
    );
  }

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-4xl space-y-4 px-6">
        {orders.map((order) => {
          const isOpen = expandedId === order.id;
          return (
            <div key={order.id} className="overflow-hidden rounded-2xl glass-card-light">
              <button
                onClick={() => setExpandedId(isOpen ? null : order.id)}
                className="flex w-full flex-wrap items-center justify-between gap-4 p-6 text-left"
              >
                <div>
                  <p className="font-cormorant text-[20px] text-ink">{order.order_number}</p>
                  <p className="mt-1 font-inter text-[13px] text-muted">
                    {formatDate(order.created_at)} · {order.items.length} item
                    {order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-3 py-1 font-inter text-[10px] font-semibold uppercase tracking-[0.15em] ${STATUS_STYLES[order.status] ?? "bg-muted/10 text-muted"}`}
                  >
                    {order.status}
                  </span>
                  <p className="font-inter text-[16px] font-semibold text-violet">
                    {formatCurrency(order.total)}
                  </p>
                  <ChevronDown
                    size={18}
                    className={`text-violet transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-violet/10 p-6">
                  <ul className="flex flex-col gap-2">
                    {order.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex justify-between font-inter text-[14px] text-body"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  {order.shipping_address && (
                    <p className="mt-4 font-inter text-[13px] text-muted">
                      Shipping to {order.shipping_address.address1}, {order.shipping_address.city}
                      , {order.shipping_address.state} {order.shipping_address.zip}
                    </p>
                  )}

                  {order.tracking_number && (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/track/${order.tracking_number}`}
                        className="font-inter text-[12px] font-semibold tracking-[0.1em] text-violet uppercase hover:underline"
                      >
                        Track Order →
                      </Link>
                      {order.shipping_carrier && (
                        <span className="font-inter text-[12px] text-muted">
                          via {order.shipping_carrier}
                          {order.shipping_service ? ` — ${order.shipping_service}` : ""}
                        </span>
                      )}
                    </div>
                  )}

                  {order.status === "pending" && (
                    <button
                      onClick={() => setCancelTarget(order)}
                      className="mt-4 font-inter text-[12px] font-semibold tracking-[0.1em] text-red-600 uppercase hover:underline"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel This Order?"
        message={`This will cancel order ${cancelTarget?.order_number}. This cannot be undone.`}
        confirmLabel="Cancel Order"
        loadingLabel="Cancelling…"
        loading={cancelling}
        onConfirm={handleCancelConfirmed}
        onCancel={() => setCancelTarget(null)}
      />
    </section>
  );
}
