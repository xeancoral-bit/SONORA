'use client';

import React, { useState, useEffect } from 'react';
import { Genre } from '@/lib/types';
import { GenreFormModal } from '@/components/admin/GenreFormModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/context/ToastContext';
import { Layers, Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminGenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingGenre, setDeletingGenre] = useState<Genre | null>(null);
  const toast = useToast();

  const fetchGenres = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/genres');
      const data = await res.json();
      setGenres(data.genres || []);
    } catch {
      toast.error('Failed to load genres');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deletingGenre) return;
    try {
      const res = await fetch(`/api/genres/${deletingGenre.id}`, { method: 'DELETE' });
      if (res.ok) {
        setGenres((prev) => prev.filter((g) => g.id !== deletingGenre.id));
        toast.success('Genre deleted');
      }
    } catch {
      toast.error('Failed to delete genre');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Music Genres & Categories</h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Configure music category cards, color themes, and catalog tags.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Genre / Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className={`relative overflow-hidden rounded-2xl p-5 aspect-[1.3/1] flex flex-col justify-between bg-gradient-to-br ${genre.color} border border-white/10 shadow-lg`}
          >
            <div>
              <h3 className="font-bold text-xl text-white drop-shadow-md">{genre.name}</h3>
              <span className="text-xs text-white/80 mt-1 block">
                {genre.songCount !== undefined ? `${genre.songCount} songs` : 'Active category'}
              </span>
            </div>

            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] font-mono uppercase text-white/60 bg-black/40 px-2 py-0.5 rounded">
                slug: {genre.slug}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingGenre(genre)}
                  className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-black transition-colors"
                  title="Edit genre"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingGenre(genre)}
                  className="p-1.5 rounded-lg bg-black/50 text-rose-300 hover:bg-rose-900 transition-colors"
                  title="Delete genre"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <GenreFormModal
        isOpen={isCreateOpen || Boolean(editingGenre)}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingGenre(null);
        }}
        genre={editingGenre}
        onSaved={fetchGenres}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingGenre)}
        onClose={() => setDeletingGenre(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Genre?"
        message={`Are you sure you want to delete category "${deletingGenre?.name}"?`}
        confirmText="Delete Genre"
      />
    </div>
  );
}
