import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface AdminStatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  color?: string; // e.g. text-emerald-400
}

export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  color = 'text-emerald-400'
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#141414] border border-white/5 hover:border-white/10 transition-all shadow-md flex items-center justify-between">
      <div>
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
          {title}
        </span>
        <h3 className="text-2xl font-black text-white font-mono">
          {typeof value === 'number' ? formatNumber(value) : value}
        </h3>
        {subtitle && (
          <span className="text-[11px] text-neutral-500 mt-1 block flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400 inline" />
            {subtitle}
          </span>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
