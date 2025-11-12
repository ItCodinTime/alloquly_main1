"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getMockUser } from "@/lib/mockAuth";
import { mockTeacherDashboardData } from "@/lib/mocks/teacherDashboard";

export default function TeacherProfilePage() {
  const user = getMockUser();
  const profile = mockTeacherDashboardData.profile;
  const stats = mockTeacherDashboardData.stats;

  return (
    <DashboardLayout teacherName={user.name}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-lg dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl font-semibold text-white">
              {profile.avatarInitials}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Teacher Profile</p>
              <h1 className="text-3xl font-semibold">{profile.name}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {profile.role} • {profile.district}
              </p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              whileHover={{ translateY: -3 }}
              className="rounded-3xl border border-slate-200/70 bg-white/95 p-5 shadow-lg dark:border-white/10 dark:bg-white/5"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
              <p className="text-sm text-indigo-500">{stat.helper}</p>
            </motion.div>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-lg dark:border-white/10 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Contact</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-200">
              <p>Email: {user.email}</p>
              <p>District: {profile.district}</p>
              <p>Role: {profile.role}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-lg dark:border-white/10 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Actions</p>
            <div className="mt-4 grid gap-3 text-sm">
              <Link href="/plans" className="rounded-full border border-slate-200 px-4 py-2 text-center">
                Manage plans
              </Link>
              <Link href="/classes" className="rounded-full border border-slate-200 px-4 py-2 text-center">
                View classes
              </Link>
              <Link href="/support" className="rounded-full border border-slate-200 px-4 py-2 text-center">
                Support inbox
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
