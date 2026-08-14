"use client";

import { useMemo, useState } from "react";
import { ShoppingBag, Download } from "lucide-react";
import toast from "react-hot-toast";
import DataTable, { type Column } from "@/components/admin/DataTable";
import SlideOver from "@/components/admin/SlideOver";
import StatusBadge from "@/components/admin/StatusBadge";
import PillButton from "@/components/admin/PillButton";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type Order = {
  id: string;
  order_number: string;
  customer_name: string | null;
  customer_email: string;
  status: string;
  total: number;
  items: unknown;
  shipping_address: Record<string, unknown> | null;
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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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

  const columns: Column<Order>[] = [
    { header: "Order #", accessor: (r) => r.order_number },
    { header: "Customer", accessor: (r) => r.customer_name ?? r.customer_email },
    { header: "Total", accessor: (r) => formatCurrency(Number(r.total)) },
    { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
    { header: "Date", accessor: (r) => formatDate(r.created_at) },
    {
      header: "Actions",
      accessor: (r) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDetailOrder(r);
          }}
          className="font-inter text-xs text-[#6B2FA0] hover:underline"
        >
          View
        </button>
      ),
    },
  ];

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
          </div>
        )}
      </SlideOver>
    </div>
  );
}
