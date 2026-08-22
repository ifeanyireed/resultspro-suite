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

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <Header
        title="School Command Center"
        subtitle="Unified administration panel for managing your school across the ecosystem"
      />

      <div className="px-8 pt-4">
        <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-px">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-8">
        {children}
      </div>
    </div>
  );
}
