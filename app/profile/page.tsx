'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Playlist, UserCollection, Artist } from '@/lib/types';
import { PlaylistCard } from '@/components/ui/PlaylistCard';
import { ArtistCard } from '@/components/ui/ArtistCard';
import { User, Settings, ListMusic, FolderHeart, Heart, Users, Edit3, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
  const [stats, setStats] = useState({
    playlistsCount: 0,
    collectionsCount: 0,
    likedSongsCount: 0,
    followedArtistsCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
        if (data.playlists) setPlaylists(data.playlists);
        if (data.collections) setCollections(data.collections);
        if (data.followedArtists) setFollowedArtists(data.followedArtists);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (!user) {
    return (
      <div className="py-20 text-center space-y-3 max-w-md mx-auto">
        <User className="w-12 h-12 text-neutral-600 mx-auto" />
        <h3 className="text-xl font-bold text-white">Log in to view your profile</h3>
        <p className="text-xs text-neutral-400">Save playlists, follow artists, and personalize your experience.</p>
        <Link
          href="/auth/login"
          className="px-6 py-2.5 rounded-full bg-emerald-500 text-black font-semibold text-xs inline-block"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 bg-gradient-to-b from-neutral-800/40 to-transparent p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-white/10 shadow-2xl shrink-0"
        />

        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {user.role === 'admin' ? 'Administrator' : 'Music Listener'}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {user.name}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">@{user.username} • {user.email}</p>

          {user.bio && (
            <p className="text-xs md:text-sm text-neutral-300 mt-3 max-w-2xl leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Quick Stats Grid */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6 pt-4 border-t border-white/5 text-xs text-neutral-400">
            <div>
              <span className="font-bold text-white text-base block font-mono">{stats.playlistsCount}</span>
              <span>Playlists</span>
            </div>
            <div>
              <span className="font-bold text-white text-base block font-mono">{stats.collectionsCount}</span>
              <span>Collections</span>
            </div>
            <div>
              <span className="font-bold text-white text-base block font-mono">{stats.likedSongsCount}</span>
              <span>Liked Songs</span>
            </div>
            <div>
              <span className="font-bold text-white text-base block font-mono">{stats.followedArtistsCount}</span>
              <span>Following</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/settings"
            className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/10 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4" /> Edit Profile & Settings
          </Link>
          <button
            onClick={() => logout()}
            className="px-5 py-2.5 rounded-full border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-400 flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </div>

      {/* User's Created Playlists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Created Playlists</h3>
          </div>
          <Link href="/playlists" className="text-xs font-semibold text-neutral-400 hover:text-emerald-400">
            View All
          </Link>
        </div>

        {playlists.length === 0 ? (
          <p className="text-sm text-neutral-500 py-4">No playlists created yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </section>

      {/* User's Personal Collections */}
      {collections.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Personal Collections / Albums</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.id}`}
                className="p-3 rounded-2xl bg-[#141414] hover:bg-[#1C1C1C] border border-white/5 transition-all flex flex-col"
              >
                <div className="w-full aspect-square rounded-xl bg-neutral-900 mb-2 flex items-center justify-center overflow-hidden">
                  {col.coverImage ? (
                    <img src={col.coverImage} alt={col.title} className="w-full h-full object-cover" />
                  ) : (
                    <FolderHeart className="w-10 h-10 text-purple-400" />
                  )}
                </div>
                <h4 className="font-semibold text-sm text-white truncate">{col.title}</h4>
                <span className="text-xs text-neutral-400">{col.songIds?.length || 0} tracks</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Followed Artists */}
      {followedArtists.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Followed Artists</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {followedArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
