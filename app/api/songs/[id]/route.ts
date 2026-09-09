import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDb();
  const { id } = await params;
  const song = db.getSongById(id);
  if (!song) {
    return NextResponse.json({ error: 'Song not found' }, { status: 404 });
  }

  // Get related songs (same genre or artist)
  const allSongs = db.getSongs().filter((s) => s.id !== id && s.status === 'published');
  const related = allSongs.filter((s) => s.genreId === song.genreId || s.artistId === song.artistId).slice(0, 6);

  // Check if current user liked it
  const user = await getCurrentUser();
  const isLiked = user ? db.isSongLiked(user.id, song.id) : false;

  return NextResponse.json({
    song,
    relatedSongs: related,
    isLiked
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDb();
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const song = db.getSongById(id);
  if (!song) {
    return NextResponse.json({ error: 'Song not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    
    // Resolve artist
    let artistId = body.artistId || song.artistId;
    let artistName = body.artistName !== undefined ? body.artistName.trim() : song.artistName;
    
    if (artistName && artistName !== song.artistName) {
      let matchedArtist = db.getArtistById(artistId);
      if (!matchedArtist || matchedArtist.name.toLowerCase() !== artistName.toLowerCase()) {
        matchedArtist = db.getArtists().find((a) => a.name.toLowerCase() === artistName.toLowerCase());
      }
      if (!matchedArtist) {
        // Create new artist
        const newArtist = {
          id: `artist-${Date.now()}`,
          name: artistName,
          avatar: body.coverImage || song.coverImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
          banner: body.coverImage || song.coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
          bio: `${artistName} is an official artist on SONORA.`,
          country: 'Global',
          genreId: body.genreId || song.genreId,
          genreName: body.genreName || song.genreName,
          monthlyListeners: 35000,
          followersCount: 1200,
          isVerified: true,
          isFeatured: Boolean(body.isFeatured),
          socialLinks: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db.saveArtist(newArtist);
        artistId = newArtist.id;
      } else {
        artistId = matchedArtist.id;
      }
    }

    // Resolve genre
    let genreId = body.genreId || song.genreId;
    let genreName = body.genreName || song.genreName;
    if (body.genreId) {
      const g = db.getGenreById(body.genreId);
      if (g) {
        genreId = g.id;
        genreName = g.name;
      }
    }

    const updated = {
      ...song,
      ...body,
      artistId,
      artistName,
      genreId,
      genreName,
      id: song.id, // Immutable ID
      originalFilename: song.originalFilename, // Keep original filename intact per requirement
      updatedAt: new Date().toISOString()
    };

    db.saveSong(updated);

    db.addLog({
      id: `log-${Date.now()}`,
      adminId: user.id,
      adminName: user.name,
      action: 'Updated Song',
      details: `Modified metadata for "${updated.title}"`,
      targetType: 'song',
      targetId: updated.id,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, song: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update song' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const song = db.getSongById(id);
  if (!song) {
    return NextResponse.json({ error: 'Song not found' }, { status: 404 });
  }

  db.deleteSong(id);

  db.addLog({
    id: `log-${Date.now()}`,
    adminId: user.id,
    adminName: user.name,
    action: 'Deleted Song',
    details: `Permanently removed song "${song.title}" (${song.artistName})`,
    targetType: 'song',
    targetId: id,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ success: true, message: 'Song deleted successfully' });
}
