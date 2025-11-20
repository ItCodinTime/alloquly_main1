import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("submissions")
      .select("id,assignment_id,student_id,content,status,created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) {
      console.error("Supabase submissions read error", error);
      return NextResponse.json({ error: "Unable to load submissions." }, { status: 500 });
    }

    return NextResponse.json({ submissions: data, source: "supabase" });
  } catch (error) {
    console.error("Submissions GET error", error);
    return NextResponse.json({ error: "Unable to load submissions." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = (await request.json()) as {
      assignment_id?: string;
      student_id?: string;
      content?: string;
      status?: string;
    };

    if (!body.assignment_id || !body.student_id || !body.content) {
      return NextResponse.json(
        { error: "Missing assignment_id, student_id, or content." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("submissions")
      .insert({
        assignment_id: body.assignment_id,
        student_id: body.student_id,
        content: body.content,
        status: body.status ?? "Submitted",
      })
      .select("id,assignment_id,student_id,content,status,created_at")
      .single();

    if (error || !data) {
      console.error("Supabase submissions insert error", error);
      return NextResponse.json(
        { error: "Unable to save submission right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({ submission: data, source: "supabase" }, { status: 201 });
  } catch (error) {
    console.error("Submissions POST error", error);
    return NextResponse.json({ error: "Unable to save submission right now." }, { status: 500 });
  }
}
