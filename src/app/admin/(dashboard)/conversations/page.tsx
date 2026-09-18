"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Download } from "lucide-react";
import DataTable, { type Column } from "@/components/admin/DataTable";
import PillButton from "@/components/admin/PillButton";
import SlideOver from "@/components/admin/SlideOver";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type Session = {
  session_id: string;
  user_id: string | null;
  name: string | null;
  email: string | null;
  language: string;
  page_url: string | null;
  message_count: number;
  created_at: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

type UnansweredQuestion = {
  id: string;
  session_id: string | null;
  question: string;
  page_url: string | null;
  created_at: string;
};

const FILTERS = [
  { value: "", label: "All" },
  { value: "with-lead", label: "With Lead" },
  { value: "without-lead", label: "Without Lead" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminConversationsPage() {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Session | null>(null);
  const [detailMessages, setDetailMessages] = useState<Message[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [unanswered, setUnanswered] = useState<UnansweredQuestion[]>([]);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (filter) p.set("filter", filter);
    p.set("page", String(page));
    return p.toString();
  }, [filter, page]);

  const { rows, total, loading, error, refetch } = useAdminTable<Session>(
    "/api/admin/conversations",
    "sessions",
    queryString,
  );

  useEffect(() => {
    fetch(`/api/admin/conversations${queryString ? `?${queryString}` : ""}`)
      .then((res) => res.json())
      .then((json) => setUnanswered(json.unanswered ?? []))
      .catch(() => setUnanswered([]));
  }, [queryString]);

  useEffect(() => {
    if (!expanded) return;
    // Standard fetch-on-open pattern — setDetailLoading(true) runs synchronously before the
    // network call, same precedent as useAdminTable's fetchData.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDetailLoading(true);
    fetch(`/api/admin/conversations/${expanded.session_id}`)
      .then((res) => res.json())
      .then((json) => setDetailMessages(json.messages ?? []))
      .catch(() => setDetailMessages([]))
      .finally(() => setDetailLoading(false));
  }, [expanded]);

  const totalPages = Math.max(1, Math.ceil(total / 20));

  const exportUrl = useMemo(() => {
    const p = new URLSearchParams();
    if (filter) p.set("filter", filter);
    p.set("export", "csv");
    return `/api/admin/conversations?${p.toString()}`;
  }, [filter]);

  const columns: Column<Session>[] = [
    { header: "Session ID", accessor: (r) => <span className="font-mono text-xs">{r.session_id.slice(0, 8)}…</span> },
    { header: "User", accessor: (r) => r.email ?? r.user_id ?? "Guest" },
    { header: "Language", accessor: (r) => r.language.toUpperCase() },
    { header: "Messages", accessor: (r) => r.message_count },
    {
      header: "Lead",
      accessor: (r) =>
        r.email ? (
          <span className="rounded-full bg-[#4ECDC4]/20 px-2 py-0.5 text-[11px] text-[#4ECDC4]">Captured</span>
        ) : (
          <span className="text-white/30">—</span>
        ),
    },
    { header: "Date", accessor: (r) => formatDate(r.created_at) },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-cormorant text-4xl text-white">Conversations</h1>
        <a
          href={exportUrl}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 font-inter text-sm text-white/80 hover:text-white"
        >
          <Download size={16} /> Export CSV
        </a>
      </div>

      <DataTable<Session>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.session_id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={MessageSquare}
        emptyMessage="No conversations yet."
        onRowClick={(r) => setExpanded(r)}
        filters={
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <PillButton
                key={f.value}
                active={filter === f.value}
                onClick={() => {
                  setFilter(f.value);
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

      <div className="mt-8">
        <h2 className="mb-3 font-cormorant text-2xl text-white">Unanswered Questions</h2>
        {unanswered.length === 0 ? (
          <p className="font-inter text-sm text-white/40">Nothing flagged yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {unanswered.map((q) => (
              <div key={q.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-inter text-sm text-white/85">{q.question}</p>
                <p className="mt-1 font-inter text-[11px] text-white/40">
                  {q.page_url ?? "—"} · {formatDate(q.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <SlideOver
        open={!!expanded}
        title={expanded ? `Conversation ${expanded.session_id.slice(0, 8)}…` : ""}
        onClose={() => {
          setExpanded(null);
          setDetailMessages([]);
        }}
      >
        {expanded && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 font-inter text-sm text-white/70">
              <div>
                <span className="text-white/40">User:</span> {expanded.email ?? "Guest"}
              </div>
              <div>
                <span className="text-white/40">Language:</span> {expanded.language.toUpperCase()}
              </div>
              <div>
                <span className="text-white/40">Page:</span> {expanded.page_url ?? "—"}
              </div>
              <div>
                <span className="text-white/40">Started:</span> {formatDate(expanded.created_at)}
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
              {detailLoading ? (
                <p className="font-inter text-sm text-white/40">Loading messages…</p>
              ) : detailMessages.length === 0 ? (
                <p className="font-inter text-sm text-white/40">No messages in this conversation.</p>
              ) : (
                detailMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-xl px-3.5 py-2.5 font-inter text-[13px] ${
                      m.role === "user"
                        ? "self-end bg-[#6B2FA0]/30 text-white"
                        : "self-start bg-white/5 text-white/80"
                    }`}
                  >
                    {m.content}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}
