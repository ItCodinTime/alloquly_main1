"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

const links = [
  { href: "/", label: "Overview" },
  { href: "/assignments", label: "Assignments" },
  { href: "/students", label: "Students" },
  { href: "/insights", label: "Insights" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const isGlassy =
    pathname === "/" ||
    pathname?.startsWith("/auth") ||
    pathname === "/login";

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const headerClass = isGlassy
    ? "sticky top-0 z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-white/10 bg-slate-900/70 px-4 py-3 text-white shadow-lg backdrop-blur"
    : "sticky top-0 z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm";

  if (pathname === "/" || pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <header className={headerClass}>
      <div
        className={`text-xs uppercase tracking-[0.4em] ${
          isGlassy ? "text-zinc-300" : "text-slate-600"
        }`}
      >
        Alloquly
      </div>
      <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full border px-4 py-2 transition ${
                isActive
                  ? isGlassy
                    ? "border-white bg-white text-black"
                    : "border-indigo-200 bg-indigo-50 text-indigo-700"
                  : isGlassy
                    ? "border-transparent text-zinc-200 hover:border-white/30 hover:text-white"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        {user ? (
          <button
            onClick={handleLogout}
            disabled={loading}
            className={`rounded-full border px-4 py-2 transition disabled:opacity-50 ${
              isGlassy
                ? "border-white/30 text-zinc-200 hover:border-white hover:text-white"
                : "border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            {loading ? "..." : "Logout"}
          </button>
        ) : (
          <Link
            href="/auth/login"
            className={`rounded-full border px-4 py-2 font-medium transition ${
              isGlassy
                ? "border-white bg-white text-black hover:shadow-[0_10px_40px_rgba(255,255,255,0.15)]"
                : "border-indigo-500 bg-indigo-600 text-white hover:bg-indigo-500 hover:border-indigo-500"
            }`}
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
