// src/app/api/auth/[...all]/route.ts
import { getAuthInstance } from "@/src/lib/auth";
import { delay } from "@/src/lib/utils-server";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    // 1. Dynamically await the full database and Better Auth instance setup
    const auth = await getAuthInstance();

    // 2. Dynamically execute the handler
    return await auth.handler(request);
  } catch (dbError) {
    return NextResponse.json({ message: `...all route.js: ${dbError.message}` }, { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    const auth = await getAuthInstance();
    
    return await auth.handler(request);
  } catch (dbError) {
    return NextResponse.json({ message: `...all route.js: ${dbError.message}` }, { status: 500 });
  }
};

// import { auth } from "@/src/lib/auth";
// import { toNextJsHandler } from "better-auth/next-js";

// // This maps all incoming auth requests (/api/auth/sign-up, login, etc.) 
// // directly to Better Auth logic
// export const { GET, POST } = toNextJsHandler(auth);