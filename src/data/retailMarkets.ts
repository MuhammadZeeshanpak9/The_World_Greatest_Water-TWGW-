export type MarketStatus = "onboarding" | "active";

export type RetailMarket = {
  /** Stable slug, e.g. "usa-miami". */
  id: string;
  /** Display label, e.g. "Miami, USA". */
  name: string;
  continent: "North America" | "South America" | "Europe" | "Africa" | "Asia" | "Oceania";
  /** [longitude, latitude] of the exact city (not just the country). */
  coordinates: [number, number];
  /** "onboarding" today for every entry — flip to "active" (one line,
   * no component change) once a real retailer is confirmed in that
   * market. */
  status: MarketStatus;
  /** Public path to an image representing this market (e.g. a city
   * skyline), shown in its hover/tap card. Not yet supplied for any
   * market — falls back to the existing gradient placeholder until a
   * real path is added here (one line, no component change). */
  image?: string;
  /** Key of an original, hand-drawn SVG icon (see cityIcons.tsx) shown in
   * the card header for a bit of city flavour. Only set for a handful of
   * key cities — every other market just uses the standard card. Never a
   * photo, trademarked logo or third-party artwork. */
  icon?: CityIconKey;
};

/** Keys with a hand-drawn icon in `src/components/sections/join/cityIcons.tsx`. */
export type CityIconKey =
  | "miami"
  | "los-angeles"
  | "new-york"
  | "dmv"
  | "chicago"
  | "texas"
  | "nairobi"
  | "lagos"
  | "dubai"
  | "tokyo"
  | "shanghai";

/** Single source of truth for every priority market shown on the
 * /join Global Retail Expansion map. These are NOT real retailer
 * locations — just markets ELEV8 is actively onboarding retail
 * partners in. Never add a fake store name, pin, or count here. */
export const RETAIL_MARKETS: RetailMarket[] = [
  // USA — rendered as one grouped map marker (see GlobalRetailMap.tsx),
  // but each city keeps its own real coordinates here and its own row
  // in that marker's card and in the below-map fallback list. Each also
  // has its own hand-drawn skyline icon (see cityIcons.tsx).
  { id: "usa-miami", name: "Miami, USA", continent: "North America", coordinates: [-80.1918, 25.7617], status: "onboarding", icon: "miami" },
  { id: "usa-los-angeles", name: "Los Angeles, USA", continent: "North America", coordinates: [-118.2437, 34.0522], status: "onboarding", icon: "los-angeles" },
  { id: "usa-new-york", name: "New York, USA", continent: "North America", coordinates: [-74.0060, 40.7128], status: "onboarding", icon: "new-york" },
  { id: "usa-dmv", name: "DMV (Washington DC Area), USA", continent: "North America", coordinates: [-77.0369, 38.9072], status: "onboarding", icon: "dmv" },
  { id: "usa-chicago", name: "Chicago, USA", continent: "North America", coordinates: [-87.6298, 41.8781], status: "onboarding", icon: "chicago" },
  { id: "usa-texas", name: "Texas, USA", continent: "North America", coordinates: [-97.7431, 30.2672], status: "onboarding", icon: "texas" },

  // Africa — East + West, now pinned to each market's largest city.
  { id: "kenya", name: "Nairobi, Kenya", continent: "Africa", coordinates: [36.8219, -1.2921], status: "onboarding", icon: "nairobi" },
  { id: "tanzania", name: "Dar es Salaam, Tanzania", continent: "Africa", coordinates: [39.2083, -6.7924], status: "onboarding" },
  { id: "ethiopia", name: "Addis Ababa, Ethiopia", continent: "Africa", coordinates: [38.7469, 9.0320], status: "onboarding" },
  { id: "nigeria", name: "Lagos, Nigeria", continent: "Africa", coordinates: [3.3792, 6.5244], status: "onboarding", icon: "lagos" },
  { id: "ghana", name: "Accra, Ghana", continent: "Africa", coordinates: [-0.1870, 5.6037], status: "onboarding" },
  { id: "senegal", name: "Dakar, Senegal", continent: "Africa", coordinates: [-17.4677, 14.7167], status: "onboarding" },

  // Asia — now pinned to each market's largest city.
  { id: "indonesia", name: "Jakarta, Indonesia", continent: "Asia", coordinates: [106.8456, -6.2088], status: "onboarding" },
  { id: "thailand", name: "Bangkok, Thailand", continent: "Asia", coordinates: [100.5018, 13.7563], status: "onboarding" },
  { id: "china", name: "Shanghai, China", continent: "Asia", coordinates: [121.4737, 31.2304], status: "onboarding", icon: "shanghai" },
  // The 4 below were given as "e.g." examples, not an explicit client
  // list — flagged for client confirmation in the implementation report.
  { id: "india", name: "Mumbai, India", continent: "Asia", coordinates: [72.8777, 19.0760], status: "onboarding" },
  { id: "japan", name: "Tokyo, Japan", continent: "Asia", coordinates: [139.6503, 35.6762], status: "onboarding", icon: "tokyo" },
  { id: "south-korea", name: "Seoul, South Korea", continent: "Asia", coordinates: [126.9780, 37.5665], status: "onboarding" },
  { id: "uae", name: "Dubai, UAE", continent: "Asia", coordinates: [55.2708, 25.2048], status: "onboarding", icon: "dubai" },

  // Europe, South America, Oceania — no specific cities were given by
  // the client ("most popular markets"); these 4 are my own reasonable
  // default picks, flagged for client confirmation in the report. Now
  // pinned to each country's leading city.
  { id: "uk", name: "London, United Kingdom", continent: "Europe", coordinates: [-0.1276, 51.5072], status: "onboarding" },
  { id: "germany", name: "Berlin, Germany", continent: "Europe", coordinates: [13.4050, 52.5200], status: "onboarding" },
  { id: "brazil", name: "São Paulo, Brazil", continent: "South America", coordinates: [-46.6333, -23.5505], status: "onboarding" },
  { id: "australia", name: "Sydney, Australia", continent: "Oceania", coordinates: [151.2093, -33.8688], status: "onboarding" },
];

/** USA cities are rendered as one grouped marker on the map (6 separate
 * dots would overlap at world-map scale) — this is its approximate
 * display position, NOT a real city's coordinate. */
export const USA_GROUP_POSITION: [number, number] = [-96, 38];

export const USA_MARKETS = RETAIL_MARKETS.filter((m) => m.id.startsWith("usa-"));
export const NON_USA_MARKETS = RETAIL_MARKETS.filter((m) => !m.id.startsWith("usa-"));
