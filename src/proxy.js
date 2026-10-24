// Handling Role Based Auth
// middleware.js
import { NextResponse } from "next/server";
import { ROLE_LEVELS, ROUTING_AUTH_CONFIG } from "@/src/configs/role-permConfig"


export default async function proxy(request) {
  const { pathname } = request.nextUrl;
  const matchedRoute = ROUTING_AUTH_CONFIG.protectedRoutes.find(route => pathname.startsWith(route.path));

  if (!matchedRoute) return NextResponse.next();

  const sessionToken = request.cookies.get("better-auth.session_token");
  if (!sessionToken) return NextResponse.redirect(new URL(ROUTING_AUTH_CONFIG.loginRedirect, request.url));

  try {
    const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
      headers: { cookie: request.headers.get("cookie") || "" },
    });
    const session = await res.json();

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
    const isMissingRequiredPermission = matchedRoute.requiredPermission && !userPermissions.includes(matchedRoute.requiredPermission);

    // ❌ REJECTION: Block access if the user's role rank is too low OR if they lack the mandatory permission pass key!
    if (userRank < requiredRank || isMissingRequiredPermission) {
      console.log(`proxy middleaware.js: Access Denied to ${pathname} for role: ${currentUserRole}`);
      return NextResponse.redirect(new URL(ROUTING_AUTH_CONFIG.unauthorizedRedirect, request.url));
    }

  } catch (error) {
    return NextResponse.redirect(new URL(ROUTING_AUTH_CONFIG.loginRedirect, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
