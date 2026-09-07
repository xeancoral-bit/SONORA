import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Play, Heart } from 'lucide-react';
import { Artist } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

interface ArtistCardProps {
  artist: Artist & { isFollowed?: boolean };
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  return (
    <Link
      href={`/artists/${artist.id}`}
      className="group relative p-3 rounded-2xl bg-[#141414] hover:bg-[#1C1C1C] border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 flex flex-col items-center text-center cursor-pointer"
    >
      <div className="relative aspect-square w-full rounded-full overflow-hidden bg-neutral-900 mb-3 shadow-lg p-1 border border-white/10">
        <img
          src={artist.avatar}
          alt={artist.name}
          className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
        />
        {artist.isFollowed && (
          <div
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500/90 text-black flex items-center justify-center shadow-md z-10"
            title="In your Library"
          >
            <Heart className="w-3.5 h-3.5 fill-black text-black" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xl shadow-black/60 scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full min-w-0">
        <div className="flex items-center gap-1 max-w-full">
          <h4 className="font-semibold text-sm text-white truncate group-hover:text-emerald-400 transition-colors">
            {artist.name}
          </h4>
          {artist.isVerified && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 fill-emerald-400/20" />
          )}
        </div>
        <span className="text-xs text-neutral-400 mt-1 truncate">
          Artist • {formatNumber(artist.monthlyListeners)} listeners
        </span>
      </div>
    </Link>
  );
};
