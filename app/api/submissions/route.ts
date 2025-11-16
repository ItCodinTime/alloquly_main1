import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const SAMPLE_SUBMISSIONS = [
  {
    id: "sub-1",
    assignment_id: "demo-1",
    student_id: "demo-1",
    content: "Recorded 90-word reflection with timer assist.",
    status: "Submitted",
    created_at: new Date().toISOString(),
  },
];

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ submissions: SAMPLE_SUBMISSIONS, source: "fallback" });
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("id,assignment_id,student_id,content,status,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    console.error("Supabase submissions read error", error);
    return NextResponse.json({ submissions: SAMPLE_SUBMISSIONS, source: "fallback" });
  }

  return NextResponse.json({ submissions: data, source: "supabase" });
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
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

  if (!supabase) {
    return NextResponse.json(
      {
        submission: {
          id: "sub-fallback",
          assignment_id: body.assignment_id,
          student_id: body.student_id,
          content: body.content,
          status: body.status ?? "Submitted",
          created_at: new Date().toISOString(),
        },
        source: "fallback",
      },
      { status: 200 },
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
}
