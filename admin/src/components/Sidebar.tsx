'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  CheckCircle2,
  Users,
  CreditCard,
  Briefcase,
  FileCheck2,
  Sparkles,
  BookOpen,
  GraduationCap,
  FileText,
  Mail,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const sections = [
    {
      title: 'COMMAND CENTER',
      links: [
        { label: 'Suite Overview', href: '/overview', icon: LayoutDashboard },
        { label: 'All Schools', href: '/schools', icon: Building2 },
        { label: 'School Verifications', href: '/schools/verifications', icon: CheckCircle2, badge: '24' },
        { label: 'Universal Users', href: '/users', icon: Users },
      ],
    },
    {
      title: 'FINANCE & BILLING',
      links: [
        { label: 'Subscriptions & Plans', href: '/subscriptions', icon: CreditCard },
        { label: 'Agent Network', href: '/agents', icon: Briefcase },
        { label: 'Payout Requests', href: '/agents/payouts', icon: ShieldCheck, badge: '3' },
      ],
    },
    {
      title: 'MODULAR SUITE CONTROLS',
      links: [
        { label: 'ResultPRO', href: '/resultspro', icon: FileCheck2 },
        { label: 'examsPRO (CBT)', href: '/examspro', icon: Sparkles },
        { label: 'ClassroomPRO (LMS)', href: '/classroompro', icon: BookOpen },
        { label: 'TutorsPRO Marketplace', href: '/tutorspro', icon: GraduationCap },
      ],
    },
    {
      title: 'CONTENT & SYSTEM',
      links: [
        { label: 'Suite Blog CMS', href: '/cms/blog', icon: FileText },
        { label: 'Email Broadcasts', href: '/cms/emails', icon: Mail },
        { label: 'Global Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-md shadow-blue-500/30">
          R
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight text-sm">ResultsPRO Suite</h1>
          <p className="text-[11px] text-blue-400 font-semibold tracking-wider uppercase">Admin Control Hub</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-bold text-slate-400 tracking-wider mb-2 uppercase">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive ? 'bg-white text-blue-600' : 'bg-blue-600/30 text-blue-300 border border-blue-500/30'
                      }`}>
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

      {/* Admin User Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
            SA
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Super Administrator</p>
            <p className="text-[10px] text-slate-400 truncate">superadmin@resultspro.ng</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
