/**
 * SONORA — YouTube & External URL Utilities
 * Handles URL parsing, validation, and metadata extraction for external media sources.
 * Does NOT download, rip, or extract audio from YouTube — only stores the URL
 * and uses official YouTube IFrame Player API for authorized playback.
 */

export type ParsedMediaUrl = {
  platform: 'youtube' | 'soundcloud' | 'direct' | null;
  videoId: string | null;
  canonicalUrl: string;
  isValid: boolean;
  embedUrl: string | null;
};

/**
 * Extract YouTube video ID from any supported YouTube URL format.
 * Supports: watch?v=, youtu.be/, shorts/, embed/, live/
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?.*?v=([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

/**
 * Parse any supported media URL and return structured info.
 */
export function parseMediaUrl(rawUrl: string): ParsedMediaUrl {
  const url = rawUrl.trim();

  if (!url) {
    return { platform: null, videoId: null, canonicalUrl: url, isValid: false, embedUrl: null };
  }

  // YouTube
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return {
      platform: 'youtube',
      videoId: ytId,
      canonicalUrl: `https://www.youtube.com/watch?v=${ytId}`,
      isValid: true,
      embedUrl: `https://www.youtube.com/embed/${ytId}?enablejsapi=1&autoplay=1&rel=0`,
    };
  }

  // SoundCloud (basic check — no public API without key)
  if (url.includes('soundcloud.com/')) {
    try {
      new URL(url); // validate URL format
      return {
        platform: 'soundcloud',
        videoId: null,
        canonicalUrl: url,
        isValid: true,
        embedUrl: null,
      };
    } catch {
      return { platform: null, videoId: null, canonicalUrl: url, isValid: false, embedUrl: null };
    }
  }

  // Direct audio URL (mp3, wav, m4a, aac, ogg)
  const directAudioPattern = /\.(mp3|wav|m4a|aac|ogg|flac)(\?.*)?$/i;
  if (directAudioPattern.test(url)) {
    try {
      new URL(url);
      return {
        platform: 'direct',
        videoId: null,
        canonicalUrl: url,
        isValid: true,
        embedUrl: null,
      };
    } catch {
      return { platform: null, videoId: null, canonicalUrl: url, isValid: false, embedUrl: null };
    }
  }

  // Generic URL check — allow but warn user
  try {
    new URL(url);
    return {
      platform: 'direct',
      videoId: null,
      canonicalUrl: url,
      isValid: true,
      embedUrl: null,
    };
  } catch {
    return { platform: null, videoId: null, canonicalUrl: url, isValid: false, embedUrl: null };
  }
}

/**
 * Fetch YouTube video metadata using the oEmbed API (no API key required).
 * Only returns publicly available metadata — title, thumbnail, author.
 */
export async function fetchYouTubeOEmbed(videoId: string): Promise<{
  title: string;
  thumbnail: string;
  channelName: string;
  channelUrl: string;
} | null> {
  try {
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(oEmbedUrl);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: data.title || '',
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      channelName: data.author_name || '',
      channelUrl: data.author_url || '',
    };
  } catch {
    return null;
  }
}

/**
 * Returns a platform display label and badge color for the UI.
 */
export function getPlatformMeta(platform: string | null | undefined) {
  switch (platform) {
    case 'youtube':
      return { label: 'YouTube', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
    case 'soundcloud':
      return { label: 'SoundCloud', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' };
    case 'direct':
      return { label: 'External URL', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' };
    default:
      return { label: 'Uploaded', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  }
}
