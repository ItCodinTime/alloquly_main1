"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Book, GraduationCap } from "@/components/icons/lucide";

import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingDecor } from "@/components/ambient/FloatingDecor";
import { getMockUser } from "@/lib/mockAuth";

export default function LoginPage() {
  return (
    <ThemeProvider>
      <LoginContent />
    </ThemeProvider>
  );
}

function LoginContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [role, setRole] = useState<"teacher" | "student">("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const roleCopy = useMemo(
    () => ({
      teacher: {
        badge: "Teacher Portal",
        heading: "Lead every lesson with confidence",
        subcopy: "Log in to generate accommodations, adapt materials, and monitor progress.",
        placeholder: "you@district.edu",
        signupHref: "/teacher/signup",
        forgotHref: "/teacher/forgot",
        buttonLabel: "Login as Teacher",
      },
      student: {
        badge: "Student Hub",
        heading: "Your learning plan, personalized",
        subcopy: "Sign in to access adapted assignments and quick feedback in one place.",
        placeholder: "you@student.edu",
        signupHref: "/student/signup",
        forgotHref: "/student/forgot",
        buttonLabel: "Login as Student",
      },
    }),
    []
  );

  const active = roleCopy[role];
  const teacher = getMockUser();

  const backgroundClass = isDark
    ? "bg-[linear-gradient(180deg,_rgba(6,12,31,1)_0%,_rgba(9,17,36,1)_35%,_rgba(18,29,60,1)_65%,_rgba(36,47,94,1)_100%)] text-slate-50"
    : "bg-gradient-to-br from-indigo-50 via-white to-slate-50 text-slate-900";

  const cardClass = isDark
    ? "bg-slate-950/70 border-white/10 text-white"
    : "bg-white border-slate-200 text-slate-900";

  const inputClass = isDark
    ? "w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    : "w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const accentLink = isDark ? "text-indigo-200 hover:text-indigo-100" : "text-indigo-600 hover:text-indigo-700";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ role, email, password });
    // TODO: Integrate Supabase or backend auth provider
    const destination = role === "teacher" ? "/dashboard" : "/student/dashboard";
    window.location.assign(destination);
  };

  return (
    <div className={`flex min-h-screen flex-col transition-colors duration-300 ${backgroundClass}`}>
      <Navbar defaultName={teacher.name} />
      <main className="relative flex-1 overflow-hidden">
      <FloatingDecor />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-gradient-to-r from-indigo-500/40 to-emerald-400/30 blur-3xl"
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-400/20 blur-[160px]"
        animate={{ opacity: [0.2, 0.35, 0.2], scale: [1.05, 0.95, 1.05] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 flex items-center justify-center px-6 py-16">
        <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
        className={`w-full max-w-lg rounded-3xl border p-10 shadow-2xl shadow-indigo-500/10 backdrop-blur-sm transition hover:shadow-indigo-500/20 ${cardClass}`}
        >
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">{active.badge}</p>
          <motion.h1
          key={role}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.42, 0, 0.58, 1] }}
          className="mt-3 text-3xl font-semibold"
          >
          {active.heading}
          </motion.h1>
          <motion.p
          key={`${role}-copy`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.42, 0, 0.58, 1] }}
          className={`mt-2 text-sm ${mutedText}`}
          >
          {active.subcopy}
          </motion.p>
        </div>

        <div className={`mb-6 flex items-center gap-2 rounded-2xl border p-1 ${isDark ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-slate-50"}`}>
          {(
          [
            { label: "Teacher", value: "teacher" as const, Icon: Book },
            { label: "Student", value: "student" as const, Icon: GraduationCap },
          ]
          ).map(({ label, value, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={`flex w-1/2 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition ${
            role === value
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
              : "text-slate-400"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
          <label className={`block text-xs font-semibold uppercase tracking-[0.3em] ${mutedText}`}>
            Email
          </label>
          <input
            type="email"
            aria-label={`${role} email`}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={active.placeholder}
            required
            className={`${inputClass} mt-1`}
          />
          </div>
          <div>
          <div className="flex items-center justify-between">
            <label className={`text-xs font-semibold uppercase tracking-[0.3em] ${mutedText}`}>
            Password
            </label>
            <Link href={active.forgotHref} className={`text-xs ${accentLink}`}>
            Forgot?
            </Link>
          </div>
          <input
            type="password"
            aria-label={`${role} password`}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            className={`${inputClass} mt-1`}
          />
          </div>
          <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 font-semibold text-white shadow-md transition hover:from-indigo-500 hover:to-indigo-700"
          >
          {active.buttonLabel}
          </motion.button>
        </form>

        <p className={`mt-6 text-center text-sm ${mutedText}`}>
          Don’t have an account?{" "}
          <Link href={active.signupHref} className={`font-medium ${accentLink}`}>
          Create one →
          </Link>
        </p>
        </motion.div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
