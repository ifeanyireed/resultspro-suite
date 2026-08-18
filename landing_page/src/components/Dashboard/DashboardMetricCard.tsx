'use client';

import React from 'react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

interface DashboardMetricCardProps {
  title: string;
  value: string | React.ReactNode;
  icon: React.ElementType;
  trendValue?: string;
  trendLabel?: string;
  isPrimary?: boolean;
  valueColorClass?: string;
  iconColorClass?: string;
  trendBgClass?: string;
  trendTextClass?: string;
}

export default function DashboardMetricCard({
  title,
  value,
  icon: Icon,
  trendValue,
  trendLabel,
  isPrimary = false,
  valueColorClass,
  iconColorClass,
  trendBgClass,
  trendTextClass
}: DashboardMetricCardProps) {
  if (isPrimary) {
    return (
      <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full filter blur-[3rem] opacity-20"></div>
        
        <div className="flex justify-between items-start z-10">
          <h3 className="text-xl font-normal text-white">{title}</h3>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-[#146ef5] transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="z-10">
          <h2 className={`text-5xl font-medium tracking-tight mb-2 ${valueColorClass || 'text-white'}`}>{value}</h2>
          {trendValue && (
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                <ArrowTrendingUpIcon className="w-3 h-3"/> {trendValue}
              </div>
              <span>{trendLabel}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-normal text-gray-900">{title}</h3>
        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-gray-900 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <h2 className={`text-5xl font-medium tracking-tight mb-2 ${valueColorClass || 'text-gray-900'}`}>{value}</h2>
        {(trendValue || trendLabel) && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            {trendValue ? (
              <div className={`${trendBgClass || 'bg-emerald-50'} ${trendTextClass || 'text-emerald-600'} px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1`}>
                {trendValue.startsWith('+') || trendValue.includes('%') ? <ArrowTrendingUpIcon className="w-3 h-3"/> : null} 
                {trendValue.replace('+', '')}
              </div>
            ) : null}
            <span className={!trendValue ? 'text-gray-400' : ''}>{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
