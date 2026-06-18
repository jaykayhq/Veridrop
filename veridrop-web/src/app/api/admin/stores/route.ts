// TODO: Replace mock data with real database queries
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_USERS, MOCK_PRODUCTS, delay } from "@/lib/api/mock-data";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "admin") return err("Forbidden", 403);

    const vendors = MOCK_USERS.filter((u) => u.role === "vendor");

    const stores = vendors.map((v) => {
      const products = MOCK_PRODUCTS.filter((p) => p.vendorId === v._id);
      const activeProducts = products.filter((p) => p.status === "active");
      const { password, ...info } = v as Record<string, unknown>;
      return {
        ...info,
        totalProducts: products.length,
        activeProducts: activeProducts.length,
      };
    });

    await delay();
    return ok(stores);
  } catch (e) {
    return err((e as Error).message);
  }
}
