'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SonoraLogo } from '@/components/layout/SonoraLogo';
import { Lock, Mail, User, ArrowRight, Upload, X, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const toast = useToast();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !username || !email || !password) {
      toast.error('All required fields must be filled');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const res = await register({
      name,
      username,
      email,
      password,
      confirmPassword,
      avatar: avatar.trim() || undefined
    });
    setIsLoading(false);

    if (res.success) {
      toast.success('Registration successful!', 'Welcome to SONORA');
      router.push('/welcome');
    } else {
      toast.error(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141414] border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/80 space-y-6">
        <div className="flex flex-col items-center text-center">
          <SonoraLogo size="lg" />
          <h2 className="text-2xl font-black text-white tracking-tight mt-6">Create Account</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Join the premium music streaming and playlist platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Maya Chen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Username *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">@</span>
              <input
                type="text"
                required
                placeholder="mayachen"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                placeholder="maya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Confirm *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-0.5"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Profile Picture (Optional)
            </label>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAvatarFile(file);
                  setAvatar(URL.createObjectURL(file));
                }
              }}
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-neutral-900 hover:border-emerald-500/50 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-all"
              >
                <Upload className="w-4 h-4" />
                {avatarFile ? 'Change photo' : 'Upload photo'}
              </button>
              {avatar && (
                <div className="relative flex-shrink-0">
                  <img
                    src={avatar}
                    alt="Avatar preview"
                    className="w-9 h-9 rounded-full object-cover border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => { setAvatar(''); setAvatarFile(null); if (avatarInputRef.current) avatarInputRef.current.value = ''; }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neutral-700 hover:bg-red-500 flex items-center justify-center transition-colors"
                    aria-label="Remove photo"
                  >
                    <X className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
              )}
              {avatarFile && (
                <span className="text-xs text-neutral-500 truncate max-w-[120px]">{avatarFile.name}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-white/5">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-emerald-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
