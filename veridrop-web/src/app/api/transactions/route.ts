import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { Order, User } from "@/lib/api/types";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "admin") return err("Forbidden", 403);

    const orders = (await db.orders.find({})) as Order[];

    const enriched = await Promise.all(
      orders.map(async (o) => {
        const [buyer, vendor] = await Promise.all([
          db.users.findOne({ _id: o.buyerId }) as Promise<User | null>,
          db.users.findOne({ _id: o.vendorId }) as Promise<User | null>,
        ]);
        return { ...o, buyerName: buyer?.name || "Unknown", vendorName: vendor?.name || "Unknown" };
      })
    );

    return ok(enriched);
  } catch (e) {
    return err((e as Error).message);
  }
}
