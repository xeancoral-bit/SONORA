'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Playlist } from '@/lib/types';
import { PlaylistCard } from '@/components/ui/PlaylistCard';
import { User as UserIcon, Shield, Sparkles, Calendar, ListMusic, Music, ArrowLeft, Share2, Check } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface PublicUserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  role: string;
  favoriteGenres?: string[];
  createdAt: string;
}

export default function UserPublicProfilePage() {
  const params = useParams();
  const rawUsername = params?.username as string;
  const username = rawUsername ? decodeURIComponent(rawUsername).replace(/^@/, '') : '';
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username) return;

    setIsLoading(true);
    setError(null);

    fetch(`/api/users/${encodeURIComponent(username)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'User not found');
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data.user);
        setPlaylists(data.playlists || []);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load profile');
      })
      .finally(() => setIsLoading(false));
  }, [username]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isOwnProfile = currentUser && profile && currentUser.id === profile.id;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-xs text-neutral-400 font-mono tracking-widest uppercase">Loading member credentials...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center mx-auto text-neutral-500">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Member Profile Not Found</h2>
        <p className="text-xs text-neutral-400">
          The user @{username} does not exist or may have deactivated their account.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return Home
        </Link>
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const memberId = profile.id.startsWith('user-') ? profile.id.replace('user-', 'SNR-') : `SNR-${profile.id}`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Back link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      {/* Official Member Card Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900/90 via-[#121212] to-[#0A0A0A] border border-white/10 p-6 md:p-10 shadow-2xl shadow-black/80">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <div className="relative shrink-0">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-2xl bg-neutral-900"
            />
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Verified
            </div>
          </div>

          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {profile.role === 'admin' ? 'Official Administrator' : 'Verified Sonora Listener'}
              </span>
              <span className="text-[11px] font-mono text-neutral-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                ID: #{memberId}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              {profile.name}
            </h1>
            <p className="text-sm text-neutral-400 mt-0.5">@{profile.username}</p>

            {profile.bio && (
              <p className="text-xs md:text-sm text-neutral-300 mt-3 max-w-xl leading-relaxed">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-5 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>Member since {joinDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ListMusic className="w-3.5 h-3.5 text-neutral-500" />
                <span>{playlists.length} Public {playlists.length === 1 ? 'Playlist' : 'Playlists'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
            {isOwnProfile ? (
              <Link
                href="/profile"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Manage My Space
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Share Profile'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Public Playlists */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">Public Playlists</h3>
        </div>

        {playlists.length === 0 ? (
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-white/5 text-center text-xs text-neutral-400">
            No public playlists published yet by @{profile.username}.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
