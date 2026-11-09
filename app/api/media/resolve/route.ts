import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

const memoryCache = new Map<string, string>();

interface VideoCandidate {
  id: string;
  title: string;
  channel: string;
  durationText?: string;
  durationSec?: number;
}

function normalizeStr(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function parseDurationText(text?: string): number {
  if (!text) return 0;
  const parts = text.split(':').map((p) => parseInt(p, 10));
  if (parts.some(isNaN)) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function extractCandidatesFromHtml(html: string): VideoCandidate[] {
  const candidates: VideoCandidate[] = [];

  // 1. Try parsing ytInitialData JSON object
  try {
    const match = html.match(/var ytInitialData\s*=\s*({.+?});<\/script>/);
    if (match && match[1]) {
      const data = JSON.parse(match[1]);
      const contents =
        data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
      if (Array.isArray(contents)) {
        for (const section of contents) {
          const items = section?.itemSectionRenderer?.contents;
          if (Array.isArray(items)) {
            for (const item of items) {
              const v = item.videoRenderer;
              if (v && v.videoId) {
                const title = v.title?.runs?.[0]?.text || v.title?.simpleText || '';
                const channel = v.ownerText?.runs?.[0]?.text || '';
                const durationText = v.lengthText?.simpleText || '';
                candidates.push({
                  id: v.videoId,
                  title,
                  channel,
                  durationText,
                  durationSec: parseDurationText(durationText),
                });
              }
            }
          }
        }
      }
    }
  } catch {}

  // 2. Fallback regex extraction if JSON parse failed or empty
  if (candidates.length === 0) {
    const videoRegex = /"videoId":"([A-Za-z0-9_-]{11})".*?"title":\{"runs":\[\{"text":"([^"]+)"\}\]\}.*?"ownerText":\{"runs":\[\{"text":"([^"]+)"\}\]\}/g;
    let match: RegExpExecArray | null;
    let count = 0;
    while ((match = videoRegex.exec(html)) !== null && count < 15) {
      candidates.push({
        id: match[1],
        title: match[2],
        channel: match[3],
        durationSec: 0,
      });
      count++;
    }
  }

  // 3. Absolute fallback: simple video ID match
  if (candidates.length === 0) {
    const idMatch = html.match(/"videoId":"([A-Za-z0-9_-]{11})"/);
    if (idMatch && idMatch[1]) {
      candidates.push({
        id: idMatch[1],
        title: 'Unknown Title',
        channel: 'Unknown Channel',
      });
    }
  }

  return candidates;
}

function scoreCandidate(
  c: VideoCandidate,
  rawArtist: string,
  targetTitle: string,
  targetDurationSec: number = 0
): number {
  const titleNorm = normalizeStr(c.title);
  const channelNorm = normalizeStr(c.channel);
  const targetTitleNorm = normalizeStr(targetTitle);

  // Split artist into individual names (e.g. "ROSÉ & Bruno Mars" -> ["rose", "bruno mars"])
  const artistParts = rawArtist
    .split(/&|feat\.|ft\.|,|with/i)
    .map(p => normalizeStr(p))
    .filter(p => p.length > 0);

  const isOriginalRemix = targetTitleNorm.includes('remix');
  const isOriginalLive = targetTitleNorm.includes('live');
  const isOriginalAcoustic = targetTitleNorm.includes('acoustic');

  // STRICT DISQUALIFICATION: Non-original & Non-studio variations (strictly NO live audio, NO remixes, NO covers)
  if (/\b(live|en vivo|live at|live from|\(live\)|\[live\]|live concert|live tour|live session|acoustic live|unplugged|live lounge)\b/i.test(titleNorm)) {
    return -999;
  }
  if (!isOriginalRemix && /\b(remix|remixes|club mix|extended mix|vip mix|mashup|sped up|slowed|reverb|nightcore|8d audio)\b/i.test(titleNorm)) {
    return -999;
  }
  if (!isOriginalAcoustic && /\b(acoustic version|unplugged)\b/i.test(titleNorm)) {
    return -500;
  }
  if (/\b(cover|karaoke|instrumental|reaction|guitar tutorial|piano tutorial|snippet|preview|teaser|tiktok|clean edit|radio edit|censored|interview|commentary)\b/i.test(titleNorm)) {
    return -999;
  }

  // MANDATORY SONG TITLE MATCH: Video title must match the requested soundtrack
  const cleanCandidateTitle = titleNorm.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const cleanTarget = targetTitleNorm.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  const targetWords = cleanTarget
    .split(/\s+/)
    .filter(w => w.length > 0 && !['the', 'a', 'an', 'and', 'or', 'to', 'in', 'of', 'with', 'feat', 'ft'].includes(w));

  const candidateWords = new Set(cleanCandidateTitle.split(/\s+/));

  let matchedWordCount = 0;
  for (const w of targetWords) {
    if (candidateWords.has(w)) {
      matchedWordCount++;
    }
  }

  const wordMatchRatio = targetWords.length > 0 ? matchedWordCount / targetWords.length : 1;
  const exactPhraseMatch = cleanCandidateTitle.includes(cleanTarget);

  // DISQUALIFY: If the video title does not match the target song title, reject it immediately
  // (strictly prevents "Youth" from ever being selected when the song is "There for You", or "Embarrassingly" for "Seventeen")
  if (!exactPhraseMatch && wordMatchRatio < 0.75) {
    return -999;
  }

  // MANDATORY ARTIST MATCH: Artist must appear in channel name or video title
  const isArtistInChannel = artistParts.some(p => channelNorm.includes(p) || p.includes(channelNorm));
  const isArtistInTitle = artistParts.some(p => cleanCandidateTitle.includes(p));
  if (!isArtistInChannel && !isArtistInTitle) {
    return -999;
  }

  let score = 0;

  // REWARD: Title match
  if (exactPhraseMatch) {
    score += 400;
  } else {
    score += Math.round(wordMatchRatio * 250);
  }

  // REWARD 1: Official Topic Channel (YouTube Music Studio Master provided directly by record labels)
  if (channelNorm.includes('topic')) {
    const isTopicMatch = artistParts.some(p => channelNorm.includes(p));
    if (isTopicMatch) score += 200;
  }

  // REWARD 2: Verified Artist Official Channel (matches any of the participating artists)
  const isArtistChannel = artistParts.some(p => channelNorm === p || channelNorm.includes(p));
  if (isArtistChannel) {
    score += 150;
  }

  // REWARD 3: Official Release Badges in Title
  if (titleNorm.includes('official audio')) {
    score += 90;
  } else if (titleNorm.includes('official lyric video') || titleNorm.includes('lyric video')) {
    score += 70;
  } else if (titleNorm.includes('official video') || titleNorm.includes('official music video')) {
    score += 65;
  }

  // REWARD 4: Duration consistency with studio recording
  if (targetDurationSec > 0 && c.durationSec && c.durationSec > 0) {
    const diff = Math.abs(c.durationSec - targetDurationSec);
    if (diff <= 5) score += 60;
    else if (diff <= 15) score += 30;
    else if (diff > 45) score -= 150;
  }

  return score;
}

async function searchYouTubeCandidates(searchQuery: string): Promise<VideoCandidate[]> {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(8500),
    });
    if (res.ok) {
      const html = await res.text();
      return extractCandidatesFromHtml(html);
    }
  } catch {}
  return [];
}

export async function GET(req: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const artist = (searchParams.get('artist') || '').trim();
    const title = (searchParams.get('title') || '').trim();
    const songId = (searchParams.get('songId') || '').trim();
    const album = (searchParams.get('album') || '').trim();
    const isrc = (searchParams.get('isrc') || '').trim();
    const durationParam = parseInt(searchParams.get('duration') || '0', 10);

    if (!artist && !title) {
      return NextResponse.json({ error: 'Artist and title are required' }, { status: 400 });
    }

    const cacheKey = `${artist.toLowerCase()}:::${title.toLowerCase()}`;
    if (memoryCache.has(cacheKey)) {
      return NextResponse.json({
        success: true,
        videoId: memoryCache.get(cacheKey),
        source: 'cache',
      });
    }

    // Target duration from song metadata
    let targetDuration = durationParam;
    const existingSong = songId ? db.getSongById(songId) : null;
    if (existingSong && existingSong.duration && !targetDuration) {
      targetDuration = existingSong.duration;
    }

    // Clean title for studio audio matching
    const cleanT = title
      .replace(/\s*\(feat\.[^)]+\)/gi, '')
      .replace(/\s*\(with[^)]+\)/gi, '')
      .replace(/\s*ft\.[^,)]+/gi, '')
      .trim();

    const cleanAlbum = album ? album.replace(/\s*\(.*?\)/g, '').trim() : '';

    // Try primary official studio recording search queries (strictly including artist)
    const queriesToTry = [
      `${artist} ${cleanT} Topic`,
      `${artist} ${cleanT} official audio`,
      `${artist} ${cleanT} official studio audio`,
      `${cleanT} by ${artist} official`,
    ];
    if (cleanAlbum && (cleanAlbum.toLowerCase().includes('soundtrack') || cleanAlbum.toLowerCase().includes('ost'))) {
      queriesToTry.unshift(`${artist} ${cleanT} ${cleanAlbum} official soundtrack`);
    } else if (isrc) {
      queriesToTry.unshift(`${artist} ${cleanT} ${isrc}`);
    }

    let candidates: VideoCandidate[] = [];
    for (const q of queriesToTry) {
      candidates = await searchYouTubeCandidates(q);
      if (candidates.length > 0) break;
    }

    // Score candidates to guarantee original studio version
    let bestCandidate: VideoCandidate | null = null;
    let highestScore = -9999;

    for (const c of candidates) {
      const score = scoreCandidate(c, artist, cleanT, targetDuration);
      if (score > highestScore) {
        highestScore = score;
        bestCandidate = c;
      }
    }

    // STRICT: Only accept candidate if verified studio match (score >= 200)
    const videoId = (highestScore >= 200 && bestCandidate?.id) ? bestCandidate.id : null;

    if (videoId) {
      memoryCache.set(cacheKey, videoId);

      // Update database in background if songId provided and high-confidence match
      if (songId && highestScore >= 350) {
        try {
          const song = db.getSongById(songId);
          if (song) {
            song.externalMediaId = videoId;
            song.sourcePlatform = 'youtube';
            if (!song.audioUrl || song.audioUrl.includes('youtube.com')) {
              song.audioUrl = `https://www.youtube.com/watch?v=${videoId}`;
            }
            song.isUnavailable = false;
            db.saveSong(song);
          }
        } catch {}
      }

      return NextResponse.json({
        success: true,
        videoId,
        source: 'youtube',
        verifiedStudioRecording: highestScore > 0,
        matchedTitle: bestCandidate?.title,
        channel: bestCandidate?.channel,
      });
    }

    // If YouTube lookup was unavailable but song has audioUrl / audioPath in DB, return success with direct audio
    if (existingSong && (existingSong.audioPath || existingSong.audioUrl)) {
      return NextResponse.json({
        success: true,
        audioUrl: existingSong.audioPath || existingSong.audioUrl,
        source: 'direct',
        isUnavailable: false,
      });
    }

    return NextResponse.json({
      success: true,
      audioUrl: existingSong?.audioUrl || '',
      source: 'fallback',
      isUnavailable: false,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Resolve failed' },
      { status: 500 }
    );
  }
}

