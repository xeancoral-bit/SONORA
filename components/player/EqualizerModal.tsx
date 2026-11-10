'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sliders, RotateCcw, Compass } from 'lucide-react';

export interface SoundPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  bass: number; // dB (-10 to +10)
  mid: number;
  treble: number;
  surround: boolean;
}

export interface AcousticRoom {
  id: string;
  name: string;
  icon: string;
  badge: string;
  description: string;
  reverbPercent: number;
  widthPercent: number;
}

export const ACOUSTIC_ROOMS: AcousticRoom[] = [
  {
    id: 'room-studio',
    name: 'Reference Studio',
    icon: '🎧',
    badge: 'Pristine',
    description: 'Direct acoustic capture with zero phase coloration or room bleed.',
    reverbPercent: 0,
    widthPercent: 100,
  },
  {
    id: 'room-arena',
    name: 'Grand Concert Arena',
    icon: '🏟️',
    badge: '3D Spatial',
    description: 'Expansive stadium reverberation with 160% wide stereo field.',
    reverbPercent: 65,
    widthPercent: 160,
  },
  {
    id: 'room-club',
    name: 'Velvet Jazz Lounge',
    icon: '🍸',
    badge: 'Warm Room',
    description: 'Intimate mahogany room acoustics with rich natural harmonic resonance.',
    reverbPercent: 35,
    widthPercent: 120,
  },
  {
    id: 'room-celestial',
    name: '8D Celestial Space',
    icon: '🌌',
    badge: 'Binaural',
    description: 'Floating headphone soundstage with deep ambient acoustic immersion.',
    reverbPercent: 85,
    widthPercent: 200,
  },
];

export const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'studio-flat',
    name: 'Studio Pure',
    badge: 'Original',
    description: 'Uncolored, pristine studio reference mix as recorded by the artist.',
    bass: 0,
    mid: 0,
    treble: 0,
    surround: false,
  },
  {
    id: 'bass-boost',
    name: 'Bass Heavy 808',
    badge: 'Punchy',
    description: 'Deep resonant sub-bass boost with tight kick response for Hip-Hop & Rap.',
    bass: 7,
    mid: 0,
    treble: 3,
    surround: false,
  },
  {
    id: 'vocal-clarity',
    name: 'Vocal Master & Karaoke',
    badge: 'Vocals',
    description: 'Elevates lyrical intimacy and vocal clarity over the backing instrumental.',
    bass: -2,
    mid: 6,
    treble: 4,
    surround: false,
  },
  {
    id: 'chill-lofi',
    name: 'Late Night Chill',
    badge: 'Warm',
    description: 'Relaxed vintage warmth with softened highs and rich analog low-end.',
    bass: 4,
    mid: 2,
    treble: -3,
    surround: true,
  },
  {
    id: 'rock-stage',
    name: 'Rock & Dynamic Stage',
    badge: 'Live',
    description: 'Aggressive guitars and punchy snare attack with wide presence.',
    bass: 5,
    mid: 4,
    treble: 6,
    surround: false,
  },
  {
    id: 'spatial-3d',
    name: '8D Spatial Immersion',
    badge: 'Surround',
    description: 'Expansive acoustic space with 3D headphone soundstage widening.',
    bass: 3,
    mid: 1,
    treble: 5,
    surround: true,
  },
];

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPlaying?: boolean;
}

export const EqualizerModal: React.FC<EqualizerModalProps> = ({ isOpen, onClose, isPlaying = false }) => {
  const [activePresetId, setActivePresetId] = useState<string>('studio-flat');
  const [activeRoomId, setActiveRoomId] = useState<string>('room-studio');
  const [bass, setBass] = useState<number>(0);
  const [mid, setMid] = useState<number>(0);
  const [treble, setTreble] = useState<number>(0);
  const [_surround, setSurround] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const savedPreset = localStorage.getItem('sonora_audio_preset');
      if (savedPreset) {
        const found = SOUND_PRESETS.find((p) => p.id === savedPreset);
        if (found) {
          setActivePresetId(found.id);
          setBass(found.bass);
          setMid(found.mid);
          setTreble(found.treble);
          setSurround(found.surround);
        }
      }
      const savedRoom = localStorage.getItem('sonora_acoustic_room');
      if (savedRoom) {
        const foundRoom = ACOUSTIC_ROOMS.find((r) => r.id === savedRoom);
        if (foundRoom) {
          setActiveRoomId(foundRoom.id);
        }
      }
    } catch {}
  }, []);

  const selectPreset = (preset: SoundPreset) => {
    setActivePresetId(preset.id);
    setBass(preset.bass);
    setMid(preset.mid);
    setTreble(preset.treble);
    setSurround(preset.surround);
    try {
      localStorage.setItem('sonora_audio_preset', preset.id);
    } catch {}
  };

  const selectRoom = (room: AcousticRoom) => {
    setActiveRoomId(room.id);
    try {
      localStorage.setItem('sonora_acoustic_room', room.id);
    } catch {}
  };

  const resetFlat = () => {
    selectPreset(SOUND_PRESETS[0]);
    selectRoom(ACOUSTIC_ROOMS[0]);
  };

  if (!isOpen || !mounted) return null;

  const currentRoom = ACOUSTIC_ROOMS.find((r) => r.id === activeRoomId) || ACOUSTIC_ROOMS[0];

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-xl bg-[#141414] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6 text-white max-h-[92vh] flex flex-col justify-between my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow background accent */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Sonora Sound Studio & 3D Spatial Room
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold tracking-wide uppercase">
                  Spatial EQ
                </span>
              </h3>
              <p className="text-xs text-neutral-400">Binaural 3D room simulation & master frequency sculpting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto space-y-4 py-3 pr-1">
          {/* 3D Acoustic Room Simulator Carousel */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Compass className="w-3.5 h-3.5" />
                3D Spatial Acoustic Environment
              </span>
              <span className="text-white/60 font-mono text-[10px] lowercase">
                stereo width: {currentRoom.widthPercent}%
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ACOUSTIC_ROOMS.map((room) => {
                const isSelected = activeRoomId === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => selectRoom(room)}
                    className={`p-2.5 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between gap-1 relative overflow-hidden group ${
                      isSelected
                        ? 'bg-gradient-to-br from-blue-500/20 to-blue-500/10 border-blue-500/60 shadow-lg shadow-blue-500/15'
                        : 'bg-neutral-900/60 border-white/5 hover:border-white/15 hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-lg">{room.icon}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-blue-400 text-black font-extrabold' : 'bg-white/10 text-neutral-400'
                        }`}
                      >
                        {room.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white truncate mt-1">{room.name}</h4>
                      <p className="text-[10px] text-neutral-400 leading-tight line-clamp-2 mt-0.5">
                        {room.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Visualizer Graphic */}
          <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span>Real-Time Spectrum Profile</span>
              <span className="text-amber-400 font-bold">
                {SOUND_PRESETS.find((p) => p.id === activePresetId)?.name || 'Custom'} • {currentRoom.name}
              </span>
            </div>
            <div className="flex items-end justify-between h-14 gap-2 pt-1 px-1">
              {[
                { label: '60Hz', val: bass + 6 },
                { label: '150Hz', val: bass + 4 },
                { label: '400Hz', val: (bass + mid) / 2 + 3 },
                { label: '1kHz', val: mid + 5 },
                { label: '2.5kHz', val: mid + 4 },
                { label: '6kHz', val: treble + 4 },
                { label: '14kHz', val: treble + 5 },
              ].map((band, i) => {
                const heightPercent = Math.min(100, Math.max(15, (band.val / 16) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isPlaying
                          ? 'bg-gradient-to-t from-blue-500 via-amber-400 to-orange-400'
                          : 'bg-gradient-to-t from-blue-600 to-amber-500/60'
                      }`}
                      style={{
                        height: `${heightPercent}%`,
                        opacity: isPlaying ? 0.95 : 0.6,
                      }}
                    />
                    <span className="text-[9px] font-mono text-neutral-500">{band.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sound Presets */}
          <div>
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Frequency Tuning Presets
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOUND_PRESETS.map((p) => {
                const isSelected = activePresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => selectPreset(p)}
                    className={`p-3 rounded-2xl text-left border transition-all duration-150 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10'
                        : 'bg-neutral-900/50 border-white/5 hover:border-white/15 hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full mb-1">
                      <span className="font-bold text-xs text-white truncate">{p.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-amber-400 text-black font-extrabold'
                            : 'bg-white/10 text-neutral-300'
                        }`}
                      >
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-tight line-clamp-2">{p.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="pt-3.5 border-t border-white/10 flex items-center justify-between shrink-0">
          <button
            onClick={resetFlat}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Reference Studio
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-400 hover:to-blue-400 text-black font-extrabold text-xs transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            Apply Acoustic Profile
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
