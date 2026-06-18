import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err, id } from "@/lib/api/helpers";
import { MOCK_PRODUCTS } from "@/lib/api/mock-data";

// TODO: real product listing with DB pagination, search, filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorId");
    let products = MOCK_PRODUCTS;
    if (vendorId) products = products.filter((p) => p.vendorId === vendorId);
    return ok(products);
  } catch (e) {
    return err((e as Error).message);
  }
}

// TODO: real creation - persist to DB, handle image upload
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const body = await req.json();
    const product = {
      _id: `prd_${id()}`,
      vendorId: auth.userId,
      name: body.name || "",
      category: body.category || "",
      price: body.price || 0,
      stock: body.stock ?? 0,
      description: body.description || "",
      status: "active" as const,
      sales: 0,
      createdAt: new Date().toISOString(),
    };
    return ok(product);
  } catch (e) {
    return err((e as Error).message);
  }
}
