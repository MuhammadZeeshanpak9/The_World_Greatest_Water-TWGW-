"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Tag } from "lucide-react";
import DataTable, { type Column } from "@/components/admin/DataTable";
import PillButton from "@/components/admin/PillButton";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type Order = {
  id: string;
  order_number: string;
  customer_name: string | null;
  customer_email: string;
  shipping_address: { city?: string; state?: string } | null;
  tracking_number: string | null;
  created_at: string;
};

type Tab = "processing" | "shipped" | "delivered";

const TABS: { key: Tab; label: string }[] = [
  { key: "processing", label: "Needs Label" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminShippingPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("processing");
  const [page, setPage] = useState(1);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    p.set("status", tab);
    p.set("page", String(page));
    return p.toString();
  }, [tab, page]);

  const { rows, total, loading, error, refetch } = useAdminTable<Order>(
    "/api/admin/orders",
    "orders",
    queryString,
  );

  const totalPages = Math.max(1, Math.ceil(total / 20));

  const columns: Column<Order>[] = [
    { header: "Order #", accessor: (r) => r.order_number },
    { header: "Customer", accessor: (r) => r.customer_name ?? r.customer_email },
    {
      header: "Shipping To",
      accessor: (r) =>
        r.shipping_address ? `${r.shipping_address.city ?? ""}, ${r.shipping_address.state ?? ""}` : "—",
    },
    { header: "Date", accessor: (r) => formatDate(r.created_at) },
    ...(tab === "processing"
      ? [
          {
            header: "Actions",
            accessor: (r: Order) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/admin/shipping/${r.id}`);
                }}
                className="flex items-center gap-1 rounded-lg bg-[#6B2FA0] px-3 py-1.5 font-inter text-xs font-semibold text-white hover:opacity-90"
              >
                <Tag size={12} /> Generate Label
              </button>
            ),
          } satisfies Column<Order>,
        ]
      : [
          {
            header: "Tracking #",
            accessor: (r: Order) => r.tracking_number ?? "—",
          } satisfies Column<Order>,
        ]),
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-cormorant text-4xl text-white">Shipping</h1>
      </div>

      <DataTable<Order>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={Truck}
        emptyMessage="No orders in this view."
        onRowClick={(r) => router.push(`/admin/shipping/${r.id}`)}
        filters={
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <PillButton
                key={t.key}
                active={tab === t.key}
                onClick={() => {
                  setTab(t.key);
                  setPage(1);
                }}
              >
                {t.label}
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
