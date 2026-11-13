import { getAuthInstance } from "@/lib/auth";
import { NextResponse } from "next/server";

async function handler(request: Request) {

  try {
    const auth = await getAuthInstance();
    return await auth.handler(request);
  } catch (error) {
    console.error("Better Auth initialization failed:", error);

    return NextResponse.json(
      { message: "Authentication service unavailable" },
      { status: 503 }
    );
  }
}

export const GET = handler;
export const POST = handler;

// import { auth } from "@/src/lib/auth";
// import { toNextJsHandler } from "better-auth/next-js";

// // This maps all incoming auth requests (/api/auth/sign-up, login, etc.) 
// // directly to Better Auth logic
// export const { GET, POST } = toNextJsHandler(auth);