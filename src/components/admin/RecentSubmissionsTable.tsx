"use client";

import { Mail } from "lucide-react";
import DataTable from "./DataTable";

type SubmissionRow = {
  id: string;
  form_type: string;
  data: { name?: string; email?: string } | null;
  read: boolean;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecentSubmissionsTable({ submissions }: { submissions: SubmissionRow[] }) {
  return (
    <DataTable<SubmissionRow>
      columns={[
        { header: "Type", accessor: (r) => r.form_type },
        { header: "From", accessor: (r) => r.data?.email ?? "—" },
        { header: "Date", accessor: (r) => formatDate(r.created_at) },
        { header: "Status", accessor: (r) => (r.read ? "Read" : "Unread") },
      ]}
      rows={submissions}
      rowKey={(r) => r.id}
      loading={false}
      error={null}
      onRetry={() => {}}
      emptyIcon={Mail}
      emptyMessage="No submissions yet."
      rowClassName={(r) => (!r.read ? "border-l-2 border-l-[#6B2FA0] bg-[#6B2FA0]/10" : "")}
      page={1}
      totalPages={1}
      onPageChange={() => {}}
    />
  );
}
