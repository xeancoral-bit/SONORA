'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Album, Artist, Genre, Song } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

interface AlbumFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  album: Album | null;
  onSaved: (album: Album) => void;
}

export const AlbumFormModal: React.FC<AlbumFormModalProps> = ({
  isOpen,
  onClose,
  album,
  onSaved
}) => {
  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState('');
  const [genreId, setGenreId] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [copyrightInfo, setCopyrightInfo] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetch('/api/artists').then((r) => r.json()),
        fetch('/api/genres').then((r) => r.json()),
        fetch('/api/songs').then((r) => r.json())
      ]).then(([artRes, genRes, songRes]) => {
        setArtists(artRes.artists || []);
        setGenres(genRes.genres || []);
        setAllSongs(songRes.songs || []);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (album) {
      setTitle(album.title);
      setArtistId(album.artistId);
      setGenreId(album.genreId);
      setCoverImage(album.coverImage || '');
      setDescription(album.description || '');
      setReleaseDate(album.releaseDate || '');
      setCopyrightInfo(album.copyrightInfo || '');
      setIsFeatured(album.isFeatured || false);
      setStatus(album.status || 'published');
      setSelectedSongIds(album.songIds || []);
    } else {
      setTitle('');
      setArtistId('');
      setGenreId('genre-pop');
      setCoverImage('');
      setDescription('');
      setReleaseDate(new Date().toISOString().split('T')[0]);
      setCopyrightInfo('');
      setIsFeatured(false);
      setStatus('published');
      setSelectedSongIds([]);
    }
  }, [album, isOpen]);

  const toggleSongSelection = (songId: string) => {
    setSelectedSongIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artistId) {
      toast.error('Album title and artist are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const selectedArtist = artists.find((a) => a.id === artistId);
      const selectedGenre = genres.find((g) => g.id === genreId);

      const endpoint = album ? `/api/albums/${album.id}` : '/api/albums';
      const method = album ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          artistId,
          artistName: selectedArtist?.name || 'Artist',
          genreId,
          genreName: selectedGenre?.name || 'Pop',
          coverImage: coverImage.trim() || undefined,
          description: description.trim() || undefined,
          releaseDate,
          copyrightInfo,
          isFeatured,
          status,
          songIds: selectedSongIds
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(album ? 'Album Updated' : 'Album Created');
        onSaved(data.album);
        onClose();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={album ? 'Edit Album' : 'Create New Album'} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Album Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Artist *
            </label>
            <select
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- Select Artist --</option>
              {artists.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Genre *
            </label>
            <select
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Cover Artwork URL
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Select Tracks in Album ({selectedSongIds.length})
          </label>
          <div className="max-h-40 overflow-y-auto border border-white/10 rounded-xl p-2 bg-neutral-900/60 space-y-1">
            {allSongs.map((s) => {
              const checked = selectedSongIds.includes(s.id);
              return (
                <div
                  key={s.id}
                  onClick={() => toggleSongSelection(s.id)}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer ${
                    checked ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'hover:bg-white/5 text-neutral-400'
                  }`}
                >
                  <span className="truncate">{s.title} ({s.artistName})</span>
                  <input type="checkbox" checked={checked} readOnly className="accent-cyan-500 rounded" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-cyan-500 rounded"
            />
            Feature on Homepage
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs font-semibold text-neutral-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs"
          >
            {isSubmitting ? 'Saving...' : 'Save Album'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
