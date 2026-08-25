"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Cal, { getCalApi } from "@calcom/embed-react";

function extractCalLink(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?cal\.com\//, "");
}

function ComingSoonFallback() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F0A1E] p-10 text-center">
      <p className="font-cormorant text-2xl text-white">Booking system coming soon</p>
      <p className="mt-3 font-inter text-sm text-white/60">
        Contact us at{" "}
        <a
          href="mailto:winwin@theworldsgreatestwater.com"
          className="text-[#B48CE0] underline"
        >
          winwin@theworldsgreatestwater.com
        </a>
      </p>
      <Link
        href="/contact"
        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#6B2FA0] px-8 py-3 font-inter text-[12px] font-semibold tracking-[0.15em] text-white uppercase transition-transform hover:scale-[1.02]"
      >
        Say Hello
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F0A1E] p-10 text-center">
      <p className="font-inter text-sm text-white/60">
        Unable to load the booking calendar right now. Please try again later, or email{" "}
        <a
          href="mailto:winwin@theworldsgreatestwater.com"
          className="text-[#B48CE0] underline"
        >
          winwin@theworldsgreatestwater.com
        </a>
        .
      </p>
    </div>
  );
}

// React error boundaries must be class components — no hook equivalent exists.
class CalErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return <ErrorFallback />;
    return this.props.children;
  }
}

function LiveEmbed({ calLink, title }: { calLink: string; title: string }) {
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cal = await getCalApi();
        cal("ui", { theme: "dark", styles: { branding: { brandColor: "#6B2FA0" } } });
        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) {
          setInitError(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (initError) return <ErrorFallback />;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F0A1E]">
      <div className="border-b border-white/10 px-6 py-4">
        <h3 className="font-cormorant text-xl text-white">{title}</h3>
      </div>
      {loading && (
        <div className="space-y-3 p-10">
          <div className="h-6 w-1/2 animate-pulse rounded bg-white/10" />
          <div className="h-64 w-full animate-pulse rounded bg-white/5" />
        </div>
      )}
      <div className={loading ? "hidden" : ""}>
        <Cal
          calLink={extractCalLink(calLink)}
          style={{ width: "100%", height: "600px" }}
          config={{ theme: "dark" }}
        />
      </div>
    </div>
  );
}

export default function CalBookingEmbed({ calLink, title }: { calLink: string; title: string }) {
  if (calLink.includes("placeholder")) {
    return <ComingSoonFallback />;
  }

  return (
    <CalErrorBoundary>
      <LiveEmbed calLink={calLink} title={title} />
    </CalErrorBoundary>
  );
}
