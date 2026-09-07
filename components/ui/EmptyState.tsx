import React from 'react';
import { LucideIcon, Music } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Music,
  title,
  description,
  actionText,
  actionHref,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-emerald-400 mb-4 shadow-xl shadow-black/40">
        <Icon className="w-8 h-8 opacity-80" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-neutral-400 mb-6 leading-relaxed">{description}</p>
      {actionText && (
        actionHref ? (
          <Link
            href={actionHref}
            className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};
