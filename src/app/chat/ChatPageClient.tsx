"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, ArrowLeft, Sparkles } from "lucide-react";
import ChatWindow from "@/components/chat/ChatWindow";
import LanguageSelector, { detectBrowserLanguage } from "@/components/chat/LanguageSelector";

const TOPICS = [
  "The 12 Bottles",
  "Wellness Memberships",
  "Shipping & Orders",
  "Our Story",
];

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_030633_1712fc71-4979-4e14-98f9-9f95702ab3da.mp4";

export default function ChatPageClient() {
  const [language, setLanguage] = useState(detectBrowserLanguage);

  return (
    <main className="relative flex min-h-screen overflow-hidden">

      {/* ── Video background ── */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#060608]">
        <video
          src={VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
        {/* Subtle dark overlay for text contrast while keeping video visible */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.15)" }}
        />
      </div>

      {/* ── Sidebar ── */}
      <aside
        className="relative z-10 hidden w-[260px] shrink-0 flex-col border-r lg:flex"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.12)",
        }}
      >
        {/* ── TOP: Language + back link ── */}
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <Link
            href="/"
            className="flex items-center gap-1.5 font-inter text-[11px] font-medium uppercase tracking-[0.15em] transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <ArrowLeft size={12} />
            Back
          </Link>

          {/* Language selector — top of sidebar */}
          <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
            <Globe size={13} />
            <LanguageSelector value={language} onChange={setLanguage} compact />
          </div>
        </div>

        {/* ── Brand ── */}
        <div className="px-5 py-6">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, #5e2d91, #3dd6cb)" }}
            >
              <Sparkles size={14} style={{ color: "#fff" }} />
            </span>
            <div>
              <p className="font-cormorant text-[16px] font-semibold leading-none text-white">
                ELEV8 V.A.
              </p>
              <p className="mt-0.5 font-inter text-[10px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.5)" }}>
                Virtual Assistant
              </p>
            </div>
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-5 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }} />

        {/* ── Topics ── */}
        <div className="flex flex-col gap-1 px-3 py-4">
          <p
            className="mb-2 px-2 font-inter text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Topics
          </p>
          {TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              className="rounded-xl px-3 py-2.5 text-left font-inter text-[13px] transition-all duration-150"
              style={{ color: "rgba(255,255,255,0.85)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
              }}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* ── Bottom: powered-by ── */}
        <div className="mt-auto px-5 py-5">
          <p className="font-inter text-[10px] uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.3)" }}>
            Powered by ELEV8 V.A.
          </p>
        </div>
      </aside>

      {/* ── Chat area ── */}
      <div className="relative z-10 flex flex-1 flex-col">

        {/* Mobile top bar */}
        <div
          className="flex items-center justify-between border-b px-4 py-3 lg:hidden"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          <Link href="/" className="text-white">
            <span className="font-cormorant text-xl font-semibold">ELEV8 V.A.</span>
          </Link>
          <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.6)" }}>
            <Globe size={14} />
            <LanguageSelector value={language} onChange={setLanguage} compact />
          </div>
        </div>

        {/* Chat window wrapper */}
        <div className="flex flex-1 items-center justify-center p-0 lg:p-8">
          <div className="h-[calc(100vh-56px)] w-full lg:h-full lg:max-w-[700px]">
            <ChatWindow
              mode="full"
              language={language}
              onLanguageChange={setLanguage}
              showLanguageSelector={false}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
