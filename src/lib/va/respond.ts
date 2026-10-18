import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { getChatModel, isOpenAiConfigured } from "./env";
import { retrieveChunks, type RetrievedChunk } from "./retrieve";
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

const WHATSAPP_DIGITS = "3059059006";
const SUPPORT_EMAIL = "winwin@theworldsgreatestwater.com";

/** Deterministic backstop for ChatWindow.tsx's EscalationPanel trigger,
 * which keys purely off the literal word "human" in the last assistant
 * reply (src/components/chat/ChatWindow.tsx:107). The model is asked to
 * always use ESCALATION_LINE verbatim, but if it ever paraphrases away
 * the word "human" while still mentioning WhatsApp or the support email,
 * this appends one sentence so the panel still triggers. */
function ensureHumanEscalation(text: string): string {
  if (/human/i.test(text)) return text;
  const mentionsContact =
    text.replace(/[^0-9]/g, "").includes(WHATSAPP_DIGITS) ||
    text.toLowerCase().includes(SUPPORT_EMAIL.toLowerCase());
  if (!mentionsContact) return text;
  return `${text} You can also reach a real human on our team via the Contact page.`;
}

// Client-mandated verbatim answer for "Who is the Grand Designer?" — the
// LLM paraphrases retrieved context by nature (it had already added
// stray Oxford commas on a real run), which isn't acceptable here: the
// client supplied this exact wording and wants it returned character-
// for-character, not "close." Matched by the kb_chunks content prefix
// seed-kb.ts's prefixed() always writes ("Category: X. Title: Y.\n..."),
// so this stays correct even if the row is ever re-seeded with a new id.
const GRAND_DESIGNER_CHUNK_PREFIX = "Category: ELEV8_GENERAL. Title: Who is the Grand Designer?.";
const GRAND_DESIGNER_VERBATIM_REPLY =
  "THE GRAND DESIGNER is the experiencer of this crazy beautiful experience called life, using the soul, mind and body to experience itself in all forms and perspectives in the illusion of time, energy and form. The I .AM of YOU, MYSELF, LIGHT, DARK, GOOD, BAD, NEGATIVE, POSITIVE, YING, YANG, GOD AND DEVIL playing hide and seek with myself until my last breath in the creativity of my imagination.";

/** Returns the verbatim Grand Designer answer when the top-ranked
 * retrieved chunk is that specific KB source, bypassing the LLM entirely
 * for this one question so the client's exact wording is guaranteed
 * every time — never paraphrased, never varying between runs. */
function grandDesignerVerbatimOverride(chunks: RetrievedChunk[]): string | null {
  if (chunks.length === 0) return null;
  const top = chunks.reduce((best, c) => (c.similarity > best.similarity ? c : best), chunks[0]);
  if (top.content.startsWith(GRAND_DESIGNER_CHUNK_PREFIX)) return GRAND_DESIGNER_VERBATIM_REPLY;
  return null;
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

    const grandDesignerOverride = grandDesignerVerbatimOverride(chunks);
    if (grandDesignerOverride) {
      return {
        text: grandDesignerOverride,
        fallback: false,
        retrievedChunkIds: chunks.map((c) => c.chunk_id),
        topSimilarity,
        toolCalls: [],
        model: null,
        promptTokens: null,
        completionTokens: null,
        latencyMs: Date.now() - start,
      };
    }

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
        temperature: 0.2,
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
        temperature: 0.2,
      });
      model = completion.model;
      promptTokens += completion.usage?.prompt_tokens ?? 0;
      completionTokens += completion.usage?.completion_tokens ?? 0;
      finalText = completion.choices[0].message.content ?? fallbackReply();
    }

    return {
      text: ensureHumanEscalation(finalText || fallbackReply()),
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
