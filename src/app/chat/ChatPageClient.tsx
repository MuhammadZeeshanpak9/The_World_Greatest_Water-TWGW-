"use client";

import { useState } from "react";
import Link from "next/link";
import ChatWindow from "@/components/chat/ChatWindow";
import LanguageSelector, { detectBrowserLanguage } from "@/components/chat/LanguageSelector";

const TOPICS = [
  "The 12 Bottles",
  "Wellness Memberships",
  "Shipping & Orders",
  "Our Story",
];

export default function ChatPageClient() {
  const [language, setLanguage] = useState(detectBrowserLanguage);

  return (
    <main className="flex min-h-screen flex-col bg-[#0A0A0A] sm:flex-row">
      <aside className="flex w-full flex-col justify-between border-b border-white/10 bg-white/[0.02] p-6 sm:w-[280px] sm:border-b-0 sm:border-r">
        <div>
          <Link href="/" className="mb-8 block font-cormorant text-2xl font-semibold text-white">
            ELEV8 <span className="text-[#4ECDC4]">V.A.</span>
          </Link>

          <p className="mb-6 font-inter text-[12px] leading-relaxed text-white/60">
            Your personal guide to THE WORLD&apos;S GREATEST WATER ecosystem.
          </p>

          <p className="mb-2 font-inter text-[11px] uppercase tracking-[0.15em] text-white/40">
            Popular topics
          </p>
          <div className="flex flex-col gap-2">
            {TOPICS.map((topic) => (
              <div
                key={topic}
                className="glass-card-dark rounded-xl px-3 py-2.5 font-inter text-[12px] text-white/80"
              >
                {topic}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>

        <p className="mt-6 font-inter text-[10px] uppercase tracking-[0.15em] text-white/30">
          Powered by ELEV8 V.A.
        </p>
      </aside>

      <div className="flex flex-1 items-stretch justify-center p-0 sm:p-6">
        <div className="h-[calc(100vh-4rem)] w-full sm:h-full sm:max-w-2xl">
          <ChatWindow
            mode="full"
            language={language}
            onLanguageChange={setLanguage}
            showLanguageSelector={false}
          />
        </div>
      </div>
    </main>
  );
}
