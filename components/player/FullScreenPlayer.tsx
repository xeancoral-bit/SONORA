'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Mic2,
  ListMusic,
  Sparkles,
  ChevronDown,
  Loader2,
  Music
} from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { EqualizerAnimation } from './EqualizerAnimation';
import { YouTubePlayer } from './YouTubePlayer';
import { Youtube } from '@/components/ui/icons';
import { LikeButton } from '@/components/ui/LikeButton';
import { LyricsControls } from './LyricsControls';
import { useSyncedLyrics } from '@/hooks/useSyncedLyrics';

export const FullScreenPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    isFullScreen,
    setIsFullScreen,
    playTrack,
    togglePlayPause,
    seek,
    nextTrack,
    previousTrack,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLikeCurrentTrack,
    isCurrentLiked,
    currentLyricIndex,
    lyricsLanguage,
    setLyricsLanguage,
    lyricsFontSize,
    increaseLyricsFontSize,
    decreaseLyricsFontSize,
    activeSyncedLyrics,
    isLyricsLoading,
  } = useAudio();

  const {
    activeIndex,
    currentLineNumber,
    totalLines,
    isIntro,
    getLineState,
  } = useSyncedLyrics(activeSyncedLyrics, currentTime);

  const isYouTube = Boolean(currentTrack?.sourcePlatform === 'youtube' || currentTrack?.externalMediaId);
  const [activeTab, setActiveTab] = useState<'lyrics' | 'queue' | 'video' | 'disk'>('lyrics');
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const isUserScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth auto-centering on active lyric line
  useEffect(() => {
    if (activeTab !== 'lyrics' || isUserScrollingRef.current) return;
    const container = lyricsContainerRef.current;
    if (!container) return;

    if (activeIndex === -1) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const activeEl = activeLineRef.current;
    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const lineRect = activeEl.getBoundingClientRect();
      const relativeTop = lineRect.top - containerRect.top;
      const targetScroll = container.scrollTop + relativeTop - (containerRect.height / 2) + (lineRect.height / 2);
      
      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, [activeIndex, activeTab, isPlaying]);

  const handleContainerScroll = () => {
    isUserScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
      if (lyricsContainerRef.current && activeLineRef.current) {
        const container = lyricsContainerRef.current;
        const activeEl = activeLineRef.current;
        const containerRect = container.getBoundingClientRect();
        const lineRect = activeEl.getBoundingClientRect();
        const relativeTop = lineRect.top - containerRect.top;
        const targetScroll = container.scrollTop + relativeTop - (containerRect.height / 2) + (lineRect.height / 2);
        container.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth',
        });
      }
    }, 4000);
  };

  const fullScreenFontSizeMap: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
    sm: 'text-xl md:text-2xl font-bold',
    md: 'text-2xl md:text-3xl font-extrabold',
    lg: 'text-3xl md:text-4xl font-black',
    xl: 'text-4xl md:text-5xl font-black',
  };
  const fsFontSizeClass = fullScreenFontSizeMap[lyricsFontSize] || fullScreenFontSizeMap.md;

  if (!isFullScreen || !currentTrack) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Dynamic Ambient Blur Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-35 scale-125 pointer-events-none transition-all duration-1000 animate-ambient-pulse"
        style={{ backgroundImage: `url(${currentTrack.coverImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/60 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full pt-4 px-4 sm:px-6 md:pt-6 md:px-8 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
          {/* Main Top Row */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4 w-full">
            {/* Left: Minimize button */}
            <div className="flex items-center justify-start">
              <button
                onClick={() => setIsFullScreen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-all shadow-sm group"
                title="Minimize player"
                aria-label="Minimize player"
              >
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                <span className="hidden sm:inline">Minimize</span>
              </button>
            </div>

            {/* Center: Track info & Album context — ALWAYS 100% VISIBLE & CLEANLY CENTERED */}
            <div className="flex flex-col items-center justify-center min-w-0 text-center px-2 select-none">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-emerald-400 font-bold block truncate max-w-[200px] xs:max-w-[240px] sm:max-w-md md:max-w-lg">
                Playing from {currentTrack.albumTitle || 'SONORA Masters'}
              </span>
              <span className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight block truncate max-w-[200px] xs:max-w-[240px] sm:max-w-md md:max-w-lg mt-0.5 drop-shadow-sm">
                {currentTrack.title}
              </span>
            </div>

            {/* Right: Desktop tab controls + Close */}
            <div className="flex items-center justify-end gap-2">
              {/* Desktop Segmented Tab Switcher (Visible on md and up) */}
              <div className="hidden md:flex items-center p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-sm gap-1">
                {isYouTube && currentTrack.externalMediaId && (
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      activeTab === 'video'
                        ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Youtube className="w-3.5 h-3.5 inline mr-1 text-current" />
                    Video
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('disk')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeTab === 'disk'
                      ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="inline-block w-3.5 h-3.5 mr-1 align-middle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </span>
                  Disk
                </button>
                <button
                  onClick={() => setActiveTab('lyrics')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeTab === 'lyrics'
                      ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Mic2 className="w-3.5 h-3.5 inline mr-1" />
                  Lyrics
                </button>
                <button
                  onClick={() => setActiveTab('queue')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeTab === 'queue'
                      ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ListMusic className="w-3.5 h-3.5 inline mr-1" />
                  Queue ({queue.length})
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsFullScreen(false)}
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 hover:text-white text-neutral-300 backdrop-blur-md border border-white/10 transition-colors"
                title="Close Fullscreen"
                aria-label="Close Fullscreen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Segmented Tab Capsule Bar (Visible only on < md) */}
          <div className="flex md:hidden items-center justify-center w-full pb-0.5">
            <div className="inline-flex items-center p-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 shadow-xl gap-1 max-w-full overflow-x-auto">
              {isYouTube && currentTrack.externalMediaId && (
                <button
                  onClick={() => setActiveTab('video')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeTab === 'video'
                      ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5 text-current" />
                  <span>Video</span>
                </button>
              )}
              <button
                onClick={() => setActiveTab('disk')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'disk'
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Disk</span>
              </button>
              <button
                onClick={() => setActiveTab('lyrics')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'lyrics'
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Mic2 className="w-3.5 h-3.5" />
                <span>Lyrics</span>
              </button>
              <button
                onClick={() => setActiveTab('queue')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'queue'
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <ListMusic className="w-3.5 h-3.5" />
                <span>Queue {queue.length > 0 ? `(${queue.length})` : ''}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Center Body: Disk-only mode (centered, full-area) */}
      {activeTab === 'disk' ? (
        <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden">
          {/* Large centered vinyl disk */}
          <div
            className={`relative vinyl-spin ${isPlaying ? 'is-playing' : ''}`}
            style={{ width: 'clamp(280px, 55vmin, 560px)', height: 'clamp(280px, 55vmin, 560px)' }}
          >
            {/* Disk body */}
            <div className="absolute inset-0 rounded-full bg-[#111] shadow-2xl shadow-black/80 border border-white/10" />

            {/* Album cover clipped to circle */}
            <div className="absolute inset-[10%] rounded-full overflow-hidden shadow-inner">
              <img
                src={currentTrack.coverImage}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
                style={{ borderRadius: '50%' }}
              />
            </div>

            {/* Vinyl groove rings overlay */}
            <div className="absolute inset-0 rounded-full vinyl-grooves pointer-events-none" />

            {/* Outer vinyl ring highlight */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 38% 30%, rgba(255,255,255,0.06) 0%, transparent 50%)',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.7), 0 0 80px rgba(0,0,0,0.9)'
              }}
            />

            {/* Center label + spindle */}
            <div className="vinyl-label">
              <div
                style={{
                  width: '22%',
                  height: '22%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #1c1c1c 60%, #0d0d0d 100%)',
                  border: '2px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 0 14px rgba(0,0,0,1), inset 0 0 8px rgba(255,255,255,0.04)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Spindle green dot */}
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#10B981',
                    boxShadow: '0 0 10px #10B981, 0 0 20px rgba(16,185,129,0.6)'
                  }}
                />
              </div>
            </div>

            {/* Glowing emerald ring under disk when playing */}
            {isPlaying && (
              <div
                className="absolute rounded-full pointer-events-none animate-ambient-pulse"
                style={{
                  inset: '-10px',
                  boxShadow: '0 0 70px rgba(16,185,129,0.25), 0 0 130px rgba(16,185,129,0.10)'
                }}
              />
            )}
          </div>
        </div>
      ) : (
      /* Center Body: Split layout — Artwork left + (Lyrics / Queue / Video) right */
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-6 md:px-16 overflow-y-auto py-4">
        {/* Left: Spinning Vinyl Disk Art */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center gap-6">
          {/* Vinyl wrapper — spins when playing */}
          <div
            className={`relative vinyl-spin ${isPlaying ? 'is-playing' : ''}`}
            style={{ width: 'clamp(220px, 40vw, 380px)', height: 'clamp(220px, 40vw, 380px)' }}
          >
            {/* Disk body */}
            <div className="absolute inset-0 rounded-full bg-[#111] shadow-2xl shadow-black/80 border border-white/10" />

            {/* Album cover clipped to circle */}
            <div className="absolute inset-[10%] rounded-full overflow-hidden shadow-inner">
              <img
                src={currentTrack.coverImage}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
                style={{ borderRadius: '50%' }}
              />
            </div>

            {/* Vinyl groove rings overlay */}
            <div className="absolute inset-0 rounded-full vinyl-grooves pointer-events-none" />

            {/* Outer vinyl ring highlight */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 38% 30%, rgba(255,255,255,0.05) 0%, transparent 50%)',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.8)'
              }}
            />

            {/* Center label + spindle */}
            <div className="vinyl-label">
              <div
                style={{
                  width: '22%',
                  height: '22%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #1c1c1c 60%, #0d0d0d 100%)',
                  border: '2px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 0 14px rgba(0,0,0,1), inset 0 0 8px rgba(255,255,255,0.04)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Spindle green dot */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#10B981',
                    boxShadow: '0 0 8px #10B981, 0 0 16px rgba(16,185,129,0.5)'
                  }}
                />
              </div>
            </div>

            {/* Glowing emerald ring under disk when playing */}
            {isPlaying && (
              <div
                className="absolute rounded-full pointer-events-none animate-ambient-pulse"
                style={{
                  inset: '-6px',
                  boxShadow: '0 0 50px rgba(16,185,129,0.2), 0 0 100px rgba(16,185,129,0.08)'
                }}
              />
            )}
          </div>

          {/* Track info + like */}
          <div className="text-center max-w-md">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {currentTrack.title}
              </h1>
              <LikeButton
                isLiked={isCurrentLiked}
                onToggle={toggleLikeCurrentTrack}
                size="lg"
              />
            </div>
            <p className="text-base text-neutral-400 mt-1 font-medium">
              {currentTrack.artistName} {currentTrack.albumTitle ? `• ${currentTrack.albumTitle}` : ''}
            </p>
          </div>
        </div>

        {/* Right: Synced Lyrics, Queue, or Video */}
        <div className="lg:col-span-6 h-full max-h-[580px] flex flex-col justify-center">
          {activeTab === 'video' && isYouTube && currentTrack.externalMediaId ? (
            <div className="h-full flex flex-col justify-center items-center p-2">
              <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                <YouTubePlayer
                  videoId={currentTrack.externalMediaId}
                  title={currentTrack.title}
                  artistName={currentTrack.artistName}
                  isPlaying={isPlaying}
                  className="w-full"
                />
              </div>
            </div>
          ) : activeTab === 'lyrics' ? (
            <div className="h-full flex flex-col rounded-3xl bg-black/45 backdrop-blur-2xl border border-white/10 p-5 md:p-7 shadow-2xl overflow-hidden relative">
              {/* Lyrics Top Header Toolbar */}
              <div className="flex items-center justify-between gap-3 pb-4 mb-2 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white tracking-wider uppercase font-mono">
                    <Mic2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-neutral-200">Live Lyrics</span>
                  </div>
                  {totalLines > 0 && (
                    <span className="hidden sm:inline-block text-[10px] font-semibold text-neutral-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                      {activeIndex >= 0 ? `Line ${currentLineNumber} of ${totalLines}` : `Intro • 1 of ${totalLines}`}
                    </span>
                  )}
                </div>

                <div className="shrink-0">
                  <LyricsControls
                    language={lyricsLanguage}
                    onLanguageChange={setLyricsLanguage}
                    fontSize={lyricsFontSize}
                    onIncreaseFontSize={increaseLyricsFontSize}
                    onDecreaseFontSize={decreaseLyricsFontSize}
                    variant="fullscreen"
                  />
                </div>
              </div>

              {/* Lyrics Scroll Container with Smooth Gradient Mask */}
              <div 
                ref={lyricsContainerRef}
                onWheel={handleContainerScroll}
                onTouchMove={handleContainerScroll}
                className="flex-1 overflow-y-auto space-y-3.5 select-none py-2 pr-3 scrollbar-none scroll-smooth"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
                }}
              >
                {/* Top spacer to allow first lines to vertically center */}
                <div className="h-36 shrink-0 pointer-events-none" />

                {/* Instrumental Intro indicator when vocals haven't started yet */}
                {isIntro && activeSyncedLyrics && activeSyncedLyrics.length > 0 && (
                  <div className="flex items-center justify-center py-2.5 px-4 text-xs font-mono text-emerald-400/90 gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-3 animate-in fade-in duration-300 select-none">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>♪ Instrumental Intro</span>
                    <span>•</span>
                    <span>Vocals start at {formatTime(activeSyncedLyrics[0].time)}</span>
                  </div>
                )}

                {isLyricsLoading ? (
                  <div className="py-24 flex flex-col items-center justify-center gap-3 text-neutral-400 animate-in fade-in duration-200">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                    <p className="text-sm font-medium tracking-wide">Syncing lyrics with audio...</p>
                  </div>
                ) : activeSyncedLyrics && activeSyncedLyrics.length > 0 ? (
                  activeSyncedLyrics.map((line, idx) => {
                    const state = getLineState(idx);
                    const isCurrent = state === 'active';
                    const isPast = state === 'past';
                    return (
                      <div
                        key={`${idx}-${line.time}`}
                        ref={isCurrent ? activeLineRef : null}
                        onClick={() => {
                          isUserScrollingRef.current = false;
                          seek(line.time);
                        }}
                        className={`group/line relative flex items-center justify-between gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-500 ease-out ${
                          isCurrent
                            ? 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/30 shadow-lg shadow-emerald-500/5 scale-[1.03] origin-left'
                            : isPast
                            ? 'opacity-35 hover:opacity-80 hover:bg-white/5'
                            : 'opacity-55 hover:opacity-90 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          {/* Glowing active indicator bar */}
                          <div
                            className={`w-1.5 h-6 rounded-full transition-all duration-500 shrink-0 ${
                              isCurrent
                                ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] opacity-100 scale-y-100'
                                : 'opacity-0 scale-y-0'
                            }`}
                          />

                          <p
                            className={`${fsFontSizeClass} transition-all duration-500 leading-snug tracking-tight ${
                              isCurrent
                                ? 'text-white font-black drop-shadow-[0_2px_24px_rgba(52,211,153,0.45)]'
                                : isPast
                                ? 'text-neutral-400 font-semibold'
                                : 'text-neutral-200 font-bold'
                            }`}
                          >
                            {line.text}
                          </p>
                        </div>

                        {/* Timestamp indicator */}
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 rounded-full shrink-0 shadow-sm animate-in fade-in zoom-in-95 duration-200 select-none">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className={`${isPlaying ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75`}></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                            </span>
                            {formatTime(line.time)}
                          </span>
                        ) : (
                          <span className="opacity-0 group-hover/line:opacity-100 text-[10px] font-mono text-neutral-400 bg-white/10 px-2 py-0.5 rounded-full transition-opacity duration-150 shrink-0 select-none">
                            {formatTime(line.time)}
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : currentTrack.lyrics ? (
                  <div className="text-lg text-neutral-200 whitespace-pre-line leading-relaxed font-sans px-2">
                    {currentTrack.lyrics}
                  </div>
                ) : (
                  <div className="py-24 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500">
                      <Music className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Lyrics unavailable</h4>
                      <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                        No synchronized lyrics were found for this track.
                      </p>
                    </div>
                  </div>
                )}

                {/* Bottom spacer to allow last lines to vertically center */}
                <div className="h-36 shrink-0 pointer-events-none" />
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto space-y-2 pr-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Up Next in Queue
              </h4>
              {queue.length === 0 ? (
                <p className="text-neutral-500 text-sm py-8 text-center">
                  No more songs in queue.
                </p>
              ) : (
                queue.map((track, idx) => (
                  <div
                    key={`${track.id}-${idx}`}
                    onClick={() => playTrack(track, queue.slice(idx + 1))}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
                  >
                    <img
                      src={track.coverImage}
                      alt={track.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-sm text-white truncate">{track.title}</h5>
                      <span className="text-xs text-neutral-400 truncate">{track.artistName}</span>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      {formatTime(track.duration)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      )}

      {/* Bottom Controls Area */}
      <div className="relative z-10 p-6 md:px-16 md:pb-10 max-w-4xl mx-auto w-full flex flex-col gap-4">
        {/* Progress Slider with glowing emerald fill */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs font-mono text-neutral-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1 group">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              style={{
                background: `linear-gradient(to right, #10B981 0%, #10B981 ${
                  duration > 0 ? (currentTime / duration) * 100 : 0
                }%, rgba(255, 255, 255, 0.2) ${
                  duration > 0 ? (currentTime / duration) * 100 : 0
                }%, rgba(255, 255, 255, 0.2) 100%)`
              }}
              className="w-full h-2 group-hover:h-2.5 rounded-full appearance-none cursor-pointer focus:outline-none transition-all"
            />
          </div>
          <span className="text-xs font-mono text-neutral-400 w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center justify-between">
          {/* Left: Shuffle & Repeat */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-colors ${
                isShuffle ? 'text-emerald-400' : 'text-neutral-400 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full transition-colors ${
                repeatMode !== 'off' ? 'text-emerald-400' : 'text-neutral-400 hover:text-white'
              }`}
              title="Repeat"
            >
              {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
            </button>
          </div>

          {/* Center: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-6">
            <button
              onClick={previousTrack}
              className="p-3 text-neutral-300 hover:text-white transition-transform active:scale-90"
              title="Previous"
            >
              <SkipBack className="w-7 h-7 fill-current" />
            </button>
            <button
              onClick={togglePlayPause}
              className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-black" />
              ) : (
                <Play className="w-7 h-7 fill-black ml-1" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="p-3 text-neutral-300 hover:text-white transition-transform active:scale-90"
              title="Next"
            >
              <SkipForward className="w-7 h-7 fill-current" />
            </button>
          </div>

          {/* Right: Volume Slider with glowing green fill */}
          <div className="flex items-center gap-2 w-32">
            <button onClick={toggleMute} className="text-neutral-400 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{
                background: `linear-gradient(to right, #10B981 0%, #10B981 ${
                  (isMuted ? 0 : volume) * 100
                }%, rgba(255, 255, 255, 0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
              }}
              className="w-full h-1.5 hover:h-2 rounded-full appearance-none cursor-pointer focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
