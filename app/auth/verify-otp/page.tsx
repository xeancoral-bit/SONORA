'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { AuthBadge } from '@/components/auth/AuthBadge';
import { useToast } from '@/context/ToastContext';

function OtpVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [devOtpNotice, setDevOtpNotice] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load email from query param or session storage
  useEffect(() => {
    const paramEmail = searchParams.get('email');
    const storedEmail = typeof window !== 'undefined' ? sessionStorage.getItem('sonora_reset_email') : null;
    const resolvedEmail = paramEmail || storedEmail || '';

    if (!resolvedEmail) {
      router.push('/auth/forgot-password');
      return;
    }

    setEmail(resolvedEmail);

    const storedMasked = typeof window !== 'undefined' ? sessionStorage.getItem('sonora_masked_email') : null;
    if (storedMasked) {
      setMaskedEmail(storedMasked);
    } else {
      const [local, domain] = resolvedEmail.split('@');
      const prefix = local ? local.slice(0, 2) : 'xe';
      setMaskedEmail(`${prefix}***@${domain || 'gmail.com'}`);
    }

    const devOtp = typeof window !== 'undefined' ? sessionStorage.getItem('sonora_dev_otp') : null;
    if (devOtp) {
      setDevOtpNotice(devOtp);
    }

    // Auto-focus first input box
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, [searchParams, router]);

  // Resend Countdown Timer (60s)
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleDigitChange = (index: number, value: string) => {
    setErrorMsg(null);

    // Handle single character or numeric input
    const cleanChar = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanChar;
    setOtpDigits(newDigits);

    // Auto-advance to next input if digit entered
    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const pastedData = e.clipboardData.getData('text').trim();
    const numbersOnly = pastedData.replace(/\D/g, '').slice(0, 6);

    if (numbersOnly) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = numbersOnly[i] || '';
      }
      setOtpDigits(newDigits);

      // Focus last filled or first empty
      const nextIndex = Math.min(numbersOnly.length, 5);
      inputRefs.current[nextIndex]?.focus();

      // Auto submit if 6 digits pasted
      if (numbersOnly.length === 6) {
        verifyCode(numbersOnly);
      }
    }
  };

  const verifyCode = async (codeToVerify?: string) => {
    setErrorMsg(null);
    const code = codeToVerify || otpDigits.join('');

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setErrorMsg('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid or expired verification code.');
        toast.error('Verification Failed', data.error || 'Invalid OTP code.');
        setIsLoading(false);
        return;
      }

      toast.success('Code Verified', 'You can now create your new password.');

      // Store reset token
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sonora_reset_token', data.resetToken);
      }

      router.push(
        `/auth/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(
          data.resetToken
        )}`
      );
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to resend code.');
        toast.error(data.error || 'Could not resend code');
        setIsResending(false);
        return;
      }

      toast.success('New Code Sent', data.message || 'Check your inbox for a new code.');
      setCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

      if (data.devOtp) {
        setDevOtpNotice(data.devOtp);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('sonora_dev_otp', data.devOtp);
        }
      }
    } catch (err: any) {
      setErrorMsg('Could not resend code. Check your internet connection.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCode();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
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
            Enter verification code
          </h1>
          <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed font-normal max-w-xs mx-auto">
            We sent a 6-digit verification code to{' '}
            <span className="text-white font-medium">{maskedEmail || 'your email'}</span>
          </p>
        </div>

        {/* Development Helper Badge if in Resend Sandbox */}
        {devOtpNotice && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between text-left">
            <span>
              Sandbox Code: <strong className="font-mono text-sm tracking-wider text-white">{devOtpNotice}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                const digits = devOtpNotice.split('');
                setOtpDigits(digits);
                verifyCode(devOtpNotice);
              }}
              className="text-[11px] font-bold bg-emerald-500 text-black px-2 py-1 rounded-md hover:bg-emerald-400 transition-colors"
            >
              Auto-Fill
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5 text-left animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* OTP Input Boxes Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className="w-11 h-12 sm:w-12 sm:h-14 bg-[#0a0c10] border border-white/10 rounded-xl text-center text-xl font-bold font-mono text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-inner"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otpDigits.some((d) => !d)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00d2b4] via-[#00e5a3] to-[#00f298] text-black font-extrabold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:brightness-105 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>VERIFYING OTP...</span>
              </>
            ) : (
              <>
                <span>Verify OTP</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Resend Code with Countdown */}
        <div className="space-y-3 pt-1">
          <p className="text-xs text-neutral-400">
            Didn&apos;t receive the code?{' '}
            {countdown > 0 ? (
              <span className="text-emerald-400/80 font-medium cursor-not-allowed">
                Resend Code ({countdown}s)
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline inline-flex items-center gap-1"
              >
                {isResending && <RefreshCw className="w-3 h-3 animate-spin" />}
                Resend Code
              </button>
            )}
          </p>

          {/* Change Email / Back Link */}
          <div>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-neutral-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Email / Back</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OtpVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      }
    >
      <OtpVerificationContent />
    </Suspense>
  );
}
