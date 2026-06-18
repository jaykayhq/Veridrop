import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_USERS, MOCK_PRODUCTS } from "@/lib/api/mock-data";

// TODO: real lookup - query vendor by slug from DB
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const vendor = MOCK_USERS.find((u) => u.slug === slug && u.role === "vendor");
    if (!vendor) return err("Store not found", 404);

    const products = MOCK_PRODUCTS.filter(
      (p) => p.vendorId === vendor._id && p.status === "active"
    );
    return ok({ store: vendor, products });
  } catch (e) {
    return err((e as Error).message);
  }
}
