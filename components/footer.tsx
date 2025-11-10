"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";

const productLinks = [
  { label: "Canvas Integration", href: "/#features" },
  { label: "OCR Accessibility", href: "/#features" },
  { label: "Teacher Dashboard", href: "/#features" },
  { label: "AI Adaptation Engine", href: "/#features" },
  { label: "Pilot Program", href: "/#pilot" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/careers" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "FERPA Compliance", href: "/ferpa" },
];

const linkBaseClasses =
  "transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded";

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const background = isDark ? "bg-[#0A0A0A] text-gray-300" : "bg-slate-100 text-slate-700";
  const panelBg = isDark ? "bg-slate-900/70 border-white/10" : "bg-white/70 backdrop-blur border-slate-200/60";
  const watermarkColor = isDark ? "text-white/10" : "text-slate-300/70";
  const headingColor = isDark ? "text-white" : "text-slate-900";
  const linkColor = isDark ? "text-gray-300" : "text-slate-600";

  const focusOffsetClass = isDark ? "focus:ring-offset-[#0A0A0A]" : "focus:ring-offset-white";

  return (
    <footer className={`relative ${background}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <span
          className={`select-none font-extrabold uppercase tracking-[0.35em] text-[7rem] leading-none md:text-[12rem] xl:text-[16rem] ${watermarkColor}`}
        >
          ALLOQLY
        </span>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className={`relative overflow-hidden rounded-xl border p-10 ${panelBg}`}>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="space-y-3 text-left">
              <p className={`text-xl font-semibold ${headingColor}`}>Alloqly</p>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                Tailored learning, everywhere students learn.
                <br />
                Built for FERPA. Canvas-ready.
              </p>
            </div>

            <div>
              <h4 className={`mb-3 text-xs font-semibold uppercase tracking-[0.3em] ${headingColor}`}>
                Products
              </h4>
              <ul className="space-y-2 text-sm">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      aria-label={link.label}
                      className={`${linkBaseClasses} ${linkColor} hover:text-indigo-400 ${focusOffsetClass}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div>
                <h4 className={`mb-3 text-xs font-semibold uppercase tracking-[0.3em] ${headingColor}`}>
                  Company
                </h4>
                <ul className="space-y-2 text-sm">
                  {companyLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        aria-label={link.label}
                        className={`${linkBaseClasses} ${linkColor} hover:text-indigo-400 ${focusOffsetClass}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className={`mb-3 text-xs font-semibold uppercase tracking-[0.3em] ${headingColor}`}>
                  Legal
                </h4>
                <ul className="space-y-2 text-sm">
                  {legalLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        aria-label={link.label}
                        className={`${linkBaseClasses} ${linkColor} hover:text-indigo-400 ${focusOffsetClass}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className={`mt-10 border-t pt-6 text-center text-sm ${isDark ? "border-white/10 text-white/60" : "border-slate-200 text-slate-500"}`}>
            &copy; 2025 Alloqly. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
