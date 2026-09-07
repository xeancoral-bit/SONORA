'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Song } from '@/lib/types';
import { TrackRow } from '@/components/ui/TrackRow';
import { useAudio } from '@/context/AudioContext';
import { useToast } from '@/context/ToastContext';
import { AddToPlaylistModal } from '@/components/ui/AddToPlaylistModal';
import { AddToCollectionModal } from '@/components/ui/AddToCollectionModal';
import { Clock, Trash2, Play, Pause } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function HistoryPage() {
  const [history, setHistory] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearOpen, setIsClearOpen] = useState(false);

  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const [selectedSongForCollection, setSelectedSongForCollection] = useState<Song | null>(null);

  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudio();
  const toast = useToast();

  const isHistoryPlaying = isPlaying && history.some((s) => s.id === currentTrack?.id);

  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      try {
        const res = await fetch('/api/history');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) setHistory(data.history || []);
      } catch {
        // Safe fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClearHistory = async () => {
    try {
      const res = await fetch('/api/history', { method: 'DELETE' });
      if (res.ok) {
        setHistory([]);
        toast.success('Listening history cleared');
      }
    } catch {
      toast.error('Failed to clear history');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Clock className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Activity</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Listening History</h1>
          <p className="text-sm text-neutral-400 mt-1">Tracks and albums you recently played.</p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => playTrack(history[0], history)}
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
            >
              <Play className="w-4 h-4 fill-black ml-0.5" /> Play All
            </button>
            <button
              onClick={() => setIsClearOpen(true)}
              className="px-4 py-2.5 rounded-full border border-white/10 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear History
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-neutral-400">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-3">
          <Clock className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No listening history yet</h3>
          <p className="text-xs text-neutral-400">
            Start playing music and your recently played tracks will appear here automatically.
          </p>
          <Link
            href="/browse"
            className="px-5 py-2 rounded-full bg-emerald-500 text-black text-xs font-semibold inline-block"
          >
            Start Listening
          </Link>
        </div>
      ) : (
        <div className="space-y-1">
          {history.map((song, i) => (
            <TrackRow
              key={`history-${song.id}-${i}`}
              song={song}
              index={i}
              playlistQueue={history}
              showAlbum={true}
              onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
              onAddToCollection={(s) => setSelectedSongForCollection(s)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ConfirmDialog
        isOpen={isClearOpen}
        onClose={() => setIsClearOpen(false)}
        onConfirm={handleClearHistory}
        title="Clear Listening History?"
        message="Are you sure you want to clear your entire listening history? This cannot be undone."
        confirmText="Clear History"
      />
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
