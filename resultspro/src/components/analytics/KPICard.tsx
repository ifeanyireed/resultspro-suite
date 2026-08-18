// KPI Card Component
import React from 'react';
import { TrendingUp, TrendingDown } from '@/lib/hugeicons-compat';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'red';
  subtext?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  icon,
  trend,
  color = 'blue',
  subtext,
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
  };

  return (
    <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-[rgba(255,255,255,0.04)] transition">
      <div className="flex items-center gap-2 mb-2">
        <div className={colorClasses[color]}>
          {icon}
        </div>
        <p className="text-gray-400 text-xs uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {trend >= 0 ? (
            <>
              <TrendingUp className="w-3 h-3 text-green-400" />
              <p className="text-green-400 text-xs">+{trend.toFixed(1)}%</p>
            </>
          ) : (
            <>
              <TrendingDown className="w-3 h-3 text-red-400" />
              <p className="text-red-400 text-xs">{trend.toFixed(1)}%</p>
            </>
          )}
        </div>
      )}
      {subtext && <p className="text-gray-500 text-xs mt-2">{subtext}</p>}
    </div>
  );
};
