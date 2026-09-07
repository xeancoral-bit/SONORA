'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAudio } from '@/context/AudioContext';
import { Song, Album, Artist, Genre } from '@/lib/types';
import { getGreeting } from '@/lib/utils';
import { SongCard } from '@/components/ui/SongCard';
import { AlbumCard } from '@/components/ui/AlbumCard';
import { ArtistCard } from '@/components/ui/ArtistCard';
import { GenreCard } from '@/components/ui/GenreCard';
import { AddToPlaylistModal } from '@/components/ui/AddToPlaylistModal';
import { AddToCollectionModal } from '@/components/ui/AddToCollectionModal';
import {
  Sparkles,
  TrendingUp,
  Flame,
  Clock,
  Disc,
  Users,
  Compass,
  ChevronRight,
  Play,
  Heart
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { playTrack } = useAudio();
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [history, setHistory] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const [selectedSongForCollection, setSelectedSongForCollection] = useState<Song | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);

        const safeFetchJson = async (url: string) => {
          try {
            const res = await fetch(url);
            if (!res.ok) return null;
            return await res.json();
          } catch {
            return null;
          }
        };

        const [songsRes, albumsRes, artistsRes, genresRes, historyRes] = await Promise.all([
          safeFetchJson('/api/songs'),
          safeFetchJson('/api/albums'),
          safeFetchJson('/api/artists'),
          safeFetchJson('/api/genres'),
          safeFetchJson('/api/history')
        ]);

        if (!isMounted) return;

        if (songsRes?.songs) setSongs(songsRes.songs);
        if (albumsRes?.albums) setAlbums(albumsRes.albums);
        if (artistsRes?.artists) setArtists(artistsRes.artists);
        if (genresRes?.genres) setGenres(genresRes.genres);
        if (historyRes?.history) setHistory(historyRes.history);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const greeting = getGreeting();
  const userName = user ? user.name.split(' ')[0] : 'Music Lover';

  // Slices for sections
  const trendingSongs = [...songs].sort((a, b) => (b.playCount || 0) - (a.playCount || 0)).slice(0, 6);
  const newReleases = [...songs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  const featuredAlbums = albums.slice(0, 5);
  const popularArtists = artists.slice(0, 6);
  const popularGenres = genres.slice(0, 6);
  const quickMix = songs.slice(0, 6);

  // Deduplicate listening history so the same song doesn't duplicate in the recent list
  const uniqueHistory: Song[] = [];
  const seenHistoryIds = new Set<string>();
  for (const s of history) {
    if (!seenHistoryIds.has(s.id)) {
      seenHistoryIds.add(s.id);
      uniqueHistory.push(s);
    }
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Dynamic Header Greeting & Quick Mix Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {greeting}, <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{userName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Dive into your personalized daily mix and trending releases.
            </p>
          </div>
        </div>

        {/* Quick Launch Cards (6 Hero Tiles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {quickMix.map((song) => (
            <div
              key={song.id}
              onClick={() => playTrack(song, songs)}
              className="group flex items-center justify-between p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer shadow-md overflow-hidden"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={song.coverImage}
                  alt={song.title}
                  className="w-14 h-14 rounded-lg object-cover shadow-sm shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-white truncate group-hover:text-emerald-400 transition-colors">
                    {song.title}
                  </h4>
                  <p className="text-xs text-neutral-400 truncate">{song.artistName}</p>
                </div>
              </div>

              <button
                className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/20 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 shrink-0 mr-2"
                title="Play track"
              >
                <Play className="w-4 h-4 fill-black ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Continue Listening / Recently Played */}
      {uniqueHistory.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Continue Listening</h2>
            </div>
            <Link
              href="/history"
              className="text-xs font-semibold text-neutral-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              View History <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uniqueHistory.slice(0, 6).map((song, idx) => (
              <SongCard
                key={`history-${song.id}-${idx}`}
                song={song}
                playlistQueue={uniqueHistory}
                onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                onAddToCollection={(s) => setSelectedSongForCollection(s)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trending Now */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Trending Now</h2>
          </div>
          <Link
            href="/browse"
            className="text-xs font-semibold text-neutral-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            Explore More <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trendingSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              playlistQueue={trendingSongs}
              onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
              onAddToCollection={(s) => setSelectedSongForCollection(s)}
            />
          ))}
        </div>
      </section>

      {/* Featured Albums */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Featured Albums</h2>
          </div>
          <Link
            href="/albums"
            className="text-xs font-semibold text-neutral-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            All Albums <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {featuredAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      {/* Popular Artists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Popular Artists</h2>
          </div>
          <Link
            href="/artists"
            className="text-xs font-semibold text-neutral-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popularArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">New Releases</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {newReleases.map((song) => (
            <SongCard
              key={`new-${song.id}`}
              song={song}
              playlistQueue={newReleases}
              onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
              onAddToCollection={(s) => setSelectedSongForCollection(s)}
            />
          ))}
        </div>
      </section>

      {/* Your Favorite Genres */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-pink-400" />
            <h2 className="text-xl font-bold text-white">Explore Genres</h2>
          </div>
          <Link
            href="/browse"
            className="text-xs font-semibold text-neutral-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            Browse All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularGenres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      </section>

      {/* Action Modals */}
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
