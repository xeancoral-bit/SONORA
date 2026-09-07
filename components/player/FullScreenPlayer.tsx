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
  ChevronDown
} from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { EqualizerAnimation } from './EqualizerAnimation';
import { YouTubePlayer } from './YouTubePlayer';
import { Youtube } from '@/components/ui/icons';
import { LikeButton } from '@/components/ui/LikeButton';
import { LyricsControls } from './LyricsControls';

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
  } = useAudio();

  const isYouTube = Boolean(currentTrack?.sourcePlatform === 'youtube' || currentTrack?.externalMediaId);
  const [activeTab, setActiveTab] = useState<'lyrics' | 'queue' | 'video'>('lyrics');
  const activeLineRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (activeTab === 'lyrics' && activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLyricIndex, activeTab]);

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
      <div className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <button
          onClick={() => setIsFullScreen(false)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
          Minimize
        </button>

        <div className="text-center">
          <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold block">
            Playing from {currentTrack.albumTitle || 'SONORA Masters'}
          </span>
          <span className="text-xs font-bold text-white/90 truncate max-w-xs block">
            {currentTrack.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isYouTube && currentTrack.externalMediaId && (
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all ${
                activeTab === 'video'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Youtube className="w-3.5 h-3.5 inline mr-1 text-current" />
              Video
            </button>
          )}
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all ${
              activeTab === 'lyrics'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Mic2 className="w-3.5 h-3.5 inline mr-1" />
            Lyrics
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all ${
              activeTab === 'queue'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5 inline mr-1" />
            Queue ({queue.length})
          </button>
          <button
            onClick={() => setIsFullScreen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:text-white text-neutral-400 backdrop-blur-md transition-colors ml-1"
            title="Close Fullscreen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Body: Artwork + (Lyrics / Queue) */}
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
        <div className="lg:col-span-6 h-full max-h-[440px] flex flex-col justify-center">
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
            <div className="h-full flex flex-col justify-between pr-2">
              {/* Lyrics Toolbar */}
              <div className="pb-3 mb-1 border-b border-white/10 shrink-0">
                <LyricsControls
                  language={lyricsLanguage}
                  onLanguageChange={setLyricsLanguage}
                  fontSize={lyricsFontSize}
                  onIncreaseFontSize={increaseLyricsFontSize}
                  onDecreaseFontSize={decreaseLyricsFontSize}
                  variant="fullscreen"
                  className="w-full"
                />
              </div>

              {/* Lyrics Scroll Container */}
              <div className="flex-1 overflow-y-auto space-y-6 select-none py-4 pr-3 scrollbar-thin scrollbar-thumb-white/15">
                {activeSyncedLyrics && activeSyncedLyrics.length > 0 ? (
                  activeSyncedLyrics.map((line, idx) => {
                    const isCurrent = idx === currentLyricIndex;
                    return (
                      <p
                        key={`${idx}-${line.time}`}
                        ref={isCurrent ? activeLineRef : null}
                        onClick={() => seek(line.time)}
                        className={`${fsFontSizeClass} transition-all duration-300 cursor-pointer ${
                          isCurrent
                            ? 'text-emerald-400 scale-[1.03] origin-left drop-shadow-[0_4px_25px_rgba(16,185,129,0.4)]'
                            : 'text-white/30 hover:text-white/75'
                        }`}
                      >
                        {line.text}
                      </p>
                    );
                  })
                ) : currentTrack.lyrics ? (
                  <div className="text-base text-neutral-300 whitespace-pre-line leading-relaxed">
                    {currentTrack.lyrics}
                  </div>
                ) : (
                  <div className="text-center py-20 text-neutral-500 font-medium">
                    No lyrics available for this song.
                  </div>
                )}
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
