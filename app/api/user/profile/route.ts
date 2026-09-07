import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, sanitizeUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch user stats
  const playlists = db.getUserPlaylists(user.id);
  const collections = db.getUserCollections(user.id);
  const likedSongs = db.getLikedSongs(user.id);
  const followedArtists = db.getFollowedArtists(user.id);

  return NextResponse.json({
    user: sanitizeUser(user),
    stats: {
      playlistsCount: playlists.length,
      collectionsCount: collections.length,
      likedSongsCount: likedSongs.length,
      followedArtistsCount: followedArtists.length
    },
    playlists,
    collections,
    followedArtists
  });
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, bio, avatar, favoriteGenres, preferences } = body;

    const updated = {
      ...user,
      name: name || user.name,
      bio: bio !== undefined ? bio : user.bio,
      avatar: avatar || user.avatar,
      favoriteGenres: favoriteGenres || user.favoriteGenres,
      preferences: preferences ? { ...user.preferences, ...preferences } : user.preferences,
      updatedAt: new Date().toISOString()
    };

    db.saveUser(updated);

    return NextResponse.json({ success: true, user: sanitizeUser(updated) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}
