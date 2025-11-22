"use client";

import { useMemo } from "react";

type Submission = {
  id: string;
  score: number | null;
  submitted_at: string;
};

export default function StudentProgressChart({ submissions }: { submissions: Submission[] }) {
  const points = useMemo(() => {
    return submissions
      .filter((submission) => submission.score != null)
      .map((submission) => ({
        id: submission.id,
        score: Number(submission.score),
        submittedAt: new Date(submission.submitted_at),
      }))
      .sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime());
  }, [submissions]);

  if (points.length === 0) {
    return <p className="text-sm text-slate-300">Submit assignments to see your progress chart.</p>;
  }

  const width = 360;
  const height = 160;
  const padding = 20;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const path = points
    .map((point, index) => {
      const x = points.length === 1 ? usableWidth / 2 : (index / (points.length - 1)) * usableWidth;
      const y = usableHeight - (point.score / 100) * usableHeight;
      return `${x + padding},${y + padding}`;
    })
    .join(" ");

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/20 p-4 text-white shadow-inner shadow-black/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Progress</p>
          <h3 className="text-lg font-semibold">Score trend</h3>
        </div>
        <p className="text-sm text-slate-200">Latest {points.length} graded submissions</p>
      </div>
      <svg className="mt-4 h-40 w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Progress chart">
        <polyline fill="none" stroke="rgb(199,210,254)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" points={path} />
        {points.map((point, index) => {
          const x = points.length === 1 ? usableWidth / 2 : (index / (points.length - 1)) * usableWidth;
          const y = usableHeight - (point.score / 100) * usableHeight;
          return (
            <circle key={point.id} cx={x + padding} cy={y + padding} r={4} fill="rgb(79,70,229)" stroke="white" strokeWidth={1} />
          );
        })}
      </svg>
      <div className="mt-3 grid gap-2 text-xs text-slate-200 sm:grid-cols-2">
        {points.slice(-4).map((point) => (
          <div key={`${point.id}-meta`} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
            <p className="font-semibold">{point.score}/100</p>
            <p>{point.submittedAt.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
