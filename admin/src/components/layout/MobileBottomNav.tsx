'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Squares2X2Icon,
  UserGroupIcon,
  CreditCardIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  DocumentCheckIcon,
  SparklesIcon,
  BookOpenIcon,
  AcademicCapIcon,
  MapIcon,
  EnvelopeIcon,
  LifebuoyIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import {
  Squares2X2Icon as Squares2X2Solid,
  UserGroupIcon as UserGroupSolid,
  CreditCardIcon as CreditCardSolid,
  DocumentTextIcon as DocumentTextSolid,
  BriefcaseIcon as BriefcaseSolid,
  BuildingOfficeIcon as BuildingOfficeSolid,
  DocumentCheckIcon as DocumentCheckSolid,
  SparklesIcon as SparklesSolid,
  BookOpenIcon as BookOpenSolid,
  AcademicCapIcon as AcademicCapSolid,
  MapIcon as MapSolid,
  EnvelopeIcon as EnvelopeSolid,
  LifebuoyIcon as LifebuoySolid,
  Cog6ToothIcon as Cog6ToothSolid
} from '@heroicons/react/24/solid';

export interface NavItem {
  label: string;
  mobileLabel?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const DEFAULT_SUITE_NAV_ITEMS: NavItem[] = [
  { label: 'Suite Overview', mobileLabel: 'Overview', href: '/overview', icon: Squares2X2Icon, activeIcon: Squares2X2Solid },
  { label: 'Universal Users', mobileLabel: 'Users', href: '/users', icon: UserGroupIcon, activeIcon: UserGroupSolid },
  { label: 'Subscriptions & Plans', mobileLabel: 'Plans', href: '/subscriptions', icon: CreditCardIcon, activeIcon: CreditCardSolid },
  { label: 'Invoices & Billing', mobileLabel: 'Invoices', href: '/invoices', icon: DocumentTextIcon, activeIcon: DocumentTextSolid },
  { label: 'Agent Network', mobileLabel: 'Agents', href: '/agents', icon: BriefcaseIcon, activeIcon: BriefcaseSolid },
  { label: 'SchoolHUB (Tenants)', mobileLabel: 'SchoolHUB', href: '/schoolhub', icon: BuildingOfficeIcon, activeIcon: BuildingOfficeSolid },
  { label: 'ResultPRO', mobileLabel: 'ResultPRO', href: '/resultspro', icon: DocumentCheckIcon, activeIcon: DocumentCheckSolid },
  { label: 'ExamsPRO', mobileLabel: 'ExamsPRO', href: '/exampro', icon: SparklesIcon, activeIcon: SparklesSolid },
  { label: 'ClassroomPRO', mobileLabel: 'Classroom', href: '/classroompro', icon: BookOpenIcon, activeIcon: BookOpenSolid },
  { label: 'TutorsPRO', mobileLabel: 'Tutors', href: '/tutorspro', icon: AcademicCapIcon, activeIcon: AcademicCapSolid },
  { label: 'CoursesPRO', mobileLabel: 'Courses', href: '/coursespro', icon: MapIcon, activeIcon: MapSolid },
  { label: 'Suite Blog CMS', mobileLabel: 'Blog CMS', href: '/cms/blog', icon: DocumentTextIcon, activeIcon: DocumentTextSolid },
  { label: 'Email Broadcasts', mobileLabel: 'Emails', href: '/cms/emails', icon: EnvelopeIcon, activeIcon: EnvelopeSolid },
  { label: 'Support Desk', mobileLabel: 'Support', href: '/support', icon: LifebuoyIcon, activeIcon: LifebuoySolid },
  { label: 'Global Settings', mobileLabel: 'Settings', href: '/settings', icon: Cog6ToothIcon, activeIcon: Cog6ToothSolid },
];

export interface MobileBottomNavProps {
  items?: NavItem[];
}

export function MobileBottomNav({ items = DEFAULT_SUITE_NAV_ITEMS }: MobileBottomNavProps) {
  const pathname = usePathname();
  const mobileNavContainerRef = useRef<HTMLDivElement>(null);

  // Smoothly center active item on route change
  useEffect(() => {
    if (!mobileNavContainerRef.current) return;
    const activeEl = mobileNavContainerRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [pathname]);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-2xl pb-[max(0.35rem,env(safe-area-inset-bottom))]"
    >
      <div
        ref={mobileNavContainerRef}
        className="flex items-center gap-1.5 px-2 py-1.5 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {items.map((item, i) => {
          const isActive =
            item.href === '/overview'
              ? pathname === '/overview' || pathname === '/'
              : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          const IconComponent = isActive ? item.activeIcon : item.icon;
          const displayLabel = item.mobileLabel || item.label;

          return (
            <Link
              key={item.href || i}
              href={item.href}
              data-active={isActive ? 'true' : undefined}
              className={`shrink-0 flex flex-col items-center justify-center min-w-[62px] px-2 py-1 rounded-2xl transition-all select-none active:scale-95 group relative ${
                isActive ? 'text-[#146ef5]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {/* ICON ON TOP */}
              <div className="relative flex items-center justify-center">
                <span
                  className={`w-10 h-7 rounded-full flex items-center justify-center transition-all [&>svg]:w-5 [&>svg]:h-5 ${
                    isActive
                      ? 'bg-[#146ef5] text-white shadow-xs shadow-[#146ef5]/30'
                      : 'text-gray-500 group-hover:text-gray-900 group-hover:bg-gray-100/80'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </span>
                {item.badge && (
                  <span
                    className={`absolute -top-1 -right-2 text-[8px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-xs ${
                      isActive ? 'bg-rose-500 text-white' : 'bg-[#146ef5] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* NAME (LABEL) UNDER */}
              <span
                className={`text-[10px] font-medium leading-tight mt-1 text-center truncate max-w-[68px] transition-colors ${
                  isActive ? 'font-bold text-[#146ef5]' : 'text-gray-500 group-hover:text-gray-700'
                }`}
              >
                {displayLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
