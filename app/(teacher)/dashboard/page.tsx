"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ClipboardList, Loader2, Users } from "lucide-react";

import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";
import { FloatingDecor } from "@/components/ambient/FloatingDecor";
import { TeacherNavbar } from "@/components/dashboard/TeacherNavbar";
import { TeacherFooter } from "@/components/dashboard/TeacherFooter";
import { fetchTeacherDashboard } from "@/lib/services/teacherDashboard";
import type { TeacherDashboardData } from "@/lib/mocks/teacherDashboard";
import { getMockUser } from "@/lib/mockAuth";

export default function TeacherDashboardPage() {
  return (
    <ThemeProvider>
      <TeacherDashboardContent />
    </ThemeProvider>
  );
}

function TeacherDashboardContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";

  const backgroundClass = isDark
    ? "bg-[linear-gradient(180deg,_rgba(6,12,31,1)_0%,_rgba(9,17,36,1)_35%,_rgba(18,29,60,1)_65%,_rgba(36,47,94,1)_100%)] text-slate-50"
    : "bg-gradient-to-br from-indigo-50 via-white to-slate-50 text-slate-900";

  useEffect(() => {
    const teacherId = getMockUser().id;
    fetchTeacherDashboard(teacherId)
      .then((dash) => {
        setData(dash);
        setError(null);
      })
      .catch(() => {
        setError("Unable to load dashboard. Please refresh.");
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats ?? [];
  const classes = data?.classes ?? [];
  const upcoming = data?.upcomingPlans ?? [];
  const tickets = data?.supportTickets ?? [];

  const summaryIconMap = useMemo(() => ({
    "minutes-saved": Loader2,
    "students-supported": Users,
    "plans-generated": ClipboardList,
  }), []);

  return (
    <div className={`flex min-h-screen flex-col transition-colors duration-300 ${backgroundClass}`}>
      <TeacherNavbar teacherName={data?.profile.name ?? "Teacher"} />
      <main className="relative flex-1 overflow-hidden">
        <FloatingDecor />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-gradient-to-r from-indigo-500/40 to-emerald-400/30 blur-3xl"
          animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-32 bottom-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-400/20 blur-[160px]"
          animate={{ opacity: [0.2, 0.35, 0.2], scale: [1.05, 0.95, 1.05] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative z-10 px-6 py-10 md:py-16">
          {loading ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
              Loading your dashboard…
            </div>
          ) : error ? (
            <div className="mx-auto max-w-lg rounded-2xl border border-rose-200/50 bg-white/80 p-6 text-center text-rose-600 shadow">
              {error}
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
              {/* Profile */}
              <section className={`rounded-3xl border p-6 shadow-xl shadow-indigo-500/10 ${isDark ? "border-white/10 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Teacher Dashboard</p>
                    <h1 className="mt-2 text-3xl font-semibold">
                      Welcome back, {data?.profile.name.split(" ")[0] ?? "Teacher"}
                    </h1>
                    <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {data?.profile.role} • {data?.profile.district}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-400 hover:text-indigo-700"
                  >
                    View profile
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </section>

              {/* Stats */}
              <section className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => {
                  const Icon = summaryIconMap[stat.id as keyof typeof summaryIconMap] ?? CheckCircle;
                  return (
                    <motion.div
                      key={stat.id}
                      whileHover={{ translateY: -4 }}
                      className={`rounded-3xl border p-5 shadow-lg shadow-indigo-500/5 ${
                        isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className={`text-xs uppercase tracking-[0.3em] ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                          {stat.label}
                        </p>
                        <Icon className="h-4 w-4 text-indigo-400" />
                      </div>
                      <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
                      <p className={`mt-1 text-sm ${isDark ? "text-indigo-100" : "text-indigo-600"}`}>{stat.helper}</p>
                    </motion.div>
                  );
                })}
              </section>

              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                {/* Classes */}
                <section className={`rounded-3xl border p-6 shadow-lg shadow-indigo-500/5 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Active Classes</p>
                      <h2 className="text-xl font-semibold">What you’re supporting today</h2>
                    </div>
                    <Link href="#" className={`text-sm ${isDark ? "text-indigo-200" : "text-indigo-600"}`}>
                      View all
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {classes.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="grid gap-4 rounded-2xl border border-slate-200/50 bg-white/90 px-4 py-3 text-sm shadow-sm md:grid-cols-4 dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="md:col-span-2">
                          <p className="font-medium">{classItem.name}</p>
                          <p className={`text-xs ${mutedText}`}>{classItem.focusArea}</p>
                          <Link href="/classes" className="mt-2 inline-flex items-center text-xs text-indigo-500">
                            View all classes
                            <svg viewBox="0 0 24 24" className="ml-1 h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6">
                              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        </div>
                        <p className="text-sm text-slate-500">{classItem.students} students</p>
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Progress</span>
                            <span>{classItem.progress}%</span>
                          </div>
                          <div className="mt-1 h-2 rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                              style={{ width: `${classItem.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Upcoming */}
                <section className={`rounded-3xl border p-6 shadow-lg shadow-indigo-500/5 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Next up</p>
                  <h2 className="text-xl font-semibold">Upcoming plans</h2>
                  <div className="mt-4 space-y-4">
                    {upcoming.map((plan) => (
                      <div
                        key={plan.id}
                        className="rounded-2xl border border-slate-200/50 bg-white/90 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                          <span>{plan.status}</span>
                          <span className="text-indigo-500">{plan.date}</span>
                        </div>
                        <p className="mt-2 text-sm font-semibold">{plan.title}</p>
                        <p className={`text-xs ${mutedText}`}>{plan.focus}</p>
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{plan.className}</p>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full rounded-full border border-dashed border-indigo-300 py-3 text-sm font-semibold text-indigo-500">
                    + New plan
                  </button>
                </section>
              </div>

              {/* Support tickets */}
              <section className={`rounded-3xl border p-6 shadow-lg shadow-indigo-500/5 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Support center</p>
                    <h2 className="text-xl font-semibold">Recent requests</h2>
                  </div>
                  <button className="rounded-full border border-indigo-300 px-4 py-2 text-sm text-indigo-500">
                    New ticket
                  </button>
                </div>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-start justify-between rounded-2xl border border-slate-200/50 px-4 py-3">
                      <div>
                        <p className="font-medium">{ticket.studentName}</p>
                        <p className={`text-sm ${mutedText}`}>{ticket.summary}</p>
                        <p className="text-xs text-slate-400">Updated {ticket.updatedAt}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          ticket.status === "Resolved"
                            ? "bg-emerald-100 text-emerald-700"
                            : ticket.status === "In progress"
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <TeacherFooter />
    </div>
  );
}
