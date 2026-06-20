import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { User } from "@/lib/api/types";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "admin") return err("Forbidden", 403);

    const users = (await db.users.find({ status: "pending" })) as User[];

    const sanitized = users.map((u) => {
      const { password, ...rest } = u as unknown as Record<string, unknown>;
      return rest;
    });

    return ok(sanitized);
  } catch (e) {
    return err((e as Error).message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "admin") return err("Forbidden", 403);

    const { userId, action } = await req.json();
    if (!userId || !action) return err("Missing required fields: userId, action");
    if (!["approve", "reject"].includes(action)) return err("Invalid action");

    const user = (await db.users.findOne({ _id: userId })) as User | null;
    if (!user) return err("User not found", 404);

    const newStatus = action === "approve" ? "active" : "rejected";
    await db.users.update(
      { _id: userId },
      { $set: { status: newStatus, kycStatus: newStatus } }
    );

    const { password, ...sanitized } = user as unknown as Record<string, unknown>;
    return ok({ ...sanitized, status: newStatus, kycStatus: newStatus });
  } catch (e) {
    return err((e as Error).message);
  }
}
