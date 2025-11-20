 "use client";

import { useState } from "react";

type RubricItem = { label: string; score: number; of: number; note: string };
type GradeResult = {
  score: number;
  rubric: RubricItem[];
  summary: string;
  next_steps: string[];
  source?: string;
  error?: string;
};

const SAMPLE_SUBMISSION = "Student reflection about climate change in their city with one statistic and a personal story.";

export default function GradeAssistant() {
  const [submission, setSubmission] = useState(SAMPLE_SUBMISSION);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleGrade() {
    if (!submission.trim()) {
      setMessage("Paste student work to grade.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission }),
      });
      const payload = (await response.json()) as GradeResult;
      if (!response.ok || payload.error) {
        throw new Error(payload.error ?? "Unable to grade right now.");
      }
      setResult(payload);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">AI grading</p>
          <h3 className="text-lg font-semibold text-slate-900">Quick rubric + feedback</h3>
          <p className="text-sm text-slate-600">
            Paste a student response and generate a rubric-aligned score you can edit.
          </p>
        </div>
        <button
          type="button"
          onClick={handleGrade}
          disabled={loading}
          className="rounded-full border border-indigo-600 bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-70"
        >
          {loading ? "Grading…" : "Grade with AI"}
        </button>
      </div>

      <textarea
        value={submission}
        onChange={(event) => setSubmission(event.target.value)}
        className="mt-4 min-h-[140px] w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        placeholder="Paste student work here..."
      />

      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}

      {result && (
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Score</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{result.score}/100</p>
            <p className="text-xs text-slate-500">Source: {result.source ?? "AI"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Summary</p>
            <p className="mt-2 text-sm text-slate-700">{result.summary}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.3em] text-slate-500">Next steps</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {result.next_steps.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Rubric</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {result.rubric.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                  <span>{item.label}</span>
                  <span>
                    {item.score} / {item.of}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
