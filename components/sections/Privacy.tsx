"use client";

import { motion } from "framer-motion";
import { copy } from "@/lib/copy";
import { useTheme } from "@/components/theme/ThemeProvider";
import { fadeInUp, revealFromBottom } from "@/lib/animations";

export function Privacy() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionBg = isDark ? "bg-transparent text-white" : "bg-slate-100 text-slate-900";

  return (
    <motion.section
      id="privacy"
      className={`px-4 py-20 transition-colors duration-300 ${sectionBg}`}
      initial="hidden"
      whileInView="visible"
      variants={revealFromBottom}
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="mx-auto max-w-4xl space-y-5 text-center"
        variants={fadeInUp}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.42, 0, 0.58, 1] }}
      >
        <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${isDark ? "text-indigo-300" : "text-indigo-500"}`}>
          Privacy
        </p>
        <h2 className="text-3xl font-semibold">Privacy-first, FERPA-aware</h2>
        <p className={`text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>{copy.privacy}</p>
      </motion.div>
    </motion.section>
  );
}
