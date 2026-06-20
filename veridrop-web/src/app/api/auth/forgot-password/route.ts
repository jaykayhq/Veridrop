import { NextResponse } from 'next/server';
import { db } from '@/lib/api/db';
import { v4 as uuid } from 'uuid';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.users.findOne({ email }) as any;
    if (!user) {
      return NextResponse.json({ error: 'No account found with that email' }, { status: 404 });
    }

    const token = uuid();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

    await db.passwordResets.insert({
      userId: user._id,
      token,
      expiresAt,
      used: false,
      createdAt: now.toISOString(),
    });

    const resetUrl = `${request.headers.get('origin') || 'http://localhost:3000'}/reset-password?token=${token}`;

    return NextResponse.json({ success: true, data: { resetUrl, message: 'Password reset link generated' } });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
