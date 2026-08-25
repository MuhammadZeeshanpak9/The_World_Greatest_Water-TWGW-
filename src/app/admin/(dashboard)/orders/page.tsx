"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Download, Tag } from "lucide-react";
import toast from "react-hot-toast";
import DataTable, { type Column } from "@/components/admin/DataTable";
import SlideOver from "@/components/admin/SlideOver";
import StatusBadge from "@/components/admin/StatusBadge";
import PillButton from "@/components/admin/PillButton";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type Order = {
  id: string;
  order_number: string;
  customer_name: string | null;
  customer_email: string;
  status: string;
  payment_status: string;
  total: number;
  items: unknown;
  shipping_address: Record<string, unknown> | null;
  tracking_number: string | null;
  created_at: string;
};

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

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

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [stripeEnabled, setStripeEnabled] = useState(false);

  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [markingDelivered, setMarkingDelivered] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"cancel" | "refund" | null>(null);

  useEffect(() => {
    fetch("/api/payments/status")
      .then((res) => res.json())
      .then((json) => setStripeEnabled(!!json.stripe))
      .catch(() => setStripeEnabled(false));
  }, []);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (status) p.set("status", status);
    p.set("page", String(page));
    return p.toString();
  }, [search, status, page]);

  const { rows, total, loading, error, refetch } = useAdminTable<Order>(
    "/api/admin/orders",
    "orders",
    queryString,
  );

  const totalPages = Math.max(1, Math.ceil(total / 20));

  const exportUrl = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (status) p.set("status", status);
    p.set("export", "csv");
    return `/api/admin/orders?${p.toString()}`;
  }, [search, status]);

  async function handleStatusUpdate(newStatus: string) {
    if (!detailOrder) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${detailOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update status");
      toast.success("Order status updated");
      setDetailOrder(json.order);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleMarkDelivered() {
    if (!detailOrder) return;
    setMarkingDelivered(true);
    try {
      const res = await fetch(`/api/admin/orders/${detailOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "delivered" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to mark delivered");
      toast.success("Order marked delivered");
      setDetailOrder(json.order);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark delivered");
    } finally {
      setMarkingDelivered(false);
    }
  }

  async function handleCancel() {
    if (!detailOrder) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/admin/orders/${detailOrder.id}/cancel`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to cancel order");
      toast.success("Order cancelled");
      setDetailOrder(json.order);
      setConfirmAction(null);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  }

  async function handleRefund() {
    if (!detailOrder) return;
    setRefunding(true);
    try {
      const res = await fetch(`/api/admin/orders/${detailOrder.id}/refund`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to process refund");
      toast.success("Refund processed");
      setDetailOrder(json.order);
      setConfirmAction(null);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to process refund");
    } finally {
      setRefunding(false);
    }
  }

  const columns: Column<Order>[] = [
    { header: "Order #", accessor: (r) => r.order_number },
    { header: "Customer", accessor: (r) => r.customer_name ?? r.customer_email },
    { header: "Total", accessor: (r) => formatCurrency(Number(r.total)) },
    { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
    { header: "Tracking #", accessor: (r) => r.tracking_number ?? "—" },
    { header: "Date", accessor: (r) => formatDate(r.created_at) },
    {
      header: "Actions",
      accessor: (r) => (
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setDetailOrder(r)}
            className="font-inter text-xs text-[#6B2FA0] hover:underline"
          >
            View
          </button>
          {r.status === "processing" && !r.tracking_number && (
            <button
              onClick={() => router.push(`/admin/shipping/${r.id}`)}
              className="flex items-center gap-1 font-inter text-xs text-[#6B2FA0] hover:underline"
            >
              <Tag size={12} /> Label
            </button>
          )}
        </div>
      ),
    },
  ];

  const canRefund = stripeEnabled && detailOrder?.payment_status === "paid";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-cormorant text-4xl text-white">Orders</h1>
        <a
          href={exportUrl}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 font-inter text-sm text-white/80 hover:text-white"
        >
          <Download size={16} /> Export CSV
        </a>
      </div>

      <DataTable<Order>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={ShoppingBag}
        emptyMessage="No orders yet."
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search order # or email…"
        onRowClick={(r) => setDetailOrder(r)}
        filters={
          <div className="flex flex-wrap gap-2">
            <PillButton
              active={!status}
              onClick={() => {
                setStatus("");
                setPage(1);
              }}
            >
              All
            </PillButton>
            {STATUS_OPTIONS.map((s) => (
              <PillButton
                key={s}
                active={status === s}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
              >
                {s}
              </PillButton>
            ))}
          </div>
        }
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <SlideOver
        open={!!detailOrder}
        title={detailOrder ? `Order ${detailOrder.order_number}` : ""}
        onClose={() => setDetailOrder(null)}
      >
        {detailOrder && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-inter text-xs font-semibold tracking-wider text-white/40 uppercase">
                Customer
              </h3>
              <p className="font-inter text-sm text-white">{detailOrder.customer_name ?? "—"}</p>
              <p className="font-inter text-sm text-white/60">{detailOrder.customer_email}</p>
            </div>

            {detailOrder.shipping_address && (
              <div>
                <h3 className="mb-2 font-inter text-xs font-semibold tracking-wider text-white/40 uppercase">
                  Shipping Address
                </h3>
                <pre className="overflow-x-auto rounded-lg bg-black/30 p-3 font-inter text-xs whitespace-pre-wrap text-white/70">
                  {JSON.stringify(detailOrder.shipping_address, null, 2)}
                </pre>
              </div>
            )}

            {detailOrder.tracking_number && (
              <div>
                <h3 className="mb-2 font-inter text-xs font-semibold tracking-wider text-white/40 uppercase">
                  Tracking
                </h3>
                <p className="font-inter text-sm text-white">{detailOrder.tracking_number}</p>
              </div>
            )}

            <div>
              <h3 className="mb-2 font-inter text-xs font-semibold tracking-wider text-white/40 uppercase">
                Items
              </h3>
              <pre className="overflow-x-auto rounded-lg bg-black/30 p-3 font-inter text-xs whitespace-pre-wrap text-white/70">
                {JSON.stringify(detailOrder.items, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="mb-2 font-inter text-xs font-semibold tracking-wider text-white/40 uppercase">
                Total
              </h3>
              <p className="font-cormorant text-2xl text-white">
                {formatCurrency(Number(detailOrder.total))}
              </p>
              <p className="mt-1 font-inter text-xs text-white/40 uppercase">
                Payment: {detailOrder.payment_status}
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-inter text-xs font-semibold tracking-wider text-white/40 uppercase">
                Update Status
              </h3>
              <select
                value={detailOrder.status}
                disabled={updatingStatus}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none disabled:opacity-50"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="bg-[#0F0A1E]">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 border-t border-white/10 pt-6">
              <h3 className="font-inter text-xs font-semibold tracking-wider text-white/40 uppercase">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                {detailOrder.status !== "delivered" && detailOrder.status !== "cancelled" && (
                  <button
                    onClick={handleMarkDelivered}
                    disabled={markingDelivered}
                    className="rounded-lg border border-white/10 px-4 py-2 font-inter text-sm text-white/80 hover:text-white disabled:opacity-50"
                  >
                    {markingDelivered ? "Marking…" : "Mark Delivered"}
                  </button>
                )}
                {detailOrder.status !== "cancelled" && (
                  <button
                    onClick={() => setConfirmAction("cancel")}
                    className="rounded-lg border border-white/10 px-4 py-2 font-inter text-sm text-[#EF4444] hover:opacity-90"
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  onClick={() => canRefund && setConfirmAction("refund")}
                  disabled={!canRefund}
                  title={
                    !stripeEnabled
                      ? "Refunds available after payment integration"
                      : detailOrder.payment_status !== "paid"
                        ? "Only paid orders can be refunded"
                        : undefined
                  }
                  className="rounded-lg border border-white/10 px-4 py-2 font-inter text-sm text-white/80 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {stripeEnabled ? "Refund" : "Refunds available after payment integration"}
                </button>
              </div>
            </div>
          </div>
        )}
      </SlideOver>

      <ConfirmDialog
        open={confirmAction === "cancel"}
        title="Cancel This Order?"
        message={`This will cancel order ${detailOrder?.order_number}. The customer will be notified by email. This cannot be undone.`}
        confirmLabel="Cancel Order"
        loadingLabel="Cancelling…"
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmDialog
        open={confirmAction === "refund"}
        title="Refund This Order?"
        message={`This will refund ${formatCurrency(Number(detailOrder?.total ?? 0))} to the customer's original payment method via Stripe. This cannot be undone.`}
        confirmLabel="Refund"
        loadingLabel="Processing…"
        loading={refunding}
        onConfirm={handleRefund}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
