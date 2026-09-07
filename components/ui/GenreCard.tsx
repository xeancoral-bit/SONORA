import React from 'react';
import Link from 'next/link';
import { Genre } from '@/lib/types';

interface GenreCardProps {
  genre: Genre;
}

export const GenreCard: React.FC<GenreCardProps> = ({ genre }) => {
  return (
    <Link
      href={`/genres/${genre.slug || genre.id}`}
      className={`group relative overflow-hidden rounded-2xl p-5 aspect-[1.4/1] flex flex-col justify-between bg-gradient-to-br ${genre.color} border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
    >
      <div className="z-10">
        <h3 className="font-extrabold text-xl md:text-2xl text-white drop-shadow-md">
          {genre.name}
        </h3>
        {genre.songCount !== undefined && (
          <span className="text-xs font-medium text-white/75 mt-1 block">
            {genre.songCount} {genre.songCount === 1 ? 'song' : 'songs'}
          </span>
        )}
      </div>

      {genre.coverImage && (
        <img
          src={genre.coverImage}
          alt={genre.name}
          className="absolute -right-4 -bottom-4 w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl rotate-12 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
        />
      )}
    </Link>
  );
};
