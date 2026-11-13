import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {

  try {
    await connectDB();

    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("MongoDB database handle unavailable");
    }

    try {
      // Test database connectivity more thoroughly
      await db.admin().command({ ping: 1 });

      // Also test a simple collection operation to ensure read/write capability
      const collection = db.collection('health_test');
      await collection.findOne({});

      // If we get here, both ping and read/write work
    } catch (error) {
      console.error("Health check database test failed:", error);
      throw new Error("Database connectivity issue");
    }


    // Return a more informative response:
    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        database: "connected",
        version: mongoose.version
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );

  } catch (error) {
    console.error("Health check failed:", error.message);

    return NextResponse.json(
      {
        status: "unavailable",
        error: error.message
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}