'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserCollection } from '@/lib/types';
import { FolderHeart, Plus, Lock } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetch('/api/collections')
      .then((res) => res.json())
      .then((data) => setCollections(data.collections || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim()
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCollections((prev) => [data.collection, ...prev]);
        setNewTitle('');
        setNewDescription('');
        setIsCreateOpen(false);
        toast.success('Personal collection created!');
      }
    } catch {
      toast.error('Failed to create collection');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <FolderHeart className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Personal Albums</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">My Collections</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Organize official Sonora library songs into your custom personal collections.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Collection
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-neutral-400">Loading collections...</div>
      ) : collections.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-3">
          <FolderHeart className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No personal collections yet</h3>
          <p className="text-xs text-neutral-400">
            Create themed collections like &quot;Study Music&quot;, &quot;Late Night Code&quot;, or &quot;Morning Workout&quot; using songs from the Sonora library.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-2 rounded-full bg-purple-600 text-white text-xs font-semibold"
          >
            Create Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              className="group p-3 rounded-2xl bg-[#141414] hover:bg-[#1C1C1C] border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex flex-col"
            >
              <div className="w-full aspect-square rounded-xl bg-neutral-900 mb-3 overflow-hidden flex items-center justify-center relative">
                {col.coverImage ? (
                  <img src={col.coverImage} alt={col.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <FolderHeart className="w-12 h-12 text-purple-400 opacity-60" />
                )}
              </div>
              <h4 className="font-semibold text-sm text-white truncate group-hover:text-purple-400 transition-colors">
                {col.title}
              </h4>
              <span className="text-xs text-neutral-400 truncate mt-1">
                Personal Collection • {col.songIds?.length || 0} tracks
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Personal Collection">
        <form onSubmit={handleCreateCollection} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Collection Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Study Music, Midnight Drive..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="What makes this personal collection special..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs font-semibold text-neutral-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs"
            >
              Create Collection
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
