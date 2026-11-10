'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Volume2,
  CloudRain,
  Flame,
  Waves,
  Coffee,
  Disc,
  Sparkles,
  Power
} from 'lucide-react';
import { ambientEngine, SoundscapeState } from '@/lib/ambientAudio';
import { recordSoundscapeUsed } from '@/lib/streakService';
import { useToast } from '@/context/ToastContext';

interface AmbientSoundscapeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmbientSoundscapeModal: React.FC<AmbientSoundscapeModalProps> = ({
  isOpen,
  onClose
}) => {
  const [state, setState] = useState<SoundscapeState>(ambientEngine.getState());
  const [mounted, setMounted] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const loaded = ambientEngine.loadSavedState();
      setState(loaded);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleToggleMaster = () => {
    const nextVal = !state.enabled;
    ambientEngine.updateLayer('enabled', nextVal);
    setState((prev) => ({ ...prev, enabled: nextVal }));

    if (nextVal) {
      const newBadge = recordSoundscapeUsed();
      if (newBadge) {
        toast.success(`🎉 Unlocked Badge: ${newBadge.title} (${newBadge.icon})`);
      }
    }
  };

  const handleSliderChange = (layer: keyof SoundscapeState, val: number) => {
    ambientEngine.updateLayer(layer, val);
    setState((prev) => ({ ...prev, [layer]: val }));

    if (!state.enabled && val > 0) {
      ambientEngine.updateLayer('enabled', true);
      setState((prev) => ({ ...prev, enabled: true, [layer]: val }));
    }
  };

  const applyPreset = (presetName: string, config: Partial<SoundscapeState>) => {
    ambientEngine.updateLayer('enabled', true);
    (Object.keys(config) as (keyof SoundscapeState)[]).forEach((k) => {
      if (k !== 'enabled') {
        ambientEngine.updateLayer(k, config[k] as number);
      }
    });
    setState((prev) => ({ ...prev, enabled: true, ...config }));
    toast.info(`Ambient preset: ${presetName}`);

    const newBadge = recordSoundscapeUsed();
    if (newBadge) {
      toast.success(`🎉 Unlocked Badge: ${newBadge.title} (${newBadge.icon})`);
    }
  };

  const layers = [
    {
      key: 'rain' as const,
      name: 'Gentle Rain',
      description: 'Soft tropical downpour for deep relaxation',
      icon: CloudRain,
      color: 'text-blue-400',
      activeColor: 'from-blue-500 to-indigo-600',
    },
    {
      key: 'campfire' as const,
      name: 'Campfire Crackle',
      description: 'Warm glowing hearth with natural wooden pops',
      icon: Flame,
      color: 'text-amber-400',
      activeColor: 'from-amber-500 to-orange-600',
    },
    {
      key: 'waves' as const,
      name: 'Ocean Waves',
      description: 'Gentle rhythmic coastline tide',
      icon: Waves,
      color: 'text-teal-400',
      activeColor: 'from-teal-500 to-cyan-600',
    },
    {
      key: 'cafe' as const,
      name: 'Cozy Cafe',
      description: 'Distant coffee shop ambiance and murmurs',
      icon: Coffee,
      color: 'text-emerald-400',
      activeColor: 'from-emerald-500 to-green-600',
    },
    {
      key: 'vinyl' as const,
      name: 'Lo-Fi Vinyl Hiss',
      description: 'Vintage record player needle crackle & warmth',
      icon: Disc,
      color: 'text-purple-400',
      activeColor: 'from-purple-500 to-pink-600',
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-[#181818] border border-white/10 rounded-3xl shadow-2xl p-6 text-white overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Ambient Soundscapes</h3>
              <p className="text-xs text-neutral-400">
                Blend live nature and background textures with your music
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMaster}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                state.enabled
                  ? 'bg-blue-500 text-black shadow-lg shadow-blue-500/30'
                  : 'bg-white/10 text-neutral-400 hover:text-white'
              }`}
              title="Master Ambient Toggle"
            >
              <Power className="w-3.5 h-3.5" />
              {state.enabled ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="py-3 border-b border-white/5 relative z-10">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
            Quick Ambiance Presets
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset('Rainy Study', { rain: 0.7, vinyl: 0.3, campfire: 0, waves: 0, cafe: 0 })}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-neutral-300 hover:text-white border border-white/5 transition-all"
            >
              🌧️ Rainy Study
            </button>
            <button
              onClick={() => applyPreset('Cozy Campfire', { campfire: 0.65, vinyl: 0.35, rain: 0, waves: 0, cafe: 0 })}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-neutral-300 hover:text-white border border-white/5 transition-all"
            >
              🔥 Cozy Hearth
            </button>
            <button
              onClick={() => applyPreset('Midnight Cafe', { cafe: 0.55, rain: 0.25, vinyl: 0.3, campfire: 0, waves: 0 })}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-neutral-300 hover:text-white border border-white/5 transition-all"
            >
              ☕ Midnight Cafe
            </button>
            <button
              onClick={() => applyPreset('Ocean Waves', { waves: 0.75, rain: 0, campfire: 0, cafe: 0, vinyl: 0.2 })}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-neutral-300 hover:text-white border border-white/5 transition-all"
            >
              🌊 Coastal Chill
            </button>
          </div>
        </div>

        {/* Sliders List */}
        <div className="py-4 space-y-4 max-h-[50vh] overflow-y-auto pr-1 relative z-10">
          {layers.map((layer) => {
            const Icon = layer.icon;
            const currentVal = (state as any)[layer.key] as number;
            const percentage = Math.round(currentVal * 100);

            return (
              <div
                key={layer.key}
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg bg-white/5 ${layer.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{layer.name}</h4>
                      <p className="text-[11px] text-neutral-400">{layer.description}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${currentVal > 0 && state.enabled ? 'text-blue-400' : 'text-neutral-500'}`}>
                    {percentage}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={currentVal}
                    onChange={(e) => handleSliderChange(layer.key, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 relative z-10">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
            <span>Mixes in real-time alongside music</span>
          </div>
          <button
            onClick={() => {
              applyPreset('Mute All', { rain: 0, campfire: 0, waves: 0, cafe: 0, vinyl: 0 });
            }}
            className="text-[11px] text-neutral-400 hover:text-rose-400 transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
