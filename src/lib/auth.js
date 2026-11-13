// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { connectDB } from "./mongoose";
import { createAccessControl } from "better-auth/plugins/access";
import mongoose from "mongoose";

const accessControl = createAccessControl({});

// Use a more robust singleton pattern
let authInstance = null;
let sessionCache = new Map(); // Add session cache
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getAuthInstance() {
  let isInitializing = false
  // Return cached instance if available
  if (authInstance) {
    return authInstance;
  }

  // Prevent multiple simultaneous initializations
  if (isInitializing) {
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return authInstance;
  }

  isInitializing = true;

  try {
    // 1. Force Mongoose to verify network state immediately on invocation
    await connectDB();

    // 2. SAFETY SWITCH: If the network just recovered or dropped, check the actual readyState.
    if (mongoose.connection.readyState === 0) {
      throw new Error("auth.js: Database connection is currently offline. Cannot initialize authentication.");
    }

    // 3. Return the cached instance ONLY if the database path is confirmed healthy
    if (globalThis.betterAuthInstance) {
      authInstance = globalThis.betterAuthInstance;
      isInitializing = false;
      return authInstance;
    }

    const nativeClient = mongoose.connection.getClient();
    const nativeDb = mongoose.connection.db;

    if (!nativeClient || !nativeDb) {
      throw new Error("auth.js: Mongoose connection failed to expose native database access.");
    }

    authInstance = betterAuth({
      // 🔗 Pass the native db and client directly using the core built-in helper
      database: mongodbAdapter(nativeDb, {
        client: nativeClient
      }),
      emailAndPassword: {
        enabled: true,
        disableSignUp: true,
      },
      user: {
        additionalFields: {
          role: {
            type: "string",
            defaultValue: "client",
            input: false
          }
        }
      },
      plugins: [
        admin({
          defaultRole: "client"
        })
      ],
      csrf: {
        enabled: true,
        // You can also customize the CSRF token settings
        cookie: {
          name: "better-auth.csrf-token",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict"
        },
      },
      trustedOrigins: async () => {
        const origins = ["http://localhost:3000"];

        if (process.env.NEXT_PUBLIC_APP_URL) {
          origins.push(process.env.NEXT_PUBLIC_APP_URL);
        } else if (process.env.VERCEL_URL) {
          origins.push(`https://${process.env.VERCEL_URL}`);
        }

        return origins;
      },
    });

    globalThis.betterAuthInstance = authInstance;
    isInitializing = false;
    return authInstance;

  } catch (error) {
    isInitializing = false;
    throw error;
  }
}
