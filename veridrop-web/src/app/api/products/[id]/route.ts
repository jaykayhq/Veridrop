import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { Product } from "@/lib/api/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = (await db.products.findOne({ _id: id })) as Product | null;
    if (!product) return err("Product not found", 404);
    return ok(product);
  } catch (e) {
    return err((e as Error).message);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const product = (await db.products.findOne({ _id: id })) as Product | null;
    if (!product) return err("Product not found", 404);

    const body = await req.json();
    const updated = { ...product, ...body, _id: product._id };
    await db.products.update({ _id: id }, { $set: body });
    return ok(updated);
  } catch (e) {
    return err((e as Error).message);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const product = (await db.products.findOne({ _id: id })) as Product | null;
    if (!product) return err("Product not found", 404);

    await db.products.remove({ _id: id }, {});
    return ok({ message: "Product deleted" });
  } catch (e) {
    return err((e as Error).message);
  }
}
