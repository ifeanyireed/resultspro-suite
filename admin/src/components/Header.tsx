'use client';

import React from 'react';
import { IconSearch as Search, IconBell as Bell, IconActivity as Activity, IconShieldCheck as ShieldCheck } from '@tabler/icons-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle, children }: HeaderProps & { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-8 mt-1 sm:mt-2 px-1 sm:px-3">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-relaxed">{subtitle}</p>}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
