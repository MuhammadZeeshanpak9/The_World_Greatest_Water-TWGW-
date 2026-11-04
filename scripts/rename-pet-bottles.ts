/**
 * One-off update: renames the "PET Water Bottles" product category/name
 * to "PET Bottles" (client request — the shop category filter pill reads
 * "PET WATER BOTTLES", client wants "PET BOTTLES").
 *
 * Touches exactly one row (slug: pet-water-bottles) and exactly two
 * columns: `category` ("PET Water Bottles" -> "PET Bottles") and `name`
 * ("ELEV8 PET WATER BOTTLES" -> "ELEV8 PET BOTTLES", for consistency with
 * the new category label on the same product detail page). Does not
 * touch slug, price, status, description, image_url, or any other row.
 *
 * NOTE: WaveCollection.tsx's CATEGORY_MATCH map and its static "pet-bottles"
 * entry reference the OTHER "Water Bottles" category (the 2 elev8-water-*
 * SKUs), not this one — confirmed via a prior read-only pass, so this
 * script does not require any code changes alongside it.
 *
 * Usage:
 *   npx tsx scripts/rename-pet-bottles.ts            (dry run, default — no writes)
 *   npx tsx scripts/rename-pet-bottles.ts --apply     (performs the real update)
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const APPLY = process.argv.includes("--apply");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const SLUG = "pet-water-bottles";
const NEW_CATEGORY = "PET Bottles";
const NEW_NAME = "ELEV8 PET BOTTLES";

async function main() {
  console.log(APPLY ? "APPLY MODE — writing to the database.\n" : "DRY RUN — no writes will be made.\n");

  const { data: row, error } = await supabase
    .from("products")
    .select("id, slug, name, category")
    .eq("slug", SLUG)
    .maybeSingle();

  if (error || !row) {
    console.error("Failed to find row:", error?.message ?? "not found");
    process.exit(1);
  }

  console.log("BEFORE:");
  console.log(`  name:     ${row.name}`);
  console.log(`  category: ${row.category}`);
  console.log("\nAFTER (planned):");
  console.log(`  name:     ${NEW_NAME}`);
  console.log(`  category: ${NEW_CATEGORY}`);

  if (!APPLY) {
    console.log("\nDry run complete — no rows were written. Re-run with --apply to perform the update.");
    return;
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({ name: NEW_NAME, category: NEW_CATEGORY })
    .eq("id", row.id);

  if (updateError) {
    console.error("Update failed:", updateError.message);
    process.exit(1);
  }

  console.log("\nWRITTEN.");

  const { data: final } = await supabase
    .from("products")
    .select("slug, name, category")
    .eq("id", row.id)
    .maybeSingle();
  console.log("\nFinal row:", final);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
