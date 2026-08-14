"use client";

import { ShoppingBag } from "lucide-react";
import DataTable from "./DataTable";
import StatusBadge from "./StatusBadge";

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string | null;
  customer_email: string;
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

export default function RecentOrdersTable({ orders }: { orders: OrderRow[] }) {
  return (
    <DataTable<OrderRow>
      columns={[
        { header: "Order #", accessor: (r) => r.order_number },
        { header: "Customer", accessor: (r) => r.customer_name ?? r.customer_email },
        { header: "Total", accessor: (r) => formatCurrency(Number(r.total)) },
        { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
        { header: "Date", accessor: (r) => formatDate(r.created_at) },
      ]}
      rows={orders}
      rowKey={(r) => r.id}
      loading={false}
      error={null}
      onRetry={() => {}}
      emptyIcon={ShoppingBag}
      emptyMessage="No orders yet."
      page={1}
      totalPages={1}
      onPageChange={() => {}}
    />
  );
}
