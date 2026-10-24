// src/app/admin/permissions/actions.js
'use server' // 🌟 CRITICAL: This tells Next.js this function only runs securely on the server

import { getAuthInstance } from "@/src/lib/auth";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function updatePermissionsAction({ userId, role, permissions }) {
  const auth = await getAuthInstance();
  
  // 1. Session authorization gate check
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "src:pages:admin:update-permissions:actions.js Forbidden: Developer Admin access required." };
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

    // 2. Perform the update query operation
    const updateResult = await db.collection("user").updateOne(
      targetQuery,
      { $set: { role, permissions } }
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
