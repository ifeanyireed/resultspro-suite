// Risk Level Badge Component
import React from 'react';
import { AlertTriangle, AlertCircle, Info } from '@/lib/hugeicons-compat';

interface RiskLevelBadgeProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score?: number;
}

export const RiskLevelBadge: React.FC<RiskLevelBadgeProps> = ({ level, score }) => {
  const colorMap: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    LOW: {
      bg: 'bg-green-500/10 border-green-500/20',
      text: 'text-green-400',
      icon: <Info className="w-3 h-3" />,
    },
    MEDIUM: {
      bg: 'bg-amber-500/10 border-amber-500/20',
      text: 'text-amber-400',
      icon: <AlertCircle className="w-3 h-3" />,
    },
    HIGH: {
      bg: 'bg-orange-500/10 border-orange-500/20',
      text: 'text-orange-400',
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    CRITICAL: {
      bg: 'bg-red-500/10 border-red-500/20',
      text: 'text-red-400',
      icon: <AlertTriangle className="w-3 h-3" />,
    },
  };

  const style = colorMap[level];

  return (
    <div className={`${style.bg} border rounded-full px-3 py-1 inline-flex items-center gap-2`}>
      <div className={style.text}>{style.icon}</div>
      <span className={`${style.text} text-xs font-medium`}>
        {level}{score !== undefined && ` (${score})`}
      </span>
    </div>
  );
};

// Performance Tier Progress Bar
interface PerformanceBarProps {
  value?: number;
  maxValue?: number;
  percentage?: number;
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'red';
  showLabel?: boolean;
}

export const PerformanceBar: React.FC<PerformanceBarProps> = ({
  value,
  maxValue,
  percentage,
  color = 'blue',
  showLabel = true,
}) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };

  // Support both value/maxValue and percentage
  const perc = percentage !== undefined ? percentage : (value !== undefined && maxValue ? (value / maxValue) * 100 : 0);

  return (
    <div className="w-full">
      {showLabel && value !== undefined && maxValue !== undefined && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-300">{value}</span>
          <span className="text-xs text-gray-500">{maxValue}</span>
        </div>
      )}
      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
        <div
          className={`${colorMap[color]} h-full rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(perc, 100)}%` }}
        />
      </div>
    </div>
  );
};

// Distribution Gauge (Circular progress)
interface DistributionGaugeProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  showScale?: boolean;
}

export const DistributionGauge: React.FC<DistributionGaugeProps> = ({
  label,
  value,
  maxValue,
  color,
  showScale = false,
}) => {
  const percentage = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Format value: show 1 decimal if it's a float, otherwise whole number
  const displayValue = value % 1 === 0 ? value.toString() : value.toFixed(1);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-20 h-20 mb-2 flex items-center justify-center">
        {/* Background Track */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-white/5"
          />
          {/* Progress Ring */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center Content */}
        <div className="z-10 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white leading-none">
            {displayValue}
          </span>
          {showScale && (
            <span className="text-[8px] text-gray-500 mt-1">/ {maxValue}</span>
          )}
        </div>
      </div>
      {label && <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">{label}</p>}
      <p className="text-xs font-medium text-gray-300">{percentage.toFixed(0)}%</p>
    </div>
  );
};
