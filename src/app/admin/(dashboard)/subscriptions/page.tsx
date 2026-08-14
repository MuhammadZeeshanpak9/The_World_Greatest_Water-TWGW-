"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import PillButton from "@/components/admin/PillButton";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type Subscription = {
  id: string;
  customer_name: string | null;
  customer_email: string;
  plan: string;
  product: string;
  status: "active" | "paused" | "cancelled";
  amount: number;
  next_billing_date: string | null;
};

const STATUS_OPTIONS = ["active", "paused", "cancelled"] as const;

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

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (status) p.set("status", status);
    p.set("page", String(page));
    return p.toString();
  }, [search, status, page]);

  const { rows, total, loading, error, refetch } = useAdminTable<Subscription>(
    "/api/admin/subscriptions",
    "subscriptions",
    queryString,
  );

  const totalPages = Math.max(1, Math.ceil(total / 20));

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update subscription");
      toast.success(`Subscription ${newStatus}`);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update subscription");
    } finally {
      setUpdatingId(null);
    }
  }

  const columns: Column<Subscription>[] = [
    { header: "Customer", accessor: (r) => r.customer_name ?? r.customer_email },
    { header: "Plan", accessor: (r) => r.plan },
    { header: "Product", accessor: (r) => r.product },
    { header: "Amount", accessor: (r) => formatCurrency(Number(r.amount)) },
    { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
    { header: "Next Billing", accessor: (r) => formatDate(r.next_billing_date) },
    {
      header: "Actions",
      accessor: (r) => (
        <div className="flex gap-3">
          {r.status !== "active" && (
            <ActionButton
              disabled={updatingId === r.id}
              onClick={() => updateStatus(r.id, "active")}
            >
              Reactivate
            </ActionButton>
          )}
          {r.status === "active" && (
            <ActionButton
              disabled={updatingId === r.id}
              onClick={() => updateStatus(r.id, "paused")}
            >
              Pause
            </ActionButton>
          )}
          {r.status !== "cancelled" && (
            <ActionButton
              danger
              disabled={updatingId === r.id}
              onClick={() => updateStatus(r.id, "cancelled")}
            >
              Cancel
            </ActionButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-cormorant text-4xl text-white">Subscriptions</h1>
      </div>

      <DataTable<Subscription>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={RefreshCw}
        emptyMessage="No subscriptions yet."
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search customer…"
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
    </div>
  );
}

function ActionButton({
  onClick,
  disabled,
  danger,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={`font-inter text-xs hover:underline disabled:opacity-40 ${danger ? "text-[#EF4444]" : "text-[#6B2FA0]"}`}
    >
      {children}
    </button>
  );
}
