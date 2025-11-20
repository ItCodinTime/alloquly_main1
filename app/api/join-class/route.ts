import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type JoinRequest = {
  code?: string;
  studentEmail?: string;
  studentName?: string;
};

// Student join with class code (service role)
export async function POST(request: Request) {
  try {
    const { code, studentEmail, studentName } = (await request.json()) as JoinRequest;

    if (!code || !studentEmail) {
      return NextResponse.json({ error: "Missing class code or student email." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Server missing Supabase credentials." }, { status: 500 });
    }

    const nowIso = new Date().toISOString();
    const { data: codeRow, error: codeError } = await supabase
      .from("classroom_codes")
      .select("code, class_id, expires_at, classes!inner(id, name, user_id)")
      .eq("code", code.trim().toUpperCase())
      .gt("expires_at", nowIso)
      .maybeSingle();

    if (codeError || !codeRow) {
      return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
    }

    const classRecord = Array.isArray(codeRow.classes) ? codeRow.classes[0] : codeRow.classes;
    const teacherId = classRecord?.user_id;
    if (!teacherId) {
      return NextResponse.json({ error: "Class not found for this code." }, { status: 400 });
    }

    // Upsert student for the teacher by email
    const { data: studentRow, error: studentError } = await supabase
      .from("students")
      .upsert(
        {
          user_id: teacherId,
          email: studentEmail.trim().toLowerCase(),
          name: studentName?.trim() || "Student",
          status: "Waiting on upload",
        },
        { onConflict: "user_id,email" },
      )
      .select("id, name, email")
      .single();

    if (studentError || !studentRow) {
      console.error("Student upsert error", studentError);
      return NextResponse.json({ error: "Unable to add student." }, { status: 500 });
    }

    // Link student to class
    const { error: linkError } = await supabase
      .from("class_students")
      .upsert({ class_id: codeRow.class_id, student_id: studentRow.id }, { onConflict: "class_id,student_id" });

    if (linkError) {
      console.error("Class-student link error", linkError);
      return NextResponse.json({ error: "Unable to link student to class." }, { status: 500 });
    }

    return NextResponse.json(
      {
        class_id: codeRow.class_id,
        class_code: codeRow.code,
        classroom: {
          classroomName: classRecord?.name ?? "Class",
          teacherId,
        },
        student: studentRow,
        expires_at: codeRow.expires_at,
        source: "supabase",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Join class error", error);
    return NextResponse.json({ error: "Unable to join class right now." }, { status: 500 });
  }
}

// Teacher generates a join code (uses authenticated session)
export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // Use first class or create a default one
  const { data: existingClass } = await supabase
    .from("classes")
    .select("id, name")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  let classId = existingClass?.id;
  let className = existingClass?.name ?? "Homeroom";

  if (!classId) {
    const { data: newClass, error: newClassError } = await supabase
      .from("classes")
      .insert({ user_id: session.user.id, name: className })
      .select("id, name")
      .single();
    if (newClassError || !newClass) {
      console.error("Create class error", newClassError);
      return NextResponse.json({ error: "Unable to create class." }, { status: 500 });
    }
    classId = newClass.id;
    className = newClass.name ?? className;
  }

  let code = "";
  let codeError: unknown = null;
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  for (let i = 0; i < 3; i++) {
    code = Math.random().toString(36).slice(2, 7).toUpperCase();
    const { error } = await supabase
      .from("classroom_codes")
      .insert({ class_id: classId, code, expires_at: expiresAt });
    if (!error) {
      codeError = null;
      break;
    }
    codeError = error;
  }

  if (codeError) {
    console.error("Create code error", codeError);
    return NextResponse.json({ error: "Unable to generate code." }, { status: 500 });
  }

  return NextResponse.json({
    code,
    class_id: classId,
    classroom: { classroomName: className, teacher: session.user.email },
    expires_in_minutes: 30,
    source: "supabase",
  });
}
