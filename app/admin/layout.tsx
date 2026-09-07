'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-sm text-neutral-400">
        Verifying administrator credentials...
      </div>
    );
  }

  // Permission Guard: Regular users cannot access admin dashboard
  if (!user || !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#141414] border border-rose-500/20 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">403 Forbidden</h2>
          <p className="text-xs text-neutral-300 leading-relaxed">
            You don&apos;t have permission to access the official Sonora Content Management Dashboard. Only authorized administrators can manage music files, albums, and system settings.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors"
            >
              Return to Streaming Home
            </Link>
            <Link
              href="/auth/login"
              className="w-full py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white font-semibold text-xs transition-colors"
            >
              Sign in with Admin Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row -mx-4 sm:-mx-6 md:-mx-8 -my-6 min-h-[calc(100vh-64px)] bg-[#0A0A0A]">
      <AdminSidebar />
      <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
