import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SAMPLE_STUDENTS = [
  { id: "demo-1", name: "Jordan Li", email: "jordan.li@classroom.edu", profile: "ADHD Focus", status: "On track" },
  { id: "demo-2", name: "Aria Patel", email: "aria.patel@classroom.edu", profile: "Autism Clarity", status: "Needs nudge" },
];

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ students: SAMPLE_STUDENTS, source: "fallback" });
    }

    const { data, error } = await supabase
      .from("students")
      .select("id,name,email,profile,status,created_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) {
      console.error("Supabase students read error", error);
      return NextResponse.json({ students: SAMPLE_STUDENTS, source: "fallback" });
    }

    return NextResponse.json({ students: data, source: "supabase" });
  } catch (error) {
    console.error("Students GET error", error);
    return NextResponse.json({ students: SAMPLE_STUDENTS, source: "fallback" });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const body = (await request.json()) as {
      name?: string;
      email?: string;
      profile?: string;
      status?: string;
    };

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Missing name or email." }, { status: 400 });
    }

    if (!session) {
      return NextResponse.json(
        {
          student: {
            id: "demo-fallback",
            name: body.name,
            email: body.email,
            profile: body.profile ?? "ADHD Focus",
            status: body.status ?? "Waiting on upload",
          },
          source: "fallback",
        },
        { status: 200 },
      );
    }

    const { data, error } = await supabase
      .from("students")
      .insert({
        user_id: session.user.id,
        name: body.name,
        email: body.email,
        profile: body.profile ?? null,
        status: body.status ?? null,
      })
      .select("id,name,email,profile,status,created_at")
      .single();

    if (error || !data) {
      console.error("Supabase students insert error", error);
      return NextResponse.json(
        { error: "Unable to add student right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({ student: data, source: "supabase" }, { status: 201 });
  } catch (error) {
    console.error("Students POST error", error);
    return NextResponse.json(
      { error: "Unable to add student right now." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const body = (await request.json()) as {
      id?: string;
      status?: string;
    };

    if (!body.id || !body.status) {
      return NextResponse.json({ error: "Missing id or status." }, { status: 400 });
    }

    if (!session) {
      return NextResponse.json(
        { student: { id: body.id, status: body.status }, source: "fallback" },
        { status: 200 },
      );
    }

    const { data, error } = await supabase
      .from("students")
      .update({ status: body.status })
      .eq("id", body.id)
      .eq("user_id", session.user.id)
      .select("id,name,email,profile,status,created_at")
      .single();

    if (error || !data) {
      console.error("Supabase students update error", error);
      return NextResponse.json(
        { error: "Unable to update student status right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({ student: data, source: "supabase" }, { status: 200 });
  } catch (error) {
    console.error("Students PATCH error", error);
    return NextResponse.json(
      { error: "Unable to update student status right now." },
      { status: 500 },
    );
  }
}
