'use client';

import React from 'react';
import { Flame, Zap, Bell, Search, Radio } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export function Navbar({ title, subtitle }: NavbarProps) {
  return (
    <header className="h-16 bg-surface border-b border-line px-8 flex items-center justify-between flex-shrink-0">
      <div>
        {title && <h2 className="text-base font-bold text-ink tracking-tight font-grotesk">{title}</h2>}
        {subtitle && <p className="text-xs text-ink-soft">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-5">
        {/* Presence Indicator */}
        <Link
          href="/classroom"
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-surface2 border border-line text-xs font-semibold text-ink-soft hover:border-signal/30 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-growth animate-pulse"></span>
          <Radio className="w-3.5 h-3.5 text-growth" />
          <span>14 Peers Online</span>
        </Link>

        {/* Streak Counter */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-ember-soft text-ember text-xs font-bold border border-ember/20">
          <Flame className="w-4 h-4 fill-ember text-ember animate-bounce" />
          <span>14 Day Streak</span>
        </div>

        {/* XP Points */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-signal-soft text-signal text-xs font-bold border border-signal/20">
          <Zap className="w-3.5 h-3.5 fill-signal text-signal" />
          <span>4,620 XP</span>
        </div>

        {/* User Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-line">
          <div className="w-8 h-8 rounded-full bg-signal text-white flex items-center justify-center font-bold text-xs">
            AR
          </div>
        </div>
      </div>
    </header>
  );
}
