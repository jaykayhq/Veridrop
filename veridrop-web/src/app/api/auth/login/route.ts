import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/api/db';
import { signToken } from '@/lib/api/auth';
import type { AuthPayload } from '@/lib/api/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    const user = await db.users.findOne({ email }) as any;
    if (!user || !bcrypt.compareSync(password, user.password) || (role && user.role !== role.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid credentials or incorrect role' },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user._id,
      email: user.email,
      role: user.role as AuthPayload['role'],
    });

    const response = NextResponse.json({
      success: true,
      data: { token, user: { id: user._id, email: user.email, name: user.name, role: user.role, storeId: null } },
    });

    response.cookies.set("veridrop_token", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
