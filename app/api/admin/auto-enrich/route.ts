import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { SyncedLyricLine } from '@/lib/types';
import { autoGenerateSyncedLyrics } from '@/lib/lyricsService';

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

function cleanTitle(title: string): string {
  return title
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

function cleanArtist(artist: string): string {
  return artist
    .replace(/&.*/, '')
    .replace(/feat\..*/i, '')
    .replace(/ft\..*/i, '')
    .replace(/,\s*.*/, '')
    .trim();
}

async function fetchLyrics(artist: string, title: string, durationSec: number = 180): Promise<{ synced: SyncedLyricLine[]; plain: string } | null> {
  const cTitle = cleanTitle(title);
  const cArtist = cleanArtist(artist);

  try {
    const getUrl = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cTitle)}&artist_name=${encodeURIComponent(cArtist)}`;
    const res = await fetch(getUrl, {
      headers: { 'User-Agent': 'SonoraMusic/2.0' },
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.syncedLyrics) {
        return {
          synced: parseLrc(data.syncedLyrics),
          plain: data.plainLyrics || data.syncedLyrics,
        };
      }
      if (data.plainLyrics) {
        return {
          synced: autoGenerateSyncedLyrics(data.plainLyrics, durationSec),
          plain: data.plainLyrics
        };
      }
    }
  } catch {}

  try {
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${cArtist} ${cTitle}`)}`;
    const sRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'SonoraMusic/2.0' },
      signal: AbortSignal.timeout(4000)
    });
    if (sRes.ok) {
      const items = await sRes.json();
      if (Array.isArray(items) && items.length > 0) {
        const withSynced = items.find((i: any) => i.syncedLyrics);
        if (withSynced) {
          return {
            synced: parseLrc(withSynced.syncedLyrics),
            plain: withSynced.plainLyrics || withSynced.syncedLyrics,
          };
        }
        const withPlain = items.find((i: any) => i.plainLyrics);
        if (withPlain) {
          return {
            synced: autoGenerateSyncedLyrics(withPlain.plainLyrics, durationSec),
            plain: withPlain.plainLyrics
          };
        }
      }
    }
  } catch {}

  // Try title alone
  try {
    const searchUrl = `https://lrclib.net/api/search?track_name=${encodeURIComponent(cTitle)}`;
    const sRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'SonoraMusic/2.0' },
      signal: AbortSignal.timeout(4000)
    });
    if (sRes.ok) {
      const items = await sRes.json();
      if (Array.isArray(items) && items.length > 0) {
        const withSynced = items.find((i: any) => i.syncedLyrics);
        if (withSynced) {
          return {
            synced: parseLrc(withSynced.syncedLyrics),
            plain: withSynced.plainLyrics || withSynced.syncedLyrics,
          };
        }
      }
    }
  } catch {}

  return null;
}

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = parseInt(searchParams.get('limit') || '50', 10);

    const songs = db.getSongs();
    let enrichedCount = 0;
    const enrichedList: Array<{ id: string; title: string; artist: string; syncedLinesCount: number }> = [];

    // Filter tracks that lack syncedLyrics or have empty array
    const candidates = songs.filter(
      (s) => !s.syncedLyrics || s.syncedLyrics.length === 0
    );

    const batch = candidates.slice(0, limitParam);

    for (const song of batch) {
      const lyrics = await fetchLyrics(song.artistName, song.title, song.duration || 180);
      if (lyrics && (lyrics.synced.length > 0 || lyrics.plain)) {
        song.lyrics = lyrics.plain || song.lyrics;
        song.syncedLyrics = lyrics.synced;
        if (!song.multilingualLyrics) {
          song.multilingualLyrics = { en: lyrics.synced };
        } else {
          song.multilingualLyrics.en = lyrics.synced;
        }
        song.updatedAt = new Date().toISOString();
        db.saveSong(song);
        enrichedCount++;
        enrichedList.push({
          id: song.id,
          title: song.title,
          artist: song.artistName,
          syncedLinesCount: lyrics.synced.length,
        });
      }
    }

    return NextResponse.json({
      success: true,
      scannedCount: candidates.length,
      processedCount: batch.length,
      enrichedCount,
      remainingCount: Math.max(0, candidates.length - batch.length),
      enrichedList,
    });
  } catch (error: any) {
    console.error('Error in auto-enrich endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Auto-enrich failed' },
      { status: 500 }
    );
  }
}

