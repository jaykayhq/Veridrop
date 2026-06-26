import bcrypt from "bcryptjs";
import { db } from "./db";
import { v4 as uuid } from "uuid";

export async function seedDatabase() {
  const count = await db.users.count({});
  if (count > 0) return;

  const now = new Date().toISOString();
  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  const vendorId = uuid();
  const adminId = uuid();

  await db.users.insert([
    { _id: vendorId, email: "vendor@example.com", password: hash("password"), name: "Amara Okafor", role: "vendor", business: "GadgetHub NG", slug: "gadgethub-ng", kycStatus: "active", status: "active", createdAt: now },
    { _id: adminId, email: "admin@veridrop.com", password: hash("password"), name: "Admin User", role: "admin", kycStatus: "active", status: "active", createdAt: now },
    { _id: uuid(), email: "buyer@example.com", password: hash("password"), name: "Tunde Adebayo", role: "buyer", kycStatus: "active", status: "active", createdAt: now },
    { _id: uuid(), email: "chidi@email.com", password: hash("password"), name: "Chidi Eze", role: "inspector", kycStatus: "active", status: "active", createdAt: now },
    { _id: uuid(), email: "grace@email.com", password: hash("password"), name: "Grace Okonkwo", role: "inspector", kycStatus: "active", status: "active", createdAt: now },
    { _id: uuid(), email: "blessing@email.com", password: hash("password"), name: "Blessing John", role: "rider", kycStatus: "active", status: "active", createdAt: now },
    { _id: uuid(), email: "emeka@techplus.ng", password: hash("password"), name: "Emeka Nwosu", role: "vendor", business: "TechPlus NG", slug: "techplus-ng", kycStatus: "pending", status: "pending", createdAt: now },
    { _id: uuid(), email: "samuel@email.com", password: hash("password"), name: "Samuel Ade", role: "rider", kycStatus: "active", status: "active", createdAt: now },
    { _id: uuid(), email: "daniel@techplus.ng", password: hash("password"), name: "Daniel Musa", role: "vendor", business: "MegaFashion", slug: "megafashion", kycStatus: "pending", status: "pending", createdAt: now },
    { _id: uuid(), email: "faith@email.com", password: hash("password"), name: "Faith Peters", role: "buyer", kycStatus: "active", status: "active", createdAt: now },
  ]);

  await db.products.insert([
    { _id: uuid(), vendorId, name: "iPhone 15 Pro", category: "Electronics", price: 245000, stock: 12, description: "Latest Apple smartphone with A17 Pro chip", status: "active", sales: 34, createdAt: now },
    { _id: uuid(), vendorId, name: "MacBook Air M3", category: "Electronics", price: 520000, stock: 3, description: "Apple's thinnest laptop with M3 chip", status: "active", sales: 22, createdAt: now },
    { _id: uuid(), vendorId, name: "Samsung Galaxy S25", category: "Electronics", price: 156000, stock: 0, description: "Flagship Android smartphone", status: "inactive", sales: 41, createdAt: now },
    { _id: uuid(), vendorId, name: "iPad Pro 12.9", category: "Electronics", price: 189000, stock: 8, description: "Apple's most powerful tablet", status: "active", sales: 15, createdAt: now },
    { _id: uuid(), vendorId, name: "AirPods Pro 2", category: "Accessories", price: 45000, stock: 25, description: "Wireless earbuds with ANC", status: "active", sales: 67, createdAt: now },
    { _id: uuid(), vendorId, name: "Dell XPS 15", category: "Electronics", price: 312000, stock: 0, description: "Premium Windows laptop", status: "inactive", sales: 15, createdAt: now },
    { _id: uuid(), vendorId, name: "Gucci GG Marmont Bag", category: "Fashion", price: 89500, stock: 5, description: "Luxury handbag", status: "active", sales: 18, createdAt: now },
    { _id: uuid(), vendorId, name: "Nike Air Max 90", category: "Fashion", price: 34200, stock: 28, description: "Classic sneakers", status: "active", sales: 56, createdAt: now },
    { _id: uuid(), vendorId, name: "PS5 Digital Edition", category: "Electronics", price: 445000, stock: 4, description: "Sony gaming console", status: "active", sales: 12, createdAt: now },
  ]);

  console.log("[Seed] Database seeded with demo data");
}
