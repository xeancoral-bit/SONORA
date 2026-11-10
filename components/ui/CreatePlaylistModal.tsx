'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Modal } from './Modal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Lock, Globe, LogIn, UserPlus, Upload, Loader2, X } from 'lucide-react';

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
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large', 'Please choose an image under 10MB.');
      return;
    }

    try {
      setIsUploadingCover(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'cover');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setCoverImage(data.url);
        toast.success('Cover uploaded successfully');
      } else {
        toast.error(data.error || 'Failed to upload cover image');
      }
    } catch {
      toast.error('Upload failed', 'Please try again.');
    } finally {
      setIsUploadingCover(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shadow-xl shadow-blue-500/10">
              <Lock className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 text-black flex items-center justify-center font-bold text-xs shadow-md">
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
              className="flex-1 py-3 px-5 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2"
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
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
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
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Cover Image URL (Optional)
          </label>

          <div className="flex items-center gap-2">
            {coverImage && (
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-neutral-800 group">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="relative flex-1">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors pr-24"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingCover}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isUploadingCover ? (
                  <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                ) : (
                  <Upload className="w-3 h-3 text-blue-400" />
                )}
                <span>Upload</span>
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleCoverFileUpload}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-white/5">
          <div className="flex items-center gap-3">
            {isPublic ? (
              <Globe className="w-5 h-5 text-blue-400" />
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
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
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
            className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Save Playlist'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
