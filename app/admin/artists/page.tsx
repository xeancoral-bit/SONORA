'use client';

import React, { useState, useEffect } from 'react';
import { Artist } from '@/lib/types';
import { ArtistFormModal } from '@/components/admin/ArtistFormModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/context/ToastContext';
import { formatNumber } from '@/lib/utils';
import { Users, Plus, Edit2, Trash2, ExternalLink, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingArtist, setDeletingArtist] = useState<Artist | null>(null);
  const toast = useToast();

  const fetchArtists = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/artists');
      const data = await res.json();
      setArtists(data.artists || []);
    } catch {
      toast.error('Failed to load artists');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deletingArtist) return;
    try {
      const res = await fetch(`/api/artists/${deletingArtist.id}`, { method: 'DELETE' });
      if (res.ok) {
        setArtists((prev) => prev.filter((a) => a.id !== deletingArtist.id));
        toast.success('Artist profile deleted');
      }
    } catch {
      toast.error('Failed to delete artist');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Artist Profiles Management</h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Create verified artist pages, bios, banners, and links.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Artist
        </button>
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-900/80 uppercase font-bold text-[10px] text-neutral-400 tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Artist</th>
                <th className="py-3.5 px-3">Country</th>
                <th className="py-3.5 px-3">Genre</th>
                <th className="py-3.5 px-3">Monthly Listeners</th>
                <th className="py-3.5 px-3">Followers</th>
                <th className="py-3.5 px-3">Verified</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    Loading artists...
                  </td>
                </tr>
              ) : artists.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No artists added yet.
                  </td>
                </tr>
              ) : (
                artists.map((artist) => (
                  <tr key={artist.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={artist.avatar}
                          alt={artist.name}
                          className="w-10 h-10 rounded-full object-cover bg-neutral-800 shrink-0"
                        />
                        <span className="font-bold text-white text-xs block truncate">
                          {artist.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-neutral-400">{artist.country || 'Global'}</td>
                    <td className="py-3 px-3 text-purple-400">{artist.genreName || '—'}</td>
                    <td className="py-3 px-3 font-mono">{formatNumber(artist.monthlyListeners)}</td>
                    <td className="py-3 px-3 font-mono">{formatNumber(artist.followersCount)}</td>
                    <td className="py-3 px-3">
                      {artist.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 fill-emerald-400/20" /> Verified
                        </span>
                      ) : (
                        <span className="text-neutral-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/artists/${artist.id}`}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                          title="View live profile"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditingArtist(artist)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                          title="Edit artist"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingArtist(artist)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete artist"
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

      <ArtistFormModal
        isOpen={isCreateOpen || Boolean(editingArtist)}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingArtist(null);
        }}
        artist={editingArtist}
        onSaved={fetchArtists}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingArtist)}
        onClose={() => setDeletingArtist(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Artist Profile?"
        message={`Are you sure you want to permanently remove "${deletingArtist?.name}"?`}
        confirmText="Delete Artist"
      />
    </div>
  );
}
