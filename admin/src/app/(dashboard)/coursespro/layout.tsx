'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Square3Stack3DIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  CreditCardIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function CoursesProAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Tenant Manager', href: '/coursespro/tenants', icon: BuildingOfficeIcon },
  ];

  return (
    <div className="w-full flex flex-col min-h-full">
      {/* Admin Dashboard Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6 mt-1 sm:mt-2 px-1 sm:px-4 md:px-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Admin & Super Admin Console</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage journeys, cohorts, mentors, and platform settings.</p>
        </div>
      </div>

      {/* Horizontal Sub-navigation */}
      <div className="px-1 sm:px-4 md:px-8 mb-4 sm:mb-6">
        <div className="flex space-x-2 border-b border-gray-100 overflow-x-auto pb-px scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'border-[#146ef5] text-[#146ef5] font-bold' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 stroke-2" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Page Content */}
      <div className="px-1 sm:px-4 md:px-8 pb-8 flex-1">
        {children}
      </div>
    </div>
  );
}
