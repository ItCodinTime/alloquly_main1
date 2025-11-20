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
      .from("assignments")
      .select("id,title,profile,summary,content,created_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(25);

    if (error || !data) {
      console.error("Supabase assignments read error", error);
      return NextResponse.json({ error: "Unable to load assignments." }, { status: 500 });
    }

    return NextResponse.json({ assignments: data, source: "supabase" });
  } catch (error) {
    console.error("Assignments GET error", error);
    return NextResponse.json({ error: "Unable to load assignments." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const body = (await request.json()) as {
      title?: string;
      profile?: string;
      summary?: string;
      content?: string;
    };

    if (!body.title || !body.profile) {
      return NextResponse.json({ error: "Missing title or profile." }, { status: 400 });
    }

    if (!session) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("assignments")
      .insert({
        user_id: session.user.id,
        title: body.title,
        profile: body.profile,
        summary: body.summary ?? null,
        content: body.content ?? null,
      })
      .select("id,title,profile,summary,content,created_at")
      .single();

    if (error || !data) {
      console.error("Supabase assignments insert error", error);
      return NextResponse.json({ error: "Unable to save assignment right now." }, { status: 500 });
    }

    return NextResponse.json({ assignment: data, source: "supabase" }, { status: 201 });
  } catch (error) {
    console.error("Assignments POST error", error);
    return NextResponse.json({ error: "Unable to save assignment right now." }, { status: 500 });
  }
}
