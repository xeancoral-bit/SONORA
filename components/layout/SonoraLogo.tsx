import React from 'react';
import Link from 'next/link';

interface SonoraLogoProps {
  collapsed?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SonoraLogo: React.FC<SonoraLogoProps> = ({ collapsed = false, className = '', size = 'md' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <Link href="/" className={`flex items-center gap-3 group select-none transition-transform active:scale-95 ${className}`}>
      {/* Circular Soundwave Logo Mark */}
      <div className={`relative ${iconSizes[size]} rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-300 shrink-0`}>
        <div className="w-full h-full bg-[#08080a] rounded-full flex items-center justify-center gap-0.5 overflow-hidden">
          <span className="w-1 h-3.5 bg-blue-400 rounded-full group-hover:h-4 transition-all duration-300" />
          <span className="w-1 h-5 bg-blue-200 rounded-full group-hover:h-6 transition-all duration-300" />
          <span className="w-1 h-4 bg-blue-400 rounded-full group-hover:h-5 transition-all duration-300" />
          <span className="w-1 h-2.5 bg-blue-500 rounded-full group-hover:h-3.5 transition-all duration-300" />
        </div>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`${textSizes[size]} font-extrabold tracking-wider bg-gradient-to-r from-white via-neutral-100 to-blue-400 bg-clip-text text-transparent`}>
              SONORA
            </span>
          </div>
          <span className="text-[10px] font-medium text-neutral-400 tracking-tight leading-none">
            Your Music. Your Moment.
          </span>
        </div>
      )}
    </Link>
  );
};
