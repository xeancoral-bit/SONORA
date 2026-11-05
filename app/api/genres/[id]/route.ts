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

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const sort = searchParams.get('sort') || 'popular';
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');

  let allGenreSongs = db.getSongs().filter(
    (s) => (s.genreId === genre.id || s.genreName?.toLowerCase() === genre.name.toLowerCase()) && s.status === 'published'
  );

  // Apply search filter if present
  if (search) {
    allGenreSongs = allGenreSongs.filter(
      (s) =>
        s.title.toLowerCase().includes(search) ||
        s.artistName.toLowerCase().includes(search) ||
        (s.albumTitle && s.albumTitle.toLowerCase().includes(search))
    );
  }

  // Apply sorting
  if (sort === 'newest') {
    allGenreSongs.sort((a, b) => new Date(b.releaseDate || b.createdAt).getTime() - new Date(a.releaseDate || a.createdAt).getTime());
  } else if (sort === 'title') {
    allGenreSongs.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'artist') {
    allGenreSongs.sort((a, b) => a.artistName.localeCompare(b.artistName));
  } else {
    // popular default
    allGenreSongs.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
  }

  // Cap at 999 max
  const totalSongs = Math.min(allGenreSongs.length, 999);
  const cappedSongs = allGenreSongs.slice(0, 999);

  let returnSongs = cappedSongs;
  let page = 1;
  let limit = cappedSongs.length;
  let totalPages = 1;

  if (pageParam || limitParam) {
    page = Math.max(1, parseInt(pageParam || '1', 10));
    limit = Math.min(Math.max(1, parseInt(limitParam || '60', 10)), 999);
    totalPages = Math.ceil(cappedSongs.length / limit) || 1;
    const startIndex = (page - 1) * limit;
    returnSongs = cappedSongs.slice(startIndex, startIndex + limit);
  }

  const albums = db.getAlbums().filter(
    (a) => (a.genreId === genre.id || a.genreName?.toLowerCase() === genre.name.toLowerCase()) && a.status === 'published'
  );
  const genreArtistIds = new Set(cappedSongs.map((s) => s.artistId));
  const genreArtistNames = new Set(cappedSongs.map((s) => s.artistName.toLowerCase()));
  const artists = db.getArtists().filter(
    (a) => a.genreId === genre.id || genreArtistIds.has(a.id) || genreArtistNames.has(a.name.toLowerCase())
  );

  return NextResponse.json({
    genre,
    songs: returnSongs,
    totalSongs,
    page,
    limit,
    totalPages,
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
