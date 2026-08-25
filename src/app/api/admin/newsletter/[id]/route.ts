import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin.from("newsletter_campaigns").select("*").eq("id", id).single();

  if (error || !data) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  return NextResponse.json({ campaign: data });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const admin = createAdminClient();

  const { data: oldData } = await admin.from("newsletter_campaigns").select("*").eq("id", id).single();
  if (!oldData) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }
  if (oldData.status !== "draft") {
    return NextResponse.json({ error: "Only draft campaigns can be edited" }, { status: 409 });
  }

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

  const updates: Record<string, unknown> = {};
  if (typeof b.subject === "string" && b.subject.trim()) updates.subject = b.subject.trim();
  if (typeof b.content === "string" && b.content.trim()) updates.content = b.content;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await admin
    .from("newsletter_campaigns")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Unable to update campaign" }, { status: 500 });
  }

  await logAudit({ action: "update", table: "newsletter_campaigns", recordId: id, oldData, newData: data });

  return NextResponse.json({ campaign: data });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const admin = createAdminClient();

  const { data: oldData } = await admin.from("newsletter_campaigns").select("*").eq("id", id).single();
  if (!oldData) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }
  if (oldData.status !== "draft") {
    return NextResponse.json({ error: "Only draft campaigns can be deleted" }, { status: 409 });
  }

  const { error } = await admin.from("newsletter_campaigns").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Unable to delete campaign" }, { status: 500 });
  }

  await logAudit({ action: "delete", table: "newsletter_campaigns", recordId: id, oldData });

  return NextResponse.json({ success: true });
}
