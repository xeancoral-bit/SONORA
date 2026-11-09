'use client';

import React, { useState, useEffect, use, useMemo } from 'react';
import { Song, Album, Artist, Genre } from '@/lib/types';
import { SongCard } from '@/components/ui/SongCard';
import { AlbumCard } from '@/components/ui/AlbumCard';
import { ArtistCard } from '@/components/ui/ArtistCard';
import { AddToPlaylistModal } from '@/components/ui/AddToPlaylistModal';
import { AddToCollectionModal } from '@/components/ui/AddToCollectionModal';
import { Play, Disc, Users, Music, Search, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

const BATCH_SIZE = 48;

export default function GenreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const genreId = resolvedParams.id;

  const [genre, setGenre] = useState<Genre | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search and Sort controls
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'title' | 'artist'>('popular');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const [selectedSongForCollection, setSelectedSongForCollection] = useState<Song | null>(null);

  const { playTrack } = useAudio();

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/genres/${genreId}`)
      .then((res) => res.json())
      .then((data) => {
        setGenre(data.genre);
        setSongs(data.songs || []);
        setAlbums(data.albums || []);
        setArtists(data.artists || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [genreId]);

  // Filter & Sort
  const filteredSongs = useMemo(() => {
    let list = songs;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artistName.toLowerCase().includes(q) ||
          (s.albumTitle && s.albumTitle.toLowerCase().includes(q))
      );
    }

    const sorted = [...list];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.releaseDate || b.createdAt).getTime() - new Date(a.releaseDate || a.createdAt).getTime());
    } else if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'artist') {
      sorted.sort((a, b) => a.artistName.localeCompare(b.artistName));
    } else {
      sorted.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
    }
    return sorted;
  }, [songs, searchQuery, sortBy]);

  const displayedSongs = useMemo(() => {
    return filteredSongs.slice(0, visibleCount);
  }, [filteredSongs, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredSongs.length));
  };

  if (isLoading) {
    return <div className="py-20 text-center text-sm text-neutral-400">Loading {genreId}...</div>;
  }

  if (!genre) {
    return <div className="py-20 text-center text-base text-neutral-400">Genre not found.</div>;
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Hero Genre Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-r ${genre.color} border border-white/15 shadow-2xl flex flex-col justify-between min-h-[220px]`}
      >
        <div className="z-10 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-white/80">Genre / Category</span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-1 drop-shadow-md">{genre.name}</h1>
          <p className="text-sm md:text-base text-white/90 mt-2 leading-relaxed">{genre.description}</p>
        </div>

        {songs.length > 0 && (
          <div className="z-10 mt-6 flex items-center gap-4">
            <button
              onClick={() => playTrack(filteredSongs[0] || songs[0], filteredSongs.length > 0 ? filteredSongs : songs)}
              className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              Play All
            </button>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90">
              {songs.length} Tracks
            </span>
          </div>
        )}

        {genre.coverImage && (
          <img
            src={genre.coverImage}
            alt={genre.name}
            className="absolute -right-10 -bottom-10 w-64 h-64 object-cover rounded-3xl rotate-12 opacity-30 pointer-events-none"
          />
        )}
      </div>

      {/* Tracks in this genre */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Tracks in {genre.name}</h3>
            <span className="text-xs font-medium text-neutral-400 ml-1">
              ({filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'})
            </span>
          </div>

          {/* Search & Sort inside Genre */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder={`Search in ${genre.name}...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(BATCH_SIZE);
                }}
                className="w-full pl-9 pr-3 py-1.5 bg-neutral-900 border border-white/10 rounded-full text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-900 border border-white/10 rounded-full px-3 py-1 text-xs text-neutral-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="popular" className="bg-neutral-900 text-white">Most Popular</option>
                <option value="newest" className="bg-neutral-900 text-white">Recently Released</option>
                <option value="title" className="bg-neutral-900 text-white">Title (A-Z)</option>
                <option value="artist" className="bg-neutral-900 text-white">Artist (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {filteredSongs.length === 0 ? (
          <p className="text-sm text-neutral-500 py-8 text-center bg-neutral-900/30 rounded-2xl border border-white/5">
            {searchQuery ? `No tracks found matching "${searchQuery}".` : 'No tracks listed in this genre yet.'}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {displayedSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  playlistQueue={filteredSongs}
                  onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                  onAddToCollection={(s) => setSelectedSongForCollection(s)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredSongs.length && (
              <div className="pt-6 pb-2 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-white/10 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <ChevronDown className="w-4 h-4 text-blue-400" />
                  Load More ({displayedSongs.length} of {filteredSongs.length})
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Albums in this genre */}
      {albums.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">{genre.name} Albums</h3>
            <span className="text-xs text-neutral-400">({albums.length})</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      )}

      {/* Artists in this genre */}
      {artists.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">{genre.name} Artists</h3>
            <span className="text-xs text-neutral-400">({artists.length})</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
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
