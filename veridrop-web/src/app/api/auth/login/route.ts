import { NextResponse } from 'next/server';
import { createAdminClient, DATABASE_ID } from '@/lib/appwrite.server';
import { Query } from 'node-appwrite';
import { signToken } from '@/lib/api/auth';
import type { AuthPayload } from '@/lib/api/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    const { databases } = createAdminClient();

    const usersList = await databases.listDocuments(
      DATABASE_ID,
      'profiles',
      [
        Query.equal('email', email)
      ]
    );

    const user = usersList.documents[0];

    if (!user || user.password !== password || (role && user.role !== role)) {
      return NextResponse.json(
        { error: 'Invalid credentials or incorrect role' },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.$id,
      email: user.email,
      role: (user.role || 'VENDOR').toLowerCase() as AuthPayload['role'],
    });

    const response = NextResponse.json({
      success: true,
      data: { token, user: { id: user.$id, email: user.email, name: user.name, role: user.role, storeId: user.storeId } },
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
