'use client';

import React, { useState, useEffect } from 'react';
import { PlaylistCard } from '@/components/ui/PlaylistCard';
import { Playlist } from '@/lib/types';
import { ListMusic, Plus } from 'lucide-react';
import { CreatePlaylistModal } from '@/components/ui/CreatePlaylistModal';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetch('/api/playlists')
      .then((res) => res.json())
      .then((data) => setPlaylists(data.playlists || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <ListMusic className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Library</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Playlists</h1>
          <p className="text-sm text-neutral-400 mt-1">Discover community playlists and your personal mixes.</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-neutral-400">Loading playlists...</div>
      ) : playlists.length === 0 ? (
        <div className="py-20 text-center text-sm text-neutral-500">No playlists available yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}

      <CreatePlaylistModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(pl) => setPlaylists((prev) => [pl, ...prev])}
      />
    </div>
  );
}
