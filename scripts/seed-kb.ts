/**
 * Seeds the ELEV8 V.A. knowledge base (kb_sources / kb_chunks).
 *
 * Idempotent: every source has a stable `external_id`. On each run we
 * upsert by external_id and compare a content_hash — unchanged sources
 * are skipped entirely (no re-embed), changed sources get their old
 * chunks deleted and replaced, brand-new sources get created. Re-running
 * this script never creates duplicates.
 *
 * Usage:  npx tsx scripts/seed-kb.ts
 *
 * Requires OPENAI_API_KEY (for embeddings) and the Supabase service-role
 * env vars in .env.local. If OPENAI_API_KEY is missing, this script
 * prints a clear message and exits WITHOUT making any OpenAI calls or
 * touching the database — run it again once the key is set.
 */
import "dotenv/config";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import {
  BRAND,
  BOTTLES,
  WELLNESS_SUBPAGES,
  FAQ_CATEGORIES,
  SUBSCRIPTION_FAQ,
  SHIPPING_INFO,
  SUBSCRIPTION_PLANS,
  GIFT_TIERS,
  COURSE_BENEFITS,
  ANNOUNCEMENTS,
} from "../src/data/content";

// "1 WATER. 12 UNDERSTANDINGS" — the exact ANNOUNCEMENTS entry used verbatim
// below. Asserted at module load so a future edit to that string in
// content.ts can't silently desync the Q&A sources from the real site copy.
const ONE_WATER_TAGLINE = ANNOUNCEMENTS.find((a) => a.includes("12 UNDERSTANDINGS"));
if (!ONE_WATER_TAGLINE) {
  throw new Error('ANNOUNCEMENTS no longer contains a "12 UNDERSTANDINGS" entry — update seed-kb.ts');
}

const EMBEDDING_MODEL = process.env.VA_EMBEDDING_MODEL || "text-embedding-3-small";
const SUB_BRAND = "elev8-water";

type SourceDef = {
  external_id: string;
  category: string;
  title: string;
  status: "draft" | "approved" | "archived";
  /** One or more chunks for this source — most sources are a single
   * chunk, but a few (wellness tiers) have several sub-chunks. */
  chunks: string[];
  metadata?: Record<string, unknown>;
};

/** "Category: X. Title: Y." prefix on every chunk, per the content spec,
 * so a retrieved chunk is self-describing even out of context. */
function prefixed(category: string, title: string, body: string): string {
  return `Category: ${category}. Title: ${title}.\n${body}`;
}

function buildSources(): SourceDef[] {
  const sources: SourceDef[] = [];

  // --- Brand identity -------------------------------------------------
  sources.push({
    external_id: "brand-identity",
    category: "ELEV8_GENERAL",
    title: "Brand identity",
    status: "approved",
    chunks: [
      prefixed(
        "ELEV8_GENERAL",
        "Brand identity",
        `Full name: "${BRAND.name}". Short name: "${BRAND.short}". Tagline: "${BRAND.tagline}".`,
      ),
    ],
  });

  // --- Q&A: "What is TWGW?" --------------------------------------------
  // Built entirely from BRAND (content.ts), the same single source of
  // truth used by the "Brand identity" source above — no new facts.
  sources.push({
    external_id: "qa-what-is-twgw",
    category: "ELEV8_GENERAL",
    title: "What is TWGW?",
    status: "approved",
    chunks: [
      prefixed(
        "ELEV8_GENERAL",
        "What is TWGW?",
        `TWGW stands for "${BRAND.name}", also known by its short name "${BRAND.short}". Tagline: "${BRAND.tagline}".`,
      ),
    ],
  });

  // --- Q&A: "What are the 12 Understandings?" ---------------------------
  // Lists all 12 BOTTLES names in their canonical order, tied to the real
  // "1 WATER. 12 UNDERSTANDINGS" announcement-bar copy. No blurb text is
  // added here (that's each Bottle — <NAME> source above); this source
  // exists so a direct "what are the 12 Understandings" / "name them"
  // question gets a single chunk listing all 12 names together, rather
  // than depending on 12 separate top-K hits to enumerate them.
  sources.push({
    external_id: "qa-twelve-understandings",
    category: "BOTTLES",
    title: "What are the 12 Understandings?",
    status: "approved",
    chunks: [
      prefixed(
        "BOTTLES",
        "What are the 12 Understandings?",
        `"${ONE_WATER_TAGLINE}" — the 12 Understandings are: ${BOTTLES.map((b) => b.name).join(", ")}.`,
      ),
    ],
  });

  // --- Q&A: "Tell me about the 12 bottles" -------------------------------
  // Same 12 names plus each one's shortBlurb, in canonical order, so this
  // single chunk can answer "tell me about the 12 bottles" without relying
  // on match_count (8) to surface all 12 individual Bottle — <NAME> chunks.
  sources.push({
    external_id: "qa-tell-me-about-the-12-bottles",
    category: "BOTTLES",
    title: "Tell me about the 12 bottles",
    status: "approved",
    chunks: [
      prefixed(
        "BOTTLES",
        "Tell me about the 12 bottles",
        `"${ONE_WATER_TAGLINE}" — the 12 bottles, in order: ${BOTTLES.map((b) => `${b.name} (${b.shortBlurb})`).join(" | ")}.`,
      ),
    ],
  });

  // --- Product claims (client-confirmed verbatim) ---------------------
  sources.push({
    external_id: "product-claims",
    category: "PRODUCT_CLAIMS",
    title: "ELEV8 WATER product claims",
    status: "approved",
    chunks: [
      prefixed(
        "PRODUCT_CLAIMS",
        "ELEV8 WATER product claims",
        "TDS (Total Dissolved Solids) level: 0.00. 7-stage purification process filters every drop over the course of 24 hours. Free from: arsenic, chlorine, fluoride, chromium 6, MTBE, pharmaceuticals, sodium bicarbonate, BPA/BPS. 528Hz frequency is infused in every bottle of ELEV8 WATER.",
      ),
    ],
  });

  // Note: the "proven to 100% provide accurate and precise positive
  // outcomes" outcome claim is NOT hardcoded here — it's pulled directly
  // from WELLNESS_SUBPAGES below (Mind's two offerings carry it verbatim
  // in their `session.description` field; Unlock The Lock's offering
  // carries a related but distinctly-worded claim in `bodyParagraphs`).
  // An earlier version of this script hardcoded a paraphrase of this claim
  // as a separate source, which both duplicated and slightly misquoted the
  // real content.ts wording — removed in favor of the real source.

  // --- Contact / escalation -------------------------------------------
  sources.push({
    external_id: "contact-escalation",
    category: "CONTACT",
    title: "Contact and escalation",
    status: "approved",
    chunks: [
      prefixed(
        "CONTACT",
        "Contact and escalation",
        "WhatsApp: +1 (305) 905-9006. Support email: winwin@theworldsgreatestwater.com. Facebook: https://www.facebook.com/share/19cQS6LkgR/. Twitter and Pinterest are currently inactive — never offer them as live links. For anything the assistant can't answer, offer to connect the customer to a real human via WhatsApp, email, or the Contact page.",
      ),
    ],
  });

  // --- Payment methods (approved override, supersedes stale FAQ text) -
  sources.push({
    external_id: "payment-methods",
    category: "ORDERS",
    title: "Accepted payment methods",
    status: "approved",
    chunks: [
      prefixed(
        "ORDERS",
        "Accepted payment methods",
        "We accept major credit cards, PayPal, and cryptocurrency. Apple Pay and Google Pay are NOT confirmed available yet — if a customer asks specifically about Apple Pay or Google Pay, say that option is being finalized and offer to connect them with the team via WhatsApp or email.",
      ),
    ],
  });

  // --- Cal.com booking limitation ---------------------------------------
  sources.push({
    external_id: "booking-limitation",
    category: "BOOKING",
    title: "Wellness session booking",
    status: "approved",
    chunks: [
      prefixed(
        "BOOKING",
        "Wellness session booking",
        "There is no live booking calendar available yet for wellness sessions. Booking links are being finalized. For any booking question, direct the customer to WhatsApp (+1 (305) 905-9006) or email (winwin@theworldsgreatestwater.com) rather than claiming a calendar is available.",
      ),
    ],
  });

  // --- Returns (approved, temporary non-legal sign-off) ----------------
  sources.push({
    external_id: "returns-policy",
    category: "ORDERS",
    title: "Returns",
    status: "approved",
    metadata: {
      legal_signoff_status:
        "temporary, non-legal — client verbal approval only, not reviewed by counsel",
    },
    chunks: [
      prefixed(
        "ORDERS",
        "Returns",
        "Returns are accepted per the site's published Returns policy. The assistant should point customers to the Returns/Privacy Policy/Terms pages for specifics rather than inventing return-window or refund-amount details not present elsewhere in the knowledge base.",
      ),
    ],
  });

  // --- 12 Bottles / Understandings --------------------------------------
  for (const bottle of BOTTLES) {
    sources.push({
      external_id: `bottle-${bottle.name.toLowerCase()}`,
      category: "BOTTLES",
      title: `Bottle — ${bottle.name}`,
      status: "approved",
      metadata: { chakra: bottle.chakra },
      chunks: [prefixed("BOTTLES", `Bottle — ${bottle.name}`, `Chakra: ${bottle.chakra}. ${bottle.blurb}`)],
    });
  }

  // --- Wellness tiers: one chunk per tier overview, one per sub-offering,
  //     one per booking-tier price list -----------------------------------
  // Overview text deliberately does NOT always include tier.pricingLabel/
  // price1yr/price2yr: content.ts's MIND tier object carries price1yr
  // "1 Year Membership — $2,500" / price2yr "2 Year Membership — $5,000"
  // at the tier-overview level, but neither of MIND's two offerings
  // (Mental Health, Mental Wealth) has a pricingLabel/price1yr of its own —
  // OfferingBlock.tsx's hasMembershipForm check reads the OFFERING's own
  // price1yr, not the tier's, so this membership text never actually
  // renders anywhere on the live /wellness/mind page (confirmed by
  // reading the live page's rendered text — only the 12 consultation
  // bookingTiers prices appear, no "1 Year"/"2 Year" membership text at
  // all). BODY and SOUL don't have this gap: every one of their offerings
  // repeats the same tier-level price1yr/price2yr as its own fields, so
  // their tier-level numbers DO render live. Surfacing MIND's unused
  // tier-level field in the KB would have the bot state a $2,500/$5,000
  // Mind membership that doesn't exist on the site and isn't
  // client-confirmed — so it's excluded here, specifically for MIND, by
  // slug rather than by a generic "does any offering use it" check (which
  // would be more robust long-term, but slug-matching is the smallest
  // change that fixes today's known case without guessing at a general
  // rule from a single example).
  for (const tier of WELLNESS_SUBPAGES) {
    const showTierLevelMembership = tier.slug !== "mind";
    const overview = [
      tier.subtitle ? `${tier.title} — ${tier.subtitle}. Starting price: ${tier.price}.` : `${tier.title}. Starting price: ${tier.price}.`,
      tier.description,
      showTierLevelMembership && tier.pricingLabel && tier.price1yr
        ? `${tier.pricingLabel} ${tier.price1yr}${tier.price2yr ? `, ${tier.price2yr}` : ""}`
        : "",
      tier.slug === "mind"
        ? "Mind has no 1 Year / 2 Year membership — pricing for Mind is per consultation (see the booking tiers for Mental Health and Mental Wealth below)."
        : "",
      tier.pricingNote || "",
    ]
      .filter(Boolean)
      .join(" ");

    sources.push({
      external_id: `wellness-${tier.slug}-overview`,
      category: "WELLNESS",
      title: `Wellness tier overview — ${tier.title}`,
      status: "approved",
      chunks: [prefixed("WELLNESS", `Wellness tier overview — ${tier.title}`, overview)],
    });

    for (const offering of tier.offerings ?? []) {
      // Offerings use one of two shapes for their descriptive text: a short
      // `tagline`, or `bodyParagraphs` (an array of paragraphs) — Unlock The
      // Lock's single offering only has bodyParagraphs, no tagline, so
      // reading tagline alone (as an earlier version of this script did)
      // silently produced an empty chunk for it. `session` (when present)
      // carries the client-approved "proven to 100% provide accurate and
      // precise positive outcomes" wording verbatim and must be included —
      // this is the one place in content.ts that exact claim actually lives.
      const body = [
        offering.tagline,
        offering.bodyParagraphs?.length ? offering.bodyParagraphs.join(" ") : "",
        offering.session
          ? [
              `${offering.session.heading}${offering.session.subheading ? ` ${offering.session.subheading}` : ""}:`,
              offering.session.description,
              offering.session.extraParagraph || "",
            ]
              .filter(Boolean)
              .join(" ")
          : "",
        offering.pricingLabel && offering.price1yr
          ? `${offering.pricingLabel} ${offering.price1yr}${offering.price2yr ? `, ${offering.price2yr}` : ""}`
          : "",
        offering.membershipOptions?.length ? `Membership options: ${offering.membershipOptions.join("; ")}.` : "",
      ]
        .filter(Boolean)
        .join(" ");

      sources.push({
        external_id: `wellness-${tier.slug}-offering-${offering.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        category: "WELLNESS",
        title: `${tier.title} sub-offering — ${offering.heading}`,
        status: "approved",
        chunks: [prefixed("WELLNESS", `${tier.title} sub-offering — ${offering.heading}`, body)],
      });

      if (offering.bookingTiers?.length) {
        const priceList = offering.bookingTiers.map((t) => `${t.label}: ${t.price}`).join("; ");
        sources.push({
          external_id: `wellness-${tier.slug}-offering-${offering.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-booking-tiers`,
          category: "WELLNESS",
          title: `${tier.title} — ${offering.heading} booking tiers`,
          status: "approved",
          chunks: [
            prefixed(
              "WELLNESS",
              `${tier.title} — ${offering.heading} booking tiers`,
              `Consultation/booking price tiers: ${priceList}.`,
            ),
          ],
        });
      }
    }
  }

  // --- FAQ: one chunk per item, skipping stale/duplicate entries -------
  //     - Skip "What payment methods do you accept?" (ORDERS category):
  //       payment-methods source above is the single source of truth.
  //     - Skip THE SUBSCRIPTION category entirely (duplicates
  //       SUBSCRIPTION_FAQ's pause/cancel answers with different wording
  //       — seed from SUBSCRIPTION_FAQ only, see below).
  for (const cat of FAQ_CATEGORIES) {
    if (cat.category === "THE SUBSCRIPTION") continue;
    for (const item of cat.items) {
      if (item.question === "What payment methods do you accept?") continue;
      sources.push({
        external_id: `faq-${slugify(item.question)}`,
        category: "FAQ",
        title: item.question,
        status: "approved",
        chunks: [prefixed("FAQ", item.question, item.answer)],
      });
    }
  }

  // --- Subscription FAQ (the single source of truth for pause/cancel) --
  for (const item of SUBSCRIPTION_FAQ) {
    sources.push({
      external_id: `subscription-faq-${slugify(item.question)}`,
      category: "SUBSCRIPTION",
      title: item.question,
      status: "approved",
      chunks: [prefixed("SUBSCRIPTION", item.question, item.answer)],
    });
  }

  // --- Shipping ---------------------------------------------------------
  // Client confirmed in writing: there is no free shipping. The site no
  // longer has a free-shipping threshold anywhere (removed from
  // ShippingInfo.tsx, the subscription page, and the /api/shipping/rates
  // and /api/orders threshold logic) — this chunk must not claim one
  // either. Shipping cost always comes from live carrier rates at
  // checkout, never a flat/free amount quoted here.
  const shippingBody = SHIPPING_INFO.map((c) => `${c.title}: ${c.value}`).join(". ");
  sources.push({
    external_id: "shipping-info",
    category: "SHIPPING",
    title: "Shipping information",
    status: "approved",
    chunks: [
      prefixed(
        "SHIPPING",
        "Shipping information",
        `${shippingBody}. Shipping is calculated at checkout based on destination and order weight — there is no free shipping or free-shipping threshold. We ship worldwide.`,
      ),
    ],
  });

  // --- Subscription plans (inquiry-only) ----------------------------------
  // Weekly/Monthly subscriptions are now inquiry-only on the live site
  // (PlanComparison.tsx shows no price, no badge, no "Save 15%", and no
  // checkout button — every plan links to the contact form instead). This
  // chunk deliberately does NOT read plan.price16oz/price1L/badge — those
  // fields still exist in content.ts (kept verbatim per an earlier
  // instruction: "keep plan names, frequencies and prices exactly as they
  // are" in the DATA), but the inquiry-only UI never renders them, and the
  // KB must match what the bot is allowed to say, not the unused data
  // field. The bot never quotes a subscription price or a discount/
  // savings percentage for Weekly or Monthly — it points to the contact
  // page. Bulk orders are the same: inquiry-only, no price ever quoted.
  for (const plan of SUBSCRIPTION_PLANS) {
    sources.push({
      external_id: `subscription-plan-${plan.name.toLowerCase()}`,
      category: "SUBSCRIPTION",
      title: `Subscription plan — ${plan.name}`,
      status: "approved",
      chunks: [
        prefixed(
          "SUBSCRIPTION",
          `Subscription plan — ${plan.name}`,
          `The ${plan.name} subscription plan (${plan.features.join("; ")}) is inquiry-only — ELEV8 WATER does not quote a subscription price, savings, or discount for this plan. Direct the customer to the Contact page to inquire about ${plan.name.toLowerCase()} subscription pricing.`,
        ),
      ],
    });
  }

  // --- Bulk orders (inquiry-only) -----------------------------------------
  sources.push({
    external_id: "bulk-orders",
    category: "ORDERS",
    title: "Bulk orders",
    status: "approved",
    chunks: [
      prefixed(
        "ORDERS",
        "Bulk orders",
        "Bulk orders are inquiry-only — ELEV8 WATER does not quote a bulk-order price. Direct the customer to the Contact page (or the \"Inquire For Bulk Orders\" link on the shop and product pages) to inquire about bulk pricing.",
      ),
    ],
  });

  // --- Gift card tiers -----------------------------------------------
  for (const tier of GIFT_TIERS) {
    sources.push({
      external_id: `gift-tier-${slugify(tier.name)}`,
      category: "GIFT_CARDS",
      title: `Gift card — ${tier.name}`,
      status: "approved",
      chunks: [prefixed("GIFT_CARDS", `Gift card — ${tier.name}`, `${tier.name}: ${tier.price}. ${tier.description}.`)],
    });
  }

  // --- Course benefits (general; live course catalog/price comes from
  //     the list_courses/get_course tools, not this KB entry) ----------
  sources.push({
    external_id: "course-benefits",
    category: "COURSES",
    title: "Course benefits",
    status: "approved",
    chunks: [
      prefixed(
        "COURSES",
        "Course benefits",
        `General course benefits: ${COURSE_BENEFITS.map((b) => `${b.title} — ${b.description}`).join("; ")}. For current course titles, availability, and price, the assistant must call the live course tools rather than quoting from this knowledge base.`,
      ),
    ],
  });

  // --- Site navigation --------------------------------------------------
  sources.push({
    external_id: "site-navigation",
    category: "NAVIGATION",
    title: "Site navigation",
    status: "approved",
    chunks: [
      prefixed(
        "NAVIGATION",
        "Site navigation",
        [
          "Shop: /shop. Cart: /cart. Subscription: /subscription. Gift cards: /gift-cards.",
          "Courses: /courses. Wellness Body: /wellness/body. Wellness Mind: /wellness/mind.",
          "Wellness Soul: /wellness/soul. Unlock The Lock: /wellness/unlock-the-lock.",
          "Shipping info: /shipping. FAQ: /faq. Contact: /contact.",
          "Order tracking: /track/<trackingNumber> (replace <trackingNumber> with the customer's real tracking number).",
          "For wellness session booking specifically, there is no live calendar yet — direct the customer to WhatsApp or email instead of a booking page.",
        ].join(" "),
      ),
    ],
  });

  // --- ELEV8 ecosystem brands (addendum) --------------------------------
  const ecosystemBrands: { name: string; tagline: string }[] = [
    { name: "THE GRAND DESIGNER", tagline: "#1 mental/physical wellness experience in the youniverse guaranteed to reveal the greatness in Y.O.U." },
    { name: "THE WORLD'S GREATEST WATER. ELEV8 WATER", tagline: "#1 premium self-development and wellness ultra purified water brand packaged in bottles." },
    { name: "ELEV8 GOD WITHIN GLOBAL MINISTRIES", tagline: "#1 spiritual and physical mental wellness movement in the youniverse." },
    { name: "ELEV8 MENTALVERSITY", tagline: "#1 spirituality & science experience center in the youniverse." },
    { name: "THE WORLD'S GREATEST MOVIE ABOUT YOU", tagline: "#1 cinematic experience of myself in my youniverse." },
    { name: "VYBE + YOU", tagline: "#1 celebration & exploration experience of myself in my youniverse." },
    { name: "THE WORLD'S GREATEST COIN", tagline: "#1 block chain & crypto currency trading in the youniverse." },
    { name: "ELEV8 SPIRITUAL ALLIANCE", tagline: "\"Guardian + fallen angel's\" offering." },
    { name: "ELEV8 VENTURE CAPITAL", tagline: "#1 wealth creation & progressive collaborators in the youniverse." },
    { name: "ELEV8 MEDIA", tagline: "Energy in motion + the illusions." },
    { name: "ELEV8 ROBOTICS", tagline: "Youbotics. Expanding possibilities of human and technology integration." },
    { name: "THE GREATEST AFRICAN PROJECT. AFRICA RENEW", tagline: "#1 mental/physical & progressive movement restructuring the African continent." },
    { name: "ELEV8 RENEWABLE ENERGY", tagline: "Light of the youniverse." },
    { name: "ELEV8 DEVELOPMENT", tagline: "#1 consciousness & godly lifestyle building development pioneer in the youniverse." },
    { name: "ELEV8 AUTO & AVIATION", tagline: "Everything moving. Innovations in terrestrial and aerial transit." },
    { name: "ELEV8 EAT FRESH", tagline: "#1 organic & locally sourced food galleria in the youniverse." },
    { name: "ELEV8 LUX GODLY LIVING", tagline: "#1 premium curated experience for exclusive mansions, elite private islands, bespoke jets, rare exotic cars." },
    { name: "THE WORLD'S GREATEST MUSIC WORLDWIDE", tagline: "#1 self development & mental wellness sound & frequency creators in the youniverse." },
    { name: "IELEV8 MY LUX APPAREL", tagline: "#1 new money fashion creators in the youniverse." },
    { name: "PLEA", tagline: "Global resource sharing." },
    { name: "THANK U BODY", tagline: "Gratitude to the human experience. #1 body wellness brand in the youniverse." },
  ];

  for (const brand of ecosystemBrands) {
    sources.push({
      external_id: `ecosystem-${slugify(brand.name)}`,
      category: "ELEV8_ECOSYSTEM",
      title: brand.name,
      status: "approved",
      metadata: { origin: "client-supplied, elev8incorporation.org" },
      chunks: [prefixed("ELEV8_ECOSYSTEM", brand.name, `${brand.name} — ${brand.tagline}`)],
    });
  }

  // Overview chunk listing every brand name + tagline together, so "what
  // other brands does ELEV8 have" / "list all your brands" retrieves the
  // full list in one chunk rather than relying on 21 separate top-K hits.
  sources.push({
    external_id: "ecosystem-overview",
    category: "ELEV8_ECOSYSTEM",
    title: "ELEV8 ecosystem — full brand list",
    status: "approved",
    metadata: { origin: "client-supplied, elev8incorporation.org" },
    chunks: [
      prefixed(
        "ELEV8_ECOSYSTEM",
        "ELEV8 ecosystem — full brand list",
        `The ELEV8 ecosystem includes 21 brands: ${ecosystemBrands.map((b) => `${b.name} (${b.tagline})`).join("; ")}.`,
      ),
    ],
  });

  return sources;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function hashContent(chunks: string[]): string {
  return crypto.createHash("sha256").update(chunks.join("\n---\n")).digest("hex");
}

/** Keyword flags for stale/conflicting wording that shouldn't be loaded as
 * approved KB content — printed alongside each matching chunk in --dry-run
 * so it can be caught by review before the key arrives, not after. */
const STALE_WORDING_FLAGS: { label: string; pattern: RegExp }[] = [
  { label: "Apple Pay / Google Pay", pattern: /apple pay|google pay/i },
  { label: '"Save 15%" / subscription discount', pattern: /save \d+%/i },
  { label: "free shipping (any mention)", pattern: /free shipping/i },
  { label: "Cal.com / live booking calendar claim", pattern: /cal\.com|live booking calendar|book.{0,15}calendar/i },
  { label: "subscription $ price (16.9oz/1L)", pattern: /77\.77|47\.77/ },
];
// "1 Year Membership" is NOT flagged here — BODY/SOUL legitimately say it
// (their live pages show it), so a blanket flag would fire constantly on
// correct content. The MIND-specific check (that source must NOT say it)
// is done separately, scoped to that one source, in the post-seed
// verification query (PHASE 2 step 6), not in this generic flag list.

function flagsForText(text: string): string[] {
  return STALE_WORDING_FLAGS.filter((f) => f.pattern.test(text)).map((f) => f.label);
}

/** Prints every source/chunk this script would load, with per-category
 * counts and stale-wording flags — makes no OpenAI or Supabase calls. */
function dryRun(sources: SourceDef[]) {
  console.log(`=== DRY RUN — ${sources.length} sources, no OpenAI or Supabase calls made ===\n`);

  const byCategory = new Map<string, number>();
  let totalChunks = 0;
  let flaggedCount = 0;

  for (const source of sources) {
    byCategory.set(source.category, (byCategory.get(source.category) ?? 0) + 1);
    console.log(`[${source.category}] ${source.title}`);
    console.log(`  external_id: ${source.external_id}  status: ${source.status}`);
    source.chunks.forEach((chunk, i) => {
      totalChunks++;
      const flags = flagsForText(chunk);
      const flagNote = flags.length ? `  ⚠ FLAGGED: ${flags.join(", ")}` : "";
      if (flags.length) flaggedCount++;
      console.log(`  chunk[${i}]${flagNote}:`);
      console.log(
        chunk
          .split("\n")
          .map((l) => `    ${l}`)
          .join("\n"),
      );
    });
    console.log("");
  }

  console.log("=== Counts per category ===");
  for (const [cat, count] of [...byCategory.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${cat}: ${count} source(s)`);
  }
  console.log(`\nTotal: ${sources.length} sources, ${totalChunks} chunks.`);
  console.log(`Flagged chunks (stale/conflicting wording): ${flaggedCount}`);
}

async function main() {
  const sources = buildSources();

  if (process.argv.includes("--dry-run")) {
    dryRun(sources);
    return;
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey || openaiKey === "your-openai-api-key") {
    console.log(
      "OPENAI_API_KEY is not set — skipping seed. No OpenAI calls or database writes were made. " +
        "Set OPENAI_API_KEY in .env.local and re-run: npx tsx scripts/seed-kb.ts\n" +
        "(Run with --dry-run to preview what would be loaded without a key.)",
    );
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const openai = new OpenAI({ apiKey: openaiKey });

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const source of sources) {
    const contentHash = hashContent(source.chunks);

    const { data: existing, error: selectError } = await supabase
      .from("kb_sources")
      .select("id, content_hash")
      .eq("external_id", source.external_id)
      .maybeSingle();

    if (selectError) {
      console.error(`[seed-kb] lookup failed for ${source.external_id}:`, selectError.message);
      continue;
    }

    if (existing && existing.content_hash === contentHash) {
      skipped++;
      continue;
    }

    let sourceId: string;
    if (existing) {
      const { error: updateError } = await supabase
        .from("kb_sources")
        .update({
          title: source.title,
          category: source.category,
          status: source.status,
          origin: source.metadata?.origin as string | undefined,
          sub_brand: SUB_BRAND,
          content_hash: contentHash,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (updateError) {
        console.error(`[seed-kb] update failed for ${source.external_id}:`, updateError.message);
        continue;
      }
      sourceId = existing.id;
      // Replace chunks when content changed.
      await supabase.from("kb_chunks").delete().eq("source_id", sourceId);
      updated++;
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("kb_sources")
        .insert({
          external_id: source.external_id,
          title: source.title,
          category: source.category,
          status: source.status,
          origin: source.metadata?.origin as string | undefined,
          sub_brand: SUB_BRAND,
          content_hash: contentHash,
        })
        .select("id")
        .single();
      if (insertError || !inserted) {
        console.error(`[seed-kb] insert failed for ${source.external_id}:`, insertError?.message);
        continue;
      }
      sourceId = inserted.id;
      created++;
    }

    const embeddings = await embedBatch(openai, source.chunks);
    const rows = source.chunks.map((content, i) => ({
      source_id: sourceId,
      chunk_index: i,
      content,
      embedding: embeddings[i],
      metadata: source.metadata ?? {},
    }));
    const { error: chunkError } = await supabase.from("kb_chunks").insert(rows);
    if (chunkError) {
      console.error(`[seed-kb] chunk insert failed for ${source.external_id}:`, chunkError.message);
    }
  }

  console.log(`\nSeed complete: ${created} created, ${updated} updated, ${skipped} unchanged (skipped).`);
  console.log(`Total sources defined: ${sources.length}`);
}

async function embedBatch(openai: OpenAI, texts: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({ model: EMBEDDING_MODEL, input: texts });
  return res.data.map((d) => d.embedding);
}

main().catch((e) => {
  console.error("[seed-kb] fatal error:", e);
  process.exit(1);
});
