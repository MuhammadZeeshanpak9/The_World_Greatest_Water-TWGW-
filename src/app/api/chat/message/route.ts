import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const MAX_MESSAGE_LENGTH = 500;

const MOCK_RESPONSE =
  "I AM your ELEV8 V.A. — your personal guide to THE WORLD'S GREATEST WATER ecosystem. How can I ELEV8 your experience today?";

/** Milestone 1: mock response only — no real AI/RAG call yet. Every user + assistant message is
 * still persisted to chat_messages so Milestone 2 can plug in a real model against real history. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`chat-message:${ip}`, {
    maxAttempts: 30,
    windowMs: 60 * 60 * 1000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const message = typeof b.message === "string" ? b.message.trim() : "";
  const sessionId = typeof b.session_id === "string" ? b.session_id.trim() : "";

  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters)` },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { error: sessionError } = await admin
    .from("chat_sessions")
    .select("session_id")
    .eq("session_id", sessionId)
    .maybeSingle();
  if (sessionError) {
    console.error("[chat/message] session lookup failed:", sessionError.message);
    return NextResponse.json({ error: "Unable to send message right now" }, { status: 500 });
  }

  const { error: userInsertError } = await admin
    .from("chat_messages")
    .insert({ session_id: sessionId, role: "user", content: message });
  if (userInsertError) {
    console.error("[chat/message] user message insert failed:", userInsertError.message);
    return NextResponse.json({ error: "Unable to send message right now" }, { status: 500 });
  }

  const { error: assistantInsertError } = await admin
    .from("chat_messages")
    .insert({ session_id: sessionId, role: "assistant", content: MOCK_RESPONSE });
  if (assistantInsertError) {
    console.error("[chat/message] assistant message insert failed:", assistantInsertError.message);
    // The user's message is already saved — still return the mock response rather than erroring
    // out on a logging-adjacent failure the visitor can't do anything about.
  }

  return NextResponse.json({ response: MOCK_RESPONSE, session_id: sessionId });
}
