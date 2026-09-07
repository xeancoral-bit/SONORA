import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  if (!q) {
    return NextResponse.json({
      songs: [],
      artists: [],
      albums: [],
      playlists: [],
      genres: []
    });
  }

  const songs = db.getSongs().filter(
    (s) =>
      s.status === 'published' &&
      (s.title.toLowerCase().includes(q) ||
        s.artistName.toLowerCase().includes(q) ||
        s.genreName.toLowerCase().includes(q) ||
        s.tags?.some((t) => t.toLowerCase().includes(q)) ||
        s.albumTitle?.toLowerCase().includes(q))
  );

  const artists = db.getArtists().filter(
    (a) => a.name.toLowerCase().includes(q) || a.bio.toLowerCase().includes(q) || a.genreName?.toLowerCase().includes(q)
  );

  const albums = db.getAlbums().filter(
    (a) =>
      a.status === 'published' &&
      (a.title.toLowerCase().includes(q) || a.artistName.toLowerCase().includes(q) || a.genreName.toLowerCase().includes(q))
  );

  const playlists = db.getPlaylists().filter(
    (p) => p.isPublic && (p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
  );

  const genres = db.getGenres().filter(
    (g) => g.name.toLowerCase().includes(q) || g.description?.toLowerCase().includes(q)
  );

  return NextResponse.json({
    query: q,
    songs: songs.slice(0, 20),
    artists: artists.slice(0, 10),
    albums: albums.slice(0, 10),
    playlists: playlists.slice(0, 10),
    genres: genres.slice(0, 10)
  });
}
