import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const url = new URL(request.url);
    const classId = url.searchParams.get("classId");

    const query = supabase
      .from("assignments")
      .select("id,title,description,instructions,due_date,class_id,created_at,classes(id,name,section)")
      .order("due_date", { ascending: true })
      .limit(50);

    if (classId) {
      query.eq("class_id", classId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase assignments read error", error);
      return NextResponse.json({ error: "Unable to load assignments." }, { status: 500 });
    }

    return NextResponse.json({ assignments: data ?? [] });
  } catch (error) {
    console.error("Assignments GET error", error);
    return NextResponse.json({ error: "Unable to load assignments." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = (await request.json()) as {
      classId?: string;
      title?: string;
      description?: string;
      instructions?: string;
      dueDate?: string;
      rubric?: unknown;
      accommodations?: unknown;
      differentiation?: unknown;
    };

    if (!body.classId || !body.title?.trim()) {
      return NextResponse.json({ error: "Class and title are required." }, { status: 400 });
    }

    const { data: classRow, error: classError } = await supabase
      .from("classes")
      .select("id")
      .eq("id", body.classId)
      .eq("teacher_id", session.user.id)
      .maybeSingle();

    if (classError || !classRow) {
      return NextResponse.json({ error: "Class not found." }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("assignments")
      .insert({
        class_id: body.classId,
        teacher_id: session.user.id,
        title: body.title.trim(),
        description: body.description?.trim() ?? null,
        instructions: body.instructions?.trim() ?? null,
        due_date: body.dueDate ?? null,
        rubric: body.rubric ?? [],
        accommodations: body.accommodations ?? {},
        differentiation: body.differentiation ?? {},
      })
      .select("id,title,description,instructions,due_date,class_id")
      .single();

    if (error || !data) {
      console.error("Supabase assignments insert error", error);
      return NextResponse.json({ error: "Unable to save assignment right now." }, { status: 500 });
    }

    return NextResponse.json({ assignment: data }, { status: 201 });
  } catch (error) {
    console.error("Assignments POST error", error);
    return NextResponse.json({ error: "Unable to save assignment right now." }, { status: 500 });
  }
}
