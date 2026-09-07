'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  User,
  Sliders,
  Bell,
  Lock,
  Palette,
  Shield,
  Save,
  Check,
  Volume2,
  Sparkles,
  LogOut
} from 'lucide-react';

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'account' | 'playback' | 'notifications' | 'privacy'>('account');

  // Account state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  // Playback state
  const [autoplay, setAutoplay] = useState(true);
  const [audioQuality, setAudioQuality] = useState<'normal' | 'high' | 'ultra'>('high');
  const [crossfade, setCrossfade] = useState(2);
  const [normalizeVolume, setNormalizeVolume] = useState(true);
  const [explicitFilter, setExplicitFilter] = useState(false);

  // Notifications state
  const [notifyNewReleases, setNotifyNewReleases] = useState(true);
  const [notifyArtistUpdates, setNotifyArtistUpdates] = useState(true);
  const [notifyRecommendations, setNotifyRecommendations] = useState(true);
  const [notifySystem, setNotifySystem] = useState(true);

  // Privacy state
  const [privateListening, setPrivateListening] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
      if (user.preferences) {
        setAutoplay(user.preferences.autoplay ?? true);
        setAudioQuality(user.preferences.audioQuality || 'high');
        setCrossfade(user.preferences.crossfade ?? 2);
        setNormalizeVolume(user.preferences.normalizeVolume ?? true);
        setExplicitFilter(user.preferences.explicitFilter ?? false);
        setNotifyNewReleases(user.preferences.notifyNewReleases ?? true);
        setNotifyArtistUpdates(user.preferences.notifyArtistUpdates ?? true);
        setNotifyRecommendations(user.preferences.notifyRecommendations ?? true);
        setNotifySystem(user.preferences.notifySystem ?? true);
        setPrivateListening(user.preferences.privateListening ?? false);
      }
    }
  }, [user]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSaving(true);
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          bio,
          avatar,
          preferences: {
            autoplay,
            audioQuality,
            crossfade,
            normalizeVolume,
            explicitFilter,
            notifyNewReleases,
            notifyArtistUpdates,
            notifyRecommendations,
            notifySystem,
            privateListening
          }
        })
      });

      if (res.ok) {
        await refreshUser();
        toast.success('Settings Saved', 'Your preferences have been updated.');
      } else {
        toast.error('Failed to save settings');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Settings</h1>
        <p className="text-sm text-neutral-400 mt-1">Manage your account, playback preferences, and privacy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Settings Navigation Tabs */}
          <div className="md:col-span-4 bg-[#141414] border border-white/5 rounded-2xl p-2 flex flex-col gap-1 select-none">
            {[
              { id: 'account', label: 'Account Profile', icon: User },
              { id: 'playback', label: 'Audio & Playback', icon: Sliders },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'privacy', label: 'Privacy & Security', icon: Lock }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-left transition-all ${
                    active
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Account</span>
              </button>
            </div>
          </div>

        {/* Tab Content Form */}
        <form onSubmit={handleSaveSettings} className="md:col-span-8 space-y-6">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-5">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Account Profile</h3>

              <div className="flex items-center gap-4">
                <img
                  src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-full object-cover border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1.5">
                  Biography
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell music lovers about your taste..."
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-neutral-400">
                <div>
                  <span className="block text-neutral-500 uppercase font-semibold">Username</span>
                  <span className="text-white font-mono">@{user?.username}</span>
                </div>
                <div>
                  <span className="block text-neutral-500 uppercase font-semibold">Email</span>
                  <span className="text-white font-mono">{user?.email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Playback Tab */}
          {activeTab === 'playback' && (
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-5">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">
                Playback & Audio Engine
              </h3>

              {/* Autoplay Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div>
                  <h4 className="text-sm font-semibold text-white">Autoplay</h4>
                  <p className="text-xs text-neutral-400">
                    Keep the music going with similar songs when your playlist ends.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Streaming Audio Quality */}
              <div className="py-2 border-b border-white/5">
                <h4 className="text-sm font-semibold text-white mb-1">Audio Streaming Quality</h4>
                <p className="text-xs text-neutral-400 mb-3">
                  Higher bitrates require faster internet speeds.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'high', 'ultra'] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAudioQuality(q)}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                        audioQuality === q
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-md'
                          : 'bg-neutral-900 border-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {q === 'normal' ? '128 kbps (Normal)' : q === 'high' ? '256 kbps (High)' : '320 kbps (Lossless)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crossfade Slider */}
              <div className="py-2 border-b border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-semibold text-white">Crossfade Songs</h4>
                  <span className="text-xs font-mono text-emerald-400">{crossfade}s</span>
                </div>
                <p className="text-xs text-neutral-400 mb-2">
                  Seamless transition duration between consecutive songs.
                </p>
                <input
                  type="range"
                  min={0}
                  max={12}
                  value={crossfade}
                  onChange={(e) => setCrossfade(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-white/20 rounded-full"
                />
              </div>

              {/* Normalize Volume */}
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div>
                  <h4 className="text-sm font-semibold text-white">Normalize Volume</h4>
                  <p className="text-xs text-neutral-400">
                    Set the same gain level for all tracks in your queue.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={normalizeVolume}
                  onChange={(e) => setNormalizeVolume(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Explicit filter */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-semibold text-white">Filter Explicit Content</h4>
                  <p className="text-xs text-neutral-400">
                    Skip tracks marked with explicit language tags.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={explicitFilter}
                  onChange={(e) => setExplicitFilter(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">
                Notification Preferences
              </h3>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div>
                  <h4 className="text-sm font-semibold text-white">New Music Releases</h4>
                  <p className="text-xs text-neutral-400">Receive alerts when artists you follow drop new music.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyNewReleases}
                  onChange={(e) => setNotifyNewReleases(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div>
                  <h4 className="text-sm font-semibold text-white">Recommended For You</h4>
                  <p className="text-xs text-neutral-400">Weekly music discovery digest based on your listening.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyRecommendations}
                  onChange={(e) => setNotifyRecommendations(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-semibold text-white">System & Platform Updates</h4>
                  <p className="text-xs text-neutral-400">Announcements regarding platform enhancements and catalog news.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifySystem}
                  onChange={(e) => setNotifySystem(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">
                Privacy & Data
              </h3>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div>
                  <h4 className="text-sm font-semibold text-white">Private Listening Session</h4>
                  <p className="text-xs text-neutral-400">
                    Listen anonymously without recording tracks to your public profile history.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privateListening}
                  onChange={(e) => setPrivateListening(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
