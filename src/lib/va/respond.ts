import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { getChatModel, isOpenAiConfigured } from "./env";
import { retrieveChunks } from "./retrieve";
import { buildSystemPrompt, ESCALATION_LINE } from "./prompt";
import { VA_TOOLS, runVaTool } from "./tools";

const MAX_HISTORY_TURNS = 6;
const MAX_TOOL_ROUNDS = 2;
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_TOKENS = 500;

export type ChatHistoryItem = { role: "user" | "assistant"; content: string };

export type VaResponse = {
  text: string;
  /** True whenever this reply did NOT come from a real model call (missing
   * key, timeout, or any OpenAI/Supabase error) — the caller logs this as
   * va_message_meta.fallback so an admin "unanswered questions" view can
   * find every case the bot couldn't actually answer. */
  fallback: boolean;
  retrievedChunkIds: string[];
  topSimilarity: number | null;
  toolCalls: { name: string; args: Record<string, unknown> }[];
  model: string | null;
  promptTokens: number | null;
  completionTokens: number | null;
  latencyMs: number;
};

function fallbackReply(): string {
  return `I'm having trouble reaching my knowledge base right now, so I don't want to guess — ${ESCALATION_LINE}, and we'll get you a real answer.`;
}

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: REQUEST_TIMEOUT_MS,
    });
  }
  return client;
}

/** Orchestrates one turn: retrieve → build prompt → call OpenAI (with tool
 * calling, up to MAX_TOOL_ROUNDS) → return the final text. Never throws —
 * every failure path (missing key, timeout, OpenAI error, Supabase error)
 * returns a VaResponse with fallback: true and a friendly reply instead,
 * so the calling API route can always return 200. */
export async function respond(params: {
  message: string;
  language: string;
  history: ChatHistoryItem[];
}): Promise<VaResponse> {
  const start = Date.now();

  if (!isOpenAiConfigured()) {
    return {
      text: fallbackReply(),
      fallback: true,
      retrievedChunkIds: [],
      topSimilarity: null,
      toolCalls: [],
      model: null,
      promptTokens: null,
      completionTokens: null,
      latencyMs: Date.now() - start,
    };
  }

  try {
    const chunks = await retrieveChunks(params.message);
    const topSimilarity = chunks.length ? Math.max(...chunks.map((c) => c.similarity)) : null;

    const systemPrompt = buildSystemPrompt({ language: params.language, retrievedChunks: chunks });
    const recentHistory = params.history.slice(-MAX_HISTORY_TURNS);

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...recentHistory.map((h) => ({ role: h.role, content: h.content }) as ChatCompletionMessageParam),
      { role: "user", content: params.message },
    ];

    const toolCallsLog: { name: string; args: Record<string, unknown> }[] = [];
    let model: string | null = null;
    let promptTokens = 0;
    let completionTokens = 0;
    let finalText: string | null = null;

    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const completion = await getClient().chat.completions.create({
        model: getChatModel(),
        messages,
        tools: round < MAX_TOOL_ROUNDS ? VA_TOOLS : undefined,
        max_tokens: MAX_TOKENS,
      });

      model = completion.model;
      promptTokens += completion.usage?.prompt_tokens ?? 0;
      completionTokens += completion.usage?.completion_tokens ?? 0;

      const choice = completion.choices[0];
      const toolCalls = choice.message.tool_calls;

      if (!toolCalls || toolCalls.length === 0) {
        finalText = choice.message.content ?? "";
        break;
      }

      messages.push(choice.message);
      for (const call of toolCalls) {
        if (call.type !== "function") continue;
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(call.function.arguments || "{}");
        } catch {
          // Leave args empty on malformed JSON — the tool itself handles missing fields.
        }
        toolCallsLog.push({ name: call.function.name, args });
        const result = await runVaTool(call.function.name, args);
        messages.push({ role: "tool", tool_call_id: call.id, content: result });
      }
    }

    if (finalText === null) {
      // Ran out of tool-call rounds without a final text reply — ask once more without tools.
      const completion = await getClient().chat.completions.create({
        model: getChatModel(),
        messages,
        max_tokens: MAX_TOKENS,
      });
      model = completion.model;
      promptTokens += completion.usage?.prompt_tokens ?? 0;
      completionTokens += completion.usage?.completion_tokens ?? 0;
      finalText = completion.choices[0].message.content ?? fallbackReply();
    }

    return {
      text: finalText || fallbackReply(),
      fallback: chunks.length === 0 && toolCallsLog.length === 0,
      retrievedChunkIds: chunks.map((c) => c.chunk_id),
      topSimilarity,
      toolCalls: toolCallsLog,
      model,
      promptTokens,
      completionTokens,
      latencyMs: Date.now() - start,
    };
  } catch (e) {
    console.error("[va/respond] failed:", e instanceof Error ? e.message : e);
    return {
      text: fallbackReply(),
      fallback: true,
      retrievedChunkIds: [],
      topSimilarity: null,
      toolCalls: [],
      model: null,
      promptTokens: null,
      completionTokens: null,
      latencyMs: Date.now() - start,
    };
  }
}
