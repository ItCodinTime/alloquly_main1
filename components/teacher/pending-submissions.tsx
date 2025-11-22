"use client";

import { useState } from "react";

type PendingSubmission = {
  id: string;
  content: string;
  submitted_at: string;
  student_name: string | null;
  assignment_title: string | null;
  class_name: string | null;
};

type GradeResult = {
  score?: number;
  summary?: string;
  strengths?: string[];
  next_steps?: string[];
  error?: string;
};

export default function PendingSubmissionList({ submissions }: { submissions: PendingSubmission[] }) {
  const [items, setItems] = useState(submissions);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [gradeSummaries, setGradeSummaries] = useState<Record<string, GradeResult>>({});

  if (!items.length) {
    return <p className="mt-4 text-sm text-slate-300">No pending work. Great job staying current.</p>;
  }

  async function handleGrade(submission: PendingSubmission) {
    setLoadingId(submission.id);
    try {
      const response = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submission.id,
          submission: submission.content,
          assignment: submission.assignment_title ?? "",
        }),
      });
      const payload = (await response.json()) as GradeResult;
      if (!response.ok || payload.error) {
        throw new Error(payload.error ?? "Unable to grade right now.");
      }
      setGradeSummaries((prev) => ({ ...prev, [submission.id]: payload }));
      setItems((prev) => prev.filter((item) => item.id !== submission.id));
    } catch (error) {
      setGradeSummaries((prev) => ({
        ...prev,
        [submission.id]: { error: (error as Error).message },
      }));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="mt-4 space-y-4">
      {items.map((submission) => (
        <article
          key={submission.id}
          className="rounded-2xl border border-white/10 bg-slate-900/30 p-4 text-sm text-slate-200"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-white">{submission.assignment_title ?? "Submission"}</p>
              <p className="text-xs text-slate-400">
                {submission.student_name ?? "Student"} • {submission.class_name ?? "Class"} •{" "}
                {new Date(submission.submitted_at).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleGrade(submission)}
              disabled={loadingId === submission.id}
              className="rounded-full border border-indigo-400 px-4 py-1 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-500/30 disabled:opacity-60"
            >
              {loadingId === submission.id ? "Grading…" : "Grade with AI"}
            </button>
          </div>
          <p className="mt-3 max-h-24 overflow-hidden text-ellipsis text-xs text-slate-300">{submission.content}</p>
        </article>
      ))}

      {Object.entries(gradeSummaries).map(([id, result]) => (
        <div key={id} className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          {result.error ? (
            <p className="text-rose-200">{result.error}</p>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">AI grade saved</p>
              <p className="mt-1 text-base font-semibold text-white">{result.score ?? 0}/100</p>
              <p className="mt-1 text-slate-100">{result.summary}</p>
              {!!result.next_steps?.length && (
                <ul className="mt-2 list-disc pl-5 text-xs text-slate-100/90">
                  {result.next_steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
