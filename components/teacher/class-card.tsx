"use client";

import { useState } from "react";

type TeacherClassCardProps = {
  classData: {
    id: string;
    name: string;
    section: string | null;
    description: string | null;
    assignments_count: number;
  };
  roster: Array<{ student_name: string | null; student_email: string | null }>;
  invites: Array<{ id: string; invite_email: string; status: string; created_at: string }>;
};

export default function TeacherClassCard({ classData, roster, invites }: TeacherClassCardProps) {
  const [code, setCode] = useState<string | null>(null);
  const [codeMessage, setCodeMessage] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteNotice, setInviteNotice] = useState<string | null>(null);
  const [inviteList, setInviteList] = useState(invites);

  async function generateNewCode() {
    setCodeMessage("Generating…");
    try {
      const response = await fetch(`/api/classes/${classData.id}/code`, { method: "POST" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to generate code.");
      setCode(payload.code);
      setCodeMessage(`Expires at ${new Date(payload.expires_at).toLocaleTimeString()}`);
    } catch (error) {
      setCodeMessage((error as Error).message);
    }
  }

  async function fetchActiveCode() {
    setCodeMessage("Checking…");
    try {
      const response = await fetch(`/api/classes/${classData.id}/code`, { method: "GET" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to fetch code.");
      setCode(payload.code);
      setCodeMessage(
        payload.code ? `Active until ${payload.expires_at ? new Date(payload.expires_at).toLocaleTimeString() : "expiry"}` : "No active code",
      );
    } catch (error) {
      setCodeMessage((error as Error).message);
    }
  }

  async function sendInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inviteEmail.trim()) {
      setInviteNotice("Enter an email.");
      return;
    }
    setInviteNotice("Sending invite…");
    try {
      const response = await fetch(`/api/classes/${classData.id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to send invite.");
      setInviteEmail("");
      setInviteList((prev) => [
        {
          id: payload.invite.id,
          invite_email: payload.invite.email,
          status: payload.invite.status,
          created_at: payload.invite.created_at,
        },
        ...prev,
      ]);
      setInviteNotice("Invite sent via Supabase Auth.");
    } catch (error) {
      setInviteNotice((error as Error).message);
    }
  }

  const rosterPreview = roster.slice(0, 4);
  const remaining = Math.max(roster.length - rosterPreview.length, 0);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-black/30">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-white">
            {classData.name}
            {classData.section ? ` • ${classData.section}` : ""}
          </p>
          <p className="text-xs text-slate-300">{classData.description ?? "No description yet."}</p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">
          {classData.assignments_count} assignments
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Roster</p>
          {rosterPreview.length === 0 ? (
            <p className="mt-2 text-sm text-slate-300">No students yet. Share a code or invite by email.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-slate-100">
              {rosterPreview.map((student, index) => (
                <li key={`${student.student_email}-${index}`} className="flex justify-between text-xs text-slate-300">
                  <span>{student.student_name ?? student.student_email ?? "Student"}</span>
                  <span>{student.student_email}</span>
                </li>
              ))}
              {remaining > 0 && <li className="text-xs text-slate-400">+{remaining} more</li>}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Join codes</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fetchActiveCode}
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-white transition hover:bg-white/10"
            >
              Check active
            </button>
            <button
              type="button"
              onClick={generateNewCode}
              className="rounded-full border border-indigo-400 bg-indigo-500/70 px-4 py-1 text-xs font-semibold text-white transition hover:bg-indigo-500"
            >
              Generate new
            </button>
            {code && (
              <span className="rounded-full border border-white/20 px-3 py-1 text-sm font-mono tracking-[0.3em]">{code}</span>
            )}
          </div>
          {codeMessage && <p className="mt-2 text-xs text-slate-300">{codeMessage}</p>}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Email invites</p>
          <form className="mt-2 flex flex-col gap-2" onSubmit={sendInvite}>
            <input
              type="email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              placeholder="student@school.edu"
              className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100/30"
            />
            <button
              type="submit"
              className="rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/10"
            >
              Invite
            </button>
          </form>
          {inviteNotice && <p className="mt-1 text-xs text-slate-300">{inviteNotice}</p>}
          {inviteList.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs text-slate-400">
              {inviteList.slice(0, 3).map((invite) => (
                <li key={invite.id}>
                  {invite.invite_email} • {invite.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
