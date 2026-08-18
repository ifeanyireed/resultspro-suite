'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, CheckCircle2, Users, CreditCard, Briefcase, FileCheck2, Sparkles, BookOpen, GraduationCap, FileText, Mail, Settings, ShieldCheck } from 'lucide-react';

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
        { label: 'ExamsPRO', href: '/exampro', icon: Sparkles },
        { label: 'ClassroomPRO', href: '/classroompro', icon: BookOpen },
        { label: 'TutorsPRO', href: '/tutorspro', icon: GraduationCap },
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
    <aside className="w-64 bg-white text-slate-600 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-200 shadow-sm z-10">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 space-x-3">
        <Image src="/logo.png" alt="ResultsPRO Suite Logo" width={48} height={48} className="object-contain" priority />
        <div>
          <h1 className="font-bold text-slate-900 tracking-tight text-sm">ResultsPRO Suite</h1>
          <p className="text-[11px] text-blue-600 font-bold tracking-wider uppercase">Admin Control Hub</p>
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
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'
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
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-500/20">
            SA
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate">Super Administrator</p>
            <p className="text-[10px] text-slate-500 truncate font-medium">superadmin@resultspro.ng</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
