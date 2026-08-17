import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isStrongPassword } from "@/lib/validation";
import { logAudit } from "@/lib/supabase/audit";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const password = typeof b.password === "string" ? b.password : "";

  if (!isStrongPassword(password)) {
    return NextResponse.json(
      {
        error:
          "Password must be at least 8 characters and include an uppercase letter, a number, and a special character",
      },
      { status: 400 },
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return NextResponse.json({ error: "Unable to update password" }, { status: 500 });
  }

  await logAudit({ action: "update", table: "auth", recordId: user.id });

  return NextResponse.json({ success: true });
}
