import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_USERS } from "@/lib/api/mock-data";

// TODO: real settings - fetch vendor profile from DB
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const user = MOCK_USERS.find((u) => u._id === auth.userId);
    if (!user) return err("User not found", 404);

    return ok(user);
  } catch (e) {
    return err((e as Error).message);
  }
}

// TODO: real update - persist changes to DB, check slug uniqueness
export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const body = await req.json();
    return ok({ message: "Settings updated", updates: body });
  } catch (e) {
    return err((e as Error).message);
  }
}
