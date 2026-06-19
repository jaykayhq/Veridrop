/* eslint-disable */
import { NextResponse } from 'next/server';
import { createAdminClient, DATABASE_ID } from '@/lib/appwrite.server';
import { ID, Query } from 'node-appwrite';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { databases } = createAdminClient();

    // Check if user already exists
    const existingUsers = await databases.listDocuments(
      DATABASE_ID,
      'profiles',
      [Query.equal('email', email)]
    );

    if (existingUsers.total > 0) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    // Create the new user profile
    const newUser = await databases.createDocument(
      DATABASE_ID,
      'profiles',
      ID.unique(),
      {
        email,
        password, // Note: Stored in plain text matching the existing schema setup
        name,
        role,
        storeId: role === 'VENDOR' ? `store-${ID.unique()}` : null // Generate a placeholder storeId for vendors
      }
    );

    return NextResponse.json({
      user: {
        id: newUser.$id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        storeId: newUser.storeId
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

