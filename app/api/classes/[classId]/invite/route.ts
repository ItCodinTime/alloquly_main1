import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type RouteContext = {
  params: Promise<{ classId: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { classId } = await context.params;
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role, school_name").eq("id", session.user.id).maybeSingle();
  if (profile?.role !== "teacher") {
    return NextResponse.json({ error: "Only teachers can send invites." }, { status: 403 });
  }

  const { data: classRow, error: classError } = await supabase
    .from("classes")
    .select("id, name")
    .eq("id", classId)
    .eq("teacher_id", session.user.id)
    .maybeSingle();

  if (classError || !classRow) {
    return NextResponse.json({ error: "Class not found." }, { status: 404 });
  }

  const body = (await request.json()) as { email?: string };
  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Server missing Supabase credentials." }, { status: 500 });
  }

  const redirectBase =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  try {
    await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${redirectBase}/auth/callback`,
    });
  } catch (error) {
    console.error("Supabase invite error", error);
    return NextResponse.json({ error: "Unable to send invite email." }, { status: 500 });
  }

  const token = randomUUID();
  const { data, error } = await admin
    .from("class_invitations")
    .insert({
      class_id: classId,
      invite_email: email,
      token,
      status: "pending",
    })
    .select("id, invite_email, status, created_at")
    .single();

  if (error || !data) {
    console.error("Invite record error", error);
    return NextResponse.json({ error: "Unable to record invite." }, { status: 500 });
  }

  return NextResponse.json({
    invite: {
      id: data.id,
      email: data.invite_email,
      status: data.status,
      created_at: data.created_at,
      class: {
        id: classRow.id,
        name: classRow.name,
      },
    },
  });
}
