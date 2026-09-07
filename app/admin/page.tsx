'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminStatsCard } from '@/components/admin/AdminStatsCard';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import {
  Music,
  Disc,
  Users,
  UserCheck,
  Headphones,
  Heart,
  ListMusic,
  PlusCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.summary) {
          setSummary(data.summary);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="py-20 text-center text-sm text-neutral-400">Loading admin analytics...</div>;
  }

  if (!summary) {
    return <div className="py-20 text-center text-sm text-neutral-400">Unable to load telemetry.</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Platform Overview</h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Real-time analytics, user growth, streaming metrics, and catalog health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/music/add"
            className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            + Upload Audio Track
          </Link>
        </div>
      </div>

      {/* 8 Stats Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          title="Total Songs"
          value={summary.totalSongs}
          icon={Music}
          color="text-emerald-400"
          subtitle="+4 this week"
        />
        <AdminStatsCard
          title="Total Albums"
          value={summary.totalAlbums}
          icon={Disc}
          color="text-cyan-400"
          subtitle="5 verified albums"
        />
        <AdminStatsCard
          title="Artists"
          value={summary.totalArtists}
          icon={Users}
          color="text-purple-400"
          subtitle="6 verified artists"
        />
        <AdminStatsCard
          title="Registered Users"
          value={summary.totalUsers}
          icon={UserCheck}
          color="text-amber-400"
          subtitle="100% active"
        />
        <AdminStatsCard
          title="Total Streaming Plays"
          value={summary.totalPlays}
          icon={Headphones}
          color="text-emerald-400"
          subtitle="+14% this month"
        />
        <AdminStatsCard
          title="Total Song Likes"
          value={summary.totalLikes}
          icon={Heart}
          color="text-rose-400"
          subtitle="Auto-synced"
        />
        <AdminStatsCard
          title="Public Playlists"
          value={summary.totalPlaylists}
          icon={ListMusic}
          color="text-teal-400"
          subtitle="Community created"
        />
        <AdminStatsCard
          title="Active Sessions"
          value={summary.activeUsers}
          icon={Sparkles}
          color="text-yellow-400"
          subtitle="Online right now"
        />
      </div>

      {/* Analytics Charts Section */}
      <AnalyticsCharts data={summary} />
    </div>
  );
}
