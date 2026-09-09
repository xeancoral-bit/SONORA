'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Compass,
  Library,
  Disc,
  Users,
  Layers,
  Heart,
  Clock,
  ListMusic,
  FolderHeart,
  Plus,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Menu,
  MessageSquare
} from 'lucide-react';
import { SonoraLogo } from './SonoraLogo';
import { useAuth } from '@/context/AuthContext';
import { Playlist, UserCollection, Artist } from '@/lib/types';
import { CreatePlaylistModal } from '../ui/CreatePlaylistModal';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadUserData() {
      if (!user) return;
      try {
        const [plRes, colRes] = await Promise.all([
          fetch('/api/playlists').then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch('/api/collections').then((r) => (r.ok ? r.json() : null)).catch(() => null)
        ]);
        if (!isMounted) return;
        if (plRes?.playlists) {
          setPlaylists(plRes.playlists.filter((p: any) => p.userId === user.id));
        }
        if (colRes?.collections) {
          setCollections(colRes.collections);
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

  const mainNav = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Discover', href: '/browse', icon: Compass },
    { name: 'Messages', href: '/messages', icon: MessageSquare }
  ];

  const libraryNav = [
    { name: 'Albums', href: '/albums', icon: Disc },
    { name: 'Artists', href: '/artists', icon: Users },
    { name: 'Genres', href: '/genres', icon: Layers },
    { name: 'Liked Songs', href: '/liked', icon: Heart, accent: true },
    { name: 'History', href: '/history', icon: Clock }
  ];

  return (
    <>
      <aside
        className={`hidden md:flex flex-col bg-[#121212] rounded-xl select-none shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out ${
          collapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
      >
        {/* Logo & Hamburger Menu Collapse */}
        <div className={`flex items-center justify-between px-4 pt-5 pb-3 ${collapsed ? 'px-2 justify-center' : ''}`}>
          {!collapsed && <SonoraLogo collapsed={collapsed} size="sm" />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-4 px-2 pb-2">
          {/* Main Nav */}
          <nav className="flex flex-col gap-1">
            {mainNav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent text-emerald-400 font-bold shadow-sm shadow-emerald-500/10'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.06] hover:translate-x-1'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={item.name}
                >
                  {/* Active glowing indicator pill */}
                  {active && !collapsed && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse" />
                  )}
                  <Icon
                    className={`w-[18px] h-[18px] shrink-0 transition-all duration-200 ${
                      active
                        ? 'text-emerald-400 scale-110 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                        : 'text-neutral-400 group-hover:text-white group-hover:scale-110'
                    }`}
                  />
                  {!collapsed && <span className="truncate tracking-tight">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Admin Link */}
          {isAdmin && (
            <Link
              href="/admin"
              className={`group relative flex items-center gap-3 mx-0.5 px-3 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 ${
                pathname.startsWith('/admin')
                  ? 'bg-gradient-to-r from-amber-500/25 via-amber-500/10 to-transparent text-amber-400 border-l-2 border-amber-400 shadow-sm shadow-amber-500/10'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/15 hover:bg-amber-500/20 hover:translate-x-1'
              } ${collapsed ? 'justify-center px-0 mx-0' : ''}`}
              title="Admin Dashboard"
            >
              <ShieldAlert className="w-[18px] h-[18px] shrink-0 text-amber-400 group-hover:scale-110 transition-transform duration-200" />
              {!collapsed && <span className="truncate">Admin Console</span>}
            </Link>
          )}

          {/* Library Section */}
          <div className="flex flex-col gap-1">
            {!collapsed && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 px-3 mb-1">
                Library
              </span>
            )}
            {libraryNav.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent text-emerald-400 font-bold shadow-sm shadow-emerald-500/10'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.06] hover:translate-x-1'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={item.name}
                >
                  {/* Active glowing indicator pill */}
                  {active && !collapsed && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse" />
                  )}
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                      active
                        ? 'text-emerald-400 scale-110 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                        : item.accent
                        ? 'text-emerald-400/80 group-hover:text-emerald-400 group-hover:scale-110'
                        : 'text-neutral-400 group-hover:text-white group-hover:scale-110'
                    }`}
                  />
                  {!collapsed && <span className="truncate tracking-tight">{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {/* Playlists */}
          <div className="flex flex-col gap-1">
            {!collapsed && (
              <div className="flex items-center justify-between px-3 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Playlists
                </span>
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="text-neutral-500 hover:text-emerald-400 p-0.5 rounded transition-colors"
                  title="Create playlist"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {collapsed ? (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center justify-center p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
                title="Create Playlist"
              >
                <Plus className="w-[18px] h-[18px]" />
              </button>
            ) : (
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors w-full text-left"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Playlist
                </button>
                {playlists.slice(0, 5).map((pl) => {
                  const active = pathname === `/playlists/${pl.id}`;
                  return (
                    <Link
                      key={pl.id}
                      href={`/playlists/${pl.id}`}
                      className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12px] transition-all duration-150 truncate ${
                        active
                          ? 'text-emerald-400 font-bold bg-emerald-500/10 pl-4 border-l border-emerald-400'
                          : 'text-neutral-500 hover:text-white hover:bg-white/[0.05] hover:translate-x-0.5'
                      }`}
                    >
                      <ListMusic className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-emerald-400' : 'group-hover:text-emerald-400'}`} />
                      <span className="truncate">{pl.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Collections */}
          {!collapsed && collections.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 px-3 mb-1">
                Collections
              </span>
              {collections.slice(0, 4).map((col) => {
                const active = pathname === `/collections/${col.id}`;
                return (
                  <Link
                    key={col.id}
                    href={`/collections/${col.id}`}
                    className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12px] transition-all duration-150 truncate ${
                      active
                        ? 'text-purple-400 font-bold bg-purple-500/10 pl-4 border-l border-purple-400'
                        : 'text-neutral-500 hover:text-white hover:bg-white/[0.05] hover:translate-x-0.5'
                    }`}
                  >
                    <FolderHeart className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-purple-400' : 'text-purple-400/70 group-hover:text-purple-400'}`} />
                    <span className="truncate">{col.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      <CreatePlaylistModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(pl) => {
          setPlaylists((prev) => [pl, ...prev]);
        }}
      />
    </>
  );
};
