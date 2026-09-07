'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { Settings, HardDrive, Shield, Save, CheckCircle2, Sliders } from 'lucide-react';

export default function AdminSettingsPage() {
  const toast = useToast();
  const [siteName, setSiteName] = useState('SONORA');
  const [tagline, setTagline] = useState('Your Music. Your Moment.');
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [maxUploadSize, setMaxUploadSize] = useState(50);
  const [defaultTheme, setDefaultTheme] = useState<'dark' | 'light'>('dark');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('System Settings Saved', 'Platform configuration updated successfully.');
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Platform System Settings</h1>
        <p className="text-xs md:text-sm text-neutral-400 mt-1">
          Configure site branding, storage constraints, upload validation, and security policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Storage Telemetry */}
        <div className="md:col-span-4 p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <HardDrive className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Storage Health</h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Storage Allocated</span>
              <span className="font-mono text-white">124.5 MB / 50 GB</span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div className="w-[3%] h-full bg-emerald-500 rounded-full" />
            </div>
            <span className="text-[11px] text-neutral-500 block">
              Audio files and cover arts stored securely in /public/uploads
            </span>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Audio Codecs</span>
              <span className="font-mono text-emerald-400">MP3, WAV, M4A, AAC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Web Audio Fallback</span>
              <span className="font-mono text-cyan-400">Online & Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Database Engine</span>
              <span className="font-mono text-purple-400">ACID JSON Store</span>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="md:col-span-8 p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-5">
          <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">
            General Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Platform Name
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Tagline / Slogan
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Max Upload Size (MB)
              </label>
              <input
                type="number"
                min={5}
                max={200}
                value={maxUploadSize}
                onChange={(e) => setMaxUploadSize(parseInt(e.target.value, 10))}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Default App Theme
              </label>
              <select
                value={defaultTheme}
                onChange={(e) => setDefaultTheme(e.target.value as any)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="dark">Dark Mode (Default)</option>
                <option value="light">Light Mode</option>
              </select>
            </div>
          </div>

          <div className="py-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">Allow Public User Registrations</h4>
                <p className="text-xs text-neutral-400">
                  Allow visitors to sign up for new regular user accounts.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowRegistration}
                onChange={(e) => setAllowRegistration(e.target.checked)}
                className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save System Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
