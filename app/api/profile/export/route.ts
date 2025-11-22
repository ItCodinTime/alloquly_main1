import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const userId = session.user.id;

  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  const payload: Record<string, unknown> = {
    generated_at: new Date().toISOString(),
    profile,
  };

  if (profile.role === "teacher") {
    const [{ data: classes }, { data: assignments }, { data: submissions }] = await Promise.all([
      supabase.from("classes").select("id,name,section,description,created_at").eq("teacher_id", userId),
      supabase
        .from("assignments")
        .select("id,title,description,due_date,class_id,created_at")
        .eq("teacher_id", userId)
        .order("created_at", { ascending: true }),
      supabase
        .from("submissions")
        .select("id,score,graded,submitted_at,assignment_id,student_id")
        .order("submitted_at", { ascending: false }),
    ]);

    payload.classes = classes ?? [];
    payload.assignments = assignments ?? [];
    payload.submissions = submissions ?? [];
  } else {
    const { data: studentRecord } = await supabase.from("students").select("id,name,email").eq("user_id", userId).maybeSingle();
    payload.student = studentRecord;

    if (studentRecord?.id) {
      const [{ data: classMemberships }, { data: submissions }] = await Promise.all([
        supabase
          .from("class_students")
          .select("class_id, classes(id,name,section)")
          .eq("student_id", studentRecord.id),
        supabase
          .from("submissions")
          .select("id,assignment_id,score,graded,submitted_at,feedback")
          .eq("student_id", studentRecord.id)
          .order("submitted_at", { ascending: false }),
      ]);

      payload.classes = (classMemberships ?? []).map((row) =>
        Array.isArray(row.classes) ? row.classes[0] : row.classes,
      );
      payload.submissions = submissions ?? [];
    } else {
      payload.classes = [];
      payload.submissions = [];
    }
  }

  return NextResponse.json(payload, {
    headers: {
      "Content-Disposition": `attachment; filename="alloquly-export-${Date.now()}.json"`,
    },
  });
}
