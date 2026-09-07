'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Pause, Heart, MoreHorizontal, Plus, ListPlus, Radio, Disc, User, Info, Trash2 } from 'lucide-react';
import { Song } from '@/lib/types';
import { useAudio } from '@/context/AudioContext';
import { formatTime, formatNumber } from '@/lib/utils';
import { EqualizerAnimation } from '../player/EqualizerAnimation';

interface TrackRowProps {
  song: Song;
  index: number;
  playlistQueue?: Song[];
  showAlbum?: boolean;
  showCover?: boolean;
  showPlays?: boolean;
  onAddToPlaylist?: (song: Song) => void;
  onAddToCollection?: (song: Song) => void;
  onRemoveFromList?: (songId: string) => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  song,
  index,
  playlistQueue,
  showAlbum = true,
  showCover = true,
  showPlays = true,
  onAddToPlaylist,
  onAddToCollection,
  onRemoveFromList
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, addToQueue } = useAudio();
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isCurrent = currentTrack?.id === song.id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(song, playlistQueue);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId: song.id })
      });
      const data = await res.json();
      if (data.success) {
        setIsLiked(data.isLiked);
      }
    } catch {}
  };

  return (
    <div
      onClick={handlePlayClick}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer text-sm ${
        isCurrent ? 'bg-white/[0.04]' : ''
      }`}
    >
      {/* Index or Play / Pause / Equalizer */}
      <div className="w-8 shrink-0 flex items-center justify-center text-neutral-400">
        {isCurrent && isPlaying ? (
          <div className="flex items-center justify-center">
            <EqualizerAnimation isPlaying={true} color="bg-emerald-400" />
          </div>
        ) : (
          <>
            <span className="group-hover:hidden font-mono text-xs">
              {index + 1}
            </span>
            <button
              onClick={handlePlayClick}
              className="hidden group-hover:flex items-center justify-center text-white hover:text-emerald-400 transition-colors"
            >
              {isCurrent && isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          </>
        )}
      </div>

      {/* Cover Artwork */}
      {showCover && (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
          <img
            src={song.coverImage}
            alt={song.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title & Artist */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-semibold truncate leading-tight ${
              isCurrent ? 'text-emerald-400' : 'text-white'
            }`}
          >
            {song.title}
          </span>
          {song.explicit && (
            <span className="px-1 py-0.2 rounded bg-neutral-700/80 text-[9px] font-bold text-neutral-300">
              E
            </span>
          )}
        </div>
        <Link
          href={`/artists/${song.artistId}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-neutral-400 hover:text-white truncate block mt-0.5 transition-colors"
        >
          {song.artistName}
        </Link>
      </div>

      {/* Album (optional column on tablet/desktop) */}
      {showAlbum && song.albumTitle && (
        <div className="hidden md:block flex-1 min-w-0 text-xs text-neutral-400 truncate">
          <Link
            href={`/albums/${song.albumId}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-white hover:underline transition-colors"
          >
            {song.albumTitle}
          </Link>
        </div>
      )}

      {/* Play count */}
      {showPlays && (
        <div className="hidden lg:block w-24 text-right text-xs text-neutral-500 font-mono">
          {formatNumber(song.playCount || 0)}
        </div>
      )}

      {/* Actions & Duration */}
      <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleLike}
          className={`p-1.5 rounded-lg transition-colors ${
            isLiked ? 'text-emerald-400' : 'text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100'
          }`}
          title="Like song"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-emerald-400' : ''}`} />
        </button>

        <span className="text-xs text-neutral-400 font-mono w-10 text-right">
          {formatTime(song.duration)}
        </span>

        {/* 3-dot dropdown menu button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            title="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-50 w-52 bg-[#1C1C1C] border border-white/10 rounded-xl shadow-2xl py-1.5 text-xs text-neutral-200 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    addToQueue(song);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-left hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Radio className="w-4 h-4 text-emerald-400" />
                  Add to Queue
                </button>

                {onAddToPlaylist && (
                  <button
                    onClick={() => {
                      onAddToPlaylist(song);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-left hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4 text-cyan-400" />
                    Add to Playlist
                  </button>
                )}

                {onAddToCollection && (
                  <button
                    onClick={() => {
                      onAddToCollection(song);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-left hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <ListPlus className="w-4 h-4 text-purple-400" />
                    Add to Personal Collection
                  </button>
                )}

                <div className="h-px bg-white/10 my-1" />

                <Link
                  href={`/songs/${song.id}`}
                  className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-white/10 hover:text-white transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <Info className="w-4 h-4 text-neutral-400" />
                  View Track Details & Lyrics
                </Link>

                <Link
                  href={`/artists/${song.artistId}`}
                  className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-white/10 hover:text-white transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <User className="w-4 h-4 text-neutral-400" />
                  Go to Artist
                </Link>

                {song.albumId && (
                  <Link
                    href={`/albums/${song.albumId}`}
                    className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-white/10 hover:text-white transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <Disc className="w-4 h-4 text-neutral-400" />
                    Go to Album
                  </Link>
                )}

                {onRemoveFromList && (
                  <>
                    <div className="h-px bg-white/10 my-1" />
                    <button
                      onClick={() => {
                        onRemoveFromList(song.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove from list
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
