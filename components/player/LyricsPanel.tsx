'use client';

import React, { useEffect, useRef } from 'react';
import { useAudio } from '@/context/AudioContext';
import { X, Mic2 } from 'lucide-react';
import { LyricsControls } from './LyricsControls';

export const LyricsPanel: React.FC = () => {
  const {
    currentTrack,
    isLyricsOpen,
    setIsLyricsOpen,
    currentLyricIndex,
    seek,
    lyricsLanguage,
    setLyricsLanguage,
    lyricsFontSize,
    increaseLyricsFontSize,
    decreaseLyricsFontSize,
    activeSyncedLyrics,
  } = useAudio();

  const activeLineRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLyricIndex]);

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
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#121212]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl p-5 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-emerald-400">
          <Mic2 className="w-5 h-5" />
          <h3 className="font-bold text-base text-white">Lyrics</h3>
        </div>
        <button
          onClick={() => setIsLyricsOpen(false)}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Close lyrics"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Song Mini Info */}
      <div className="flex items-center gap-3 py-3 border-b border-white/5">
        <img
          src={currentTrack.coverImage}
          alt={currentTrack.title}
          className="w-11 h-11 rounded-xl object-cover shadow-md"
        />
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-sm text-white truncate">{currentTrack.title}</h4>
          <p className="text-xs text-neutral-400 truncate">{currentTrack.artistName}</p>
        </div>
      </div>

      {/* Language & Font Size Controls Toolbar */}
      <div className="py-2 border-b border-white/5">
        <LyricsControls
          language={lyricsLanguage}
          onLanguageChange={setLyricsLanguage}
          fontSize={lyricsFontSize}
          onIncreaseFontSize={increaseLyricsFontSize}
          onDecreaseFontSize={decreaseLyricsFontSize}
          variant="panel"
        />
      </div>

      {/* Lyrics Body */}
      <div className="flex-1 overflow-y-auto py-5 space-y-4 select-none pr-2 scrollbar-thin scrollbar-thumb-white/10">
        {activeSyncedLyrics && activeSyncedLyrics.length > 0 ? (
          activeSyncedLyrics.map((line, idx) => {
            const isCurrent = idx === currentLyricIndex;
            const isPast = idx < currentLyricIndex;
            return (
              <p
                key={`${idx}-${line.time}`}
                ref={isCurrent ? activeLineRef : null}
                onClick={() => seek(line.time)}
                className={`${lineFontSizeClass} transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? 'text-emerald-400 scale-[1.03] origin-left drop-shadow-[0_2px_10px_rgba(16,185,129,0.3)]'
                    : isPast
                    ? 'text-white/60 hover:text-white'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {line.text}
              </p>
            );
          })
        ) : currentTrack.lyrics ? (
          <div className="text-sm text-neutral-300 whitespace-pre-line leading-relaxed font-sans">
            {currentTrack.lyrics}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-neutral-500">
            No lyrics available for this track.
          </div>
        )}
      </div>
    </div>
  );
};
