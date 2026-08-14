"use client";

import { useMemo, useState } from "react";
import { Mail, Download } from "lucide-react";
import toast from "react-hot-toast";
import DataTable, { type Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type WaitlistEntry = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function WaitlistPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    p.set("page", String(page));
    return p.toString();
  }, [search, page]);

  const { rows, total, loading, error, refetch } = useAdminTable<WaitlistEntry>(
    "/api/admin/waitlist",
    "waitlist",
    queryString,
  );

  const totalPages = Math.max(1, Math.ceil(total / 20));

  const exportUrl = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    p.set("export", "csv");
    return `/api/admin/waitlist?${p.toString()}`;
  }, [search]);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/waitlist/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete entry");
      toast.success("Entry deleted");
      setDeleteId(null);
      refetch();
    } catch {
      toast.error("Failed to delete entry");
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<WaitlistEntry>[] = [
    { header: "Email", accessor: (r) => r.email },
    { header: "Source", accessor: (r) => r.source ?? "—" },
    { header: "Date Joined", accessor: (r) => formatDate(r.created_at) },
    {
      header: "Actions",
      accessor: (r) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDeleteId(r.id);
          }}
          className="font-inter text-xs text-[#EF4444] hover:underline"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-cormorant text-4xl text-white">Waitlist</h1>
          <p className="mt-1 font-inter text-sm text-white/50">{total} total signups</p>
        </div>
        <a
          href={exportUrl}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 font-inter text-sm text-white/80 hover:text-white"
        >
          <Download size={16} /> Export CSV
        </a>
      </div>

      <DataTable<WaitlistEntry>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={Mail}
        emptyMessage="No signups yet."
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search email…"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Entry"
        message="This will permanently remove this email from the waitlist."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
