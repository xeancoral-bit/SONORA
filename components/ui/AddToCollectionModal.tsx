'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Song, UserCollection } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { FolderHeart, Plus, Check } from 'lucide-react';

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  isOpen,
  onClose,
  song
}) => {
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen]);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/collections');
      const data = await res.json();
      setCollections(data.collections || []);
    } catch {
      toast.error('Failed to load collections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSong = async (collection: UserCollection) => {
    if (!song) return;
    const isAlreadyIn = collection.songIds.includes(song.id);
    const newSongIds = isAlreadyIn
      ? collection.songIds.filter((id) => id !== song.id)
      : [...collection.songIds, song.id];

    try {
      const res = await fetch(`/api/collections/${collection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songIds: newSongIds })
      });
      if (res.ok) {
        setCollections((prev) =>
          prev.map((c) => (c.id === collection.id ? { ...c, songIds: newSongIds } : c))
        );
        if (isAlreadyIn) {
          toast.info('Removed from collection', `"${song.title}" removed from ${collection.title}`);
        } else {
          toast.success('Added to collection', `"${song.title}" saved to ${collection.title}`);
        }
      }
    } catch {
      toast.error('Error updating collection');
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !song) return;
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          songIds: [song.id]
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Collection created!', `Added "${song.title}" to ${data.collection.title}`);
        setNewTitle('');
        setIsCreating(false);
        fetchCollections();
      }
    } catch {
      toast.error('Failed to create collection');
    }
  };

  if (!song) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Personal Album / Collection">
      <div className="flex flex-col gap-4">
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
          Personal albums let you organize official Sonora library tracks for your personal listening.
        </div>

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

        {isCreating ? (
          <form onSubmit={handleCreateNew} className="flex gap-2">
            <input
              type="text"
              placeholder="Collection title (e.g. Study Vibes)..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl transition-colors"
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
            className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5 text-purple-400 text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Collection
          </button>
        )}

        <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-neutral-500">Loading collections...</div>
          ) : collections.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">No collections created yet.</div>
          ) : (
            collections.map((col) => {
              const inCollection = col.songIds.includes(song.id);
              return (
                <button
                  key={col.id}
                  onClick={() => handleToggleSong(col)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    inCollection
                      ? 'bg-purple-500/10 border-purple-500/30 text-white'
                      : 'bg-neutral-900/60 border-white/5 hover:bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                      <FolderHeart className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="truncate">
                      <h5 className="font-semibold text-sm truncate">{col.title}</h5>
                      <span className="text-xs text-neutral-400">
                        {col.songIds.length} {col.songIds.length === 1 ? 'song' : 'songs'}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                      inCollection
                        ? 'bg-purple-500 border-purple-500 text-white'
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
