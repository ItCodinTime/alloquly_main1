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
    ? "border-emerald-400/40 bg-emerald-300/10 text-emerald-100"
    : "border-yellow-300/40 bg-yellow-300/10 text-yellow-100";

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
