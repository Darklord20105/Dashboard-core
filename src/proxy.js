// src/middleware.ts
import { NextResponse } from "next/server";
import { ROLE_LEVELS, ROUTING_AUTH_CONFIG } from "@/configs/role-permConfig"

function redirectToLogin(request) {
  return NextResponse.redirect(
    new URL(`/${ROUTING_AUTH_CONFIG.loginRedirect}`, request.url)
  );
}

function redirectToConnectionError(request) {
  const url = new URL("/connection-error", request.url);

  // Remember where the user was trying to go.
  url.searchParams.set(
    "returnTo",
    request.nextUrl.pathname + request.nextUrl.search
  );

  return NextResponse.redirect(url);
}

  const matchRoute = (pathname, routePath) => {
    const routeParts = pathname.split('/');
    const patternParts = routePath.split('/');

    return (
      routeParts.length === patternParts.length &&
      patternParts.every((part, index) =>
        part.startsWith(':') || part === routeParts[index]
      )
    );
  };

export default async function proxy(request) {
  const { pathname } = request.nextUrl;

  const matchedRoute = ROUTING_AUTH_CONFIG.protectedRoutes.find(route =>
    matchRoute(pathname, route.path)
  );

  if (!matchedRoute) return NextResponse.next();

  const sessionToken = request.cookies.get("better-auth.session_token");

  if (!sessionToken) {
    return redirectToLogin(request)
  }

  try {
    const res = await fetch(
      `${request.nextUrl.origin}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") || ""
        },
        cache: "no-store",
        signal: AbortSignal.timeout(10000)
      });

    // Backend/database unavailable
    if (res.status >= 500 || res.status === 429) {
      console.error(
        "Backend is unavailable during auth check",
        res.status
      );
      return redirectToConnectionError(request)
    }

    // Invalid or expired authentication.
    if (res.status === 401 || res.status === 403) {
      return redirectToLogin(request);
    }

    if (!res.ok) {
      console.error(
        "Authentication check failed with status:",
        res.status
      );

      return redirectToConnectionError(request)
    }

    const session = await res.json();

    if (!session?.user) {
      console.warn("Session user not found during auth check");
      return redirectToLogin(request)
    }

    // 1. Grab user's role and permission array out of the session
    const currentUserRole = session?.user?.role || "client";
    const userPermissions = session?.user?.permissions || []; // 👈 Your custom array!

    console.log(currentUserRole, 'current user role in server')

    // 🛠️ DEVELOPER SUPER-ADMIN BYPASS
    // If it's you (the admin), bypass all lower role restrictions and permission requirements completely!
    if (currentUserRole === "admin") {
      return NextResponse.next();
    }

    const userRank = ROLE_LEVELS[currentUserRole] || 0;
    const requiredRank = ROLE_LEVELS[matchedRoute.minRole];

    // ⭐ THE STRICT ACCESS EVALUATION FORMULA
    // Check if the route has a required permission string and whether the user is missing it
    const isMissingRequiredPermission =
      matchedRoute.requiredPermission &&
      !userPermissions.includes(matchedRoute.requiredPermission);

    // ❌ REJECTION: Block access if the user's role rank is too low OR if they lack the mandatory permission pass key!
    if (userRank < requiredRank ||
      isMissingRequiredPermission) {
      console.log(`proxy middleware.js: Access Denied to ${pathname} for role: ${currentUserRole}`);

      return NextResponse.redirect(
        new URL(`${request.nextUrl.origin}/not-found`, request.url)
      );
    }

    return NextResponse.next();

  } catch (error) {
    // Network failure: backend itself might be offline
    console.error("Proxy authentication check failed:", error);

    // More specific error handling
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error("Network error during authentication check");
      return NextResponse.redirect(
        new URL(`connection-error`, request.url)
      );
    }

    return redirectToConnectionError(request)
  }

}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
