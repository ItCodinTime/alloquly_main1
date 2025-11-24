import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type JoinRequest = {
  code?: string;
};

// Students join via code. Requires an authenticated session.
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = (await request.json()) as JoinRequest;
  const code = body.code?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Enter a class code." }, { status: 400 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
  if (profile?.role !== "student") {
    return NextResponse.json({ error: "Only students can join classes." }, { status: 403 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Server missing Supabase credentials." }, { status: 500 });
  }

  const nowIso = new Date().toISOString();
  const { data: codeRow, error: codeError } = await admin
    .from("classroom_codes")
    .select(
      "code, class_id, expires_at, classes!inner(id, name, section, teacher_id, teacher_profile:teacher_id(id, school_name))",
    )
    .eq("code", code)
    .gt("expires_at", nowIso)
    .maybeSingle();

  if (codeError || !codeRow) {
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  const classRecord = Array.isArray(codeRow.classes) ? codeRow.classes[0] : codeRow.classes;
  if (!classRecord) {
    return NextResponse.json({ error: "Class not found." }, { status: 404 });
  }

  const { data: studentRecord, error: studentError } = await supabase
    .from("students")
    .select("id, name")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (studentError || !studentRecord) {
    console.error("Student lookup error", studentError);
    return NextResponse.json({ error: "Complete onboarding before joining a class." }, { status: 400 });
  }

  const { error: membershipError } = await admin
    .from("class_students")
    .upsert({ class_id: classRecord.id, student_id: studentRecord.id }, { onConflict: "class_id,student_id" });

  if (membershipError) {
    console.error("Membership error", membershipError);
    return NextResponse.json({ error: "Unable to join this class right now." }, { status: 500 });
  }

  return NextResponse.json({
    class_id: classRecord.id,
    class_name: classRecord.name,
    section: classRecord.section,
    code: codeRow.code,
    expires_at: codeRow.expires_at,
  });
}
