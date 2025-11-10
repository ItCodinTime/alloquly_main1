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

export function Navbar() {
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
              href="/login"
              className={`transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isDark ? "text-slate-200 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className={`rounded-full border px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isDark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-slate-200 text-slate-900 hover:bg-slate-100"
              }`}
            >
              Sign up
            </Link>
            <a
              href="#pilot"
              className={`rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 ${
                isDark
                  ? "bg-white/90 text-slate-900 hover:bg-white focus-visible:ring-offset-slate-900"
                  : "bg-slate-900 text-white hover:bg-black focus-visible:ring-offset-white"
              }`}
              aria-label={copy.ctas.primary}
            >
              {copy.ctas.primary}
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              className={`rounded-full border px-2.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isDark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {isDark ? "Light" : "Dark"}
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
                  href="/login"
                  className={`rounded-full border px-4 py-2 text-center ${
                    isDark ? "border-white/10 text-white" : "border-slate-200 text-slate-800"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className={`rounded-full border px-4 py-2 text-center ${
                    isDark ? "border-white/20 text-white" : "border-slate-200 text-slate-900"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
                <a
                  href="#pilot"
                  className={`rounded-full px-4 py-2 text-center ${
                    isDark ? "bg-white text-slate-900" : "bg-slate-900 text-white"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {copy.ctas.primary}
                </a>
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
