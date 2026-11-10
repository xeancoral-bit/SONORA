'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@/context/ToastContext';

export function AutoMusicSync() {
  const { info } = useToast();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const checkAutoUpload = async () => {
      try {
        const LAST_SYNC_KEY = 'sonora_last_auto_sync';
        const lastSync = localStorage.getItem(LAST_SYNC_KEY);
        const now = Date.now();
        // Check if last auto-sync was more than 15 minutes ago
        if (lastSync && now - parseInt(lastSync, 10) < 15 * 60 * 1000) {
          return;
        }

        const res = await fetch('/api/music/sync-latest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ auto: true }),
        });

        if (!res.ok) return;
        const data = await res.json();
        localStorage.setItem(LAST_SYNC_KEY, String(now));

        if (data.success && data.addedCount > 0 && Array.isArray(data.songs)) {
          // Notify listening components (e.g. Home page) to update without reload
          window.dispatchEvent(
            new CustomEvent('sonora:newsongs', {
              detail: { songs: data.songs },
            })
          );

          const artistPreview = data.songs
            .slice(0, 2)
            .map((s: { artistName: string }) => s.artistName)
            .join(', ');

          info(
            'New Music Automatically Uploaded! 🎵',
            `Added ${data.addedCount} new track${data.addedCount > 1 ? 's' : ''} from ${artistPreview}.`
          );
        }
      } catch {
        // Silently swallow background sync errors - zero user disruption
      }
    };

    // Delay 4 seconds after page load so browser hydration and main UI render first
    const timer = setTimeout(checkAutoUpload, 4000);

    // Periodic check every 20 minutes while app is open
    const interval = setInterval(checkAutoUpload, 20 * 60 * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [info]);

  return null;
}
