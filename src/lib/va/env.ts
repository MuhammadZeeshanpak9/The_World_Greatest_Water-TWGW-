/** True once a real OpenAI key is configured. Every VA code path must check
 * this before calling OpenAI — never let a missing key surface as a 500 to
 * a site visitor (see respond.ts's fallback-reply behavior). */
export function isOpenAiConfigured(): boolean {
  const key = process.env.OPENAI_API_KEY;
  return !!key && key !== "your-openai-api-key";
}

export function getEmbeddingModel(): string {
  return process.env.VA_EMBEDDING_MODEL || "text-embedding-3-small";
}

export function getChatModel(): string {
  return process.env.VA_CHAT_MODEL || "gpt-4o-mini";
}

export function getMatchThreshold(): number {
  const raw = process.env.VA_MATCH_THRESHOLD;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) ? parsed : 0.3;
}
