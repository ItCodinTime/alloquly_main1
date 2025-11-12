"use client";

import { ReactNode } from "react";
import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";
import { FloatingDecor } from "@/components/ambient/FloatingDecor";
import { TeacherNavbar } from "@/components/dashboard/TeacherNavbar";
import { TeacherFooter } from "@/components/dashboard/TeacherFooter";
import { getMockUser } from "@/lib/mockAuth";

interface DashboardLayoutProps {
  children: ReactNode;
  teacherName?: string;
  backgroundClass?: string;
}

export function DashboardLayout({ children, teacherName, backgroundClass }: DashboardLayoutProps) {
  return (
    <ThemeProvider>
      <DashboardContent teacherName={teacherName} backgroundClass={backgroundClass}>
        {children}
      </DashboardContent>
    </ThemeProvider>
  );
}

function DashboardContent({ children, teacherName, backgroundClass }: DashboardLayoutProps) {
  const mockUser = getMockUser();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bgClass =
    backgroundClass ??
    (isDark
      ? "bg-[linear-gradient(180deg,_rgba(6,12,31,1)_0%,_rgba(9,17,36,1)_35%,_rgba(18,29,60,1)_65%,_rgba(36,47,94,1)_100%)] text-slate-50"
      : "bg-gradient-to-br from-indigo-50 via-white to-slate-50 text-slate-900");

  return (
    <div className={`flex min-h-screen flex-col transition-colors duration-300 ${bgClass}`}>
      <TeacherNavbar teacherName={teacherName ?? mockUser.name} />
      <main className="relative flex-1 overflow-hidden">
        <FloatingDecor />
        <div className="relative z-10 px-6 py-10 md:py-16">
          {children}
        </div>
      </main>
      <TeacherFooter />
    </div>
  );
}
