import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Force Node runtime so server env vars are available.
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/assignments";

  if (code) {
    try {
      // Fallback to public anon details if envs are missing at runtime (anon key is safe to expose).
      const supabaseUrl =
        process.env.SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        "https://plbvcqtnfhfxalybtxjy.supabase.co";
      const supabaseAnonKey =
        process.env.SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYnZjcXRuZmhmeGFseWJ0eGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTk0MjksImV4cCI6MjA3ODk5NTQyOX0.82Z7gVf28CEBmrdO4vx5NsS76WDO0GuvQjsRYOazxDI";

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Supabase env missing in callback", {
          supabaseUrl: Boolean(supabaseUrl),
          supabaseAnonKey: Boolean(supabaseAnonKey),
        });
        const loginUrl = new URL("/auth/login", requestUrl.origin);
        loginUrl.searchParams.set("error", "Supabase credentials missing on server.");
        if (redirectTo) loginUrl.searchParams.set("redirectTo", redirectTo);
        return NextResponse.redirect(loginUrl);
      }

      console.info("Callback env check", {
        supabaseUrl,
        supabaseAnonKeyPrefix: supabaseAnonKey.slice(0, 8),
      });

      const supabase = createRouteHandlerClient(
        { cookies },
        { supabaseUrl, supabaseKey: supabaseAnonKey },
      );
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Supabase auth exchange error:", error);
        const loginUrl = new URL("/auth/login", requestUrl.origin);
        loginUrl.searchParams.set("error", error.message || "Unable to complete sign in.");
        if (redirectTo) loginUrl.searchParams.set("redirectTo", redirectTo);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error("Supabase auth exchange exception:", error);
      const loginUrl = new URL("/auth/login", requestUrl.origin);
      const message =
        error instanceof Error ? error.message : typeof error === "string" ? error : "Unexpected error during sign in.";
      loginUrl.searchParams.set("error", message);
      if (redirectTo) loginUrl.searchParams.set("redirectTo", redirectTo);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}
