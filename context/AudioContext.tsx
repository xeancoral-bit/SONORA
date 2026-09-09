'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Song, SyncedLyricLine } from '@/lib/types';
import { synthEngine } from '@/lib/audioSynth';
import { extractYouTubeId } from '@/lib/urlUtils';
import { getSyncedLyricsForSong } from '@/lib/lyricsService';
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
  isLyricsLoading: boolean;
  
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
              playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                rel: 0,
                playsinline: 1,
                enablejsapi: 1,
                origin: window.location.origin
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
          setCurrentTime((prev) => (Math.abs(prev - cur) >= 0.03 ? cur : prev));
          rafId = requestAnimationFrame(trackAudioTime);
        }
      };

      audio.addEventListener('timeupdate', () => {
        const cur = audio.currentTime;
        setCurrentTime((prev) => (Math.abs(prev - cur) >= 0.03 ? cur : prev));
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration((prev) => (Math.abs(prev - audio.duration) >= 0.5 ? audio.duration : prev));
        }
      });

      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      });

      audio.addEventListener('ended', () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
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
  const [isLyricsLoading, setIsLyricsLoading] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const lyricsFetchAbortRef = useRef<AbortController | null>(null);

  // Ref to track latest lyrics fetch request to avoid race conditions
  const lyricsFetchIdRef = useRef<number>(0);
  // Ref to hold the identifier used for fetching (trackId or externalMediaId)
  const currentLyricsIdRef = useRef<string>('');

  // Fetch synced lyrics when track identifier or language changes
  useEffect(() => {
    // Clear any existing lyrics immediately when track or language changes
    setActiveSyncedLyrics([]);
    setCurrentLyricIndex(0);

    // If no valid lyric identifier, nothing to fetch
    if (!lyricId) {
      setIsLyricsLoading(false);
      return;
    }

    // Increment request id to invalidate previous fetches
    const requestId = ++lyricsFetchIdRef.current;
    const controller = new AbortController();
    lyricsFetchAbortRef.current = controller;
    setIsLyricsLoading(true);

    const fetchLyrics = async () => {
      try {
        // Build query: always include the primary song id; also include externalMediaId for YouTube tracks
        const params = new URLSearchParams({
          trackId: lyricId,
          lang: lyricsLanguage,
        });
        if (currentTrack?.externalMediaId) {
          params.set('externalId', currentTrack.externalMediaId);
        }
        const res = await fetch(`/api/lyrics?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Lyrics fetch failed: ${res.status}`);
        const data = await res.json();
        // Apply only if this is still the latest request (race-condition guard)
        if (lyricsFetchIdRef.current === requestId) {
          setActiveSyncedLyrics(data.lyrics ?? []);
          setCurrentLyricIndex(0);
          setIsLyricsLoading(false);
        }
      } catch (err: any) {
        // Ignore AbortError — it means the request was intentionally cancelled
        if (err?.name === 'AbortError') return;
        if (lyricsFetchIdRef.current === requestId) {
          setActiveSyncedLyrics([]);
          setCurrentLyricIndex(0);
          setIsLyricsLoading(false);
        }
      }
    };
    fetchLyrics();
    return () => {
      controller.abort();
    };
  }, [lyricId, lyricsLanguage]);

  // Update current lyric index based on real-time audio playback
  useEffect(() => {
    setCurrentLyricIndex(findActiveLyricIndex(activeSyncedLyrics, currentTime));
  }, [currentTime, activeSyncedLyrics]);

  const getYouTubeId = (track: Song): string | null => {
    if (track.externalMediaId) return track.externalMediaId;
    if (track.sourcePlatform === 'youtube') {
      return extractYouTubeId(track.audioUrl || track.sourceUrl || '') || null;
    }
    if (track.audioUrl) {
      return extractYouTubeId(track.audioUrl) || null;
    }
    return null;
  };

  const startYouTubePolling = () => {
    if (ytPollTimerRef.current) clearInterval(ytPollTimerRef.current);
    ytPollTimerRef.current = setInterval(() => {
      if (ytPlayerRef.current && ytReadyRef.current) {
        try {
          const state = typeof ytPlayerRef.current.getPlayerState === 'function' ? ytPlayerRef.current.getPlayerState() : -1;
          if (state === 1 || state === 3 || isPlayingRef.current) {
            const cur = ytPlayerRef.current.getCurrentTime();
            const dur = ytPlayerRef.current.getDuration();
            if (typeof cur === 'number' && !isNaN(cur)) {
              setCurrentTime((prev) => (Math.abs(prev - cur) >= 0.03 ? cur : prev));
            }
            if (typeof dur === 'number' && !isNaN(dur) && dur > 0) {
              setDuration((prev) => (Math.abs(prev - dur) >= 0.5 ? dur : prev));
            }
          }
        } catch {}
      }
    }, 50);
  };

  const stopYouTubePolling = () => {
    if (ytPollTimerRef.current) {
      clearInterval(ytPollTimerRef.current);
      ytPollTimerRef.current = null;
    }
  };

  const playTrack = useCallback((track: Song, newQueue?: Song[]) => {
    stopSynth();
    stopYouTubePolling();
    playLoggedRef.current = false;
    setCurrentTrack(track);
    setCurrentTime(0);
    setActiveSyncedLyrics([]);
    setCurrentLyricIndex(0);
    setDuration(track.duration || 180);

    if (newQueue) {
      setQueue(newQueue.filter((s) => s.id !== track.id));
    }

    const ytId = getYouTubeId(track);

    if (ytId) {
      // Pause HTML5 audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      if (ytReadyRef.current && ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
        try {
          ytPlayerRef.current.loadVideoById(ytId);
          ytPlayerRef.current.setVolume((isMuted ? 0 : volume) * 100);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          startYouTubePolling();
        } catch (err) {
          console.warn('Error loading video via YouTube player API:', err);
          startSyntheticPlayback(track);
        }
      } else {
        pendingYtVideoIdRef.current = ytId;
        setIsPlaying(true);
        startYouTubePolling();
      }
      return;
    }

    // Direct Audio or Synthesizer track: stop YouTube player
    if (ytPlayerRef.current && ytReadyRef.current && typeof ytPlayerRef.current.stopVideo === 'function') {
      try {
        ytPlayerRef.current.stopVideo();
      } catch {}
    }

    const audioSource = track.audioPath || track.audioUrl;
    if (audioSource && audioRef.current) {
      audioRef.current.src = audioSource;
      audioRef.current.play().catch((err) => {
        console.warn('Audio file play fallback to synthesizer:', err);
        startSyntheticPlayback(track);
      });
    } else {
      startSyntheticPlayback(track);
    }
  }, [volume, isMuted]);

  const startSyntheticPlayback = (track: Song) => {
    if (synthEngine) {
      synthEngine.play(track.synthPreset || 'chill', 85);
    }
    setIsPlaying(true);
    let time = 0;
    const targetDuration = track.duration || 180;
    setDuration(targetDuration);

    synthTimerRef.current = setInterval(() => {
      time += 0.5;
      setCurrentTime(time);
      if (time >= targetDuration) {
        handleTrackEndedRef.current();
      }
    }, 500);
  };

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

    if (isPlaying) {
      if (audioRef.current && (currentTrack.audioPath || currentTrack.audioUrl)) {
        audioRef.current.pause();
      }
      stopSynth();
      setIsPlaying(false);
    } else {
      const audioSource = currentTrack.audioPath || currentTrack.audioUrl;
      if (audioSource && audioRef.current) {
        audioRef.current.play().catch(() => startSyntheticPlayback(currentTrack));
      } else {
        startSyntheticPlayback(currentTrack);
      }
      setIsPlaying(true);
    }
  };

  const seek = (seconds: number) => {
    const clamped = Math.max(0, Math.min(duration || 1000, seconds));
    setCurrentTime(clamped);
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

    if (audioRef.current && (currentTrack?.audioPath || currentTrack?.audioUrl)) {
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

  handleTrackEndedRef.current = handleTrackEnded;

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
        isLyricsLoading,
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
