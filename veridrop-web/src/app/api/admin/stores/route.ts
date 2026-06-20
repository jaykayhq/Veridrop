import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { User, Product } from "@/lib/api/types";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "admin") return err("Forbidden", 403);

    const vendors = (await db.users.find({ role: "vendor" })) as User[];
    const allProducts = (await db.products.find({})) as Product[];

    const stores = vendors.map((v) => {
      const products = allProducts.filter((p) => p.vendorId === v._id);
      const activeProducts = products.filter((p) => p.status === "active");
      const { password, ...info } = v as unknown as Record<string, unknown>;
      return {
        ...info,
        totalProducts: products.length,
        activeProducts: activeProducts.length,
      };
    });

    return ok(stores);
  } catch (e) {
    return err((e as Error).message);
  }
}
