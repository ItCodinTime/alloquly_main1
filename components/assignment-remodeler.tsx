 "use client";

import { useEffect, useMemo, useState } from "react";

type RemodelResult = {
  variant: string;
  summary: string;
  accommodations: string[];
  missions: string[];
  source: "mock" | "openai";
};

type AssignmentRemodelerProps = {
  classes: Array<{ id: string; name: string; section?: string | null }>;
};

const MAX_CHAR_COUNT = 1800;

const neuroProfiles = [
  {
    label: "ADHD Focus",
    value: "ADHD",
    microcopy: "Chunk steps, add timers, celebrate micro-wins.",
  },
  {
    label: "Autism Clarity",
    value: "Autism",
    microcopy: "Literal instruction, predictable sequencing, sensory notes.",
  },
  {
    label: "Dyslexia Access",
    value: "Dyslexia",
    microcopy: "Readable typography, multi-modal options, pacing cues.",
  },
  {
    label: "Custom Blend",
    value: "Custom",
    microcopy: "Mix accommodations per IEP or personal plan.",
  },
];

const sampleAssignment = `Write a two-paragraph reflection about how climate change impacts your city. Include one statistic and a personal story.`;

export default function AssignmentRemodeler({ classes }: AssignmentRemodelerProps) {
  const [assignment, setAssignment] = useState(sampleAssignment);
  const [profile, setProfile] = useState(neuroProfiles[0].value);
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id ?? "");
  const [dueDate, setDueDate] = useState("");
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RemodelResult | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedClass && classes.length > 0) {
      setSelectedClass(classes[0].id);
    }
  }, [classes, selectedClass]);

  const profileCopy = useMemo(
    () => neuroProfiles.find((p) => p.value === profile)?.microcopy ?? "",
    [profile],
  );

  async function remodelAssignment() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/remodel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignment,
          profile,
          attachmentName,
        }),
      });

      const payload = (await response.json()) as RemodelResult;
      setResult(payload);

      if (!response.ok) {
        const message =
          response.status === 429
            ? "Model is rate limited. Showing cached insights."
            : "AI service unreachable. Showing cached insights.";
        setError(message);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveAssignment() {
    if (!result) {
      setSaveNotice("Run the AI builder first.");
      return;
    }
    if (!selectedClass) {
      setSaveNotice("Select a class to attach this assignment to.");
      return;
    }
    setIsSaving(true);
    setSaveNotice(null);
    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClass,
          title: assignment.slice(0, 60) || "Untitled assignment",
          description: result.summary,
          instructions: result.missions.join("\n"),
          dueDate: dueDate || null,
          accommodations: { items: result.accommodations },
          differentiation: { profile },
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to save to Supabase.");
      }
      setSaveNotice(`Saved as ${payload.assignment?.title ?? "assignment"}`);
      setResult(null);
      setAssignment(sampleAssignment);
      setDueDate("");
    } catch (err) {
      setSaveNotice((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
        <span>Remodel assignment</span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] tracking-[0.4em] text-slate-600">
          Secure edge call
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(event) => setSelectedClass(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                {classes.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                    {option.section ? ` • ${option.section}` : ""}
                  </option>
                ))}
                {classes.length === 0 && <option value="">Create a class first</option>}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Due date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <label className="text-sm font-medium text-slate-700">
            Paste assignment or instructions
          </label>
          <textarea
            value={assignment}
            onChange={(event) => setAssignment(event.target.value)}
            maxLength={MAX_CHAR_COUNT}
            className="min-h-[180px] w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-inner focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="Paste PDF text, doc excerpt, or prompt here."
          />
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span>
              {assignment.length} / {MAX_CHAR_COUNT} chars
            </span>
            {attachmentName ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700">
                Attached: {attachmentName}
              </span>
            ) : (
              <label className="cursor-pointer rounded-full border border-dashed border-slate-300 bg-slate-50 px-3 py-1 text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700">
                Attach file
                <input
                  type="file"
                  className="hidden"
                  accept=".doc,.docx,.pdf,.txt"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setAttachmentName(file ? file.name : null);
                  }}
                />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700">
            Pick learner profile
          </label>
          <div className="grid grid-cols-2 gap-3">
            {neuroProfiles.map((option) => {
              const isActive = option.value === profile;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-indigo-200 bg-indigo-50 text-indigo-800 shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-800 hover:border-indigo-200"
                  }`}
                  onClick={() => setProfile(option.value)}
                >
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p
                    className={`mt-2 text-xs ${
                      isActive ? "text-indigo-700" : "text-slate-600"
                    }`}
                  >
                    {option.microcopy}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {profileCopy}
          </div>

          <button
            type="button"
            className="w-full rounded-full border border-indigo-600 bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:border-indigo-200 disabled:bg-indigo-200 disabled:text-white/70"
            onClick={remodelAssignment}
            disabled={isLoading || assignment.trim().length < 40}
          >
            {isLoading ? "Remodeling…" : "Generate neuroinclusive version"}
          </button>
          <button
            type="button"
            className="w-full rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:text-indigo-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            onClick={saveAssignment}
            disabled={!result || isSaving}
          >
            {isSaving ? "Saving…" : "Save to Supabase"}
          </button>
          {error ? (
            <p className="text-xs text-red-600">{error}</p>
          ) : (
            <p className="text-xs text-slate-500">
              Outputs stream through `/api/remodel` and never leave your Vercel
              project.
            </p>
          )}
          {saveNotice && <p className="text-xs text-emerald-700">{saveNotice}</p>}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
          <span>AI suggestion</span>
          <span>{result ? result.source : "Mock preview"}</span>
        </div>

        <div className="mt-4 space-y-4 text-sm text-slate-700">
          <p className="text-lg font-semibold text-slate-900">
            {result ? result.summary : "Select a profile and generate a rewrite to preview AI scaffolds."}
          </p>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
              Accommodations
            </p>
            <ul className="mt-2 space-y-2">
              {(result?.accommodations ??
                [
                  "Chunk into 3 missions with timers visible.",
                  "Replace idioms with literal phrasing.",
                  "Offer voice-note response alternative.",
                ]
              ).map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800"
                >
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
              Missions
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {(result?.missions ??
                [
                  "Mission 1: Listen to the 50s clip and capture two sensory details.",
                  "Mission 2: Highlight the statistic that stands out and explain why.",
                  "Mission 3: Record or type a 90-word reflection with timer assist.",
                ]
              ).map((mission) => (
                <div
                  key={mission}
                  className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700"
                >
                  {mission}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
