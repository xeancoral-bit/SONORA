'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, ChevronRight, ArrowRight, Trash2, ShieldAlert } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface SocialAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: 'google' | 'facebook';
  onClerkOAuth?: () => void;
}

interface QuickAccount {
  name: string;
  email: string;
  username: string;
  avatar: string;
  isRecent?: boolean;
}

const PRESET_GOOGLE_ACCOUNTS: QuickAccount[] = [
  {
    name: 'Denzenmilson90',
    email: 'denzenmilson90@gmail.com',
    username: 'denzenmilson90',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Denzenmilson90',
    isRecent: true
  },
  {
    name: 'Xean Coral',
    email: 'xeancoral31@gmail.com',
    username: 'deanlim90',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XeanCoral',
    isRecent: false
  }
];

export function SocialAuthModal({
  isOpen,
  onClose,
  provider,
  onClerkOAuth
}: SocialAuthModalProps) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAccountEmail, setSelectedAccountEmail] = useState<string | null>(null);

  // Accounts state (persisted in localStorage)
  const [accounts, setAccounts] = useState<QuickAccount[]>([]);
  const [accountToRemove, setAccountToRemove] = useState<QuickAccount | null>(null);

  // Custom account state
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  // Load and synchronize saved accounts from localStorage on modal open
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    try {
      const removedRaw = localStorage.getItem('sonora_removed_google_accounts');
      const removedSet = new Set<string>(removedRaw ? JSON.parse(removedRaw) : []);

      const savedRaw = localStorage.getItem('sonora_google_accounts');
      let list: QuickAccount[] = [];
      if (savedRaw) {
        list = JSON.parse(savedRaw);
      } else {
        list = [...PRESET_GOOGLE_ACCOUNTS];
      }

      // Filter out any explicitly removed accounts
      list = list.filter((a) => !removedSet.has(a.email.toLowerCase().trim()));

      // Synchronize active status with current session
      const savedIdentifier = (localStorage.getItem('sonora_saved_identifier') || '').toLowerCase().trim();
      list = list.map((a) => ({
        ...a,
        isRecent: savedIdentifier ? a.email.toLowerCase().trim() === savedIdentifier : Boolean(a.isRecent)
      }));

      setAccounts(list);
    } catch {
      setAccounts(PRESET_GOOGLE_ACCOUNTS);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignInWithAccount = async (account: { email: string; name: string; username?: string; avatar?: string }) => {
    try {
      setIsSubmitting(true);
      setSelectedAccountEmail(account.email);

      const res = await fetch('/api/auth/sso-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: account.email,
          name: account.name,
          username: account.username || account.email.split('@')[0],
          avatar: account.avatar,
          provider
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Authentication failed');
      }

      toast.success(
        `Welcome to SONORA, ${data.user?.name || account.name}!`,
        'Enjoy your music and playlist'
      );

      // Save credentials for quick recall & update saved account list
      if (typeof window !== 'undefined') {
        const cleanEmail = account.email.toLowerCase().trim();
        localStorage.setItem('sonora_logged_in', 'true');
        localStorage.setItem('sonora_saved_identifier', account.email);
        localStorage.setItem('sonora_user_name', data.user?.name || account.name);

        // Remove from blacklist if previously removed
        const removedRaw = localStorage.getItem('sonora_removed_google_accounts');
        if (removedRaw) {
          const removedSet = new Set<string>(JSON.parse(removedRaw));
          removedSet.delete(cleanEmail);
          localStorage.setItem('sonora_removed_google_accounts', JSON.stringify(Array.from(removedSet)));
        }

        // Add to saved accounts list
        const savedRaw = localStorage.getItem('sonora_google_accounts');
        const list: QuickAccount[] = savedRaw ? JSON.parse(savedRaw) : [...accounts];
        const existingIdx = list.findIndex((a) => a.email.toLowerCase().trim() === cleanEmail);
        const newEntry: QuickAccount = {
          name: data.user?.name || account.name,
          email: account.email,
          username: account.username || account.email.split('@')[0],
          avatar: account.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(account.name)}`,
          isRecent: true
        };

        if (existingIdx >= 0) {
          list[existingIdx] = newEntry;
        } else {
          list.push(newEntry);
        }

        localStorage.setItem('sonora_google_accounts', JSON.stringify(list));
      }

      // Directly enter the music player app without verify or reload loop
      window.location.assign('/');
    } catch (err: any) {
      console.error('SSO sign-in error:', err);
      toast.error(err.message || 'Unable to sign in. Please try again.');
      setIsSubmitting(false);
      setSelectedAccountEmail(null);
    }
  };

  const handleConfirmRemove = async (account: QuickAccount) => {
    try {
      setIsSubmitting(true);
      const cleanEmail = account.email.toLowerCase().trim();

      // 1. Remove from active state
      const updated = accounts.filter((a) => a.email.toLowerCase().trim() !== cleanEmail);
      setAccounts(updated);

      if (typeof window !== 'undefined') {
        // 2. Persist updated account list
        localStorage.setItem('sonora_google_accounts', JSON.stringify(updated));

        // 3. Add to persistent blacklist so it never auto-reappears on refresh or restart
        const removedRaw = localStorage.getItem('sonora_removed_google_accounts');
        const removedSet = new Set<string>(removedRaw ? JSON.parse(removedRaw) : []);
        removedSet.add(cleanEmail);
        localStorage.setItem('sonora_removed_google_accounts', JSON.stringify(Array.from(removedSet)));

        // 4. Clear active stored login session and credentials if this account was logged in
        const currentSavedIdentifier = (localStorage.getItem('sonora_saved_identifier') || '').toLowerCase().trim();
        if (currentSavedIdentifier === cleanEmail) {
          localStorage.removeItem('sonora_logged_in');
          localStorage.removeItem('sonora_saved_identifier');
          localStorage.removeItem('sonora_user_name');
          sessionStorage.clear();
          // Clear backend authentication cookie
          fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
        }
      }

      toast.success(`Removed account ${account.name}`, account.email);
      setAccountToRemove(null);
    } catch {
      toast.error('Failed to remove account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = customEmail.trim().toLowerCase();
    const cleanName = customName.trim();

    if (!cleanEmail) {
      toast.error(provider === 'google' ? 'Please enter your Gmail address' : 'Please enter your Facebook account name or email');
      return;
    }

    const emailToUse = cleanEmail.includes('@')
      ? cleanEmail
      : `${cleanEmail.replace(/[^a-z0-9_]/g, '')}@${provider === 'facebook' ? 'facebook.com' : 'gmail.com'}`;

    handleSignInWithAccount({
      email: emailToUse,
      name: cleanName || cleanEmail.split('@')[0],
      username: cleanEmail.split('@')[0]
    });
  };

  const isGoogle = provider === 'google';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting && !accountToRemove) onClose();
      }}
    >
      <div className="w-full max-w-[430px] bg-[#121214] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/95 relative space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-150 overflow-hidden">
        {/* Remove Account Confirmation Overlay */}
        {accountToRemove && (
          <div className="absolute inset-0 z-30 bg-[#121214]/98 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mb-3 shadow-lg shadow-red-500/10">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Remove account?
            </h4>

            <div className="my-3 p-3 rounded-xl bg-neutral-900 border border-white/10 w-full max-w-[320px] flex items-center gap-3 text-left shadow-inner">
              <img
                src={accountToRemove.avatar}
                alt={accountToRemove.name}
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10"
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-white truncate">{accountToRemove.name}</p>
                <p className="text-[11px] text-neutral-400 truncate">{accountToRemove.email}</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 max-w-[320px] leading-relaxed mb-5">
              This account and its stored session will be removed from this browser. You will need to sign in again to use it.
            </p>

            <div className="flex items-center gap-2.5 w-full max-w-[320px]">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setAccountToRemove(null)}
                className="flex-1 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleConfirmRemove(accountToRemove)}
                className="flex-1 h-9 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Remove</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          type="button"
          disabled={isSubmitting || Boolean(accountToRemove)}
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center pt-1">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg mb-3">
            {isGoogle ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {isGoogle ? 'Sign in with Google' : 'Sign in with Facebook'}
          </h3>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
            {isGoogle
              ? 'Choose an account to continue straight to SONORA'
              : 'Continue to SONORA directly with your Facebook profile'}
          </p>
        </div>

        {/* Google Preset / Saved Accounts */}
        {isGoogle && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Select Google Account
              </span>
              {accounts.length > 0 && (
                <span className="text-[10px] text-neutral-500 font-medium">
                  {accounts.length} saved
                </span>
              )}
            </div>

            {accounts.length === 0 ? (
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/5 text-center space-y-1">
                <p className="text-xs text-neutral-300 font-medium">No saved Google accounts</p>
                <p className="text-[11px] text-neutral-500">Sign in below to add your account.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {accounts.map((acc) => {
                  const isCurrent = selectedAccountEmail === acc.email && isSubmitting;
                  return (
                    <div
                      key={acc.email}
                      className="group relative w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800/90 border border-white/5 hover:border-white/15 transition-all"
                    >
                      {/* Clickable main account area */}
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSignInWithAccount(acc)}
                        className="flex-1 flex items-center gap-3 min-w-0 text-left cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={acc.avatar} alt={acc.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs sm:text-sm font-semibold text-white truncate">{acc.name}</p>
                            {acc.isRecent && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium shrink-0">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate">{acc.email}</p>
                        </div>
                      </button>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {/* Remove Account Button */}
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAccountToRemove(acc);
                          }}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title={`Remove ${acc.name} from saved accounts`}
                          aria-label={`Remove ${acc.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Sign in Chevron */}
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleSignInWithAccount(acc)}
                          className="p-1 rounded-lg text-neutral-500 group-hover:text-white transition-colors cursor-pointer"
                          aria-label="Continue with this account"
                        >
                          {isCurrent ? (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Facebook 1-Click Profile Option */}
        {!isGoogle && (
          <div className="space-y-3">
            <div className="p-3 sm:p-4 rounded-xl bg-neutral-900/80 border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/30 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-white">Denzen Milson</p>
                  <p className="text-[11px] text-neutral-400">denzenmilson90@facebook.com</p>
                </div>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  handleSignInWithAccount({
                    email: 'denzenmilson90@gmail.com',
                    name: 'Denzen Milson',
                    username: 'denzenmilson90',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DenzenMilson'
                  })
                }
                className="w-full h-10 sm:h-11 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-[#1877F2]/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>Continue as Denzen Milson</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Custom Account Input Toggle */}
        <div className="pt-1">
          {!showCustomInput ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowCustomInput(true)}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-white/10 hover:border-white/20 text-neutral-400 hover:text-white text-xs font-medium transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isGoogle ? 'Use another Google / Gmail account' : 'Use another Facebook account or name'}</span>
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-2.5 p-3 rounded-xl bg-neutral-900/60 border border-white/10 animate-in fade-in duration-150">
              <span className="block text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                {isGoogle ? 'Enter Gmail / Google Account' : 'Enter Facebook Account'}
              </span>

              <input
                type="text"
                placeholder="Full Name (optional)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full h-9 bg-neutral-900 border border-white/10 rounded-lg px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />

              <input
                type="text"
                required
                autoCapitalize="none"
                placeholder={isGoogle ? 'yourname@gmail.com' : 'Facebook name or email'}
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full h-9 bg-neutral-900 border border-white/10 rounded-lg px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="w-1/3 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-8 rounded-lg bg-blue-500 hover:bg-blue-400 text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Continue'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Native Clerk OAuth Fallback Link (Google only) */}
        {isGoogle && onClerkOAuth && (
          <div className="pt-1 text-center">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                onClose();
                onClerkOAuth();
              }}
              className="text-[11px] text-neutral-500 hover:text-neutral-300 underline underline-offset-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Or launch browser Google OAuth redirect
            </button>
          </div>
        )}

        <div className="pt-1 border-t border-white/5 text-center">
          <p className="text-[10px] text-neutral-500">
            Zero verification needed • Instant access to your music library
          </p>
        </div>
      </div>
    </div>
  );
}
