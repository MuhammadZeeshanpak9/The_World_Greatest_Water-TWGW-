import type { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <Icon size={22} className="text-[#6B2FA0]" />
      <div className="mt-4 font-cormorant text-4xl text-white">{value}</div>
      <div className="mt-1 font-inter text-sm text-white/50">{label}</div>
    </div>
  );
}
