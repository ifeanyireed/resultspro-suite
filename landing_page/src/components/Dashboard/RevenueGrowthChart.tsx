'use client';

import React from 'react';

interface RevenueGrowthChartProps {
  title?: string;
  data: {
    height: string;
    type: 'stripe' | 'solid-dark' | 'solid-light';
    tooltip?: string;
    label: string;
  }[];
}

export default function RevenueGrowthChart({ title = 'Revenue Growth', data }: RevenueGrowthChartProps) {
  return (
    <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col min-h-[350px]">
      <h3 className="text-xl font-normal text-gray-900 mb-6">{title}</h3>
      <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-2">
        {data.map((bar, i) => (
          <div key={i} className="w-[12%] flex flex-col items-center gap-3">
            <div className="w-full relative flex items-end h-[220px]">
              {bar.tooltip && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white shadow-sm text-xs font-bold px-2 py-1 rounded">
                  {bar.tooltip}
                </div>
              )}
              <div 
                className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                  bar.type === 'solid-dark' ? 'bg-[#146ef5]' : 
                  bar.type === 'solid-light' ? 'bg-[#6ba0f5]' : 
                  'bg-gray-200'
                }`}
                style={{ 
                  height: bar.height,
                  backgroundImage: bar.type === 'stripe' ? 'repeating-linear-gradient(45deg, transparent, transparent 5px, #d1d5db 5px, #d1d5db 7px)' : 'none'
                }}
              ></div>
            </div>
            <span className="text-xs font-medium text-gray-400">
              {bar.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
