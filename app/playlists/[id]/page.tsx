'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Playlist, Song } from '@/lib/types';
import { TrackRow } from '@/components/ui/TrackRow';
import { useAudio } from '@/context/AudioContext';
import { useToast } from '@/context/ToastContext';
import { formatTime } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import {
  Play,
  Pause,
  Shuffle,
  Share2,
  ListMusic,
  Clock,
  Globe,
  Lock,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function PlaylistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const playlistId = resolvedParams.id;
  const router = useRouter();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Edit playlist modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCover, setEditCover] = useState('');
  const [editIsPublic, setEditIsPublic] = useState(true);

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { currentTrack, isPlaying, playTrack, togglePlayPause, toggleShuffle } = useAudio();
  const toast = useToast();

  const isPlaylistPlaying = isPlaying && songs.some((s) => s.id === currentTrack?.id);

  useEffect(() => {
    fetch(`/api/playlists/${playlistId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }
        setPlaylist(data.playlist);
        setSongs(data.songs || []);
        setTotalDuration(data.totalDuration || 0);
        setIsOwner(data.isOwner);
        if (data.playlist) {
          setEditTitle(data.playlist.title);
          setEditDescription(data.playlist.description || '');
          setEditCover(data.playlist.coverImage || '');
          setEditIsPublic(data.playlist.isPublic);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [playlistId]);

  const handlePlayPlaylist = () => {
    if (songs.length === 0) return;
    if (isPlaylistPlaying) {
      togglePlayPause();
    } else {
      playTrack(songs[0], songs);
    }
  };

  const handleShufflePlaylist = () => {
    if (songs.length === 0) return;
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    toggleShuffle();
    playTrack(shuffled[0], shuffled);
  };

  const handleRemoveSong = async (songId: string) => {
    if (!playlist) return;
    const updatedIds = playlist.songIds.filter((id) => id !== songId);
    try {
      const res = await fetch(`/api/playlists/${playlist.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songIds: updatedIds })
      });
      if (res.ok) {
        setPlaylist((prev) => (prev ? { ...prev, songIds: updatedIds } : null));
        setSongs((prev) => prev.filter((s) => s.id !== songId));
        toast.info('Song removed from playlist');
      }
    } catch {
      toast.error('Failed to remove song');
    }
  };

  const handleMoveSong = async (index: number, direction: 'up' | 'down') => {
    if (!playlist) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= songs.length) return;

    const newSongs = [...songs];
    const [moved] = newSongs.splice(index, 1);
    newSongs.splice(targetIndex, 0, moved);

    const newSongIds = newSongs.map((s) => s.id);
    setSongs(newSongs);

    try {
      await fetch(`/api/playlists/${playlist.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songIds: newSongIds })
      });
      setPlaylist((prev) => (prev ? { ...prev, songIds: newSongIds } : null));
    } catch {}
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlist || !editTitle.trim()) return;

    try {
      const res = await fetch(`/api/playlists/${playlist.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          coverImage: editCover.trim() || undefined,
          isPublic: editIsPublic
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPlaylist(data.playlist);
        setIsEditOpen(false);
        toast.success('Playlist updated!');
      }
    } catch {
      toast.error('Failed to update playlist');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!playlist) return;
    try {
      const res = await fetch(`/api/playlists/${playlist.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Playlist deleted');
        router.push('/playlists');
      }
    } catch {
      toast.error('Failed to delete playlist');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Playlist link copied to clipboard!');
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-sm text-neutral-400">Loading playlist...</div>;
  }

  if (!playlist) {
    return <div className="py-20 text-center text-base text-neutral-400">Playlist not found.</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Playlist Hero Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 bg-gradient-to-b from-neutral-800/40 to-transparent p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl">
        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-neutral-900 border border-white/10 flex items-center justify-center">
          {playlist.coverImage ? (
            <img src={playlist.coverImage} alt={playlist.title} className="w-full h-full object-cover" />
          ) : (
            <ListMusic className="w-20 h-20 text-neutral-600" />
          )}
        </div>

        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              {playlist.isPublic ? 'Public Playlist' : 'Private Playlist'}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            {playlist.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-neutral-400">
            <span className="font-bold text-white">By {playlist.userName}</span>
            <span>•</span>
            <span>{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span>
            <span>•</span>
            <span className="font-mono">{formatTime(totalDuration)}</span>
          </div>

          {playlist.description && (
            <p className="text-xs md:text-sm text-neutral-400 mt-3 max-w-2xl leading-relaxed">
              {playlist.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
            <button
              onClick={handlePlayPlaylist}
              disabled={songs.length === 0}
              className="px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isPlaylistPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-black" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-black ml-0.5" /> Play Playlist
                </>
              )}
            </button>

            <button
              onClick={handleShufflePlaylist}
              disabled={songs.length === 0}
              className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
              title="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Edit playlist"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsDeleteOpen(true)}
                  className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete playlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}

            <button
              onClick={handleShare}
              className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Share playlist"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist Table with Drag / Move Support */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="w-8 text-center">#</span>
            <span>Title</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="hidden lg:block w-24 text-right">Plays</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
            </span>
            {isOwner && <span className="w-16 text-center">Reorder</span>}
          </div>
        </div>

        {songs.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <h4 className="text-base font-bold text-white">Your soundtrack starts here.</h4>
            <p className="text-xs text-neutral-400">
              Browse music and add songs you love to this playlist.
            </p>
            <div className="pt-3">
              <Link
                href="/browse"
                className="px-5 py-2 rounded-full bg-emerald-500 text-black font-semibold text-xs inline-block"
              >
                Discover Music
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {songs.map((song, i) => (
              <div key={song.id} className="relative group/row flex items-center">
                <div className="flex-1 min-w-0">
                  <TrackRow
                    song={song}
                    index={i}
                    playlistQueue={songs}
                    showAlbum={true}
                    onRemoveFromList={isOwner ? () => handleRemoveSong(song.id) : undefined}
                  />
                </div>

                {/* Reorder Up/Down arrows (Owner only) */}
                {isOwner && (
                  <div className="flex items-center gap-1 pl-2 shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMoveSong(i, 'up')}
                      disabled={i === 0}
                      className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-20 hover:bg-white/10"
                      title="Move track up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveSong(i, 'down')}
                      disabled={i === songs.length - 1}
                      className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-20 hover:bg-white/10"
                      title="Move track down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Playlist">
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Playlist Name *
            </label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Cover Image URL
            </label>
            <input
              type="url"
              value={editCover}
              onChange={(e) => setEditCover(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-white/5">
            <span className="text-xs font-semibold text-white">Privacy Setting</span>
            <button
              type="button"
              onClick={() => setEditIsPublic(!editIsPublic)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                editIsPublic
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400'
              }`}
            >
              {editIsPublic ? 'Public' : 'Private'}
            </button>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs font-semibold text-neutral-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Playlist?"
        message={`Are you sure you want to permanently delete "${playlist.title}"? This action cannot be undone.`}
        confirmText="Delete Playlist"
      />
    </div>
  );
}
