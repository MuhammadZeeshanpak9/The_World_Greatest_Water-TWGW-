const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  "sold-out": { bg: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.6)" },
  available: { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
  "coming-soon": { bg: "rgba(107,47,160,0.2)", text: "#B48CE0" },
  pending: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
  processing: { bg: "rgba(59,130,246,0.15)", text: "#3B82F6" },
  shipped: { bg: "rgba(20,184,166,0.15)", text: "#14B8A6" },
  delivered: { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
  cancelled: { bg: "rgba(239,68,68,0.15)", text: "#EF4444" },
  active: { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
  paused: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
  confirmed: { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
  draft: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
  sent: { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
  paid: { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
  refunded: { bg: "rgba(107,47,160,0.2)", text: "#B48CE0" },
  failed: { bg: "rgba(239,68,68,0.15)", text: "#EF4444" },
  unselected: { bg: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.6)" },
};

export default function StatusBadge({ status }: { status: string }) {
  const style =
    STATUS_STYLES[status] ?? { bg: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.6)" };

  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 font-inter text-[11px] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {status.replace(/-/g, " ")}
    </span>
  );
}
