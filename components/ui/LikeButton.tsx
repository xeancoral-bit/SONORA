'use client';

import React, { useState, useCallback } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Professional Heart / Like button with a spring-pop animation on click,
 * glowing emerald fill state, and subtle ripple effect.
 */
export const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  onToggle,
  size = 'md',
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeMap = {
    sm: { icon: 'w-4 h-4', btn: 'w-8 h-8', ring: 'w-10 h-10' },
    md: { icon: 'w-5 h-5', btn: 'w-10 h-10', ring: 'w-12 h-12' },
    lg: { icon: 'w-6 h-6', btn: 'w-12 h-12', ring: 'w-14 h-14' }
  };
  const s = sizeMap[size];

  const handleClick = useCallback(() => {
    setIsAnimating(true);
    onToggle();
    // Reset animation flag after animation completes
    setTimeout(() => setIsAnimating(false), 500);
  }, [onToggle]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ripple / glow ring that shows on like */}
      {isLiked && (
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />
      )}

      <button
        onClick={handleClick}
        title={isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
        className={`
          relative z-10 ${s.btn} rounded-full flex items-center justify-center
          transition-all duration-200 cursor-pointer select-none
          ${isLiked
            ? 'bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 hover:border-emerald-500/50'
            : 'bg-transparent border border-transparent hover:bg-white/8 hover:border-white/15'
          }
          ${isAnimating ? 'animate-heart-pop' : ''}
          active:scale-90
        `}
        aria-label={isLiked ? 'Unlike' : 'Like'}
        aria-pressed={isLiked}
      >
        <Heart
          className={`
            ${s.icon} transition-all duration-200
            ${isLiked
              ? 'fill-emerald-400 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]'
              : 'text-neutral-400 hover:text-emerald-300'
            }
          `}
          strokeWidth={isLiked ? 0 : 1.75}
        />
      </button>
    </div>
  );
};
