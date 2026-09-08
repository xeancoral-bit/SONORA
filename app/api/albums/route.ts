import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Album } from '@/lib/types';

export async function GET(request: NextRequest) {
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

  // Populate song count and total duration
  const allSongs = db.getSongs();
  const enhancedAlbums = albums.map((album) => {
    const albumSongs = allSongs.filter(
      (s) => (album.songIds && album.songIds.includes(s.id)) || s.albumId === album.id
    );
    const totalDuration = albumSongs.reduce((acc, s) => acc + (s.duration || 0), 0);
    return {
      ...album,
      songCount: albumSongs.length,
      totalDuration
    };
  });

  return NextResponse.json({ albums: enhancedAlbums });
}

export async function POST(request: NextRequest) {
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
