"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

export default function PrivacyControls({ role }: { role: "teacher" | "student" }) {
  const [status, setStatus] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleExport() {
    setExporting(true);
    setStatus(null);
    try {
      const response = await fetch("/api/profile/export");
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to export data.");
      }
      const file = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(file);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `alloquly-${role}-export-${Date.now()}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setStatus("Data export downloaded.");
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setExporting(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Deleting your profile removes all linked classes, assignments, and submissions. Continue?")) {
      return;
    }
    setDeleting(true);
    setStatus(null);
    try {
      const response = await fetch("/api/profile/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to delete profile.");
      }
      const supabase = createClient();
      await supabase.auth.signOut();
      setStatus("Account removed. Redirecting to login…");
      window.location.href = "/auth/login";
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-inner shadow-black/20">
      <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Privacy controls</p>
      <h3 className="mt-2 text-xl font-semibold">Manage your data</h3>
      <p className="mt-1 text-sm text-slate-200/80">
        Export a JSON copy of everything tied to your account or delete it permanently per FERPA guidelines.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
        >
          {exporting ? "Preparing…" : "Download export"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-full border border-rose-400 bg-rose-500/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete profile"}
        </button>
      </div>
      {status && <p className="mt-3 text-xs text-amber-100">{status}</p>}
    </div>
  );
}
