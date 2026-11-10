'use client';

import React, { useState, useEffect, use, useMemo } from 'react';
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
  Disc,
  Users,
  Globe,
  Music,
  Search,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';
import { getOptimizedArtistAvatar, handleArtistAvatarError } from '@/lib/imageUtils';

const BATCH_SIZE = 40;

export default function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const artistId = resolvedParams.id;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<Artist[]>([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Tabs: 'popular' vs 'all'
  const [activeTab, setActiveTab] = useState<'popular' | 'all'>('all');
  const [trackSearch, setTrackSearch] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'oldest' | 'title' | 'album'>('popular');
  const [albumSortBy, setAlbumSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [albumTypeFilter, setAlbumTypeFilter] = useState<'all' | 'albums' | 'singles'>('all');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const [selectedSongForCollection, setSelectedSongForCollection] = useState<Song | null>(null);

  const { currentTrack, isPlaying, playTrack, togglePlayPause, toggleShuffle } = useAudio();
  const toast = useToast();

  const isArtistPlaying = isPlaying && allSongs.some((s) => s.id === currentTrack?.id);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/artists/${artistId}`)
      .then((res) => res.json())
      .then((data) => {
        setArtist(data.artist);
        setPopularSongs(data.popularSongs || []);
        setAllSongs(data.allSongs || data.popularSongs || []);
        setAlbums(data.albums || []);
        setRelatedArtists(data.relatedArtists || []);
        setIsFollowed(data.isFollowed);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [artistId]);

  // Filter and Sort all songs
  const filteredAllSongs = useMemo(() => {
    let list = allSongs;
    if (trackSearch.trim()) {
      const q = trackSearch.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.albumTitle && s.albumTitle.toLowerCase().includes(q))
      );
    }

    const sorted = [...list];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.releaseDate || b.createdAt).getTime() - new Date(a.releaseDate || a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.releaseDate || a.createdAt).getTime() - new Date(b.releaseDate || b.createdAt).getTime());
    } else if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'album') {
      sorted.sort((a, b) => (a.albumTitle || '').localeCompare(b.albumTitle || ''));
    } else {
      sorted.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
    }
    return sorted;
  }, [allSongs, trackSearch, sortBy]);

  // Filter and Sort artist albums
  const filteredAlbums = useMemo(() => {
    let list = [...albums];
    if (albumTypeFilter === 'albums') {
      list = list.filter((a) => (a.tracksCount || 0) >= 6);
    } else if (albumTypeFilter === 'singles') {
      list = list.filter((a) => (a.tracksCount || 0) < 6);
    }

    if (albumSortBy === 'newest') {
      list.sort((a, b) => {
        const dateA = new Date(a.releaseDate || `${a.releaseYear || 2020}-01-01`).getTime() || 0;
        const dateB = new Date(b.releaseDate || `${b.releaseYear || 2020}-01-01`).getTime() || 0;
        return dateB - dateA;
      });
    } else if (albumSortBy === 'oldest') {
      list.sort((a, b) => {
        const dateA = new Date(a.releaseDate || `${a.releaseYear || 2020}-01-01`).getTime() || 0;
        const dateB = new Date(b.releaseDate || `${b.releaseYear || 2020}-01-01`).getTime() || 0;
        return dateA - dateB;
      });
    } else if (albumSortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [albums, albumTypeFilter, albumSortBy]);

  const displayedAllSongs = useMemo(() => {
    return filteredAllSongs.slice(0, visibleCount);
  }, [filteredAllSongs, visibleCount]);

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
    const queue = allSongs.length > 0 ? allSongs : popularSongs;
    if (queue.length === 0) return;
    if (isArtistPlaying) {
      togglePlayPause();
    } else {
      playTrack(queue[0], queue);
    }
  };

  const handleShuffleArtist = () => {
    const queue = allSongs.length > 0 ? allSongs : popularSongs;
    if (queue.length === 0) return;
    const shuffled = [...queue].sort(() => Math.random() - 0.5);
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
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Hero Banner with Background */}
      <div className="relative overflow-hidden rounded-3xl min-h-[320px] md:min-h-[380px] p-6 md:p-10 flex flex-col justify-end border border-white/10 shadow-2xl">
        <img
          src={getOptimizedArtistAvatar(artist.banner || artist.coverImage || artist.avatar, artist.name)}
          alt={artist.name}
          referrerPolicy="no-referrer"
          onError={(e) => handleArtistAvatarError(e, artist.name)}
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          <img
            src={getOptimizedArtistAvatar(artist.avatar, artist.name)}
            alt={artist.name}
            referrerPolicy="no-referrer"
            onError={(e) => handleArtistAvatarError(e, artist.name)}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/20 shadow-2xl shrink-0 bg-neutral-900"
          />

          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              {artist.isVerified && (
                <span className="flex items-center gap-1 text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-blue-400/20" /> Verified Artist
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
              <span className="font-mono text-white font-bold">{formatNumber(artist.followersCount)}</span> followers •{' '}
              <span className="font-mono text-blue-400 font-bold">{allSongs.length} official soundtracks</span>
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
              <button
                onClick={handlePlayArtist}
                className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-black font-bold text-sm flex items-center gap-2 shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isArtistPlaying ? (
                  <>
                    <Pause className="w-5 h-5 fill-black" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-black ml-0.5" /> Play All Tracks ({allSongs.length})
                  </>
                )}
              </button>

              <button
                onClick={handleShuffleArtist}
                className="p-3 rounded-full border border-white/15 bg-black/40 backdrop-blur-md text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Shuffle songs"
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={handleFollowToggle}
                className={`group px-6 py-3 rounded-full border text-xs font-bold flex items-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                  isFollowed
                    ? 'border-blue-500/50 bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 hover:border-blue-400 shadow-blue-500/10'
                    : 'border-white/20 bg-black/40 backdrop-blur-md text-white hover:border-blue-400/60 hover:text-blue-300 hover:bg-white/10 active:scale-95'
                }`}
                title={isFollowed ? 'Remove from Library' : 'Add to Library'}
              >
                {isFollowed ? (
                  <>
                    <Heart className="w-4 h-4 fill-blue-400 text-blue-400 transition-transform group-hover:scale-110" />
                    <span>In Library</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 text-white/80 group-hover:text-blue-400 transition-all group-hover:scale-110" />
                    <span>Add to Library</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Section with Tabs: All Tracks (100+) vs Popular */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All Soundtracks ({allSongs.length})
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'popular'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Top Popular (10)
            </button>
          </div>

          {/* Search & Sort inside Artist tracks */}
          {activeTab === 'all' && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filter tracks..."
                  value={trackSearch}
                  onChange={(e) => {
                    setTrackSearch(e.target.value);
                    setVisibleCount(BATCH_SIZE);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-900 border border-white/10 rounded-full text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-neutral-900 border border-white/10 rounded-full px-3 py-1 text-xs text-neutral-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="popular" className="bg-neutral-900 text-white">Most Popular</option>
                  <option value="newest" className="bg-neutral-900 text-white">Recently Released (Newest)</option>
                  <option value="oldest" className="bg-neutral-900 text-white">Earliest Releases (Oldest)</option>
                  <option value="title" className="bg-neutral-900 text-white">Song Title (A-Z)</option>
                  <option value="album" className="bg-neutral-900 text-white">Album</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Popular Tab View */}
        {activeTab === 'popular' ? (
          popularSongs.length === 0 ? (
            <p className="text-sm text-neutral-500 py-6">No popular tracks listed.</p>
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
          )
        ) : (
          /* All Tracks Tab View */
          filteredAllSongs.length === 0 ? (
            <p className="text-sm text-neutral-500 py-8 text-center bg-neutral-900/30 rounded-2xl border border-white/5">
              {trackSearch ? `No tracks found matching "${trackSearch}".` : 'No soundtracks listed for this artist yet.'}
            </p>
          ) : (
            <>
              <div className="space-y-1">
                {displayedAllSongs.map((song, i) => (
                  <TrackRow
                    key={song.id}
                    song={song}
                    index={i}
                    playlistQueue={filteredAllSongs}
                    onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                    onAddToCollection={(s) => setSelectedSongForCollection(s)}
                  />
                ))}
              </div>

              {/* Load More & Show All Buttons */}
              {visibleCount < filteredAllSongs.length && (
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredAllSongs.length))}
                    className="px-6 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-white/10 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <ChevronDown className="w-4 h-4 text-blue-400" />
                    Load More Tracks ({displayedAllSongs.length} of {filteredAllSongs.length})
                  </button>
                  <button
                    onClick={() => setVisibleCount(filteredAllSongs.length)}
                    className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold border border-white/10 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    Show All ({filteredAllSongs.length})
                  </button>
                </div>
              )}
            </>
          )
        )}
      </section>

      {/* Discography / Albums with Chronological Sorting & Filtering */}
      {albums.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Disc className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Albums & Discography</h3>
              <span className="text-xs text-neutral-400 font-mono">({filteredAlbums.length})</span>
            </div>

            {/* Album Type & Sort Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Type Pills */}
              <div className="inline-flex items-center p-1 rounded-full bg-neutral-900 border border-white/10 text-xs">
                <button
                  onClick={() => setAlbumTypeFilter('all')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    albumTypeFilter === 'all'
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All ({albums.length})
                </button>
                <button
                  onClick={() => setAlbumTypeFilter('albums')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    albumTypeFilter === 'albums'
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Albums
                </button>
                <button
                  onClick={() => setAlbumTypeFilter('singles')}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    albumTypeFilter === 'singles'
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Singles & EPs
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-neutral-900 border border-white/10 rounded-full px-3 py-1 text-xs text-neutral-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                <select
                  value={albumSortBy}
                  onChange={(e) => setAlbumSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="newest" className="bg-neutral-900 text-white">Newest First</option>
                  <option value="oldest" className="bg-neutral-900 text-white">Earliest First</option>
                  <option value="title" className="bg-neutral-900 text-white">Album Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {filteredAlbums.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6">No releases match the selected filter.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          )}
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
              </div>
            )}
          </div>
        </section>
      )}

      {/* Related Artists */}
      {relatedArtists.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Fans Also Like</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
