"use client";

import { useState } from "react";

type WorkspaceTask = {
  id: string;
  title: string;
  detail: string;
  duration: number;
  done: boolean;
};

const starterTasks: WorkspaceTask[] = [
  {
    id: "mission-1",
    title: "Mission 1 · Spark sensory map",
    detail: "Play the 40s clip. Capture two environmental sounds and how they make you feel.",
    duration: 6,
    done: false,
  },
  {
    id: "mission-2",
    title: "Mission 2 · Sort the argument",
    detail: "Drag 6 sentences into intro, body, close buckets with auto hints.",
    duration: 8,
    done: false,
  },
  {
    id: "mission-3",
    title: "Mission 3 · Create response",
    detail: "Record a 90-word voice note or type. Timer pauses if emotion check is high.",
    duration: 10,
    done: false,
  },
];

export default function StudentWorkspace() {
  const [tasks, setTasks] = useState(starterTasks);
  const [focusMinutes, setFocusMinutes] = useState(18);
  const [calmScene, setCalmScene] = useState<"forest" | "ocean">("forest");

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  const completed = tasks.filter((task) => task.done).length;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
        <span>Student workspace</span>
        <span>Focus view</span>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between text-sm text-slate-700">
          <p>Focus timer lock</p>
          <p>{focusMinutes} min bursts</p>
        </div>
        <input
          type="range"
          min={10}
          max={30}
          value={focusMinutes}
          onChange={(event) => setFocusMinutes(Number(event.target.value))}
          className="mt-4 w-full accent-indigo-600"
        />
        <p className="mt-2 text-xs text-slate-500">
          Timer auto-pauses when co-regulation flag triggers.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => toggleTask(task.id)}
            className={`flex w-full items-start gap-4 rounded-2xl border px-4 py-3 text-left transition ${
              task.done
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-200 bg-white hover:border-indigo-200"
            }`}
          >
            <span
              className={`mt-1 h-5 w-5 rounded-full border text-xs ${
                task.done
                  ? "border-emerald-200 bg-emerald-200 text-emerald-900"
                  : "border-slate-300 text-slate-500"
              } flex items-center justify-center`}
            >
              {task.done ? "✓" : indexToStep(task)}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-900">{task.title}</p>
              <p className="text-xs text-slate-600">{task.detail}</p>
              <p className="mt-2 text-[11px] text-slate-500">
                {task.duration} min · Voice + text supports
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Calm scene
          </p>
          <div className="mt-3 flex gap-3">
            {(["forest", "ocean"] as const).map((scene) => (
              <button
                key={scene}
                type="button"
                onClick={() => setCalmScene(scene)}
                className={`rounded-xl border px-3 py-2 text-xs capitalize transition ${
                  calmScene === scene
                    ? "border-indigo-200 bg-white text-indigo-800 shadow-sm"
                    : "border-slate-200 text-slate-700 hover:border-indigo-200"
                }`}
              >
                {scene}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Scene plays when overwhelm sentiment > 0.7.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Progress
          </p>
          <div className="mt-4 h-3 rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${(completed / tasks.length) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {completed} / {tasks.length} missions finished
          </p>
        </div>
      </div>
    </section>
  );
}

function indexToStep(task: WorkspaceTask) {
  const index = starterTasks.findIndex((item) => item.id === task.id);
  return index === -1 ? "•" : index + 1;
}
