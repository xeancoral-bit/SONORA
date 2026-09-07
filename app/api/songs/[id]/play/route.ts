import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const song = db.getSongById(id);
  if (!song) {
    return NextResponse.json({ error: 'Song not found' }, { status: 404 });
  }

  const user = await getCurrentUser();
  db.incrementPlayCount(id, user?.id);

  return NextResponse.json({ success: true, playCount: (song.playCount || 0) + 1 });
}
