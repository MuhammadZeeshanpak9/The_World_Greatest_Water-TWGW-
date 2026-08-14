import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const admin = createAdminClient();

  const { data: oldData } = await admin.from("waitlist").select("*").eq("id", id).single();
  const { error } = await admin.from("waitlist").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({ action: "delete", table: "waitlist", recordId: id, oldData });

  return NextResponse.json({ success: true });
}
