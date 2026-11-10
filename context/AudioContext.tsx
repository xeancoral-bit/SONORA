'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Song, SyncedLyricLine } from '@/lib/types';
import { synthEngine } from '@/lib/audioSynth';
import { extractYouTubeId } from '@/lib/urlUtils';
import { parseLrc } from '@/lib/lyricsService';
import { findActiveLyricIndex } from '@/hooks/useSyncedLyrics';

export type RepeatMode = 'off' | 'one' | 'all';

interface AudioContextType {
  currentTrack: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Song[];
  history: Song[];
  isFullScreen: boolean;
  isLyricsOpen: boolean;
  isQueueOpen: boolean;
  currentLyricIndex: number;
  lyricsLanguage: string;
  setLyricsLanguage: (lang: string) => void;
  lyricsFontSize: 'sm' | 'md' | 'lg' | 'xl';
  setLyricsFontSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  increaseLyricsFontSize: () => void;
  decreaseLyricsFontSize: () => void;
  activeSyncedLyrics: SyncedLyricLine[];
  activePlainLyrics: string;
  hasSyncedLyrics: boolean;
  isLyricsLoading: boolean;
  refetchLyrics: () => void;
  isResolving: boolean;
  unavailableTrackIds: string[];
  
  // Actions
  playTrack: (track: Song, newQueue?: Song[]) => void;
  togglePlayPause: () => void;
  seek: (seconds: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  setIsFullScreen: (open: boolean) => void;
  setIsLyricsOpen: (open: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  closePlayer: () => void;
  toggleLikeCurrentTrack: () => Promise<void>;
  isCurrentLiked: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const currentTrackRef = useRef<Song | null>(null);
  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);
  // Memoized identifier for lyric fetching: prefer externalMediaId (e.g., YouTube ID) else track.id
  const lyricId = useMemo(() => currentTrack?.id || '', [currentTrack]);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef<boolean>(false);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<Song[]>([]);
  const [history, setHistory] = useState<Song[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isCurrentLiked, setIsCurrentLiked] = useState(false);
  const [lyricsLanguage, setLyricsLanguageState] = useState('en');
  const [lyricsFontSize, setLyricsFontSizeState] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [isResolving, setIsResolving] = useState(false);
  const [unavailableTrackIds, setUnavailableTrackIds] = useState<string[]>([]);

  // Load saved lyrics preferences on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('sonora_lyrics_lang');
      if (savedLang) setLyricsLanguageState(savedLang);
      const savedSize = localStorage.getItem('sonora_lyrics_size') as 'sm' | 'md' | 'lg' | 'xl';
      if (savedSize && ['sm', 'md', 'lg', 'xl'].includes(savedSize)) {
        setLyricsFontSizeState(savedSize);
      }
    } catch {}
  }, []);

  const setLyricsLanguage = useCallback((lang: string) => {
    setLyricsLanguageState(lang);
    try {
      localStorage.setItem('sonora_lyrics_lang', lang);
    } catch {}
  }, []);

  const setLyricsFontSize = useCallback((size: 'sm' | 'md' | 'lg' | 'xl') => {
    setLyricsFontSizeState(size);
    try {
      localStorage.setItem('sonora_lyrics_size', size);
    } catch {}
  }, []);

  const increaseLyricsFontSize = useCallback(() => {
    const sizes: ('sm' | 'md' | 'lg' | 'xl')[] = ['sm', 'md', 'lg', 'xl'];
    setLyricsFontSizeState((prev) => {
      const idx = sizes.indexOf(prev);
      const next = idx < sizes.length - 1 ? sizes[idx + 1] : prev;
      try {
        localStorage.setItem('sonora_lyrics_size', next);
      } catch {}
      return next;
    });
  }, []);

  const decreaseLyricsFontSize = useCallback(() => {
    const sizes: ('sm' | 'md' | 'lg' | 'xl')[] = ['sm', 'md', 'lg', 'xl'];
    setLyricsFontSizeState((prev) => {
      const idx = sizes.indexOf(prev);
      const next = idx > 0 ? sizes[idx - 1] : prev;
      try {
        localStorage.setItem('sonora_lyrics_size', next);
      } catch {}
      return next;
    });
  }, []);



  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTimeRef = useRef<number>(0);
  const playLoggedRef = useRef<boolean>(false);
  const synthTimerRef = useRef<any>(null);
    const handleTrackEndedRef = useRef<() => void>(() => {});
    // Helper to stop synth playback and clear timer
    const stopSynth = useCallback(() => {
      if (synthTimerRef.current) {
        clearInterval(synthTimerRef.current as any);
        synthTimerRef.current = null;
      }
      // If synthEngine provides a stop method, call it
      if (synthEngine && typeof (synthEngine as any).stop === 'function') {
        (synthEngine as any).stop();
      }
    }, []);
  


  // YouTube Player Refs
  const ytPlayerRef = useRef<any>(null);
  const ytReadyRef = useRef<boolean>(false);
  const ytPollTimerRef = useRef<any>(null);
  const pendingYtVideoIdRef = useRef<string | null>(null);

  // Initialize YouTube IFrame API script on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initYouTubePlayer = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        if (!ytPlayerRef.current) {
          // Ensure non-throttled container exists in DOM (Chromium suspends 1x1 or offscreen iframes)
          let container = document.getElementById('sonora-youtube-hidden-player');
          if (!container) {
            container = document.createElement('div');
            container.id = 'sonora-youtube-hidden-player';
            container.style.position = 'fixed';
            container.style.bottom = '0px';
            container.style.right = '0px';
            container.style.width = '200px';
            container.style.height = '200px';
            container.style.opacity = '0.001';
            container.style.pointerEvents = 'none';
            container.style.zIndex = '-1';
            container.style.overflow = 'hidden';
            document.body.appendChild(container);
          }

          try {
            ytPlayerRef.current = new (window as any).YT.Player('sonora-youtube-hidden-player', {
              height: '200',
              width: '200',
              videoId: '',
              host: 'https://www.youtube-nocookie.com',
              playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                rel: 0,
                playsinline: 1,
                enablejsapi: 1,
                origin: typeof window !== 'undefined' ? window.location.origin : ''
              },
              events: {
                onReady: (event: any) => {
                  ytReadyRef.current = true;
                  event.target.setVolume(isMuted ? 0 : volume * 100);
                  if (pendingYtVideoIdRef.current) {
                    event.target.loadVideoById(pendingYtVideoIdRef.current);
                    event.target.playVideo();
                    isPlayingRef.current = true;
                    setIsPlaying(true);
                    startYouTubePolling();
                    pendingYtVideoIdRef.current = null;
                  }
                },
                onStateChange: (event: any) => {
                  if (event.data === 0) {
                    // Ended
                    isPlayingRef.current = false;
                    setIsPlaying(false);
                    stopYouTubePolling();
                    handleTrackEndedRef.current();
                  } else if (event.data === 1) {
                    // Playing
                    isPlayingRef.current = true;
                    setIsPlaying(true);
                    startYouTubePolling();
                  } else if (event.data === 2) {
                    // Paused
                    isPlayingRef.current = false;
                    setIsPlaying(false);
                    stopYouTubePolling();
                  }
                },
                onError: (err: any) => {
                  console.warn('YouTube Player API warning:', err);
                }
              }
            });
          } catch (e) {
            console.warn('Could not initialize YouTube Player:', e);
          }
        }
      }
    };

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
      (window as any).onYouTubeIframeAPIReady = initYouTubePlayer;
    } else {
      initYouTubePlayer();
    }

    return () => {
      if (ytPollTimerRef.current) clearInterval(ytPollTimerRef.current);
    };
  }, []);

  // Initialize standard Audio element on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audioRef.current = audio;

      let rafId: number | null = null;
      const trackAudioTime = () => {
        if (audioRef.current && !audioRef.current.paused) {
          const cur = audioRef.current.currentTime;
          const changed = Math.abs(currentTimeRef.current - cur) >= 0.03;
          if (changed) {
            currentTimeRef.current = cur;
            setCurrentTime(cur);
            setCurrentLyricIndex((prev) => {
              const nextIdx = findActiveLyricIndex(activeSyncedLyricsRef.current, cur);
              return prev !== nextIdx ? nextIdx : prev;
            });
          }
          rafId = requestAnimationFrame(trackAudioTime);
        }
      };

      audio.addEventListener('timeupdate', () => {
        const cur = audio.currentTime;
        const changed = Math.abs(currentTimeRef.current - cur) >= 0.03;
        if (changed) {
          currentTimeRef.current = cur;
          setCurrentTime(cur);
          setCurrentLyricIndex((prev) => {
            const nextIdx = findActiveLyricIndex(activeSyncedLyricsRef.current, cur);
            return prev !== nextIdx ? nextIdx : prev;
          });
        }
        if (audio.duration && !isNaN(audio.duration)) {
          const cur = currentTrackRef.current;
          if (cur && cur.duration > 45 && audio.duration <= 35) {
            // Keep real song duration, do not override with 30s preview
          } else {
            setDuration((prev) => (Math.abs(prev - audio.duration) >= 0.5 ? audio.duration : prev));
          }
        }
      });

      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration && !isNaN(audio.duration)) {
          const cur = currentTrackRef.current;
          if (cur && cur.duration > 45 && audio.duration <= 35) {
            // Keep real song duration
          } else {
            setDuration(audio.duration);
          }
        }
      });

      audio.addEventListener('ended', () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        const cur = currentTrackRef.current;
        if (cur && cur.duration > 45 && audio.currentTime < cur.duration * 0.7) {
          const ytId = getYouTubeId(cur);
          if (ytId && ytReadyRef.current && ytPlayerRef.current) {
            try {
              ytPlayerRef.current.loadVideoById({
                videoId: ytId,
                startSeconds: Math.floor(audio.currentTime),
              });
              ytPlayerRef.current.setVolume((isMuted ? 0 : volume) * 100);
              ytPlayerRef.current.playVideo();
              setIsPlaying(true);
              startYouTubePolling();
              return;
            } catch {}
          } else {
            // Background fallback: resolve full official soundtrack stream if preview reached 30s
            fetch(`/api/media/resolve?artist=${encodeURIComponent(cur.artistName)}&title=${encodeURIComponent(cur.title)}&songId=${cur.id}`)
              .then((res) => res.json())
              .then((data) => {
                if (data.success && data.videoId && currentTrackRef.current?.id === cur.id) {
                  cur.externalMediaId = data.videoId;
                  cur.sourcePlatform = 'youtube';
                  if (ytReadyRef.current && ytPlayerRef.current) {
                    try {
                      ytPlayerRef.current.loadVideoById({
                        videoId: data.videoId,
                        startSeconds: Math.floor(audio.currentTime),
                      });
                      ytPlayerRef.current.setVolume((isMuted ? 0 : volume) * 100);
                      ytPlayerRef.current.playVideo();
                      setIsPlaying(true);
                      startYouTubePolling();
                    } catch {}
                  }
                }
              })
              .catch(() => {});
            return;
          }
        }
        handleTrackEndedRef.current();
      });

      audio.addEventListener('play', () => {
        setIsPlaying(true);
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(trackAudioTime);
      });
      audio.addEventListener('pause', () => {
        setIsPlaying(false);
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  // Sync volume with standard audio, synth, and YouTube player
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (synthEngine) {
      synthEngine.setVolume(isMuted ? 0 : volume);
    }
    if (ytPlayerRef.current && ytReadyRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      try {
        ytPlayerRef.current.setVolume((isMuted ? 0 : volume) * 100);
        if (isMuted) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
        }
      } catch {}
    }
  }, [volume, isMuted]);

  // Check if current track is liked
  useEffect(() => {
    if (!currentTrack) {
      setIsCurrentLiked(false);
      return;
    }
    fetch('/api/likes')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const liked = data?.likedSongs?.some((ls: any) => ls.songId === currentTrack.id);
        setIsCurrentLiked(Boolean(liked));
      })
      .catch(() => {});
  }, [currentTrack]);

  // Log play count after 5 seconds of playback
  useEffect(() => {
    if (isPlaying && currentTrack && currentTime > 5 && !playLoggedRef.current) {
      playLoggedRef.current = true;
      fetch(`/api/songs/${currentTrack.id}/play`, { method: 'POST' }).catch(() => {});
    }
  }, [isPlaying, currentTrack, currentTime]);

  const [activeSyncedLyrics, setActiveSyncedLyrics] = useState<SyncedLyricLine[]>([]);
  // Mirror activeSyncedLyrics in a ref so the lyric-index effect can read the latest
  // value without listing it as a dependency (prevents infinite re-render loop).
  const activeSyncedLyricsRef = useRef<SyncedLyricLine[]>([]);
  // Keep the ref in sync with state (runs synchronously after every render)
  useEffect(() => {
    activeSyncedLyricsRef.current = activeSyncedLyrics;
  }, [activeSyncedLyrics]);
  const [activePlainLyrics, setActivePlainLyrics] = useState<string>('');
  const [hasSyncedLyrics, setHasSyncedLyrics] = useState<boolean>(false);
  const [isLyricsLoading, setIsLyricsLoading] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const lyricsFetchAbortRef = useRef<AbortController | null>(null);

  // Ref to track latest lyrics fetch request to avoid race conditions
  const lyricsFetchIdRef = useRef<number>(0);
  const lyricsAttemptedForTrackIdRef = useRef<string | null>(null);
  const [lyricsRefreshCounter, setLyricsRefreshCounter] = useState(0);

  const refetchLyrics = useCallback(() => {
    setLyricsRefreshCounter((prev) => prev + 1);
  }, []);

  // Auto-fetch at most once per track if user opens lyrics panel and lyrics are not loaded yet
  useEffect(() => {
    if (
      isLyricsOpen &&
      currentTrack &&
      lyricsAttemptedForTrackIdRef.current !== currentTrack.id &&
      activeSyncedLyrics.length === 0 &&
      !activePlainLyrics &&
      !isLyricsLoading
    ) {
      lyricsAttemptedForTrackIdRef.current = currentTrack.id;
      refetchLyrics();
    }
  }, [isLyricsOpen, currentTrack, activeSyncedLyrics.length, activePlainLyrics, isLyricsLoading, refetchLyrics]);

  // Fetch synced lyrics when track identifier, language, or refresh counter changes
  useEffect(() => {
    if (currentTrack?.id) {
      lyricsAttemptedForTrackIdRef.current = currentTrack.id;
    }
    // Seed initial lyrics from track if available
    // Use functional setters so React bails out when the value is unchanged — prevents
    // infinite loop: setCurrentTime (YT poll) → useEffect[currentTime, activeSyncedLyrics]
    // → setCurrentLyricIndex → re-render → activeSyncedLyrics reference changed → loop.
    const rawSynced = currentTrack?.syncedLyrics;
    const rawLyrics = currentTrack?.lyrics;

    const existingSynced: SyncedLyricLine[] =
      Array.isArray(rawSynced) && rawSynced.length > 0
        ? rawSynced
        : typeof rawLyrics === 'string' && /\[\d{1,2}:\d{2}/.test(rawLyrics)
        ? parseLrc(rawLyrics)
        : Array.isArray(rawLyrics) && (rawLyrics as any).length > 0
        ? (rawLyrics as any)
        : [];

    const existingPlain =
      typeof rawLyrics === 'string' && rawLyrics.trim().length > 0
        ? rawLyrics.replace(/\[\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]/g, '').trim()
        : '';

    if (existingSynced.length > 0 && lyricsLanguage === 'en') {
      // Stable reference check: only update state when content actually changed
      setActiveSyncedLyrics((prev) =>
        prev.length === existingSynced.length &&
        prev.every((l, i) => l.time === existingSynced[i].time && l.text === existingSynced[i].text)
          ? prev
          : existingSynced
      );
      setHasSyncedLyrics(true);
      setActivePlainLyrics((prev) => (prev === existingPlain ? prev : existingPlain));
      setIsLyricsLoading(false);
    } else if (existingPlain && lyricsLanguage === 'en') {
      setActiveSyncedLyrics((prev) => (prev.length === 0 ? prev : []));
      setHasSyncedLyrics(false);
      setActivePlainLyrics((prev) => (prev === existingPlain ? prev : existingPlain));
      setIsLyricsLoading(false);
    } else {
      setActiveSyncedLyrics((prev) => (prev.length === 0 ? prev : []));
      setActivePlainLyrics((prev) => (prev === '' ? prev : ''));
      setHasSyncedLyrics(false);
      setIsLyricsLoading(true);
    }
    setCurrentLyricIndex(0);

    // If no valid lyric identifier, nothing to fetch
    if (!lyricId && !currentTrack) {
      setIsLyricsLoading(false);
      return;
    }

    // Increment request id to invalidate previous fetches
    const requestId = ++lyricsFetchIdRef.current;
    const controller = new AbortController();
    lyricsFetchAbortRef.current = controller;

    const fetchLyrics = async () => {
      try {
        // Build query: always include the primary song id; also include externalMediaId for YouTube tracks
        const params = new URLSearchParams({
          trackId: lyricId || currentTrack?.id || '',
          lang: lyricsLanguage,
        });
        if (currentTrack?.externalMediaId) {
          params.set('externalId', currentTrack.externalMediaId);
        }
        if (currentTrack?.title) {
          params.set('title', currentTrack.title);
        }
        if (currentTrack?.artistName) {
          params.set('artist', currentTrack.artistName);
        }
        if (currentTrack?.albumTitle) {
          params.set('album', currentTrack.albumTitle);
        }
        if (currentTrack?.duration) {
          params.set('duration', String(currentTrack.duration));
        }
        const res = await fetch(`/api/lyrics?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Lyrics fetch failed: ${res.status}`);
        const data = await res.json();
        // Apply only if this is still the latest request (race-condition guard)
        if (lyricsFetchIdRef.current === requestId) {
          const syncedList = Array.isArray(data.lyrics) ? data.lyrics : [];
          setActiveSyncedLyrics(syncedList);
          setActivePlainLyrics(data.plainLyrics || existingPlain || (typeof currentTrack?.lyrics === 'string' ? currentTrack.lyrics : ''));
          setHasSyncedLyrics(Boolean(data.hasSynced && syncedList.length > 0));
          setCurrentLyricIndex(0);
          setIsLyricsLoading(false);
        }
      } catch (err: any) {
        // Ignore AbortError — it means the request was intentionally cancelled
        if (err?.name === 'AbortError') return;
        if (lyricsFetchIdRef.current === requestId) {
          setActiveSyncedLyrics([]);
          setActivePlainLyrics(existingPlain || '');
          setHasSyncedLyrics(false);
          setCurrentLyricIndex(0);
          setIsLyricsLoading(false);
        }
      }
    };
    fetchLyrics();
    return () => {
      controller.abort();
    };
  }, [lyricId, lyricsLanguage, lyricsRefreshCounter, currentTrack?.title, currentTrack?.artistName]);

  // Update current lyric index based on real-time audio playback.
  // Lyric index is now tracked directly inside the playback poll/timeupdate callbacks
  // (context/AudioContext.tsx:283, :290, :609) using refs, so currentTime state is NOT a
  // dependency of any effect — this breaks the setState → useEffect → setState infinite loop.

  function getYouTubeId(track: Song): string | null {
    if (track.externalMediaId) return track.externalMediaId;
    if (track.sourcePlatform === 'youtube') {
      return extractYouTubeId(track.audioUrl || track.sourceUrl || '') || null;
    }
    if (track.audioUrl && !track.audioUrl.includes('apple.com') && !track.audioUrl.includes('mzstatic.com') && !track.audioUrl.includes('dzcdn.net')) {
      return extractYouTubeId(track.audioUrl) || null;
    }
    return null;
  }

  function startYouTubePolling() {
    if (ytPollTimerRef.current) clearInterval(ytPollTimerRef.current);
    ytPollTimerRef.current = setInterval(() => {
      if (ytPlayerRef.current && ytReadyRef.current) {
        try {
          const state = typeof ytPlayerRef.current.getPlayerState === 'function' ? ytPlayerRef.current.getPlayerState() : -1;
          if (state === 1 || isPlayingRef.current) {
            const cur = ytPlayerRef.current.getCurrentTime();
            const dur = ytPlayerRef.current.getDuration();
            if (typeof cur === 'number' && !isNaN(cur)) {
              const changed = Math.abs(currentTimeRef.current - cur) >= 0.04;
              if (changed) {
                currentTimeRef.current = cur;
                setCurrentTime(cur);
                setCurrentLyricIndex((prev) => {
                  const nextIdx = findActiveLyricIndex(activeSyncedLyricsRef.current, cur);
                  return prev !== nextIdx ? nextIdx : prev;
                });
              }
            }
            if (typeof dur === 'number' && !isNaN(dur) && dur > 0) {
              setDuration((prev) => (Math.abs(prev - dur) >= 1 ? dur : prev));
            }
          }
        } catch {}
      }
    }, 60);
  }

  function stopYouTubePolling() {
    if (ytPollTimerRef.current) {
      clearInterval(ytPollTimerRef.current);
      ytPollTimerRef.current = null;
    }
  }

  const playTrack = useCallback((track: Song, newQueue?: Song[]) => {
    stopSynth();
    stopYouTubePolling();
    playLoggedRef.current = false;
    setCurrentTrack(track);
    setCurrentTime(0);
    currentTimeRef.current = 0;
    setActiveSyncedLyrics([]);
    setCurrentLyricIndex(0);
    setDuration(track.duration || 180);

    if (newQueue) {
      setQueue(newQueue.filter((s) => s.id !== track.id));
    }

    // 1. If track already has an authorized YouTube stream, play immediately from start to finish
    const ytId = getYouTubeId(track);
    if (ytId) {
      setIsResolving(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      if (ytReadyRef.current && ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
        try {
          ytPlayerRef.current.loadVideoById({
            videoId: ytId,
            startSeconds: 0
          });
          ytPlayerRef.current.setVolume((isMuted ? 0 : volume) * 100);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          startYouTubePolling();
        } catch (err) {
          console.warn('Error loading video via YouTube player API:', err);
        }
      } else {
        pendingYtVideoIdRef.current = ytId;
        setIsPlaying(true);
        startYouTubePolling();
      }
      return;
    }

    // 2. Immediate audio playback via direct audio stream (HTML5 Audio)
    // Guard: only use HTML5 Audio for real direct audio files — never for YouTube/SoundCloud URLs
    const rawAudioSource = track.audioPath || track.audioUrl || '';
    const isDirectAudioSource =
      rawAudioSource.length > 0 &&
      !rawAudioSource.includes('youtube.com') &&
      !rawAudioSource.includes('youtu.be') &&
      !rawAudioSource.includes('soundcloud.com') &&
      !rawAudioSource.includes('dzcdn.net');

    if (isDirectAudioSource && audioRef.current) {
      if (ytPlayerRef.current && ytReadyRef.current && typeof ytPlayerRef.current.stopVideo === 'function') {
        try { ytPlayerRef.current.stopVideo(); } catch {}
      }
      audioRef.current.src = rawAudioSource;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('HTML5 Audio playback initiated:', e);
      });
    } else if (!isDirectAudioSource && audioRef.current) {
      // No playable direct source — clear previous audio and wait for YouTube resolve
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsPlaying(true); // show playing state optimistically while YT resolves
    }

    // 3. Resolve official authorized studio recording in background to connect full-length YouTube master
    setIsResolving(true);
    const resolveParams = new URLSearchParams({
      artist: track.artistName,
      title: track.title,
      songId: track.id,
      album: track.albumTitle || '',
      isrc: track.isrc || '',
      duration: String(track.duration || 0),
    });

    fetch(`/api/media/resolve?${resolveParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setIsResolving(false);
        if (data.success && data.videoId) {
          track.externalMediaId = data.videoId;
          track.sourcePlatform = 'youtube';
          track.isUnavailable = false;

          // If track has transitioned to YouTube, load full recording seamlessly
          if (currentTrackRef.current?.id === track.id) {
            if (ytReadyRef.current && ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
              try {
                // If HTML5 audio was playing, pause it and hand off to YouTube player
                const currentPos = audioRef.current ? Math.floor(audioRef.current.currentTime) : 0;
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.src = '';
                }
                ytPlayerRef.current.loadVideoById({
                  videoId: data.videoId,
                  startSeconds: currentPos,
                });
                ytPlayerRef.current.setVolume((isMuted ? 0 : volume) * 100);
                ytPlayerRef.current.playVideo();
                setIsPlaying(true);
                startYouTubePolling();
              } catch (e) {
                console.warn('YouTube handoff:', e);
              }
            } else {
              pendingYtVideoIdRef.current = data.videoId;
              setIsPlaying(true);
              startYouTubePolling();
            }
          }
        }
      })
      .catch((err) => {
        console.warn('Resolve error:', err);
        setIsResolving(false);
      });
  }, [volume, isMuted, unavailableTrackIds]);

  const togglePlayPause = () => {
    if (!currentTrack) return;
    const ytId = getYouTubeId(currentTrack);

    if (ytId && ytPlayerRef.current && ytReadyRef.current) {
      try {
        if (isPlaying) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
          stopYouTubePolling();
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          startYouTubePolling();
        }
        return;
      } catch {}
    }

    // Fallback for YT tracks when player not yet ready: re-trigger pending load
    if (ytId && !ytReadyRef.current) {
      pendingYtVideoIdRef.current = ytId;
      setIsPlaying((prev) => !prev);
      return;
    }

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Allow replay for both 'file' and direct-URL audio sources
      if (audioRef.current && audioRef.current.src && audioRef.current.src !== window.location.href) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const seek = (seconds: number) => {
    const clamped = Math.max(0, Math.min(duration || 1000, seconds));
    setCurrentTime(clamped);
    currentTimeRef.current = clamped;
    if (activeSyncedLyrics && activeSyncedLyrics.length > 0) {
      setCurrentLyricIndex(findActiveLyricIndex(activeSyncedLyrics, clamped));
    }

    if (currentTrack) {
      const ytId = getYouTubeId(currentTrack);
      if (ytId && ytPlayerRef.current && ytReadyRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
        try {
          ytPlayerRef.current.seekTo(clamped, true);
        } catch {}
      }
    }

    if (audioRef.current && currentTrack?.uploadType === 'file') {
      audioRef.current.currentTime = clamped;
    }
  };

  const nextTrack = useCallback(() => {
    if (repeatMode === 'one' && currentTrack) {
      seek(0);
      togglePlayPause();
      return;
    }

    if (queue.length > 0) {
      const nextSong = queue[0];
      const remainingQueue = queue.slice(1);
      if (currentTrack) {
        setHistory((prev) => [currentTrack, ...prev.slice(0, 49)]);
      }
      playTrack(nextSong, remainingQueue);
    } else if (repeatMode === 'all' && history.length > 0) {
      const firstSong = history[history.length - 1];
      playTrack(firstSong);
    } else {
      setIsPlaying(false);
      stopSynth();
      stopYouTubePolling();
    }
  }, [queue, repeatMode, currentTrack, history, playTrack]);

  const previousTrack = useCallback(() => {
    if (currentTime > 3) {
      seek(0);
      return;
    }

    if (history.length > 0) {
      const prevSong = history[0];
      const remainingHistory = history.slice(1);
      setHistory(remainingHistory);
      if (currentTrack) {
        setQueue((prev) => [currentTrack, ...prev]);
      }
      playTrack(prevSong);
    } else {
      seek(0);
    }
  }, [history, currentTrack, playTrack]);

  const handleTrackEnded = useCallback(() => {
    if (repeatMode === 'one') {
      seek(0);
      if (currentTrack) playTrack(currentTrack);
    } else {
      nextTrack();
    }
  }, [repeatMode, currentTrack, playTrack, nextTrack]);

  useEffect(() => {
    handleTrackEndedRef.current = handleTrackEnded;
  }, [handleTrackEnded]);

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (isMuted && clamped > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => {
      const next = !prev;
      if (next && queue.length > 1) {
        // Shuffle queue
        const shuffled = [...queue].sort(() => Math.random() - 0.5);
        setQueue(shuffled);
      }
      return next;
    });
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const addToQueue = (track: Song) => {
    setQueue((prev) => [...prev, track]);
  };

  const removeFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const reorderQueue = (startIndex: number, endIndex: number) => {
    setQueue((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const toggleLikeCurrentTrack = async () => {
    if (!currentTrack) return;
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId: currentTrack.id })
      });
      const data = await res.json();
      if (data.success) {
        setIsCurrentLiked(data.isLiked);
        setCurrentTrack((prev) => (prev ? { ...prev, likesCount: data.likesCount } : null));
      }
    } catch {}
  };

  const closePlayer = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (ytPlayerRef.current && ytReadyRef.current && typeof ytPlayerRef.current.stopVideo === 'function') {
      try {
        ytPlayerRef.current.stopVideo();
      } catch {}
    }
    stopYouTubePolling();
    stopSynth();
    setCurrentTrack(null);
    setCurrentTime(0);
    currentTimeRef.current = 0;
    setCurrentLyricIndex(0);
    setIsFullScreen(false);
    setIsLyricsOpen(false);
    setIsQueueOpen(false);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        history,
        isFullScreen,
        isLyricsOpen,
        isQueueOpen,
        currentLyricIndex,
        lyricsLanguage,
        setLyricsLanguage,
        lyricsFontSize,
        setLyricsFontSize,
        increaseLyricsFontSize,
        decreaseLyricsFontSize,
        activeSyncedLyrics,
        activePlainLyrics,
        hasSyncedLyrics,
        isLyricsLoading,
        refetchLyrics,
        isResolving,
        unavailableTrackIds,
        playTrack,
        togglePlayPause,
        seek,
        nextTrack,
        previousTrack,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        reorderQueue,
        setIsFullScreen,
        setIsLyricsOpen,
        setIsQueueOpen,
        closePlayer,
        toggleLikeCurrentTrack,
        isCurrentLiked,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
}
