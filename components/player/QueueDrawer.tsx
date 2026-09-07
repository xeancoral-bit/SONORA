'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { X, ListMusic, Trash2, Play, Music } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { EqualizerAnimation } from './EqualizerAnimation';

export const QueueDrawer: React.FC = () => {
  const {
    queue,
    currentTrack,
    isPlaying,
    isQueueOpen,
    setIsQueueOpen,
    playTrack,
    removeFromQueue,
    clearQueue
  } = useAudio();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#121212]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-emerald-400">
          <ListMusic className="w-5 h-5" />
          <h3 className="font-bold text-base text-white">Play Queue</h3>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-xs text-neutral-400 hover:text-rose-400 px-2 py-1 rounded hover:bg-rose-500/10 transition-colors"
            >
              Clear Queue
            </button>
          )}
          <button
            onClick={() => setIsQueueOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        {/* Now Playing */}
        {currentTrack && (
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-2">
              Now Playing
            </span>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <img
                  src={currentTrack.coverImage}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <EqualizerAnimation isPlaying={isPlaying} color="bg-emerald-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-white truncate">{currentTrack.title}</h4>
                <p className="text-xs text-neutral-400 truncate">{currentTrack.artistName}</p>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {formatTime(currentTrack.duration)}
              </span>
            </div>
          </div>
        )}

        {/* Next in Queue */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Next Up ({queue.length})
            </span>
          </div>

          {queue.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500 flex flex-col items-center gap-2">
              <Music className="w-8 h-8 opacity-40" />
              Queue is empty. Add songs to keep the music going!
            </div>
          ) : (
            <div className="space-y-1.5">
              {queue.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors"
                >
                  <div
                    onClick={() => playTrack(track, queue.slice(idx + 1))}
                    className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-800 cursor-pointer"
                  >
                    <img
                      src={track.coverImage}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                    </div>
                  </div>

                  <div
                    onClick={() => playTrack(track, queue.slice(idx + 1))}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <h5 className="font-semibold text-xs text-white truncate group-hover:text-emerald-400 transition-colors">
                      {track.title}
                    </h5>
                    <p className="text-[11px] text-neutral-400 truncate">{track.artistName}</p>
                  </div>

                  <span className="text-xs text-neutral-500 font-mono">
                    {formatTime(track.duration)}
                  </span>

                  <button
                    onClick={() => removeFromQueue(idx)}
                    className="p-1.5 rounded text-neutral-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
