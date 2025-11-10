"use client";

import { FloatingDecor } from "@/components/ambient/FloatingDecor";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/Hero";
import { ProblemObjectiveGoal } from "@/components/sections/ProblemObjectiveGoal";
import { ProcessCapabilities } from "@/components/sections/ProcessCapabilities";
import { Privacy } from "@/components/sections/Privacy";
import { PilotCTA } from "@/components/sections/PilotCTA";
import { FAQ } from "@/components/sections/FAQ";
import { useTheme } from "@/components/theme/ThemeProvider";

export function HomePageContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const pageBg = isDark
    ? "text-slate-50 bg-[linear-gradient(180deg,_rgba(6,12,31,1)_0%,_rgba(9,17,36,1)_35%,_rgba(18,29,60,1)_65%,_rgba(36,47,94,1)_100%)]"
    : "text-slate-900 bg-gradient-to-b from-white via-slate-50 to-slate-100";
  const mainBg = "bg-transparent";

  return (
    <div className={`flex min-h-screen flex-col transition-colors duration-300 ${pageBg}`}>
      <Navbar />
      <main className={`relative flex-1 overflow-hidden transition-colors duration-300 ${mainBg}`}>
        <FloatingDecor />
        <div className="relative z-10">
          <Hero />
          <ProblemObjectiveGoal />
          <ProcessCapabilities />
          <Privacy />
          <PilotCTA />
          <FAQ />
        </div>
      </main>
      <Footer />
    </div>
  );
}
