'use client';

import React, { useState, useEffect } from 'react';
import { GenreCard } from '@/components/ui/GenreCard';
import { Genre } from '@/lib/types';
import { Compass, Sparkles } from 'lucide-react';

export default function BrowsePage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/genres')
      .then((res) => res.json())
      .then((data) => setGenres(data.genres || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2.5 text-emerald-400 mb-2">
          <Compass className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Discover Music</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Browse All Genres & Categories</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Explore curated music styles, moods, and soundscapes.
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
