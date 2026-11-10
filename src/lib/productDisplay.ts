// Client-safe product display helpers (price formatting, image lookup).
// Deliberately kept separate from src/lib/products.ts, which imports
// src/lib/supabase/admin.ts (guarded by `import "server-only"`) — any
// file that imports products.ts gets pulled into that server-only
// module graph, which breaks when a "use client" component (ShopSection,
// ProductCard, ProductDetail) tries to import it too.

import type { ProductStatus } from "@/types";

export function formatPrice(price: number, status?: ProductStatus) {
  // price <= 0 means pricing isn't set yet. What that means to the
  // shopper depends on why: a sold-out item reads as "SOLD OUT!", while
  // a not-yet-released one invites an exclusive pre-order instead of a
  // misleading $0.00.
  if (price <= 0) {
    if (status === "sold-out") return "SOLD OUT!";
    return "ORDER EXCLUSIVELY";
  }
  return `$${price.toFixed(2)}`;
}

/** Product image filenames per public/images/<folder>, in the order they
 * should appear in the carousel. Keyed by product slug (not category —
 * "elev8-flavor-caps" and "elev8-essence-pods" share the DB category
 * "Essence Pods" but need different folders, so category alone can't
 * disambiguate them). Each folder's clean, lowercase-hyphenated name was
 * matched by hand against the live products table; the messier raw/
 * Title-Case export folders under public/images/ are source dumps never
 * referenced by any code and are intentionally not wired in here. */
const PRODUCT_IMAGE_FOLDERS: Record<string, { folder: string; files: string[] }> = {
  "aluminum-bottles": {
    folder: "aluminum-bottles",
    files: [
      "all-product.png",
      "believe-product.png",
      "consciousness-product.png",
      "desire-product.png",
      "energy-product.png",
      "frequency-product.png",
      "gratitude-product.png",
      "love-product.png",
      "mindset-product.png",
      "thoughts-product.png",
      "vibration-product.png",
      "you-product.png",
    ],
  },
  "elev8-hydration-pump": {
    folder: "hydration-pump",
    files: [
      "all-product.png",
      "believe-product.png",
      "consciousness-product.png",
      "desire-product.png",
      "energy-product.png",
      "frequency-product.png",
      "gratitude-product.png",
      "love-product.png",
      "mindset-product.png",
      "thoughts-product.png",
      "vibration-product.png",
      "you-product.png",
    ],
  },
  "elev8-refresh": {
    folder: "elev8-refresh",
    files: [
      "all-blackberry-product.png",
      "believe-product.png",
      "consciousness-midnight-berry-product.png",
      "desire-orange-passion-product.png",
      "energy-coconut-product.png",
      "frequency-cool-mint-product.png",
      "gratitude-product.png",
      "love-product.png",
      "mindset-cherry-burst-product.png",
      "thoughts-product.png",
      "vibration-aqua-mint-product.png",
      "you-blueberry-product.png",
    ],
  },
  "elev8ated-ice": {
    folder: "elev8ated-ice",
    files: [
      "all-lavender-product.png",
      "believe-lemon-product.png",
      "consciousness-blackberry-product.png",
      "desire-orange-product.png",
      "energy-coconut-product.png",
      "frequency-ice-mint-product.png",
      "gratitude-cucumber-mint-product.png",
      "love-lime-basil-product.png",
      "mindset-strawberry-product.png",
      "thoughts-mango-product.png",
      "vibration-blue-apple-product.png",
      "you-blueberry-product.png",
    ],
  },
  // DB category is "Essence Pods" for this row too, but the slug/name are
  // clearly flavor caps — matched by slug, not category, to avoid
  // colliding with "elev8-essence-pods" below.
  "elev8-flavor-caps": {
    folder: "flavour-caps",
    files: [
      "all-lavender-product.png",
      "believe-lemon-product.png",
      "consciousness-blackberry-product.png",
      "desire-orange-product.png",
      "energy-coconut-product.png",
      "frequency-ice-mint-product.png",
      "gratitude-cucumber-mint-product.png",
      "love-lime-basil-product.png",
      "mindset-strawberry-product.png",
      "thoughts-mango-product.png",
      "vibration-blue-apple-product.png",
      "you-blueberry-product.png",
    ],
  },
  "elev8-essence-pods": {
    folder: "essence-pods",
    files: [
      "all-product.png",
      "believe-product.png",
      "consciousness-product.png",
      "desire-product.png",
      "energy-product.png",
      "frequency-product.png",
      "gratitude-product.png",
      "love-product.png",
      "mindset-product.png",
      "thoughts-product.png",
      "vibration-product.png",
      "you-product.png",
    ],
  },
  "love-gift": {
    folder: "gift-cards",
    files: ["gift-card-1.png", "gift-card-2.png"],
  },
  "glass-bottles": {
    folder: "glass-bottles",
    files: [
      "all-product.png",
      "believe-product.png",
      "consciousness-product.png",
      "desire-product.png",
      "energy-product.png",
      "frequency-product.png",
      "gratitude-product.png",
      "love-product.png",
      "mindset-product.png",
      "thoughts-product.png",
      "vibration-product.png",
      "you-product.png",
    ],
  },
  "paper-box": {
    folder: "paper-box",
    files: [
      "all-product.png",
      "believe-product.png",
      "consciousness-product.png",
      "desire-product.png",
      "energy-product.png",
      "frequency-product.png",
      "gratitude-product.png",
      "love-product.png",
      "mindset-product.png",
      "thoughts-product.png",
      "vibration-product.png",
      "you-product.png",
    ],
  },
  "pet-water-bottles": {
    folder: "per-water-bottle",
    files: [
      "all-product.png",
      "believe-product.png",
      "consciousness-product.png",
      "desire-product.png",
      "energy-product.png",
      "frequency-product.png",
      "gratitude-product.png",
      "love-product.png",
      "mindset-product.png",
      "thoughts-product.png",
      "vibration-product.png",
      "you-product.png",
    ],
  },
  // Plain case-of-12 water bottle (no Understanding variant) — reuses the
  // same real bottle photos as pet-water-bottles, since it's physically
  // the same 16.9 FL OZ (500 mL) bottle, per client direction.
  "elev8-water-16-9-fl-oz": {
    folder: "per-water-bottle",
    files: [
      "all-product.png",
      "believe-product.png",
      "consciousness-product.png",
      "desire-product.png",
      "energy-product.png",
      "frequency-product.png",
      "gratitude-product.png",
      "love-product.png",
      "mindset-product.png",
      "thoughts-product.png",
      "vibration-product.png",
      "you-product.png",
    ],
  },
  "elev8-smart-bottle": {
    folder: "smart-bottles",
    files: [
      "all-product.png",
      "believe-product.png",
      "consciousness-product.png",
      "desire-product.png",
      "energy-product.png",
      "frequency-product.png",
      "gratitude-product.png",
      "love-product.png",
      "mindset-product.png",
      "thoughts-product.png",
      "vibration-product.png",
      "you-product.png",
    ],
  },
};

/** Returns the public image paths for a product's carousel, resolved from
 * its slug against PRODUCT_IMAGE_FOLDERS — independent of the DB's
 * image_url column (which is null for every row today). Returns [] when
 * no folder is matched, so callers fall back to their existing
 * image_url/placeholder behavior rather than guessing an unrelated image. */
export function getProductImages(product: { slug: string }): string[] {
  const entry = PRODUCT_IMAGE_FOLDERS[product.slug];
  if (!entry) return [];
  return entry.files.map((file) => `/images/${entry.folder}/${file}`);
}

// Canonical 12-Understanding order used elsewhere on the site, for
// picking each grid card's default starting image. NOTE: this is
// deliberately separate from PRODUCT_IMAGE_FOLDERS' own file order
// (alphabetical, e.g. "all, believe, consciousness, desire..."), which
// must stay untouched since it's what the carousel's prev/next arrows
// cycle through — reordering it would change existing arrow behavior.
const UNDERSTANDING_ORDER = [
  "all",
  "you",
  "love",
  "desire",
  "energy",
  "believe",
  "vibration",
  "mindset",
  "gratitude",
  "frequency",
  "thoughts",
  "consciousness",
];

/** Picks which image a grid card's carousel should START on, so adjacent
 * cards in a row don't all open on the same "ALL" bottle. `position` is
 * the card's index within the currently displayed list (e.g. ShopCatalog's
 * filtered `visible` array, or ShopSection's 3 featured products) — NOT
 * the product's own catalog id. Cycles through UNDERSTANDING_ORDER
 * (wrapping past 12 cards), then finds that Understanding's image within
 * THIS product's own file list by filename prefix match (e.g. "you-" also
 * matches "you-blueberry-product.png" for flavor-suffixed folders).
 * Falls back to index 0 — the carousel's existing default — whenever the
 * target Understanding isn't present (e.g. gift-cards' 2 plain images, or
 * a product with fewer than 12 photos), so nothing breaks for partial
 * image sets. Purely cosmetic: does not change `images`, their order, or
 * what prev/next cycle through. */
export function getCarouselStartIndex(images: string[], position: number): number {
  if (images.length === 0) return 0;
  const understanding = UNDERSTANDING_ORDER[position % UNDERSTANDING_ORDER.length];
  const found = images.findIndex((src) => {
    const filename = src.slice(src.lastIndexOf("/") + 1).toLowerCase();
    return filename.startsWith(`${understanding}-`);
  });
  return found === -1 ? 0 : found;
}
