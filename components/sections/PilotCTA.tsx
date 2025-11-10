"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { copy } from "@/lib/copy";
import { useTheme } from "@/components/theme/ThemeProvider";

export function PilotCTA() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionBg = isDark ? "bg-transparent" : "bg-slate-100";
  const cardBg = isDark ? "bg-indigo-700/30 border-indigo-500/30" : "bg-white border-slate-200 shadow-2xl shadow-indigo-200/70";

  return (
    <motion.section
      id="pilot"
      className={`px-4 py-20 transition-colors duration-300 ${sectionBg}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className={`mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border p-8 text-center shadow-sm ${cardBg}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true, amount: 0.4 }}
      >
        <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${isDark ? "text-indigo-200" : "text-indigo-500"}`}>
          Pilot
        </p>
        <h2 className={`text-3xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
          {copy.pilotCTA.title}
        </h2>
        <p className={`text-base ${isDark ? "text-indigo-100" : "text-slate-600"}`}>{copy.pilotCTA.body}</p>
        <Link
          href="/contact"
          aria-label={copy.pilotCTA.button}
          className={`mx-auto rounded-full px-6 py-3 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            isDark ? "bg-white text-indigo-700 hover:bg-slate-100" : "bg-indigo-600 text-white hover:bg-indigo-500"
          }`}
        >
          {copy.pilotCTA.button}
        </Link>
      </motion.div>
    </motion.section>
  );
}
