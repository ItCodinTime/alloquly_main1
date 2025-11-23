import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/auth/login", "/auth/callback"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isPublic = PUBLIC_PATHS.some((path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path)
  );
  const isOnboardingPath = pathname.startsWith("/onboarding");

  if (!isPublic && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (session) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role,is_onboarded")
      .eq("id", session.user.id)
      .maybeSingle();

    if ((!profile || !profile.is_onboarded) && !isOnboardingPath) {
      const onboardingUrl = req.nextUrl.clone();
      onboardingUrl.pathname = "/onboarding";
      return NextResponse.redirect(onboardingUrl);
    }

    if (profile?.is_onboarded && isOnboardingPath) {
      const destination = profile.role === "student" ? "/student/dashboard" : "/teacher/dashboard";
      const target = req.nextUrl.clone();
      target.pathname = destination;
      return NextResponse.redirect(target);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
