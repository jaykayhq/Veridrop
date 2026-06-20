import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/api/db';
import { signToken } from '@/lib/api/auth';
import type { AuthPayload } from '@/lib/api/types';
import { v4 as uuid } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await db.users.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const normalizedRole = role.toLowerCase();
    const now = new Date().toISOString();
    const userId = uuid();

    await db.users.insert({
      _id: userId,
      email,
      password: bcrypt.hashSync(password, 10),
      name,
      role: normalizedRole,
      business: normalizedRole === 'vendor' ? name : undefined,
      slug: normalizedRole === 'vendor' ? name.toLowerCase().replace(/\s+/g, '-') : undefined,
      kycStatus: 'pending',
      status: 'pending',
      createdAt: now,
    });

    const token = signToken({
      userId,
      email,
      role: normalizedRole as AuthPayload['role'],
    });

    const response = NextResponse.json({
      success: true,
      data: { token, user: { id: userId, email, name, role: normalizedRole } },
    });

    response.cookies.set("veridrop_token", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

