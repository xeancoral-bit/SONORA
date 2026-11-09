'use client';

import React, { useEffect, useRef } from 'react';
import { AuthenticateWithRedirectCallback, useUser } from '@clerk/nextjs';
import { SonoraLogo } from '@/components/layout/SonoraLogo';
import { Loader2 } from 'lucide-react';

export default function SSOCallback() {
  const { user, isLoaded } = useUser();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    const email = user.primaryEmailAddress?.emailAddress;
    if (email) {
      fetch('/api/auth/sso-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: user.fullName || user.firstName || email.split('@')[0],
          username: user.username || email.split('@')[0],
          avatar: user.imageUrl,
          clerkId: user.id
        })
      }).finally(() => {
        window.location.href = '/';
      });
    } else {
      window.location.href = '/';
    }
  }, [isLoaded, user]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Clerk Native Callback Handler - redirects directly to root */}
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/"
        signUpForceRedirectUrl="/"
        continueSignUpUrl="/"
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
      />

      <div className="flex flex-col items-center text-center space-y-3 max-w-sm">
        <SonoraLogo size="lg" />
        <div className="flex items-center gap-2.5 text-blue-400 mt-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs font-medium text-neutral-400">Opening your account...</span>
        </div>
      </div>
    </div>
  );
}
