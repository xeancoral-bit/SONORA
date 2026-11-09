'use client';

import React, { useEffect, useRef } from 'react';
import { useAudio } from '@/context/AudioContext';
import { X, Mic2, Loader2, Music } from 'lucide-react';
import { LyricsControls } from './LyricsControls';
import { formatTime } from '@/lib/utils';
import { useSyncedLyrics } from '@/hooks/useSyncedLyrics';

export const LyricsPanel: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    isLyricsOpen,
    setIsLyricsOpen,
    seek,
    lyricsLanguage,
    setLyricsLanguage,
    lyricsFontSize,
    increaseLyricsFontSize,
    decreaseLyricsFontSize,
    activeSyncedLyrics,
    activePlainLyrics,
    isLyricsLoading,
    refetchLyrics,
  } = useAudio();

  const {
    activeIndex,
    currentLineNumber,
    totalLines,
    isIntro,
    getLineState,
  } = useSyncedLyrics(activeSyncedLyrics, currentTime);

  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const isUserScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth auto-centering on active lyric line
  useEffect(() => {
    if (!isLyricsOpen || isUserScrollingRef.current) return;
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
  }, [activeIndex, isLyricsOpen, isPlaying]);

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

  if (!isLyricsOpen || !currentTrack) return null;

  // Font size classes for the lyrics lines in side panel
  const fontSizeClassMap: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
    sm: 'text-sm font-semibold',
    md: 'text-base sm:text-lg font-bold',
    lg: 'text-lg sm:text-xl font-bold',
    xl: 'text-xl sm:text-2xl font-extrabold',
  };

  const lineFontSizeClass = fontSizeClassMap[lyricsFontSize] || fontSizeClassMap.md;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#111111]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl p-5 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2 text-blue-400">
          <span className="relative flex h-2 w-2">
            <span className={`${isPlaying ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75`}></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <Mic2 className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-sm text-white tracking-wider uppercase font-mono">Live Lyrics</h3>
        </div>
        <button
          onClick={() => setIsLyricsOpen(false)}
          className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close lyrics"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Song Mini Info Card */}
      <div className="flex items-center gap-3 py-3.5 border-b border-white/5">
        <img
          src={currentTrack.coverImage}
          alt={currentTrack.title}
          className="w-12 h-12 rounded-xl object-cover shadow-lg border border-white/10"
        />
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-sm text-white truncate">{currentTrack.title}</h4>
          <p className="text-xs text-neutral-400 truncate mt-0.5">{currentTrack.artistName}</p>
        </div>
        {totalLines > 0 && (
          <span className="text-[10px] font-mono font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full shrink-0">
            {activeIndex >= 0 ? `Line ${currentLineNumber} of ${totalLines}` : `Intro • 1 of ${totalLines}`}
          </span>
        )}
      </div>

      {/* Language & Font Size Controls Toolbar */}
      <div className="py-2.5 border-b border-white/5">
        <LyricsControls
          language={lyricsLanguage}
          onLanguageChange={setLyricsLanguage}
          fontSize={lyricsFontSize}
          onIncreaseFontSize={increaseLyricsFontSize}
          onDecreaseFontSize={decreaseLyricsFontSize}
          variant="panel"
        />
      </div>

      {/* Lyrics Body with Gradient Mask & Auto-centering */}
      <div 
        ref={lyricsContainerRef}
        onWheel={handleContainerScroll}
        onTouchMove={handleContainerScroll}
        className="flex-1 overflow-y-auto space-y-3.5 select-none py-2 pr-2 scrollbar-none scroll-smooth"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        {/* Top Spacer for centering first lines */}
        <div className="h-28 shrink-0 pointer-events-none" />

        {/* Instrumental Intro indicator when vocals haven't started yet */}
        {isIntro && activeSyncedLyrics && activeSyncedLyrics.length > 0 && (
          <div className="flex items-center justify-center py-2 px-3 text-[11px] font-mono text-blue-400/90 gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-3 animate-in fade-in duration-300 select-none">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400"></span>
            </span>
            <span>♪ Intro • Vocals start at {formatTime(activeSyncedLyrics[0].time)}</span>
          </div>
        )}

        {isLyricsLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-400">
            <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
            <p className="text-xs font-medium tracking-wide">Syncing lyrics with audio...</p>
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
                className={`group/line relative flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-500 ease-out ${
                  isCurrent
                    ? 'bg-gradient-to-r from-blue-500/15 via-blue-500/5 to-transparent border border-blue-500/30 shadow-md scale-[1.02] origin-left'
                    : isPast
                    ? 'opacity-35 hover:opacity-80 hover:bg-white/5'
                    : 'opacity-55 hover:opacity-90 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Glowing active indicator bar */}
                  <div
                    className={`w-1 h-5 rounded-full transition-all duration-500 shrink-0 ${
                      isCurrent
                        ? 'bg-blue-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] opacity-100 scale-y-100'
                        : 'opacity-0 scale-y-0'
                    }`}
                  />

                  <p
                    className={`${lineFontSizeClass} transition-all duration-500 leading-snug tracking-tight ${
                      isCurrent
                        ? 'text-white font-extrabold drop-shadow-[0_2px_15px_rgba(52,211,153,0.4)]'
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
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-300 bg-blue-500/20 border border-blue-500/40 px-2 py-0.5 rounded-full shrink-0 shadow-sm animate-in fade-in zoom-in-95 duration-200 select-none">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className={`${isPlaying ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75`}></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400"></span>
                    </span>
                    {formatTime(line.time)}
                  </span>
                ) : (
                  <span className="opacity-0 group-hover/line:opacity-100 text-[9px] font-mono text-neutral-400 bg-white/10 px-1.5 py-0.5 rounded transition-opacity duration-150 shrink-0 select-none">
                    {formatTime(line.time)}
                  </span>
                )}
              </div>
            );
          })
        ) : (activePlainLyrics || currentTrack.lyrics) ? (
          <div className="py-2 px-1 space-y-4 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-400">
              <Music className="w-3.5 h-3.5 text-blue-400" />
              <span>Full Lyrics</span>
            </div>
            <div className="text-sm sm:text-base text-neutral-200 whitespace-pre-line leading-relaxed font-sans font-medium select-text">
              {activePlainLyrics || (typeof currentTrack.lyrics === 'string' ? currentTrack.lyrics : '')}
            </div>
          </div>
        ) : Array.isArray(currentTrack.lyrics) && currentTrack.lyrics.length > 0 ? (
          <div className="space-y-3 px-1">
            {currentTrack.lyrics.map((line: any, idx: number) => (
              <p key={idx} className="text-sm font-semibold text-neutral-300">
                {typeof line === 'string' ? line : line.text}
              </p>
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
              <Mic2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Live Lyrics Ready</h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-[220px]">
                Fetch and match verified lyrics for &quot;{currentTrack.title}&quot;.
              </p>
            </div>
            <button
              onClick={() => refetchLyrics()}
              className="mt-2 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-400 text-black text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Mic2 className="w-3.5 h-3.5" />
              Sync Lyrics Now
            </button>
          </div>
        )}

        {/* Bottom Spacer for centering last lines */}
        <div className="h-28 shrink-0 pointer-events-none" />
      </div>
    </div>
  );
};
