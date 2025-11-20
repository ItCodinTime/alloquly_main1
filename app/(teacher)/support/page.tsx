"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Inbox } from "@/components/icons/lucide";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { mockTeacherDashboardData } from "@/lib/mocks/teacherDashboard";

export default function SupportPage() {
  const tickets = mockTeacherDashboardData.supportTickets;

  const statusClass = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-700";
      case "In progress":
        return "bg-indigo-100 text-indigo-600";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Support Center</p>
            <h1 className="mt-2 text-3xl font-semibold">Conversations & tickets</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Collaborate with specialists, admins, and families right inside Alloqly.
            </p>
          </div>
          <Link
            href="#"
            className="rounded-full border border-emerald-300 px-5 py-2 text-sm font-semibold text-emerald-500"
          >
            + New request
          </Link>
        </div>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              whileHover={{ translateY: -4 }}
              className="flex items-start justify-between rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-white/5"
            >
              <div>
                <p className="text-sm font-semibold">
                  {ticket.studentName} — {ticket.title}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-300">{ticket.summary}</p>
                <p className="text-xs text-slate-400">{ticket.updatedAt} • {ticket.channel}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(ticket.status)}`}>
                {ticket.status}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <Inbox className="h-6 w-6 text-indigo-500" />
            <div>
              <p className="text-sm font-semibold">Inbox automations</p>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Auto-triage requests by student, urgency, and service type.
              </p>
            </div>
          </div>
          <button className="mt-4 rounded-full border border-indigo-300 px-4 py-2 text-sm text-indigo-500">
            Configure routing
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
