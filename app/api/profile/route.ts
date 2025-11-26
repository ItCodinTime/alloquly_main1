import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type Role = "teacher" | "student";

type ProfilePayload = {
  role?: Role;
  schoolName?: string;
  district?: string;
  subjects?: string[];
  gradesTaught?: string[];
  gradeLevel?: string;
  preferredGradingScale?: string;
  accommodations?: {
    selections?: string[];
    notes?: string;
  };
};

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase env missing in profile GET", {
        supabaseUrl: Boolean(supabaseUrl),
        supabaseAnonKey: Boolean(supabaseAnonKey),
      });
      return NextResponse.json({ error: "Server missing Supabase credentials." }, { status: 500 });
    }

    const supabase = createRouteHandlerClient({ cookies }, { supabaseUrl, supabaseKey: supabaseAnonKey });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();

    if (error) {
      console.error("Profile read error:", error);
      return NextResponse.json({ error: "Unable to load profile." }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (err) {
    console.error("Profile GET unexpected error", err);
    return NextResponse.json({ error: "Unable to load profile." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase env missing in profile POST", {
        supabaseUrl: Boolean(supabaseUrl),
        supabaseAnonKey: Boolean(supabaseAnonKey),
      });
      return NextResponse.json({ error: "Server missing Supabase credentials." }, { status: 500 });
    }

    const supabase = createRouteHandlerClient({ cookies }, { supabaseUrl, supabaseKey: supabaseAnonKey });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    let body: ProfilePayload;
    try {
      body = (await request.json()) as ProfilePayload;
    } catch (err) {
      console.error("Profile POST JSON parse error", err);
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (!body.role || (body.role !== "teacher" && body.role !== "student")) {
      return NextResponse.json({ error: "Select teacher or student." }, { status: 400 });
    }

    if (!body.schoolName?.trim()) {
      return NextResponse.json({ error: "Enter your school name." }, { status: 400 });
    }

    if (body.role === "teacher" && !body.district?.trim()) {
      return NextResponse.json({ error: "District is required for teachers." }, { status: 400 });
    }

    if (body.role === "student" && !body.gradeLevel?.trim()) {
      return NextResponse.json({ error: "Grade level is required for students." }, { status: 400 });
    }

    if (body.role === "teacher" && (!body.subjects || body.subjects.length === 0)) {
      return NextResponse.json({ error: "Select at least one subject you teach." }, { status: 400 });
    }

    const insertPayload = {
      id: session.user.id,
      role: body.role,
      school_name: body.schoolName.trim(),
      district: body.role === "teacher" ? body.district?.trim() ?? null : null,
      subjects: body.role === "teacher" ? body.subjects ?? [] : [],
      grades_taught: body.role === "teacher" ? body.gradesTaught ?? [] : [],
      grade_level: body.role === "student" ? body.gradeLevel?.trim() ?? null : null,
      preferred_grading_scale: body.role === "teacher" ? body.preferredGradingScale ?? null : null,
      accommodations: {
        selections: body.accommodations?.selections ?? [],
        notes: body.accommodations?.notes ?? "",
      },
      is_onboarded: true,
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(insertPayload, { onConflict: "id" })
      .select("*")
      .single();

    if (error) {
      console.error("Profile upsert error:", error);
      return NextResponse.json({ error: "Unable to save profile." }, { status: 500 });
    }

    if (data.role === "student") {
      try {
        await ensureStudentRecord(supabase, session.user.id, session.user.email ?? "", data.school_name);
      } catch (err) {
        console.error("Student onboarding error", err);
        return NextResponse.json({ error: "Unable to finalize student onboarding." }, { status: 500 });
      }
    }

    return NextResponse.json({ profile: data });
  } catch (err) {
    console.error("Profile POST unexpected error", err);
    return NextResponse.json({ error: "Unable to save profile." }, { status: 500 });
  }
}

async function ensureStudentRecord(
  supabase: SupabaseClient,
  userId: string,
  email: string,
  displayName?: string | null,
) {
  const cleanEmail = email?.toLowerCase() ?? "";
  const preferredName = displayName ?? email?.split("@")?.[0] ?? "Student";
  const { data: student, error } = await supabase
    .from("students")
    .upsert(
      {
        user_id: userId,
        profile_id: userId,
        email: cleanEmail,
        name: preferredName,
      },
      { onConflict: "user_id" },
    )
    .select("id")
    .single();

  if (error) {
    console.error("Student record upsert error", error);
    throw new Error("Unable to finalize onboarding.");
  }

  if (student?.id && cleanEmail) {
    await claimInvitations(cleanEmail, student.id);
  }
}

async function claimInvitations(email: string, studentId: string) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    console.warn("Supabase service role not configured; skipping invite claim.");
    return;
  }

  const { data: invitations, error } = await admin
    .from("class_invitations")
    .select("id, class_id")
    .eq("status", "pending")
    .ilike("invite_email", email);

  if (error) {
    console.error("Invite lookup error", error);
    return;
  }

  if (!invitations?.length) return;

  const now = new Date().toISOString();

  for (const invite of invitations) {
    if (!invite.class_id) continue;
    await admin
      .from("class_students")
      .upsert({ class_id: invite.class_id, student_id: studentId }, { onConflict: "class_id,student_id" });
    await admin
      .from("class_invitations")
      .update({ status: "accepted", accepted_at: now })
      .eq("id", invite.id);
  }
}
