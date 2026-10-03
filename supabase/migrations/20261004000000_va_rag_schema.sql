-- ELEV8 V.A. RAG backend schema (Milestone 2).
--
-- This is the first committed SQL migration in this repo — prior schema
-- work (the M1-M10 milestones referenced in .env.example and git history)
-- was applied directly to the live Supabase project without a tracked
-- migrations folder. This file is handed to the project owner to run
-- manually via the Supabase dashboard SQL editor; there is no Supabase
-- CLI configured in this repo to apply it automatically.
--
-- RLS convention (matches src/lib/supabase/admin.ts and
-- src/app/api/public/form-submissions/route.ts): every table below has
-- RLS enabled but NO policies are created. That means only the
-- service-role client (createAdminClient()) can read/write these tables
-- — anon and authenticated roles get nothing, by omission rather than by
-- a permissive-looking policy. This is deliberate: knowledge-base content
-- and chat logs should never be queryable from the browser, even
-- read-only, since kb_chunks/kb_sources can contain pricing and internal
-- notes, and va_message_meta can contain retrieval/debug internals.

create extension if not exists vector;

-- ---------------------------------------------------------------------
-- kb_sources / kb_chunks — the RAG knowledge base
-- ---------------------------------------------------------------------

create table if not exists kb_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  status text not null default 'draft' check (status in ('draft', 'approved', 'archived')),
  origin text,
  external_id text,
  sub_brand text not null default 'elev8-water',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Idempotent-seed support: a seed script upserts by external_id and
  -- compares content_hash to decide whether to skip or replace a
  -- source's chunks, so re-running the seed never creates duplicates.
  content_hash text,
  unique (external_id)
);

create table if not exists kb_chunks (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references kb_sources(id) on delete cascade,
  chunk_index int not null default 0,
  content text not null,
  embedding vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists kb_chunks_source_id_idx on kb_chunks(source_id);
-- IVFFlat index for cosine-distance ANN search. Must be created AFTER
-- rows exist for best clustering, but is safe to create empty too; the
-- seed script re-indexes are not required for correctness, only for
-- best performance at scale.
create index if not exists kb_chunks_embedding_idx
  on kb_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

alter table kb_sources enable row level security;
alter table kb_chunks enable row level security;

-- ---------------------------------------------------------------------
-- match_kb_chunks — approved-only similarity search
-- ---------------------------------------------------------------------

create or replace function match_kb_chunks(
  query_embedding vector(1536),
  match_threshold float default 0.3,
  match_count int default 8
)
returns table (
  chunk_id uuid,
  source_id uuid,
  content text,
  metadata jsonb,
  source_title text,
  source_category text,
  similarity float
)
language sql
stable
as $$
  select
    kc.id as chunk_id,
    kc.source_id,
    kc.content,
    kc.metadata,
    ks.title as source_title,
    ks.category as source_category,
    1 - (kc.embedding <=> query_embedding) as similarity
  from kb_chunks kc
  join kb_sources ks on ks.id = kc.source_id
  where ks.status = 'approved'
    and kc.embedding is not null
    and 1 - (kc.embedding <=> query_embedding) > match_threshold
  order by kc.embedding <=> query_embedding
  limit match_count;
$$;

-- ---------------------------------------------------------------------
-- va_message_meta — per-message RAG/debug metadata, keyed to the
-- existing chat_messages table (not a parallel conversation log; the
-- live chat_sessions/chat_messages tables already record every turn).
--
-- message_id is intentionally NOT a foreign key: this repo has no
-- committed schema for chat_messages (it predates this migrations
-- folder and its exact primary-key column/type was never verified
-- against the live database), so a hard FK here risks failing to apply
-- on a mismatch. It's a plain uuid the app populates from the chat
-- message insert's returned id. Add a real FK constraint later once the
-- chat_messages schema is confirmed, if desired.
-- ---------------------------------------------------------------------

create table if not exists va_message_meta (
  id uuid primary key default gen_random_uuid(),
  message_id uuid,
  session_id text,
  retrieved_chunk_ids uuid[] not null default '{}',
  top_similarity float,
  fallback boolean not null default false,
  tool_calls jsonb not null default '[]'::jsonb,
  model text,
  prompt_tokens int,
  completion_tokens int,
  latency_ms int,
  created_at timestamptz not null default now()
);

-- Supports a future "unanswered questions" admin view: every reply where
-- no chunk cleared the threshold and no tool was called gets fallback =
-- true, so this index lets that view page through them newest-first.
create index if not exists va_message_meta_fallback_idx
  on va_message_meta(fallback, created_at desc);

alter table va_message_meta enable row level security;
