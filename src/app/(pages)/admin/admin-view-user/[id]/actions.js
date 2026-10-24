// src/app/admin/view/actions.js
'use server' // 🌟 CRITICAL: This tells Next.js this function only runs securely on the server

// basic user schema will mark fields that can be modified only
// banned: false     ok
// name: "kk gg" ok
// permissions: [] ok
// role: "admin" ok

import { getAuthInstance } from "@/src/lib/auth";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function adminUpdateUserDataAction({ userId, name, role, banned, permissions }) {
  const auth = await getAuthInstance();
  
  // 1. Session authorization gate check
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "src:pages:admin:update-permissions:actions.js Forbidden: Developer Admin access required." };
  }

  if (userId === session.user.id && banned === true) {
    return { 
      success: false, 
      error: "Security Constraint: You cannot lock out or ban your own administrative account." 
    };
  }

  try {
    if (!userId) return { success: false, error: "src:pages:admin:update-permissions:actions.js Missing required userId parameter." };

    const db = mongoose.connection.db;
    let targetQuery = { _id: userId };

    if (mongoose.Types.ObjectId.isValid(userId)) {
      targetQuery = {
        $or: [
          { _id: userId },
          { _id: new mongoose.Types.ObjectId(userId) }
        ]
      };
    }

    // 🔒 STRICT FIELD WHITELISTING: Only extract fields explicitly allowed to be changed
    // This prevents any extra undefined properties on the object from reaching your DB
    const updatePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (role !== undefined) updatePayload.role = role;
    if (banned !== undefined) updatePayload.banned = banned;
    if (permissions !== undefined) updatePayload.permissions = permissions;

    // Check if the filtered payload actually contains fields to modify
    if (Object.keys(updatePayload).length === 0) {
      return { success: false, error: "No modifiable fields were provided in the payload request." };
    }

    // 2. Perform the update query operation
    const updateResult = await db.collection("user").updateOne(
      targetQuery,
      { $set: updatePayload }
    );

    if (updateResult.matchedCount === 0) {
      return { success: false, error: "src:pages:admin:update-permissions:actions.js User ID not found in database." };
    }

    // 🌟 3. THE MAGIC: In a Server Action, this instantly triggers a smooth,
    // data-only re-render across your UI layout without flickering.
    revalidatePath("/admin/admin-update-permissions"); 

    return { success: true, message: "src:pages:admin:update-permissions:actions.js User privileges successfully synchronized." };

  } catch (error) {
    return { success: false, error: error.message };
  }
}
