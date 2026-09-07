'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatNumber } from '@/lib/utils';
import { Flame, Users, Activity, Layers, Trophy } from 'lucide-react';

interface AnalyticsChartsProps {
  data: {
    mostPlayedSongs: { title: string; artist: string; plays: number; coverImage: string }[];
    userGrowth: { period: string; count: number }[];
    listeningActivity: { date: string; plays: number }[];
    popularGenres: { name: string; value: number; color: string }[];
    topArtists: { id?: string; name: string; plays: number; followers: number; avatar: string }[];
  };
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl text-xs text-white">
          <p className="font-bold text-neutral-300">{label}</p>
          <p className="font-mono text-emerald-400 font-bold mt-1">
            {formatNumber(payload[0].value)} {payload[0].name || 'plays'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Daily Listening Activity Area Chart */}
      <div className="lg:col-span-8 p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Listening Activity (Last 7 Days)</h3>
          </div>
          <span className="text-xs text-neutral-400">Real-time Stream Volume</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.listeningActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} />
              <YAxis stroke="#666" fontSize={11} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
              <Tooltip content={customTooltip} />
              <Area type="monotone" dataKey="plays" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPlays)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Popular Genres Pie / Donut Chart */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-base text-white">Genre Breakdown</h3>
        </div>

        <div className="h-52 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.popularGenres}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {data.popularGenres.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#10B981'} stroke="#141414" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap justify-center gap-2 text-[11px] text-neutral-400">
          {data.popularGenres.slice(0, 4).map((g, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
              <span>{g.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Most Played Music Bar Chart */}
      <div className="lg:col-span-6 p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-base text-white">Most Played Tracks</h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.mostPlayedSongs} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
              <XAxis type="number" stroke="#666" fontSize={10} tickFormatter={(val) => `${val / 1000}k`} />
              <YAxis dataKey="title" type="category" stroke="#999" fontSize={11} width={80} tickLine={false} />
              <Tooltip content={customTooltip} />
              <Bar dataKey="plays" fill="#F59E0B" radius={[0, 6, 6, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. User Growth Trend Area Chart */}
      <div className="lg:col-span-6 p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-base text-white">Account Registrations</h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" stroke="#666" fontSize={11} tickLine={false} />
              <YAxis stroke="#666" fontSize={11} tickLine={false} />
              <Tooltip content={customTooltip} />
              <Area type="monotone" dataKey="count" stroke="#06B6D4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Top Artists Leaderboard */}
      <div className="lg:col-span-12 p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="font-bold text-base text-white">Top Artists By Total Streaming Plays</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {data.topArtists.map((artist, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/70 border border-white/5 hover:border-white/10 transition-all hover:bg-neutral-900"
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                <span className="absolute top-0 left-0 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-bold text-amber-400 rounded-br-lg font-mono">
                  #{idx + 1}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-white truncate">{artist.name}</h4>
                <p className="text-[11px] text-emerald-400 font-semibold truncate leading-tight mt-0.5">
                  {formatNumber(artist.plays)} plays
                </p>
                <p className="text-[10px] text-neutral-400 truncate leading-tight mt-0.5">
                  {formatNumber(artist.followers)} followers
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
