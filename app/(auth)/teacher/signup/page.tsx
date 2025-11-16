"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingDecor } from "@/components/ambient/FloatingDecor";

export default function TeacherSignupPage() {
  return (
    <ThemeProvider>
      <TeacherSignupContent />
    </ThemeProvider>
  );
}

function TeacherSignupContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [roleSubject, setRoleSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("Grade Level");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const backgroundClass = isDark
    ? "bg-[linear-gradient(180deg,_rgba(6,12,31,1)_0%,_rgba(9,17,36,1)_35%,_rgba(18,29,60,1)_65%,_rgba(36,47,94,1)_100%)] text-slate-50"
    : "bg-gradient-to-br from-indigo-50 via-white to-slate-50 text-slate-900";

  const cardClass = isDark
    ? "bg-slate-950/80 border-white/10 text-white"
    : "bg-white border-slate-200 text-slate-900";

  const inputClass = isDark
    ? "w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    : "w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const accentLink = isDark ? "text-indigo-200 hover:text-indigo-100" : "text-indigo-600 hover:text-indigo-700";

  const gradeOptions = [
    "Grade Level",
    "Pre-K",
    "K-2",
    "3-5",
    "6-8",
    "9-12",
    "District / Multi-grade",
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ firstName, lastName, email, schoolName, roleSubject, gradeLevel, password, confirmPassword, agree });
    // TODO: integrate signup backend
  };

  return (
    <div className={`flex min-h-screen flex-col transition-colors duration-300 ${backgroundClass}`}>
      <Navbar />
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
            className={`w-full max-w-2xl rounded-3xl border p-10 shadow-2xl shadow-indigo-500/10 backdrop-blur-sm ${cardClass}`}
          >
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Create Teacher Account</p>
              <h1 className="mt-3 text-3xl font-semibold">Join Alloqly to create personalized learning experiences</h1>
              <p className={`mt-2 text-sm ${mutedText}`}>
                Build accessible lessons, monitor progress, and collaborate with families from one workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-[0.3em] ${mutedText}`}>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Jordan"
                    required
                    className={`${inputClass} mt-1`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-[0.3em] ${mutedText}`}>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Lewis"
                    required
                    className={`${inputClass} mt-1`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs font-semibold uppercase tracking-[0.3em] ${mutedText}`}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Use your school email if you have one"
                  required
                  className={`${inputClass} mt-1`}
                />
              </div>

              <div>
                <label className={`text-xs font-semibold uppercase tracking-[0.3em] ${mutedText}`}>School Name</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(event) => setSchoolName(event.target.value)}
                  placeholder="Washington Academy"
                  className={`${inputClass} mt-1`}
                />
              </div>

              <div>
                <label className={`text-xs font-semibold uppercase tracking-[0.3em] ${mutedText}`}>Role / Subject</label>
                <input
                  type="text"
                  value={roleSubject}
                  onChange={(event) => setRoleSubject(event.target.value)}
                  placeholder="E.g., 3rd Grade Teacher, Math Specialist"
                  className={`${inputClass} mt-1`}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-[0.3em] ${mutedText}`}>Grade Level</label>
                  <select
                    value={gradeLevel}
                    onChange={(event) => setGradeLevel(event.target.value)}
                    className={`${inputClass} mt-1 appearance-none bg-transparent`}
                  >
                    {gradeOptions.map((option) => (
                      <option key={option} value={option} className="text-slate-900">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-[0.3em] ${mutedText}`}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a strong password"
                    required
                    className={`${inputClass} mt-1`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-[0.3em] ${mutedText}`}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter password"
                    required
                    className={`${inputClass} mt-1`}
                  />
                </div>
              </div>

              <label className={`flex items-start gap-3 text-sm ${mutedText}`}>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(event) => setAgree(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  required
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className={accentLink}>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className={accentLink}>
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 font-semibold text-white shadow-md transition hover:from-indigo-500 hover:to-indigo-700"
              >
                Create Teacher Account
              </motion.button>
            </form>

            <p className={`mt-6 text-center text-sm ${mutedText}`}>
              Already have an account?{" "}
              <Link href="/teacher/login" className={`font-medium ${accentLink}`}>
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
