import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { User } from "@/lib/api/types";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "admin") return err("Forbidden", 403);

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    let users = (await db.users.find({})) as User[];
    if (role) users = users.filter((u) => u.role === role);
    if (status) users = users.filter((u) => u.status === status);

    const sanitized = users.map((u) => {
      const { password, ...rest } = u as unknown as Record<string, unknown>;
      return rest;
    });

    return ok(sanitized);
  } catch (e) {
    return err((e as Error).message);
  }
}
