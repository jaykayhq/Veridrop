import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/api/db';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const reset = await db.passwordResets.findOne({ token, used: false }) as any;
    if (!reset) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    if (new Date(reset.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    await db.users.update({ _id: reset.userId }, { $set: { password: bcrypt.hashSync(password, 10) } });
    await db.passwordResets.update({ _id: reset._id }, { $set: { used: true } });

    return NextResponse.json({ success: true, data: { message: 'Password reset successful' } });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
