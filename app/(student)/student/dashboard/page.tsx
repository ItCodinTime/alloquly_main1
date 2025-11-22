import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { StudentNavbar } from "@/components/dashboard/StudentNavbar";
import { StudentFooter } from "@/components/dashboard/StudentFooter";
import JoinClassForm from "@/components/join-class-form";
import StudentAssignmentList from "@/components/student/assignment-list";
import StudentProgressChart from "@/components/student/progress-chart";
import PrivacyControls from "@/components/privacy-controls";

type ClassSummary = {
  id: string;
  name: string;
  section: string | null;
};

type AssignmentSummary = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  class_name: string | null;
};

type SubmissionSummary = {
  id: string;
  assignment_title: string | null;
  score: number | null;
  graded: boolean;
  feedback: string | null;
  submitted_at: string;
};

export default async function StudentDashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, school_name, grade_level, accommodations")
    .eq("id", session.user.id)
    .maybeSingle();

  if (!profile) redirect("/onboarding");
  if (profile.role !== "student") redirect("/teacher/dashboard");

  const { data: studentRecord } = await supabase
    .from("students")
    .select("id,name,email")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (!studentRecord) redirect("/onboarding");

  const [{ data: classRows }, { data: submissionRows }] = await Promise.all([
    supabase
      .from("class_students")
      .select("classes(id,name,section, assignments(id,title,description,due_date))")
      .eq("student_id", studentRecord.id),
    supabase
      .from("submissions")
      .select("id,score,graded,feedback,submitted_at, assignment:assignments(title)")
      .eq("student_id", studentRecord.id)
      .order("submitted_at", { ascending: false })
      .limit(10),
  ]);

  const classes: ClassSummary[] =
    classRows
      ?.map((row) => (Array.isArray(row.classes) ? row.classes[0] : row.classes))
      .filter(Boolean)
      .map((cls) => ({
        id: cls.id,
        name: cls.name,
        section: cls.section,
      })) ?? [];

  const assignments: AssignmentSummary[] = [];
  for (const row of classRows ?? []) {
    const cls = Array.isArray(row.classes) ? row.classes[0] : row.classes;
    if (!cls) continue;
    for (const assignment of cls.assignments ?? []) {
      assignments.push({
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        due_date: assignment.due_date,
        class_name: cls.name,
      });
    }
  }

  const upcomingAssignments = assignments
    .sort((a, b) => {
      const timeA = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER;
      const timeB = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER;
      return timeA - timeB;
    })
    .slice(0, 5);

  const submissions: SubmissionSummary[] =
    submissionRows?.map((submission) => ({
      id: submission.id,
      assignment_title: (submission.assignment as { title?: string } | null)?.title ?? null,
      score: submission.score,
      graded: submission.graded ?? false,
      feedback: submission.feedback,
      submitted_at: submission.submitted_at,
    })) ?? [];

  const averageScore =
    submissions.filter((submission) => submission.score != null).reduce((acc, submission) => acc + Number(submission.score), 0) /
    (submissions.filter((submission) => submission.score != null).length || 1);

  const safeAverage = Number.isFinite(averageScore) ? Math.round(averageScore) : 0;
  const accommodations = profile.accommodations as { selections?: string[]; notes?: string } | null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <StudentNavbar studentName={studentRecord.name ?? session.user.email ?? "Student"} />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-200">Student dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                Hey {studentRecord.name?.split(" ")[0] ?? "friend"} 👋
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                {profile.school_name ?? "Your school"} • {profile.grade_level ?? "Grade level coming soon"}
              </p>
            </div>
            <div className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 px-6 py-4 text-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Classes</p>
                <p className="text-2xl font-semibold">{classes.length}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Avg score</p>
                <p className="text-2xl font-semibold">{safeAverage || "—"}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="assignments" className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Upcoming assignments</p>
              <h2 className="text-xl font-semibold text-white">What&apos;s next</h2>
            </div>
            <span className="text-xs text-slate-300">{upcomingAssignments.length} available</span>
          </div>
          <StudentAssignmentList assignments={upcomingAssignments} />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Your classes</p>
                <h2 className="text-xl font-semibold text-white">Connected spaces</h2>
              </div>
              <Link href="#join" className="text-sm text-indigo-300 hover:text-white">
                Join another →
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {classes.length === 0 && <p className="text-sm text-slate-300">No classes yet. Ask your teacher for a code.</p>}
              {classes.map((cls) => (
                <div key={cls.id} className="rounded-2xl border border-white/10 bg-slate-900/30 p-4">
                  <p className="text-base font-semibold text-white">{cls.name}</p>
                  <p className="text-xs text-slate-400">{cls.section ?? "General section"}</p>
                </div>
              ))}
            </div>
          </div>
          <div id="join" className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <JoinClassForm />
          </div>
        </section>

        <section id="supports" className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Progress + feedback</p>
              <h2 className="text-xl font-semibold text-white">Recent grades</h2>
            </div>
            <p className="text-xs text-slate-300">Scores stay private between you and your teachers.</p>
          </div>
          <div className="mt-4 space-y-3">
            {submissions.length === 0 && (
              <p className="text-sm text-slate-300">Submit work to unlock personalized feedback and charts.</p>
            )}
            {submissions.map((submission) => (
              <article key={submission.id} className="rounded-2xl border border-white/10 bg-slate-900/30 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{submission.assignment_title ?? "Assignment"}</p>
                  <span className="text-xs text-slate-400">{new Date(submission.submitted_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-400">
                  {submission.graded ? `Score • ${submission.score ?? "Pending"}` : "Waiting for grading"}
                </p>
                {submission.feedback && <p className="mt-2 text-sm text-slate-200">{submission.feedback}</p>}
              </article>
            ))}
          </div>
        </section>

        {accommodations?.selections?.length ? (
          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-sky-500/10 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-100">Supports saved</p>
            <h2 className="text-xl font-semibold text-white">Your accommodations</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-100">
              {accommodations.selections.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {accommodations.notes && <p className="mt-3 text-sm text-slate-100/80">{accommodations.notes}</p>}
          </section>
        ) : null}

        <section className="grid gap-6 md:grid-cols-2">
          <StudentProgressChart submissions={submissions} />
          <PrivacyControls role="student" />
        </section>
      </main>
      <StudentFooter />
    </div>
  );
}
