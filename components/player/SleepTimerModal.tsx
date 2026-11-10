'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Moon,
  Clock,
  Check,
  VolumeX,
  AlertCircle,
  Play
} from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { useToast } from '@/context/ToastContext';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSecondsLeft: number | null;
  onSetTimer: (minutes: number | 'end_of_track', enableFade: boolean) => void;
  onCancelTimer: () => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  activeSecondsLeft,
  onSetTimer,
  onCancelTimer,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number | 'end_of_track'>(30);
  const [enableFade, setEnableFade] = useState(true);
  const [mounted, setMounted] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const presets = [
    { label: '15 Minutes', value: 15 },
    { label: '30 Minutes', value: 30 },
    { label: '45 Minutes', value: 45 },
    { label: '60 Minutes', value: 60 },
    { label: 'End of Current Track', value: 'end_of_track' as const },
  ];

  const handleStart = (val: number | 'end_of_track') => {
    setSelectedPreset(val);
    onSetTimer(val, enableFade);
    toast.success(
      val === 'end_of_track'
        ? '🌙 Sleep timer set for end of current song'
        : `🌙 Sleep timer set for ${val} minutes`
    );
    onClose();
  };

  const formatRemaining = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-sm bg-[#181818] border border-white/10 rounded-3xl shadow-2xl p-6 text-white overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Sleep Timer</h3>
              <p className="text-xs text-neutral-400">Fall asleep peacefully to music</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Timer Status Banner */}
        {activeSecondsLeft !== null && (
          <div className="my-4 p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400 animate-spin [animation-duration:8s]" />
              <div>
                <span className="text-xs font-semibold text-white block">Timer Active</span>
                <span className="text-xs font-mono text-indigo-300">
                  {formatRemaining(activeSecondsLeft)} remaining
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onCancelTimer();
                toast.info('Sleep timer cancelled');
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-xs text-neutral-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Presets List */}
        <div className="py-3 space-y-2 relative z-10">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Set Timer Duration
          </span>
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => handleStart(p.value)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-white/20 text-sm font-medium transition-all group"
            >
              <span className="text-neutral-200 group-hover:text-white">{p.label}</span>
              <span className="text-xs text-neutral-400 group-hover:text-indigo-400 flex items-center gap-1 font-mono">
                Start <Play className="w-3 h-3 fill-current" />
              </span>
            </button>
          ))}
        </div>

        {/* Fade to Sleep Switch */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
          <div>
            <span className="text-xs font-semibold text-white block">Gentle Fade-Out</span>
            <span className="text-[10px] text-neutral-400 block">
              Gradually eases volume down before stopping
            </span>
          </div>
          <button
            onClick={() => setEnableFade(!enableFade)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              enableFade ? 'bg-indigo-600' : 'bg-neutral-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                enableFade ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
