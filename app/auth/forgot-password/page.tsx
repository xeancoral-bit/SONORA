'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { AuthBadge } from '@/components/auth/AuthBadge';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your account email.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to send verification code.');
        toast.error(data.error || 'Account not found');
        setIsLoading(false);
        return;
      }

      toast.success('Verification Code Sent', data.message || `Code sent to ${data.maskedEmail}`);

      // Save email in session for smooth multi-step flow
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sonora_reset_email', cleanEmail);
        sessionStorage.setItem('sonora_masked_email', data.maskedEmail || cleanEmail);
        if (data.devOtp) {
          sessionStorage.setItem('sonora_dev_otp', data.devOtp);
        }
      }

      router.push(`/auth/verify-otp?email=${encodeURIComponent(cleanEmail)}`);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setErrorMsg('Network error. Please try again.');
      toast.error('Network Error', 'Could not reach SONORA servers.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Ambient Radial Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-radial from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="relative w-full max-w-md bg-[#12141a]/95 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-2xl space-y-7 text-center">
        {/* Sonora Equalizer Branding Badge */}
        <AuthBadge />

        {/* Heading & Subtext */}
        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed font-normal max-w-xs mx-auto">
            Enter the email address associated with your SONORA account and we&apos;ll send you a verification code.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5 text-left animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-widest mb-2">
              ACCOUNT EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                autoFocus
                placeholder="audiophile@sonora.io"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-full bg-[#0a0c10] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-colors placeholder:text-neutral-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00d2b4] via-[#00e5a3] to-[#00f298] text-black font-extrabold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:brightness-105 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SENDING OTP...</span>
              </>
            ) : (
              <>
                <span>SEND OTP</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Back to Sign In Link */}
        <div className="pt-2">
          <Link
            href="/auth/login"
            className="text-xs text-neutral-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
