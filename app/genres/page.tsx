'use client';

import React, { useState, useEffect } from 'react';
import { GenreCard } from '@/components/ui/GenreCard';
import { Genre, Song } from '@/lib/types';
import { Layers, Sparkles } from 'lucide-react';

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/genres').then((r) => r.json()).catch(() => ({ genres: [] })),
      fetch('/api/songs').then((r) => r.json()).catch(() => ({ songs: [] }))
    ])
      .then(([genresData, songsData]) => {
        setGenres(genresData.genres || []);
        setSongs(songsData.songs || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Compute live song counts per genre
  const genreSongCounts: Record<string, number> = {};
  songs.forEach((s) => {
    if (s.genreId) {
      genreSongCounts[s.genreId] = (genreSongCounts[s.genreId] || 0) + 1;
    }
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2.5 text-emerald-400 mb-2">
          <Layers className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Genres & Categories</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Music Genres</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Explore all musical genres, styles, and catalogs curated on SONORA.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-neutral-400">Loading genres...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      )}
    </div>
  );
}
