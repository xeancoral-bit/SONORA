import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSyncedLyricsForSong, parseLrc } from '@/lib/lyricsService';
import { SyncedLyricLine } from '@/lib/types';

function isOriginalStudioMatch(item: any, targetTitle: string): boolean {
  const trackName = (item.trackName || '').toLowerCase();
  const albumName = (item.albumName || '').toLowerCase();
  const targetLower = targetTitle.toLowerCase();

  // Strictly reject live lyrics to ensure 100% studio audio synchronization
  if (/\b(live at|live from|\(live\)|\[live\]|live concert|live session|unplugged|en vivo|live tour)\b/i.test(trackName)) return false;
  if (/\b(live at|live from|live in|unplugged|live concert)\b/i.test(albumName)) return false;

  const isTargetRemix = targetLower.includes('remix');
  if (!isTargetRemix && /\b(remix|remixes|club mix|extended mix|vip mix|sped up|slowed|nightcore)\b/i.test(trackName)) return false;
  if (!isTargetRemix && /\b(the remixes|remix ep|remixes ep)\b/i.test(albumName)) return false;

  return true;
}

function isArtistMatch(itemArtist: string, targetArtist: string): boolean {
  if (!itemArtist || !targetArtist) return false;
  const iNorm = itemArtist.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const tNorm = targetArtist.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  
  if (iNorm === tNorm) return true;
  if (iNorm.includes(tNorm) || tNorm.includes(iNorm)) {
    const wordsT = tNorm.split(/[\s,&]+/).filter((w: string) => w.length > 2);
    const wordsI = iNorm.split(/[\s,&]+/).filter((w: string) => w.length > 2);
    return wordsT.some((w: string) => wordsI.includes(w)) || wordsI.some((w: string) => wordsT.includes(w));
  }
  return false;
}

function selectBestLyricMatch(items: any[], targetTitle: string, targetArtist: string, songDuration: number): any {
  if (!Array.isArray(items) || items.length === 0) return null;

  // Filter 1: Match artist
  const artistMatchedItems = items.filter((it) => isArtistMatch(it.artistName, targetArtist));
  const candidatePool = artistMatchedItems.length > 0 ? artistMatchedItems : items;

  // Filter 2: Original studio match
  const originalItems = candidatePool.filter((it) => isOriginalStudioMatch(it, targetTitle));
  const pool = originalItems.length > 0 ? originalItems : candidatePool;

  // 1. Candidate with syncedLyrics closest to songDuration
  const syncedCandidates = pool.filter((it) => it.syncedLyrics);
  if (syncedCandidates.length > 0) {
    if (songDuration > 0) {
      syncedCandidates.sort(
        (a, b) =>
          Math.abs((a.duration || songDuration) - songDuration) -
          Math.abs((b.duration || songDuration) - songDuration)
      );
    }
    return syncedCandidates[0];
  }

  // 2. Candidate with plainLyrics closest to duration
  const plainCandidates = pool.filter((it) => it.plainLyrics);
  if (plainCandidates.length > 0) {
    if (songDuration > 0) {
      plainCandidates.sort(
        (a, b) =>
          Math.abs((a.duration || songDuration) - songDuration) -
          Math.abs((b.duration || songDuration) - songDuration)
      );
    }
    return plainCandidates[0];
  }

  return pool[0];
}

function cleanQuery(str: string): string {
  return str
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*ft\.[^,)]+/gi, '')
    .replace(/\s*\(from [^)]+\)/gi, '')
    .replace(/\s*-\s*from [^)]+/gi, '')
    .replace(/\s*\(music from [^)]+\)/gi, '')
    .replace(/\s*\(soundtrack\)/gi, '')
    .replace(/\s*\(original motion picture soundtrack\)/gi, '')
    .replace(/\s*\(taylor's version\)/gi, '')
    .replace(/\s*\(taylor’s version\)/gi, '')
    .replace(/\s*\(deluxe[^)]*\)/gi, '')
    .replace(/\s*\[deluxe[^\]]*\]/gi, '')
    .replace(/\s*\(expanded[^)]*\)/gi, '')
    .replace(/\s*\(bonus[^)]*\)/gi, '')
    .replace(/\s*\(special[^)]*\)/gi, '')
    .replace(/\s*\(platinum[^)]*\)/gi, '')
    .replace(/\s*-\s*single/gi, '')
    .replace(/\s*-\s*ep/gi, '')
    .replace(/\s*\(live[^)]*\)/gi, '')
    .replace(/\s*\[remastered[^\]]*\]/gi, '')
    .replace(/\s*\(remastered[^)]*\)/gi, '')
    .replace(/\s*\(clean\)/gi, '')
    .replace(/\s*\(explicit\)/gi, '')
    .replace(/\s*-\s*radio edit/gi, '')
    .replace(/\s*\(radio edit\)/gi, '')
    .trim();
}

/**
 * GET /api/lyrics
 *
 * Query parameters:
 *   trackId    – Primary song `id` or externalMediaId.
 *   externalId – Optional external media ID.
 *   title      – Optional song title fallback.
 *   artist     – Optional artist name fallback.
 *   album      – Optional album title.
 *   duration   – Optional duration in seconds.
 *   lang       – Language code (default: "en").
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get('trackId')?.trim();
  const externalId = searchParams.get('externalId')?.trim();
  const titleParam = searchParams.get('title')?.trim();
  const artistParam = searchParams.get('artist')?.trim();
  const albumParam = searchParams.get('album')?.trim();
  const durationParam = parseInt(searchParams.get('duration') || '0', 10);
  const lang = searchParams.get('lang')?.trim() || 'en';

  if (!trackId && !titleParam) {
    return NextResponse.json(
      { error: 'Missing required parameter: trackId or title' },
      { status: 400 }
    );
  }

  // Resolve song: by primary ID, external media ID, or title + artist match
  const allSongs = db.getSongs();
  let song =
    (trackId ? allSongs.find((s) => s.id === trackId) : undefined) ||
    (externalId ? allSongs.find((s) => s.externalMediaId === externalId) : undefined) ||
    (trackId ? allSongs.find((s) => s.externalMediaId === trackId) : undefined) ||
    null;

  if (!song && titleParam) {
    const tLower = titleParam.toLowerCase();
    const aLower = (artistParam || '').toLowerCase();
    song =
      allSongs.find(
        (s) =>
          s.title.toLowerCase() === tLower &&
          (!aLower || s.artistName.toLowerCase().includes(aLower) || aLower.includes(s.artistName.toLowerCase()))
      ) || null;
  }

  let lyrics = getSyncedLyricsForSong(song, lang);
  let resolvedPlainLyrics: string =
    typeof song?.lyrics === 'string'
      ? song.lyrics.replace(/\[\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]/g, '').trim()
      : '';

  const titleToSearch = cleanQuery(song?.title || titleParam || '');
  const rawArtist = song?.artistName || artistParam || '';
  const primaryArtist = cleanQuery(rawArtist.split(/[&,]|feat\./i)[0].trim());
  const fullCleanArtist = cleanQuery(rawArtist);
  const songDuration = song?.duration || durationParam || 210;

  // If no lyrics found in local DB, execute multi-tier LRCLIB search
  if ((!lyrics || lyrics.length === 0) && titleToSearch) {
    try {
      let lrcMatch: any = null;

      // Tier 1: Direct exact match with primary artist
      try {
        const getUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(primaryArtist)}&track_name=${encodeURIComponent(titleToSearch)}`;
        const getRes = await fetch(getUrl, {
          headers: { 'User-Agent': 'SonoraMusic/2.0' },
          signal: AbortSignal.timeout(3500)
        });
        if (getRes.ok) {
          const item = await getRes.json();
          if (isArtistMatch(item.artistName, primaryArtist) && isOriginalStudioMatch(item, titleToSearch) && (item?.syncedLyrics || item?.plainLyrics)) {
            lrcMatch = item;
          }
        }
      } catch {}

      // Tier 1b: Exact match with full artist string (e.g. "Lady Gaga & Bruno Mars", "ROSÉ & Bruno Mars")
      if (!lrcMatch && fullCleanArtist !== primaryArtist) {
        try {
          const getUrlFull = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(fullCleanArtist)}&track_name=${encodeURIComponent(titleToSearch)}`;
          const getResFull = await fetch(getUrlFull, {
            headers: { 'User-Agent': 'SonoraMusic/2.0' },
            signal: AbortSignal.timeout(3500)
          });
          if (getResFull.ok) {
            const item = await getResFull.json();
            if (item?.syncedLyrics || item?.plainLyrics) {
              lrcMatch = item;
            }
          }
        } catch {}
      }

      // Tier 2: Search with title + primary artist
      if (!lrcMatch) {
        try {
          const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${primaryArtist} ${titleToSearch}`.trim())}`;
          const searchRes = await fetch(searchUrl, {
            headers: { 'User-Agent': 'SonoraMusic/2.0' },
            signal: AbortSignal.timeout(3500)
          });
          if (searchRes.ok) {
            const items = await searchRes.json();
            if (Array.isArray(items) && items.length > 0) {
              lrcMatch = selectBestLyricMatch(items, titleToSearch, primaryArtist, songDuration);
            }
          }
        } catch {}
      }

      // Tier 3: Search with full artist + title
      if (!lrcMatch && fullCleanArtist !== primaryArtist) {
        try {
          const searchUrlFull = `https://lrclib.net/api/search?q=${encodeURIComponent(`${fullCleanArtist} ${titleToSearch}`.trim())}`;
          const searchResFull = await fetch(searchUrlFull, {
            headers: { 'User-Agent': 'SonoraMusic/2.0' },
            signal: AbortSignal.timeout(3500)
          });
          if (searchResFull.ok) {
            const items = await searchResFull.json();
            if (Array.isArray(items) && items.length > 0) {
              lrcMatch = selectBestLyricMatch(items, titleToSearch, fullCleanArtist, songDuration);
            }
          }
        } catch {}
      }

      // Tier 4: Search with album + title
      if (!lrcMatch && (albumParam || song?.albumTitle)) {
        try {
          const albumClean = cleanQuery(albumParam || song?.albumTitle || '');
          const albumSearchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${primaryArtist} ${albumClean} ${titleToSearch}`.trim())}`;
          const albumRes = await fetch(albumSearchUrl, {
            headers: { 'User-Agent': 'SonoraMusic/2.0' },
            signal: AbortSignal.timeout(3500)
          });
          if (albumRes.ok) {
            const items = await albumRes.json();
            if (Array.isArray(items) && items.length > 0) {
              lrcMatch = selectBestLyricMatch(items, titleToSearch, primaryArtist, songDuration);
            }
          }
        } catch {}
      }

      // Parse and apply matched lyrics
      if (lrcMatch) {
        let parsedLines: SyncedLyricLine[] = [];
        if (lrcMatch.syncedLyrics) {
          parsedLines = parseLrc(lrcMatch.syncedLyrics);
          resolvedPlainLyrics = lrcMatch.plainLyrics || lrcMatch.syncedLyrics.replace(/\[\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]/g, '').trim();
        } else if (lrcMatch.plainLyrics) {
          resolvedPlainLyrics = lrcMatch.plainLyrics;
          // Plain lyrics: do not fabricate fake timestamps, keep parsedLines empty so full plain lyrics are displayed
          parsedLines = [];
        } else if (lrcMatch.instrumental) {
          parsedLines = [
            { time: 0, text: '♪ Instrumental Intro ♪' },
            { time: Math.round(songDuration * 0.25), text: '♪ Melodic Flow ♪' },
            { time: Math.round(songDuration * 0.5), text: '♪ Instrumental Solo & Harmonics ♪' },
            { time: Math.round(songDuration * 0.75), text: '♪ Dynamic Build ♪' },
            { time: Math.max(0, songDuration - 15), text: '♪ Outro Fade ♪' },
          ];
          resolvedPlainLyrics = '♪ Instrumental track ♪';
        }

        if (parsedLines.length > 0) {
          lyrics = parsedLines;
          if (song) {
            song.syncedLyrics = parsedLines;
            song.lyrics = lrcMatch.plainLyrics || lrcMatch.syncedLyrics;
            // Asynchronously persist to DB without blocking the HTTP response
            Promise.resolve().then(() => {
              try { db.saveSong(song!); } catch {}
            });
          }
        } else if (resolvedPlainLyrics && song) {
          song.lyrics = resolvedPlainLyrics;
          Promise.resolve().then(() => {
            try { db.saveSong(song!); } catch {}
          });
        }
      }
    } catch {}
  }

  const hasSynced = Array.isArray(lyrics) && lyrics.length > 0;
  const hasAnyLyrics = hasSynced || (resolvedPlainLyrics && resolvedPlainLyrics.trim().length > 0);

  return NextResponse.json({
    lyrics: lyrics || [],
    plainLyrics: resolvedPlainLyrics || undefined,
    hasSynced,
    isUnavailable: !hasAnyLyrics,
    message: !hasAnyLyrics ? 'Official lyrics are not available for this track' : undefined
  });
}
