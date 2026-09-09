import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Artist } from '@/lib/types';

export async function GET(request: NextRequest) {
  await initDb();
  const { searchParams } = new URL(request.url);
  const isFeatured = searchParams.get('featured');
  const filter = searchParams.get('filter');
  const user = await getCurrentUser();

  let artists = db.getArtists();

  const followedArtistIds = user ? new Set(db.getFollowedArtists(user.id).map((a) => a.id)) : new Set<string>();

  if (filter === 'library' || filter === 'followed') {
    if (user) {
      artists = artists.filter((a) => followedArtistIds.has(a.id));
    } else {
      artists = [];
    }
  } else if (isFeatured === 'true') {
    artists = artists.filter((a) => a.isFeatured);
  }

  // Sort by monthly listeners
  artists.sort((a, b) => (b.monthlyListeners || 0) - (a.monthlyListeners || 0));

  // Annotate with isFollowed status
  const annotatedArtists = artists.map((a) => ({
    ...a,
    isFollowed: followedArtistIds.has(a.id)
  }));

  return NextResponse.json({
    artists: annotatedArtists,
    totalCount: db.getArtists().length,
    libraryCount: followedArtistIds.size
  });
}

export async function POST(request: NextRequest) {
  await initDb();
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, avatar, banner, bio, country, genreId, genreName, isVerified, isFeatured, socialLinks } = body;

    if (!name) {
      return NextResponse.json({ error: 'Artist name is required' }, { status: 400 });
    }

    const genre = genreId ? db.getGenreById(genreId) : null;

    const newArtist: Artist = {
      id: `artist-${Date.now()}`,
      name: name.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      banner: banner || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
      bio: bio || '',
      country: country || 'Global',
      genreId: genreId || undefined,
      genreName: genre?.name || genreName || undefined,
      monthlyListeners: 1000,
      followersCount: 0,
      isVerified: Boolean(isVerified),
      isFeatured: Boolean(isFeatured),
      socialLinks: socialLinks || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.saveArtist(newArtist);

    db.addLog({
      id: `log-${Date.now()}`,
      adminId: user.id,
      adminName: user.name,
      action: 'Created Artist',
      details: `Created profile for artist "${newArtist.name}"`,
      targetType: 'artist',
      targetId: newArtist.id,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, artist: newArtist });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create artist' }, { status: 500 });
  }
}
