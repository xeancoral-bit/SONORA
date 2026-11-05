'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Modal } from './Modal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Lock, Globe, LogIn, UserPlus } from 'lucide-react';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (playlist: any) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Account Required', 'Please sign in or create an account to make a playlist.');
      return;
    }

    if (!title.trim()) {
      toast.error('Playlist name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          coverImage: coverImage.trim() || undefined,
          isPublic
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Playlist Created', `"${data.playlist.title}" is ready!`);
        setTitle('');
        setDescription('');
        setCoverImage('');
        onClose();
        if (onSuccess) onSuccess(data.playlist);
      } else {
        toast.error(data.error || 'Failed to create playlist');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not signed in / has no account yet, show Account Required screen
  if (!user) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Account Required">
        <div className="flex flex-col items-center text-center py-5 px-3">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
              <Lock className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs shadow-md">
              <UserPlus className="w-3.5 h-3.5" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            Create an Account to Make Playlists
          </h3>

          <p className="text-sm text-neutral-400 max-w-sm mb-6 leading-relaxed">
            Dili ka maka-create og playlist kung wala pa kay account. Sign in or register for free to create, customize, and save your own playlists on Sonora.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href="/auth/login?redirect=/playlists"
              onClick={onClose}
              className="flex-1 py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In or Register
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Playlist">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Playlist Name *
          </label>
          <input
            type="text"
            required
            placeholder="My Playlist #1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows={2}
            placeholder="Give your playlist a memorable description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Cover Image URL (Optional)
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-white/5">
          <div className="flex items-center gap-3">
            {isPublic ? (
              <Globe className="w-5 h-5 text-emerald-400" />
            ) : (
              <Lock className="w-5 h-5 text-amber-400" />
            )}
            <div>
              <h5 className="text-sm font-semibold text-white">
                {isPublic ? 'Public Playlist' : 'Private Playlist'}
              </h5>
              <p className="text-xs text-neutral-400">
                {isPublic ? 'Anyone on Sonora can listen' : 'Only you can view this playlist'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              isPublic
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400'
            }`}
          >
            {isPublic ? 'Public' : 'Private'}
          </button>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-900 hover:bg-neutral-800 text-sm font-semibold text-neutral-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Save Playlist'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
