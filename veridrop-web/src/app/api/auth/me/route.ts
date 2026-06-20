import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { User } from "@/lib/api/types";
import { getAuthUser } from "@/lib/api/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);
    const user = (await db.users.findOne({ _id: auth.userId })) as User | null;
    if (!user) return err("User not found", 404);
    const { password, ...safe } = user;
    return ok(safe);
  } catch (e) {
    return err((e as Error).message);
  }
}
