import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import EnvStatus from "@/components/env-status";
import SiteHeader from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-6 sm:px-8">
          <SiteHeader />
          <EnvStatus />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
