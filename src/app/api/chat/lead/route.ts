import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Captures a name/email from within the ELEV8 V.A. chat window — updates the chat_sessions row
 * and also feeds the shared waitlist table, same as every other lead-capture surface on the site. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`chat-lead:${ip}`);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const name = typeof b.name === "string" ? b.name.trim().slice(0, 200) : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const sessionId = typeof b.session_id === "string" ? b.session_id.trim() : "";

  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { error: updateError } = await admin
    .from("chat_sessions")
    .update({ name: name || null, email, updated_at: new Date().toISOString() })
    .eq("session_id", sessionId);
  if (updateError) {
    console.error("[chat/lead] session update failed:", updateError.message);
    return NextResponse.json({ error: "Unable to save your details right now" }, { status: 500 });
  }

  const { error: waitlistError } = await admin
    .from("waitlist")
    .insert({ email, source: "elev8-va" });
  // A unique-constraint hit just means they're already on the list — treat as success.
  if (waitlistError && waitlistError.code !== "23505") {
    console.error("[chat/lead] waitlist insert failed:", waitlistError.message);
  }

  return NextResponse.json({ success: true });
}
