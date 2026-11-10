import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isPlaceholderOrBroken } from '@/lib/imageUtils';

const memoryCache = new Map<string, string>();

/**
 * GET /api/media/cover
 * Query parameters:
 *   artist - Artist name
 *   title  - Song or album title
 *   album  - Optional album name
 *   type   - 'song' | 'album' (default 'song')
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist')?.trim() || '';
  const title = searchParams.get('title')?.trim() || '';
  const album = searchParams.get('album')?.trim() || '';
  const type = searchParams.get('type')?.trim() || 'song';

  if (!artist && !title && !album) {
    return NextResponse.redirect(
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      { status: 302 }
    );
  }

  const cacheKey = `${artist.toLowerCase()}:::${title.toLowerCase()}:::${album.toLowerCase()}:::${type}`;
  if (memoryCache.has(cacheKey)) {
    const cachedUrl = memoryCache.get(cacheKey)!;
    return NextResponse.redirect(cachedUrl, {
      status: 302,
      headers: {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
      },
    });
  }

  // --- SPECIAL CASE: ARTIST AVATARS ---
  if (type === 'artist' && artist) {
    const cleanA = artist.toLowerCase();
    
    // Check local database first if it has a non-placeholder avatar
    const allArtists = db.getArtists();
    const localArtist = allArtists.find(a => a.name.toLowerCase() === cleanA || a.id.toLowerCase() === cleanA);
    if (localArtist?.avatar && !isPlaceholderOrBroken(localArtist.avatar)) {
      memoryCache.set(cacheKey, localArtist.avatar);
      return NextResponse.redirect(localArtist.avatar, {
        status: 302,
        headers: { 'Cache-Control': 'public, max-age=604800' },
      });
    }

    // 1. Query Wikipedia / Wikimedia Commons for official artist photograph
    try {
      const wikiQueries = [
        artist,
        artist.toLowerCase() === 'bini' ? 'Bini (group)' : null,
        artist.toLowerCase() === 'juan karlos' ? 'Juan Karlos Labajo' : null,
        artist.toLowerCase() === 'nobita' ? 'Nobita (band)' : null,
        `${artist} (singer)`,
        `${artist} (musician)`,
        `${artist} (band)`,
        `${artist} (group)`,
        `${artist} (rapper)`,
        `${artist} (duo)`,
      ].filter(Boolean) as string[];

      for (const q of wikiQueries) {
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
        const res = await fetch(wikiUrl, {
          headers: { 'User-Agent': 'SonoraMusic/2.0 (contact@sonoramusic.com)' },
          signal: AbortSignal.timeout(3500),
        });
        if (res.ok) {
          const data = await res.json();
          const desc = (data.description || '').toLowerCase();
          const isFictional = desc.includes('character') || desc.includes('fictional') || desc.includes('manga');
          if (!isFictional) {
            const img = data.originalimage?.source || data.thumbnail?.source;
            if (img && typeof img === 'string') {
              memoryCache.set(cacheKey, img);
              if (localArtist) {
                localArtist.avatar = img;
                try { db.saveArtist(localArtist); } catch {}
              }
              return NextResponse.redirect(img, {
                status: 302,
                headers: { 'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' },
              });
            }
          }
        }
      }
    } catch {}

    // 2. Query live Deezer Artist API for high-res official artist profile image
    try {
      const dzUrl = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artist)}&limit=1`;
      const dzRes = await fetch(dzUrl, { signal: AbortSignal.timeout(3500) });
      if (dzRes.ok) {
        const dzData = await dzRes.json();
        if (dzData.data && dzData.data[0]) {
          const art = dzData.data[0].picture_xl || dzData.data[0].picture_big || dzData.data[0].picture_medium;
          if (art && !isPlaceholderOrBroken(art)) {
            memoryCache.set(cacheKey, art);
            if (localArtist) {
              localArtist.avatar = art;
              try { db.saveArtist(localArtist); } catch {}
            }
            return NextResponse.redirect(art, {
              status: 302,
              headers: { 'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' },
            });
          }
        }
      }
    } catch {}

    // 3. Fallback: Query iTunes top song to get artist release artwork
    try {
      const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=song&limit=1`;
      const itRes = await fetch(itunesUrl, { signal: AbortSignal.timeout(3500) });
      if (itRes.ok) {
        const itData = await itRes.json();
        if (itData.results && itData.results[0]?.artworkUrl100) {
          const highRes = itData.results[0].artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg');
          memoryCache.set(cacheKey, highRes);
          if (localArtist) {
            localArtist.avatar = highRes;
            try { db.saveArtist(localArtist); } catch {}
          }
          return NextResponse.redirect(highRes, {
            status: 302,
            headers: { 'Cache-Control': 'public, max-age=604800' },
          });
        }
      }
    } catch {}

    // High quality music artist portrait fallback
    const defaultArtistImg = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80';
    memoryCache.set(cacheKey, defaultArtistImg);
    return NextResponse.redirect(defaultArtistImg, {
      status: 302,
      headers: { 'Cache-Control': 'public, max-age=86400' },
    });
  }

  // 1. Try local DB lookup first (if an album or song already has an image from Apple/Unsplash/Spotify)
  const cleanTitle = title.toLowerCase();
  const cleanArtist = artist.toLowerCase();

  const allSongs = db.getSongs();
  const matchingSong = allSongs.find((s) => {
    const sTitle = s.title.toLowerCase();
    const sArtist = s.artistName.toLowerCase();
    const isDzPlaceholder = s.coverImage?.includes('d41d8cd98f00b204e9800998ecf8427e');
    const isGoodImage = s.coverImage && !isDzPlaceholder && (s.coverImage.includes('mzstatic.com') || s.coverImage.includes('scdn.co') || s.coverImage.includes('unsplash.com'));
    return isGoodImage && sTitle === cleanTitle && (sArtist.includes(cleanArtist) || cleanArtist.includes(sArtist));
  });

  if (matchingSong?.coverImage) {
    memoryCache.set(cacheKey, matchingSong.coverImage);
    return NextResponse.redirect(matchingSong.coverImage, {
      status: 302,
      headers: { 'Cache-Control': 'public, max-age=604800' },
    });
  }

  // 2. Query Apple Music / iTunes Search API for official studio 1000x1000 artwork
  try {
    const cleanSearchQuery = `${artist} ${title || album}`
      .replace(/\s*\(feat\.[^)]+\)/gi, '')
      .replace(/\s*\(with[^)]+\)/gi, '')
      .replace(/\s*\(from [^)]+\)/gi, '')
      .replace(/\s*-\s*from [^)]+/gi, '')
      .replace(/\s*\(original motion picture soundtrack\)/gi, '')
      .replace(/\s*\(soundtrack\)/gi, '')
      .replace(/\s*\[deluxe[^\]]*\]/gi, '')
      .replace(/\s*\(deluxe[^)]*\)/gi, '')
      .replace(/\s*-\s*single/gi, '')
      .replace(/\s*-\s*ep/gi, '')
      .trim();

    const entity = type === 'album' ? 'album' : 'song';
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(cleanSearchQuery)}&entity=${entity}&limit=1`;

    const res = await fetch(itunesUrl, {
      headers: { 'User-Agent': 'SonoraMusic/2.0' },
      signal: AbortSignal.timeout(4500),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        const item = data.results[0];
        const rawArt = item.artworkUrl100 || item.artworkUrl60;
        if (rawArt && typeof rawArt === 'string') {
          // Upgrade to high-resolution 1000x1000
          const highResArtwork = rawArt
            .replace('100x100bb.jpg', '1000x1000bb.jpg')
            .replace('60x60bb.jpg', '1000x1000bb.jpg');

          memoryCache.set(cacheKey, highResArtwork);

          // Persist to local database to self-heal
          try {
            if (title) {
              const localSong = db.getSongs().find(s => s.title.toLowerCase() === title.toLowerCase());
              if (localSong) {
                localSong.coverImage = highResArtwork;
                db.saveSong(localSong);
              }
            }
            if (album) {
              const localAlbum = db.getAlbums().find(a => a.title.toLowerCase() === album.toLowerCase());
              if (localAlbum) {
                localAlbum.coverImage = highResArtwork;
                db.saveAlbum(localAlbum);
              }
            }
          } catch {}

          return NextResponse.redirect(highResArtwork, {
            status: 302,
            headers: {
              'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
            },
          });
        }
      }
    }
  } catch (e) {
    // Continue to fallback
  }

  // 2b. Secondary Provider: Query Deezer Search API for verified cover
  try {
    const dzQuery = `${artist} ${title || album}`.trim();
    const dzUrl = `https://api.deezer.com/search?q=${encodeURIComponent(dzQuery)}&limit=1`;
    const dzRes = await fetch(dzUrl, { signal: AbortSignal.timeout(3500) });
    if (dzRes.ok) {
      const dzData = await dzRes.json();
      if (dzData.data && dzData.data[0]) {
        const item = dzData.data[0];
        const art = item.album?.cover_xl || item.album?.cover_big || item.album?.cover_medium;
        if (art && !art.includes('d41d8cd98f00b204e9800998ecf8427e') && !art.includes('b315ca94d75039eaee4d5098ffb4e7ce')) {
          memoryCache.set(cacheKey, art);
          return NextResponse.redirect(art, {
            status: 302,
            headers: {
              'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
            },
          });
        }
      }
    }
  } catch {}

  // 3. Fallback: Find artist avatar/cover in Sonora DB
  const allArtists = db.getArtists();
  const matchedArtist = allArtists.find(
    (a) => a.name.toLowerCase() === cleanArtist || a.id.toLowerCase() === cleanArtist
  );
  if (matchedArtist?.avatar && !matchedArtist.avatar.includes('d41d8cd98f00b204e9800998ecf8427e')) {
    memoryCache.set(cacheKey, matchedArtist.avatar);
    return NextResponse.redirect(matchedArtist.avatar, {
      status: 302,
      headers: { 'Cache-Control': 'public, max-age=604800' },
    });
  }

  // 4. Default high-quality dark musical fallback
  const fallback = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
  memoryCache.set(cacheKey, fallback);
  return NextResponse.redirect(fallback, {
    status: 302,
    headers: { 'Cache-Control': 'public, max-age=86400' },
  });
}
