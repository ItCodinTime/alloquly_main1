import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const url = new URL(request.url);
  const classId = url.searchParams.get("classId");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
  if (!profile) {
    return NextResponse.json({ error: "Profile missing." }, { status: 400 });
  }

  if (profile.role === "teacher") {
    const query = supabase
      .from("class_students")
      .select("class_id, classes(id,name,section), student:students(id,name,email,profile_id)")
      .eq("classes.teacher_id", session.user.id);

    if (classId) {
      query.eq("class_id", classId);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Teacher roster read error", error);
      return NextResponse.json({ error: "Unable to load roster." }, { status: 500 });
    }

    return NextResponse.json({ roster: data ?? [] });
  }

  const { data, error } = await supabase
    .from("students")
    .select("id,name,email,profile_id")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (error) {
    console.error("Student record read error", error);
    return NextResponse.json({ error: "Unable to load student record." }, { status: 500 });
  }

  return NextResponse.json({ student: data });
}
