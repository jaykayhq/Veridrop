// TODO: Replace mock data with real database queries
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_USERS, delay } from "@/lib/api/mock-data";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "admin") return err("Forbidden", 403);

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    let users = MOCK_USERS;
    if (role) users = users.filter((u) => u.role === role);
    if (status) users = users.filter((u) => u.status === status);

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
