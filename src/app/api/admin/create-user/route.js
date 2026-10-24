// src/app/api/admin/create-user/route.js
import { getAuthInstance } from "@/src/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const auth = await getAuthInstance();
  
  // 1. Fetch the active user's session
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return NextResponse.json({ error: "api:admin:create-user:route.js Unauthorized" }, { status: 401 });
  }

  const currentUserRole = session.user.role || "client";

  // ⭐ THE PERMISSION GATED SECURITY CHECK
  // The developer ("admin") can always bypass this, but anyone else MUST have the "manage:users" key

  if (currentUserRole !== "admin") {
    return NextResponse.json({ 
      error: "api:admin:create-user:route.js Forbidden: You do not have permission required to create accounts, only admin can" 
    }, { status: 403 });
  }

  try {
    const { email, password, name, role } = await request.json();

    // 🔒 SAFETY EDGE-CASE: Block non-admins from creating higher-ranking developer accounts
    if (currentUserRole !== "admin" && role === "admin") {
      return NextResponse.json({ error: "api:admin:create-user:route.js Forbidden: You cannot provision Admin developer accounts." }, { status: 403 });
    }

    // 2. Safely create the user directly through the server engine
    const newUser = await auth.api.createUser({
      body: {
        email,
        password,
        name,
        role,
      }
    });

    return NextResponse.json({ message: "api:admin:create-user:route.js Account successfully provisioned.", user: newUser });
  } catch (error) {
    return NextResponse.json({ error: `api:admin:create-user:route.js ${error.message}` }, { status: 500 });
  }
}
