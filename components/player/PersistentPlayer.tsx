'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAudio } from '@/context/AudioContext';
import {
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
  Maximize2,
  ChevronUp,
  X,
  Sliders,
  CloudRain,
  Moon
} from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { FullScreenPlayer } from './FullScreenPlayer';
import { LyricsPanel } from './LyricsPanel';
import { QueueDrawer } from './QueueDrawer';
import { LikeButton } from '@/components/ui/LikeButton';
import { EqualizerAnimation } from './EqualizerAnimation';
import { EqualizerModal } from './EqualizerModal';
import { AmbientSoundscapeModal } from './AmbientSoundscapeModal';
import { SleepTimerModal } from './SleepTimerModal';
import { useAlbumColor } from '@/hooks/useAlbumColor';
import { ambientEngine } from '@/lib/ambientAudio';
import { getOptimizedCoverUrl, handleImageError } from '@/lib/imageUtils';

export const PersistentPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isLyricsOpen,
    isQueueOpen,
    togglePlayPause,
    seek,
    nextTrack,
    previousTrack,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setIsFullScreen,
    setIsLyricsOpen,
    setIsQueueOpen,
    closePlayer,
    toggleLikeCurrentTrack,
    isCurrentLiked
  } = useAudio();

  const [isEqOpen, setIsEqOpen] = useState(false);
  const [isAmbientOpen, setIsAmbientOpen] = useState(false);
  const [isSleepOpen, setIsSleepOpen] = useState(false);
  const [isAmbientActive, setIsAmbientActive] = useState(false);

  const [sleepSecondsLeft, setSleepSecondsLeft] = useState<number | null>(null);
  const [sleepFade, setSleepFade] = useState(true);
  const initialVolumeRef = useRef<number>(volume);
  const isEndOfTrackTimerRef = useRef<boolean>(false);

  // Sync ambient active indicator
  useEffect(() => {
    const checkState = () => {
      setIsAmbientActive(ambientEngine.getState().enabled);
    };
    checkState();
    const interval = setInterval(checkState, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle setting sleep timer
  const handleSetSleepTimer = (target: number | 'end_of_track', enableFade: boolean) => {
    setSleepFade(enableFade);
    initialVolumeRef.current = volume;
    if (target === 'end_of_track') {
      isEndOfTrackTimerRef.current = true;
      const remaining = Math.max(1, Math.round(duration - currentTime));
      setSleepSecondsLeft(remaining);
    } else {
      isEndOfTrackTimerRef.current = false;
      setSleepSecondsLeft(target * 60);
    }
  };

  const handleCancelSleepTimer = () => {
    setSleepSecondsLeft(null);
    isEndOfTrackTimerRef.current = false;
    if (initialVolumeRef.current) {
      setVolume(initialVolumeRef.current);
    }
  };

  // Sleep countdown effect
  useEffect(() => {
    if (sleepSecondsLeft === null) return;

    if (sleepSecondsLeft <= 0) {
      if (isPlaying) togglePlayPause();
      if (initialVolumeRef.current) {
        setVolume(initialVolumeRef.current);
      }
      setSleepSecondsLeft(null);
      isEndOfTrackTimerRef.current = false;
      return;
    }

    // Exponential fade in the last 120 seconds
    if (sleepFade && sleepSecondsLeft <= 120 && sleepSecondsLeft > 0) {
      const ratio = sleepSecondsLeft / 120;
      setVolume(Math.max(0.02, initialVolumeRef.current * ratio));
    }

    const timer = setInterval(() => {
      setSleepSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepSecondsLeft, isPlaying, sleepFade, togglePlayPause, setVolume]);

  const { glowStyle } = useAlbumColor(currentTrack?.coverImage);

  if (!currentTrack) return null;

  return (
    <>
      {/* Persistent Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 mb-[56px] md:mb-0 bg-[#181818] border-t border-white/10 px-4 py-2 shadow-2xl transition-all select-none overflow-hidden">
        {/* Dynamic Ambient Album Backlight Glow */}
        <div
          className="absolute inset-0 -top-12 -z-10 pointer-events-none transition-all duration-700 blur-2xl opacity-60"
          style={glowStyle}
        />
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-6">
          {/* LEFT: Artwork, Title, Artist, Like */}
          <div className="flex items-center gap-3 min-w-0 md:w-1/4">
            <div
              onClick={() => setIsFullScreen(true)}
              className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-neutral-800 shadow-md cursor-pointer group border border-white/10"
            >
              <img
                src={getOptimizedCoverUrl(currentTrack.coverImage, currentTrack.artistName, currentTrack.title, currentTrack.albumTitle, 'song')}
                alt={currentTrack.title}
                onError={(e) => handleImageError(e, currentTrack.artistName, currentTrack.title, currentTrack.albumTitle, 'song')}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <ChevronUp className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span
                  onClick={() => setIsFullScreen(true)}
                  className="font-bold text-xs md:text-sm text-white truncate cursor-pointer hover:underline hover:text-blue-400 transition-colors"
                >
                  {currentTrack.title}
                </span>
                {isPlaying && <EqualizerAnimation isPlaying={isPlaying} />}
              </div>
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/artists/${currentTrack.artistId}`}
                  className="text-[11px] md:text-xs text-neutral-400 hover:text-white truncate transition-colors"
                >
                  {currentTrack.artistName}
                </Link>
              </div>
            </div>

            <LikeButton
              isLiked={isCurrentLiked}
              onToggle={toggleLikeCurrentTrack}
              size="sm"
            />
          </div>

          {/* CENTER: Playback Controls & Progress Bar */}
          <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl">
            {/* Control buttons */}
            <div className="flex items-center gap-3 md:gap-5">
              <button
                onClick={toggleShuffle}
                className={`p-1.5 transition-colors hidden sm:block ${
                  isShuffle ? 'text-blue-400' : 'text-neutral-400 hover:text-white'
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={previousTrack}
                className="p-1 text-neutral-300 hover:text-white transition-colors"
                title="Previous track"
              >
                <SkipBack className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              </button>

              <button
                onClick={togglePlayPause}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-500 hover:bg-blue-400 text-black flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 md:w-5 md:h-5 fill-black" />
                ) : (
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-black ml-0.5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-1 text-neutral-300 hover:text-white transition-colors"
                title="Next track"
              >
                <SkipForward className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-1.5 transition-colors hidden sm:block ${
                  repeatMode !== 'off' ? 'text-blue-400' : 'text-neutral-400 hover:text-white'
                }`}
                title="Repeat mode"
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Timeline Seek Bar with dynamic glowing green fill */}
            <div className="flex items-center gap-2.5 w-full">
              <span className="text-[11px] font-mono text-neutral-400 w-8 text-right hidden sm:block">
                {formatTime(currentTime)}
              </span>
              <div className="relative flex-1 flex items-center group">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #2563EB 0%, #2563EB ${
                      duration > 0 ? (currentTime / duration) * 100 : 0
                    }%, rgba(255, 255, 255, 0.18) ${
                      duration > 0 ? (currentTime / duration) * 100 : 0
                    }%, rgba(255, 255, 255, 0.18) 100%)`
                  }}
                  className="w-full h-1.5 group-hover:h-2 rounded-full appearance-none cursor-pointer transition-all focus:outline-none"
                  title={`${Math.round(duration > 0 ? (currentTime / duration) * 100 : 0)}%`}
                />
              </div>
              <span className="text-[11px] font-mono text-neutral-400 w-8 hidden sm:block">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* RIGHT: Auxiliary Tools (Lyrics, Queue, Volume, Fullscreen) */}
          <div className="flex items-center justify-end gap-1.5 md:gap-2.5 md:w-1/3">
            {/* Ambient Soundscapes Blend */}
            <button
              onClick={() => setIsAmbientOpen(true)}
              className={`p-2 rounded-lg transition-colors hidden md:block relative ${
                isAmbientActive
                  ? 'text-cyan-400 bg-cyan-500/15 shadow-sm shadow-cyan-500/20 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-cyan-400 hover:bg-white/5'
              }`}
              title="Ambient Soundscapes (Rain, Cafe, Campfire, Waves)"
            >
              <CloudRain className="w-4 h-4" />
              {isAmbientActive && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>

            {/* Sleep Timer */}
            <button
              onClick={() => setIsSleepOpen(true)}
              className={`p-2 rounded-lg transition-colors hidden md:block relative ${
                sleepSecondsLeft !== null
                  ? 'text-indigo-400 bg-indigo-500/15 shadow-sm shadow-indigo-500/20 border border-indigo-500/30'
                  : 'text-neutral-400 hover:text-indigo-400 hover:bg-white/5'
              }`}
              title={
                sleepSecondsLeft !== null
                  ? `Sleep timer active: ${Math.ceil(sleepSecondsLeft / 60)}m left`
                  : 'Sleep Timer'
              }
            >
              <Moon className="w-4 h-4" />
              {sleepSecondsLeft !== null && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setIsLyricsOpen(!isLyricsOpen)}
              className={`p-2 rounded-lg transition-colors hidden md:block ${
                isLyricsOpen ? 'text-blue-400 bg-white/10' : 'text-neutral-400 hover:text-white'
              }`}
              title="Lyrics"
            >
              <Mic2 className="w-4 h-4" />
            </button>

            {/* Sonora Sound Studio EQ */}
            <button
              onClick={() => setIsEqOpen(true)}
              className={`p-2 rounded-lg transition-colors hidden md:block ${
                isEqOpen ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-400 hover:text-amber-400 hover:bg-white/5'
              }`}
              title="Sonora Sound Studio (Equalizer & Presets)"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsQueueOpen(!isQueueOpen)}
              className={`p-2 rounded-lg transition-colors hidden md:block ${
                isQueueOpen ? 'text-blue-400 bg-white/10' : 'text-neutral-400 hover:text-white'
              }`}
              title="Queue"
            >
              <ListMusic className="w-4 h-4" />
            </button>

            {/* Volume Control with dynamic green bar */}
            <div className="hidden lg:flex items-center gap-2 w-28">
              <button
                onClick={toggleMute}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #2563EB 0%, #2563EB ${
                    (isMuted ? 0 : volume) * 100
                  }%, rgba(255, 255, 255, 0.18) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.18) 100%)`
                }}
                className="w-full h-1.5 hover:h-2 rounded-full appearance-none cursor-pointer transition-all focus:outline-none"
                title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
              />
            </div>

            {/* Expand Full-Screen */}
            <button
              onClick={() => setIsFullScreen(true)}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Full screen now playing"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Close Player X Button */}
            <button
              onClick={closePlayer}
              className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              title="Close player (Stop playback)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Overlays */}
      <FullScreenPlayer />
      <LyricsPanel />
      <QueueDrawer />
      <EqualizerModal isOpen={isEqOpen} onClose={() => setIsEqOpen(false)} isPlaying={isPlaying} />
      <AmbientSoundscapeModal isOpen={isAmbientOpen} onClose={() => setIsAmbientOpen(false)} />
      <SleepTimerModal
        isOpen={isSleepOpen}
        onClose={() => setIsSleepOpen(false)}
        activeSecondsLeft={sleepSecondsLeft}
        onSetTimer={handleSetSleepTimer}
        onCancelTimer={handleCancelSleepTimer}
      />
    </>
  );
};
