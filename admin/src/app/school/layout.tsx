'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { LayoutDashboard, Users, BookOpen, GraduationCap, Building2, BarChart3, Settings } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/school' },
  { id: 'students', label: 'Students', icon: Users, href: '/school/students' },
  { id: 'teachers', label: 'Teachers', icon: Users, href: '/school/teachers' },
  { id: 'results', label: 'Results & Academics', icon: BookOpen, href: '/school/results' },
  { id: 'tutors', label: 'Tutors & Mentors', icon: GraduationCap, href: '/school/tutors' },
  { id: 'classes', label: 'Classes & Cohorts', icon: Building2, href: '/school/classes' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/school/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/school/settings' },
];

import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const schoolNavItems = tabs.map(t => ({
    label: t.label,
    mobileLabel: t.id === 'results' ? 'Results' : t.id === 'analytics' ? 'Analytics' : t.label,
    href: t.href,
    icon: t.icon as any,
    activeIcon: t.icon as any,
  }));

  return (
    <div className="w-full relative min-h-screen pb-20 md:pb-0">
      <Header
        title="School Command Center"
        subtitle="Unified administration panel for managing your school across the ecosystem"
      />

      <div className="px-2.5 sm:px-6 md:px-8 pt-2 sm:pt-4">
        <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-px scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 border-b-2 text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="px-2.5 sm:px-6 md:px-8 py-4 sm:py-6 pb-24 md:pb-6">
        {children}
      </div>

      {/* Mobile Horizontally Scrollable Bottom Nav */}
      <MobileBottomNav items={schoolNavItems} />
    </div>
  );
}
