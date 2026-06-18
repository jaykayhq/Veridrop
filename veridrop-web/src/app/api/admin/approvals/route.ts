// TODO: Replace mock data with real database queries
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_USERS, delay } from "@/lib/api/mock-data";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "admin") return err("Forbidden", 403);

    const users = MOCK_USERS.filter(
      (u) => u.status === "pending" || u.status === "review"
    );

    const sanitized = users.map((u) => {
      const { password, ...rest } = u as Record<string, unknown>;
      return rest;
    });

    await delay();
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

    const user = MOCK_USERS.find((u) => u._id === userId);
    if (!user) return err("User not found", 404);

    // TODO: real approval update with database
    const updated = {
      ...user,
      status: action === "approve" ? "active" : "rejected",
      kycStatus: action === "approve" ? "active" : "rejected",
    };
    const { password, ...sanitized } = updated as Record<string, unknown>;

    await delay();
    return ok(sanitized);
  } catch (e) {
    return err((e as Error).message);
  }
}
