import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Pause, Heart, Plus, ListPlus, Radio, MoreVertical } from 'lucide-react';
import { Song } from '@/lib/types';
import { useAudio } from '@/context/AudioContext';
import { EqualizerAnimation } from '@/components/player/EqualizerAnimation';
import { Youtube } from '@/components/ui/icons';

interface SongCardProps {
  song: Song;
  playlistQueue?: Song[];
  onAddToPlaylist?: (song: Song) => void;
  onAddToCollection?: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  playlistQueue,
  onAddToPlaylist,
  onAddToCollection
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, addToQueue } = useAudio();
  const isCurrent = currentTrack?.id === song.id;
  const isYouTube = song.sourcePlatform === 'youtube' || Boolean(song.externalMediaId);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(song, playlistQueue);
    }
  };

  return (
    <div className="group relative p-3 rounded-2xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-black/70 flex flex-col cursor-pointer">
      {/* Artwork with floating play button */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-900 mb-3 shadow-md border border-white/5">
        <img
          src={song.coverImage}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Playing equalizer indicator */}
        {isCurrent && isPlaying && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/70 backdrop-blur-md border border-emerald-500/40 z-10 flex items-center gap-1">
            <EqualizerAnimation isPlaying={isPlaying} />
          </div>
        )}

        {/* Source badge */}
        {isYouTube && (
          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[9px] font-bold text-red-400 border border-red-500/30 flex items-center gap-0.5">
            <Youtube className="w-2.5 h-2.5" /> YT
          </span>
        )}

        {/* Play / Pause button */}
        <button
          onClick={handlePlayClick}
          className={`absolute right-3 bottom-3 w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-110 active:scale-95 z-20 ${
            isCurrent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
          title={isCurrent && isPlaying ? 'Pause' : 'Play'}
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-5 h-5 fill-black" />
          ) : (
            <Play className="w-5 h-5 fill-black ml-0.5" />
          )}
        </button>

        {/* Explicit badge */}
        {song.explicit && (
          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-neutral-300 border border-white/10">
            E
          </span>
        )}
      </div>

      {/* Song Details */}
      <div className="flex flex-col min-w-0 flex-1 justify-between">
        <Link
          href={`/songs/${song.id}`}
          className={`font-semibold text-sm truncate hover:underline leading-snug ${
            isCurrent ? 'text-emerald-400' : 'text-white'
          }`}
        >
          {song.title}
        </Link>
        <div className="flex items-center justify-between mt-1">
          <Link
            href={`/artists/${song.artistId}`}
            className="text-xs text-neutral-400 hover:text-white truncate transition-colors max-w-[75%]"
          >
            {song.artistName}
          </Link>
          {song.genreName && (
            <span className="text-[10px] text-neutral-500 font-medium truncate">
              {song.genreName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
