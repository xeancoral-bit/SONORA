import { useMemo } from 'react';
import { SyncedLyricLine } from '@/lib/types';

/**
 * Universal algorithm to find the active lyric index based on the real-time audio playback time.
 * Guaranteed:
 * 1. Returns -1 if current time is before the first lyric start time (Intro phase - vocals haven't started).
 * 2. Uses exact condition: currentTime >= currentLyric.startTime && currentTime < nextLyric.startTime.
 * 3. Immediately advances to next lyric index the exact millisecond next timestamp is reached.
 * 4. Never leaves previous lyric highlighted after singer moves to next line.
 * 5. Works universally across all songs, languages, albums, and genres.
 */
export function findActiveLyricIndex(
  lyrics: SyncedLyricLine[] | undefined | null,
  currentTime: number
): number {
  if (!lyrics || lyrics.length === 0) return -1;

  // Before the first lyric begins in the audio: intro phase, vocals haven't begun yet
  if (currentTime < lyrics[0].time) {
    return -1;
  }

  // Continuous determination: currentTime >= currentLyric.startTime && currentTime < nextLyric.startTime
  for (let i = 0; i < lyrics.length; i++) {
    const startTime = lyrics[i].time;
    const nextStartTime = i + 1 < lyrics.length ? lyrics[i + 1].time : Infinity;

    if (currentTime >= startTime && currentTime < nextStartTime) {
      return i;
    }
  }

  // After the last line: keep highlighted for reasonable vocal decay (up to 8s), then finish
  const lastIndex = lyrics.length - 1;
  const lastLine = lyrics[lastIndex];
  if (currentTime >= lastLine.time && currentTime <= lastLine.time + 8) {
    return lastIndex;
  }

  return -1;
}

export interface UseSyncedLyricsReturn {
  activeIndex: number;
  activeLine: SyncedLyricLine | null;
  currentLineNumber: number;
  totalLines: number;
  isIntro: boolean;
  introRemainingSeconds: number;
  getLineState: (index: number) => 'past' | 'active' | 'upcoming';
  getLineEndTime: (index: number) => number;
}

/**
 * Custom React hook for precision real-time Live Lyrics synchronization.
 * Audio playback currentTime is the single source of truth.
 */
export function useSyncedLyrics(
  lyrics: SyncedLyricLine[] | undefined | null,
  currentTime: number
): UseSyncedLyricsReturn {
  const totalLines = lyrics?.length || 0;

  const activeIndex = useMemo(() => {
    return findActiveLyricIndex(lyrics, currentTime);
  }, [lyrics, currentTime]);

  const activeLine = activeIndex >= 0 && lyrics && lyrics[activeIndex] ? lyrics[activeIndex] : null;
  const isIntro = Boolean(lyrics && lyrics[0] && currentTime < lyrics[0].time);
  const introRemainingSeconds = isIntro && lyrics && lyrics[0] ? Math.max(0, lyrics[0].time - currentTime) : 0;
  const currentLineNumber = activeIndex >= 0 ? activeIndex + 1 : 0;

  const getLineEndTime = (index: number): number => {
    if (!lyrics || !lyrics[index]) return 0;
    if (index + 1 < lyrics.length) {
      return lyrics[index + 1].time;
    }
    return lyrics[index].time + 6;
  };

  const getLineState = (index: number): 'past' | 'active' | 'upcoming' => {
    if (activeIndex === -1) {
      // If playback is before the first line, all lines are upcoming
      if (lyrics && lyrics[0] && currentTime < lyrics[0].time) {
        return 'upcoming';
      }
      // If past the last line, all lines are past
      return 'past';
    }
    if (index === activeIndex) return 'active';
    if (index < activeIndex) return 'past';
    return 'upcoming';
  };

  return {
    activeIndex,
    activeLine,
    currentLineNumber,
    totalLines,
    isIntro,
    introRemainingSeconds,
    getLineState,
    getLineEndTime,
  };
}
