"use client";

import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import toast from "react-hot-toast";
import DataTable, { type Column } from "@/components/admin/DataTable";
import SlideOver from "@/components/admin/SlideOver";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PillButton from "@/components/admin/PillButton";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type Submission = {
  id: string;
  form_type: string;
  data: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
};

const FORM_TYPES = [
  { value: "contact", label: "Contact" },
  { value: "wellness", label: "Wellness" },
  { value: "creators", label: "Creators" },
  { value: "join", label: "Join" },
  { value: "gift-cards", label: "Gift Cards" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function FormSubmissionsPage() {
  const [formType, setFormType] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (formType) p.set("form_type", formType);
    p.set("page", String(page));
    return p.toString();
  }, [formType, page]);

  const { rows, total, loading, error, refetch } = useAdminTable<Submission>(
    "/api/admin/form-submissions",
    "submissions",
    queryString,
  );

  const { total: unreadTotal, refetch: refetchUnread } = useAdminTable<Submission>(
    "/api/admin/form-submissions",
    "submissions",
    "unread=true&page=1",
  );

  const totalPages = Math.max(1, Math.ceil(total / 20));

  async function markRead(id: string, read: boolean) {
    try {
      const res = await fetch("/api/admin/form-submissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read }),
      });
      if (!res.ok) throw new Error("Failed to update");
      refetch();
      refetchUnread();
    } catch {
      toast.error("Failed to update read status");
    }
  }

  function openSubmission(submission: Submission) {
    setSelected(submission);
    if (!submission.read) markRead(submission.id, true);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/form-submissions/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Submission deleted");
      setDeleteId(null);
      setSelected(null);
      refetch();
      refetchUnread();
    } catch {
      toast.error("Failed to delete submission");
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Submission>[] = [
    {
      header: "Form Type",
      accessor: (r) => FORM_TYPES.find((f) => f.value === r.form_type)?.label ?? r.form_type,
    },
    { header: "Name", accessor: (r) => (r.data?.name as string) ?? "—" },
    { header: "Email", accessor: (r) => (r.data?.email as string) ?? "—" },
    { header: "Date", accessor: (r) => formatDate(r.created_at) },
    { header: "Status", accessor: (r) => (r.read ? "Read" : "Unread") },
    {
      header: "Actions",
      accessor: (r) => (
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              markRead(r.id, !r.read);
            }}
            className="font-inter text-xs text-[#6B2FA0] hover:underline"
          >
            {r.read ? "Mark Unread" : "Mark Read"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(r.id);
            }}
            className="font-inter text-xs text-[#EF4444] hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <h1 className="font-cormorant text-4xl text-white">Form Submissions</h1>
        {unreadTotal > 0 && (
          <span className="rounded-full bg-[#EF4444] px-2.5 py-1 font-inter text-xs font-semibold text-white">
            {unreadTotal} unread
          </span>
        )}
      </div>

      <DataTable<Submission>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={Inbox}
        emptyMessage="No submissions yet."
        onRowClick={openSubmission}
        rowClassName={(r) => (!r.read ? "border-l-2 border-l-[#6B2FA0] bg-[#6B2FA0]/5" : "")}
        filters={
          <div className="flex flex-wrap gap-2">
            <PillButton
              active={!formType}
              onClick={() => {
                setFormType("");
                setPage(1);
              }}
            >
              All
            </PillButton>
            {FORM_TYPES.map((f) => (
              <PillButton
                key={f.value}
                active={formType === f.value}
                onClick={() => {
                  setFormType(f.value);
                  setPage(1);
                }}
              >
                {f.label}
              </PillButton>
            ))}
          </div>
        }
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <SlideOver open={!!selected} title="Submission Detail" onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-inter text-xs font-semibold tracking-wider text-white/40 uppercase">
                {FORM_TYPES.find((f) => f.value === selected.form_type)?.label ??
                  selected.form_type}{" "}
                — {formatDate(selected.created_at)}
              </h3>
              <div className="space-y-3 rounded-lg border border-white/10 p-4">
                {Object.entries(selected.data ?? {}).map(([key, value]) => (
                  <div key={key}>
                    <p className="font-inter text-xs text-white/40 capitalize">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="font-inter text-sm whitespace-pre-wrap text-white">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setDeleteId(selected.id)}
              className="font-inter text-sm text-[#EF4444] hover:underline"
            >
              Delete Submission
            </button>
          </div>
        )}
      </SlideOver>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Submission"
        message="This will permanently delete this form submission."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
