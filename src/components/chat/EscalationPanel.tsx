"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Mail, MessageCircleMore, Phone } from "lucide-react";

const WHATSAPP_NUMBER = "13059059006"; // +1 (305) 905-9006

const CONTACTS = [
  { href: "/contact", label: "Contact Form", icon: Phone, external: false, isLink: true },
  { href: "mailto:winwin@theworldsgreatestwater.com", label: "Email Us", icon: Mail, external: false, isLink: false },
  { href: `https://wa.me/${WHATSAPP_NUMBER}`, label: "WhatsApp", icon: MessageCircleMore, external: true, isLink: false },
];

const itemStyle: React.CSSProperties = {
  background: "#f9fafb",
  border: "1px solid #d8cce8",
  borderRadius: "12px",
  padding: "10px 14px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontFamily: "inherit",
  fontSize: "12px",
  color: "#5e2d91",
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
        background: "#f3f0f8",
        border: "1px solid #d8cce8",
      }}
    >
      <p className="mb-3 font-inter text-[12px]" style={{ color: "#7c5a95" }}>
        Want to speak with a real person? Reach the ELEV8 team:
      </p>
      <div className="flex flex-col gap-2">
        {CONTACTS.map(({ href, label, icon: Icon, external, isLink }) => {
          const inner = (
            <>
              <Icon size={13} style={{ color: "#5e2d91", flexShrink: 0 }} />
              {label}
            </>
          );

          const handlers = {
            onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#5e2d91";
              (e.currentTarget as HTMLElement).style.background = "#ffffff";
              (e.currentTarget as HTMLElement).style.color = "#4a2270";
            },
            onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#d8cce8";
              (e.currentTarget as HTMLElement).style.background = "#f9fafb";
              (e.currentTarget as HTMLElement).style.color = "#5e2d91";
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
