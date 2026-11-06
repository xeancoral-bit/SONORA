import { useMemo } from 'react';
import { SyncedLyricLine } from '@/lib/types';

/**
 * Precision algorithm to find the active lyric index based on the real-time audio playback time.
 * Features:
 * 1. Audio Latency Compensation (+0.18s): Compensates for DAC/OS audio output buffering so
 *    the visual highlight triggers on the exact vocal onset without lag.
 * 2. Intro detection: Returns -1 if vocals haven't started yet.
 * 3. Instrumental break detection: If the gap between two lyric lines is > 7s, releases
 *    highlight after the vocal phrase finishes so lines don't stay frozen during solos.
 * 4. Vocal decay: Extends highlight for up to 6s after the final line.
 */
export function findActiveLyricIndex(
  lyrics: SyncedLyricLine[] | undefined | null,
  currentTime: number
): number {
  if (!lyrics || lyrics.length === 0) return -1;

  // 180ms audio output latency compensation for instant on-beat highlighting
  const effectiveTime = currentTime + 0.18;

  // Before the first lyric begins in the audio: intro phase
  if (effectiveTime < lyrics[0].time) {
    return -1;
  }

  for (let i = 0; i < lyrics.length; i++) {
    const startTime = lyrics[i].time;
    const nextStartTime = i + 1 < lyrics.length ? lyrics[i + 1].time : Infinity;

    if (effectiveTime >= startTime && effectiveTime < nextStartTime) {
      // If there is an extended instrumental gap between lines (> 7.5s)
      const gap = nextStartTime - startTime;
      if (gap > 7.5) {
        // Natural duration of the sung phrase (word count estimate or max 5.5s)
        const wordCount = (lyrics[i].text || '').split(/\s+/).length;
        const phraseDuration = Math.min(6.0, Math.max(2.8, wordCount * 0.42));
        if (effectiveTime > startTime + phraseDuration && nextStartTime - effectiveTime > 1.8) {
          // Instrumental interlude: release highlight until next line approaches
          return -1;
        }
      }
      return i;
    }
  }

  // After the last line: hold highlight for reasonable vocal decay (up to 6s), then finish
  const lastIndex = lyrics.length - 1;
  const lastLine = lyrics[lastIndex];
  if (effectiveTime >= lastLine.time && effectiveTime <= lastLine.time + 6) {
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
