import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ history: [] });
  }

  const historyEntries = db.getUserHistory(user.id);
  const allSongs = db.getSongs();

  const history = historyEntries
    .map((entry) => {
      const song = allSongs.find((s) => s.id === entry.songId);
      return song ? { ...song, historyId: entry.id, playedAt: entry.playedAt } : null;
    })
    .filter(Boolean);

  return NextResponse.json({ history });
}

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  db.clearUserHistory(user.id);
  return NextResponse.json({ success: true, message: 'Listening history cleared' });
}
