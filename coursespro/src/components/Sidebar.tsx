'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Layers,
  Kanban,
  Radio,
  Users2,
  GraduationCap,
  Trophy,
  Briefcase,
  Flame,
  BookOpen,
  LucideIcon,
} from 'lucide-react';

interface NavLinkItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  live?: boolean;
}

interface NavGroup {
  title: string;
  links: NavLinkItem[];
}

export function Sidebar() {
  const pathname = usePathname();

  const navGroups: NavGroup[] = [
    {
      title: 'LEARNING OS',
      links: [
        { label: 'Live Dashboard', href: '/dashboard', icon: Compass },
        { label: '7-Stage Journey', href: '/journey', icon: Layers, badge: 'Stage 02' },
        { label: 'Projects & Tasks', href: '/projects', icon: BookOpen },
        { label: 'Sprint Workspace', href: '/workspace', icon: Kanban },
      ],
    },
    {
      title: 'COMMUNITY & PRESENCE',
      links: [
        { label: 'Alive Classroom', href: '/classroom', icon: Radio, live: true },
        { label: 'Peer Directory', href: '/peers', icon: Users2 },
        { label: 'Mentor Console', href: '/mentor', icon: GraduationCap },
        { label: 'Cohort Leaderboard', href: '/leaderboard', icon: Trophy },
      ],
    },
    {
      title: 'CAREER & SHOWCASE',
      links: [
        { label: 'Public Portfolio', href: '/portfolio', icon: Briefcase },
        { label: 'Browse Cohorts', href: '/courses', icon: Layers },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-line flex flex-col flex-shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-line space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-signal to-signal-light flex items-center justify-center font-grotesk font-bold text-white text-base shadow-sm">
          C
        </div>
        <div>
          <h1 className="font-grotesk font-bold text-ink tracking-tight text-sm">CoursesPRO</h1>
          <p className="mono text-[10px] text-ink-faint uppercase tracking-wider">Cohort Operating System</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <span className="mono text-[10px] uppercase tracking-wider text-ink-faint px-3 mb-2 block font-semibold">
              {group.title}
            </span>
            <div className="space-y-1">
              {group.links.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-signal-soft text-signal font-semibold border-l-2 border-signal'
                        : 'text-ink-soft hover:bg-surface2 hover:text-ink'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-signal' : 'text-ink-faint'}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.live && (
                      <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-growth-soft text-growth text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-growth animate-pulse"></span>
                        <span>LIVE</span>
                      </span>
                    )}
                    {link.badge && (
                      <span className="mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-surface2 text-ink-soft border border-line">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Cohort Info Footer */}
      <div className="p-4 border-t border-line bg-surface2/50">
        <div className="flex items-center justify-between mb-1.5">
          <span className="mono text-[10px] font-bold text-ink-faint uppercase">Active Cohort</span>
          <span className="text-[10px] font-bold text-signal">Sprint 03 / 08</span>
        </div>
        <p className="text-xs font-bold text-ink truncate">Fullstack Systems Alpha 2026</p>
        <div className="mt-2 w-full bg-line rounded-full h-1.5 overflow-hidden">
          <div className="bg-signal h-1.5 rounded-full" style={{ width: '42%' }}></div>
        </div>
      </div>
    </aside>
  );
}
