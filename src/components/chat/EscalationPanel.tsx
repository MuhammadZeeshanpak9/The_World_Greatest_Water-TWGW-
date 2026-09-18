"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Mail, MessageCircleMore, Phone } from "lucide-react";

// TODO: replace with the real ELEV8 WhatsApp business number before launch.
const WHATSAPP_NUMBER = "10000000000";

const CONTACTS = [
  { href: "/contact", label: "Contact Form", icon: Phone, external: false, isLink: true },
  { href: "mailto:winwin@theworldsgreatestwater.com", label: "Email Us", icon: Mail, external: false, isLink: false },
  { href: `https://wa.me/${WHATSAPP_NUMBER}`, label: "WhatsApp", icon: MessageCircleMore, external: true, isLink: false },
];

const itemStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "12px",
  padding: "10px 14px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontFamily: "inherit",
  fontSize: "12px",
  color: "rgba(255,255,255,0.85)",
  textDecoration: "none",
  transition: "border-color 0.15s, color 0.15s, background 0.15s",
  cursor: "pointer",
};

export default function EscalationPanel() {
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <p className="mb-3 font-inter text-[12px]" style={{ color: "rgba(255,255,255,0.6)" }}>
        Want to speak with a real person? Reach the ELEV8 team:
      </p>
      <div className="flex flex-col gap-2">
        {CONTACTS.map(({ href, label, icon: Icon, external, isLink }) => {
          const inner = (
            <>
              <Icon size={13} style={{ color: "#3dd6cb", flexShrink: 0 }} />
              {label}
            </>
          );

          const handlers = {
            onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            },
            onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
            },
          };

          return isLink ? (
            <Link key={label} href={href} style={itemStyle} {...handlers}>
              {inner}
            </Link>
          ) : (
            <a
              key={label}
              href={href}
              style={itemStyle}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              {...handlers}
            >
              {inner}
            </a>
          );
        })}
      </div>
    </m.div>
  );
}
