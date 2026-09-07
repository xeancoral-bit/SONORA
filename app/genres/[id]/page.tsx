'use client';

import React, { useState, useEffect, use } from 'react';
import { Song, Album, Artist, Genre } from '@/lib/types';
import { SongCard } from '@/components/ui/SongCard';
import { AlbumCard } from '@/components/ui/AlbumCard';
import { ArtistCard } from '@/components/ui/ArtistCard';
import { AddToPlaylistModal } from '@/components/ui/AddToPlaylistModal';
import { AddToCollectionModal } from '@/components/ui/AddToCollectionModal';
import { Layers, Play, Disc, Users, Music } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

export default function GenreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const genreId = resolvedParams.id;

  const [genre, setGenre] = useState<Genre | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const [selectedSongForCollection, setSelectedSongForCollection] = useState<Song | null>(null);

  const { playTrack } = useAudio();

  useEffect(() => {
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

  if (isLoading) {
    return <div className="py-20 text-center text-sm text-neutral-400">Loading genre...</div>;
  }

  if (!genre) {
    return <div className="py-20 text-center text-base text-neutral-400">Genre not found.</div>;
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
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
              onClick={() => playTrack(songs[0], songs)}
              className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-black" />
              Play All
            </button>
            <span className="text-xs font-semibold text-white/80">{songs.length} Tracks</span>
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
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">Popular {genre.name} Tracks</h3>
        </div>

        {songs.length === 0 ? (
          <p className="text-sm text-neutral-500 py-6">No tracks listed in this genre yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                playlistQueue={songs}
                onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                onAddToCollection={(s) => setSelectedSongForCollection(s)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Albums in this genre */}
      {albums.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">{genre.name} Albums</h3>
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
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">{genre.name} Artists</h3>
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
