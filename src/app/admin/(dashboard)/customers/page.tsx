"use client";

import { useMemo, useState } from "react";
import { Users, Download } from "lucide-react";
import DataTable, { type Column } from "@/components/admin/DataTable";
import SlideOver from "@/components/admin/SlideOver";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type Customer = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  total_orders: number;
  total_spent: number;
  created_at: string;
};

type CustomerOrder = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
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

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    p.set("page", String(page));
    return p.toString();
  }, [search, page]);

  const { rows, total, loading, error, refetch } = useAdminTable<Customer>(
    "/api/admin/customers",
    "customers",
    queryString,
  );

  const totalPages = Math.max(1, Math.ceil(total / 20));

  const exportUrl = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    p.set("export", "csv");
    return `/api/admin/customers?${p.toString()}`;
  }, [search]);

  async function openCustomer(customer: Customer) {
    setSelected(customer);
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`);
      const json = await res.json();
      setOrders(res.ok ? (json.orders ?? []) : []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }

  const columns: Column<Customer>[] = [
    { header: "Name", accessor: (r) => r.full_name ?? "—" },
    { header: "Email", accessor: (r) => r.email },
    { header: "Phone", accessor: (r) => r.phone ?? "—" },
    { header: "Total Orders", accessor: (r) => r.total_orders },
    { header: "Total Spent", accessor: (r) => formatCurrency(Number(r.total_spent ?? 0)) },
    { header: "Joined", accessor: (r) => formatDate(r.created_at) },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-cormorant text-4xl text-white">Customers</h1>
        <a
          href={exportUrl}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 font-inter text-sm text-white/80 hover:text-white"
        >
          <Download size={16} /> Export CSV
        </a>
      </div>

      <DataTable<Customer>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={Users}
        emptyMessage="No customers yet."
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search name or email…"
        onRowClick={openCustomer}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <SlideOver
        open={!!selected}
        title={selected?.full_name ?? selected?.email ?? ""}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-inter text-xs font-semibold tracking-wider text-white/40 uppercase">
                Contact
              </h3>
              <p className="font-inter text-sm text-white">{selected.email}</p>
              {selected.phone && (
                <p className="font-inter text-sm text-white/60">{selected.phone}</p>
              )}
            </div>

            <div>
              <h3 className="mb-2 font-inter text-xs font-semibold tracking-wider text-white/40 uppercase">
                Order History
              </h3>
              {ordersLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <p className="font-inter text-sm text-white/50">No orders yet.</p>
              ) : (
                <div className="space-y-2">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3"
                    >
                      <div>
                        <p className="font-inter text-sm text-white">{o.order_number}</p>
                        <p className="font-inter text-xs text-white/50">
                          {formatDate(o.created_at)} · {o.status}
                        </p>
                      </div>
                      <p className="font-inter text-sm text-white">
                        {formatCurrency(Number(o.total))}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}
