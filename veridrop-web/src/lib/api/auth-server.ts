import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { db } from "./db";
import { redirect } from "next/navigation";
import type { User } from "./types";

export async function getAuthUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get("veridrop_token")?.value;
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    if (!payload) return null;
    return (await db.users.findOne({ _id: payload.userId })) as User | null;
  } catch { return null; }
}

export async function requireVendor(): Promise<User> {
  const user = await getAuthUser();
  if (!user || user.role !== "vendor") redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") redirect("/login");
  return user;
}
