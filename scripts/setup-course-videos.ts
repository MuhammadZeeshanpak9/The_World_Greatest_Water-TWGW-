/**
 * One-off setup for the 12 course video links. Requires the
 * `video_url` column to already exist on `blog_posts` — run
 * supabase/migrations/20261101000000_add_blog_posts_video_url.sql via
 * the Supabase dashboard SQL editor first (this script cannot run DDL
 * itself; it only checks the column is there and fails with a clear
 * message pointing at that migration file if not).
 *
 * Populates `video_url` for the 12 "How to ELEV8 X" course rows with
 * the client-supplied YouTube links, and staggers each row's
 * `created_at` by slug so the /courses grid (which sorts strictly by
 * `created_at DESC`, confirmed via a prior read-only investigation —
 * all 12 rows currently share the exact same seeded timestamp, so
 * their display order today is effectively arbitrary) renders in the
 * canonical order: ALL, YOU, LOVE, DESIRE, ENERGY, BELIEVE, VIBRATION,
 * MINDSET, GRATITUDE, FREQUENCY, THOUGHTS, CONSCIOUSNESS.
 *
 * Touches only these 12 rows (by slug) and only the `video_url` /
 * `created_at` columns. No other row, table, or column is touched.
 *
 * Usage:
 *   npx tsx scripts/setup-course-videos.ts            (dry run, default — no writes)
 *   npx tsx scripts/setup-course-videos.ts --apply     (performs the real update)
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const APPLY = process.argv.includes("--apply");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Canonical order (index 0 = newest created_at = sorts first under DESC).
const CANONICAL_ORDER: { slug: string; videoUrl: string }[] = [
  { slug: "how-to-elev8-all", videoUrl: "https://youtu.be/fCie00e2FbQ" },
  { slug: "how-to-elev8-you", videoUrl: "https://youtu.be/AKkX9jGONA8" },
  { slug: "how-to-elev8-love", videoUrl: "https://youtu.be/RMgct18hvwU" },
  { slug: "how-to-elev8-desire", videoUrl: "https://youtu.be/oBpNhWHomQI" },
  { slug: "how-to-elev8-energy", videoUrl: "https://youtu.be/sZpmF1KMLVk" },
  { slug: "how-to-elev8-believe", videoUrl: "https://youtu.be/WOPPLq5Lz4o" },
  { slug: "how-to-elev8-vibration", videoUrl: "https://youtu.be/KKfzlLlDHcU" },
  { slug: "how-to-elev8-mindset", videoUrl: "https://youtu.be/CMqKNjI5ags" },
  { slug: "how-to-elev8-gratitude", videoUrl: "https://youtu.be/Vao63Evldx8" },
  { slug: "how-to-elev8-frequency", videoUrl: "https://youtu.be/0NuCA2vSWb0" },
  { slug: "how-to-elev8-thoughts", videoUrl: "https://youtu.be/vRn1905Pa0s" },
  { slug: "how-to-elev8-consciousness", videoUrl: "https://youtu.be/k85bTTY1TcY" },
];

async function hasVideoUrlColumn() {
  // PostgREST has no generic "run arbitrary DDL" endpoint, so this script
  // can't add the column itself — it only probes whether the migration
  // (20261101000000_add_blog_posts_video_url.sql) has been run yet.
  const { error } = await supabase.from("blog_posts").select("video_url").limit(1);
  if (error && error.message.includes("video_url")) {
    return false;
  }
  return true;
}

async function main() {
  console.log(APPLY ? "APPLY MODE — writing to the database.\n" : "DRY RUN — no writes will be made.\n");

  const hasColumn = await hasVideoUrlColumn();
  if (!hasColumn) {
    console.error(
      "The `video_url` column does not exist on `blog_posts` yet.\n" +
        "Run supabase/migrations/20261101000000_add_blog_posts_video_url.sql via the " +
        "Supabase dashboard SQL editor first, then re-run this script.",
    );
    process.exit(1);
  }
  console.log("Confirmed: `video_url` column exists on `blog_posts`.\n");

  const { data: rows, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, video_url, created_at")
    .in(
      "slug",
      CANONICAL_ORDER.map((c) => c.slug),
    );

  if (error || !rows) {
    console.error("Failed to read rows:", error?.message);
    process.exit(1);
  }
  if (rows.length !== 12) {
    console.error(`Expected 12 rows, found ${rows.length}. Aborting without changes.`);
    console.error(
      "Missing slugs:",
      CANONICAL_ORDER.map((c) => c.slug).filter((s) => !rows.some((r) => r.slug === s)),
    );
    process.exit(1);
  }

  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const baseTime = Date.now();

  console.log("Planned changes (12 rows):\n");
  const updates: { id: string; slug: string; video_url: string; created_at: string }[] = [];
  CANONICAL_ORDER.forEach((entry, i) => {
    const row = bySlug.get(entry.slug)!;
    // Index 0 (ALL) gets the latest timestamp, index 11 (CONSCIOUSNESS)
    // the earliest, so ORDER BY created_at DESC yields the canonical order.
    const newCreatedAt = new Date(baseTime - i * 1000).toISOString();
    updates.push({ id: row.id, slug: row.slug, video_url: entry.videoUrl, created_at: newCreatedAt });
    console.log(`  ${entry.slug}`);
    console.log(`    video_url:  ${row.video_url ?? "(none)"} -> ${entry.videoUrl}`);
    console.log(`    created_at: ${row.created_at} -> ${newCreatedAt}`);
  });

  if (!APPLY) {
    console.log("\nDry run complete — no rows were written. Re-run with --apply to perform the update.");
    return;
  }

  for (const u of updates) {
    const { error: updateError } = await supabase
      .from("blog_posts")
      .update({ video_url: u.video_url, created_at: u.created_at })
      .eq("id", u.id);
    if (updateError) {
      console.error(`Update failed for ${u.slug}:`, updateError.message);
      process.exit(1);
    }
  }

  console.log("\nWRITTEN: all 12 rows updated.");

  const { data: finalRows } = await supabase
    .from("blog_posts")
    .select("slug, video_url, created_at")
    .in(
      "slug",
      CANONICAL_ORDER.map((c) => c.slug),
    )
    .order("created_at", { ascending: false });

  console.log("\nFinal grid order (as /courses will render it):");
  finalRows?.forEach((r, i) => console.log(`  ${i + 1}. ${r.slug} (video_url set: ${!!r.video_url})`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
