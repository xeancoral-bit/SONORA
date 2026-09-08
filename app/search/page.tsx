'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, Clock, Music, Disc, Users, ListMusic, Layers, Play } from 'lucide-react';
import { Song, Artist, Album, Playlist, Genre } from '@/lib/types';
import { SongCard } from '@/components/ui/SongCard';
import { AlbumCard } from '@/components/ui/AlbumCard';
import { ArtistCard } from '@/components/ui/ArtistCard';
import { GenreCard } from '@/components/ui/GenreCard';
import { TrackRow } from '@/components/ui/TrackRow';
import { AddToPlaylistModal } from '@/components/ui/AddToPlaylistModal';
import { AddToCollectionModal } from '@/components/ui/AddToCollectionModal';
import { useAudio } from '@/context/AudioContext';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<'all' | 'songs' | 'artists' | 'albums' | 'playlists' | 'genres'>('all');
  const [results, setResults] = useState<{
    songs: Song[];
    artists: Artist[];
    albums: Album[];
    playlists: Playlist[];
    genres: Genre[];
  }>({
    songs: [],
    artists: [],
    albums: [],
    playlists: [],
    genres: []
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const [selectedSongForCollection, setSelectedSongForCollection] = useState<Song | null>(null);

  const { playTrack } = useAudio();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sonora_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        setRecentSearches(['Night Drive', 'Aurora Wave', 'Synthwave', 'Lo-Fi', 'Pop']);
      }
    } catch {
      setRecentSearches(['Night Drive', 'Aurora Wave', 'Synthwave', 'Lo-Fi', 'Pop']);
    }
  }, []);

  // Update query when URL param changes
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Debounced search fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults({ songs: [], artists: [], albums: [], playlists: [], genres: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const saveToRecent = (qText: string) => {
    const updated = [qText, ...recentSearches.filter((s) => s.toLowerCase() !== qText.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem('sonora_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const handleSelectRecent = (term: string) => {
    setQuery(term);
    saveToRecent(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('sonora_recent_searches');
    } catch {}
  };

  const totalMatches =
    results.songs.length +
    results.artists.length +
    results.albums.length +
    results.playlists.length +
    results.genres.length;

  const topSong = results.songs[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="What do you want to listen to? (e.g. Night, Pop, Kai)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              saveToRecent(query.trim());
            }
          }}
          autoFocus
          className="w-full bg-[#181818] border border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-base text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50 shadow-xl"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      {query && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
          {[
            { id: 'all', label: 'All' },
            { id: 'songs', label: `Songs (${results.songs.length})` },
            { id: 'artists', label: `Artists (${results.artists.length})` },
            { id: 'albums', label: `Albums (${results.albums.length})` },
            { id: 'playlists', label: `Playlists (${results.playlists.length})` },
            { id: 'genres', label: `Genres (${results.genres.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-white text-black shadow-md'
                  : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* When no query is entered: show Recent Searches */}
      {!query && (
        <div className="space-y-6">
          {recentSearches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Clock className="w-4 h-4" />
                  <h3 className="font-bold text-sm text-white">Recent Searches</h3>
                </div>
                <button
                  onClick={handleClearRecent}
                  className="text-xs text-neutral-500 hover:text-rose-400 transition-colors"
                >
                  Clear history
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectRecent(term)}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-emerald-500/40 text-xs text-neutral-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Browse Categories Quick Grid */}
          <div className="space-y-3 pt-4">
            <h3 className="font-bold text-lg text-white">Browse All Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <GenreCard genre={{ id: 'genre-pop', name: 'Pop', slug: 'pop', color: 'from-pink-500 to-rose-700', accentColor: '#EC4899', coverImage: '/genres/genre-pop.jpg', description: 'Catchy hooks, upbeat rhythms, and mainstream chart-toppers.' }} />
              <GenreCard genre={{ id: 'genre-electronic', name: 'Electronic', slug: 'electronic', color: 'from-cyan-500 to-blue-700', accentColor: '#06B6D4', coverImage: '/genres/genre-electronic.jpg', description: 'Synthesizers, driving 4/4 beats, synthwave, and club anthems.' }} />
              <GenreCard genre={{ id: 'genre-chill', name: 'Lo-Fi & Chill', slug: 'chill', color: 'from-emerald-500 to-teal-800', accentColor: '#10B981', coverImage: '/genres/genre-lofi.jpg', description: 'Relaxing study beats, ambient textures, and peaceful vibes.' }} />
              <GenreCard genre={{ id: 'genre-rnb', name: 'R&B & Soul', slug: 'rnb', color: 'from-purple-500 to-indigo-800', accentColor: '#8B5CF6', coverImage: '/genres/genre-rnb.jpg', description: 'Smooth vocals, deep basslines, and emotive melodies.' }} />
            </div>
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {query && (
        <div className="space-y-8">
          {isLoading ? (
            <div className="py-16 text-center text-sm text-neutral-400">Searching SONORA catalog...</div>
          ) : totalMatches === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto space-y-2">
              <Music className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No results found for &quot;{query}&quot;</h3>
              <p className="text-xs text-neutral-400">
                Please check the spelling, or try searching for another song, artist, album, or genre.
              </p>
            </div>
          ) : (
            <>
              {/* Top Result + Songs Table (when filter is 'all') */}
              {(activeFilter === 'all' || activeFilter === 'songs') && results.songs.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Top Result Card */}
                  {topSong && activeFilter === 'all' && (
                    <div className="lg:col-span-4 space-y-2">
                      <h3 className="text-base font-bold text-white">Top Result</h3>
                      <div
                        onClick={() => playTrack(topSong, results.songs)}
                        className="group relative p-5 rounded-2xl bg-[#181818] hover:bg-[#202020] border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer shadow-xl flex flex-col justify-between h-[220px]"
                      >
                        <img
                          src={topSong.coverImage}
                          alt={topSong.title}
                          className="w-20 h-20 rounded-xl object-cover shadow-md"
                        />
                        <div>
                          <h4 className="font-extrabold text-xl text-white group-hover:text-emerald-400 transition-colors truncate">
                            {topSong.title}
                          </h4>
                          <span className="text-xs text-neutral-400 mt-1 block">
                            Song • {topSong.artistName}
                          </span>
                        </div>

                        <button
                          className="absolute right-5 bottom-5 w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all"
                          title="Play song"
                        >
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Songs Track Rows */}
                  <div className={`${activeFilter === 'all' && topSong ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-2`}>
                    <h3 className="text-base font-bold text-white">Songs</h3>
                    <div className="space-y-1">
                      {results.songs.slice(0, activeFilter === 'all' ? 5 : 20).map((song, i) => (
                        <TrackRow
                          key={song.id}
                          song={song}
                          index={i}
                          playlistQueue={results.songs}
                          onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                          onAddToCollection={(s) => setSelectedSongForCollection(s)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Artists Results */}
              {(activeFilter === 'all' || activeFilter === 'artists') && results.artists.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white">Artists</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {results.artists.map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                </div>
              )}

              {/* Albums Results */}
              {(activeFilter === 'all' || activeFilter === 'albums') && results.albums.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white">Albums</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {results.albums.map((album) => (
                      <AlbumCard key={album.id} album={album} />
                    ))}
                  </div>
                </div>
              )}

              {/* Playlists Results */}
              {(activeFilter === 'all' || activeFilter === 'playlists') && results.playlists.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white">Playlists</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {results.playlists.map((playlist) => (
                      <div
                        key={playlist.id}
                        onClick={() => router.push(`/playlists/${playlist.id}`)}
                        className="p-3 rounded-2xl bg-[#141414] hover:bg-[#1C1C1C] border border-white/5 cursor-pointer transition-all"
                      >
                        <div className="w-full aspect-square rounded-xl bg-neutral-800 flex items-center justify-center mb-2 overflow-hidden">
                          {playlist.coverImage ? (
                            <img src={playlist.coverImage} alt={playlist.title} className="w-full h-full object-cover" />
                          ) : (
                            <ListMusic className="w-8 h-8 text-neutral-500" />
                          )}
                        </div>
                        <h4 className="font-semibold text-sm text-white truncate">{playlist.title}</h4>
                        <span className="text-xs text-neutral-400">By {playlist.userName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Genres Results */}
              {(activeFilter === 'all' || activeFilter === 'genres') && results.genres.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white">Genres</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {results.genres.map((genre) => (
                      <GenreCard key={genre.id} genre={genre} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-neutral-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
