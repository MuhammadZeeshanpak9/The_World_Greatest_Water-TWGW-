import { NextResponse } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { getDashboardStats } from "@/lib/supabase/getDashboardStats";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}
