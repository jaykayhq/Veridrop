import { NextResponse } from 'next/server';
import { createAdminClient, DATABASE_ID } from '@/lib/appwrite.server';
import { Query } from 'node-appwrite';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    const { databases } = createAdminClient();

    // Query Appwrite for user with matching email
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

    return NextResponse.json({
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
        role: user.role || 'VENDOR',
        storeId: user.storeId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
