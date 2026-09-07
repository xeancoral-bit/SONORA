import React from 'react';
import Link from 'next/link';
import { Play, Disc } from 'lucide-react';
import { Album } from '@/lib/types';

interface AlbumCardProps {
  album: Album;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  return (
    <Link
      href={`/albums/${album.id}`}
      className="group relative p-3 rounded-2xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-black/70 flex flex-col cursor-pointer"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-900 mb-3 shadow-md border border-white/5">
        <img
          src={album.coverImage}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Track count badge */}
        {album.songIds && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-neutral-300 border border-white/10 flex items-center gap-1">
            <Disc className="w-3 h-3 text-emerald-400" /> {album.songIds.length} tracks
          </span>
        )}

        <div className="absolute right-3 bottom-3 w-11 h-11 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xl shadow-emerald-500/30 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95">
          <Play className="w-5 h-5 fill-black ml-0.5" />
        </div>
      </div>

      <div className="flex flex-col min-w-0">
        <h4 className="font-semibold text-sm text-white truncate group-hover:text-emerald-400 transition-colors">
          {album.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-neutral-400 truncate mt-1">
          <span className="truncate">{album.artistName}</span>
          <span className="text-[10px] text-neutral-500 font-medium">{album.genreName || 'Album'}</span>
        </div>
      </div>
    </Link>
  );
};
