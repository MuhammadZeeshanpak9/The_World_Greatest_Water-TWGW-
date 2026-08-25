import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

const ALLOWED_KEYS = [
  "announcement_text",
  "contact_email",
  "instagram_url",
  "youtube_url",
  "tiktok_url",
  "shippo_sender_name",
  "shippo_sender_street",
  "shippo_sender_city",
  "shippo_sender_state",
  "shippo_sender_zip",
  "shippo_sender_country",
];

export async function GET() {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const admin = createAdminClient();
  const { data, error } = await admin.from("site_settings").select("*");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings = Object.fromEntries((data ?? []).map((s) => [s.key, s.value]));
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid settings data" }, { status: 400 });
  }

  const entries = Object.entries(body as Record<string, unknown>).filter(
    (entry): entry is [string, string] =>
      ALLOWED_KEYS.includes(entry[0]) && typeof entry[1] === "string",
  );

  if (entries.length === 0) {
    return NextResponse.json({ error: "No valid settings provided" }, { status: 400 });
  }

  const admin = createAdminClient();
  const results = await Promise.all(
    entries.map(([key, value]) =>
      admin
        .from("site_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" }),
    ),
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 });

  await logAudit({
    action: "update",
    table: "site_settings",
    newData: Object.fromEntries(entries),
  });

  return NextResponse.json({ success: true });
}
