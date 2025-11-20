"use client";

import { useMemo, useState } from "react";

type Insight = {
  label: string;
  value: string;
  delta: string;
  advisory: string;
};

const insightSets: Record<string, Insight[]> = {
  Today: [
    {
      label: "Focus capacity",
      value: "18 min bursts",
      delta: "+3m vs avg",
      advisory: "Maintain check-ins every 2 missions.",
    },
    {
      label: "Reading load",
      value: "1.1× recommended",
      delta: "-0.4 since yesterday",
      advisory: "Keep literal summaries toggled on.",
    },
    {
      label: "Regulation signals",
      value: "4 break requests",
      delta: "+1 vs baseline",
      advisory: "Autoplay calm scene for Mateo + Sloane.",
    },
  ],
  Week: [
    {
      label: "Focus capacity",
      value: "16 min bursts",
      delta: "+2m vs last week",
      advisory: "Experiment with shorter Mission 2.",
    },
    {
      label: "Reading load",
      value: "0.9× recommended",
      delta: "-0.2 vs last week",
      advisory: "Safe to add pre-read humor clip.",
    },
    {
      label: "Regulation signals",
      value: "11 break requests",
      delta: "-3 vs last week",
      advisory: "Highlight breathing prompt before Mission 3.",
    },
  ],
  Month: [
    {
      label: "Focus capacity",
      value: "15 min bursts",
      delta: "+1m vs last month",
      advisory: "Consider 5-min warmups on Mondays.",
    },
    {
      label: "Reading load",
      value: "1.3× recommended",
      delta: "+0.1 vs last month",
      advisory: "Reduce figurative hooks for autism cohort.",
    },
    {
      label: "Regulation signals",
      value: "32 break requests",
      delta: "-6 vs last month",
      advisory: "Share insights with SEL lead.",
    },
  ],
};

export default function InsightPanel() {
  const [range, setRange] = useState<keyof typeof insightSets>("Today");
  const insights = useMemo(() => insightSets[range], [range]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
        <span>AI insight coach</span>
        <div className="flex gap-2 text-[11px]">
          {(Object.keys(insightSets) as Array<keyof typeof insightSets>).map(
            (option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRange(option)}
                className={`rounded-full border px-3 py-1 transition ${
                  option === range
                    ? "border-indigo-200 bg-indigo-50 text-indigo-800"
                    : "border-slate-200 text-slate-700 hover:border-indigo-200"
                }`}
              >
                {option}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {insights.map((insight) => (
          <div
            key={`${insight.label}-${range}`}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {insight.label}
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{insight.value}</p>
            <p className="text-xs text-emerald-700">{insight.delta}</p>
            <p className="mt-4 text-xs text-slate-600">{insight.advisory}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
        Insights run in-memory inside your project. Personally identifiable student data never leaves your Vercel deployment.
      </div>
    </section>
  );
}
