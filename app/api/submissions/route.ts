import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("submissions")
      .select(
        "id, assignment_id, student_id, content, submitted_at, graded, score, feedback, strengths, next_steps, rubric, assignment:assignments(id,title,due_date,class_id, class:classes(id,name,section)), student:students(id,name,email)",
      )
      .order("submitted_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Supabase submissions read error", error);
      return NextResponse.json({ error: "Unable to load submissions." }, { status: 500 });
    }

    return NextResponse.json({ submissions: data ?? [] });
  } catch (error) {
    console.error("Submissions GET error", error);
    return NextResponse.json({ error: "Unable to load submissions." }, { status: 500 });
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
      assignmentId?: string;
      content?: string;
    };

    if (!body.assignmentId || !body.content?.trim()) {
      return NextResponse.json({ error: "Assignment and content are required." }, { status: 400 });
    }

    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (studentError || !student) {
      return NextResponse.json({ error: "Complete onboarding before submitting work." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("submissions")
      .insert({
        assignment_id: body.assignmentId,
        student_id: student.id,
        content: body.content.trim(),
      })
      .select("id, assignment_id, student_id, content, submitted_at, graded, score")
      .single();

    if (error || !data) {
      console.error("Supabase submissions insert error", error);
      return NextResponse.json({ error: "Unable to save submission right now." }, { status: 500 });
    }

    return NextResponse.json({ submission: data }, { status: 201 });
  } catch (error) {
    console.error("Submissions POST error", error);
    return NextResponse.json({ error: "Unable to save submission right now." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = (await request.json()) as {
      submissionId?: string;
      graded?: boolean;
      score?: number;
      feedback?: string;
      rubric?: unknown;
      strengths?: string[];
      nextSteps?: string[];
    };

    if (!body.submissionId) {
      return NextResponse.json({ error: "submissionId required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("submissions")
      .update({
        graded: body.graded ?? true,
        score: body.score ?? null,
        feedback: body.feedback ?? null,
        rubric: body.rubric ?? [],
        strengths: body.strengths ?? [],
        next_steps: body.nextSteps ?? [],
      })
      .eq("id", body.submissionId)
      .select("id, graded, score, feedback, rubric, strengths, next_steps")
      .single();

    if (error || !data) {
      console.error("Submissions update error", error);
      return NextResponse.json({ error: "Unable to update submission." }, { status: 500 });
    }

    return NextResponse.json({ submission: data });
  } catch (error) {
    console.error("Submissions PATCH error", error);
    return NextResponse.json({ error: "Unable to update submission." }, { status: 500 });
  }
}
