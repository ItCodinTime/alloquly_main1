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

  return (
    <header className="sticky top-0 z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-white/10 bg-black/70 px-4 py-3 backdrop-blur">
      <div className="text-xs uppercase tracking-[0.4em] text-zinc-400">
        Alloquly
      </div>
      <nav className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
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
                  ? "border-white bg-white text-black"
                  : "border-transparent text-zinc-300 hover:border-white/30 hover:text-white"
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
            className="rounded-full border border-white/30 px-4 py-2 text-zinc-300 transition hover:border-white hover:text-white disabled:opacity-50"
          >
            {loading ? "..." : "Logout"}
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="rounded-full border border-white bg-white px-4 py-2 text-black transition hover:shadow-[0_10px_40px_rgba(255,255,255,0.15)]"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
