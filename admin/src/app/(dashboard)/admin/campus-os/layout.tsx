'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';
import {
  GraduationCap,
  Users,
  CreditCard,
  Library,
  Truck,
  Megaphone,
  Calendar,
  BookOpen,
  FileText,
  DollarSign,
  Receipt,
  BookMarked,
  ArrowRightLeft,
  Bus,
  Building2,
  Package,
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  ChevronDown,
  Layers
} from 'lucide-react';

interface PillarCategory {
  id: string;
  label: string;
  href: string;
  icon: any;
  subTabs: {
    label: string;
    href: string;
    icon: any;
  }[];
}

const PILLARS: PillarCategory[] = [
  {
    id: 'academic',
    label: 'Academic Operations',
    href: '/admin/campus-os/academic/overview',
    icon: GraduationCap,
    subTabs: [
      { label: 'Executive Overview', href: '/admin/campus-os/academic/overview', icon: GraduationCap },
      { label: 'Classes & Arms', href: '/admin/campus-os/academic/classes', icon: Layers },
      { label: 'Timetable & Bell Schedule', href: '/admin/campus-os/academic/timetable', icon: Calendar },
      { label: 'Homework & Assignments', href: '/admin/campus-os/academic/homework', icon: BookOpen },
    ],
  },
  {
    id: 'admissions',
    label: 'Admissions & Intake',
    href: '/admin/campus-os/admissions/overview',
    icon: Users,
    subTabs: [
      { label: 'Pipeline Funnel', href: '/admin/campus-os/admissions/overview', icon: Users },
      { label: 'Inquiries & Registry', href: '/admin/campus-os/admissions/inquiries', icon: FileText },
    ],
  },
  {
    id: 'finance',
    label: 'Tuition & Bursary',
    href: '/admin/campus-os/finance/overview',
    icon: CreditCard,
    subTabs: [
      { label: 'Revenue Overview', href: '/admin/campus-os/finance/overview', icon: DollarSign },
      { label: 'Class Fee Structures', href: '/admin/campus-os/finance/fees', icon: CreditCard },
      { label: 'Student Invoices & Ledger', href: '/admin/campus-os/finance/invoices', icon: Receipt },
    ],
  },
  {
    id: 'library',
    label: 'Library & Media',
    href: '/admin/campus-os/library/catalog',
    icon: Library,
    subTabs: [
      { label: 'Book Catalog & ISBN', href: '/admin/campus-os/library/catalog', icon: BookMarked },
      { label: 'Circulation & Loans', href: '/admin/campus-os/library/loans', icon: ArrowRightLeft },
    ],
  },
  {
    id: 'logistics',
    label: 'Logistics & Campus Assets',
    href: '/admin/campus-os/logistics/transport',
    icon: Truck,
    subTabs: [
      { label: 'Transport & Fleet Routes', href: '/admin/campus-os/logistics/transport', icon: Bus },
      { label: 'Hostel & Bed Allocations', href: '/admin/campus-os/logistics/hostel', icon: Building2 },
      { label: 'Asset Procurement & Stock', href: '/admin/campus-os/logistics/procurement', icon: Package },
    ],
  },
  {
    id: 'communications',
    label: 'Communications & Portal',
    href: '/admin/campus-os/communications/notices',
    icon: Megaphone,
    subTabs: [
      { label: 'Circulars & Notice Board', href: '/admin/campus-os/communications/notices', icon: Bell },
      { label: 'Broadcast Messages', href: '/admin/campus-os/communications/messages', icon: Mail },
      { label: 'Mobile App Device Accounts', href: '/admin/campus-os/communications/mobile-accounts', icon: Smartphone },
    ],
  },
];

export default function CampusOsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [selectedTenant, setSelectedTenant] = useState('All Campuses & Tenants');

  // Determine active category pillar from URL
  const currentPillar = PILLARS.find(p => pathname.includes(`/campus-os/${p.id}`)) || PILLARS[0];

  return (
    <MotionStagger className="w-full">
      {/* Top Header with Master Meta & Live Microservice Status */}
      <MotionRise>
        <Header
          title="Campus OS (Institutional ERP)"
          subtitle="Unified academic records, admissions, fee billing, library, logistics, and multi-channel communications"
        >
          {/* Tenant Selector Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="appearance-none bg-white border border-slate-200 text-slate-800 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All Campuses & Tenants">🏫 All Campuses & Tenants</option>
                <option value="St. Augustine International Academy">St. Augustine Academy (ScholarsNG)</option>
                <option value="Federal Government College Lagos">Federal Govt College Lagos</option>
                <option value="Corona Model College Gbagada">Corona Model College Gbagada</option>
                <option value="Greensprings Secondary Lekki">Greensprings Secondary Lekki</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Microservice Live Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>service_campuspro: Connected</span>
            </div>
          </div>
        </Header>
      </MotionRise>

      {/* Primary Category Switcher (6 Operational Pillars) */}
      <MotionRise delay={0.03} className="px-1 sm:px-4 md:px-8 pt-1">
        <div className="bg-slate-100/80 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-hide border border-slate-200/60 shadow-inner">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isPillarActive = pathname.includes(`/campus-os/${pillar.id}`);

            return (
              <Link
                key={pillar.id}
                href={pillar.href}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isPillarActive
                    ? 'bg-[#146ef5] text-white shadow-md shadow-blue-500/25 font-bold scale-[1.01]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isPillarActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{pillar.label}</span>
              </Link>
            );
          })}
        </div>
      </MotionRise>

      {/* Secondary Sub-Navigation Row for the Active Pillar */}
      <MotionRise delay={0.06} className="px-1 sm:px-4 md:px-8 pt-3">
        <div className="flex items-center space-x-1 sm:space-x-3 border-b border-slate-200 overflow-x-auto pb-px scrollbar-hide">
          {currentPillar.subTabs.map((tab) => {
            const SubIcon = tab.icon;
            // Check if URL matches tab exactly or starts with it
            const isSubActive = pathname === tab.href || (tab.href !== currentPillar.href && pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 font-medium text-xs transition-colors whitespace-nowrap ${
                  isSubActive
                    ? 'border-[#146ef5] text-[#146ef5] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <SubIcon className="w-4 h-4 stroke-2" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </MotionRise>

      {/* Main Content Area */}
      <MotionRise delay={0.1} className="px-1 sm:px-4 md:px-8 py-4 sm:py-6 w-full">
        {children}
      </MotionRise>
    </MotionStagger>
  );
}
