-- Adds a `video_url` column to `blog_posts`, used by the /courses section
-- (courses are blog_posts rows with `topic` set) to show a YouTube
-- thumbnail on the course grid and an embedded player on the course
-- detail page's hero. Nullable — existing rows and any future blog post
-- with no video keep working exactly as before (grid falls back to the
-- existing gradient placeholder, detail page simply shows no hero video).
--
-- Same convention as 20261004000000_va_rag_schema.sql: handed to the
-- project owner to run manually via the Supabase dashboard SQL editor —
-- there is no Supabase CLI configured in this repo to apply it
-- automatically, and no other migration in this repo touches blog_posts
-- (that table's schema predates the migrations folder).

alter table blog_posts
  add column if not exists video_url text;
