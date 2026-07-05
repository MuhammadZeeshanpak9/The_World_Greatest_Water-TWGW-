/**
 * Extracts a YouTube video ID (and optional start-time offset in seconds)
 * from a bare 11-char ID, an /embed/ URL, or a /watch?v= URL with a &t= param.
 */
export function parseYouTubeUrl(input: string): { id: string; start?: number } | null {
  const trimmed = input.trim();

  if (/^[\w-]{11}$/.test(trimmed)) {
    return { id: trimmed };
  }

  try {
    const url = new URL(trimmed);

    const watchId = url.searchParams.get("v");
    if (watchId) {
      const t = url.searchParams.get("t") ?? url.searchParams.get("start");
      return { id: watchId, start: parseStart(t) };
    }

    const embedMatch = url.pathname.match(/\/(?:embed|shorts)\/([\w-]{11})/);
    if (embedMatch) {
      const t = url.searchParams.get("start") ?? url.searchParams.get("t");
      return { id: embedMatch[1], start: parseStart(t) };
    }
  } catch {
    return null;
  }

  return null;
}

function parseStart(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = parseInt(value.replace(/s$/, ""), 10);
  return Number.isFinite(seconds) ? seconds : undefined;
}
