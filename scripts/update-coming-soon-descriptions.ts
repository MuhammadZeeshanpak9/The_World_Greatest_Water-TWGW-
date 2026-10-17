/**
 * One-off update: replaces the generic "Coming soon — details to
 * follow." description on specific coming-soon products with a real,
 * category-appropriate description, now that those categories have
 * product photos. Scoped by exact row id — touches only the 7 rows
 * listed in DESCRIPTIONS below, and only the `description` column.
 *
 * Does NOT touch price, status, category, image_url, or any other row.
 * Does NOT run a migration or reseed — this is a plain UPDATE via the
 * same Supabase service-role client pattern as scripts/seed-kb.ts.
 *
 * Usage:
 *   npx tsx scripts/update-coming-soon-descriptions.ts            (dry run, default — no writes)
 *   npx tsx scripts/update-coming-soon-descriptions.ts --apply     (performs the real update)
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const APPLY = process.argv.includes("--apply");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const GENERIC_DESCRIPTION = "Coming soon — details to follow.";

// id values from the live products table, confirmed via a direct query
// before writing this script — each row's current description was
// verified to be exactly GENERIC_DESCRIPTION before being included here.
const DESCRIPTIONS: { id: string; slug: string; description: string }[] = [
  {
    id: "ebcdd813-618f-4493-b396-0525945780fc",
    slug: "aluminum-bottles",
    description:
      "Premium aluminum bottles built for the elevated lifestyle — sustainable, sleek and designed to travel with you anywhere life takes you. The same ultra-purified, 528Hz frequency-infused ELEV8 WATER in a bold, eco-conscious format, one bottle for each of the 12 self-development understandings that define the ELEV8 experience.",
  },
  {
    id: "21c271d0-3412-4188-ad68-757bfad891ec",
    slug: "elev8-hydration-pump",
    description:
      "An on-site ELEV8 dispensing station bringing ultra-purified, 528Hz frequency-infused water on tap — built for homes, studios and gathering spaces that want ELEV8 WATER readily available, one dispense at a time, across each of the 12 self-development understandings that give this water its purpose.",
  },
  {
    id: "e2614b91-e2f9-4111-b9d7-4d109945e0fa",
    slug: "elev8-refresh",
    description:
      "A fast, on-the-go way to ELEV8 — the same ultra-purified, 528Hz frequency-infused water in a refreshing new format built for your everyday reset. Grab-and-go hydration for whenever life calls for a quick recentering, one for each of the 12 self-development understandings behind the ELEV8 brand.",
  },
  {
    id: "ae82a26f-7fee-4823-9fe1-929e223a4054",
    slug: "elev8ated-ice",
    description:
      "The same ultra-purified, 528Hz frequency-infused ELEV8 WATER, frozen into premium flavored ice cubes for an elevated way to cool down. A refreshing twist on everyday hydration, with one flavor crafted for each of the 12 self-development understandings at the heart of ELEV8.",
  },
  {
    id: "543c0225-22e8-4efb-a122-f9ab75851a10",
    slug: "glass-bottles",
    description:
      "Premium glass bottles for those who demand the purest possible experience — earth-friendly, beautifully designed and filled with ultra-purified, 528Hz frequency-infused ELEV8 WATER, one bottle for each of the 12 self-development understandings that make up the full ELEV8 collection today.",
  },
  {
    id: "e6433ff7-2183-48f8-a648-21dc7f038385",
    slug: "paper-box",
    description:
      "Biodegradable paper box packaging carrying the same ultra-purified, 528Hz frequency-infused ELEV8 WATER — a sustainable alternative to our PET bottles for anyone looking to lighten their footprint, one for each of the 12 self-development understandings that run through every ELEV8 product.",
  },
  {
    id: "7d0a5fdb-a1e1-45c7-9e5a-dc1e12a7d269",
    slug: "pet-water-bottles",
    description:
      "Ultra-purified ELEV8 WATER infused with 528Hz binaural frequency, bottled in our signature PET format for everyday hydration on the move. Each bottle represents one of the 12 self-development understandings, created with YOU in mind, ready wherever your day takes you.",
  },
];

function wordCount(s: string) {
  return s.trim().split(/\s+/).length;
}

async function main() {
  console.log(APPLY ? "APPLY MODE — writing to the database.\n" : "DRY RUN — no writes will be made.\n");

  for (const row of DESCRIPTIONS) {
    const wc = wordCount(row.description);
    console.log(`=== ${row.slug} (${row.id}) ===`);
    if (wc < 40 || wc > 60) {
      console.warn(`  WARNING: new description is ${wc} words (expected 40-60)`);
    }

    const { data: current, error: readErr } = await supabase
      .from("products")
      .select("description")
      .eq("id", row.id)
      .maybeSingle();

    if (readErr) {
      console.error(`  ERROR reading current row: ${readErr.message}`);
      continue;
    }
    if (!current) {
      console.error(`  ERROR: no row found with id ${row.id}`);
      continue;
    }

    console.log(`  BEFORE: ${current.description}`);
    console.log(`  AFTER:  ${row.description}`);

    if (current.description !== GENERIC_DESCRIPTION) {
      console.warn(
        `  SKIPPING WRITE: current description is not the expected generic placeholder — refusing to overwrite unexpected content.`,
      );
      continue;
    }

    if (APPLY) {
      const { error: writeErr } = await supabase
        .from("products")
        .update({ description: row.description })
        .eq("id", row.id);
      if (writeErr) {
        console.error(`  ERROR writing: ${writeErr.message}`);
      } else {
        console.log(`  WRITTEN.`);
      }
    }
    console.log("");
  }

  if (APPLY) {
    const { data: finalRows, error } = await supabase
      .from("products")
      .select("id, slug, description")
      .in(
        "id",
        DESCRIPTIONS.map((d) => d.id),
      );
    if (!error && finalRows) {
      const stillGeneric = finalRows.filter((r) => r.description === GENERIC_DESCRIPTION);
      console.log(`Final check: ${finalRows.length - stillGeneric.length}/${DESCRIPTIONS.length} rows updated.`);
      if (stillGeneric.length > 0) {
        console.log(`Still generic: ${stillGeneric.map((r) => r.slug).join(", ")}`);
      }
    }
  } else {
    console.log("Dry run complete — no rows were written. Re-run with --apply to perform the update.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
