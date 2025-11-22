"use client";

import { useState } from "react";

type Assignment = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  class_name: string | null;
};

export default function StudentAssignmentList({ assignments }: { assignments: Assignment[] }) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, string | null>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (!assignments.length) {
    return <p className="mt-4 text-sm text-slate-300">Teachers haven&apos;t assigned anything new yet.</p>;
  }

  async function handleSubmit(assignment: Assignment) {
    const content = responses[assignment.id]?.trim();
    if (!content) {
      setMessages((prev) => ({ ...prev, [assignment.id]: "Write your response before submitting." }));
      return;
    }
    setLoadingId(assignment.id);
    setMessages((prev) => ({ ...prev, [assignment.id]: null }));
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId: assignment.id, content }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to submit right now.");
      }
      setMessages((prev) => ({ ...prev, [assignment.id]: "Submitted! We'll notify you when graded." }));
      setResponses((prev) => ({ ...prev, [assignment.id]: "" }));
    } catch (error) {
      setMessages((prev) => ({ ...prev, [assignment.id]: (error as Error).message }));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="mt-4 space-y-4">
      {assignments.map((assignment) => (
        <article key={assignment.id} className="rounded-2xl border border-white/10 bg-slate-900/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{assignment.title}</p>
              <p className="text-xs text-slate-400">{assignment.class_name ?? "Classroom"} • {formatDate(assignment.due_date)}</p>
            </div>
            <button
              type="button"
              onClick={() => handleSubmit(assignment)}
              disabled={loadingId === assignment.id}
              className="rounded-full border border-indigo-500 px-4 py-1 text-xs font-semibold text-white transition hover:bg-indigo-500/20 disabled:opacity-60"
            >
              {loadingId === assignment.id ? "Submitting…" : "Submit"}
            </button>
          </div>
          {assignment.description && <p className="mt-2 text-xs text-slate-200">{assignment.description}</p>}
          <textarea
            value={responses[assignment.id] ?? ""}
            onChange={(event) => setResponses((prev) => ({ ...prev, [assignment.id]: event.target.value }))}
            placeholder="Write your response..."
            className="mt-3 min-h-[80px] w-full rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100/30"
          />
          {messages[assignment.id] && <p className="mt-1 text-xs text-slate-300">{messages[assignment.id]}</p>}
        </article>
      ))}
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "No due date";
  return new Date(value).toLocaleDateString();
}
