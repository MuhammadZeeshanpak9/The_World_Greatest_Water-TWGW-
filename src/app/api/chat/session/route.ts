import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrCreateChatSessionId } from "@/lib/chat/session";

/** Creates or restores an ELEV8 V.A. chat session, keyed by the `elev8_chat_session` cookie. */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const language = typeof b.language === "string" ? b.language.slice(0, 10) : "en";
  const pageUrl = typeof b.page_url === "string" ? b.page_url.slice(0, 500) : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Placeholder response purely to capture a new session cookie, if one gets created.
  const cookieCarrier = NextResponse.next();
  const sessionId = getOrCreateChatSessionId(request, cookieCarrier);

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("chat_sessions")
    .select("session_id")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (existing) {
    await admin
      .from("chat_sessions")
      .update({ language, page_url: pageUrl, updated_at: new Date().toISOString() })
      .eq("session_id", sessionId);
  } else {
    await admin.from("chat_sessions").insert({
      session_id: sessionId,
      user_id: user?.id ?? null,
      language,
      page_url: pageUrl,
    });
  }

  const response = NextResponse.json({ session_id: sessionId });
  cookieCarrier.cookies.getAll().forEach((c) => response.cookies.set(c));
  return response;
}
