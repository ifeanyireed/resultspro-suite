'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, CheckCircle2, Users, CreditCard, Briefcase, FileCheck2, Sparkles, BookOpen, GraduationCap, FileText, Mail, Settings, ShieldCheck, Map, Headset } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  type Section = {
    title: string;
    links: { label: string; href: string; icon: any; badge?: string }[];
  };

  const sections: Section[] = [
    {
      title: 'COMMAND CENTER',
      links: [
        { label: 'Suite Overview', href: '/overview', icon: LayoutDashboard },
        { label: 'Universal Users', href: '/users', icon: Users },
      ],
    },
    {
      title: 'FINANCE & BILLING',
      links: [
        { label: 'Subscriptions & Plans', href: '/subscriptions', icon: CreditCard },
        { label: 'Agent Network', href: '/agents', icon: Briefcase },
      ],
    },
    {
      title: 'MODULAR SUITE CONTROLS',
      links: [
        { label: 'SchoolHUB (Tenants)', href: '/schoolhub', icon: Building2 },
        { label: 'ResultPRO', href: '/resultspro', icon: FileCheck2 },
        { label: 'ExamsPRO', href: '/exampro', icon: Sparkles },
        { label: 'ClassroomPRO', href: '/classroompro', icon: BookOpen },
        { label: 'TutorsPRO', href: '/tutorspro', icon: GraduationCap },
        { label: 'CoursesPRO', href: '/coursespro', icon: Map },
      ],
    },
    {
      title: 'CONTENT & SYSTEM',
      links: [
        { label: 'Suite Blog CMS', href: '/cms/blog', icon: FileText },
        { label: 'Email Broadcasts', href: '/cms/emails', icon: Mail },
        { label: 'Support Desk', href: '/support', icon: Headset },
        { label: 'Global Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Brand Header */}
      <div className="px-8 mb-6">
        <Image src="/logo.png" alt="ResultsPRO Suite Logo" width={300} height={80} className="w-auto h-20 object-contain" priority />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-6 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3 uppercase">
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
                    className={`flex items-center justify-between px-4 py-2 rounded-xl text-sm font-normal relative transition-colors ${
                      isActive
                        ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive ? 'bg-[#146ef5] text-white' : 'bg-gray-100 text-gray-500 border border-gray-200'
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
      <div className="px-6 mt-8">
        <div 
          className="rounded-[1.5rem] p-6 text-white relative overflow-hidden shadow-lg bg-cover bg-center"
          style={{ backgroundImage: "url('/abstract-blue-2.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
          
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 relative z-10 shadow-sm border-2 border-white/50 overflow-hidden">
            <Image src="/avatars/character1.jpg" alt="Super Admin" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <h4 className="font-normal text-lg leading-tight mb-1 relative z-10">Super<br/>Admin</h4>
          <p className="text-[10px] text-gray-300 mb-6 relative z-10">superadmin@resultspro</p>
          
          <button className="w-full bg-[#146ef5] hover:bg-[#105bd1] transition-colors text-white text-xs font-semibold py-3 rounded-full relative z-10 shadow-md">
            System Settings
          </button>
        </div>
      </div>
    </>
  );
}
