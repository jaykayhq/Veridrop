import { NextRequest } from "next/server";
import { signToken } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_USERS } from "@/lib/api/mock-data";

// TODO: real registration - create user in DB, hash password
export async function POST(req: NextRequest) {
  try {
    const mockUser = MOCK_USERS.find((u) => u.role === "vendor")!;
    const token = signToken({ userId: mockUser._id, email: mockUser.email, role: mockUser.role as "vendor" | "buyer" | "inspector" | "rider" | "admin" });
    return ok({ user: mockUser, token });
  } catch (e) {
    return err((e as Error).message);
  }
}
