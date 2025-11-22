import { redirect } from "next/navigation";
import InsightPanel from "@/components/insight-panel";
import { createServerClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Alloquy Insights | AI Coach + Compliance Radar",
  description: "Monitor focus, submission patterns, and accommodation fidelity with auditable AI insights.",
};

type SubmissionRow = {
  id: string;
  score: number | null;
  graded: boolean | null;
  submitted_at: string;
  assignment_id: string;
  assignment: { id: string; title: string; due_date: string | null } | null;
  student: { name: string | null } | null;
};

export default async function InsightsPage() {
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
  if (!profile) redirect("/onboarding");
  if (profile.role !== "teacher") redirect("/student/dashboard");

  const [{ data: assignments }, { data: submissions }, { data: rosterRows }] = await Promise.all([
    supabase
      .from("assignments")
      .select("id,title,due_date,class_id")
      .eq("teacher_id", session.user.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("submissions")
      .select("id,score,graded,submitted_at,assignment_id, assignment:assignments(id,title,due_date), student:students(name)")
      .order("submitted_at", { ascending: false })
      .limit(100),
    supabase.from("class_students").select("class_id, student_id"),
  ]);

  const classCounts = rosterRows?.reduce<Record<string, number>>((acc, row) => {
    acc[row.class_id] = (acc[row.class_id] ?? 0) + 1;
    return acc;
  }, {}) ?? {};

  const submissionsList: SubmissionRow[] = submissions ?? [];
  const totalSubmissions = submissionsList.length;
  const gradedSubmissions = submissionsList.filter((submission) => submission.graded).length;
  const pendingSubmissions = totalSubmissions - gradedSubmissions;
  const lateSubmissions = submissionsList.filter((submission) => {
    const due = submission.assignment?.due_date;
    if (!due) return false;
    return new Date(submission.submitted_at).getTime() > new Date(due).getTime();
  }).length;

  const assignmentAverages = (assignments ?? []).map((assignment) => {
    const relevant = submissionsList.filter((submission) => submission.assignment_id === assignment.id && submission.score != null);
    const average =
      relevant.reduce((sum, submission) => sum + Number(submission.score), 0) / (relevant.length || 1);
    const rosterSize = classCounts[assignment.class_id] ?? 0;
    const completionRate = rosterSize ? Math.round((relevant.length / rosterSize) * 100) : null;
    return {
      id: assignment.id,
      title: assignment.title,
      average: Number.isFinite(average) ? Math.round(average) : 0,
      completionRate,
    };
  });

  const studentAverages = submissionsList.reduce<Record<string, { name: string; scores: number[] }>>((acc, submission) => {
    if (submission.score == null) return acc;
    const name = submission.student?.name ?? "Student";
    if (!acc[name]) acc[name] = { name, scores: [] };
    acc[name].scores.push(Number(submission.score));
    return acc;
  }, {});

  const studentsNeedingSupport = Object.values(studentAverages)
    .map((entry) => ({
      name: entry.name,
      average: Math.round(entry.scores.reduce((sum, score) => sum + score, 0) / entry.scores.length),
    }))
    .filter((entry) => entry.average < 70)
    .sort((a, b) => a.average - b.average)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-50 pb-12 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-6 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Insights + compliance</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
            AI coach summarizes class health, submission trends, and FERPA safeguards.
          </h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Metric label="Total submissions" value={totalSubmissions} detail={`${gradedSubmissions} graded`} />
            <Metric
              label="Pending reviews"
              value={pendingSubmissions}
              detail={`${lateSubmissions} late deliveries`}
            />
            <Metric label="Average score" value={calcOverallAverage(submissionsList)} detail="Across graded work" />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Assignment performance</p>
              <h2 className="text-2xl font-semibold text-slate-900">Average score + completion</h2>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {assignmentAverages.length === 0 && (
              <p className="text-sm text-slate-500">Publish an assignment to unlock trend charts.</p>
            )}
            {assignmentAverages.map((assignment) => (
              <div key={assignment.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                  <span>{assignment.title}</span>
                  <span>{assignment.average}/100</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${Math.min(assignment.average, 100)}%` }}
                  />
                </div>
                {assignment.completionRate != null && (
                  <p className="mt-2 text-xs text-slate-500">{assignment.completionRate}% of roster submitted</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Students needing support</p>
              <h2 className="text-2xl font-semibold text-slate-900">Flagged by AI</h2>
            </div>
            <p className="text-xs text-slate-500">Based on average scores under 70%</p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {studentsNeedingSupport.length === 0 && (
              <p className="text-sm text-slate-500">
                No students flagged. Keep collecting submissions to monitor growth.
              </p>
            )}
            {studentsNeedingSupport.map((student) => (
              <div key={student.name} className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                <p className="text-xs text-slate-500">Average score {student.average}</p>
              </div>
            ))}
          </div>
        </section>

        <InsightPanel />
      </div>
    </main>
  );
}

function Metric({ label, value, detail }: { label: string; value: number | string; detail: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function calcOverallAverage(submissions: SubmissionRow[]) {
  const graded = submissions.filter((submission) => submission.score != null);
  if (!graded.length) return "—";
  const total = graded.reduce((sum, submission) => sum + Number(submission.score), 0);
  return Math.round(total / graded.length);
}
