import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_ORDERS, MOCK_USERS } from "@/lib/api/mock-data";

// TODO: real admin transaction listing with pagination, search, date filters
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "admin") return err("Forbidden", 403);

    const userMap = new Map(MOCK_USERS.map((u) => [u._id, u]));
    const enriched = MOCK_ORDERS.map((o) => ({
      ...o,
      buyerName: userMap.get(o.buyerId)?.name || "Unknown",
      vendorName: userMap.get(o.vendorId)?.name || "Unknown",
    }));

    return ok(enriched);
  } catch (e) {
    return err((e as Error).message);
  }
}
