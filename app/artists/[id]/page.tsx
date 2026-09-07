'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Artist, Song, Album } from '@/lib/types';
import { TrackRow } from '@/components/ui/TrackRow';
import { AlbumCard } from '@/components/ui/AlbumCard';
import { ArtistCard } from '@/components/ui/ArtistCard';
import { useAudio } from '@/context/AudioContext';
import { useToast } from '@/context/ToastContext';
import { formatNumber } from '@/lib/utils';
import { AddToPlaylistModal } from '@/components/ui/AddToPlaylistModal';
import { AddToCollectionModal } from '@/components/ui/AddToCollectionModal';
import {
  Play,
  Pause,
  Shuffle,
  CheckCircle2,
  Heart,
  UserPlus,
  UserCheck,
  Disc,
  Users,
  Globe,
  Share2
} from 'lucide-react';

export default function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const artistId = resolvedParams.id;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<Artist[]>([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const [selectedSongForCollection, setSelectedSongForCollection] = useState<Song | null>(null);

  const { currentTrack, isPlaying, playTrack, togglePlayPause, toggleShuffle } = useAudio();
  const toast = useToast();

  const isArtistPlaying = isPlaying && popularSongs.some((s) => s.id === currentTrack?.id);

  useEffect(() => {
    fetch(`/api/artists/${artistId}`)
      .then((res) => res.json())
      .then((data) => {
        setArtist(data.artist);
        setPopularSongs(data.popularSongs || []);
        setAlbums(data.albums || []);
        setRelatedArtists(data.relatedArtists || []);
        setIsFollowed(data.isFollowed);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [artistId]);

  const handleFollowToggle = async () => {
    if (!artist) return;
    try {
      const res = await fetch(`/api/artists/${artist.id}/follow`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIsFollowed(data.isFollowed);
        setArtist((prev) => (prev ? { ...prev, followersCount: data.followersCount } : null));
        if (data.isFollowed) {
          toast.success(`Added ${artist.name} to your Library`);
        } else {
          toast.info(`Removed ${artist.name} from Library`);
        }
      } else if (res.status === 401) {
        toast.error('Please log in to add artists to your Library');
      }
    } catch {
      toast.error('Please log in to add artists to your Library');
    }
  };

  const handlePlayArtist = () => {
    if (popularSongs.length === 0) return;
    if (isArtistPlaying) {
      togglePlayPause();
    } else {
      playTrack(popularSongs[0], popularSongs);
    }
  };

  const handleShuffleArtist = () => {
    if (popularSongs.length === 0) return;
    const shuffled = [...popularSongs].sort(() => Math.random() - 0.5);
    toggleShuffle();
    playTrack(shuffled[0], shuffled);
  };

  if (isLoading) {
    return <div className="py-20 text-center text-sm text-neutral-400">Loading artist profile...</div>;
  }

  if (!artist) {
    return <div className="py-20 text-center text-base text-neutral-400">Artist not found.</div>;
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Hero Banner with Background */}
      <div className="relative overflow-hidden rounded-3xl min-h-[320px] md:min-h-[380px] p-6 md:p-10 flex flex-col justify-end border border-white/10 shadow-2xl">
        <img
          src={artist.banner || artist.avatar}
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          <img
            src={artist.avatar}
            alt={artist.name}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/20 shadow-2xl shrink-0"
          />

          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              {artist.isVerified && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-400/20" /> Verified Artist
                </span>
              )}
              {artist.country && (
                <span className="text-xs text-neutral-400 font-medium">{artist.country}</span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {artist.name}
            </h1>

            <p className="text-xs md:text-sm text-neutral-300 mt-2 font-medium">
              <span className="font-mono text-white font-bold">{formatNumber(artist.monthlyListeners)}</span> monthly listeners •{' '}
              <span className="font-mono text-white font-bold">{formatNumber(artist.followersCount)}</span> followers
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
              <button
                onClick={handlePlayArtist}
                className="px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
              >
                {isArtistPlaying ? (
                  <>
                    <Pause className="w-5 h-5 fill-black" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-black ml-0.5" /> Play Artist
                  </>
                )}
              </button>

              <button
                onClick={handleShuffleArtist}
                className="p-3 rounded-full border border-white/15 bg-black/40 backdrop-blur-md text-white hover:bg-white/10 transition-colors"
                title="Shuffle songs"
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={handleFollowToggle}
                className={`group px-6 py-3 rounded-full border text-xs font-bold flex items-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                  isFollowed
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-400 shadow-emerald-500/10'
                    : 'border-white/20 bg-black/40 backdrop-blur-md text-white hover:border-emerald-400/60 hover:text-emerald-300 hover:bg-white/10 active:scale-95'
                }`}
                title={isFollowed ? 'Remove from Library' : 'Add to Library'}
              >
                {isFollowed ? (
                  <>
                    <Heart className="w-4 h-4 fill-emerald-400 text-emerald-400 transition-transform group-hover:scale-110" />
                    <span>In Library</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 text-white/80 group-hover:text-emerald-400 transition-all group-hover:scale-110" />
                    <span>Add to Library</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Songs Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-white">Popular Songs</h3>
        {popularSongs.length === 0 ? (
          <p className="text-sm text-neutral-500 py-6">No songs available for this artist.</p>
        ) : (
          <div className="space-y-1">
            {popularSongs.map((song, i) => (
              <TrackRow
                key={song.id}
                song={song}
                index={i}
                playlistQueue={popularSongs}
                onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                onAddToCollection={(s) => setSelectedSongForCollection(s)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Discography / Albums */}
      {albums.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Albums & Discography</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* About & Biography Section */}
      {artist.bio && (
        <section className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
          <h3 className="text-xl font-bold text-white">About {artist.name}</h3>
          <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-4xl">
            {artist.bio}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5 text-xs text-neutral-400">
            {artist.genreName && (
              <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-full border border-white/10">
                <span className="text-neutral-500 font-medium">Genre:</span>
                <span className="text-white font-semibold">{artist.genreName}</span>
              </div>
            )}
            {artist.country && (
              <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-full border border-white/10">
                <span className="text-neutral-500 font-medium">Origin:</span>
                <span className="text-white font-semibold">{artist.country}</span>
              </div>
            )}

            {/* Social Links */}
            {artist.socialLinks && (
              <div className="flex items-center gap-2 ml-auto">
                {artist.socialLinks.spotify && (
                  <a
                    href={artist.socialLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {artist.socialLinks.instagram && (
                  <a
                    href={artist.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8"
                    title="Instagram"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {artist.socialLinks.twitter && (
                  <a
                    href={artist.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8"
                    title="Twitter / X"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Related Artists */}
      {relatedArtists.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Fans Also Like</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {relatedArtists.map((rel) => (
              <ArtistCard key={rel.id} artist={rel} />
            ))}
          </div>
        </section>
      )}

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
