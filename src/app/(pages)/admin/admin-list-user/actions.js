// src/app/admin/admin-list-user/actions.js
'use server'

import { getAuthInstance } from "@/src/lib/auth";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function addNewUserAction({ name, email, password, role }) {
  const auth = await getAuthInstance();

  // 1. Session authorization gate check
  const session = await auth.api.getSession({
    headers: await headers()
  });


  if (!session || session.user.role !== "admin") {
    return { success: false, error: "src:pages:admin:admin-list-user:actions.js Forbidden: Developer Admin access required." };
  }

  try {
    const newUser = await auth.api.createUser({
      body: {
        email,
        password,
        name,
        role,
      }
    });

    revalidatePath("/admin/admin-list-user");

    return {
      success: true,
      message: "src:pages:admin:admin-list-user:actions.js Account successfully provisioned.",
      user: newUser
    };

  } catch (error) {
    return {
      success: false,
      error: `actions:admin:create-user ${error.message}`
    };
  }

}


export async function deleteUserAction(targetUserId) {
  const auth = await getAuthInstance();

  // 1. SECURITY SECURITY CHECK: Verify the current session is an admin
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "src:pages:admin:admin-list-users:actions.js Forbidden: Developer Admin access required." };
  }

  // 2. ROOT PROTECTION: Stop an admin from accidentally deleting their own active profile account!
  if (session.user.id === targetUserId) {
    return { success: false, error: "src:pages:admin:admin-list-user:actions.js: Self-Destruction Denied: You cannot delete your own active admin account." };
  }

  try {
    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return { success: false, error: "src:pages:admin:admin-list-user:actions.js Invalid target user selection identifier format." };
    }

    const db = mongoose.connection.db;

    // 3. EXECUTE TARGET PURGE REMOVAL:
    // Better Auth stores data in the "user" collection. 
    // We clean up records matching either the string hash primitive or the Mongoose BSON ObjectId wrapper.
    const deleteResult = await db.collection("user").deleteOne({
      $or: [
        { _id: targetUserId },
        { _id: new mongoose.Types.ObjectId(targetUserId) }
      ]
    });

    if (deleteResult.deletedCount === 0) {
      return { success: false, error: "src:pages:admin:admin-list-user:actions.js: User profile row could not be found or was already removed." };
    }

    // 🌟 4. TRIGGER THE AUTOMATIC LIVE SYNC REFRESH:
    // This wipes Next.js's router cache memory space for this page route. 
    // It instantly re-triggers getInitialUsers() to load your fresh updated array 
    // directly through your custom hook right onto the screen!
    revalidatePath("/admin/admin-list-user");

    return { success: true, message: "src:pages:admin:admin-list-user:actions.js: User account is removed from system database registry." };

  } catch (error) {
    console.error("src:pages:admin:admin-list-user:actions.js: Administrative Delete Failure:", error);
    return { success: false, error: error.message || "src:pages:admin:admin-list-user:actions.js: Failed to drop user registry row." };
  }
}

/**
 * Permanently bans or suspends a target user account
 */
export async function banUserAction(targetUserId, reason = "Violation of system terms") {
  const auth = await getAuthInstance();

  // 1. SECURITY SECURITY CHECK: Verify the current session is an admin or owner
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "src:pages:admin:admin-list-users:actions.js Forbidden: Administrative session required." };
  }

  // 2. ROOT PROTECTION: Prevent an admin from accidentally banning themselves
  if (session.user.id === targetUserId) {
    return { success: false, error: "src:pages:admin:admin-list-users:actions.js Self-Suspension Denied: You cannot lock your own active admin account." };
  }

  try {
    // 3. EXECUTE THE NATIVE BETTER AUTH BAN ROUTINE:
    // This flags the user row in MongoDB AND instantly destroys all active sessions, 
    // kicking the banned user off the application immediately.
    await auth.api.banUser({
      headers: await headers(),
      body: {
        userId: targetUserId,
        banReason: reason, // Optional parameter saved in audit records
      }
    });

    // 🌟 4. TRIGGER THE AUTOMATIC LIVE SYNC REFRESH:
    revalidatePath("/admin/update-permissions");

    return { success: true, message: "src:pages:admin:admin-list-user:actions.js: User account has been successfully suspended." };

  } catch (error) {
    console.error("src:pages:admin:admin-list-user:actions.js: Administrative Ban Failure:", error);
    return { success: false, error: error.message || "src:pages:admin:admin-list-user:actions.js: Failed to execute account suspension." };
  }
}

/**
 * Re-activates a previously suspended user account
 */
export async function unbanUserAction(targetUserId) {
  const auth = await getAuthInstance();

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "src:pages:admin:admin-list-users:actions.js Forbidden: Administrative session required." };
  }

  try {
    // Execute native Better Auth unban API routine
    await auth.api.unbanUser({
      headers: await headers(),
      body: {
        userId: targetUserId
      }
    });

    revalidatePath("/admin/admin-list-user");

    return { success: true, message: "src:pages:admin:admin-list-user:actions.js: User account access privileges fully restored." };

  } catch (error) {
    console.error("src:pages:admin:admin-list-user:actions.js: Administrative Unban Failure:", error);
    return { success: false, error: error.message || "src:pages:admin:admin-list-user:actions.js: Failed to lift account suspension." };
  }
}
