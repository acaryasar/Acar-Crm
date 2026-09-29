import { auth } from "@/auth";
import { NextResponse } from "next/server";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/");

  if (isApi) {
    // Demo accounts (see the login page's "Demo Hesapla Görüntüle" panel)
    // are read-only: block every mutating request here, in one place,
    // instead of relying on each route to remember to check isDemo.
    // Individual routes still do their own auth()/role checks — this is
    // an extra layer specific to the demo-account restriction.
    const isDemo = Boolean(req.auth?.user?.isDemo);

    if (isDemo && MUTATING_METHODS.has(req.method)) {
      return NextResponse.json(
        { error: "Demo hesaplar salt okunurdur; bu işlem gerçekleştirilemez." },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  // Non-API pages: unauthenticated visitors go to /login (previous
  // behavior of using `auth` directly as the middleware export).
  if (!req.auth && pathname !== "/login") {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
