 "use client";

import { useMemo, useState } from "react";

type RemodelResult = {
  variant: string;
  summary: string;
  accommodations: string[];
  missions: string[];
  source: "mock" | "openai";
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

export default function AssignmentRemodeler() {
  const [assignment, setAssignment] = useState(sampleAssignment);
  const [profile, setProfile] = useState(neuroProfiles[0].value);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RemodelResult | null>(null);

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

  return (
    <section className="rounded-3xl border border-white/10 bg-black/50 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
        <span>Remodel assignment</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] tracking-[0.4em] text-zinc-400">
          Secure edge call
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4">
          <label className="text-sm text-zinc-400">
            Paste assignment or instructions
          </label>
          <textarea
            value={assignment}
            onChange={(event) => setAssignment(event.target.value)}
            maxLength={MAX_CHAR_COUNT}
            className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white outline-none transition focus:border-white/40 focus:bg-white/[0.06]"
            placeholder="Paste PDF text, doc excerpt, or prompt here."
          />
          <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
            <span>
              {assignment.length} / {MAX_CHAR_COUNT} chars
            </span>
            {attachmentName ? (
              <span className="rounded-full border border-white/10 px-3 py-1 text-white/70">
                Attached: {attachmentName}
              </span>
            ) : (
              <label className="cursor-pointer rounded-full border border-dashed border-white/15 px-3 py-1 text-white/80 transition hover:border-white/40">
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
          <label className="text-sm text-zinc-400">
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
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-white/[0.02] text-white/80 hover:border-white/40"
                  }`}
                  onClick={() => setProfile(option.value)}
                >
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p
                    className={`mt-2 text-xs ${
                      isActive ? "text-black/70" : "text-zinc-400"
                    }`}
                  >
                    {option.microcopy}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-dashed border-white/15 p-4 text-sm text-zinc-400">
            {profileCopy}
          </div>

          <button
            type="button"
            className="w-full rounded-full border border-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:border-white/30 disabled:text-white/50 disabled:opacity-60"
            onClick={remodelAssignment}
            disabled={isLoading || assignment.trim().length < 40}
          >
            {isLoading ? "Remodeling…" : "Generate neuroinclusive version"}
          </button>
          {error ? (
            <p className="text-xs text-red-300">{error}</p>
          ) : (
            <p className="text-xs text-zinc-500">
              Outputs stream through `/api/remodel` and never leave your Vercel
              project.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
          <span>AI suggestion</span>
          <span>{result ? result.source : "Mock preview"}</span>
        </div>

        <div className="mt-4 space-y-4 text-sm text-zinc-200">
          <p className="text-lg text-white">
            {result ? result.summary : "Select a profile and generate a rewrite to preview AI scaffolds."}
          </p>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
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
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-white" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
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
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-zinc-300"
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
