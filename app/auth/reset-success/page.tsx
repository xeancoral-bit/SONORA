'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { AuthBadge } from '@/components/auth/AuthBadge';
import confetti from 'canvas-confetti';

export default function ResetSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Subtle festive confetti in emerald/teal to celebrate password recovery
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00e5a3', '#00d2b4', '#10b981', '#34d399']
      });
    } catch {
      // safe fallback if confetti fails
    }

    // Clean up all reset session artifacts from storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sonora_reset_email');
      sessionStorage.removeItem('sonora_masked_email');
      sessionStorage.removeItem('sonora_reset_token');
      sessionStorage.removeItem('sonora_dev_otp');
    }
  }, []);

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-radial from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="relative w-full max-w-md bg-[#12141a]/95 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-2xl space-y-7 text-center">
        {/* Sonora Equalizer Branding Badge */}
        <AuthBadge showText={false} />

        {/* Large Glowing Green Success Check Icon */}
        <div className="flex justify-center pt-1">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 border border-emerald-400/40 p-1 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.35)] animate-in zoom-in-50 duration-300">
            <div className="w-full h-full rounded-full bg-[#0d281e] flex items-center justify-center">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Heading & Confirmation Text */}
        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
            Password Reset Successful
          </h1>
          <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed font-normal max-w-xs mx-auto">
            Your SONORA password has been successfully updated. You can now sign in using your new password.
          </p>
        </div>

        {/* Large Glowing Back to Sign In Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00d2b4] via-[#00e5a3] to-[#00f298] text-black font-extrabold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:brightness-105 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Back to Sign In</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Need Help Footer */}
        <div className="pt-2">
          <p className="text-xs text-neutral-500">
            Need help?{' '}
            <Link
              href="/contact"
              className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-colors"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
