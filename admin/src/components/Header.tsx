'use client';

import React from 'react';
import { Search, Bell, Activity, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-4">
        {/* Microservices Live Health Badge */}
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <Activity className="w-3.5 h-3.5" />
          <span>5/5 Microservices Healthy</span>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search schools, users, cards..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        {/* SuperAdmin Authority Badge */}
        <div className="flex items-center space-x-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Master Admin</span>
        </div>
      </div>
    </header>
  );
}
