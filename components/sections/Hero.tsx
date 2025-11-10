"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { copy } from "@/lib/copy";
import { useTheme } from "@/components/theme/ThemeProvider";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: "easeOut" },
  }),
};

export function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const containerClass = isDark
    ? "bg-transparent text-white"
    : "bg-transparent text-slate-900";
  const chipClass = isDark
    ? "border-white/10 text-indigo-200"
    : "border-white/80 bg-white/90 text-indigo-600 shadow-sm";
  const textMuted = isDark ? "text-slate-300" : "text-slate-600";
  const primaryButton = isDark
    ? "bg-white text-slate-900 hover:bg-slate-100"
    : "bg-slate-900 text-white hover:bg-black";
  const secondaryButton = isDark
    ? "border-white/20 text-white hover:bg-white/5"
    : "border-white/50 text-slate-900 hover:bg-white/60";
  const panelBg = isDark
    ? "border-white/10 bg-white/5"
    : "border-white bg-white shadow-2xl shadow-indigo-200/50";
  const panelText = isDark ? "text-slate-200" : "text-slate-700";

  return (
    <section
      className={`relative isolate overflow-hidden px-4 pb-24 pt-32 transition-colors duration-300 ${containerClass}`}
    >
      <div className="absolute inset-x-0 -top-32 flex justify-center">
        <div className="h-64 w-[480px] rounded-full bg-gradient-to-r from-indigo-500/40 to-purple-500/30 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center">
        <motion.div
          className="space-y-8 text-center lg:text-left"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs uppercase tracking-[0.3em] transition-colors ${chipClass}`}
          >
            {copy.brand.name}
          </p>
          <div className="space-y-6">
            <motion.h1
              className={`text-4xl font-medium leading-tight sm:text-5xl ${isDark ? "text-white" : "text-slate-900"}`}
              variants={fadeUp}
              custom={0.1}
            >
              {copy.brand.tagline}
            </motion.h1>
            <motion.p className={`text-lg ${textMuted}`} variants={fadeUp} custom={0.2}>
              {copy.coreValueShort}
            </motion.p>
          </div>
          <motion.div className="flex flex-col gap-4 sm:flex-row" variants={fadeUp} custom={0.3}>
            <Link
              href="/contact"
              aria-label={copy.ctas.primary}
              className={`rounded-full px-6 py-3 text-base font-semibold shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${primaryButton}`}
            >
              {copy.ctas.primary}
            </Link>
            <a
              href="#how-it-works"
              aria-label={copy.ctas.secondary}
              className={`rounded-full px-6 py-3 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${secondaryButton}`}
            >
              {copy.ctas.secondary}
            </a>
          </motion.div>
          <motion.p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`} variants={fadeUp} custom={0.4}>
            {copy.ctas.trustNote}
          </motion.p>
        </motion.div>

        <motion.div
          className={`w-full max-w-md rounded-3xl border p-6 backdrop-blur transition-colors ${panelBg}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className={`space-y-4 text-sm ${panelText}`}>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Sample adaptation</p>
            <div
              className={`rounded-2xl border p-4 ${
                isDark ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-white shadow-md"
              }`}
            >
              <p className="text-xs text-slate-400">Prompt</p>
              <p className={`mt-2 text-base ${isDark ? "text-white" : "text-slate-900"}`}>
                Adapt Friday science lab for students needing simplified vocabulary and chunked directions.
              </p>
            </div>
            <div
              className={`space-y-2 rounded-2xl border p-4 ${
                isDark ? "border-white/10 bg-slate-900/40" : "border-slate-200 bg-white shadow-md"
              }`}
            >
              <p className="text-xs text-slate-400">Output preview</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Step-by-step card with 4 short actions and picture cues.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Read-aloud script with calming tone indicators.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Quick rubric aligned to scaffolded goals.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
