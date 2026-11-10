'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SonoraLogo } from '@/components/layout/SonoraLogo';
import { Mail, ArrowRight, ArrowLeft, Upload, X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSignUp, useClerk } from '@clerk/nextjs';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const toast = useToast();

  const clerk = useClerk();
  const { signUp: clerkSignUp } = useSignUp();

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
  const [socialLoading, setSocialLoading] = useState<'oauth_google' | 'oauth_facebook' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase().replace(/^@+/, '');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanUsername || !cleanEmail || !password) {
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
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password,
      confirmPassword,
      avatar: avatar.trim() || undefined
    });
    setIsLoading(false);

    if (res.success) {
      toast.success('Registration successful!', 'Welcome to SONORA');
      // Full navigation ensures the authenticated session, cookie, and layout are loaded fresh
      window.location.href = '/';
    } else {
      toast.error(res.error || 'Registration failed');
    }
  };

  const handleOAuth = async (strategy: 'oauth_google' | 'oauth_facebook') => {
    try {
      setSocialLoading(strategy);

      // Wait briefly if Clerk is still initializing
      let attempts = 0;
      while (!clerk.loaded && attempts < 15) {
        await new Promise((r) => setTimeout(r, 200));
        attempts++;
      }

      if (!clerk.loaded) {
        toast.error('Authentication service is still initializing. Please check your connection and try again.');
        setSocialLoading(null);
        return;
      }

      // Try client.signUp.authenticateWithRedirect
      const targetSignUp = clerk.client?.signUp || clerkSignUp;
      if (targetSignUp && typeof targetSignUp.authenticateWithRedirect === 'function') {
        await targetSignUp.authenticateWithRedirect({
          strategy,
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/',
          continueSignUp: true,
          continueSignIn: true,
        });
        return;
      }

      if (clerkSignUp && typeof clerkSignUp.sso === 'function') {
        const res = await clerkSignUp.sso({
          strategy,
          redirectUrl: '/sso-callback',
          redirectCallbackUrl: '/',
        });
        if (res?.error) {
          toast.error(res.error.message || 'Social sign-up failed');
        }
        return;
      }

      toast.error('Unable to initiate social registration. Please register with username and password.');
    } catch (err: any) {
      console.error('OAuth sign up error:', err);
      const msg = err?.errors?.[0]?.message || err?.message || 'Social sign-up failed';
      toast.error(msg);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto bg-[#121214] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 md:p-9 shadow-2xl shadow-black/90 space-y-4 sm:space-y-5 transition-all">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between pb-1 -mt-1 sm:-mt-2">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="inline-flex items-center gap-2 px-2.5 py-1.5 -ml-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-all group active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>
      </div>

      <div className="flex flex-col items-center text-center">
        <SonoraLogo size="lg" />
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-4 sm:mt-5">Create Account</h2>
        <p className="text-[11px] sm:text-xs text-neutral-400 mt-1">
          Join the premium music streaming and playlist platform.
        </p>
      </div>

      {/* Social Registration */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-0.5 sm:pt-1">
        <button
          type="button"
          disabled={Boolean(socialLoading) || isLoading}
          onClick={() => handleOAuth('oauth_google')}
          className="h-10 sm:h-11 flex items-center justify-center gap-2 sm:gap-2.5 px-3 sm:px-4 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-white/10 text-white text-[11px] sm:text-xs font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {socialLoading === 'oauth_google' ? (
            <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          )}
          <span>{socialLoading === 'oauth_google' ? 'Connecting...' : 'Google'}</span>
        </button>
        <button
          type="button"
          disabled={Boolean(socialLoading) || isLoading}
          onClick={() => handleOAuth('oauth_facebook')}
          className="h-10 sm:h-11 flex items-center justify-center gap-2.5 px-3 sm:px-4 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-white/10 text-white text-[11px] sm:text-xs font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {socialLoading === 'oauth_facebook' ? (
            <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
          ) : (
            <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          <span>{socialLoading === 'oauth_facebook' ? 'Connecting...' : 'Facebook'}</span>
        </button>
      </div>

      {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#141414] px-3 text-xs text-neutral-500 lowercase shrink-0">or</span>
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
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="mayachen"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="maya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-neutral-900 hover:border-blue-500/50 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-all"
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
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-bold text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-white/5">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-blue-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    );
  }
