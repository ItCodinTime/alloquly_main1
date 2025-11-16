"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getMockUser } from "@/lib/mockAuth";

interface StudentNavbarProps {
  studentName?: string;
}

const navLinks = [
  { href: "/student/dashboard", label: "Overview" },
  { href: "/student/assignments", label: "Assignments" },
  { href: "/student/supports", label: "Supports" },
];

export function StudentNavbar({ studentName }: StudentNavbarProps) {
  const pathname = usePathname();
  const mockStudent = getMockUser("student");
  const displayName = studentName ?? mockStudent.name;

  return (
    <header className="border-b border-white/10 bg-slate-900/80 text-white backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/student/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-400 text-sm font-semibold">
            A
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Student Space</p>
            <p className="text-base font-semibold text-white">Alloqly</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 text-xs font-medium text-slate-200 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1 transition ${
                pathname.startsWith(link.href) ? "bg-white/15 text-white" : "hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.4em] text-white">
            Logout
          </Link>
        </nav>
        <div className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-slate-100">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold">
            {displayName.slice(0, 2)}
          </span>
          <div>
            <p className="text-xs font-semibold leading-tight">{displayName}</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-200">Ready</p>
          </div>
        </div>
      </div>
    </header>
  );
}
