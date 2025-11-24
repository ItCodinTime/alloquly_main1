import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Onboarding required." }, { status: 400 });
  }

  if (profile.role === "teacher") {
    const { data, error } = await supabase
      .from("classes")
      .select("id,name,section,description,created_at,class_students(count),assignments(count)")
      .eq("teacher_id", session.user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Classes read error", error);
      return NextResponse.json({ error: "Unable to load classes." }, { status: 500 });
    }
    return NextResponse.json({ classes: data ?? [] });
  }

  // Student view
  const { data: studentRecord } = await supabase.from("students").select("id").eq("user_id", session.user.id).maybeSingle();
  if (!studentRecord) {
    return NextResponse.json({ classes: [] });
  }

  const { data, error } = await supabase
    .from("class_students")
    .select("classes(id,name,section,description,teacher_id,assignments(count))")
    .eq("student_id", studentRecord.id);

  if (error) {
    console.error("Student classes read error", error);
    return NextResponse.json({ error: "Unable to load classes." }, { status: 500 });
  }

  const flattened = (data ?? [])
    .map((row) => (Array.isArray(row.classes) ? row.classes[0] : row.classes))
    .filter(Boolean);

  return NextResponse.json({ classes: flattened });
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
  if (profile?.role !== "teacher") {
    return NextResponse.json({ error: "Only teachers can create classes." }, { status: 403 });
  }

  const body = (await request.json()) as {
    name?: string;
    section?: string;
    description?: string;
  };

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name your class." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("classes")
    .insert({
      teacher_id: session.user.id,
      name: body.name.trim(),
      section: body.section?.trim() ?? null,
      description: body.description?.trim() ?? null,
    })
    .select("id,name,section,description,created_at")
    .single();

  if (error || !data) {
    console.error("Class create error", error);
    return NextResponse.json({ error: "Unable to create class." }, { status: 500 });
  }

  return NextResponse.json({ class: data }, { status: 201 });
}
