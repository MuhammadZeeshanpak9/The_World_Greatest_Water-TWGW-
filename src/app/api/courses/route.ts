import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCourses } from "@/lib/courses";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const courses = await getCourses(user?.id ?? null);
  return NextResponse.json({ courses });
}
