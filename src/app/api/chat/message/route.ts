import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { respond, type ChatHistoryItem } from "@/lib/va/respond";

const MAX_MESSAGE_LENGTH = 500;
export const maxDuration = 30; // Vercel Hobby/Pro default function timeout — reduce tool-call rounds first if your plan caps lower.

/** Milestone 2: real RAG (retrieval + OpenAI) backend — see src/lib/va/respond.ts. Every user +
 * assistant message is persisted to chat_messages as before; RAG-specific debug metadata
 * (retrieved chunks, tool calls, fallback flag) is logged separately to va_message_meta. */
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

  const { data: session, error: sessionError } = await admin
    .from("chat_sessions")
    .select("session_id, language")
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

  const { data: historyRows } = await admin
    .from("chat_messages")
    .select("role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(13); // last ~6 turns (user+assistant pairs) plus the message just inserted above

  const history: ChatHistoryItem[] = (historyRows ?? [])
    .filter((r) => r.role === "user" || r.role === "assistant")
    .reverse()
    .slice(0, -1) // drop the just-inserted user message — respond() appends it separately
    .map((r) => ({ role: r.role as "user" | "assistant", content: r.content as string }));

  const result = await respond({
    message,
    language: session?.language || "en",
    history,
  });

  const { data: assistantRow, error: assistantInsertError } = await admin
    .from("chat_messages")
    .insert({ session_id: sessionId, role: "assistant", content: result.text })
    .select("id")
    .maybeSingle();
  if (assistantInsertError) {
    console.error("[chat/message] assistant message insert failed:", assistantInsertError.message);
    // The user's message is already saved — still return the response rather than erroring out
    // on a logging-adjacent failure the visitor can't do anything about.
  }

  // RAG debug metadata is logged best-effort, after the reply is already decided — a failure
  // here must never affect what the visitor sees.
  try {
    await admin.from("va_message_meta").insert({
      message_id: assistantRow?.id ?? null,
      session_id: sessionId,
      retrieved_chunk_ids: result.retrievedChunkIds,
      top_similarity: result.topSimilarity,
      fallback: result.fallback,
      tool_calls: result.toolCalls,
      model: result.model,
      prompt_tokens: result.promptTokens,
      completion_tokens: result.completionTokens,
      latency_ms: result.latencyMs,
    });
  } catch (e) {
    console.error("[chat/message] va_message_meta insert failed:", e instanceof Error ? e.message : e);
  }

  return NextResponse.json({ response: result.text, session_id: sessionId });
}
