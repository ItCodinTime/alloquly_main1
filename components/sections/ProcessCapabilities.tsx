"use client";

import { motion } from "framer-motion";
import { copy } from "@/lib/copy";
import { useTheme } from "@/components/theme/ThemeProvider";

function StepIcon({ index, isDark }: { index: number; isDark: boolean }) {
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
        isDark
          ? "bg-indigo-600/10 text-indigo-300"
          : "bg-white/50 text-indigo-600 backdrop-blur"
      }`}
    >
      {String(index + 1).padStart(2, "0")}
    </div>
  );
}

const columnVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function ProcessCapabilities() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionBg = "bg-transparent";
  const cardBg = isDark
    ? "border-white/10 bg-white/5 text-slate-100"
    : "border-slate-200 bg-white text-slate-700 shadow-xl shadow-slate-200/70";

  return (
    <section className={`relative isolate overflow-hidden px-4 py-20 transition-colors duration-300 ${sectionBg}`}>
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <motion.div
          id="how-it-works"
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          variants={columnVariants}
          viewport={{ once: true, amount: 0.2 }}
        >
          <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${isDark ? "text-indigo-300" : "text-indigo-500"}`}>
            Process
          </p>
          <div className="space-y-3">
            <h2 className={`text-3xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>How it works</h2>
            <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Each step stays human-centered; Alloqly simply accelerates the work.
            </p>
          </div>
          <div className="space-y-5">
            {copy.how.map((step, index) => (
              <motion.article
                key={step.title}
                className={`flex gap-4 rounded-3xl border p-5 backdrop-blur ${cardBg}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <StepIcon index={index} isDark={isDark} />
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{step.title}</h3>
                  <p className={`text-sm ${isDark ? "text-slate-200" : "text-slate-600"}`}>{step.body}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        <motion.div
          id="features"
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          variants={columnVariants}
          viewport={{ once: true, amount: 0.2 }}
        >
          <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${isDark ? "text-indigo-300" : "text-indigo-500"}`}>
            Capabilities
          </p>
          <div className="space-y-3">
            <h2 className={`text-3xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              Minimal surface, deep support.
            </h2>
            <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Every workflow keeps teachers in control while aligning outputs to each students&apos; accommodations.
            </p>
          </div>
          <div className="grid gap-3">
            {copy.features.map((feature, index) => (
              <motion.div
                key={feature}
                className={`flex items-center gap-3 rounded-2xl border p-4 backdrop-blur ${cardBg}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <span
                  className={`h-2 w-2 rounded-full ${isDark ? "bg-indigo-300" : "bg-indigo-500"}`}
                  aria-hidden="true"
                />
                <p className={`text-sm ${isDark ? "text-slate-100" : "text-slate-700"}`}>{feature}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
