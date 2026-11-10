'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SonoraLogo } from '@/components/layout/SonoraLogo';
import { Lock, Mail, ChevronRight, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useSignIn, useClerk } from '@clerk/nextjs';
import { SocialAuthModal } from '@/components/auth/SocialAuthModal';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast();

  const clerk = useClerk();
  const { signIn: clerkSignIn } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'oauth_google' | 'oauth_facebook' | null>(null);
  const [activeSocialModal, setActiveSocialModal] = useState<'google' | 'facebook' | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sonora_saved_identifier');
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    }
  }, []);

  const triggerClerkOAuth = async (strategy: 'oauth_google' | 'oauth_facebook') => {
    try {
      setSocialLoading(strategy);

      let attempts = 0;
      while (!clerk.loaded && attempts < 15) {
        await new Promise((r) => setTimeout(r, 200));
        attempts++;
      }

      if (!clerk.loaded) {
        toast.error('Authentication service is still initializing. Please try again.');
        setSocialLoading(null);
        return;
      }

      const targetSignIn = clerk.client?.signIn || clerkSignIn;
      if (targetSignIn && typeof targetSignIn.authenticateWithRedirect === 'function') {
        await targetSignIn.authenticateWithRedirect({
          strategy,
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/',
          continueSignUp: true,
          continueSignIn: true,
        });
        return;
      }

      if (clerkSignIn && typeof clerkSignIn.sso === 'function') {
        const res = await clerkSignIn.sso({
          strategy,
          redirectUrl: '/sso-callback',
          redirectCallbackUrl: '/',
        });
        if (res?.error) {
          toast.error(res.error.message || 'Social sign-in failed');
        }
        return;
      }

      toast.error('Authentication provider is not available.');
    } catch (err: any) {
      console.error('OAuth error:', err);
      const msg = err?.errors?.[0]?.message || err?.message || 'Social sign-in failed';
      toast.error(msg);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleOAuthClick = (provider: 'google' | 'facebook') => {
    setActiveSocialModal(provider);
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIdentifier = email.trim();
    if (!cleanIdentifier || !password) {
      toast.error('Please enter your email or username and password');
      return;
    }

    setIsLoading(true);
    const res = await login(cleanIdentifier, password, rememberMe);
    setIsLoading(false);

    if (res.success) {
      toast.success('Welcome back to SONORA!');
      // Full navigation guarantees all server components, cookies, and music state are loaded fresh
      window.location.href = '/';
    } else {
      toast.error(res.error || 'Invalid credentials');
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

      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <SonoraLogo size="lg" />
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-4 sm:mt-5">Sign in to Sonora</h2>
        <p className="text-[11px] sm:text-xs text-neutral-400 mt-1">
          Welcome back! Please sign in to continue
        </p>
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-0.5 sm:pt-1">
        <button
          type="button"
          disabled={Boolean(socialLoading) || isLoading}
          onClick={() => handleOAuthClick('google')}
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
          onClick={() => handleOAuthClick('facebook')}
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

      {/* Subtle Divider */}
      <div className="relative flex items-center justify-center my-1">
        <div className="border-t border-white/[0.08] w-full" />
        <span className="bg-[#121214] px-3 text-[11px] font-medium text-neutral-500 uppercase tracking-widest shrink-0">or</span>
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
        <div>
          <label className="block text-[11px] sm:text-xs font-semibold text-neutral-300 mb-1.5">
            Email address or username
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              required
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Enter your username or email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 sm:h-11 bg-neutral-900/90 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] sm:text-xs font-semibold text-neutral-300">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 sm:h-11 bg-neutral-900/90 border border-white/10 rounded-xl pl-10 pr-10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-0.5"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-400 pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 accent-blue-500 rounded bg-neutral-900 border-white/10"
            />
            <span className="text-[11px] sm:text-xs">Remember me</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 sm:h-11 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? 'Signing in...' : 'Continue'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-[11px] sm:text-xs text-neutral-400 pt-2.5 sm:pt-3 border-t border-white/[0.06]">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
          Sign up
        </Link>
      </div>

      {/* Seamless One-Click Social Auth Modal (Google & Facebook) */}
      <SocialAuthModal
        isOpen={Boolean(activeSocialModal)}
        onClose={() => setActiveSocialModal(null)}
        provider={activeSocialModal || 'google'}
        onClerkOAuth={() => triggerClerkOAuth('oauth_google')}
      />
    </div>
  );
}

