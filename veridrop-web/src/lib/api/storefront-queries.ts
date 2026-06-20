import { db } from "./db";
import type { User, Product } from "./types";

export async function getStoreBySlug(slug: string): Promise<User | null> {
  const users = (await db.users.find({ slug, role: "vendor" })) as User[];
  return users[0] || null;
}

export async function getStoreProducts(vendorId: string): Promise<Product[]> {
  return (await db.products.find({ vendorId, status: "active" })) as Product[];
}

export async function getStoreByVendorId(vendorId: string): Promise<User | null> {
  return (await db.users.findOne({ _id: vendorId })) as User | null;
}
