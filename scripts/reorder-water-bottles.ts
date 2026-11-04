/**
 * One-off update: reorders the two "Water Bottles" category products on
 * the live /shop page so the smaller 16.9 FL OZ case displays before the
 * larger 1 LITER case (client request — small-before-big, matching every
 * other product category on the site).
 *
 * The shop page has no manual/explicit sort field — getProducts()
 * (src/lib/products.ts) orders strictly by `created_at DESC`. Both rows
 * currently share the exact same created_at timestamp (seeded together),
 * so their relative order is effectively arbitrary. This script bumps
 * elev8-water-16-9-fl-oz's created_at 1 second later than
 * elev8-water-1-liter's, which is enough for it to sort first under
 * DESC ordering — no schema change, no other column touched.
 *
 * Usage:
 *   npx tsx scripts/reorder-water-bottles.ts            (dry run, default — no writes)
 *   npx tsx scripts/reorder-water-bottles.ts --apply     (performs the real update)
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const APPLY = process.argv.includes("--apply");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const SMALLER_SLUG = "elev8-water-16-9-fl-oz"; // must sort FIRST (newer created_at)
const LARGER_SLUG = "elev8-water-1-liter"; // must sort SECOND (older created_at)

async function main() {
  console.log(APPLY ? "APPLY MODE — writing to the database.\n" : "DRY RUN — no writes will be made.\n");

  const { data: rows, error } = await supabase
    .from("products")
    .select("id, slug, name, created_at")
    .in("slug", [SMALLER_SLUG, LARGER_SLUG]);

  if (error || !rows || rows.length !== 2) {
    console.error("Failed to find both rows:", error?.message ?? `found ${rows?.length ?? 0} rows`);
    process.exit(1);
  }

  const smaller = rows.find((r) => r.slug === SMALLER_SLUG);
  const larger = rows.find((r) => r.slug === LARGER_SLUG);
  if (!smaller || !larger) {
    console.error("Could not match both expected slugs.");
    process.exit(1);
  }

  console.log(`BEFORE:`);
  console.log(`  ${smaller.slug}: created_at = ${smaller.created_at}`);
  console.log(`  ${larger.slug}:  created_at = ${larger.created_at}`);

  const newSmallerCreatedAt = new Date(new Date(larger.created_at).getTime() + 1000).toISOString();

  console.log(`\nAFTER (planned):`);
  console.log(`  ${smaller.slug}: created_at = ${newSmallerCreatedAt}  (sorts FIRST under DESC)`);
  console.log(`  ${larger.slug}:  created_at = ${larger.created_at}  (unchanged, sorts SECOND)`);

  if (!APPLY) {
    console.log("\nDry run complete — no rows were written. Re-run with --apply to perform the update.");
    return;
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({ created_at: newSmallerCreatedAt })
    .eq("id", smaller.id);

  if (updateError) {
    console.error("Update failed:", updateError.message);
    process.exit(1);
  }

  console.log(`\nWRITTEN: ${smaller.slug} created_at updated.`);

  const { data: finalRows } = await supabase
    .from("products")
    .select("slug, created_at")
    .in("slug", [SMALLER_SLUG, LARGER_SLUG])
    .order("created_at", { ascending: false });

  console.log("\nFinal order (as the shop page will render it):");
  finalRows?.forEach((r, i) => console.log(`  ${i + 1}. ${r.slug} (created_at: ${r.created_at})`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
