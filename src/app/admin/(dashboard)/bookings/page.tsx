"use client";

import { useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import DataTable, { type Column } from "@/components/admin/DataTable";
import PillButton from "@/components/admin/PillButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type CalBooking = {
  id: string;
  cal_booking_id: string | null;
  wellness_type: string;
  customer_name: string;
  customer_email: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
};

const WELLNESS_TYPES = ["body", "mind", "soul", "unlock-the-lock"];
const STATUSES = ["confirmed", "cancelled"];

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminBookingsPage() {
  const [wellnessType, setWellnessType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (wellnessType) p.set("wellness_type", wellnessType);
    if (status) p.set("status", status);
    p.set("page", String(page));
    return p.toString();
  }, [wellnessType, status, page]);

  const { rows, total, loading, error, refetch } = useAdminTable<CalBooking>(
    "/api/admin/bookings",
    "bookings",
    queryString,
  );

  const totalPages = Math.max(1, Math.ceil(total / 20));

  const columns: Column<CalBooking>[] = [
    { header: "Wellness Type", accessor: (r) => r.wellness_type },
    { header: "Customer", accessor: (r) => r.customer_name },
    { header: "Email", accessor: (r) => r.customer_email },
    { header: "Date/Time", accessor: (r) => formatDateTime(r.start_time) },
    { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-cormorant text-4xl text-white">Bookings</h1>
        <p className="mt-1 font-inter text-sm text-white/50">Read-only — synced from Cal.com</p>
      </div>

      <DataTable<CalBooking>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={Calendar}
        emptyMessage="No bookings yet."
        filters={
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <PillButton
                active={!wellnessType}
                onClick={() => {
                  setWellnessType("");
                  setPage(1);
                }}
              >
                All Types
              </PillButton>
              {WELLNESS_TYPES.map((t) => (
                <PillButton
                  key={t}
                  active={wellnessType === t}
                  onClick={() => {
                    setWellnessType(t);
                    setPage(1);
                  }}
                >
                  {t}
                </PillButton>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <PillButton
                active={!status}
                onClick={() => {
                  setStatus("");
                  setPage(1);
                }}
              >
                All Statuses
              </PillButton>
              {STATUSES.map((s) => (
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
          </div>
        }
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
