import React from 'react';

export function GradientMetricCard({ title, value, subtitle, trend, icon: Icon, gradientFrom = 'from-[#146ef5]', gradientTo = 'to-[#0a2e70]' }: any) {
  return (
    <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform`}>
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full filter blur-[3rem] opacity-20"></div>
      
      <div className="flex justify-between items-start z-10">
        <h3 className="text-xl font-normal text-white">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white transition-colors">
          {Icon && <Icon className="w-4 h-4 text-white group-hover:text-blue-500" />}
        </div>
      </div>
      <div className="z-10">
        <h2 className="text-5xl font-medium tracking-tight text-white mb-2">{value}</h2>
        <div className="flex items-center gap-1.5 text-xs text-white/80">
          {trend && (
            <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
              {trend}
            </div>
          )}
          <span>{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

export function WhiteMetricCard({ title, value, subtitle, trend, icon: Icon, trendColor = 'gray' }: any) {
  const trendBg = trendColor === 'green' ? 'bg-green-100 text-green-700' : 
                  trendColor === 'red' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-normal text-gray-900">{title}</h3>
        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 transition-colors">
          {Icon && <Icon className="w-4 h-4 group-hover:text-gray-900" />}
        </div>
      </div>
      <div className="z-10">
        <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{value}</h2>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          {trend && (
            <div className={`${trendBg} px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1`}>
              {trend}
            </div>
          )}
          <span>{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

export function WidgetCard({ title, subtitle, action, children, className = '' }: any) {
  return (
    <div className={`bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-normal text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {children}
      </div>
    </div>
  );
}
