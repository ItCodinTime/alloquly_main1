import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { TeacherNavbar } from "@/components/dashboard/TeacherNavbar";
import { TeacherFooter } from "@/components/dashboard/TeacherFooter";
import CreateClassForm from "@/components/teacher/create-class-form";
import TeacherClassCard from "@/components/teacher/class-card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ClassData = {
  id: string;
  name: string;
  section: string | null;
  description: string | null;
  assignments_count: number;
};

type RosterEntry = {
  class_id: string;
  student_name: string | null;
  student_email: string | null;
};

type InviteEntry = {
  id: string;
  class_id: string;
  invite_email: string;
  status: string;
  created_at: string;
};

export default async function TeacherClassesPage() {
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("role, school_name").eq("id", session.user.id).maybeSingle();
  if (!profile) redirect("/onboarding");
  if (profile.role !== "teacher") redirect("/student/dashboard");

  const { data: classes } = await supabase
    .from("classes")
    .select("id,name,section,description, assignments(count)")
    .eq("teacher_id", session.user.id)
    .order("created_at", { ascending: true });

  const classIds = (classes ?? []).map((cls) => cls.id);
  let roster: RosterEntry[] = [];
  let invites: InviteEntry[] = [];

  if (classIds.length) {
    const [{ data: rosterRows }, { data: inviteRows }] = await Promise.all([
      supabase
        .from("class_students")
        .select("class_id, student:students(name,email)")
        .in("class_id", classIds),
      supabase
        .from("class_invitations")
        .select("id,class_id,invite_email,status,created_at")
        .in("class_id", classIds)
        .order("created_at", { ascending: false }),
    ]);

    roster =
      rosterRows?.map((row) => ({
        class_id: row.class_id,
        student_name: (row.student as { name?: string } | null)?.name ?? null,
        student_email: (row.student as { email?: string } | null)?.email ?? null,
      })) ?? [];

    invites =
      inviteRows?.map((invite) => ({
        id: invite.id,
        class_id: invite.class_id,
        invite_email: invite.invite_email,
        status: invite.status,
        created_at: invite.created_at,
      })) ?? [];
  }

  const normalizedClasses: ClassData[] =
    classes?.map((cls) => ({
      id: cls.id,
      name: cls.name,
      section: cls.section,
      description: cls.description,
      assignments_count: Array.isArray(cls.assignments) ? cls.assignments[0]?.count ?? 0 : (cls.assignments as { count?: number } | null)?.count ?? 0,
    })) ?? [];

  const teacherName =
    (session.user.user_metadata?.full_name as string | undefined) ??
    session.user.email?.split("@")[0] ??
    "Teacher";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <TeacherNavbar teacherName={teacherName} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-200">Classes</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Manage your cohorts</h1>
            <p className="text-sm text-slate-300">
              Generate codes, invite via email, and monitor roster health for {profile.school_name ?? "your school"}.
            </p>
          </div>
          <CreateClassForm />
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          {normalizedClasses.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
              No classes yet. Create one to start generating join codes and AI assignments.
            </div>
          )}
          {normalizedClasses.map((cls) => (
            <TeacherClassCard
              key={cls.id}
              classData={cls}
              roster={roster.filter((entry) => entry.class_id === cls.id)}
              invites={invites.filter((invite) => invite.class_id === cls.id)}
            />
          ))}
        </section>
      </main>
      <TeacherFooter />
    </div>
  );
}
