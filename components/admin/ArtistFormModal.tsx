'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Artist, Genre } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

interface ArtistFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: Artist | null;
  onSaved: (artist: Artist) => void;
}

export const ArtistFormModal: React.FC<ArtistFormModalProps> = ({
  isOpen,
  onClose,
  artist,
  onSaved
}) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [banner, setBanner] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('Global');
  const [genreId, setGenreId] = useState('');
  const [isVerified, setIsVerified] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');

  const [genres, setGenres] = useState<Genre[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetch('/api/genres')
        .then((r) => r.json())
        .then((d) => setGenres(d.genres || []));
    }
  }, [isOpen]);

  useEffect(() => {
    if (artist) {
      setName(artist.name);
      setAvatar(artist.avatar || '');
      setBanner(artist.banner || '');
      setBio(artist.bio || '');
      setCountry(artist.country || 'Global');
      setGenreId(artist.genreId || '');
      setIsVerified(artist.isVerified ?? true);
      setIsFeatured(artist.isFeatured || false);
      setWebsite(artist.socialLinks?.website || '');
      setInstagram(artist.socialLinks?.instagram || '');
      setTwitter(artist.socialLinks?.twitter || '');
    } else {
      setName('');
      setAvatar('');
      setBanner('');
      setBio('');
      setCountry('United States');
      setGenreId('genre-pop');
      setIsVerified(true);
      setIsFeatured(false);
      setWebsite('');
      setInstagram('');
      setTwitter('');
    }
  }, [artist, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      const selectedGenre = genres.find((g) => g.id === genreId);

      const endpoint = artist ? `/api/artists/${artist.id}` : '/api/artists';
      const method = artist ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          avatar: avatar.trim() || undefined,
          banner: banner.trim() || undefined,
          bio: bio.trim(),
          country,
          genreId: genreId || undefined,
          genreName: selectedGenre?.name || undefined,
          isVerified,
          isFeatured,
          socialLinks: {
            website: website.trim() || undefined,
            instagram: instagram.trim() || undefined,
            twitter: twitter.trim() || undefined
          }
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(artist ? 'Artist Profile Updated' : 'Artist Created');
        onSaved(data.artist);
        onClose();
      } else {
        toast.error(data.error || 'Failed to save artist');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={artist ? 'Edit Artist Profile' : 'Add New Artist'} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Artist Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Primary Genre
            </label>
            <select
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">-- None --</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Banner Image URL
            </label>
            <input
              type="url"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Biography
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
              className="accent-purple-500 rounded"
            />
            Verified Artist Badge
          </label>

          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-purple-500 rounded"
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
            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/25"
          >
            {isSubmitting ? 'Saving...' : 'Save Artist'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
