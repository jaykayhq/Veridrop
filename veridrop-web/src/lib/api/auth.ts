import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { AuthPayload } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "veridrop-dev-secret-key-change-in-production";
const JWT_EXPIRES = "7d";

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function getAuthUser(req: NextRequest): AuthPayload | null {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return verifyToken(auth.slice(7));
}

export function requireAuth(roles?: string[]) {
  return (req: NextRequest): AuthPayload | NextResponse | null => {
    const user = getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (roles && !roles.includes(user.role)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return user;
  };
}
