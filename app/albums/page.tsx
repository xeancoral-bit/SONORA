'use client';

import React, { useState, useEffect } from 'react';
import { AlbumCard } from '@/components/ui/AlbumCard';
import { Album } from '@/lib/types';
import { Disc } from 'lucide-react';

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/albums')
      .then((res) => res.json())
      .then((data) => setAlbums(data.albums || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-cyan-400 mb-2">
          <Disc className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Library</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">All Albums</h1>
        <p className="text-sm text-neutral-400 mt-1">Explore full-length records, EPs, and discographies.</p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-neutral-400">Loading albums...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}
