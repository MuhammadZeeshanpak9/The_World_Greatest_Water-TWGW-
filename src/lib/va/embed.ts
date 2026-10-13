import OpenAI from "openai";
import { getEmbeddingModel, isOpenAiConfigured } from "./env";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

/** Embeds a single string. Throws if OPENAI_API_KEY isn't configured — callers
 * (respond.ts, scripts/seed-kb.ts) must check isOpenAiConfigured() first and
 * handle the missing-key case themselves rather than relying on a caught
 * exception here. */
export async function embedText(text: string): Promise<number[]> {
  if (!isOpenAiConfigured()) {
    throw new Error("OPENAI_API_KEY is not configured — cannot embed text");
  }
  const res = await getClient().embeddings.create({
    model: getEmbeddingModel(),
    input: text,
  });
  return res.data[0].embedding;
}

/** Embeds multiple strings in one request — used by the seed script, which
 * embeds many chunks up front rather than one API call per chunk. */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (!isOpenAiConfigured()) {
    throw new Error("OPENAI_API_KEY is not configured — cannot embed text");
  }
  if (texts.length === 0) return [];
  const res = await getClient().embeddings.create({
    model: getEmbeddingModel(),
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}
