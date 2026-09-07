'use client';

import React, { useState, useEffect } from 'react';
import { Album } from '@/lib/types';
import { AlbumFormModal } from '@/components/admin/AlbumFormModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/context/ToastContext';
import { formatTime } from '@/lib/utils';
import { Disc, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingAlbum, setDeletingAlbum] = useState<Album | null>(null);
  const toast = useToast();

  const fetchAlbums = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/albums');
      const data = await res.json();
      setAlbums(data.albums || []);
    } catch {
      toast.error('Failed to load albums');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deletingAlbum) return;
    try {
      const res = await fetch(`/api/albums/${deletingAlbum.id}`, { method: 'DELETE' });
      if (res.ok) {
        setAlbums((prev) => prev.filter((a) => a.id !== deletingAlbum.id));
        toast.success('Album deleted');
      }
    } catch {
      toast.error('Failed to delete album');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Album Management</h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Create and organize official studio albums and track sequencing.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Album
        </button>
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-900/80 uppercase font-bold text-[10px] text-neutral-400 tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Album</th>
                <th className="py-3.5 px-3">Artist</th>
                <th className="py-3.5 px-3">Genre</th>
                <th className="py-3.5 px-3">Tracks</th>
                <th className="py-3.5 px-3">Release Date</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    Loading albums...
                  </td>
                </tr>
              ) : albums.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No albums created yet.
                  </td>
                </tr>
              ) : (
                albums.map((album) => (
                  <tr key={album.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="w-10 h-10 rounded-lg object-cover bg-neutral-800 shrink-0"
                        />
                        <span className="font-bold text-white text-xs block truncate">
                          {album.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">{album.artistName}</td>
                    <td className="py-3 px-3 text-cyan-400">{album.genreName}</td>
                    <td className="py-3 px-3 font-mono">{album.songIds?.length || 0} songs</td>
                    <td className="py-3 px-3 font-mono text-neutral-400">{album.releaseDate}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold uppercase">
                        {album.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/albums/${album.id}`}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                          title="View live album"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditingAlbum(album)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                          title="Edit album"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingAlbum(album)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete album"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlbumFormModal
        isOpen={isCreateOpen || Boolean(editingAlbum)}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingAlbum(null);
        }}
        album={editingAlbum}
        onSaved={fetchAlbums}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingAlbum)}
        onClose={() => setDeletingAlbum(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Album?"
        message={`Are you sure you want to delete "${deletingAlbum?.title}"? (Songs in the album will remain in the library)`}
        confirmText="Delete Album"
      />
    </div>
  );
}
