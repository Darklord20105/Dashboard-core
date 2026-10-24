// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins"; // Imported admin plugin for role-based auth
import { connectDB } from "./mongoose";
import { createAccessControl } from "better-auth/plugins/access";
import mongoose from "mongoose";

const accessControl = createAccessControl({});

export async function getAuthInstance() {
  // 1. Force Mongoose to verify network state immediately on invocation
  await connectDB();

  // 2. SAFETY SWITCH: If the network just recovered or dropped, check the actual readyState.
  // 0 = disconnected. If disconnected, wipe out any old broken cached instances.
  if (mongoose.connection.readyState === 0) {
    globalThis.betterAuthInstance = undefined;
    throw new Error("auth.js: Database connection is currently offline. Cannot initialize authentication.");
  }

  // 3. Return the cached instance ONLY if the database path is confirmed healthy
  if (globalThis.betterAuthInstance) {
    return globalThis.betterAuthInstance;
  }

  const nativeClient = mongoose.connection.getClient();
  const nativeDb = mongoose.connection.db;

  if (!nativeClient || !nativeDb) {
    throw new Error("auth.js: Mongoose connection failed to expose native database access.");
  }

  globalThis.betterAuthInstance = betterAuth({
    // 🔗 Pass the native db and client directly using the core built-in helper
    database: mongodbAdapter(nativeDb, {
      client: nativeClient
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true, //  It tells your application that the registration feature is completely shut down.
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
    // 👑 Enable the admin plugin to activate roles ("client", "admin", etc.)
    plugins: [
      admin({
        // accessControl,
        // for later when permissions is required in project
        // roles: {
        //   admin: accessControl.newRole({}),
        //   client: accessControl.newRole({})
        // },
        defaultRole: "client"
      })
    ]
  });

  return globalThis.betterAuthInstance;
}

export const auth = new Proxy({}, {
  get(target, prop, receiver) {
    // Intercepts any call to auth.* (like auth.api) and dynamically ensures instance safety
    return Reflect.get(globalThis.betterAuthInstance || {}, prop, receiver);
  }
})

// to craete an access control spreadsheet
// import { createAccessControl } from "better-auth/plugins/access";

// // 1. Map out all possible resources and actions in your app
// const statement = {
//   posts: ["create", "read", "update", "delete"],
//   billing: ["view", "manage"],
//   settings: ["read", "write"]
// } as const;

// const ac = createAccessControl(statement);

// // 2. Create a restricted role (e.g., standard user)
// const userRole = ac.newRole({
//   posts: ["create", "read"], // Can only create and read posts
//   billing: ["view"],         // Can only view billing
// });

// // 3. Create a powerful role (e.g., admin)
// const adminRole = ac.newRole({
//   posts: ["create", "read", "update", "delete"], // Full control
//   billing: ["view", "manage"],
//   settings: ["read", "write"]
// });


// to authorize something with access controll we do this in server calls
// // Better Auth handles the evaluation under the hood
// const hasAccess = auth.plugins.admin.ac.authorize(session.user.role, {
//   resource: "posts",
//   action: "delete"
// });

// an example
// import { auth } from "./auth"; // Your Better Auth instance

// export async function updatePostHandler(req: Request) {
//   // 1. Get the current active session
//   const session = await auth.api.getSession({ headers: req.headers });
  
//   if (!session) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   // 2. Extract the user's role string from the session (e.g., "user" or "admin")
//   const userRoleString = session.user.role; 

//   // 3. Use the Access Control matrix to authorize the action
//   const totalAccess = auth.plugins.admin.ac; // Access your AC instance
//   const canUpdate = totalAccess.authorize(userRoleString, {
//     resource: "posts",
//     action: "update"
//   });

//   if (!canUpdate) {
//     return new Response("Forbidden: You cannot update posts", { status: 403 });
//   }

  // 4. Proceed with your Mongoose update query safely...
// }
