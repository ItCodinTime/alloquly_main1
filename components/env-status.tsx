"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type ConfigResponse = { hasAIKey: boolean };

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Config response parse error", error);
    return null;
  }
}

export default function EnvStatus() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/" || pathname?.startsWith("/auth")) return;
    async function load() {
      try {
        const res = await fetch("/api/config", { cache: "no-store" });
        const data = await safeJson<ConfigResponse>(res);
        setHasKey(Boolean(data?.hasAIKey));
      } catch (error) {
        setHasKey(false);
        console.error("Unable to read config status", error);
      }
    }
    load();
  }, [pathname]);

  if (hasKey === null) return null;
  if (pathname === "/" || pathname?.startsWith("/auth")) return null;

  const tone = hasKey
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${tone}`}>
      {hasKey ? (
        <span className="font-semibold">AI key detected.</span>
      ) : (
        <span className="font-semibold">AI key missing.</span>
      )}{" "}
      {hasKey
        ? "Live remodels are enabled."
        : "Using cached/mocked outputs until ALLOQULY_AI_API_KEY is set in Vercel env vars."}
    </div>
  );
}
