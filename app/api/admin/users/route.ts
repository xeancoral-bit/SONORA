import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, sanitizeUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const users = db.getUsers().map((u) => sanitizeUser(u));
  return NextResponse.json({ users });
}
