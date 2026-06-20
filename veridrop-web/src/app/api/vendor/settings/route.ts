import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { User } from "@/lib/api/types";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const user = (await db.users.findOne({ _id: auth.userId })) as User | null;
    if (!user) return err("User not found", 404);

    return ok(user);
  } catch (e) {
    return err((e as Error).message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const body = await req.json();
    const updateFields: Record<string, unknown> = {};
    if (body.business) updateFields.business = body.business;
    if (body.slug) updateFields.slug = body.slug;
    if (body.name) updateFields.name = body.name;
    if (body.description) updateFields.description = body.description;

    if (Object.keys(updateFields).length > 0) {
      await db.users.update({ _id: auth.userId }, { $set: updateFields });
    }

    return ok({ message: "Settings updated", updates: body });
  } catch (e) {
    return err((e as Error).message);
  }
}
