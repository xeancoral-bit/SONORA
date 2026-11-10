'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  User,
  Shield,
  ExternalLink,
  Settings,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  Flame
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NotificationItem } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { getListeningStats } from '@/lib/streakService';
import { ListeningStreakModal } from '@/components/gamification/ListeningStreakModal';
import { SonoraLogo } from './SonoraLogo';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, isAdmin, switchRole, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [streakCount, setStreakCount] = useState<number>(1);
  const toast = useToast();

  useEffect(() => {
    // Initial streak load
    const current = getListeningStats();
    setStreakCount(current.currentStreak);

    // Real-time listener for streak updates
    const handleUpdate = (e: any) => {
      if (e.detail?.currentStreak !== undefined) {
        setStreakCount(e.detail.currentStreak);
      }
    };
    window.addEventListener('sonora_streak_updated', handleUpdate);
    return () => window.removeEventListener('sonora_streak_updated', handleUpdate);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadUserData() {
      if (!user) return;
      try {
        const [notifRes, supportRes] = await Promise.all([
          fetch('/api/notifications').then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch('/api/support/conversations').then((r) => (r.ok ? r.json() : null)).catch(() => null)
        ]);
        if (!isMounted) return;
        if (notifRes?.notifications) setNotifications(notifRes.notifications);
        if (supportRes) {
          if (user.role === 'admin' && supportRes.counts) {
            setUnreadMessages(supportRes.counts.new + supportRes.counts.waiting_admin);
          } else if (supportRes.conversation) {
            setUnreadMessages(supportRes.conversation.unreadCountUser || 0);
          }
        }
      } catch {
        // Safe catch
      }
    }
    loadUserData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PUT' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {}
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    toast.info('Logged out successfully');
    await logout();
  };

  if (pathname === '/auth/login' || pathname === '/auth/register') {
    return null;
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-2.5 xs:px-3 sm:px-6 py-2 sm:py-3 bg-[#121212]/95 backdrop-blur-xl border-b border-white/5 gap-2 sm:gap-4 w-full max-w-full overflow-hidden">
      {/* Left: Mobile Brand Mark / Desktop Spacer */}
      <div className="flex items-center min-w-0 shrink-0">
        <div className="md:hidden flex items-center">
          <SonoraLogo collapsed size="sm" />
        </div>
      </div>

      {/* Right: Notifications & Profile Menu / Auth Buttons */}
      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0 ml-auto">
        {/* Daily Listening Streak Pill */}
        <button
          onClick={() => setShowStreakModal(true)}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/10 hover:from-amber-500/25 hover:to-orange-500/20 border border-amber-500/30 text-amber-400 transition-all cursor-pointer group shadow-sm shadow-amber-500/10 shrink-0"
          title="Daily Listening Streak & Vinyl Club"
        >
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:scale-110 transition-transform animate-pulse shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold font-mono text-amber-300 whitespace-nowrap">
            {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
          </span>
        </button>

        {/* Support Messages Link */}
        {user && (
          <Link
            href={isAdmin ? '/admin/messages' : '/messages'}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-white/5 flex items-center justify-center text-neutral-300 hover:text-white transition-colors shrink-0"
            title={isAdmin ? 'Support Messages (Admin Console)' : 'Messages & Support'}
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-blue-500 text-[10px] font-bold text-black flex items-center justify-center shadow-lg shadow-blue-500/50">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </Link>
        )}

        {/* Notifications Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setShowNotifs((prev) => !prev);
              setShowProfileMenu(false);
            }}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-white/5 flex items-center justify-center text-neutral-300 hover:text-white transition-colors shrink-0"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-bold text-black flex items-center justify-center shadow-lg shadow-blue-500/50">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 top-11 z-50 w-80 max-w-[calc(100vw-24px)] bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-white/5 px-2">
                  <h4 className="font-bold text-sm text-white">Notifications</h4>
                  <span className="text-[11px] text-neutral-400">{unreadCount} unread</span>
                </div>

                <div className="flex flex-col gap-1.5 mt-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-500">
                      No notifications right now.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleMarkAsRead(notif.id)}
                        className={`p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                          notif.isRead
                            ? 'bg-neutral-900/40 border-transparent text-neutral-400'
                            : 'bg-blue-500/10 border-blue-500/20 text-neutral-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-semibold text-white">{notif.title}</h5>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="mt-1 text-neutral-400 leading-snug">{notif.message}</p>
                        {notif.link && (
                          <Link
                            href={notif.link}
                            onClick={() => setShowNotifs(false)}
                            className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:underline mt-2"
                          >
                            View details <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown / Login & Register Buttons */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu((prev) => !prev);
                setShowNotifs(false);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-[#1e1e1e] hover:bg-[#282828] border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
              title="Account Menu"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20 group-hover:ring-blue-400 transition-all"
              />
              <span className="text-xs font-semibold text-white hidden sm:block max-w-[90px] truncate">
                {user.name.split(' ')[0]}
              </span>
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 top-11 z-50 w-64 max-w-[calc(100vw-24px)] bg-[#282828] border border-white/10 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150 select-none">
                  {/* User Profile Card */}
                  <div className="p-3 bg-[#1e1e1e] rounded-xl border border-white/5 mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{user.name}</h4>
                        <p className="text-[11px] text-neutral-400 truncate">@{user.username}</p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                      <span className="text-neutral-400">Role</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        user.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Quick Role Switcher - Admin Only */}
                  {isAdmin && (
                    <div className="p-1.5 bg-[#1e1e1e] rounded-xl border border-white/5 mb-2 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-neutral-400 ml-2">Switch Demo Role</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            switchRole('user');
                            toast.info('Role set to User (Xean Santos)');
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                            user.role === 'user'
                              ? 'bg-blue-500 text-black shadow-md'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          User
                        </button>
                        <button
                          onClick={() => {
                            switchRole('admin');
                            toast.warning('Role set to Admin');
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                            user.role === 'admin'
                              ? 'bg-amber-500 text-black shadow-md'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Menu Options */}
                  <div className="space-y-0.5">
                    <Link
                      href="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <User className="w-4 h-4 text-neutral-400" />
                      Profile
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-neutral-400" />
                      Settings
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-amber-400 hover:bg-amber-500/10 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="my-1 border-t border-white/10" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
            <Link
              href="/auth/register"
              className="text-[11px] sm:text-xs font-bold text-neutral-400 hover:text-white transition-colors px-1.5 sm:px-3 py-1 sm:py-2 whitespace-nowrap"
            >
              Sign up
            </Link>
            <Link
              href="/auth/login"
              className="px-3 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white text-black font-bold text-[11px] sm:text-xs hover:scale-105 active:scale-95 transition-all shadow-md whitespace-nowrap shrink-0"
            >
              Log in
            </Link>
          </div>
        )}
      </div>

      {/* Listening Streak & Vinyl Badges Modal */}
      <ListeningStreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
      />
    </header>
  );
};
