import Link from "next/link";
import { motion } from "framer-motion";

import type { ClassOverview } from "@/lib/mocks/teacherDashboard";

interface ClassCardProps {
  cohort: ClassOverview;
}

export function ClassCard({ cohort }: ClassCardProps) {
  return (
    <motion.div
      key={cohort.id}
      whileHover={{ translateY: -4 }}
      className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{cohort.name}</p>
          <p className="text-xs text-slate-500">{cohort.students} students • Grade {cohort.grade}</p>
        </div>
        <Link
          href={`/classes/${cohort.id}`}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm"
        >
          View details
        </Link>
      </div>
      <p className="mt-3 text-sm text-slate-500">{cohort.focusArea}</p>
    </motion.div>
  );
}
