'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SonoraLogo } from '@/components/layout/SonoraLogo';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  User,
  Sliders,
  Compass,
  Music,
  Share2,
  Headphones,
  Check
} from 'lucide-react';

const GENRE_OPTIONS = [
  { id: 'genre-pop', name: 'Pop', desc: 'Chart-topping melodies' },
  { id: 'genre-rnb', name: 'R&B / Soul', desc: 'Smooth vocals & rhythms' },
  { id: 'genre-hiphop', name: 'Hip-Hop', desc: 'High energy beats' },
  { id: 'genre-electronic', name: 'Electronic', desc: 'Synths & dance vibes' },
  { id: 'genre-rock', name: 'Rock / Alt', desc: 'Guitars & raw power' },
  { id: 'genre-indie', name: 'Indie', desc: 'Atmospheric & acoustic' },
  { id: 'genre-jazz', name: 'Jazz & Lo-Fi', desc: 'Chill & sophisticated' },
  { id: 'genre-classical', name: 'Classical & Film', desc: 'Orchestral masterpieces' }
];

export default function WelcomePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const toast = useToast();

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti once
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // Safe catch
    }

    if (user?.favoriteGenres && user.favoriteGenres.length > 0) {
      setSelectedGenres(user.favoriteGenres);
    }
  }, [user]);

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favoriteGenres: selectedGenres })
      });
      if (res.ok) {
        setSavedSuccess(true);
        toast.success('Sound profile updated!', 'Your Sonora music feed is now customized.');
        await refreshUser();
        setTimeout(() => setSavedSuccess(false), 2500);
      } else {
        toast.error('Failed to update preferences');
      }
    } catch {
      toast.error('Network error updating preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <SonoraLogo size="lg" />
        <h2 className="text-xl font-bold text-white mt-4">Account Initialized</h2>
        <p className="text-xs text-neutral-400 max-w-sm">
          Please log in with your new credentials to access your personalized Sonora workspace.
        </p>
        <Link
          href="/auth/login"
          className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const memberId = user.id.startsWith('user-') ? user.id.replace('user-', 'SNR-') : `SNR-${user.id}`;
  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-10">
      {/* Official Induction Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Official Member Induction
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Welcome to SONORA, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-xs md:text-sm text-neutral-400 max-w-xl mx-auto">
          Your official member pass has been issued and your dedicated personal space is ready.
        </p>
      </div>

      {/* Prestige Member Credential Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-[#141414] to-[#0A0A0A] border border-white/15 p-6 md:p-8 shadow-2xl shadow-black">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl bg-neutral-950"
            />
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h3 className="text-xl font-black text-white">{user.name}</h3>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">@{user.username} • {user.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
                  ID: #{memberId}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified Listener Pass
                </span>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right text-xs text-neutral-400">
            <span className="text-[11px] block uppercase tracking-widest text-neutral-500 font-bold">Issued</span>
            <span className="font-semibold text-neutral-200">{joinDate}</span>
            <span className="text-[10px] block text-emerald-400 mt-1 font-mono">STATUS: ACTIVE</span>
          </div>
        </div>

        {/* Quick Identity Highlights */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-xs">
          <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-1">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block">Personal Space</span>
            <p className="text-white font-medium">Ready for your playlists & collections</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-1">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block">Audio Engine</span>
            <p className="text-white font-medium">High-Fidelity Stereo & Synced Lyrics</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-1">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block">Public Handle</span>
            <p className="text-emerald-400 font-mono">sonora.io/users/@{user.username}</p>
          </div>
        </div>
      </div>

      {/* Sound Profile Personalization */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Headphones className="w-5 h-5 text-emerald-400" />
              Tune Your Sound Identity
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Select your favorite genres to calibrate your personal recommendations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSavePreferences}
            disabled={isSaving}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
            {isSaving ? 'Saving...' : savedSuccess ? 'Preferences Saved!' : 'Save Sound Preferences'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {GENRE_OPTIONS.map((g) => {
            const isSelected = selectedGenres.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenre(g.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-neutral-900/70 hover:bg-neutral-800 border-white/5 text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">{g.name}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <span className="text-[10px] text-neutral-400 block line-clamp-1">{g.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Direct Pathways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/"
          className="group p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 hover:from-emerald-500/25 hover:to-emerald-500/10 border border-emerald-500/30 transition-all flex flex-col justify-between"
        >
          <div className="space-y-1 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
              Explore Dashboard
            </h4>
            <p className="text-[11px] text-neutral-400">
              Discover featured albums, top tracks, and trending sounds.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1">
            Start Listening <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href="/profile"
          className="group p-5 rounded-2xl bg-neutral-900 hover:bg-neutral-800/80 border border-white/10 transition-all flex flex-col justify-between"
        >
          <div className="space-y-1 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2">
              <User className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
              My Personal Space
            </h4>
            <p className="text-[11px] text-neutral-400">
              Organize playlists, view saved albums, and track liked songs.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-400 inline-flex items-center gap-1">
            Open Profile <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href={`/users/${user.username}`}
          className="group p-5 rounded-2xl bg-neutral-900 hover:bg-neutral-800/80 border border-white/10 transition-all flex flex-col justify-between"
        >
          <div className="space-y-1 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2">
              <Share2 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
              Public Member Card
            </h4>
            <p className="text-[11px] text-neutral-400">
              View how other music lovers see your profile and shared music.
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-400 inline-flex items-center gap-1">
            View Public Card <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </div>
  );
}
