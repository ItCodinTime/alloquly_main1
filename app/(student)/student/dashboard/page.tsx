"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Headphones, Loader2, NotebookPen, Timer } from "@/components/icons/lucide";

import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";
import { StudentNavbar } from "@/components/dashboard/StudentNavbar";
import { StudentFooter } from "@/components/dashboard/StudentFooter";
import { fetchStudentDashboard } from "@/lib/services/studentDashboard";
import type { StudentDashboardData } from "@/lib/mocks/studentDashboard";
import { getMockUser } from "@/lib/mockAuth";
import JoinClassForm from "@/components/join-class-form";

const supportIconMap = {
  Checklist: CheckCircle2,
  Audio: Headphones,
  Planner: Timer,
  Steps: NotebookPen,
} as const;

export default function StudentDashboardPage() {
  return (
    <ThemeProvider>
      <StudentDashboardContent />
    </ThemeProvider>
  );
}

function StudentDashboardContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backgroundClass = isDark
    ? "bg-slate-950 text-slate-50"
    : "bg-slate-50 text-slate-900";
  const mutedText = isDark ? "text-slate-300" : "text-slate-600";

  useEffect(() => {
    const studentId = getMockUser("student").id;
    fetchStudentDashboard(studentId)
      .then((payload) => {
        setData(payload);
        setError(null);
      })
      .catch(() => {
        setError("We couldn’t load your dashboard. Try refreshing.");
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats ?? [];
  const assignments = data?.assignments ?? [];
  const supports = data?.supports ?? [];
  const celebrations = data?.celebrations ?? [];
  const routine = data?.routine ?? [];
  const pulse = data?.pulse;

  const supportIcons = useMemo(() => supportIconMap, []);

  return (
    <div className={`flex min-h-screen flex-col transition-colors duration-300 ${backgroundClass}`}>
      <StudentNavbar studentName={data?.profile.name} />
      <main className="relative flex-1 overflow-hidden">
        <div className="relative z-10 px-5 py-10 md:py-14">
          {loading ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
              Getting your day ready…
            </div>
          ) : error ? (
            <div className="mx-auto max-w-lg rounded-2xl border border-rose-200/50 bg-white/80 p-6 text-center text-rose-600 shadow">
              {error}
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-7">
              {/* Hero */}
              <section
                className={`rounded-3xl border p-6 shadow-lg shadow-indigo-500/10 ${
                  isDark ? "border-white/10 bg-slate-950/60" : "border-white/70 bg-white"
                }`}
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-xl">
                    <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Student Dashboard</p>
                    <h1 className="mt-2 text-3xl font-semibold">Hey {data?.profile.name.split(" ")[0] ?? "there"}!</h1>
                    <p className={`mt-1 text-sm ${mutedText}`}>
                      Grade {data?.profile.grade} • {data?.profile.homeroom} • Advisor {data?.profile.advisor}
                    </p>
                    <div className="mt-4 rounded-2xl border border-indigo-200/40 bg-indigo-500/10 p-4 text-sm text-indigo-50 dark:border-white/10 dark:bg-white/5 dark:text-indigo-100">
                      <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Focus for today</p>
                      <p className="mt-2 text-base font-medium text-white dark:text-indigo-100">{data?.profile.focusGoal}</p>
                    </div>
                  </div>
                  {pulse && (
                    <div
                      className={`min-w-[220px] rounded-2xl border p-4 shadow ${
                        isDark ? "border-white/10 bg-white/5" : "border-indigo-100 bg-white/80"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Pulse check</p>
                      <p className="mt-2 text-lg font-semibold">{pulse.mood}</p>
                      <p className={`text-xs ${mutedText}`}>{pulse.updatedAt}</p>
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Energy</span>
                          <span>{pulse.energy}/10</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-indigo-500"
                            style={{ width: `${(pulse.energy / 10) * 100}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span>Focus</span>
                          <span>{pulse.focus}/10</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-500"
                            style={{ width: `${(pulse.focus / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                      <p className={`mt-3 text-xs ${mutedText}`}>{pulse.note}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Stats */}
              <section className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <motion.div
                    key={stat.id}
                    whileHover={{ translateY: -4 }}
                    className={`rounded-2xl border p-4 text-sm shadow ${
                      isDark ? "border-white/10 bg-white/5" : "border-white/80 bg-white"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">{stat.label}</p>
                    <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
                    <p className={`mt-1 text-xs ${mutedText}`}>{stat.helper}</p>
                  </motion.div>
                ))}
              </section>

              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                {/* Assignments */}
                <section
                  className={`rounded-3xl border p-6 shadow-lg shadow-indigo-500/5 ${
                    isDark ? "border-white/10 bg-white/5" : "border-white/80 bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-1 pb-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Assignments</p>
                    <h2 className="text-xl font-semibold">Your next steps</h2>
                    <p className={`text-sm ${mutedText}`}>Tap an adaptation before you submit.</p>
                  </div>
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="rounded-2xl border border-indigo-100/60 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm font-semibold">{assignment.title}</p>
                            <p className={`text-xs ${mutedText}`}>{assignment.course}</p>
                          </div>
                          <span className="text-xs uppercase tracking-[0.3em] text-indigo-500">{assignment.dueDate}</span>
                        </div>
                        <div className="mt-3 flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-300 md:flex-row md:items-center md:justify-between">
                          <span
                            className={`inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold ${
                              assignment.status === "Submitted"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
                                : assignment.status === "In progress"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200"
                                : "bg-indigo-100 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-200"
                            }`}
                          >
                            {assignment.status}
                          </span>
                          <div className="flex-1 md:ml-4">
                            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em]">
                              <span>Progress</span>
                              <span>{assignment.progress}%</span>
                            </div>
                            <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-white/10">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                style={{ width: `${assignment.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {assignment.adaptations.map((adaptation) => (
                            <span
                              key={adaptation}
                              className="inline-flex items-center gap-2 rounded-full border border-dashed border-indigo-200 px-3 py-1 text-xs text-indigo-600 dark:border-white/20 dark:text-indigo-100"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" aria-hidden />
                              {adaptation}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-5 w-full rounded-full border border-dashed border-indigo-300 py-3 text-sm font-semibold text-indigo-500 shadow-sm">
                    Upload finished work
                  </button>
                </section>

                {/* Supports */}
                <section
                  className={`rounded-3xl border p-6 shadow-lg shadow-indigo-500/5 ${
                    isDark ? "border-white/10 bg-white/5" : "border-white/80 bg-white"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Tools</p>
                  <h2 className="text-xl font-semibold">Supports ready now</h2>
                  <div className="mt-4 space-y-4">
                    {supports.map((support) => {
                      const Icon = supportIcons[support.type];
                      return (
                        <div
                          key={support.id}
                          className="rounded-2xl border border-slate-200/60 bg-white/90 p-4 text-sm shadow-sm dark:border-white/10 dark:bg-white/5"
                        >
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 dark:bg-white/10">
                              <Icon className="h-4 w-4" />
                            </span>
                            <div>
                              <p className="font-semibold">{support.title}</p>
                              <p className={`text-xs ${mutedText}`}>{support.description}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                                support.completed
                                  ? "text-emerald-600 dark:text-emerald-200"
                                  : "text-indigo-500 dark:text-indigo-200"
                              }`}
                            >
                              <CheckCircle2
                                className={`h-3 w-3 ${support.completed ? "text-emerald-500" : "text-slate-400"}`}
                              />
                              {support.completed ? "Done" : "Tap to use"}
                            </span>
                            <button type="button" className="text-indigo-500">
                              {support.linkLabel} →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* Join code onboarding */}
              <JoinClassForm />

              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                {/* Celebrations */}
                <section
                  className={`rounded-3xl border p-6 shadow-lg shadow-indigo-500/5 ${
                    isDark ? "border-white/10 bg-white/5" : "border-white/80 bg-white"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Teacher notes</p>
                  <h2 className="text-xl font-semibold">Celebrations & nudges</h2>
                  <div className="mt-4 space-y-4">
                    {celebrations.map((celebration) => (
                      <div
                        key={celebration.id}
                        className="rounded-2xl border border-slate-200/60 bg-white/90 p-4 text-sm shadow-sm dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{celebration.title}</p>
                          <span className="text-xs text-indigo-500">{celebration.tag}</span>
                        </div>
                        <p className={`mt-2 text-sm ${mutedText}`}>{celebration.detail}</p>
                        <p className="mt-2 text-xs text-slate-400">{celebration.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Routine */}
                <section
                  className={`rounded-3xl border p-6 shadow-lg shadow-indigo-500/5 ${
                    isDark ? "border-white/10 bg-white/5" : "border-white/80 bg-white"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Routine</p>
                  <h2 className="text-xl font-semibold">Launch checklist</h2>
                  <div className="mt-4 space-y-4">
                    {routine.map((step) => (
                      <label key={step.id} className="flex cursor-pointer items-start gap-3 text-sm">
                        <input type="checkbox" className="mt-1 accent-indigo-500" defaultChecked={step.completed} />
                        <div>
                          <p className="font-semibold">{step.label}</p>
                          <p className={`text-xs ${mutedText}`}>{step.helper}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button className="mt-5 w-full rounded-full border border-indigo-300 py-2 text-sm font-semibold text-indigo-500">
                    Notify my teacher
                  </button>
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
      <StudentFooter />
    </div>
  );
}
