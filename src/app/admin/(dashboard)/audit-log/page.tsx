"use client";

import { useMemo, useState } from "react";
import { History } from "lucide-react";
import DataTable, { type Column } from "@/components/admin/DataTable";
import PillButton from "@/components/admin/PillButton";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type AuditEntry = {
  id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  created_at: string;
};

const TABLES = [
  "auth",
  "products",
  "orders",
  "subscriptions",
  "waitlist",
  "form_submissions",
  "blog_posts",
  "site_settings",
];

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AuditLogPage() {
  const [table, setTable] = useState("");
  const [page, setPage] = useState(1);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (table) p.set("table", table);
    p.set("page", String(page));
    return p.toString();
  }, [table, page]);

  const { rows, total, loading, error, refetch } = useAdminTable<AuditEntry>(
    "/api/admin/audit-log",
    "entries",
    queryString,
  );

  const totalPages = Math.max(1, Math.ceil(total / 20));

  const columns: Column<AuditEntry>[] = [
    { header: "Action", accessor: (r) => r.action },
    { header: "Table", accessor: (r) => r.table_name },
    { header: "Record ID", accessor: (r) => r.record_id ?? "—" },
    { header: "Performed At", accessor: (r) => formatDateTime(r.created_at) },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-cormorant text-4xl text-white">Audit Log</h1>
        <p className="mt-1 font-inter text-sm text-white/50">Read-only record of admin actions</p>
      </div>

      <DataTable<AuditEntry>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={History}
        emptyMessage="No activity recorded yet."
        filters={
          <div className="flex flex-wrap gap-2">
            <PillButton
              active={!table}
              onClick={() => {
                setTable("");
                setPage(1);
              }}
            >
              All
            </PillButton>
            {TABLES.map((t) => (
              <PillButton
                key={t}
                active={table === t}
                onClick={() => {
                  setTable(t);
                  setPage(1);
                }}
              >
                {t.replace(/_/g, " ")}
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
