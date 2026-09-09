import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSyncedLyricsForSong } from '@/lib/lyricsService';

/**
 * GET /api/lyrics
 *
 * Query parameters:
 *   trackId  – The song's primary `id` or its `externalMediaId` (e.g. YouTube video ID).
 *   lang     – BCP-47 language code (default: "en").
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

  const lyrics = getSyncedLyricsForSong(song, lang);

  return NextResponse.json({ lyrics });
}
