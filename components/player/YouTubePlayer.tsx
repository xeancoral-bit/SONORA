'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { Youtube } from '@/components/ui/icons';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  artistName?: string;
  coverImage?: string;
  isPlaying: boolean;
  onPlayStateChange?: (playing: boolean) => void;
  className?: string;
}

/**
 * SONORA YouTube Player Component
 * Uses the official YouTube IFrame Player API for authorized embedded playback.
 * Does NOT rip, download, or extract audio — simply embeds the official YouTube player.
 */
export function YouTubePlayer({
  videoId,
  title,
  artistName,
  coverImage,
  isPlaying,
  onPlayStateChange,
  className = '',
}: YouTubePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Show/hide the iframe player
  useEffect(() => {
    setIsVisible(isPlaying);
  }, [isPlaying]);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&rel=0&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;

  return (
    <div className={`relative ${className}`}>
      {isVisible ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={title || 'YouTube Music Player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
          {/* YouTube attribution */}
          <div className="absolute bottom-2 right-2 z-10">
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 text-white text-[10px] hover:bg-black transition-colors"
            >
              <Youtube className="w-3 h-3 text-red-500" />
              Watch on YouTube
            </a>
          </div>
        </div>
      ) : (
        /* Thumbnail placeholder when not playing */
        <div
          className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-900 shadow-xl cursor-pointer group"
          onClick={() => onPlayStateChange?.(true)}
        >
          <img
            src={coverImage || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={title || 'Track'}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Youtube className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80">
            <p className="text-white text-xs font-semibold truncate">{title}</p>
            <p className="text-neutral-300 text-[10px] truncate">{artistName}</p>
          </div>
        </div>
      )}

      {/* Open on YouTube link */}
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 mt-2 text-[11px] text-neutral-400 hover:text-red-400 transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        Open on YouTube
      </a>
    </div>
  );
}

/**
 * Compact YouTube source badge for use in the persistent player bar
 */
export function YouTubeSourceBadge({ videoId }: { videoId: string }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-semibold hover:bg-red-500/20 transition-colors"
      title="View on YouTube"
    >
      <Youtube className="w-2.5 h-2.5" />
      YouTube
    </a>
  );
}
