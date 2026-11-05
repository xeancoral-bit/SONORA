import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Album } from '@/lib/types';

export async function GET(request: NextRequest) {
  await initDb();
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get('artistId');
  const genreId = searchParams.get('genreId');
  const isFeatured = searchParams.get('featured');

  let albums = db.getAlbums();

  if (artistId) {
    albums = albums.filter((a) => a.artistId === artistId);
  }
  if (genreId) {
    albums = albums.filter((a) => a.genreId === genreId);
  }
  if (isFeatured === 'true') {
    albums = albums.filter((a) => a.isFeatured);
  }

  // Fast O(N) indexing for song count and total duration
  const allSongs = db.getSongs();
  const songCountMap = new Map<string, number>();
  const durationMap = new Map<string, number>();

  for (const s of allSongs) {
    if (s.albumId) {
      songCountMap.set(s.albumId, (songCountMap.get(s.albumId) || 0) + 1);
      durationMap.set(s.albumId, (durationMap.get(s.albumId) || 0) + (s.duration || 0));
    }
  }

  const enhancedAlbums = albums.map((album) => {
    const songCount = songCountMap.get(album.id) || (album.songIds ? album.songIds.length : 0);
    const totalDuration = durationMap.get(album.id) || 0;
    return {
      ...album,
      songCount,
      totalDuration
    };
  });

  return NextResponse.json({ albums: enhancedAlbums });
}

export async function POST(request: NextRequest) {
  await initDb();
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, artistId, artistName, coverImage, description, genreId, genreName, releaseDate, copyrightInfo, songIds, isFeatured, status } = body;

    if (!title || !title.trim() || !artistId) {
      return NextResponse.json({ error: 'Album title and artist are required' }, { status: 400 });
    }

    const artist = db.getArtistById(artistId);
    const genre = genreId ? db.getGenreById(genreId) : null;

    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      title: title.trim(),
      artistId,
      artistName: artist?.name || artistName || 'Unknown Artist',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      description: description || '',
      genreId: genreId || 'genre-pop',
      genreName: genre?.name || genreName || 'Pop',
      releaseDate: releaseDate || new Date().toISOString().split('T')[0],
      copyrightInfo: copyrightInfo || `© ${new Date().getFullYear()} ${artist?.name || 'Artist'}`,
      status: status || 'published',
      isFeatured: Boolean(isFeatured),
      songIds: Array.isArray(songIds) ? songIds : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.saveAlbum(newAlbum);

    db.addLog({
      id: `log-${Date.now()}`,
      adminId: user.id,
      adminName: user.name,
      action: 'Created Album',
      details: `Created new album "${newAlbum.title}" for ${newAlbum.artistName}`,
      targetType: 'album',
      targetId: newAlbum.id,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, album: newAlbum });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create album' }, { status: 500 });
  }
}
