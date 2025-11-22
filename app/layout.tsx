import type { Metadata } from "next";
import EnvStatus from "@/components/env-status";
import SiteHeader from "@/components/site-header";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://alloquly.vercel.app"),
  title: "Alloquly | Neuroinclusive Assignment Studio",
  description:
    "Design assignments that adapt to ADHD, Autism, dyslexia, and every learner. Upload, rewrite, monitor progress, and get AI insights in one workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <ThemeProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-8">
            <SiteHeader />
            <EnvStatus />
            <div className="flex-1">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
