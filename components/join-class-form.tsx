 "use client";

import { useState } from "react";

type JoinResult = {
  class_id?: string;
  class_code?: string;
  classroom?: {
    classroomName?: string;
    teacher?: string;
  };
  source?: string;
  error?: string;
};

export default function JoinClassForm() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!code.trim() || !email.trim()) {
      setMessage("Enter the class code and your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/join-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          studentEmail: email.trim().toLowerCase(),
          studentName: name.trim() || undefined,
        }),
      });
      const payload = (await response.json()) as JoinResult;
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to join class.");
      }
      setMessage(
        `Joined ${payload.classroom?.classroomName ?? "classroom"} with ${payload.classroom?.teacher ?? "your teacher"}.`
      );
      setCode("");
      setEmail("");
      setName("");
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
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Join with code</p>
          <h3 className="text-lg font-semibold text-slate-900">Have a code from your teacher?</h3>
          <p className="text-sm text-slate-600">Enter it to unlock your assignments instantly.</p>
        </div>
      </div>

      <form className="mt-4 grid gap-3 sm:grid-cols-3" onSubmit={handleJoin}>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Code (e.g., X7J9Q)"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@student.edu"
          type="email"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Preferred name (optional)"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl border border-indigo-600 bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-70"
          >
            {loading ? "Joining…" : "Join"}
          </button>
        </div>
      </form>

      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
    </section>
  );
}
