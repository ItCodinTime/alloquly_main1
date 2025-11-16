"use client";

import { useEffect, useMemo, useState } from "react";

type Student = {
  id: string;
  name: string;
  email: string;
  profile: string;
  status: "On track" | "Needs nudge" | "Waiting on upload" | "Deep focus";
};

const createId = () =>
  typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

const defaultStudents: Student[] = [
  {
    id: createId(),
    name: "Jordan Li",
    email: "jordan.li@classroom.edu",
    profile: "ADHD Focus",
    status: "On track",
  },
  {
    id: createId(),
    name: "Aria Patel",
    email: "aria.patel@classroom.edu",
    profile: "Autism Clarity",
    status: "Needs nudge",
  },
  {
    id: createId(),
    name: "Mateo Rivera",
    email: "mateo.rivera@classroom.edu",
    profile: "Dyslexia Access",
    status: "Waiting on upload",
  },
];

const statusTheme: Record<Student["status"], string> = {
  "On track": "text-emerald-300",
  "Needs nudge": "text-yellow-300",
  "Waiting on upload": "text-orange-300",
  "Deep focus": "text-sky-300",
};

const profileOptions = [
  "ADHD Focus",
  "Autism Clarity",
  "Dyslexia Access",
  "Executive Function",
];

export default function ClassroomManager() {
  const [students, setStudents] = useState(defaultStudents);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState(profileOptions[0]);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inviteLink = useMemo(() => {
    const token = createId().slice(0, 6);
    return `https://classroom.alloquly.app/join?room=${token}`;
  }, [students.length]);

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await fetch("/api/students", { cache: "no-store" });
        const payload = (await response.json()) as { students?: Student[] };
        if (payload.students?.length) {
          setStudents(payload.students as Student[]);
        }
      } catch (error) {
        console.error("Unable to load students", error);
      }
    }
    loadStudents();
  }, []);

  function handleAddStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setFormError("Add a name.");
      return;
    }

    if (!/^[^@\s]+@gmail\.com$/i.test(email.trim())) {
      setFormError("Enter a Gmail address to enable sync.");
      return;
    }

    const newStudent: Student = {
      id: createId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      profile,
      status: "Waiting on upload",
    };

    setStudents((prev) => [...prev, newStudent]);
    setName("");
    setEmail("");
    setFormError(null);

    try {
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
    } catch (error) {
      console.error("Student save failed", error);
    }
  }

  async function toggleStatus(id: string) {
    let nextStatus: Student["status"] | null = null;

    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== id) return student;
        const order: Student["status"][] = [
          "Waiting on upload",
          "Needs nudge",
          "On track",
          "Deep focus",
        ];
        const next =
          order[(order.indexOf(student.status) + 1) % order.length] ?? "On track";
        nextStatus = next;
        return { ...student, status: next };
      }),
    );

    if (!nextStatus) return;

    setLoading(true);
    try {
      await fetch("/api/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
    } catch (error) {
      console.error("Student status update failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
        <span>Classroom roster</span>
        <span>Secure Gmail invite</span>
      </div>

      <form className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-2" onSubmit={handleAddStudent}>
        <div className="space-y-2">
          <label className="text-xs text-zinc-500">Student name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-white/50"
            placeholder="E.g., Priya Gomez"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-zinc-500">Gmail</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-white/50"
            placeholder="student@gmail.com"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-zinc-500">Support plan</label>
          <select
            value={profile}
            onChange={(event) => setProfile(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-white/50"
          >
            {profileOptions.map((option) => (
              <option key={option} value={option} className="bg-black text-white">
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col justify-end">
          <button
            type="submit"
            className="rounded-full border border-white px-4 py-2 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white"
          >
            Add student
          </button>
          {formError && <p className="mt-2 text-xs text-red-300">{formError}</p>}
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {students.map((student) => (
          <button
            key={student.id}
            type="button"
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left transition hover:border-white/40"
            onClick={() => toggleStatus(student.id)}
            disabled={loading}
          >
            <div>
              <p className="text-sm text-white">{student.name}</p>
              <p className="text-xs text-zinc-500">{student.email}</p>
            </div>
            <div className="text-right text-xs">
              <p className="text-zinc-400">{student.profile}</p>
              <p className={`${statusTheme[student.status]} font-semibold`}>
                {student.status}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-white/20 p-4 text-xs text-zinc-400">
        <p className="uppercase tracking-[0.3em] text-zinc-500">Share link</p>
        <p className="mt-2 break-all text-white/80">{inviteLink}</p>
        <p className="mt-2 text-[11px]">
          Link rotates when roster changes. Students verify via Gmail; no password
          reuse.
        </p>
      </div>
    </section>
  );
}
