'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArtistCard } from '@/components/ui/ArtistCard';
import { Artist } from '@/lib/types';
import { Users, Heart, Search, Sparkles, Compass } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type TabType = 'all' | 'library';

export default function ArtistsPage() {
  const { user } = useAuth();
  const [artists, setArtists] = useState<(Artist & { isFollowed?: boolean })[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchArtists = () => {
    setIsLoading(true);
    fetch('/api/artists')
      .then((res) => res.json())
      .then((data) => {
        setArtists(data.artists || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchArtists();
  }, [user]);

  const libraryArtists = artists.filter((a) => a.isFollowed);

  const displayedArtists = (activeTab === 'library' ? libraryArtists : artists).filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.genreName && a.genreName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Users className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Library & Artists</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Artists</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Browse world-class musicians and manage artists saved in your Library.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artists or genres..."
            className="w-full bg-[#161616] border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white text-black shadow-lg shadow-white/10 scale-100'
              : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Artists</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
            activeTab === 'all' ? 'bg-black/15 text-black font-extrabold' : 'bg-white/10 text-neutral-400'
          }`}>
            {artists.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'library'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-lg shadow-emerald-500/25 scale-100'
              : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${activeTab === 'library' ? 'fill-black' : 'text-neutral-400'}`} />
          <span>In Library</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
            activeTab === 'library' ? 'bg-black/20 text-black font-extrabold' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {libraryArtists.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-24 text-center text-sm text-neutral-400 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span>Loading artists...</span>
        </div>
      ) : displayedArtists.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#141414] border border-white/5 p-8 max-w-lg mx-auto flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            {activeTab === 'library' ? <Heart className="w-8 h-8" /> : <Search className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {activeTab === 'library' ? 'No Artists in Your Library' : 'No Artists Found'}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
              {activeTab === 'library'
                ? 'Click "♡ Add to Library" on any artist profile to keep quick access to their music here.'
                : 'Try adjusting your search query to find artists.'}
            </p>
          </div>
          {activeTab === 'library' && (
            <button
              onClick={() => setActiveTab('all')}
              className="mt-2 px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <Compass className="w-4 h-4" /> Browse All Artists
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {displayedArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
}
