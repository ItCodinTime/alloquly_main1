import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ classId: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { classId } = await context.params;
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { data: classRow } = await supabase
    .from("classes")
    .select("id")
    .eq("id", classId)
    .eq("teacher_id", session.user.id)
    .maybeSingle();

  if (!classRow) {
    return NextResponse.json({ error: "Class not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("classroom_codes")
    .select("code, expires_at")
    .eq("class_id", classId)
    .gt("expires_at", now)
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Code lookup error", error);
    return NextResponse.json({ error: "Unable to load code." }, { status: 500 });
  }

  if (!data) return NextResponse.json({ code: null, expires_at: null });
  return NextResponse.json(data);
}

export async function POST(_request: NextRequest, context: RouteContext) {
  const { classId } = await context.params;
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { data: classRow } = await supabase
    .from("classes")
    .select("id")
    .eq("id", classId)
    .eq("teacher_id", session.user.id)
    .maybeSingle();

  if (!classRow) {
    return NextResponse.json({ error: "Class not found." }, { status: 404 });
  }

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  let code: string | null = null;
  let attemptError: unknown = null;

  for (let i = 0; i < 4; i++) {
    const draft = generateCode();
    const { data, error } = await supabase
      .from("classroom_codes")
      .insert({ class_id: classId, code: draft, expires_at: expiresAt })
      .select("code, expires_at")
      .single();
    if (!error && data) {
      code = data.code;
      break;
    }
    attemptError = error;
  }

  if (!code) {
    console.error("Join code error", attemptError);
    return NextResponse.json({ error: "Unable to generate code." }, { status: 500 });
  }

  return NextResponse.json({ code, expires_at: expiresAt });
}

function generateCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
