'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Check, Circle, Loader2, AlertCircle } from 'lucide-react';
import { AuthBadge } from '@/components/auth/AuthBadge';
import { useToast } from '@/context/ToastContext';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const paramEmail = searchParams.get('email');
    const paramToken = searchParams.get('token');
    const storedEmail = typeof window !== 'undefined' ? sessionStorage.getItem('sonora_reset_email') : null;
    const storedToken = typeof window !== 'undefined' ? sessionStorage.getItem('sonora_reset_token') : null;

    const resolvedEmail = paramEmail || storedEmail;
    const resolvedToken = paramToken || storedToken;

    if (!resolvedEmail || !resolvedToken) {
      toast.error('Session Missing', 'Please verify your code first.');
      router.push('/auth/forgot-password');
      return;
    }

    setEmail(resolvedEmail);
    setResetToken(resolvedToken);
  }, [searchParams, router, toast]);

  // Validation rules evaluation
  const rules = useMemo(() => {
    return {
      hasMinLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(newPassword),
      passwordsMatch: newPassword.length > 0 && newPassword === confirmPassword
    };
  }, [newPassword, confirmPassword]);

  const allRulesSatisfied =
    rules.hasMinLength &&
    rules.hasUpperCase &&
    rules.hasLowerCase &&
    rules.hasNumber &&
    rules.hasSpecialChar &&
    rules.passwordsMatch;

  // Password strength calculation
  const strength = useMemo(() => {
    if (!newPassword) return { score: 0, label: 'Weak', color: 'bg-neutral-800' };

    let score = 0;
    if (rules.hasMinLength) score += 1;
    if (rules.hasUpperCase && rules.hasLowerCase) score += 1;
    if (rules.hasNumber) score += 1;
    if (rules.hasSpecialChar) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-teal-400' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400' };
  }, [newPassword, rules]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!allRulesSatisfied) {
      setErrorMsg('Please satisfy all password requirements before proceeding.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          resetToken,
          newPassword,
          confirmPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to update password.');
        toast.error('Reset Failed', data.error || 'Password update failed.');
        setIsLoading(false);
        return;
      }

      toast.success('Password Updated', 'Your SONORA password has been reset successfully.');

      // Clear sensitive reset session tokens
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('sonora_reset_token');
        sessionStorage.removeItem('sonora_dev_otp');
      }

      router.push('/auth/reset-success');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setErrorMsg('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-radial from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="relative w-full max-w-md bg-[#12141a]/95 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-2xl space-y-6 text-center">
        {/* Sonora Equalizer Branding Badge */}
        <AuthBadge />

        {/* Heading & Subtext */}
        <div className="space-y-1.5">
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
            Create new password
          </h1>
          <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed font-normal max-w-xs mx-auto">
            Your new password must be different from previous passwords.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5 text-left animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* New Password Field */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#0a0c10] border border-white/10 rounded-xl pl-4 pr-11 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-colors placeholder:text-neutral-600"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0a0c10] border border-white/10 rounded-xl pl-4 pr-11 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-colors placeholder:text-neutral-600"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password Strength Section */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium">Password Strength</span>
              <span
                className={`font-semibold ${
                  strength.label === 'Strong'
                    ? 'text-emerald-400'
                    : strength.label === 'Good'
                    ? 'text-teal-400'
                    : strength.label === 'Fair'
                    ? 'text-amber-400'
                    : 'text-neutral-500'
                }`}
              >
                {strength.label}
              </span>
            </div>

            {/* 4-Segment Strength Bar */}
            <div className="grid grid-cols-4 gap-1.5 h-1.5">
              {[1, 2, 3, 4].map((barIndex) => (
                <div
                  key={barIndex}
                  className={`rounded-full transition-all duration-300 ${
                    strength.score >= barIndex ? strength.color : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Rules Checklist Box */}
          <div className="p-4 rounded-2xl bg-[#0a0c10]/80 border border-white/5 space-y-2.5">
            <ChecklistItem
              satisfied={rules.hasMinLength}
              text="At least 8 characters"
            />
            <ChecklistItem
              satisfied={rules.hasUpperCase}
              text="At least one uppercase letter"
            />
            <ChecklistItem
              satisfied={rules.hasLowerCase}
              text="At least one lowercase letter"
            />
            <ChecklistItem
              satisfied={rules.hasNumber}
              text="At least one number"
            />
            <ChecklistItem
              satisfied={rules.hasSpecialChar}
              text="At least one special character"
            />
            <ChecklistItem
              satisfied={rules.passwordsMatch}
              text="Passwords match"
            />
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={!allRulesSatisfied || isLoading}
            className={`w-full py-3.5 rounded-xl font-extrabold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
              allRulesSatisfied && !isLoading
                ? 'bg-gradient-to-r from-[#00d2b4] via-[#00e5a3] to-[#00f298] text-black shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:brightness-105 active:scale-[0.99] cursor-pointer'
                : 'bg-[#1b2b25] text-emerald-600/70 border border-emerald-500/10 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="text-emerald-400">UPDATING PASSWORD...</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function ChecklistItem({ satisfied, text }: { satisfied: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-xs select-none">
      {satisfied ? (
        <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/80 flex items-center justify-center shrink-0">
          <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
        </div>
      ) : (
        <Circle className="w-4 h-4 text-neutral-600 shrink-0" strokeWidth={1.5} />
      )}
      <span className={satisfied ? 'text-neutral-200 font-medium' : 'text-neutral-500'}>
        {text}
      </span>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
