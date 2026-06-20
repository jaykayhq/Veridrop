import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { User, Product } from "@/lib/api/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const vendor = (await db.users.findOne({ slug, role: "vendor" })) as User | null;
    if (!vendor) return err("Store not found", 404);

    const products = (await db.products.find({ vendorId: vendor._id, status: "active" })) as Product[];
    return ok({ store: vendor, products });
  } catch (e) {
    return err((e as Error).message);
  }
}
