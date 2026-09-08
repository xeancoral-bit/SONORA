import React from 'react';

interface AuthBadgeProps {
  className?: string;
  showText?: boolean;
}

export const AuthBadge: React.FC<AuthBadgeProps> = ({ className = '', showText = true }) => {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Glowing Neon Equalizer Badge */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#090b0e] border border-emerald-500/40 p-2.5 shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center justify-center transition-transform hover:scale-105 duration-300">
        <div className="flex items-center justify-center gap-1 h-full">
          <span className="w-1 sm:w-1.5 h-4 bg-emerald-400 rounded-full" />
          <span className="w-1 sm:w-1.5 h-7 sm:h-8 bg-emerald-300 rounded-full" />
          <span className="w-1 sm:w-1.5 h-5 sm:h-6 bg-teal-300 rounded-full" />
          <span className="w-1 sm:w-1.5 h-3 sm:h-3.5 bg-emerald-400 rounded-full" />
        </div>
      </div>

      {showText && (
        <span className="mt-3 text-xs font-serif font-semibold tracking-[0.28em] text-emerald-400/90 uppercase">
          SONORA
        </span>
      )}
    </div>
  );
};
