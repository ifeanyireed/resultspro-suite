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
  FingerPrintIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ScaleIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  TrophyIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { MotionRise } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';
import { CampusOSProvider, type CampusOSTab, type CampusBranch } from './components';
import CampusBranchModal from './CampusBranchModal';

export default function CampusOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [campuses, setCampuses] = useState<CampusBranch[]>([]);
  const [isLoadingCampuses, setIsLoadingCampuses] = useState(false);
  const [selectedCampusId, setSelectedCampusId] = useState<string>('all');
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [summaryCounts, setSummaryCounts] = useState<Record<string, any>>({});

  // Initialize selectedCampusId from localStorage or query on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCampusId = urlParams.get('campus_id');
      const savedCampusId = localStorage.getItem('scholars_selected_campus_id');
      if (urlCampusId) {
        setSelectedCampusId(urlCampusId);
      } else if (savedCampusId) {
        setSelectedCampusId(savedCampusId);
      }
    }
  }, []);

  const fetchCampuses = useCallback(async () => {
    try {
      setIsLoadingCampuses(true);
      const [branchRes, summaryRes] = await Promise.all([
        api.get('/v1/campus/branches').catch(async () => await api.get('/campus/branches')),
        api.get('/v1/campus/summary').catch(async () => await api.get('/campus/summary')),
      ]);
      if (branchRes?.data?.branches) {
        setCampuses(branchRes.data.branches);
      }
      if (summaryRes?.data) {
        setSummaryCounts(summaryRes.data);
      }
    } catch (err) {
      console.error('Failed to load campus branches or summary:', err);
    } finally {
      setIsLoadingCampuses(false);
    }
  }, []);

  useEffect(() => {
    fetchCampuses();
  }, [fetchCampuses]);

  // Derive human-readable campus name for backwards-compatibility
  const activeCampusObj = campuses.find((c) => c.id === selectedCampusId);
  const selectedCampusName = activeCampusObj ? activeCampusObj.name : 'All Campuses (Multi-Campus)';

  const handleSelectCampusId = useCallback((id: string) => {
    setSelectedCampusId(id);
    if (typeof window !== 'undefined') {
      if (id === 'all') {
        localStorage.removeItem('scholars_selected_campus_id');
      } else {
        localStorage.setItem('scholars_selected_campus_id', id);
      }
    }
  }, []);

  const handleSetSelectedCampusName = useCallback((name: string) => {
    if (name === 'All Campuses (Multi-Campus)') {
      handleSelectCampusId('all');
      return;
    }
    const match = campuses.find((c) => c.name === name);
    if (match) {
      handleSelectCampusId(match.id);
    }
  }, [campuses, handleSelectCampusId]);

  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const scrollHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrollMetrics, setScrollMetrics] = useState({ thumbWidth: 100, thumbLeft: 0, hasOverflow: false });
  const [isScrollActive, setIsScrollActive] = useState(false);

  const tabs: { id: CampusOSTab; label: string; icon: any; badge?: string; href: string }[] = [
    { id: 'academic', label: 'Academic', icon: AcademicCapIcon, badge: summaryCounts.active_session || 'Timetable', href: '/admin/campus-os/academic' },
    { id: 'attendance', label: 'Attendance', icon: FingerPrintIcon, badge: 'Biometric', href: '/admin/campus-os/attendance' },
    { id: 'staff', label: 'Staff', icon: UserGroupIcon, badge: summaryCounts.teachers !== undefined ? `${summaryCounts.teachers}` : 'HR & KPIs', href: '/admin/campus-os/staff' },
    { id: 'students', label: 'Students', icon: UsersIcon, badge: summaryCounts.students !== undefined ? Number(summaryCounts.students).toLocaleString() : 'Directory', href: '/admin/campus-os/students' },
    { id: 'parents', label: 'Parents', icon: HeartIcon, badge: summaryCounts.parents !== undefined ? Number(summaryCounts.parents).toLocaleString() : 'Guardians', href: '/admin/campus-os/parents' },
    { id: 'financials', label: 'Financials', icon: BanknotesIcon, badge: 'Bursary', href: '/admin/campus-os/financials' },
    { id: 'library', label: 'Library', icon: BookOpenIcon, badge: summaryCounts.library_books ? `${summaryCounts.library_books} Books` : 'Catalog', href: '/admin/campus-os/library' },
    { id: 'inventory', label: 'Inventory', icon: ArchiveBoxIcon, badge: summaryCounts.inventory_items ? `${summaryCounts.inventory_items} SKUs` : 'Store', href: '/admin/campus-os/inventory' },
    { id: 'transportation', label: 'Transportation', icon: TruckIcon, badge: summaryCounts.transport_routes ? `${summaryCounts.transport_routes} Routes` : 'Fleet', href: '/admin/campus-os/transportation' },
    { id: 'admission', label: 'Admission', icon: ClipboardDocumentCheckIcon, badge: summaryCounts.inquiries ? `${summaryCounts.inquiries} Leads` : 'Pipeline', href: '/admin/campus-os/admission' },
    { id: 'messaging', label: 'Messaging', icon: ChatBubbleLeftRightIcon, badge: summaryCounts.notices ? `${summaryCounts.notices} Notices` : 'Broadcast', href: '/admin/campus-os/messaging' },
    { id: 'clinic', label: 'Clinic', icon: HeartIcon, badge: 'Sick Bay', href: '/admin/campus-os/clinic' },
    { id: 'hostel', label: 'Hostel & Exeat', icon: BuildingOffice2Icon, badge: summaryCounts.hostel_occupants ? `${summaryCounts.hostel_occupants} Beds` : 'Boarding', href: '/admin/campus-os/hostel' },
    { id: 'security', label: 'Security & Gate', icon: ShieldCheckIcon, badge: 'Visitor Pass', href: '/admin/campus-os/security' },
    { id: 'discipline', label: 'Discipline', icon: ScaleIcon, badge: 'Merits/Demerits', href: '/admin/campus-os/discipline' },
    { id: 'cafeteria', label: 'Cafeteria', icon: BuildingStorefrontIcon, badge: 'POS & Wallet', href: '/admin/campus-os/cafeteria' },
    { id: 'co-curricular', label: 'Co-Curricular', icon: TrophyIcon, badge: summaryCounts.clubs ? `${summaryCounts.clubs} Clubs` : 'Clubs & Houses', href: '/admin/campus-os/co-curricular' },
    { id: 'facilities', label: 'Facilities', icon: BuildingOfficeIcon, badge: summaryCounts.facilities ? `${summaryCounts.facilities} Venues` : 'Venues', href: '/admin/campus-os/facilities' },
    { id: 'alumni', label: 'Alumni', icon: IdentificationIcon, badge: summaryCounts.alumni ? `${summaryCounts.alumni} Alumni` : 'Registry', href: '/admin/campus-os/alumni' },
    { id: 'mobile-app', label: 'Mobile App', icon: DevicePhoneMobileIcon, badge: summaryCounts.mobile_accounts ? `${summaryCounts.mobile_accounts} IDs` : 'App IDs', href: '/admin/campus-os/mobile-app' },
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
    <CampusOSProvider
      value={{
        selectedCampusId,
        selectedCampus: selectedCampusName,
        setSelectedCampusId: handleSelectCampusId,
        setSelectedCampus: handleSetSelectedCampusName,
        campuses,
        isLoadingCampuses,
        refreshCampuses: fetchCampuses,
        isBranchModalOpen,
        setIsBranchModalOpen,
      }}
    >
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

          {/* Dynamic Multi-Campus Selector & Branch Management Modal Trigger */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm self-start sm:self-auto hover:border-gray-300 transition-colors">
            <HomeModernIcon className="w-4 h-4 text-[#146ef5] shrink-0" />
            <select
              value={selectedCampusId}
              onChange={(e) => handleSelectCampusId(e.target.value)}
              disabled={isLoadingCampuses && campuses.length === 0}
              className="text-xs font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer max-w-[210px] sm:max-w-[280px] truncate"
            >
              <option value="all">All Campuses (Multi-Campus)</option>
              {campuses.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} {branch.is_main ? '★ Main' : `[${branch.code}]`}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsBranchModalOpen(true)}
              title="Manage Institutional Campus Sites"
              className="p-1 rounded-full text-gray-400 hover:text-[#146ef5] hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <Cog6ToothIcon className="w-4 h-4" />
            </button>
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

        {/* Multi-Campus & Branch Management Dialog */}
        <CampusBranchModal
          isOpen={isBranchModalOpen}
          onClose={() => setIsBranchModalOpen(false)}
          campuses={campuses}
          onRefresh={fetchCampuses}
          selectedCampusId={selectedCampusId}
          onSelectCampusId={handleSelectCampusId}
        />
      </div>
    </CampusOSProvider>
  );
}
