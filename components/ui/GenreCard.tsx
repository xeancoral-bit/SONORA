'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Genre } from '@/lib/types';
import { Music2 } from 'lucide-react';

interface GenreCardProps {
  genre: Genre;
}

/* Built-in image map for the 4 featured genres */
const GENRE_IMAGES: Record<string, string> = {
  'genre-pop':        '/genres/genre-pop.jpg',
  'genre-electronic': '/genres/genre-electronic.jpg',
  'genre-chill':      '/genres/genre-lofi.jpg',
  'genre-rnb':        '/genres/genre-rnb.jpg',
  'genre-classical':  '/genres/genre-classical.jpg',
};

/* Accent glow colour per genre */
const GENRE_GLOW: Record<string, string> = {
  'genre-pop':        'rgba(236,72,153,0.55)',
  'genre-electronic': 'rgba(6,182,212,0.55)',
  'genre-chill':      'rgba(16,185,129,0.55)',
  'genre-rnb':        'rgba(139,92,246,0.55)',
  'genre-classical':  'rgba(168,162,158,0.50)',
};

export const GenreCard: React.FC<GenreCardProps> = ({ genre }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const coverImage = genre.coverImage || GENRE_IMAGES[genre.id] || null;
  const glowColor   = GENRE_GLOW[genre.id] || 'rgba(255,255,255,0.2)';

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);  // -1 … 1
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -7, y: dx * 7 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <Link
      ref={cardRef}
      href={`/genres/${genre.slug || genre.id}`}
      className="group relative overflow-hidden rounded-2xl aspect-[1.55/1] flex flex-col justify-end cursor-pointer select-none"
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hovered ? 'scale(1.04)' : 'scale(1)'}`,
        transition: hovered ? 'transform 0.12s ease-out' : 'transform 0.45s cubic-bezier(0.23,1,0.32,1)',
        boxShadow: hovered
          ? `0 20px 60px -10px ${glowColor}, 0 0 0 1px rgba(255,255,255,0.08)`
          : '0 8px 32px -8px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Background image ── */}
      {coverImage ? (
        <img
          src={coverImage}
          alt={genre.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: hovered ? 'scale(1.10)' : 'scale(1.03)',
            transition: 'transform 0.7s cubic-bezier(0.23,1,0.32,1)',
          }}
          draggable={false}
        />
      ) : (
        /* Fallback gradient when no image */
        <div className={`absolute inset-0 bg-gradient-to-br ${genre.color}`} />
      )}

      {/* ── Deep gradient overlay — always present ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to top,
            rgba(0,0,0,0.90) 0%,
            rgba(0,0,0,0.55) 45%,
            rgba(0,0,0,0.15) 75%,
            transparent 100%
          )`,
        }}
      />

      {/* ── Colour-tinted vignette matching genre accent ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 60% 80%, ${glowColor.replace('0.55)', '0.30)')} 0%, transparent 65%)`,
        }}
      />

      {/* ── Shimmer sweep on hover ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
          backgroundPosition: hovered ? '0% 0%' : '200% 0%',
          transition: 'background-position 0.6s ease',
        }}
      />

      {/* ── Top-right pill: song count ── */}
      {genre.songCount !== undefined && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white/80">
          <Music2 className="w-2.5 h-2.5" />
          {genre.songCount} {genre.songCount === 1 ? 'song' : 'songs'}
        </div>
      )}

      {/* ── Bottom text content ── */}
      <div className="relative z-10 p-4 flex flex-col gap-0.5">
        {/* Genre name */}
        <h3
          className="font-black text-xl md:text-2xl text-white leading-tight tracking-tight"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
        >
          {genre.name}
        </h3>

        {/* Description — slides up on hover */}
        {genre.description && (
          <p
            className="text-[11px] text-white/65 leading-snug font-medium overflow-hidden"
            style={{
              maxHeight: hovered ? '3rem' : '0',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(6px)',
              transition: 'max-height 0.35s ease, opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            {genre.description}
          </p>
        )}

        {/* Accent underline bar */}
        <div
          className="mt-1.5 h-[2px] rounded-full"
          style={{
            background: `linear-gradient(to right, ${glowColor.replace('0.55)', '0.9)')}, transparent)`,
            width: hovered ? '70%' : '30%',
            transition: 'width 0.4s cubic-bezier(0.23,1,0.32,1)',
          }}
        />
      </div>
    </Link>
  );
};
