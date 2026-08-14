"use client";

import type { ReactNode } from "react";

export default function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 font-inter text-xs capitalize transition-colors ${
        active ? "bg-[#6B2FA0] text-white" : "bg-white/[0.08] text-white/60 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
