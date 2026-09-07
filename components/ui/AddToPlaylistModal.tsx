'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Song, Playlist } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { ListMusic, Plus, Check } from 'lucide-react';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
  onPlaylistCreated?: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  song,
  onPlaylistCreated
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchPlaylists();
    }
  }, [isOpen]);

  const fetchPlaylists = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/playlists');
      const data = await res.json();
      setPlaylists(data.playlists || []);
    } catch {
      toast.error('Failed to load playlists');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSong = async (playlist: Playlist) => {
    if (!song) return;
    const isAlreadyIn = playlist.songIds.includes(song.id);
    const newSongIds = isAlreadyIn
      ? playlist.songIds.filter((id) => id !== song.id)
      : [...playlist.songIds, song.id];

    try {
      const res = await fetch(`/api/playlists/${playlist.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songIds: newSongIds })
      });
      if (res.ok) {
        setPlaylists((prev) =>
          prev.map((p) => (p.id === playlist.id ? { ...p, songIds: newSongIds } : p))
        );
        if (isAlreadyIn) {
          toast.info('Removed from playlist', `"${song.title}" removed from ${playlist.title}`);
        } else {
          toast.success('Added to playlist', `"${song.title}" added to ${playlist.title}`);
        }
      }
    } catch {
      toast.error('Error updating playlist');
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !song) return;
    try {
      const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          songIds: [song.id],
          isPublic: true
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Playlist created!', `Added "${song.title}" to ${data.playlist.title}`);
        setNewTitle('');
        setIsCreating(false);
        fetchPlaylists();
        if (onPlaylistCreated) onPlaylistCreated();
      }
    } catch {
      toast.error('Failed to create playlist');
    }
  };

  if (!song) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Playlist">
      <div className="flex flex-col gap-4">
        {/* Current Song snippet */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/5">
          <img
            src={song.coverImage}
            alt={song.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-white truncate">{song.title}</h4>
            <p className="text-xs text-neutral-400 truncate">{song.artistName}</p>
          </div>
        </div>

        {/* Quick create inline form */}
        {isCreating ? (
          <form onSubmit={handleCreateNew} className="flex gap-2">
            <input
              type="text"
              placeholder="Playlist name..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-white/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-400 text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Playlist
          </button>
        )}

        {/* Playlists list */}
        <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-neutral-500">Loading playlists...</div>
          ) : playlists.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">No playlists created yet.</div>
          ) : (
            playlists.map((playlist) => {
              const inPlaylist = playlist.songIds.includes(song.id);
              return (
                <button
                  key={playlist.id}
                  onClick={() => handleToggleSong(playlist)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    inPlaylist
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                      : 'bg-neutral-900/60 border-white/5 hover:bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                      <ListMusic className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div className="truncate">
                      <h5 className="font-semibold text-sm truncate">{playlist.title}</h5>
                      <span className="text-xs text-neutral-400">
                        {playlist.songIds.length} {playlist.songIds.length === 1 ? 'song' : 'songs'}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                      inPlaylist
                        ? 'bg-emerald-500 border-emerald-500 text-black'
                        : 'border-white/20 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
