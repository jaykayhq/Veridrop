import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err, id } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { User, Order } from "@/lib/api/types";

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const orders = (await db.orders.find({})) as Order[];
  let filtered = orders;

  if (auth.role === "vendor") filtered = filtered.filter((o) => o.vendorId === auth.userId);
  else if (auth.role === "buyer") filtered = filtered.filter((o) => o.buyerId === auth.userId);
  else if (auth.role !== "admin") return err("Forbidden", 403);

  if (status) filtered = filtered.filter((o) => o.status === status);

  const enriched = await Promise.all(
    filtered.map(async (o) => {
      const [buyer, vendor] = await Promise.all([
        db.users.findOne({ _id: o.buyerId }) as Promise<User | null>,
        db.users.findOne({ _id: o.vendorId }) as Promise<User | null>,
      ]);
      return { ...o, buyerName: buyer?.name || "Unknown", vendorName: vendor?.name || "Unknown" };
    })
  );

  return ok(enriched);
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { productId, vendorId } = await req.json();
  if (!productId || !vendorId) return err("Missing productId or vendorId");

  const allProducts = (await db.products.find({})) as any[];
  const product = allProducts.find((p: any) => p._id === productId);
  if (!product) return err("Product not found", 404);

  const newOrder = {
    _id: id(),
    buyerId: auth.role === "buyer" ? auth.userId : vendorId,
    vendorId,
    productId,
    productName: product.name,
    amount: product.price,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  await db.orders.insert(newOrder);

  return ok({ order: newOrder });
}
