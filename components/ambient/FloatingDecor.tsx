"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";

export function FloatingDecor() {
  const { scrollY } = useScroll();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const yPrimary = useTransform(scrollY, [0, 1000], [0, -140]);
  const ySecondary = useTransform(scrollY, [0, 1000], [0, 160]);
  const yTertiary = useTransform(scrollY, [0, 1000], [0, -100]);

  const primaryClass = isDark
    ? "from-indigo-500/30 to-purple-500/20"
    : "from-sky-300/40 to-indigo-200/30";
  const secondaryClass = isDark
    ? "from-rose-500/30 to-orange-400/20"
    : "from-amber-200/40 to-rose-200/20";
  const tertiaryClass = isDark
    ? "from-cyan-400/20 to-indigo-500/20"
    : "from-cyan-200/40 to-blue-200/20";

  const baseOpacity = isDark ? "opacity-70" : "opacity-60";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={{ y: yPrimary }}
        className={`absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-gradient-to-br ${primaryClass} ${baseOpacity} blur-[140px]`}
      />
      <motion.div
        style={{ y: ySecondary }}
        className={`absolute right-[-5%] top-1/3 h-80 w-80 rounded-full bg-gradient-to-br ${secondaryClass} ${baseOpacity} blur-[160px]`}
      />
      <motion.div
        style={{ y: yTertiary }}
        className={`absolute left-1/3 bottom-[-10%] h-96 w-96 rounded-full bg-gradient-to-br ${tertiaryClass} ${baseOpacity} blur-[200px]`}
      />
    </div>
  );
}
