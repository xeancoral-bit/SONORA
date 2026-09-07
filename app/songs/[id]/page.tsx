'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Song } from '@/lib/types';
import { useAudio } from '@/context/AudioContext';
import { useToast } from '@/context/ToastContext';
import { formatTime, formatNumber, formatDate } from '@/lib/utils';
import { SongCard } from '@/components/ui/SongCard';
import { AddToPlaylistModal } from '@/components/ui/AddToPlaylistModal';
import { AddToCollectionModal } from '@/components/ui/AddToCollectionModal';
import {
  Play,
  Pause,
  Heart,
  Plus,
  ListPlus,
  Share2,
  Disc,
  User,
  Mic2,
  Calendar,
  Radio,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { YouTubePlayer } from '@/components/player/YouTubePlayer';
import { Youtube } from '@/components/ui/icons';
import { LyricsControls } from '@/components/player/LyricsControls';
import { getSyncedLyricsForSong } from '@/lib/lyricsService';

export default function SongDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const songId = resolvedParams.id;

  const [song, setSong] = useState<Song | null>(null);
  const [relatedSongs, setRelatedSongs] = useState<Song[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    addToQueue,
    lyricsLanguage,
    setLyricsLanguage,
    lyricsFontSize,
    increaseLyricsFontSize,
    decreaseLyricsFontSize,
  } = useAudio();
  const toast = useToast();

  const isCurrent = currentTrack?.id === song?.id;
  const displayedLyrics = React.useMemo(() => {
    if (!song) return [];
    return getSyncedLyricsForSong(song, lyricsLanguage);
  }, [song, lyricsLanguage]);

  const detailPageFontSizeMap: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed',
    xl: 'text-xl leading-relaxed',
  };

  useEffect(() => {
    let isMounted = true;
    async function loadSongData() {
      try {
        const res = await fetch(`/api/songs/${songId}`);
        if (!res.ok) {
          if (isMounted) setIsLoading(false);
          return;
        }
        const data = await res.json();
        if (isMounted) {
          setSong(data.song);
          setRelatedSongs(data.relatedSongs || []);
          setIsLiked(data.isLiked);
        }
      } catch {
        // Safe catch
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadSongData();
    return () => {
      isMounted = false;
    };
  }, [songId]);

  const handlePlayClick = () => {
    if (!song) return;
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(song, [song, ...relatedSongs]);
    }
  };

  const handleLikeClick = async () => {
    if (!song) return;
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId: song.id })
      });
      const data = await res.json();
      if (data.success) {
        setIsLiked(data.isLiked);
        setSong((prev) => (prev ? { ...prev, likesCount: data.likesCount } : null));
        if (data.isLiked) {
          toast.success('Added to Liked Songs');
        } else {
          toast.info('Removed from Liked Songs');
        }
      }
    } catch {}
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-sm text-neutral-400">Loading song details...</div>;
  }

  if (!song) {
    return <div className="py-20 text-center text-base text-neutral-400">Song not found.</div>;
  }

  const isYouTube = song.sourcePlatform === 'youtube' || Boolean(song.externalMediaId);

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Song Hero Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 bg-gradient-to-b from-neutral-800/40 via-neutral-900/30 to-transparent p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl">
        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-neutral-900 border border-white/10">
          <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {song.genreName}
            </span>
            {isYouTube && (
              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 flex items-center gap-1">
                <Youtube className="w-2.5 h-2.5" /> YouTube Master
              </span>
            )}
            {song.explicit && (
              <span className="text-[10px] font-bold text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded border border-white/10">
                Explicit
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            {song.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-neutral-400">
            <Link
              href={`/artists/${song.artistId}`}
              className="font-bold text-white hover:text-emerald-400 hover:underline transition-colors"
            >
              {song.artistName}
            </Link>
            {song.albumTitle && (
              <>
                <span>•</span>
                <Link
                  href={`/albums/${song.albumId}`}
                  className="hover:text-white hover:underline transition-colors"
                >
                  {song.albumTitle}
                </Link>
              </>
            )}
            <span>•</span>
            <span>{song.releaseDate ? song.releaseDate.split('-')[0] : '2025'}</span>
            <span>•</span>
            <span className="font-mono">{formatTime(song.duration)}</span>
            <span>•</span>
            <span className="font-mono">{formatNumber(song.playCount)} plays</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
            <button
              onClick={handlePlayClick}
              className="px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
            >
              {isCurrent && isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-black" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-black ml-0.5" /> Play
                </>
              )}
            </button>

            <button
              onClick={handleLikeClick}
              className={`p-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors ${
                isLiked ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-neutral-400 hover:text-white'
              }`}
              title="Like song"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-emerald-400' : ''}`} />
            </button>

            <button
              onClick={() => setIsPlaylistModalOpen(true)}
              className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Add to playlist"
            >
              <Plus className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCollectionModalOpen(true)}
              className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Add to collection"
            >
              <ListPlus className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                addToQueue(song);
                toast.success('Added to Queue', song.title);
              }}
              className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Add to queue"
            >
              <Radio className="w-5 h-5" />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Share track"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Description & Metadata Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lyrics, Video & About Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* YouTube Video Player Embed if applicable */}
          {isYouTube && song.externalMediaId && (
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-red-400">
                <Youtube className="w-5 h-5" />
                <h3 className="font-bold text-lg text-white">Official Video Stream</h3>
              </div>
              <div className="max-w-xl mx-auto">
                <YouTubePlayer
                  videoId={song.externalMediaId}
                  title={song.title}
                  artistName={song.artistName}
                  isPlaying={isCurrent && isPlaying}
                />
              </div>
            </div>
          )}

          {/* Lyrics Box */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2 text-emerald-400">
                <Mic2 className="w-5 h-5" />
                <h3 className="font-bold text-lg text-white">Lyrics</h3>
              </div>
              <LyricsControls
                language={lyricsLanguage}
                onLanguageChange={setLyricsLanguage}
                fontSize={lyricsFontSize}
                onIncreaseFontSize={increaseLyricsFontSize}
                onDecreaseFontSize={decreaseLyricsFontSize}
                variant="page"
              />
            </div>

            {displayedLyrics && displayedLyrics.length > 0 ? (
              <div className="space-y-3 font-sans pt-1">
                {displayedLyrics.map((line, idx) => (
                  <p key={idx} className={`${detailPageFontSizeMap[lyricsFontSize]} text-neutral-300 font-medium transition-all`}>
                    {line.text}
                  </p>
                ))}
              </div>
            ) : song.lyrics ? (
              <div className="text-sm text-neutral-300 whitespace-pre-line leading-relaxed font-sans">
                {song.lyrics}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 italic">No lyrics provided for this track.</p>
            )}
          </div>

          {/* Description */}
          {song.description && (
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-2">
              <h4 className="font-bold text-sm text-white">About the Track</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">{song.description}</p>
            </div>
          )}
        </div>

        {/* Right Info Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-4">
            <h4 className="font-bold text-sm text-white border-b border-white/5 pb-3">Track Info</h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Artist</span>
                <Link href={`/artists/${song.artistId}`} className="text-white hover:underline font-semibold">
                  {song.artistName}
                </Link>
              </div>

              {song.albumTitle && (
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Album</span>
                  <Link href={`/albums/${song.albumId}`} className="text-white hover:underline font-semibold">
                    {song.albumTitle}
                  </Link>
                </div>
              )}

              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Genre</span>
                <Link href={`/genres/${song.genreId}`} className="text-emerald-400 hover:underline font-semibold">
                  {song.genreName}
                </Link>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Release Date</span>
                <span className="text-neutral-300 font-mono">{formatDate(song.releaseDate)}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Duration</span>
                <span className="text-neutral-300 font-mono">{formatTime(song.duration)}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Total Plays</span>
                <span className="text-neutral-300 font-mono">{formatNumber(song.playCount)}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Likes</span>
                <span className="text-neutral-300 font-mono">{formatNumber(song.likesCount)}</span>
              </div>

              {song.copyrightOwner && (
                <div className="pt-2 border-t border-white/5 flex items-start gap-1.5 text-neutral-400 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{song.copyrightOwner}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {song.tags && song.tags.length > 0 && (
              <div className="pt-3 border-t border-white/5">
                <span className="text-[11px] font-bold text-neutral-500 uppercase block mb-2">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {song.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-neutral-800 text-[11px] text-neutral-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Songs */}
      {relatedSongs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Recommended / Related Tracks</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedSongs.map((rel) => (
              <SongCard key={rel.id} song={rel} playlistQueue={relatedSongs} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddToPlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        song={song}
      />
      <AddToCollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        song={song}
      />
    </div>
  );
}
