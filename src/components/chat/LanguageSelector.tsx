"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type ChatLanguage = { code: string; label: string; flag: string };

export const CHAT_LANGUAGES: ChatLanguage[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "pt", label: "Portuguese", flag: "🇵🇹" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "sw", label: "Swahili", flag: "🇰🇪" },
  { code: "zh", label: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "it", label: "Italian", flag: "🇮🇹" },
  { code: "nl", label: "Dutch", flag: "🇳🇱" },
  { code: "ru", label: "Russian", flag: "🇷🇺" },
  { code: "tr", label: "Turkish", flag: "🇹🇷" },
  { code: "pl", label: "Polish", flag: "🇵🇱" },
  { code: "sv", label: "Swedish", flag: "🇸🇪" },
  { code: "no", label: "Norwegian", flag: "🇳🇴" },
  { code: "da", label: "Danish", flag: "🇩🇰" },
  { code: "fi", label: "Finnish", flag: "🇫🇮" },
  { code: "el", label: "Greek", flag: "🇬🇷" },
  { code: "he", label: "Hebrew", flag: "🇮🇱" },
  { code: "th", label: "Thai", flag: "🇹🇭" },
  { code: "id", label: "Indonesian", flag: "🇮🇩" },
  { code: "ms", label: "Malay", flag: "🇲🇾" },
  { code: "vi", label: "Vietnamese", flag: "🇻🇳" },
  { code: "tl", label: "Tagalog", flag: "🇵🇭" },
];

/** Best-effort match of the browser's language to one of our 27 supported codes. */
export function detectBrowserLanguage(): string {
  if (typeof navigator === "undefined") return "en";
  const nav = navigator.language?.slice(0, 2).toLowerCase();
  return CHAT_LANGUAGES.some((l) => l.code === nav) ? nav : "en";
}

export default function LanguageSelector({
  value,
  onChange,
  compact = false,
}: {
  value: string;
  onChange: (code: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const current = CHAT_LANGUAGES.find((l) => l.code === value) ?? CHAT_LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 font-inter text-white/80 transition-colors hover:bg-white/10 ${
          compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-[12px]"
        }`}
      >
        <span>{current.flag}</span>
        {!compact && <span>{current.label}</span>}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-10 mt-2 max-h-[200px] w-[190px] overflow-y-auto rounded-xl border border-white/10 bg-[#0A0A0A] p-1 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        >
          {CHAT_LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.code === value}
                onClick={() => {
                  onChange(lang.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left font-inter text-[12px] transition-colors ${
                  lang.code === value
                    ? "bg-[#6B2FA0]/30 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
