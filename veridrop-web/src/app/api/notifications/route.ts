import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err, id } from "@/lib/api/helpers";
import { MOCK_NOTIFICATIONS } from "@/lib/api/mock-data";

// TODO: real notifications - query from DB, add pagination
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || auth.userId;
    const notifications = MOCK_NOTIFICATIONS.filter((n) => n.userId === userId);
    return ok(notifications);
  } catch (e) {
    return err((e as Error).message);
  }
}

// TODO: real creation - persist to DB, trigger push notification
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const body = await req.json();
    const notification = {
      _id: `not_${id()}`,
      userId: body.userId || auth.userId,
      title: body.title || "",
      message: body.message || "",
      type: body.type || "system",
      read: false,
      createdAt: new Date().toISOString(),
    };
    return ok(notification);
  } catch (e) {
    return err((e as Error).message);
  }
}
