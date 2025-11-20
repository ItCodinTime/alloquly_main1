"use client";

import { useEffect, useState } from "react";

type ConfigResponse = { hasAIKey: boolean };

export default function EnvStatus() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/config", { cache: "no-store" });
        const data = (await res.json()) as ConfigResponse;
        setHasKey(Boolean(data.hasAIKey));
      } catch (error) {
        setHasKey(false);
        console.error("Unable to read config status", error);
      }
    }
    load();
  }, []);

  if (hasKey === null) return null;

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
