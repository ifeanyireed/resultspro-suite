'use client';

import React from 'react';
import { IconSearch as Search, IconBell as Bell, IconActivity as Activity, IconShieldCheck as ShieldCheck } from '@tabler/icons-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle, children }: HeaderProps & { children?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-8 mt-2 px-3">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
