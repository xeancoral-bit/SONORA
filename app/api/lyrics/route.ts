import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSyncedLyricsForSong } from '@/lib/lyricsService';
import { SyncedLyricLine } from '@/lib/types';

function parseLrc(lrc: string): SyncedLyricLine[] {
  if (!lrc) return [];
  const lines = lrc.split('\n');
  const result: SyncedLyricLine[] = [];
  for (const line of lines) {
    const match = line.match(/\[(\d+):(\d+(?:\.\d+)?)\](.*)/);
    if (match) {
      const min = parseInt(match[1], 10);
      const sec = parseFloat(match[2]);
      const text = match[3].trim();
      if (text) {
        result.push({ time: Math.round((min * 60 + sec) * 10) / 10, text });
      }
    }
  }
  return result;
}

function cleanQuery(str: string): string {
  return str
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*ft\.[^,)]+/gi, '')
    .trim();
}

/**
 * GET /api/lyrics
 *
 * Query parameters:
 *   trackId    – The song's primary `id` or its `externalMediaId` (e.g. YouTube video ID).
 *   externalId – Optional external media ID fallback.
 *   lang       – BCP-47 language code (default: "en").
 *
 * Returns:
 *   { lyrics: SyncedLyricLine[] }
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get('trackId')?.trim();
  const externalId = searchParams.get('externalId')?.trim();
  const lang = searchParams.get('lang')?.trim() || 'en';

  if (!trackId) {
    return NextResponse.json(
      { error: 'Missing required parameter: trackId' },
      { status: 400 }
    );
  }

  // Resolve song: primary id → externalMediaId from query → externalMediaId field match
  const allSongs = db.getSongs();
  const song =
    allSongs.find((s) => s.id === trackId) ||
    (externalId ? allSongs.find((s) => s.externalMediaId === externalId) : undefined) ||
    allSongs.find((s) => s.externalMediaId === trackId) ||
    null;

  let lyrics = getSyncedLyricsForSong(song, lang);

  // If no lyrics found in local DB and we have song title/artist, try LRCLIB dynamic search
  if ((!lyrics || lyrics.length === 0) && song && song.title) {
    try {
      const title = cleanQuery(song.title);
      const artist = cleanQuery(song.artistName || '');
      const searchRes = await fetch(
        `https://lrclib.net/api/search?q=${encodeURIComponent(`${title} ${artist}`.trim())}`,
        { next: { revalidate: 86400 } }
      );
      if (searchRes.ok) {
        const items = await searchRes.json();
        if (Array.isArray(items) && items.length > 0) {
          const match = items.find((it: any) => it.syncedLyrics) || items[0];
          if (match?.syncedLyrics) {
            const parsed = parseLrc(match.syncedLyrics);
            if (parsed.length > 0) {
              song.syncedLyrics = parsed;
              song.lyrics = match.plainLyrics || match.syncedLyrics;
              db.saveSong(song);
              lyrics = getSyncedLyricsForSong(song, lang);
            }
          }
        }
      }
    } catch {
      // Dynamic fetch failed, proceed with empty or fallback lyrics
    }
  }

  return NextResponse.json({ lyrics: lyrics || [] });
}
