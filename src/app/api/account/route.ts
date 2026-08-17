import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidPhone } from "@/lib/validation";
import { logAudit } from "@/lib/supabase/audit";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const email = user.email ?? "";

  const [{ data: profile }, { count: totalOrders }, { data: orderTotals }, { count: activeSubscriptions }] =
    await Promise.all([
      admin.from("user_profiles").select("*").eq("id", user.id).maybeSingle(),
      admin.from("orders").select("*", { count: "exact", head: true }).eq("customer_email", email),
      admin.from("orders").select("total").eq("customer_email", email),
      admin
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("customer_email", email)
        .eq("status", "active"),
    ]);

  const totalSpent = (orderTotals ?? []).reduce((sum, o) => sum + Number(o.total ?? 0), 0);

  return NextResponse.json({
    profile,
    stats: {
      totalOrders: totalOrders ?? 0,
      totalSpent,
      activeSubscriptions: activeSubscriptions ?? 0,
    },
  });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (typeof b.full_name === "string") {
    const fullName = b.full_name.trim();
    if (fullName.length > 100) {
      return NextResponse.json({ error: "Name must be 100 characters or fewer" }, { status: 400 });
    }
    updates.full_name = fullName;
  }

  if (typeof b.phone === "string" && b.phone.trim()) {
    const phone = b.phone.trim();
    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "Enter a valid phone number" }, { status: 400 });
    }
    updates.phone = phone;
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("user_profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Unable to update profile" }, { status: 500 });
  }

  await logAudit({ action: "update", table: "user_profiles", recordId: user.id });

  return NextResponse.json({ profile: data });
}
