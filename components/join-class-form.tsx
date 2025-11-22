"use client";

import { useState } from "react";

type JoinResult = {
  class_id?: string;
  class_name?: string;
  section?: string;
  expires_at?: string;
  error?: string;
};

export default function JoinClassForm() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (!code.trim()) {
      setStatus("Enter the code your teacher shared.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/join-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      const payload = (await response.json()) as JoinResult;
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to join class.");
      }
      setCode("");
      const expiry = payload.expires_at ? new Date(payload.expires_at).toLocaleTimeString() : "";
      setStatus(
        `Joined ${payload.class_name ?? "your class"} ${payload.section ?? ""}. Code valid until ${expiry || "expiry"}.`,
      );
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">Join with code</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Have a class code?</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">Enter it here to unlock your workspace instantly.</p>
        </div>
      </div>

      <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleJoin}>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Code (e.g., X7J9Q8)"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-white/20 dark:bg-transparent dark:text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border border-indigo-600 bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-70"
        >
          {loading ? "Joining…" : "Join class"}
        </button>
      </form>

      {status && <p className="mt-3 text-sm text-slate-600 dark:text-slate-200">{status}</p>}
    </section>
  );
}
