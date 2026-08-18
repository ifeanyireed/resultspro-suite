'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  isPrimary?: boolean;
}

export default function StatCard({ title, value, subtitle, trend, trendUp = true, isPrimary = false }: StatCardProps) {
  return (
    <div className={`p-6 rounded-[24px] relative overflow-hidden transition-all ${
      isPrimary 
        ? 'bg-[#146ef5] text-white shadow-xl shadow-blue-500/20' 
        : 'bg-white border border-slate-100 text-slate-800 shadow-sm'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className={`font-bold ${isPrimary ? 'text-white/90' : 'text-slate-500'}`}>
          {title}
        </h3>
        <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isPrimary 
            ? 'bg-white/20 text-white hover:bg-white/30' 
            : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
        }`}>
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="mb-4">
        <span className="text-[2.5rem] font-extrabold leading-none tracking-tight block">
          {value}
        </span>
        {subtitle && (
          <span className={`text-sm mt-1 block ${isPrimary ? 'text-white/80' : 'text-slate-400'}`}>
            {subtitle}
          </span>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-2 mt-auto">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${
            isPrimary 
              ? 'bg-white/20 text-white' 
              : trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            <ArrowUpRight size={12} className={!trendUp ? 'rotate-90' : ''} />
            {trend}
          </div>
          <span className={`text-xs ${isPrimary ? 'text-white/70' : 'text-slate-400'}`}>
            from last month
          </span>
        </div>
      )}
      
      {/* Decorative shapes for primary card */}
      {isPrimary && (
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full border-4 border-white/10" />
      )}
    </div>
  );
}
