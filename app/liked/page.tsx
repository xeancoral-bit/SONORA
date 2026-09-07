'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Song } from '@/lib/types';
import { TrackRow } from '@/components/ui/TrackRow';
import { useAudio } from '@/context/AudioContext';
import { useAuth } from '@/context/AuthContext';
import { formatTime } from '@/lib/utils';
import { AddToPlaylistModal } from '@/components/ui/AddToPlaylistModal';
import { AddToCollectionModal } from '@/components/ui/AddToCollectionModal';
import { Play, Pause, Shuffle, Heart, Clock } from 'lucide-react';

export default function LikedSongsPage() {
  const { user } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const [selectedSongForCollection, setSelectedSongForCollection] = useState<Song | null>(null);

  const { currentTrack, isPlaying, playTrack, togglePlayPause, toggleShuffle } = useAudio();

  const isLikedPlaying = isPlaying && songs.some((s) => s.id === currentTrack?.id);
  const totalDuration = songs.reduce((acc, s) => acc + (s.duration || 0), 0);

  useEffect(() => {
    let isMounted = true;
    async function loadLikes() {
      try {
        const res = await fetch('/api/likes');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) setSongs(data.songs || []);
      } catch {
        // Safe fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadLikes();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    if (isLikedPlaying) {
      togglePlayPause();
    } else {
      playTrack(songs[0], songs);
    }
  };

  const handleShuffle = () => {
    if (songs.length === 0) return;
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    toggleShuffle();
    playTrack(shuffled[0], shuffled);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 bg-gradient-to-b from-emerald-950/60 via-emerald-950/20 to-transparent p-6 md:p-8 rounded-3xl border border-emerald-500/20 shadow-2xl">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-gradient-to-br from-emerald-600 to-teal-900 flex items-center justify-center border border-emerald-400/30">
          <Heart className="w-24 h-24 text-white fill-white shadow-lg" />
        </div>

        <div className="flex-1 text-center md:text-left min-w-0">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
            Auto Playlist
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            Liked Songs
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-neutral-400">
            <span className="font-bold text-white">{user?.name || 'User'}</span>
            <span>•</span>
            <span>{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span>
            <span>•</span>
            <span className="font-mono">{formatTime(totalDuration)}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
            <button
              onClick={handlePlayAll}
              disabled={songs.length === 0}
              className="px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isLikedPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-black" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-black ml-0.5" /> Play Liked Songs
                </>
              )}
            </button>

            <button
              onClick={handleShuffle}
              disabled={songs.length === 0}
              className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
              title="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
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

        {isLoading ? (
          <div className="py-20 text-center text-sm text-neutral-400">Loading liked songs...</div>
        ) : songs.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-3">
            <Heart className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Songs you like will appear here</h3>
            <p className="text-xs text-neutral-400">
              Save songs by tapping the heart icon on any track row, player bar, or song details page.
            </p>
            <Link
              href="/browse"
              className="px-5 py-2 rounded-full bg-emerald-500 text-black text-xs font-semibold inline-block"
            >
              Find Songs
            </Link>
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
                onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                onAddToCollection={(s) => setSelectedSongForCollection(s)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddToPlaylistModal
        isOpen={Boolean(selectedSongForPlaylist)}
        onClose={() => setSelectedSongForPlaylist(null)}
        song={selectedSongForPlaylist}
      />
      <AddToCollectionModal
        isOpen={Boolean(selectedSongForCollection)}
        onClose={() => setSelectedSongForCollection(null)}
        song={selectedSongForCollection}
      />
    </div>
  );
}
