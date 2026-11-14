'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AcademicCapIcon,
  UserGroupIcon,
  UsersIcon,
  BanknotesIcon,
  BookOpenIcon,
  ArchiveBoxIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  HomeModernIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import { MotionRise } from '@/components/ScrollRiseProvider';
import { CampusOSProvider, type CampusOSTab } from './components';

export default function CampusOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [selectedCampus, setSelectedCampus] = useState('All Campuses (Multi-Campus)');
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const scrollHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrollMetrics, setScrollMetrics] = useState({ thumbWidth: 100, thumbLeft: 0, hasOverflow: false });
  const [isScrollActive, setIsScrollActive] = useState(false);

  const tabs: { id: CampusOSTab; label: string; icon: any; badge?: string; href: string }[] = [
    { id: 'academic', label: 'Academic', icon: AcademicCapIcon, badge: 'Timetable', href: '/admin/campus-os/academic' },
    { id: 'staff', label: 'Staff', icon: UserGroupIcon, badge: 'HR & KPIs', href: '/admin/campus-os/staff' },
    { id: 'students', label: 'Students', icon: UsersIcon, badge: '1,248', href: '/admin/campus-os/students' },
    { id: 'parents', label: 'Parents', icon: HeartIcon, badge: '892', href: '/admin/campus-os/parents' },
    { id: 'financials', label: 'Financials', icon: BanknotesIcon, badge: 'Bursary', href: '/admin/campus-os/financials' },
    { id: 'library', label: 'Library', icon: BookOpenIcon, badge: 'Catalog', href: '/admin/campus-os/library' },
    { id: 'inventory', label: 'Inventory', icon: ArchiveBoxIcon, badge: 'Store', href: '/admin/campus-os/inventory' },
    { id: 'transportation', label: 'Transportation', icon: TruckIcon, badge: 'Fleet', href: '/admin/campus-os/transportation' },
    { id: 'admission', label: 'Admission', icon: ClipboardDocumentCheckIcon, badge: 'Pipeline', href: '/admin/campus-os/admission' },
    { id: 'messaging', label: 'Messaging', icon: ChatBubbleLeftRightIcon, badge: 'Broadcast', href: '/admin/campus-os/messaging' },
    { id: 'mobile-app', label: 'Mobile App', icon: DevicePhoneMobileIcon, badge: 'App IDs', href: '/admin/campus-os/mobile-app' },
  ];

  // Active tab determination based on current route path
  const activeTab: CampusOSTab =
    tabs.find((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`))?.id ||
    'academic';

  const triggerScrollbarActivity = useCallback(() => {
    setIsScrollActive(true);
    if (scrollHideTimerRef.current) {
      clearTimeout(scrollHideTimerRef.current);
    }
    scrollHideTimerRef.current = setTimeout(() => {
      setIsScrollActive(false);
    }, 1000);
  }, []);

  const updateScrollMetrics = useCallback(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollWidth <= clientWidth + 1) {
      setScrollMetrics({ thumbWidth: 100, thumbLeft: 0, hasOverflow: false });
      return;
    }
    const widthPct = Math.max((clientWidth / scrollWidth) * 100, 15);
    const maxScroll = scrollWidth - clientWidth;
    const leftPct = maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - widthPct) : 0;
    setScrollMetrics({ thumbWidth: widthPct, thumbLeft: leftPct, hasOverflow: true });
  }, []);

  const handleTabsScroll = useCallback(() => {
    updateScrollMetrics();
    triggerScrollbarActivity();
  }, [updateScrollMetrics, triggerScrollbarActivity]);

  useEffect(() => {
    updateScrollMetrics();
    window.addEventListener('resize', updateScrollMetrics);
    return () => {
      window.removeEventListener('resize', updateScrollMetrics);
      if (scrollHideTimerRef.current) clearTimeout(scrollHideTimerRef.current);
    };
  }, [updateScrollMetrics]);

  return (
    <CampusOSProvider value={{ selectedCampus, setSelectedCampus }}>
      <div className="min-w-0 w-full max-w-full">
        {/* CampusPRO Module Header */}
        <MotionRise className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2 mb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CampusPRO</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold uppercase tracking-wider border border-blue-200/80">
                <HomeModernIcon className="w-3.5 h-3.5" /> Multi-Campus ERP
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Centralized institutional command across Academic, Staff, Students, Parents, Financials, Library, Inventory, Transportation, Admission, and Messaging.
            </p>
          </div>

          {/* Multi-Campus Selector */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm self-start sm:self-auto">
            <HomeModernIcon className="w-4 h-4 text-[#146ef5] shrink-0" />
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="text-xs font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option>All Campuses (Multi-Campus)</option>
              <option>Main Campus · Lekki Phase 1</option>
              <option>Annex Campus · Ikeja GRA</option>
              <option>Victoria Island Junior Campus</option>
              <option>Abuja Maitama Campus</option>
            </select>
          </div>
        </MotionRise>

        {/* Horizontal Subtabs Bar — Sticky Outer Pill Container with Auto-Hiding 2px Scrollbar Underneath */}
        <div
          onMouseEnter={triggerScrollbarActivity}
          onMouseMove={triggerScrollbarActivity}
          onTouchStart={triggerScrollbarActivity}
          className="sticky top-24 z-20 w-full min-w-0 max-w-full"
        >
          <div className="w-full min-w-0 max-w-full bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-gray-200/80 overflow-hidden">
            <div className="w-full rounded-full overflow-hidden [clip-path:inset(0_round_9999px)]">
              <div
                ref={tabsScrollRef}
                onScroll={handleTabsScroll}
                className="w-full flex items-center gap-1.5 overflow-x-auto rounded-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#146ef5] text-white shadow-sm shadow-[#146ef5]/25'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2px Auto-Hiding Scrollbar Positioned Just Under the Toggle Container */}
          <div
            onClick={(e) => {
              const el = tabsScrollRef.current;
              if (!el) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const clickRatio = (e.clientX - rect.left) / rect.width;
              el.scrollTo({ left: clickRatio * (el.scrollWidth - el.clientWidth), behavior: 'smooth' });
              triggerScrollbarActivity();
            }}
            className={`mt-1 mx-6 h-[2px] bg-gray-200/80 rounded-full relative overflow-hidden cursor-pointer transition-opacity duration-300 ${
              isScrollActive && scrollMetrics.hasOverflow
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              className="absolute top-0 bottom-0 h-[2px] bg-gray-400 hover:bg-[#146ef5] rounded-full transition-all duration-75"
              style={{
                width: `${scrollMetrics.thumbWidth}%`,
                left: `${scrollMetrics.thumbLeft}%`,
              }}
            />
          </div>
        </div>

        {/* Active CampusOS Subtab Content */}
        <MotionRise delay={0.06} className="mt-[4px]">
          {children}
        </MotionRise>
      </div>
    </CampusOSProvider>
  );
}
