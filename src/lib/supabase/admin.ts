import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — bypasses Row Level Security entirely.
 *
 * NEVER import this file from a client component ("use client") or expose its
 * output to the browser. Server-only (Route Handlers, Server Components,
 * Server Actions) after `assertAdmin()` has already confirmed a real admin
 * session — this client itself does no auth checking of its own.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
