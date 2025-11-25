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
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

      const supabase = createRouteHandlerClient(
        { cookies: () => cookies() },
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
