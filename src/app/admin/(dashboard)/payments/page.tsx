"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, Download, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import PillButton from "@/components/admin/PillButton";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type Order = {
  id: string;
  order_number: string;
  customer_name: string | null;
  customer_email: string;
  total: number;
  payment_method: string | null;
  payment_status: string;
  created_at: string;
};

const METHOD_OPTIONS = [
  { value: "stripe", label: "Stripe" },
  { value: "paypal", label: "PayPal" },
  { value: "crypto", label: "Crypto" },
  { value: "unselected", label: "Pending" },
];

const STATUS_OPTIONS = ["paid", "pending", "failed", "refunded"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminPaymentsPage() {
  const [method, setMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [refundTarget, setRefundTarget] = useState<Order | null>(null);
  const [refunding, setRefunding] = useState(false);

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((res) => res.json())
      .then((json) => setTotalRevenue(json.totalRevenue ?? 0))
      .catch(() => setTotalRevenue(0));

    fetch("/api/payments/status")
      .then((res) => res.json())
      .then((json) => setStripeEnabled(!!json.stripe))
      .catch(() => setStripeEnabled(false));
  }, []);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (method) p.set("method", method);
    if (paymentStatus) p.set("paymentStatus", paymentStatus);
    p.set("page", String(page));
    return p.toString();
  }, [method, paymentStatus, page]);

  const { rows, total, loading, error, refetch } = useAdminTable<Order>(
    "/api/admin/payments",
    "orders",
    queryString,
  );

  const totalPages = Math.max(1, Math.ceil(total / 20));

  const exportUrl = useMemo(() => {
    const p = new URLSearchParams();
    if (method) p.set("method", method);
    if (paymentStatus) p.set("paymentStatus", paymentStatus);
    p.set("export", "csv");
    return `/api/admin/payments?${p.toString()}`;
  }, [method, paymentStatus]);

  async function handleRefund() {
    if (!refundTarget) return;
    setRefunding(true);
    try {
      const res = await fetch(`/api/admin/orders/${refundTarget.id}/refund`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to process refund");
      toast.success("Refund processed");
      setRefundTarget(null);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to process refund");
    } finally {
      setRefunding(false);
    }
  }

  const columns: Column<Order>[] = [
    { header: "Order #", accessor: (r) => r.order_number },
    { header: "Customer", accessor: (r) => r.customer_name ?? r.customer_email },
    { header: "Amount", accessor: (r) => formatCurrency(Number(r.total)) },
    {
      header: "Method",
      accessor: (r) => (r.payment_method ? <StatusBadge status={r.payment_method} /> : "—"),
    },
    { header: "Status", accessor: (r) => <StatusBadge status={r.payment_status} /> },
    { header: "Date", accessor: (r) => formatDate(r.created_at) },
    {
      header: "Actions",
      accessor: (r) =>
        r.payment_status === "paid" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (stripeEnabled) setRefundTarget(r);
            }}
            disabled={!stripeEnabled}
            title={!stripeEnabled ? "Refunds available after payment integration" : undefined}
            className="font-inter text-xs text-[#6B2FA0] hover:underline disabled:cursor-not-allowed disabled:text-white/30 disabled:no-underline"
          >
            Refund
          </button>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-cormorant text-4xl text-white">Payments</h1>
        <a
          href={exportUrl}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 font-inter text-sm text-white/80 hover:text-white"
        >
          <Download size={16} /> Export CSV
        </a>
      </div>

      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-6">
        <DollarSign size={22} className="text-[#6B2FA0]" />
        <div className="mt-4 font-cormorant text-4xl text-white">
          {totalRevenue === null ? "…" : formatCurrency(totalRevenue)}
        </div>
        <div className="mt-1 font-inter text-sm text-white/50">Total Revenue (Paid Orders)</div>
      </div>

      <DataTable<Order>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={CreditCard}
        emptyMessage="No payment transactions yet."
        filters={
          <div className="flex flex-wrap gap-2">
            <PillButton
              active={!method}
              onClick={() => {
                setMethod("");
                setPage(1);
              }}
            >
              All Methods
            </PillButton>
            {METHOD_OPTIONS.map((m) => (
              <PillButton
                key={m.value}
                active={method === m.value}
                onClick={() => {
                  setMethod(m.value);
                  setPage(1);
                }}
              >
                {m.label}
              </PillButton>
            ))}
            <span className="mx-1 self-center h-4 w-px bg-white/10" />
            <PillButton
              active={!paymentStatus}
              onClick={() => {
                setPaymentStatus("");
                setPage(1);
              }}
            >
              All Statuses
            </PillButton>
            {STATUS_OPTIONS.map((s) => (
              <PillButton
                key={s}
                active={paymentStatus === s}
                onClick={() => {
                  setPaymentStatus(s);
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

      <ConfirmDialog
        open={!!refundTarget}
        title="Refund This Order?"
        message={`This will refund ${formatCurrency(Number(refundTarget?.total ?? 0))} to the customer's original payment method via Stripe. This cannot be undone.`}
        confirmLabel="Refund"
        loadingLabel="Processing…"
        loading={refunding}
        onConfirm={handleRefund}
        onCancel={() => setRefundTarget(null)}
      />
    </div>
  );
}
