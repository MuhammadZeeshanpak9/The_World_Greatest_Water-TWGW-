"use client";

import { useEffect, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { ArrowRight, Undo2 } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ImageWithFallback } from "@/components/ui/MediaWithFallback";
import { CityIcon } from "@/components/sections/join/cityIcons";
import {
  RETAIL_MARKETS,
  USA_MARKETS,
  NON_USA_MARKETS,
  USA_GROUP_POSITION,
  type RetailMarket,
} from "@/data/retailMarkets";

const GEO_URL = "/data/world-countries-110m.json";
const PRIORITY_CAPTION = "Priority Market — Now Onboarding Retail Partners";

const WORLD_VIEW = { center: [10, 15] as [number, number], zoom: 1 };
const CITY_ZOOM = 4;
const USA_GROUP_ZOOM = 3;
const ZOOM_DURATION_MS = 700;

type CardTarget =
  | { kind: "single"; market: RetailMarket }
  | { kind: "usa-group" };

const CONTINENT_ORDER = [
  "North America", "South America", "Europe", "Africa", "Asia", "Oceania",
] as const;

/** Eased in/out so the zoom reads as a deliberate camera move, not linear. */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function GlobalRetailMap({ onSelectMarket }: { onSelectMarket: (market: RetailMarket) => void }) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeTarget, setActiveTarget] = useState<CardTarget | null>(null);
  const [view, setView] = useState<{ center: [number, number]; zoom: number }>(WORLD_VIEW);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  const animateTo = (target: { center: [number, number]; zoom: number }) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (reducedMotion) {
      setView(target);
      return;
    }
    const start = view;
    const startTime = performance.now();
    const step = () => {
      const t = Math.min((performance.now() - startTime) / ZOOM_DURATION_MS, 1);
      const eased = easeInOutCubic(t);
      setView({
        center: [
          start.center[0] + (target.center[0] - start.center[0]) * eased,
          start.center[1] + (target.center[1] - start.center[1]) * eased,
        ],
        zoom: start.zoom + (target.zoom - start.zoom) * eased,
      });
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const closeCard = () => {
    setActiveTarget(null);
    setRipple(null);
    animateTo(WORLD_VIEW);
  };

  const openCard = (target: CardTarget, coordinates: [number, number], zoom: number) => {
    setActiveTarget(target);
    animateTo({ center: coordinates, zoom });
    // Ripple shows briefly at the marker's true map coordinate; reduced
    // motion skips it entirely (an instant jump, no animated flourish).
    if (!reducedMotion) {
      setRipple({ x: coordinates[0], y: coordinates[1] });
      window.setTimeout(() => setRipple(null), 900);
    }
  };

  // Close on Escape or outside click/tap.
  useEffect(() => {
    if (!activeTarget) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") closeCard(); };
    const onPointerDown = (e: PointerEvent) => {
      const container = containerRef.current;
      if (container && !container.contains(e.target as Node)) closeCard();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTarget]);

  const handleBecomeRetailer = (market: RetailMarket) => {
    closeCard();
    onSelectMarket(market);
  };

  const isZoomedIn = activeTarget !== null;

  return (
    <div ref={containerRef} className="relative">
      <div className="overflow-hidden rounded-[28px] border border-violet/10 bg-violet-tint/40 p-2 md:p-6">
        {isZoomedIn && (
          <button
            onClick={closeCard}
            className="absolute left-4 top-4 z-40 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 font-inter text-[11px] font-semibold uppercase tracking-[0.1em] text-violet shadow-sm backdrop-blur hover:bg-white sm:left-7 sm:top-7"
          >
            <Undo2 size={13} />
            Back to world view
          </button>
        )}

        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 150 }}
          className="h-auto w-full"
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup center={view.center} zoom={view.zoom} minZoom={1} maxZoom={CITY_ZOOM} filterZoomEvent={() => false}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#5e2d9120"
                    stroke="#5e2d9140"
                    strokeWidth={0.5}
                    style={{ outline: "none" }}
                  />
                ))
              }
            </Geographies>

            {ripple && (
              <Marker coordinates={[ripple.x, ripple.y]}>
                <circle r={5} fill="none" stroke="#3dd6cb" strokeWidth={1.5} className="animate-ping" />
              </Marker>
            )}

            {/* Grouped USA marker — 6 cities are too close together at
                world scale to show as separate dots, so they're combined
                into one marker; its card lists all 6 individually. */}
            <MapMarker
              position={USA_GROUP_POSITION}
              size={9}
              reducedMotion={reducedMotion}
              label="USA — 6 priority markets, now onboarding retail partners"
              onActivate={() => openCard({ kind: "usa-group" }, USA_GROUP_POSITION, USA_GROUP_ZOOM)}
            />

            {NON_USA_MARKETS.map((market) => (
              <MapMarker
                key={market.id}
                position={market.coordinates}
                size={6}
                reducedMotion={reducedMotion}
                label={`${market.name} — Priority Market, now onboarding retail partners`}
                onActivate={() => openCard({ kind: "single", market }, market.coordinates, CITY_ZOOM)}
              />
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {activeTarget && (
        <MarketCard target={activeTarget} onBecomeRetailer={handleBecomeRetailer} onClose={closeCard} />
      )}

      <MarketFallbackList onBecomeRetailer={handleBecomeRetailer} />
    </div>
  );
}

function MapMarker({ position, size, reducedMotion, label, onActivate }: {
  position: [number, number]; size: number; reducedMotion: boolean; label: string;
  onActivate: () => void;
}) {
  return (
    <Marker
      coordinates={position}
      tabIndex={0}
      role="button"
      aria-label={label}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      style={{ cursor: "pointer", outline: "none" }}
    >
      {/* Invisible 44px-equivalent hit area for comfortable mobile tapping. */}
      <circle r={22} fill="transparent" />
      {!reducedMotion && (
        <circle r={size} fill="#3dd6cb" opacity={0.35} className="animate-ping" />
      )}
      <circle r={size} fill="#3dd6cb" opacity={reducedMotion ? 0.5 : 0.25} />
      <circle r={Math.max(size - 3, 3)} fill="#5e2d91" stroke="#ffffff" strokeWidth={1.5} />
    </Marker>
  );
}

function MarketCard({ target, onBecomeRetailer, onClose }: {
  target: CardTarget;
  onBecomeRetailer: (market: RetailMarket) => void; onClose: () => void;
}) {
  const markets = target.kind === "usa-group" ? USA_MARKETS : [target.market];
  const title = target.kind === "usa-group" ? "United States" : target.market.name;

  return (
    <>
      {/* Mobile: bottom-anchored sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl glass-card-light p-5 shadow-[0_-8px_30px_rgba(20,20,42,0.15)] sm:hidden">
        <CardContent title={title} markets={markets} onBecomeRetailer={onBecomeRetailer} onClose={onClose} />
      </div>

      {/* Desktop/tablet: centered panel over the zoomed-in map */}
      <div className="absolute left-1/2 top-1/2 z-50 hidden w-80 -translate-x-1/2 translate-y-[calc(-50%+120px)] rounded-2xl glass-card-light p-5 shadow-[0_16px_40px_rgba(20,20,42,0.18)] sm:block">
        <CardContent title={title} markets={markets} onBecomeRetailer={onBecomeRetailer} onClose={onClose} />
      </div>
    </>
  );
}

function CardContent({ title, markets, onBecomeRetailer, onClose }: {
  title: string; markets: RetailMarket[];
  onBecomeRetailer: (market: RetailMarket) => void; onClose: () => void;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-cormorant text-[22px] leading-tight text-ink">{title}</h4>
        <button
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 font-inter text-[13px] text-muted hover:text-ink"
        >
          ✕
        </button>
      </div>
      <p className="mt-1 font-inter text-[10px] font-semibold uppercase tracking-[0.15em] text-teal">
        {PRIORITY_CAPTION}
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {markets.map((market) => (
          <div key={market.id} className="flex items-center gap-3">
            {market.icon ? (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-violet/10 text-violet">
                <CityIcon city={market.icon} className="h-6 w-6" />
              </span>
            ) : (
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={market.image}
                  alt={market.name}
                  watermark=""
                  rounded="rounded-lg"
                  sizes="44px"
                />
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="font-inter text-[13px] text-body">{market.name}</span>
              <button
                onClick={() => onBecomeRetailer(market)}
                className="group/btn flex w-fit items-center gap-1 rounded-full bg-violet px-3 py-1.5 font-inter text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition-transform hover:scale-[1.03]"
              >
                Become a retailer here
                <ArrowRight size={11} className="transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function MarketFallbackList({ onBecomeRetailer }: { onBecomeRetailer: (market: RetailMarket) => void }) {
  return (
    <div className="mt-10">
      <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
        Priority Markets By Continent
      </p>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CONTINENT_ORDER.map((continent) => {
          const markets = RETAIL_MARKETS.filter((m) => m.continent === continent);
          if (markets.length === 0) return null;
          return (
            <div key={continent}>
              <h5 className="font-inter text-[12px] font-semibold uppercase tracking-[0.1em] text-violet">
                {continent}
              </h5>
              <ul className="mt-2 flex flex-col gap-1.5">
                {markets.map((market) => (
                  <li key={market.id}>
                    <button
                      onClick={() => onBecomeRetailer(market)}
                      className="font-inter text-[13px] text-body underline-offset-2 hover:text-violet hover:underline"
                    >
                      {market.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
