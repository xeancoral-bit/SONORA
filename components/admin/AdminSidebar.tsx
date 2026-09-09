'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Music,
  PlusCircle,
  Disc,
  Users,
  Layers,
  UserCheck,
  Bell,
  FileText,
  Settings,
  ArrowLeft,
  ShieldAlert,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';
import { SonoraLogo } from '../layout/SonoraLogo';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Support Messages', href: '/admin/messages', icon: MessageSquare, badge: true },
    { name: 'Music Catalog', href: '/admin/music', icon: Music },
    { name: '+ Add Music', href: '/admin/music/add', icon: PlusCircle, highlight: true },
    { name: 'Albums', href: '/admin/albums', icon: Disc },
    { name: 'Artists', href: '/admin/artists', icon: Users },
    { name: 'Genres & Categories', href: '/admin/genres', icon: Layers },
    { name: 'Users Moderation', href: '/admin/users', icon: UserCheck },
    { name: 'Notifications Center', href: '/admin/notifications', icon: Bell },
    { name: 'Activity Audit Logs', href: '/admin/logs', icon: FileText },
    { name: 'Platform Settings', href: '/admin/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Top Bar for Admin Navigation */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0D0D0D] border-b border-white/10 w-full shrink-0">
        <div className="flex items-center gap-2">
          <SonoraLogo size="sm" />
          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase">
            Admin
          </span>
        </div>
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
          aria-label="Toggle admin navigation menu"
        >
          {isOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:relative top-0 bottom-0 left-0 z-50 md:z-auto
          w-64 bg-[#0D0D0D] border-r border-white/5 flex flex-col justify-between shrink-0 select-none
          transition-transform duration-300 ease-in-out
          ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-5 border-b border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <SonoraLogo size="sm" />
            <button
              onClick={() => setIsOpenMobile(false)}
              className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold tracking-wider uppercase mt-1 w-fit">
            <ShieldAlert className="w-3.5 h-3.5" />
            Admin Console
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpenMobile(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold shadow-sm'
                    : item.highlight
                    ? 'text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-amber-400' : ''}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Return to App link */}
        <div className="p-3 border-t border-white/5">
          <Link
            href="/"
            onClick={() => setIsOpenMobile(false)}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-emerald-500/40 text-xs font-semibold text-neutral-300 hover:text-white transition-colors w-full"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            Back to User Streaming
          </Link>
        </div>
      </aside>
    </>
  );
};
