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
  targetDurationSec: number = 0,
  albumName: string = ''
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
  if (!exactPhraseMatch && wordMatchRatio < 0.6) {
    return -999;
  }

  // ARTIST OR SOUNDTRACK MATCH
  const isArtistInChannel = artistParts.some(p => p.length > 1 && (channelNorm.includes(p) || p.includes(channelNorm)));
  const isArtistInTitle = artistParts.some(p => p.length > 1 && cleanCandidateTitle.includes(p));

  const cleanAlbumNorm = normalizeStr(albumName).replace(/[^a-z0-9\s]/g, ' ').trim();
  const isSoundtrack = (albumName && (cleanAlbumNorm.includes('soundtrack') || cleanAlbumNorm.includes('ost'))) ||
    rawArtist.toLowerCase().includes('soundtrack') || rawArtist.toLowerCase().includes('cast');
  const isOfficialSoundtrackOrLabel = /\b(disney|watertower|starmusic|vevo|sony|milan|hollywood|universal|republic|atlantic|warner|records|soundtrack|official)\b/i.test(channelNorm);
  const isAlbumInTitle = cleanAlbumNorm.length > 3 && cleanCandidateTitle.includes(cleanAlbumNorm);

  let score = 0;

  if (!isArtistInChannel && !isArtistInTitle) {
    if ((isSoundtrack && (isOfficialSoundtrackOrLabel || isAlbumInTitle)) || isOfficialSoundtrackOrLabel) {
      score += 150;
    } else {
      return -999;
    }
  }

  // REWARD: Title match
  if (exactPhraseMatch) {
    score += 400;
  } else {
    score += Math.round(wordMatchRatio * 250);
  }

  // REWARD 1: Official Topic Channel (YouTube Music Studio Master provided directly by record labels)
  if (channelNorm.includes('topic')) {
    score += 200;
  }

  // REWARD 2: Verified Artist Official Channel (matches any of the participating artists)
  if (isArtistInChannel || isOfficialSoundtrackOrLabel) {
    score += 150;
  }

  // REWARD 3: Official Release Badges in Title
  if (titleNorm.includes('official audio') || titleNorm.includes('official soundtrack')) {
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
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const html = await res.text();
      return extractCandidatesFromHtml(html);
    }
  } catch {}
  return [];
}

async function searchItunesPreview(artist: string, title: string): Promise<{ audioUrl: string; duration?: number } | null> {
  try {
    const cleanT = title.replace(/\s*\(feat\.[^)]+\)/gi, '').replace(/\s*ft\.[^,)]+/gi, '').trim();
    const q = `${artist} ${cleanT}`;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=3`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2800) });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.results || json.results.length === 0) return null;
    const item = json.results.find((r: any) => r.previewUrl) || json.results[0];
    if (item?.previewUrl) {
      return {
        audioUrl: item.previewUrl,
        duration: Math.round((item.trackTimeMillis || 180000) / 1000),
      };
    }
  } catch {}
  return null;
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

    // 1. In-memory cache check (instant 0ms)
    if (memoryCache.has(cacheKey)) {
      return NextResponse.json({
        success: true,
        videoId: memoryCache.get(cacheKey),
        source: 'memory_cache',
      });
    }

    // 2. Database immediate check (instant 1ms)
    const existingSong = songId ? db.getSongById(songId) : null;
    if (existingSong?.externalMediaId) {
      memoryCache.set(cacheKey, existingSong.externalMediaId);
      return NextResponse.json({
        success: true,
        videoId: existingSong.externalMediaId,
        audioUrl: existingSong.audioUrl && !existingSong.audioUrl.includes('dzcdn.net') ? existingSong.audioUrl : undefined,
        source: 'database_media_id',
      });
    }

    if (existingSong?.audioUrl && (existingSong.audioUrl.includes('youtube.com') || existingSong.audioUrl.includes('youtu.be'))) {
      const match = existingSong.audioUrl.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      if (match?.[1]) {
        existingSong.externalMediaId = match[1];
        try { db.saveSong(existingSong); } catch {}
        memoryCache.set(cacheKey, match[1]);
        return NextResponse.json({
          success: true,
          videoId: match[1],
          source: 'database_url_match',
        });
      }
    }

    if (existingSong?.audioUrl && !existingSong.audioUrl.includes('dzcdn.net') && !existingSong.audioUrl.includes('youtube')) {
      return NextResponse.json({
        success: true,
        audioUrl: existingSong.audioUrl,
        source: 'database_direct_audio',
      });
    }

    // Target duration from song metadata
    let targetDuration = durationParam;
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

    // 3. Parallel Fast Resolution: YouTube + iTunes Stream (resolves in ~200-800ms)
    const [ytResult, itunesResult] = await Promise.allSettled([
      (async () => {
        const primaryQuery = `${artist} - ${cleanT} official audio`;
        let candidates = await searchYouTubeCandidates(primaryQuery);
        if (candidates.length === 0) {
          candidates = await searchYouTubeCandidates(`${artist} - ${cleanT}`);
        }
        return candidates;
      })(),
      searchItunesPreview(artist, cleanT)
    ]);

    const candidates = ytResult.status === 'fulfilled' ? ytResult.value : [];
    const itunesData = itunesResult.status === 'fulfilled' ? itunesResult.value : null;

    // Score candidates to guarantee original studio version
    let bestCandidate: VideoCandidate | null = null;
    let highestScore = -9999;

    for (const c of candidates) {
      const score = scoreCandidate(c, artist, cleanT, targetDuration, cleanAlbum);
      if (score > highestScore) {
        highestScore = score;
        bestCandidate = c;
      }
    }

    // Accept candidate if score >= 50 or if viable studio candidate available
    let videoId = (highestScore >= 50 && bestCandidate?.id) ? bestCandidate.id : null;

    if (!videoId && candidates.length > 0) {
      const viable = candidates.find(c => {
        const titleNorm = normalizeStr(c.title);
        return !/\b(live|remix|cover|karaoke)\b/i.test(titleNorm);
      });
      if (viable?.id) {
        videoId = viable.id;
        bestCandidate = viable;
      }
    }

    if (videoId) {
      memoryCache.set(cacheKey, videoId);

      // Update database in background
      if (songId) {
        try {
          const song = db.getSongById(songId);
          if (song) {
            song.externalMediaId = videoId;
            song.sourcePlatform = 'youtube';
            if (itunesData?.audioUrl) {
              song.audioUrl = itunesData.audioUrl;
            } else if (!song.audioUrl || song.audioUrl.includes('youtube.com') || song.audioUrl.includes('dzcdn.net')) {
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
        audioUrl: itunesData?.audioUrl,
        source: 'youtube',
        verifiedStudioRecording: highestScore > 0,
        matchedTitle: bestCandidate?.title,
        channel: bestCandidate?.channel,
      });
    }

    // If YouTube had no direct match but iTunes direct audio stream was found:
    if (itunesData?.audioUrl) {
      if (songId) {
        try {
          const song = db.getSongById(songId);
          if (song) {
            song.audioUrl = itunesData.audioUrl;
            song.sourcePlatform = 'direct';
            song.isUnavailable = false;
            db.saveSong(song);
          }
        } catch {}
      }

      return NextResponse.json({
        success: true,
        audioUrl: itunesData.audioUrl,
        source: 'itunes_direct',
        duration: itunesData.duration,
      });
    }

    // Fallback if existing direct audio path exists
    const isDirectAvailable = existingSong && (existingSong.audioPath || (existingSong.audioUrl && !existingSong.audioUrl.includes('dzcdn.net')));
    if (isDirectAvailable) {
      return NextResponse.json({
        success: true,
        audioUrl: existingSong.audioPath || existingSong.audioUrl,
        source: 'direct',
        isUnavailable: false,
      });
    }

    return NextResponse.json({
      success: true,
      audioUrl: existingSong?.audioPath || '',
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

