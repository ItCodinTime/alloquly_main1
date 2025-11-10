"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingDecor } from "@/components/ambient/FloatingDecor";

export default function TeacherLoginPage() {
  return (
    <ThemeProvider>
      <TeacherLoginContent />
    </ThemeProvider>
  );
}

function TeacherLoginContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student">("teacher");

  const roleConfig = useMemo(
    () => ({
      teacher: {
        badge: "Teacher Portal",
        heading: "Alloqly Teacher Login",
        description: "Securely access lesson adaptations, accommodations, and class dashboards.",
        emailPlaceholder: "you@district.edu",
        signupHref: "/teacher/signup",
        forgotHref: "/teacher/forgot",
        buttonText: "Login as Teacher",
      },
      student: {
        badge: "Student Hub",
        heading: "Alloqly Student Login",
        description: "Sign in to view adapted assignments, supports, and teacher feedback.",
        emailPlaceholder: "you@student.edu",
        signupHref: "/student/signup",
        forgotHref: "/student/forgot",
        buttonText: "Login as Student",
      },
    }),
    []
  );

  const activeRole = roleConfig[selectedRole];

  const backgroundClass = isDark
    ? "bg-[linear-gradient(180deg,_rgba(6,12,31,1)_0%,_rgba(9,17,36,1)_35%,_rgba(18,29,60,1)_65%,_rgba(36,47,94,1)_100%)] text-slate-50"
    : "bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900";

  const cardClass = isDark
    ? "bg-slate-900/70 border-white/10 text-white"
    : "bg-white border-gray-200 text-slate-900";

  const labelClass = isDark ? "text-slate-200" : "text-gray-700";
  const inputClass = isDark
    ? "w-full rounded-md border border-white/20 bg-white/5 p-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    : "w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const mutedText = isDark ? "text-slate-400" : "text-gray-500";
  const linkAccent = isDark ? "text-indigo-200 hover:text-indigo-100" : "text-indigo-600 hover:text-indigo-700";
  const toggleWrapper = isDark
    ? "border-white/10 bg-white/5"
    : "border-slate-200 bg-white/90";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ email, password });
    // TODO: Integrate Supabase or backend auth here.
  };

  return (
    <div className={`flex min-h-screen flex-col transition-colors duration-300 ${backgroundClass}`}>
      <Navbar />
      <main className="relative flex-1 overflow-hidden">
        <FloatingDecor />
        <div className="relative z-10 flex items-center justify-center px-6 py-16">
          <div className={`w-full max-w-md rounded-2xl border p-8 shadow-2xl backdrop-blur ${cardClass}`}>
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">{activeRole.badge}</p>
              <h1 className="mt-2 text-3xl font-semibold">{activeRole.heading}</h1>
              <p className={`mt-2 text-sm ${mutedText}`}>{activeRole.description}</p>
            </div>
            <div className={`mb-6 flex gap-2 rounded-full border p-1 text-sm ${toggleWrapper}`}>
              {["teacher", "student"].map((roleOption) => (
                <button
                  key={roleOption}
                  type="button"
                  onClick={() => setSelectedRole(roleOption as "teacher" | "student")}
                  className={`flex-1 rounded-full px-4 py-2 capitalize transition ${
                    selectedRole === roleOption
                      ? isDark
                        ? "bg-indigo-500 text-white shadow"
                        : "bg-white text-indigo-600 shadow"
                      : isDark
                      ? "text-slate-300"
                      : "text-slate-500"
                  }`}
                >
                  {roleOption}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="teacher-email" className={`block text-sm font-medium ${labelClass}`}>
                  Email
                </label>
                <input
                  id="teacher-email"
                  type="email"
                  aria-label={`${selectedRole} email`}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder={activeRole.emailPlaceholder}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="teacher-password" className={`block text-sm font-medium ${labelClass}`}>
                  Password
                </label>
                <input
                  id="teacher-password"
                  type="password"
                  aria-label={`${selectedRole} password`}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder="••••••••"
                  className={inputClass}
                />
                <div className="mt-2 text-right text-xs">
                  <Link href={activeRole.forgotHref} className={linkAccent}>
                    Forgot password?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 font-semibold text-white transition hover:from-indigo-700 hover:to-indigo-800"
              >
                {activeRole.buttonText}
              </button>
            </form>
            <p className={`mt-6 text-center text-sm ${mutedText}`}>
              Don’t have an account?{" "}
              <Link href={activeRole.signupHref} className={`font-medium ${linkAccent}`}>
                Sign up →
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
