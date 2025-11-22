"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

interface TeacherNavbarProps {
  teacherName?: string;
}

const navLinks = [
  { href: "/teacher/dashboard", label: "Dashboard" },
  { href: "/teacher/classes", label: "Classes" },
  { href: "/assignments", label: "AI Tools" },
  { href: "/insights", label: "Insights" },
  { href: "/profile", label: "Settings" },
];

export function TeacherNavbar({ teacherName }: TeacherNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const displayName = teacherName ?? "Teacher";

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <header className="bg-slate-900/90 border-b border-white/10 backdrop-blur-md text-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-base font-semibold">
            A
          </div>
          <div>
            <p className="text-lg font-semibold">Alloqly Admin</p>
            <p className="text-xs text-slate-300">Teacher Experience</p>
          </div>
        </div>
        <nav className="hidden items-center gap-4 text-sm text-slate-300 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1 transition ${
                pathname.startsWith(link.href) ? "bg-white/10 text-white" : "hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white transition hover:bg-white/10 disabled:opacity-60"
          >
            {loggingOut ? "..." : "Logout"}
          </button>
        </nav>
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-full border border-white/20 px-4 py-1 text-sm text-slate-200 transition hover:bg-white/5"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
            {displayName.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-semibold">{displayName}</p>
            <p className="text-xs text-slate-400">View profile</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
