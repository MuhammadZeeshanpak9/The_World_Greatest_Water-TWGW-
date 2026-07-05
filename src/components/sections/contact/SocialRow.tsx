"use client";

import { SOCIALS } from "@/data/content";
import { SOCIAL_ICONS, InstagramIcon } from "@/components/ui/SocialIcons";

export default function SocialRow() {
  return (
    <div className="bg-white pb-24 text-center md:pb-32">
      <div className="flex justify-center gap-3">
        {SOCIALS.map((s) => {
          const Icon = SOCIAL_ICONS[s.name] ?? InstagramIcon;
          return (
            <a
              key={s.name}
              href={s.href}
              aria-label={s.name}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-violet/15 text-violet transition-all hover:text-violet"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 16px ${s.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Icon size={16} />
            </a>
          );
        })}
      </div>
      <p className="mt-4 font-inter text-[12px] text-muted">
        Find us on social media
      </p>
    </div>
  );
}
