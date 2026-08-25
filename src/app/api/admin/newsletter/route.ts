import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const admin = createAdminClient();
  const { data, error, count } = await admin
    .from("newsletter_campaigns")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) {
    return NextResponse.json({ error: "Unable to load campaigns" }, { status: 500 });
  }

  return NextResponse.json({
    campaigns: data ?? [],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  });
}

export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid campaign data" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  if (typeof b.subject !== "string" || !b.subject.trim()) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  }
  if (typeof b.content !== "string" || !b.content.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("newsletter_campaigns")
    .insert({ subject: b.subject.trim(), content: b.content, status: "draft" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Unable to create campaign" }, { status: 500 });
  }

  await logAudit({ action: "create", table: "newsletter_campaigns", recordId: data.id, newData: data });

  return NextResponse.json({ campaign: data }, { status: 201 });
}
