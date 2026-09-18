import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";

type Params = { params: Promise<{ sessionId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { sessionId } = await params;
  const admin = createAdminClient();

  const { data: session, error: sessionError } = await admin
    .from("chat_sessions")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle();
  if (sessionError) {
    console.error("[admin/conversations/:id] session lookup failed:", sessionError.message);
    return NextResponse.json({ error: "Unable to load conversation" }, { status: 500 });
  }
  if (!session) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const { data: messages, error: messagesError } = await admin
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
  if (messagesError) {
    console.error("[admin/conversations/:id] messages lookup failed:", messagesError.message);
    return NextResponse.json({ error: "Unable to load conversation" }, { status: 500 });
  }

  return NextResponse.json({ session, messages: messages ?? [] });
}
