import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const artist = db.getArtistById(id);
  if (!artist) {
    return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
  }

  // Get artist's popular songs
  const songs = db.getSongs().filter(
    (s) =>
      (s.artistId === artist.id || s.artistName.toLowerCase() === artist.name.toLowerCase()) &&
      s.status === 'published'
  );
  songs.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));

  // Get artist's albums
  const albums = db.getAlbums().filter(
    (a) =>
      (a.artistId === artist.id || a.artistName?.toLowerCase() === artist.name.toLowerCase()) &&
      a.status === 'published'
  );

  // Related artists (same genre)
  const relatedArtists = db.getArtists().filter((a) => a.id !== id && (a.genreId === artist.genreId || !artist.genreId)).slice(0, 5);

  // Check if current user is following
  const user = await getCurrentUser();
  const isFollowed = user ? db.isArtistFollowed(user.id, artist.id) : false;

  return NextResponse.json({
    artist,
    popularSongs: songs.slice(0, 10),
    allSongs: songs,
    albums,
    relatedArtists,
    isFollowed
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const artist = db.getArtistById(id);
  if (!artist) {
    return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updated = {
      ...artist,
      ...body,
      id: artist.id,
      updatedAt: new Date().toISOString()
    };

    db.saveArtist(updated);

    db.addLog({
      id: `log-${Date.now()}`,
      adminId: user.id,
      adminName: user.name,
      action: 'Updated Artist',
      details: `Modified profile for artist "${updated.name}"`,
      targetType: 'artist',
      targetId: updated.id,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, artist: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update artist' }, { status: 500 });
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

  const artist = db.getArtistById(id);
  if (!artist) {
    return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
  }

  db.deleteArtist(id);

  db.addLog({
    id: `log-${Date.now()}`,
    adminId: user.id,
    adminName: user.name,
    action: 'Deleted Artist',
    details: `Removed artist "${artist.name}"`,
    targetType: 'artist',
    targetId: id,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ success: true, message: 'Artist deleted' });
}
