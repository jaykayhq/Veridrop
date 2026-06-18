// TODO: Replace mock data with real DB queries (PostgreSQL via Prisma)
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err, id } from "@/lib/api/helpers";
import { MOCK_ORDERS, MOCK_PRODUCTS, MOCK_USERS, MOCK_ESCROWS } from "@/lib/api/mock-data";

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let orders = MOCK_ORDERS;

  if (auth.role === "vendor") orders = orders.filter((o) => o.vendorId === auth.userId);
  else if (auth.role === "buyer") orders = orders.filter((o) => o.buyerId === auth.userId);
  else if (auth.role !== "admin") return err("Forbidden", 403);

  if (status) orders = orders.filter((o) => o.status === status);

  const enriched = orders.map((o) => {
    const buyer = MOCK_USERS.find((u) => u._id === o.buyerId);
    const vendor = MOCK_USERS.find((u) => u._id === o.vendorId);
    return { ...o, buyerName: buyer?.name || "Unknown", vendorName: vendor?.name || "Unknown" };
  });

  return ok(enriched);
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { productId, vendorId } = await req.json();
  if (!productId || !vendorId) return err("Missing productId or vendorId");

  const product = MOCK_PRODUCTS.find((p) => p._id === productId);
  if (!product) return err("Product not found", 404);

  // TODO: real order creation + escrow lock
  const mockOrder = {
    _id: id(),
    buyerId: auth.role === "buyer" ? auth.userId : vendorId,
    vendorId,
    productId,
    productName: product.name,
    amount: product.price,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const mockEscrow = {
    _id: id(),
    orderId: mockOrder._id,
    amount: product.price,
    status: "locked",
    buyerId: auth.userId,
    vendorId,
    createdAt: new Date().toISOString(),
  };

  return ok({ order: mockOrder, escrow: mockEscrow });
}
