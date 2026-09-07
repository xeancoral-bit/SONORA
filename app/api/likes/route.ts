import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ likedSongs: [], songs: [] });
  }

  const likedEntries = db.getLikedSongs(user.id);
  const allSongs = db.getSongs();

  const songs = likedEntries
    .map((entry) => {
      const song = allSongs.find((s) => s.id === entry.songId);
      return song ? { ...song, likedAt: entry.likedAt } : null;
    })
    .filter(Boolean);

  return NextResponse.json({
    likedSongs: likedEntries,
    songs,
    count: songs.length
  });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Please log in to like songs' }, { status: 401 });
  }

  try {
    const { songId } = await request.json();
    if (!songId) {
      return NextResponse.json({ error: 'Song ID is required' }, { status: 400 });
    }

    const song = db.getSongById(songId);
    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    const result = db.toggleLikeSong(user.id, songId);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to toggle like' }, { status: 500 });
  }
}
