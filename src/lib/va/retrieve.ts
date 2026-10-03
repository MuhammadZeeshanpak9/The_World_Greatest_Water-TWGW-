import { createAdminClient } from "@/lib/supabase/admin";
import { embedText } from "./embed";
import { getMatchThreshold } from "./env";

export type RetrievedChunk = {
  chunk_id: string;
  source_id: string;
  content: string;
  metadata: Record<string, unknown>;
  source_title: string;
  source_category: string;
  similarity: number;
};

/** Embeds the query and calls match_kb_chunks() (approved-only, enforced by
 * the SQL function itself — see supabase/migrations/20261004000000_va_rag_schema.sql).
 * Returns an empty array (not a throw) on any embedding/RPC failure, since
 * retrieval failing should degrade to "no context found," not break the
 * whole response — respond.ts treats an empty result as fallback territory. */
export async function retrieveChunks(
  query: string,
  matchCount = 8,
): Promise<RetrievedChunk[]> {
  let embedding: number[];
  try {
    embedding = await embedText(query);
  } catch (e) {
    console.error("[va/retrieve] embedding failed:", e instanceof Error ? e.message : e);
    return [];
  }

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("match_kb_chunks", {
    query_embedding: embedding,
    match_threshold: getMatchThreshold(),
    match_count: matchCount,
  });

  if (error) {
    console.error("[va/retrieve] match_kb_chunks failed:", error.message);
    return [];
  }

  return (data ?? []) as RetrievedChunk[];
}
