"use client";

import { motion } from "framer-motion";
import { copy } from "@/lib/copy";

export function Features() {
  return (
    <motion.section
      id="features"
      className="bg-white px-4 py-20 text-slate-900"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">Capabilities</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Minimal surface, deep support.</h2>
          <p className="mt-3 text-base text-slate-600">
            Every workflow keeps teachers in control while aligning outputs to each students&apos; accommodations.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {copy.features.map((feature, index) => (
            <motion.div
              key={feature}
              className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <span className="h-6 w-6 rounded-full bg-indigo-100 text-center text-sm font-semibold text-indigo-600">
                ·
              </span>
              <p className="text-sm text-slate-700">{feature}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
