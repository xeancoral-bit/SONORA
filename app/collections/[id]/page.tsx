'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { UserCollection, Song } from '@/lib/types';
import { TrackRow } from '@/components/ui/TrackRow';
import { useAudio } from '@/context/AudioContext';
import { useToast } from '@/context/ToastContext';
import { formatTime } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  Play,
  Pause,
  Shuffle,
  FolderHeart,
  Clock,
  Trash2
} from 'lucide-react';

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const collectionId = resolvedParams.id;
  const router = useRouter();

  const [collection, setCollection] = useState<UserCollection | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { currentTrack, isPlaying, playTrack, togglePlayPause, toggleShuffle } = useAudio();
  const toast = useToast();

  const isCollectionPlaying = isPlaying && songs.some((s) => s.id === currentTrack?.id);

  useEffect(() => {
    fetch(`/api/collections/${collectionId}`)
      .then((res) => res.json())
      .then((data) => {
        setCollection(data.collection);
        setSongs(data.songs || []);
        setTotalDuration(data.totalDuration || 0);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [collectionId]);

  const handlePlayCollection = () => {
    if (songs.length === 0) return;
    if (isCollectionPlaying) {
      togglePlayPause();
    } else {
      playTrack(songs[0], songs);
    }
  };

  const handleShuffleCollection = () => {
    if (songs.length === 0) return;
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    toggleShuffle();
    playTrack(shuffled[0], shuffled);
  };

  const handleRemoveSong = async (songId: string) => {
    if (!collection) return;
    const newIds = collection.songIds.filter((id) => id !== songId);
    try {
      const res = await fetch(`/api/collections/${collection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songIds: newIds })
      });
      if (res.ok) {
        setCollection((prev) => (prev ? { ...prev, songIds: newIds } : null));
        setSongs((prev) => prev.filter((s) => s.id !== songId));
        toast.info('Removed from collection');
      }
    } catch {
      toast.error('Failed to remove track');
    }
  };

  const handleDeleteCollection = async () => {
    if (!collection) return;
    try {
      const res = await fetch(`/api/collections/${collection.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Collection deleted');
        router.push('/collections');
      }
    } catch {
      toast.error('Failed to delete collection');
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-sm text-neutral-400">Loading collection...</div>;
  }

  if (!collection) {
    return <div className="py-20 text-center text-base text-neutral-400">Collection not found.</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 bg-gradient-to-b from-purple-950/40 to-transparent p-6 md:p-8 rounded-3xl border border-purple-500/10 shadow-2xl">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-neutral-900 border border-purple-500/20 flex items-center justify-center">
          {collection.coverImage ? (
            <img src={collection.coverImage} alt={collection.title} className="w-full h-full object-cover" />
          ) : (
            <FolderHeart className="w-20 h-20 text-purple-400" />
          )}
        </div>

        <div className="flex-1 text-center md:text-left min-w-0">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 block mb-1">
            Personal Collection
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            {collection.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-neutral-400">
            <span className="font-bold text-white">By {collection.userName}</span>
            <span>•</span>
            <span>{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span>
            <span>•</span>
            <span className="font-mono">{formatTime(totalDuration)}</span>
          </div>

          {collection.description && (
            <p className="text-xs md:text-sm text-neutral-300 mt-3 max-w-2xl leading-relaxed">
              {collection.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
            <button
              onClick={handlePlayCollection}
              disabled={songs.length === 0}
              className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-purple-600/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isCollectionPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-white" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white ml-0.5" /> Play Collection
                </>
              )}
            </button>

            <button
              onClick={handleShuffleCollection}
              disabled={songs.length === 0}
              className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
              title="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsDeleteOpen(true)}
              className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete collection"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist Table */}
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
          </div>
        </div>

        {songs.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <FolderHeart className="w-10 h-10 text-neutral-600 mx-auto" />
            <h4 className="text-base font-bold text-white">Collection is empty.</h4>
            <p className="text-xs text-neutral-400">
              Add your favorite library songs to this collection using the track 3-dot options menu.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {songs.map((song, i) => (
              <TrackRow
                key={song.id}
                song={song}
                index={i}
                playlistQueue={songs}
                showAlbum={true}
                onRemoveFromList={() => handleRemoveSong(song.id)}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteCollection}
        title="Delete Collection?"
        message={`Are you sure you want to delete the collection "${collection.title}"? The official songs will remain in the library.`}
        confirmText="Delete Collection"
      />
    </div>
  );
}
