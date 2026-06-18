import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err, id } from "@/lib/api/helpers";
import { MOCK_PRODUCTS } from "@/lib/api/mock-data";

// TODO: real DB lookup by _id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = MOCK_PRODUCTS.find((p) => p._id === id);
    if (!product) return err("Product not found", 404);
    return ok(product);
  } catch (e) {
    return err((e as Error).message);
  }
}

// TODO: real update - validate ownership, persist changes
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const product = MOCK_PRODUCTS.find((p) => p._id === id);
    if (!product) return err("Product not found", 404);

    const body = await req.json();
    return ok({ ...product, ...body, _id: product._id });
  } catch (e) {
    return err((e as Error).message);
  }
}

// TODO: real delete - remove from DB, verify ownership
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const product = MOCK_PRODUCTS.find((p) => p._id === id);
    if (!product) return err("Product not found", 404);

    return ok({ message: "Product deleted" });
  } catch (e) {
    return err((e as Error).message);
  }
}
