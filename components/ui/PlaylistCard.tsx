import React from 'react';
import Link from 'next/link';
import { Play, ListMusic } from 'lucide-react';
import { Playlist } from '@/lib/types';

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <Link
      href={`/playlists/${playlist.id}`}
      className="group relative p-3 rounded-2xl bg-[#141414] hover:bg-[#1C1C1C] border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 flex flex-col cursor-pointer"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-900 mb-3 shadow-md flex items-center justify-center">
        {playlist.coverImage ? (
          <img
            src={playlist.coverImage}
            alt={playlist.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ListMusic className="w-12 h-12 text-neutral-600" />
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute right-3 bottom-3 w-11 h-11 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xl shadow-black/60 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95">
          <Play className="w-5 h-5 fill-black ml-0.5" />
        </div>
      </div>

      <div className="flex flex-col min-w-0">
        <h4 className="font-semibold text-sm text-white truncate group-hover:text-emerald-400 transition-colors">
          {playlist.title}
        </h4>
        <span className="text-xs text-neutral-400 truncate mt-1">
          By {playlist.userName || 'User'} • {playlist.songIds?.length || 0} tracks
        </span>
      </div>
    </Link>
  );
};
