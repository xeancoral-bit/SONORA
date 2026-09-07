'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Album, Song } from '@/lib/types';
import { TrackRow } from '@/components/ui/TrackRow';
import { useAudio } from '@/context/AudioContext';
import { useToast } from '@/context/ToastContext';
import { formatTime, formatDate } from '@/lib/utils';
import { AddToPlaylistModal } from '@/components/ui/AddToPlaylistModal';
import { AddToCollectionModal } from '@/components/ui/AddToCollectionModal';
import { Play, Pause, Shuffle, Heart, Share2, Clock, Disc } from 'lucide-react';

export default function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const albumId = resolvedParams.id;

  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const [selectedSongForCollection, setSelectedSongForCollection] = useState<Song | null>(null);

  const { currentTrack, isPlaying, playTrack, togglePlayPause, toggleShuffle } = useAudio();
  const toast = useToast();

  const isAlbumPlaying = isPlaying && songs.some((s) => s.id === currentTrack?.id);

  useEffect(() => {
    fetch(`/api/albums/${albumId}`)
      .then((res) => res.json())
      .then((data) => {
        setAlbum(data.album);
        setSongs(data.songs || []);
        setTotalDuration(data.totalDuration || 0);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [albumId]);

  const handlePlayAlbum = () => {
    if (songs.length === 0) return;
    if (isAlbumPlaying) {
      togglePlayPause();
    } else {
      playTrack(songs[0], songs);
    }
  };

  const handleShuffleAlbum = () => {
    if (songs.length === 0) return;
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    toggleShuffle();
    playTrack(shuffled[0], shuffled);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Album link copied to clipboard!');
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-sm text-neutral-400">Loading album...</div>;
  }

  if (!album) {
    return <div className="py-20 text-center text-base text-neutral-400">Album not found.</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Album Header Banner */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 bg-gradient-to-b from-neutral-800/40 to-transparent p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl">
        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-neutral-900 border border-white/10">
          <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 text-center md:text-left min-w-0">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block mb-1">
            Album
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            {album.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-neutral-400">
            <Link
              href={`/artists/${album.artistId}`}
              className="font-bold text-white hover:text-cyan-400 hover:underline transition-colors"
            >
              {album.artistName}
            </Link>
            <span>•</span>
            <Link
              href={`/genres/${album.genreId}`}
              className="text-neutral-300 hover:underline"
            >
              {album.genreName}
            </Link>
            <span>•</span>
            <span>{album.releaseDate ? album.releaseDate.split('-')[0] : '2025'}</span>
            <span>•</span>
            <span>{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span>
            <span>•</span>
            <span className="font-mono">{formatTime(totalDuration)}</span>
          </div>

          {album.description && (
            <p className="text-xs md:text-sm text-neutral-400 mt-3 max-w-2xl leading-relaxed">
              {album.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
            <button
              onClick={handlePlayAlbum}
              className="px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
            >
              {isAlbumPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-black" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-black ml-0.5" /> Play Album
                </>
              )}
            </button>

            <button
              onClick={handleShuffleAlbum}
              className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Shuffle album"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Share album"
            >
              <Share2 className="w-5 h-5" />
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
          <div className="py-12 text-center text-sm text-neutral-500">
            No tracks in this album yet.
          </div>
        ) : (
          <div className="space-y-1">
            {songs.map((song, i) => (
              <TrackRow
                key={song.id}
                song={song}
                index={i}
                playlistQueue={songs}
                showAlbum={false}
                onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                onAddToCollection={(s) => setSelectedSongForCollection(s)}
              />
            ))}
          </div>
        )}

        {album.copyrightInfo && (
          <div className="pt-8 text-xs text-neutral-400 border-t border-white/5">
            <p>{album.copyrightInfo}</p>
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
