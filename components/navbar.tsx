"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { copy } from "@/lib/copy";
import { useTheme } from "@/components/theme/ThemeProvider";
import { smoothScrollTo } from "@/lib/smoothScrollTo";

const anchorLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#privacy", label: "Privacy" },
  { href: "#faq", label: "FAQ" },
];

type NavbarProps = {
  defaultName?: string;
};

export function Navbar({ defaultName }: NavbarProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string, closeMenu?: boolean) => {
    if (href.startsWith("#")) {
      event.preventDefault();
      smoothScrollTo(href, 1400);
      if (closeMenu) setMenuOpen(false);
    }
  };

  return (
    <motion.header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? isDark
            ? "border-white/10 bg-slate-950/90 shadow-lg"
            : "border-slate-200 bg-white/90 shadow"
          : isDark
          ? "border-white/5 bg-slate-950/60"
          : "border-slate-100 bg-white/70"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Alloqly home">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-base font-semibold text-white shadow-lg shadow-indigo-500/30">
            A
          </span>
          <div>
            <p className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              {copy.brand.name}
            </p>
            <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-500"}`}>{copy.brand.tagline}</p>
            {defaultName && (
              <p className={`text-[11px] ${isDark ? "text-indigo-200" : "text-indigo-600"}`}>Hi, {defaultName}</p>
            )}
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <nav className={`flex items-center gap-2 text-sm ${isDark ? "text-slate-200" : "text-slate-600"}`}>
            {anchorLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => handleAnchorClick(event, link.href)}
                className={`relative rounded-full px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  isDark ? "hover:text-white" : "hover:text-slate-900"
                }`}
              >
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link
              href="/teacher/login"
              className={`transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isDark ? "text-slate-200 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Log in
            </Link>
            <Link
              href="/teacher/signup"
              className={`rounded-full border px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isDark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-slate-200 text-slate-900 hover:bg-slate-100"
              }`}
            >
              Sign up
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`rounded-full border p-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isDark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-slate-200 text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span className="relative flex h-6 w-6 items-center justify-center">
                <motion.span
                  key="sun-icon"
                  animate={{ opacity: isDark ? 0 : 1, rotate: isDark ? 45 : 0, scale: isDark ? 0.5 : 1 }}
                  transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
                  className="absolute"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.414 1.414M17.657 17.657l1.414 1.414M2 12h2M20 12h2M4.93 19.07l1.414-1.414M17.657 6.343l1.414-1.414" />
                  </svg>
                </motion.span>
                <motion.span
                  key="moon-icon"
                  animate={{ opacity: isDark ? 1 : 0, rotate: isDark ? 0 : -45, scale: isDark ? 1 : 0.5 }}
                  transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
                  className="absolute"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                </motion.span>
              </span>
            </button>
          </div>
        </div>

        <button
          className={`md:hidden rounded-full border p-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            isDark ? "border-white/20 text-white hover:bg-white/10" : "border-slate-200 text-slate-900 hover:bg-slate-100"
          }`}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M18 6l-12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div
              className={`mx-4 mb-4 rounded-2xl border p-4 ${
                isDark ? "border-white/10 bg-slate-900/90" : "border-slate-200 bg-white"
              }`}
            >
              <nav className={`flex flex-col gap-2 text-sm ${isDark ? "text-slate-200" : "text-slate-600"}`}>
                {anchorLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-3 py-2 transition ${
                      isDark ? "hover:bg-white/5" : "hover:bg-slate-100"
                    }`}
                    onClick={(event) => handleAnchorClick(event, link.href, true)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-3 text-sm font-semibold">
                <Link
                  href="/teacher/login"
                  className={`rounded-full border px-4 py-2 text-center ${
                    isDark ? "border-white/10 text-white" : "border-slate-200 text-slate-800"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/teacher/signup"
                  className={`rounded-full border px-4 py-2 text-center ${
                    isDark ? "border-white/20 text-white" : "border-slate-200 text-slate-900"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setMenuOpen(false);
                  }}
                  className={`rounded-full border px-4 py-2 text-center text-xs ${
                    isDark ? "border-white/20 text-white" : "border-slate-200 text-slate-700"
                  }`}
                >
                  {isDark ? "Switch to light" : "Switch to dark"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
