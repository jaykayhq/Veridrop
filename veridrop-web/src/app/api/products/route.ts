import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err, id } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { Product } from "@/lib/api/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorId");
    const products = (await db.products.find({})) as Product[];
    const filtered = vendorId ? products.filter((p) => p.vendorId === vendorId) : products;
    return ok(filtered);
  } catch (e) {
    return err((e as Error).message);
  }
}

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
    await db.products.insert(product);
    return ok(product);
  } catch (e) {
    return err((e as Error).message);
  }
}
