import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/assignments";

  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies: () => cookies() });
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
