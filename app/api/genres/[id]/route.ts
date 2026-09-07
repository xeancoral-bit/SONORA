import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const genre = db.getGenreById(id) || db.getGenres().find((g) => g.slug === id);
  if (!genre) {
    return NextResponse.json({ error: 'Genre not found' }, { status: 404 });
  }

  const songs = db.getSongs().filter(
    (s) => (s.genreId === genre.id || s.genreName?.toLowerCase() === genre.name.toLowerCase()) && s.status === 'published'
  );
  const albums = db.getAlbums().filter(
    (a) => (a.genreId === genre.id || a.genreName?.toLowerCase() === genre.name.toLowerCase()) && a.status === 'published'
  );
  const genreArtistIds = new Set(songs.map((s) => s.artistId));
  const genreArtistNames = new Set(songs.map((s) => s.artistName.toLowerCase()));
  const artists = db.getArtists().filter(
    (a) => a.genreId === genre.id || genreArtistIds.has(a.id) || genreArtistNames.has(a.name.toLowerCase())
  );

  return NextResponse.json({
    genre,
    songs,
    albums,
    artists
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

  const genre = db.getGenreById(id);
  if (!genre) {
    return NextResponse.json({ error: 'Genre not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updated = {
      ...genre,
      ...body,
      id: genre.id
    };

    db.saveGenre(updated);

    db.addLog({
      id: `log-${Date.now()}`,
      adminId: user.id,
      adminName: user.name,
      action: 'Updated Genre',
      details: `Modified genre "${updated.name}"`,
      targetType: 'genre',
      targetId: updated.id,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, genre: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update genre' }, { status: 500 });
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

  const genre = db.getGenreById(id);
  if (!genre) {
    return NextResponse.json({ error: 'Genre not found' }, { status: 404 });
  }

  db.deleteGenre(id);

  db.addLog({
    id: `log-${Date.now()}`,
    adminId: user.id,
    adminName: user.name,
    action: 'Deleted Genre',
    details: `Removed genre "${genre.name}"`,
    targetType: 'genre',
    targetId: id,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ success: true, message: 'Genre deleted' });
}
