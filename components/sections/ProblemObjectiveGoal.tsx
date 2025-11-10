"use client";

import { motion } from "framer-motion";
import { copy } from "@/lib/copy";
import { useTheme } from "@/components/theme/ThemeProvider";
import { fadeInUp, revealFromBottom, staggerChildren } from "@/lib/animations";

const pogItems = [
  { title: "Problem", body: copy.pog.problem },
  { title: "Objective", body: copy.pog.objective },
  { title: "Goal", body: copy.pog.goal },
];

export function ProblemObjectiveGoal() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionBg = isDark ? "bg-transparent" : "bg-transparent";
  const cardBg = isDark
    ? "bg-white/5 border-white/10 text-slate-100"
    : "bg-white border-slate-200 text-slate-700 shadow-xl shadow-slate-200/70";

  return (
    <motion.section
      className={`relative isolate overflow-hidden px-4 py-20 transition-colors duration-300 ${sectionBg}`}
      initial="hidden"
      whileInView="visible"
      variants={revealFromBottom}
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div className="mx-auto max-w-6xl space-y-12" variants={staggerChildren}>
        <div className={`space-y-4 text-center lg:text-left ${isDark ? "text-slate-200" : "text-slate-700"}`}>
          <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${isDark ? "text-indigo-300" : "text-indigo-500"}`}>
            Why Alloqly
          </p>
          <h2 className={`text-3xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            Less prep, more access.
          </h2>
          <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>{copy.coreValueLong}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {pogItems.map((item, index) => (
            <motion.article
              key={item.title}
              className={`rounded-3xl border p-6 backdrop-blur ${cardBg}`}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.42, 0, 0.58, 1] }}
            >
              <p className={`text-xs font-semibold uppercase tracking-[0.4em] ${isDark ? "text-indigo-200" : "text-indigo-500"}`}>
                {item.title}
              </p>
              <p className="mt-3 text-sm">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
