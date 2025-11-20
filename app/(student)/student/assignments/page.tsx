"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, Loader2, NotebookPen, Play } from "@/components/icons/lucide";

import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";
import { FloatingDecor } from "@/components/ambient/FloatingDecor";
import { StudentNavbar } from "@/components/dashboard/StudentNavbar";
import { StudentFooter } from "@/components/dashboard/StudentFooter";
import { fetchStudentDashboard } from "@/lib/services/studentDashboard";
import type { StudentAssignment, StudentDashboardData } from "@/lib/mocks/studentDashboard";
import { getMockUser } from "@/lib/mockAuth";

const statusFilters: StudentAssignment["status"][] = ["In progress", "Ready", "Submitted"];
const EMPTY_ASSIGNMENTS: StudentAssignment[] = [];

export default function StudentAssignmentsPage() {
  return (
    <ThemeProvider>
      <StudentAssignmentsContent />
    </ThemeProvider>
  );
}

function StudentAssignmentsContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<StudentAssignment["status"]>("In progress");

  const backgroundClass = isDark
    ? "bg-[linear-gradient(180deg,_rgba(3,10,28,1)_0%,_rgba(9,17,36,1)_45%,_rgba(16,28,61,1)_70%,_rgba(25,40,80,1)_100%)] text-slate-50"
    : "bg-gradient-to-br from-white via-slate-50 to-indigo-50 text-slate-900";

  const mutedText = isDark ? "text-slate-300" : "text-slate-600";

  useEffect(() => {
    const studentId = getMockUser("student").id;
    fetchStudentDashboard(studentId)
      .then((payload) => {
        setData(payload);
        setError(null);
      })
      .catch(() => {
        setError("Assignments failed to load. Refresh to try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const assignments = data?.assignments ?? EMPTY_ASSIGNMENTS;

  const groupedAssignments = useMemo(() => {
    return assignments.reduce<Record<StudentAssignment["status"], StudentAssignment[]>>(
      (acc, assignment) => {
        acc[assignment.status] = [...acc[assignment.status], assignment];
        return acc;
      },
      {
        Ready: [],
        "In progress": [],
        Submitted: [],
      }
    );
  }, [assignments]);

  const activeAssignments = groupedAssignments[activeFilter];

  return (
    <div className={`flex min-h-screen flex-col transition-colors duration-300 ${backgroundClass}`}>
      <StudentNavbar studentName={data?.profile.name} />
      <main className="relative flex-1 overflow-hidden">
        <FloatingDecor />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-20 h-80 w-80 rounded-full bg-gradient-to-r from-indigo-500/40 to-emerald-400/30 blur-3xl"
          animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-10 h-[24rem] w-[24rem] rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-400/20 blur-[160px]"
          animate={{ opacity: [0.2, 0.35, 0.2], scale: [1.05, 0.95, 1.05] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative z-10 px-5 py-10 md:py-14">
          {loading ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
              Loading all assignments…
            </div>
          ) : error ? (
            <div className="mx-auto max-w-lg rounded-2xl border border-rose-200/50 bg-white/80 p-6 text-center text-rose-600 shadow">
              {error}
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
              {/* Header */}
              <section
                className={`rounded-3xl border p-6 shadow-xl shadow-indigo-500/10 ${
                  isDark ? "border-white/10 bg-slate-950/60" : "border-white/90 bg-white"
                }`}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Assignments</p>
                    <h1 className="mt-2 text-3xl font-semibold">Everything due in one place</h1>
                    <p className={`mt-2 text-sm ${mutedText}`}>
                      Tap a task to view adaptations, mark steps complete, or upload finished work.
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-sm ${
                      isDark ? "border-white/10 bg-white/5" : "border-indigo-100 bg-white/80"
                    }`}
                  >
                    <CalendarClock className="h-8 w-8 text-indigo-400" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">This week</p>
                      <p className="text-base font-semibold">
                        {assignments.length} {assignments.length === 1 ? "task" : "tasks"} on deck
                      </p>
                      <p className={`text-xs ${mutedText}`}>
                        {groupedAssignments["In progress"].length} in progress · {groupedAssignments.Ready.length} ready to start
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Filters */}
              <div
                className={`flex flex-wrap gap-3 rounded-2xl border p-3 text-sm ${
                  isDark ? "border-white/10 bg-white/5" : "border-white/90 bg-white"
                }`}
              >
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setActiveFilter(status)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition ${
                      activeFilter === status
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow"
                        : isDark
                        ? "text-slate-200 hover:text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span className="text-xs uppercase tracking-[0.3em]">{status}</span>
                    <span
                      className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full text-xs ${
                        activeFilter === status
                          ? "bg-white/20"
                          : isDark
                          ? "bg-white/10 text-slate-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {groupedAssignments[status].length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[2.1fr_0.9fr]">
                <section
                  className={`rounded-3xl border p-6 shadow-lg shadow-indigo-500/10 ${
                    isDark ? "border-white/10 bg-white/5" : "border-white/90 bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-1 pb-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">{activeFilter}</p>
                    <h2 className="text-xl font-semibold">
                      {activeFilter === "Submitted" ? "Turned in" : "Focus now"}
                    </h2>
                    <p className={`text-sm ${mutedText}`}>
                      {activeAssignments.length > 0
                        ? "Stay consistent—mark checkpoints done as you go."
                        : "No tasks in this bucket right now."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {activeAssignments.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-indigo-200/70 p-6 text-center text-sm text-indigo-500 dark:border-white/15">
                        Nothing to show. Check another tab or take a quick breather ☕️
                      </div>
                    ) : (
                      activeAssignments.map((assignment) => (
                        <motion.article
                          key={assignment.id}
                          whileHover={{ translateY: -4 }}
                          className="rounded-2xl border border-slate-200/60 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="text-lg font-semibold">{assignment.title}</p>
                              <p className={`text-sm ${mutedText}`}>{assignment.course}</p>
                            </div>
                            <div className="text-right text-xs uppercase tracking-[0.3em] text-indigo-500">
                              {assignment.dueDate}
                            </div>
                          </div>
                          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <span
                              className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
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
                          <div className="mt-4 space-y-2 text-sm">
                            <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Adaptations</p>
                            <div className="flex flex-wrap gap-2">
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
                          <div className="mt-4 flex flex-wrap gap-3">
                            {assignment.status !== "Submitted" && (
                              <button
                                type="button"
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:from-indigo-500 hover:to-indigo-700"
                              >
                                <Play className="h-4 w-4" />
                                Continue task
                              </button>
                            )}
                            <button
                              type="button"
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-white/20 dark:text-slate-200"
                            >
                              <NotebookPen className="h-4 w-4" />
                              View instructions
                            </button>
                            {assignment.status === "Submitted" ? (
                              <button
                                type="button"
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-600 dark:border-emerald-400/30 dark:text-emerald-200"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Feedback pending
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-400 hover:text-indigo-700 dark:border-white/20 dark:text-indigo-200"
                              >
                                Upload work
                              </button>
                            )}
                          </div>
                        </motion.article>
                      ))
                    )}
                  </div>
                </section>

                <aside
                  className={`flex flex-col gap-4 rounded-3xl border p-6 shadow-lg shadow-indigo-500/10 ${
                    isDark ? "border-white/10 bg-white/5" : "border-white/90 bg-white"
                  }`}
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Weekly rhythm</p>
                    <h3 className="text-lg font-semibold">Mini habits</h3>
                    <p className={`mt-1 text-sm ${mutedText}`}>
                      Keep these handy to get from “ready” to “turned in” faster.
                    </p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="rounded-2xl border border-indigo-200/60 bg-indigo-500/5 p-4 dark:border-white/15 dark:bg-white/5">
                      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-200">👉 Preview + plan</p>
                      <p className={`text-xs ${mutedText}`}>Open each adaptation before you start writing.</p>
                    </li>
                    <li className="rounded-2xl border border-emerald-200/60 bg-emerald-500/5 p-4 dark:border-white/15 dark:bg-white/5">
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-200">🎧 sensory setup</p>
                      <p className={`text-xs ${mutedText}`}>Use headphones + captions for labs/ELA voice notes.</p>
                    </li>
                    <li className="rounded-2xl border border-amber-200/60 bg-amber-500/5 p-4 dark:border-white/15 dark:bg-white/5">
                      <p className="text-sm font-semibold text-amber-600 dark:text-amber-200">📸 show your work</p>
                      <p className={`text-xs ${mutedText}`}>Snap the worksheet + upload before you change tasks.</p>
                    </li>
                  </ul>
                </aside>
              </div>
            </div>
          )}
        </div>
      </main>
      <StudentFooter />
    </div>
  );
}
