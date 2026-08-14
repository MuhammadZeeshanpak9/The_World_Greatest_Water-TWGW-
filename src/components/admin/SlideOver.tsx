"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

export default function SlideOver({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-white/10 bg-[#0F0A1E]/95 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="font-cormorant text-2xl text-white">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-white/60 hover:text-white">
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
