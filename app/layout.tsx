import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { AuthProvider } from '@/context/AuthContext';
import { AudioProvider } from '@/context/AudioContext';
import { ToastProvider } from '@/context/ToastContext';
import { AutoMusicSync } from '@/components/common/AutoMusicSync';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { PersistentPlayer } from '@/components/player/PersistentPlayer';
import { ConsoleFilter } from '@/components/common/ConsoleFilter';

export const metadata: Metadata = {
  title: 'SONORA — Your Music. Your Moment.',
  description: 'A modern, responsive, full-stack music streaming and content management platform.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased dark"
    >
      <head />
      <body
        suppressHydrationWarning
        className="min-h-full bg-black text-white flex flex-col font-sans overflow-hidden"
      >
        <ConsoleFilter />
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          appearance={{
            theme: dark,
            options: {
              logoPlacement: 'none',
            },
            variables: {
              colorPrimary: '#2563EB',
              colorBackground: '#141414',
              colorForeground: '#ffffff',
              borderRadius: '0.875rem',
            },
            elements: {
              footer: 'hidden',
              footerAction: 'hidden',
              badge: 'hidden',
              card: 'bg-[#141414] border border-white/10 rounded-3xl shadow-2xl shadow-black/80',
            }
          }}
        >
          <AuthProvider>
            <ToastProvider>
              <AutoMusicSync />
              <AudioProvider>
                {/* Spotify-Style Shell: sidebar + main panels with adaptive black canvas gaps */}
                <div className="flex h-screen w-screen overflow-hidden p-1 sm:p-2 gap-1 sm:gap-2">
                  {/* Desktop/Tablet Sidebar – fixed-width, rounded panel */}
                  <Sidebar />

                  {/* Main Content Area – rounded panel, fills remaining space */}
                  <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#121212] rounded-lg sm:rounded-xl">
                    <Header />
                    <main className="flex-1 overflow-y-auto pb-36 md:pb-24 px-3 sm:px-6 md:px-8 py-4 sm:py-6">
                      {children}
                    </main>
                  </div>
                </div>

                {/* Persistent Bottom Music Player – sits above everything */}
                <PersistentPlayer />

                {/* Mobile Navigation */}
                <MobileNav />
              </AudioProvider>
            </ToastProvider>
          </AuthProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
