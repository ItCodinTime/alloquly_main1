"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { mockTeacherDashboardData } from "@/lib/mocks/teacherDashboard";

export default function PlansPage() {
  const plans = mockTeacherDashboardData.upcomingPlans;
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Lesson Plans</p>
            <h1 className="mt-2 text-3xl font-semibold">Guided plans & drafts</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Plan cards stay saved to your workspace. Publish them directly to your classes when ready.
            </p>
          </div>
          <Link
            href="#"
            className="rounded-full border border-indigo-300 px-5 py-2 text-sm font-semibold text-indigo-500"
          >
            + New plan
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ translateY: -4 }}
              className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                <span>{plan.status}</span>
                <span className="text-indigo-500">{plan.date}</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold">{plan.title}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{plan.details}</p>
              <div className="mt-4 flex gap-3 text-sm">
                <button className="rounded-full border border-slate-200 px-4 py-2 dark:border-white/20">
                  Preview
                </button>
                <button className="rounded-full border border-slate-200 px-4 py-2 dark:border-white/20">
                  Assign
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
