'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Flame,
  Trophy,
  Award,
  Sparkles,
  Calendar,
  Disc,
  Music2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getListeningStats,
  ALL_BADGES,
  VinylBadge,
  UserListeningStats
} from '@/lib/streakService';

interface ListeningStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ListeningStreakModal: React.FC<ListeningStreakModalProps> = ({
  isOpen,
  onClose
}) => {
  const [stats, setStats] = useState<UserListeningStats | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStats(getListeningStats());
    }
  }, [isOpen]);

  if (!isOpen || !stats || !mounted) return null;

  const handleCelebrate = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const getTierColor = (tier: VinylBadge['tier']) => {
    switch (tier) {
      case 'bronze':
        return 'from-amber-700/30 to-amber-900/30 border-amber-600/40 text-amber-400';
      case 'silver':
        return 'from-slate-400/30 to-slate-600/30 border-slate-300/40 text-slate-200';
      case 'gold':
        return 'from-yellow-500/30 to-amber-500/30 border-yellow-400/50 text-yellow-300';
      case 'diamond':
        return 'from-cyan-400/30 to-blue-600/30 border-cyan-300/50 text-cyan-200';
      default:
        return 'from-neutral-800 to-neutral-900 border-white/10 text-white';
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-xl bg-[#161616] border border-white/10 rounded-3xl shadow-2xl p-6 text-white overflow-hidden max-h-[88vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white flex items-center gap-2">
                Sonora Streak & Vinyl Club
                <button
                  onClick={handleCelebrate}
                  className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                  title="Celebrate!"
                >
                  🎉 Cheer!
                </button>
              </h3>
              <p className="text-xs text-neutral-400">
                Your daily listening habits and collector rewards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 py-4 space-y-5 relative z-10">
          {/* Hero Streak Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/20 relative overflow-hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Current Daily Streak
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {stats.currentStreak}
                  </span>
                  <span className="text-sm font-semibold text-neutral-300">
                    {stats.currentStreak === 1 ? 'Day Active' : 'Days Active'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Listen to at least 1 track every day to grow your daily flame and unlock rare badges!
                </p>
              </div>

              {/* Record Icon */}
              <div className="relative w-16 h-16 rounded-full bg-neutral-900 border-2 border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                <Disc className="w-9 h-9 text-amber-400 animate-[spin_8s_linear_infinite]" />
                <div className="absolute w-3 h-3 rounded-full bg-black border border-amber-400/60" />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10 text-center">
              <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-neutral-400 uppercase block">Today</span>
                <span className="text-sm font-bold text-white font-mono">
                  {stats.todaySongsCount} songs
                </span>
              </div>
              <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-neutral-400 uppercase block">Best Streak</span>
                <span className="text-sm font-bold text-amber-300 font-mono">
                  {stats.longestStreak} days
                </span>
              </div>
              <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-neutral-400 uppercase block">All-Time</span>
                <span className="text-sm font-bold text-blue-400 font-mono">
                  {stats.totalSongsCount} tracks
                </span>
              </div>
            </div>
          </div>

          {/* Badges Showcase */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Vinyl Badges & Achievements
              </h4>
              <span className="text-xs text-neutral-400">
                {stats.unlockedBadgeIds.length} / {ALL_BADGES.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ALL_BADGES.map((badge) => {
                const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);
                const tierStyle = getTierColor(badge.tier);

                return (
                  <div
                    key={badge.id}
                    onClick={() => {
                      if (isUnlocked) handleCelebrate();
                    }}
                    className={`p-3 rounded-2xl border transition-all select-none ${
                      isUnlocked
                        ? `bg-gradient-to-br ${tierStyle} cursor-pointer hover:scale-[1.02]`
                        : 'bg-white/[0.02] border-white/5 opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl shrink-0 p-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                        {isUnlocked ? badge.icon : '🔒'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs font-bold text-white truncate">
                            {badge.title}
                          </h5>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold tracking-wider bg-black/40 border border-white/10">
                            {badge.tier}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-300 mt-0.5 leading-snug">
                          {badge.description}
                        </p>
                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-1">
                            <CheckCircle2 className="w-3 h-3" /> Unlocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 mt-1">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 relative z-10 shrink-0">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Streaks update in real time as you listen.
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
