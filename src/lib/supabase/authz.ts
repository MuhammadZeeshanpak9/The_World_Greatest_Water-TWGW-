import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createClient } from "./server";
import { isAdminEmail } from "@/lib/validation";

/**
 * Returns the logged-in admin user, or null if there's no session OR the session belongs to
 * a non-admin (e.g. a regular customer account) — being authenticated is no longer sufficient
 * on its own now that public registration exists; the email must be in `ADMIN_EMAILS` too.
 */
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
