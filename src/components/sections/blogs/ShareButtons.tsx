"use client";

import { useState } from "react";
import { TwitterIcon, FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = (network: "twitter" | "facebook") => {
    const url = window.location.href;
    const intent =
      network === "twitter"
        ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(intent, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
        Share
      </span>
      <button
        aria-label="Share on Twitter"
        onClick={() => share("twitter")}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-violet/15 text-violet transition-colors hover:bg-violet hover:text-white"
      >
        <TwitterIcon size={14} />
      </button>
      <button
        aria-label="Share on Facebook"
        onClick={() => share("facebook")}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-violet/15 text-violet transition-colors hover:bg-violet hover:text-white"
      >
        <FacebookIcon size={14} />
      </button>
      <button
        aria-label="Copy link (Instagram has no direct share link)"
        onClick={copyLink}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-violet/15 text-violet transition-colors hover:bg-violet hover:text-white"
      >
        <InstagramIcon size={14} />
      </button>
      {copied && (
        <span className="font-inter text-[11px] text-violet">Link copied</span>
      )}
    </div>
  );
}
