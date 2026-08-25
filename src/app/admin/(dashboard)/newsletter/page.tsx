"use client";

import { useCallback, useEffect, useState } from "react";
import { Send, Plus } from "lucide-react";
import toast from "react-hot-toast";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import SlideOver from "@/components/admin/SlideOver";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type Campaign = {
  id: string;
  subject: string;
  content: string;
  status: "draft" | "sent";
  recipient_count: number;
  sent_at: string | null;
  created_at: string;
};

const EMPTY_FORM = { subject: "", content: "" };

export default function AdminNewsletterPage() {
  const { rows, loading, error, refetch } = useAdminTable<Campaign>(
    "/api/admin/newsletter",
    "campaigns",
    "",
  );

  const [recipientCount, setRecipientCount] = useState<number | null>(null);

  const loadRecipientCount = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/newsletter/recipient-count");
      const json = await res.json();
      setRecipientCount(json.count ?? 0);
    } catch {
      setRecipientCount(null);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecipientCount();
  }, [loadRecipientCount]);

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [sendCampaign, setSendCampaign] = useState<Campaign | null>(null);
  const [sending, setSending] = useState(false);

  const [testingId, setTestingId] = useState<string | null>(null);

  function openAdd() {
    setEditingCampaign(null);
    setForm(EMPTY_FORM);
    setSlideOverOpen(true);
  }

  function openEdit(campaign: Campaign) {
    if (campaign.status !== "draft") {
      toast.error("Only draft campaigns can be edited");
      return;
    }
    setEditingCampaign(campaign);
    setForm({ subject: campaign.subject, content: campaign.content });
    setSlideOverOpen(true);
  }

  async function handleSave() {
    if (!form.subject.trim() || !form.content.trim()) {
      toast.error("Subject and content are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        editingCampaign ? `/api/admin/newsletter/${editingCampaign.id}` : "/api/admin/newsletter",
        {
          method: editingCampaign ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to save campaign");
      toast.success(editingCampaign ? "Campaign updated" : "Campaign created");
      setSlideOverOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to save campaign");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/newsletter/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to delete campaign");
      toast.success("Campaign deleted");
      setDeleteId(null);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to delete campaign");
    } finally {
      setDeleting(false);
    }
  }

  async function handleTest(campaignId: string) {
    setTestingId(campaignId);
    try {
      const res = await fetch(`/api/admin/newsletter/${campaignId}/test`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to send test email");
      toast.success(`Test sent to ${json.sentTo}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to send test email");
    } finally {
      setTestingId(null);
    }
  }

  async function handleSend() {
    if (!sendCampaign) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/newsletter/${sendCampaign.id}/send`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to send campaign");
      toast.success(`Sent to ${json.recipientCount} subscribers`);
      setSendCampaign(null);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to send campaign");
    } finally {
      setSending(false);
    }
  }

  const columns: Column<Campaign>[] = [
    { header: "Subject", accessor: (r) => r.subject },
    { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
    { header: "Recipients", accessor: (r) => r.recipient_count },
    {
      header: "Sent",
      accessor: (r) => (r.sent_at ? new Date(r.sent_at).toLocaleDateString() : "—"),
    },
    {
      header: "Actions",
      accessor: (r) => (
        <div className="flex flex-wrap gap-3" onClick={(e) => e.stopPropagation()}>
          <a
            href={`/api/admin/newsletter/${r.id}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter text-xs text-[#6B2FA0] hover:underline"
          >
            Preview
          </a>
          <button
            onClick={() => handleTest(r.id)}
            disabled={testingId === r.id}
            className="font-inter text-xs text-[#6B2FA0] hover:underline disabled:opacity-50"
          >
            {testingId === r.id ? "Sending…" : "Test"}
          </button>
          {r.status === "draft" && (
            <>
              <button
                onClick={() => openEdit(r)}
                className="font-inter text-xs text-[#6B2FA0] hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => setSendCampaign(r)}
                className="font-inter text-xs font-semibold text-[#10B981] hover:underline"
              >
                Send
              </button>
              <button
                onClick={() => setDeleteId(r.id)}
                className="font-inter text-xs text-[#EF4444] hover:underline"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-cormorant text-4xl text-white">Newsletter</h1>
          <p className="mt-1 font-inter text-sm text-white/50">
            {recipientCount === null ? "Loading subscriber count…" : `${recipientCount} active subscriber${recipientCount === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-[#6B2FA0] px-4 py-2.5 font-inter text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>

      <DataTable<Campaign>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={Send}
        emptyMessage="No campaigns yet."
        page={1}
        totalPages={1}
        onPageChange={() => {}}
      />

      <SlideOver
        open={slideOverOpen}
        title={editingCampaign ? "Edit Campaign" : "New Campaign"}
        onClose={() => setSlideOverOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block font-inter text-xs text-white/50">Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-inter text-xs text-white/50">
              Content (blank line separates paragraphs)
            </label>
            <textarea
              rows={10}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-[#6B2FA0] py-3 font-inter text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : editingCampaign ? "Save Changes" : "Create Draft"}
          </button>
        </div>
      </SlideOver>

      <ConfirmDialog
        open={!!sendCampaign}
        title="Send Campaign"
        confirmLabel="Send Now"
        loadingLabel="Sending…"
        message={
          recipientCount !== null && recipientCount > 100
            ? `This will send "${sendCampaign?.subject}" to ${recipientCount} subscribers. This exceeds Resend's 100/day free-tier limit — sends beyond that may fail or queue. This action cannot be undone.`
            : `This will send "${sendCampaign?.subject}" to ${recipientCount ?? "all"} subscribers. This action cannot be undone.`
        }
        loading={sending}
        onConfirm={handleSend}
        onCancel={() => setSendCampaign(null)}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Campaign"
        message="This will permanently delete this draft campaign. This cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
