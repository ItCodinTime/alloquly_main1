"use client";

import { motion } from "framer-motion";
import { copy } from "@/lib/copy";

function StepIcon({ index }: { index: number }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/10 text-sm font-semibold text-indigo-500">
      {String(index + 1).padStart(2, "0")}
    </div>
  );
}

export function HowItWorks() {
  return (
    <motion.section
      id="how-it-works"
      className="bg-slate-50 px-4 py-20 text-slate-900"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">Process</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">How it works</h2>
          <p className="mt-3 text-base text-slate-600">
            Each step stays human-centered; Alloqly simply accelerates the work.
          </p>
        </div>
        <div className="space-y-6">
          {copy.how.map((step, index) => (
            <motion.article
              key={step.title}
              className="flex flex-col gap-4 rounded-3xl border border-white bg-white/70 p-6 shadow-sm shadow-slate-200/20 md:flex-row"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <div className="flex items-center gap-4">
                <StepIcon index={index} />
                <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
              </div>
              <p className="text-base text-slate-600 md:flex-1">{step.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
