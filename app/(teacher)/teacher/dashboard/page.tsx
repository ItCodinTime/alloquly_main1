import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { TeacherNavbar } from "@/components/dashboard/TeacherNavbar";
import { TeacherFooter } from "@/components/dashboard/TeacherFooter";
import PendingSubmissionList from "@/components/teacher/pending-submissions";
import PrivacyControls from "@/components/privacy-controls";

type TeacherClass = {
  id: string;
  name: string;
  section: string | null;
  description: string | null;
};

type TeacherAssignment = {
  id: string;
  title: string;
  due_date: string | null;
  class_id: string;
  class_name: string | null;
};

type PendingSubmission = {
  id: string;
  content: string;
  submitted_at: string;
  student_name: string | null;
  assignment_title: string | null;
  class_name: string | null;
};

export default async function TeacherDashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/auth/login");

  const [{ data: profile }, { data: classes }, { data: assignments }, { data: pendingSubmissions }] = await Promise.all([
    supabase.from("profiles").select("school_name, district, role").eq("id", session.user.id).maybeSingle(),
    supabase
      .from("classes")
      .select("id,name,section,description,created_at")
      .eq("teacher_id", session.user.id)
      .order("created_at", { ascending: true })
      .limit(6),
    supabase
      .from("assignments")
      .select("id,title,due_date,class_id,classes(name)")
      .eq("teacher_id", session.user.id)
      .order("due_date", { ascending: true })
      .limit(5),
    supabase
      .from("submissions")
      .select("id,content,submitted_at, assignment:assignments(id,title,classes(name)), student:students(name)")
      .eq("graded", false)
      .order("submitted_at", { ascending: true })
      .limit(5),
  ]);

  let membershipRows: Array<{ student_id: string }> = [];
  const classIds = (classes ?? []).map((cls) => cls.id);
  if (classIds.length) {
    const { data: roster } = await supabase.from("class_students").select("student_id").in("class_id", classIds);
    membershipRows = roster ?? [];
  }

  if (!profile) redirect("/onboarding");
  if (profile.role !== "teacher") redirect("/student/dashboard");

  const teacherName =
    (session.user.user_metadata?.full_name as string | undefined) ??
    session.user.email?.split("@")[0] ??
    "Teacher";

  const normalizedClasses: TeacherClass[] =
    classes?.map((cls) => ({
      id: cls.id,
      name: cls.name,
      section: cls.section,
      description: cls.description,
    })) ?? [];

  const normalizedAssignments: TeacherAssignment[] =
    assignments?.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      due_date: assignment.due_date,
      class_id: assignment.class_id,
      class_name: (assignment.classes as { name?: string } | null)?.name ?? null,
    })) ?? [];

  const normalizedSubmissions: PendingSubmission[] =
    pendingSubmissions?.map((submission) => ({
      id: submission.id,
      content: submission.content,
      submitted_at: submission.submitted_at,
      student_name: (submission.student as { name?: string } | null)?.name ?? null,
      assignment_title: (submission.assignment as { title?: string } | null)?.title ?? null,
      class_name: (submission.assignment as { classes?: { name?: string } | null } | null)?.classes?.name ?? null,
    })) ?? [];

  const uniqueStudents = new Set((membershipRows ?? []).map((row) => row.student_id)).size;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <TeacherNavbar teacherName={teacherName} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-200">Teacher dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Welcome back, {teacherName.split(" ")[0]}.</h1>
              <p className="mt-1 text-sm text-slate-300">
                {profile.school_name ?? "Your school"}
                {profile.district ? ` • ${profile.district}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/teacher/classes"
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white"
              >
                Manage classes
              </Link>
              <Link
                href="/assignments"
                className="rounded-full border border-indigo-400 bg-indigo-500/90 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500"
              >
                Build assignment
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="My classes" value={normalizedClasses.length} detail="Active cohorts" />
          <MetricCard label="Rostered students" value={uniqueStudents} detail="Across classes" />
          <MetricCard label="Assignments" value={normalizedAssignments.length} detail="Upcoming missions" />
          <MetricCard label="Pending submissions" value={normalizedSubmissions.length} detail="Ready for AI grading" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">My classes</p>
                <h2 className="text-xl font-semibold text-white">Top cohorts</h2>
              </div>
              <Link href="/teacher/classes" className="text-sm text-indigo-300 hover:text-white">
                View all →
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {normalizedClasses.length === 0 && (
                <p className="text-sm text-slate-300">Create your first class to start inviting students.</p>
              )}
              {normalizedClasses.map((cls) => (
                <div key={cls.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-inner shadow-black/20">
                  <p className="text-base font-semibold text-white">
                    {cls.name}
                    {cls.section ? ` • ${cls.section}` : ""}
                  </p>
                  <p className="text-xs text-slate-300">{cls.description ?? "No description added."}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Active assignments</p>
                <h2 className="text-xl font-semibold text-white">Next due dates</h2>
              </div>
              <Link href="/assignments" className="text-sm text-indigo-300 hover:text-white">
                New assignment →
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {normalizedAssignments.length === 0 && (
                <p className="text-sm text-slate-300">No assignments yet. Use the builder to publish your first one.</p>
              )}
              {normalizedAssignments.map((assignment) => (
                <article
                  key={assignment.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/30 p-4 text-sm text-slate-200"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{assignment.title}</p>
                    <span className="text-xs text-slate-400">
                      {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "No due date"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{assignment.class_name ?? "Class assignment"}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Pending submissions</p>
              <h2 className="text-xl font-semibold text-white">Grade with AI support</h2>
            </div>
            <p className="text-sm text-slate-300">AI keeps student names redacted and only logs IDs for FERPA compliance.</p>
          </div>
          <PendingSubmissionList submissions={normalizedSubmissions} />
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-sky-500/10 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-100">Quick AI tools</p>
              <h2 className="text-2xl font-semibold text-white">Remodel, grade, and monitor in seconds</h2>
              <p className="text-sm text-slate-100/80">
                Assignment builder, AI grader, and insights are all routed through secure Supabase edge functions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/assignments"
                className="rounded-2xl border border-white/40 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow"
              >
                AI Assignment Builder
              </Link>
              <Link
                href="/insights"
                className="rounded-2xl border border-white/30 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
              >
                Insights & Trends
              </Link>
            </div>
          </div>
        </section>

        <PrivacyControls role="teacher" />
      </main>
      <TeacherFooter />
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-white shadow-inner shadow-black/30">
      <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="text-xs text-slate-300">{detail}</p>
    </div>
  );
}
