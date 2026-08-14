import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createClient } from "./server";

/** Returns the logged-in admin user, or null if the request has no valid session. */
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
