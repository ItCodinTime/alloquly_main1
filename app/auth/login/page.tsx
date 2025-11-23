"use client";

import { useEffect, useState } from "react";

export default function LoginPage() {
  return <LoginForm />;
}

function LoginForm() {
  const [redirectTo, setRedirectTo] = useState("/assignments");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get("redirectTo");
    if (redirectParam) setRedirectTo(redirectParam);
    const errorParam = params.get("error");
    if (errorParam) {
      setError(errorParam);
      setLoading(false);
    }
  }, []);

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error("Supabase URL missing. Check NEXT_PUBLIC_SUPABASE_URL.");
      }

      const authUrl = new URL(`${supabaseUrl}/auth/v1/authorize`);
      authUrl.searchParams.set("provider", "google");
      authUrl.searchParams.set(
        "redirect_to",
        `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
      );
      authUrl.searchParams.set("access_type", "offline");
      authUrl.searchParams.set("prompt", "consent");

      window.location.href = authUrl.toString();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,.09),_transparent_55%)] blur-3xl" />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,.05),_transparent_50%)] blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur sm:p-12">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-zinc-400">
            <span className="rounded-full border border-white/20 px-4 py-1 text-white">Alloquly</span>
            <span>Secure login</span>
          </div>

          <h1 className="mt-8 text-3xl text-white sm:text-4xl">Welcome to your neuroinclusive assignment studio</h1>

          <p className="mt-4 text-zinc-400">
            Sign in with your school Gmail to access assignments, student rosters, and AI insights.
          </p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-white bg-white px-6 py-4 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? "Connecting..." : "Continue with Google"}
          </button>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-300/40 bg-red-300/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

          <div className="mt-8 rounded-2xl border border-dashed border-white/20 p-4 text-xs text-zinc-400">
            <p className="font-semibold text-white">Secure by design</p>
            <ul className="mt-2 space-y-1">
              <li>• OAuth 2.0 with Google Workspace</li>
              <li>• No passwords stored</li>
              <li>• Session tokens rotate automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
