import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sanitizeUser } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const cleanUsername = username.replace(/^@/, '').toLowerCase();
    const user = db.getUserByUsername(cleanUsername);

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const allPlaylists = db.getUserPlaylists(user.id);
    const publicPlaylists = allPlaylists.filter((p) => p.isPublic);

    return NextResponse.json({
      user: sanitizeUser(user),
      playlists: publicPlaylists,
      stats: {
        playlistsCount: publicPlaylists.length,
        favoriteGenres: user.favoriteGenres || []
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
