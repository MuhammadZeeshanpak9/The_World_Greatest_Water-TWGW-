"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Mail, MessageCircleMore, Phone } from "lucide-react";

// TODO: replace with the real ELEV8 WhatsApp business number before launch.
const WHATSAPP_NUMBER = "10000000000";

export default function EscalationPanel() {
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card-dark mt-2 rounded-2xl p-4"
    >
      <p className="mb-3 font-inter text-[12px] text-white/70">
        Want to speak with a real person? Reach the ELEV8 team here:
      </p>
      <div className="flex flex-col gap-2">
        <Link
          href="/contact"
          className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 font-inter text-[12px] text-white/85 transition-colors hover:bg-white/10"
        >
          <Phone size={14} className="text-[#4ECDC4]" />
          Contact Form
        </Link>
        <a
          href="mailto:winwin@theworldsgreatestwater.com"
          className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 font-inter text-[12px] text-white/85 transition-colors hover:bg-white/10"
        >
          <Mail size={14} className="text-[#4ECDC4]" />
          Email Us
        </a>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 font-inter text-[12px] text-white/85 transition-colors hover:bg-white/10"
        >
          <MessageCircleMore size={14} className="text-[#4ECDC4]" />
          WhatsApp
        </a>
      </div>
    </m.div>
  );
}
