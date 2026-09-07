'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Song, Artist, Genre, SongStatus } from '@/lib/types';
import { SongFormModal } from '@/components/admin/SongFormModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/context/ToastContext';
import { formatTime, formatNumber, formatDate } from '@/lib/utils';
import { getPlatformMeta } from '@/lib/urlUtils';
import {
  Music,
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  Archive,
  ExternalLink,
  CheckCircle2,
  FileCode,
  Globe,
  Link2,
  Copy,
  ChevronDown
} from 'lucide-react';
import { Youtube } from '@/components/ui/icons';

export default function AdminMusicManagementPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'plays' | 'title'>('latest');

  // Modals state
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [deletingSong, setDeletingSong] = useState<Song | null>(null);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  const toast = useToast();

  const fetchSongs = async () => {
    try {
      setIsLoading(true);

      const safeFetchJson = async (url: string) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return null;
          return await res.json();
        } catch {
          return null;
        }
      };

      const [songsRes, artistsRes, genresRes] = await Promise.all([
        safeFetchJson('/api/songs'),
        safeFetchJson('/api/artists'),
        safeFetchJson('/api/genres')
      ]);

      setSongs(songsRes?.songs || []);
      setArtists(artistsRes?.artists || []);
      setGenres(genresRes?.genres || []);
    } catch {
      toast.error('Failed to load catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Close action menu on outside click
  useEffect(() => {
    const handle = () => setActiveActionMenu(null);
    window.addEventListener('click', handle);
    return () => window.removeEventListener('click', handle);
  }, []);

  const handleToggleArchive = async (song: Song) => {
    const newStatus = song.status === 'archived' ? 'published' : 'archived';
    try {
      const res = await fetch(`/api/songs/${song.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setSongs((prev) =>
          prev.map((s) => (s.id === song.id ? { ...s, status: newStatus } : s))
        );
        toast.success(`Track ${newStatus === 'archived' ? 'Archived' : 'Published'}`);
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSong) return;
    try {
      const res = await fetch(`/api/songs/${deletingSong.id}`, { method: 'DELETE' });
      if (res.ok) {
        setSongs((prev) => prev.filter((s) => s.id !== deletingSong.id));
        toast.success('Track deleted from library');
      }
    } catch {
      toast.error('Failed to delete track');
    }
  };

  const handleCopySourceUrl = async (song: Song) => {
    const url = song.sourceUrl || song.audioUrl || '';
    if (!url) {
      toast.error('No source URL available for this track');
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Source URL copied to clipboard');
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  // Filtered list
  const filteredSongs = songs
    .filter((song) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !song.title.toLowerCase().includes(q) &&
          !song.artistName.toLowerCase().includes(q) &&
          !song.genreName.toLowerCase().includes(q)
        ) return false;
      }
      if (selectedArtist && song.artistId !== selectedArtist) return false;
      if (selectedGenre && song.genreId !== selectedGenre) return false;
      if (selectedStatus && song.status !== selectedStatus) return false;
      if (selectedSource) {
        if (selectedSource === 'upload' && song.sourceType !== 'upload' && song.uploadType !== 'file') return false;
        if (selectedSource === 'youtube' && song.sourcePlatform !== 'youtube') return false;
        if (selectedSource === 'url' && song.sourceType !== 'external_url') return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'plays') return (b.playCount || 0) - (a.playCount || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const getStatusBadge = (status: SongStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">Published</span>;
      case 'draft':
        return <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 text-[10px] font-bold uppercase">Draft</span>;
      case 'private':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase">Private</span>;
      case 'archived':
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase">Archived</span>;
    }
  };

  const getSourceBadge = (song: Song) => {
    const platform = song.sourcePlatform;
    const type = song.sourceType || (song.uploadType === 'url' ? 'external_url' : 'upload');

    if (platform === 'youtube') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
          <Youtube className="w-2.5 h-2.5" /> YouTube
        </span>
      );
    }
    if (type === 'external_url' || platform === 'direct' || platform === 'soundcloud') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold">
          <Globe className="w-2.5 h-2.5" /> External URL
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
        <FileCode className="w-2.5 h-2.5" /> Uploaded
      </span>
    );
  };

  const hasSourceUrl = (song: Song) =>
    !!(song.sourceUrl || (song.uploadType === 'url' && song.audioUrl));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Music Catalog Management</h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Manage tracks added via file upload or URL source (YouTube, external links).
          </p>
        </div>

        <Link
          href="/admin/music/add"
          className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          + Add New Track
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by title, artist, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
            >
              <option value="">All Sources</option>
              <option value="upload">Uploaded</option>
              <option value="youtube">YouTube</option>
              <option value="url">External URL</option>
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="private">Private</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
            >
              <option value="latest">Latest First</option>
              <option value="plays">Most Played</option>
              <option value="title">A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-900/80 uppercase font-bold text-[10px] text-neutral-400 tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Track</th>
                <th className="py-3.5 px-3">Artist</th>
                <th className="py-3.5 px-3">Album</th>
                <th className="py-3.5 px-3">Genre</th>
                <th className="py-3.5 px-3">Source</th>
                <th className="py-3.5 px-3">Duration</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3 text-right">Plays</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500">
                    Loading music catalog...
                  </td>
                </tr>
              ) : filteredSongs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500">
                    No songs found matching filters.
                  </td>
                </tr>
              ) : (
                filteredSongs.map((song) => (
                  <tr key={song.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Track info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={song.coverImage}
                            alt={song.title}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-800"
                          />
                          {song.sourcePlatform === 'youtube' && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
                              <Youtube className="w-2.5 h-2.5 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-white text-xs block truncate max-w-[160px]">
                            {song.title}
                          </span>
                          <span className="text-[10px] text-neutral-500 truncate block max-w-[160px]">
                            {song.originalFilename || (song.sourceUrl ? 'URL source' : 'audio.mp3')}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-medium text-white truncate max-w-[100px]">
                      {song.artistName}
                    </td>

                    <td className="py-3 px-3 text-neutral-400 truncate max-w-[100px]">
                      {song.albumTitle || <span className="text-neutral-600">Single</span>}
                    </td>

                    <td className="py-3 px-3 text-emerald-400 font-semibold">
                      {song.genreName}
                    </td>

                    {/* Source Badge */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1">
                        {getSourceBadge(song)}
                        {hasSourceUrl(song) && (
                          <a
                            href={song.sourceUrl || song.audioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-0.5 text-[10px] text-neutral-500 hover:text-blue-400 transition-colors"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            Open Source
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-neutral-400">
                      {formatTime(song.duration)}
                    </td>

                    <td className="py-3 px-3">{getStatusBadge(song.status)}</td>

                    <td className="py-3 px-3 text-right font-mono text-neutral-400">
                      {formatNumber(song.playCount)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View live */}
                        <Link
                          href={`/songs/${song.id}`}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                          title="View live track"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Edit */}
                        <button
                          onClick={() => setEditingSong(song)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                          title="Edit track"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Archive toggle */}
                        <button
                          onClick={() => handleToggleArchive(song)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            song.status === 'archived'
                              ? 'text-amber-400 hover:bg-amber-500/10'
                              : 'text-neutral-400 hover:text-amber-400 hover:bg-amber-500/10'
                          }`}
                          title={song.status === 'archived' ? 'Unarchive' : 'Archive'}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>

                        {/* More actions dropdown for URL-based tracks */}
                        {hasSourceUrl(song) && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveActionMenu(activeActionMenu === song.id ? null : song.id);
                              }}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                              title="More actions"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            {activeActionMenu === song.id && (
                              <div
                                className="absolute right-0 top-8 z-50 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {song.sourceUrl && (
                                  <a
                                    href={song.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Open Source
                                  </a>
                                )}
                                <button
                                  onClick={() => handleCopySourceUrl(song)}
                                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-white/5 transition-colors w-full text-left"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  Copy Source URL
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => setDeletingSong(song)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete track"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div className="px-4 py-3 bg-neutral-900/50 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
          <span>Showing {filteredSongs.length} of {songs.length} total tracks</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {songs.filter((s) => s.status === 'published').length} published
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {songs.filter((s) => s.sourcePlatform === 'youtube').length} YouTube
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {songs.filter((s) => s.sourceType === 'external_url' && s.sourcePlatform !== 'youtube').length} URL
            </span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <SongFormModal
        isOpen={Boolean(editingSong)}
        onClose={() => setEditingSong(null)}
        song={editingSong}
        onSaved={(updated) => {
          setSongs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        }}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingSong)}
        onClose={() => setDeletingSong(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Music Track?"
        message={`Are you sure you want to permanently delete "${deletingSong?.title}" by ${deletingSong?.artistName}? This action cannot be undone.`}
        confirmText="Delete Track"
      />
    </div>
  );
}
