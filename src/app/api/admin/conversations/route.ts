import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { toCsv } from "@/lib/csv";

const PAGE_SIZE = 20;
const CSV_COLUMNS = [
  "session_id",
  "user_id",
  "name",
  "email",
  "language",
  "page_url",
  "created_at",
  "updated_at",
];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function startOfWeek() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString();
}

export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { searchParams } = request.nextUrl;
  const filter = searchParams.get("filter")?.trim() ?? "";
  const isExport = searchParams.get("export") === "csv";

  const admin = createAdminClient();
  let query = admin.from("chat_sessions").select("*", { count: "exact" });

  if (filter === "with-lead") query = query.not("email", "is", null);
  else if (filter === "without-lead") query = query.is("email", null);
  else if (filter === "today") query = query.gte("created_at", startOfToday());
  else if (filter === "this-week") query = query.gte("created_at", startOfWeek());

  if (isExport) {
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) {
      console.error("[admin/conversations] export failed:", error.message);
      return NextResponse.json({ error: "Unable to export conversations" }, { status: 500 });
    }
    const csv = toCsv(data ?? [], CSV_COLUMNS);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=conversations.csv",
      },
    });
  }

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const { data: sessions, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) {
    console.error("[admin/conversations] list failed:", error.message);
    return NextResponse.json({ error: "Unable to load conversations" }, { status: 500 });
  }

  const sessionIds = (sessions ?? []).map((s) => s.session_id);
  const messageCounts: Record<string, number> = {};
  if (sessionIds.length > 0) {
    const { data: messageRows } = await admin
      .from("chat_messages")
      .select("session_id")
      .in("session_id", sessionIds);
    for (const row of messageRows ?? []) {
      messageCounts[row.session_id] = (messageCounts[row.session_id] ?? 0) + 1;
    }
  }

  const { data: unanswered } = await admin
    .from("chat_unanswered")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({
    sessions: (sessions ?? []).map((s) => ({
      ...s,
      message_count: messageCounts[s.session_id] ?? 0,
    })),
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
    unanswered: unanswered ?? [],
  });
}
