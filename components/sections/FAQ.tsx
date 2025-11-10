"use client";

import { motion } from "framer-motion";
import { copy } from "@/lib/copy";
import { useTheme } from "@/components/theme/ThemeProvider";

export function FAQ() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionBg = isDark ? "bg-transparent" : "bg-white";
  const cardBg = isDark
    ? "border-white/10 bg-white/5 text-slate-200"
    : "border-slate-200 bg-white text-slate-700 shadow-lg shadow-slate-200/80";

  return (
    <motion.section
      id="faq"
      className={`px-4 py-20 transition-colors duration-300 ${sectionBg}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${isDark ? "text-indigo-300" : "text-indigo-500"}`}>
            FAQ
          </p>
          <h2 className={`mt-3 text-3xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            Frequently asked
          </h2>
        </div>
        <div className="space-y-4">
          {copy.faq.map((item, index) => (
            <motion.details
              key={item.q}
              className={`group rounded-2xl border p-5 transition-colors ${cardBg}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <summary
                className={`flex cursor-pointer items-center justify-between text-left text-lg font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {item.q}
                <span className="ml-2 text-indigo-500 transition group-open:rotate-45">+</span>
              </summary>
              <p className={`mt-3 text-sm ${isDark ? "text-slate-200" : "text-slate-600"}`}>{item.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
