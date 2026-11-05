'use client';

import React, { useState, useEffect } from 'react';
import { GenreCard } from '@/components/ui/GenreCard';
import { Genre } from '@/lib/types';
import { Layers, Search } from 'lucide-react';

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/genres')
      .then((r) => r.json())
      .then((genresData) => {
        setGenres(genresData.genres || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const displayedGenres = genres.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 text-emerald-400 mb-2">
            <Layers className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Genres & Categories</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Music Genres</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Explore all musical genres, styles, and catalogs curated on SONORA.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-full text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-neutral-400">Loading genres...</div>
      ) : displayedGenres.length === 0 ? (
        <div className="py-20 text-center text-sm text-neutral-400">No categories found matching "{searchQuery}".</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayedGenres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      )}
    </div>
  );
}
