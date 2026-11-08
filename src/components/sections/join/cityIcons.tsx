import type { CityIconKey } from "@/data/retailMarkets";

/**
 * Tiny, original hand-drawn skyline/landmark glyphs — never a photo, a
 * trademarked logo, or third-party artwork. Each is a simple silhouette
 * evoking the city (not a literal rendering of any specific building),
 * drawn directly in this file as plain SVG paths/shapes. Only a handful
 * of key USA/Africa/Asia cities get one; every other market just shows
 * the standard card with no icon.
 */
const ICONS: Record<CityIconKey, React.ReactNode> = {
  // Miami — palm-fringed curved waterfront towers.
  miami: (
    <g fill="currentColor">
      <rect x="4" y="12" width="3" height="10" rx="0.5" />
      <rect x="8" y="8" width="3.5" height="14" rx="0.5" />
      <rect x="12.5" y="14" width="3" height="8" rx="0.5" />
      <path d="M17 10c1.2-2 3.4-2.6 4.6-1.6-1.6.2-2.6 1-3.2 1.8 1.6-.4 3-.1 3.6.9-1.8-.2-3 .3-3.6 1.1-.2-.8-.7-1.6-1.4-2.2z" />
      <rect x="18.5" y="14" width="1.6" height="8" rx="0.4" />
    </g>
  ),
  // Los Angeles — low wide skyline + sun.
  "los-angeles": (
    <g fill="currentColor">
      <circle cx="19" cy="7" r="2.4" opacity="0.55" />
      <rect x="3.5" y="15" width="3" height="7" rx="0.5" />
      <rect x="7" y="12" width="3" height="10" rx="0.5" />
      <rect x="10.5" y="16" width="2.5" height="6" rx="0.5" />
      <rect x="13.5" y="10" width="3" height="12" rx="0.5" />
      <path d="M2 22h22" stroke="currentColor" strokeWidth="0.8" />
    </g>
  ),
  // New York — dense tall skyline with a spire.
  "new-york": (
    <g fill="currentColor">
      <rect x="4" y="13" width="3" height="9" rx="0.4" />
      <rect x="7.5" y="9" width="3" height="13" rx="0.4" />
      <rect x="11" y="4" width="3" height="18" rx="0.4" />
      <path d="M12.5 1.5l1 2.5h-2z" />
      <rect x="14.5" y="11" width="3" height="11" rx="0.4" />
      <rect x="18" y="14" width="3" height="8" rx="0.4" />
    </g>
  ),
  // DMV (DC) — dome + obelisk, generic civic silhouette.
  dmv: (
    <g fill="currentColor">
      <path d="M5 22v-6a4 4 0 0 1 8 0v6z" />
      <ellipse cx="9" cy="16" rx="4" ry="1.6" opacity="0.6" />
      <rect x="16" y="6" width="2" height="16" rx="0.3" />
      <path d="M17 2l1.6 4h-3.2z" />
    </g>
  ),
  // Chicago — riverfront towers + a tapered spire.
  chicago: (
    <g fill="currentColor">
      <rect x="4" y="12" width="3" height="10" rx="0.4" />
      <rect x="7.5" y="7" width="3" height="15" rx="0.4" />
      <path d="M9 3l1.6 4h-3.2z" />
      <rect x="11.5" y="14" width="2.5" height="8" rx="0.4" />
      <rect x="15" y="10" width="3.2" height="12" rx="0.4" />
    </g>
  ),
  // Texas — wide plains horizon + lone star.
  texas: (
    <g fill="currentColor">
      <path d="M12 2.4l.9 1.9 2.1.2-1.6 1.4.5 2-1.9-1-1.9 1 .5-2-1.6-1.4 2.1-.2z" />
      <rect x="3" y="16" width="4" height="6" rx="0.4" />
      <rect x="8" y="13" width="4" height="9" rx="0.4" />
      <rect x="13" y="16" width="4" height="6" rx="0.4" />
      <rect x="18" y="14" width="3" height="8" rx="0.4" />
    </g>
  ),
  // Nairobi — acacia tree silhouette on the savanna.
  nairobi: (
    <g fill="currentColor">
      <path d="M12 3c2.6 0 4.6 1.8 4.6 3.9 0 .6-.2 1.1-.5 1.6.9.5 1.5 1.4 1.5 2.4 0 1.6-1.5 2.9-3.4 2.9-.3 0-.6 0-.9-.1-.6 1-1.8 1.6-3.1 1.6s-2.5-.6-3.1-1.6c-.3.1-.6.1-.9.1-1.9 0-3.4-1.3-3.4-2.9 0-1 .6-1.9 1.5-2.4-.3-.5-.5-1-.5-1.6C3.8 4.8 5.8 3 8.4 3c.5 0 1 .1 1.4.2A4.6 4.6 0 0 1 12 3z" opacity="0.85" />
      <rect x="11.2" y="13" width="1.6" height="9" rx="0.3" />
    </g>
  ),
  // Lagos — bridge towers over the lagoon.
  lagos: (
    <g fill="currentColor">
      <rect x="6" y="4" width="1.6" height="16" rx="0.3" />
      <rect x="16" y="4" width="1.6" height="16" rx="0.3" />
      <path d="M2 14c3-2 6-2 9 0s6 2 9 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M3 20h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  ),
  // Dubai — single tapered needle tower.
  dubai: (
    <g fill="currentColor">
      <path d="M12 1.5l1.6 7-1.6-.6-1.6.6z" />
      <path d="M9.6 8.3L12 7.4l2.4.9-1 11.7h-2.8z" />
      <rect x="9.5" y="20" width="5" height="2" rx="0.4" />
    </g>
  ),
  // Tokyo — lattice tower (generic, not a trademarked landmark).
  tokyo: (
    <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l5 18H7z" />
      <path d="M9 14h6M8 18h8" />
      <path d="M12 2v18" />
    </g>
  ),
  // Shanghai — pearl-tower silhouette with two spheres.
  shanghai: (
    <g fill="currentColor">
      <rect x="11.2" y="2" width="1.6" height="20" rx="0.3" />
      <circle cx="12" cy="8" r="2.6" opacity="0.85" />
      <circle cx="12" cy="15.5" r="1.8" opacity="0.6" />
      <rect x="8.5" y="20" width="7" height="2" rx="0.4" />
    </g>
  ),
};

export function CityIcon({ city, className = "h-6 w-6" }: { city: CityIconKey; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {ICONS[city]}
    </svg>
  );
}
