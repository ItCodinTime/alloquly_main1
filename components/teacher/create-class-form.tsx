"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateClassForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setMessage("Name your class.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, section, description }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to create class.");
      }
      setName("");
      setSection("");
      setDescription("");
      router.refresh();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleCreate}
      className="flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-sm text-white shadow-inner shadow-black/40 md:min-w-[280px]"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">New class</p>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Name (e.g., 8th ELA)"
        className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100/30"
      />
      <input
        value={section}
        onChange={(event) => setSection(event.target.value)}
        placeholder="Section"
        className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100/30"
      />
      <input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
        className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100/30"
      />
      {message && <p className="text-xs text-amber-200">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full border border-indigo-400 bg-indigo-500/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-indigo-500 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Create"}
      </button>
    </form>
  );
}
