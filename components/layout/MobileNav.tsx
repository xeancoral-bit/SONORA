'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Library', href: '/liked', icon: Library },
    { name: 'Profile', href: '/profile', icon: User }
  ];

  if (isAdmin) {
    navItems.splice(3, 0, { name: 'Admin', href: '/admin', icon: ShieldAlert });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E0E]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              active ? 'text-emerald-400 font-bold scale-105' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
