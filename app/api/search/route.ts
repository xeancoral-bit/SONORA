import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

function normalizeStr(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export async function GET(request: NextRequest) {
  await initDb();
  const { searchParams } = new URL(request.url);
  const rawQ = searchParams.get('q') || '';
  const q = normalizeStr(rawQ);
  const limitParam = searchParams.get('limit');
  const songLimit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10)), 1000) : 500;

  if (!q) {
    return NextResponse.json({
      query: '',
      songs: [],
      artists: [],
      albums: [],
      playlists: [],
      genres: [],
      suggestions: [],
      topResult: null
    });
  }

  const queryWords = q.split(/\s+/).filter((w) => w.length > 0);

  // 1. Search and Rank Artists
  const allArtists = db.getArtists();
  const matchedArtists = allArtists
    .map((a) => {
      const nameNorm = normalizeStr(a.name);
      let score = 0;

      if (nameNorm === q) score += 300;
      else if (nameNorm.startsWith(q)) score += 180;
      else if (nameNorm.includes(q)) score += 100;

      // Token match bonus
      const matchesAllWords = queryWords.every((w) => nameNorm.includes(w));
      if (matchesAllWords) score += 80;

      if (a.genreName && normalizeStr(a.genreName).includes(q)) score += 20;

      return { artist: a, score };
    })
    .filter((obj) => obj.score > 0)
    .sort((a, b) => b.score - a.score || (b.artist.monthlyListeners || 0) - (a.artist.monthlyListeners || 0))
    .map((obj) => obj.artist);

  // 2. Search and Rank Songs
  const allSongs = db.getSongs().filter((s) => s.status === 'published');
  const matchedSongs = allSongs
    .map((s) => {
      const titleNorm = normalizeStr(s.title);
      const artistNorm = normalizeStr(s.artistName);
      const albumNorm = normalizeStr(s.albumTitle || '');
      const fullCombo = `${artistNorm} ${titleNorm} ${albumNorm}`;
      let score = 0;

      // Exact title match
      if (titleNorm === q) score += 300;
      else if (titleNorm.startsWith(q)) score += 180;
      else if (titleNorm.includes(q)) score += 100;

      // Exact artist match
      if (artistNorm === q) score += 150;
      else if (artistNorm.startsWith(q)) score += 90;
      else if (artistNorm.includes(q)) score += 50;

      // Album match
      if (albumNorm === q) score += 80;
      else if (albumNorm.includes(q)) score += 40;

      // Multi-word composite match (e.g. "Taylor Shake It Off", "Bruno Mars APT")
      if (queryWords.length > 1) {
        const matchesAll = queryWords.every((w) => fullCombo.includes(w));
        if (matchesAll) score += 220;
      }

      // Tag match
      if (s.tags && s.tags.some((t) => normalizeStr(t).includes(q))) score += 30;

      // Bonus for popularity only if matched
      if (score > 0) {
        score += Math.min(15, Math.log10(s.playCount || 10) * 3);
      }

      return { song: s, score };
    })
    .filter((obj) => obj.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((obj) => obj.song);

  // 3. Search and Rank Albums
  const allAlbums = db.getAlbums().filter((a) => a.status === 'published');
  const matchedAlbums = allAlbums
    .map((a) => {
      const titleNorm = normalizeStr(a.title);
      const artistNorm = normalizeStr(a.artistName);
      const fullCombo = `${artistNorm} ${titleNorm}`;
      let score = 0;

      if (titleNorm === q) score += 300;
      else if (titleNorm.startsWith(q)) score += 150;
      else if (titleNorm.includes(q)) score += 80;

      if (artistNorm === q) score += 100;
      else if (artistNorm.includes(q)) score += 40;

      if (queryWords.length > 1 && queryWords.every((w) => fullCombo.includes(w))) {
        score += 150;
      }

      return { album: a, score };
    })
    .filter((obj) => obj.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((obj) => obj.album);

  // 4. Search Playlists & Genres
  const playlists = db
    .getPlaylists()
    .filter((p) => p.isPublic && (normalizeStr(p.title).includes(q) || normalizeStr(p.description || '').includes(q)))
    .slice(0, 10);

  const genres = db
    .getGenres()
    .filter((g) => normalizeStr(g.name).includes(q) || normalizeStr(g.description || '').includes(q))
    .slice(0, 10);

  // 5. Compute Top Result (Featured Banner)
  let topResult: any = null;
  if (
    matchedArtists.length > 0 &&
    (normalizeStr(matchedArtists[0].name) === q || normalizeStr(matchedArtists[0].name).startsWith(q))
  ) {
    const topArtist = matchedArtists[0];
    const artistTopTracks = allSongs
      .filter((s) => s.artistId === topArtist.id || normalizeStr(s.artistName) === normalizeStr(topArtist.name))
      .slice(0, 5);
    topResult = {
      type: 'artist',
      data: topArtist,
      tracks: artistTopTracks
    };
  } else if (matchedSongs.length > 0) {
    topResult = {
      type: 'song',
      data: matchedSongs[0]
    };
  }

  // 6. Fast instant suggestions for search auto-complete dropdown
  const suggestions = [
    ...matchedArtists.slice(0, 3).map((a) => ({
      type: 'artist' as const,
      id: a.id,
      title: a.name,
      subtitle: `${a.genreName || 'Artist'} • ${(a.followersCount || 0).toLocaleString()} followers`,
      image: a.avatar,
      url: `/artists/${a.id}`
    })),
    ...matchedSongs.slice(0, 5).map((s) => ({
      type: 'song' as const,
      id: s.id,
      title: s.title,
      subtitle: `${s.artistName} • ${s.albumTitle || 'Single'}`,
      image: s.coverImage,
      song: s
    })),
    ...matchedAlbums.slice(0, 3).map((alb) => ({
      type: 'album' as const,
      id: alb.id,
      title: alb.title,
      subtitle: `Album by ${alb.artistName}`,
      image: alb.coverImage,
      url: `/albums/${alb.id}`
    }))
  ].slice(0, 8);

  return NextResponse.json({
    query: rawQ,
    songs: matchedSongs.slice(0, songLimit),
    totalSongsCount: matchedSongs.length,
    artists: matchedArtists.slice(0, 15),
    albums: matchedAlbums.slice(0, 20),
    playlists,
    genres,
    suggestions,
    topResult
  });
}
