"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { mockTeacherDashboardData } from "@/lib/mocks/teacherDashboard";

export default function ClassesPage() {
  const classes = mockTeacherDashboardData.classes;

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Classes</p>
            <h1 className="mt-2 text-3xl font-semibold">Your active cohorts</h1>
            <p className="text-sm text-slate-500">
              Manage accommodations, pacing, and comms for each group from one place.
            </p>
          </div>
          <Link
            href="#"
            className="rounded-full border border-indigo-300 px-5 py-2 text-sm font-semibold text-indigo-500"
          >
            + Add class
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {classes.map((cohort) => (
            <motion.div
              key={cohort.id}
              whileHover={{ translateY: -6 }}
              className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{cohort.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    {cohort.students} students • Grade {cohort.grade}
                  </p>
                </div>
                <Link
                  href={cohort.rosterLink ?? "#"}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm text-indigo-600 transition hover:border-indigo-400 hover:text-indigo-700 dark:border-white/20 dark:text-indigo-200"
                >
                  View roster
                </Link>
              </div>
              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-white/10 dark:text-slate-200">
                {cohort.focusArea}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
