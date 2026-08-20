'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { IconHome, IconBook, IconBolt, IconSword, IconBrain, IconTrophy, IconUserPlus, IconNews, IconShoppingBag, IconSettings, IconHelp } from '@tabler/icons-react';
import { useAuthStore } from '@/store/useAuthStore';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const sections = [
    {
      title: 'LEARNING',
      links: [
        { label: 'Dashboard', href: '/dashboard', icon: IconHome },
        { label: 'Practice', href: '/practice', icon: IconBook },
        { label: 'AI Tutor', href: '/study-assistant', icon: IconBrain },
      ],
    },
    {
      title: 'COMPETITION',
      links: [
        { label: 'Live Games', href: '/live', icon: IconBolt },
        { label: 'Battle Mode', href: '/battle-mode', icon: IconSword },
        { label: 'Leaderboard', href: '/leaderboard', icon: IconTrophy },
      ],
    },
    {
      title: 'COMMUNITY',
      links: [
        { label: 'Referral', href: '/referral', icon: IconUserPlus },
        { label: 'Blog', href: '/blog', icon: IconNews },
        { label: 'Shop', href: '/shop', icon: IconShoppingBag },
      ],
    },
    {
      title: 'SETTINGS',
      links: [
        { label: 'Settings', href: '/settings', icon: IconSettings },
        { label: 'Help', href: '/support', icon: IconHelp },
      ],
    },
  ];

  return (
    <>
      {/* Brand Header */}
      <div className="px-8 mb-6">
        <Image src="/logo.png" alt="ExamsPRO" width={300} height={80} className="w-auto h-20 object-contain" priority />
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
                    className={`flex items-center px-4 py-2 rounded-xl text-sm font-normal relative transition-colors ${
                      isActive
                        ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Info */}
      <div className="px-6 mt-8">
        <div 
          className="rounded-[1.5rem] p-6 text-white relative overflow-hidden shadow-lg bg-cover bg-center"
          style={{ backgroundImage: "url('/abstract-blue-2.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
          
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 relative z-10 shadow-sm border-2 border-white/50 overflow-hidden bg-white/20 backdrop-blur-sm">
            <span className="font-bold text-sm text-white">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <h4 className="font-normal text-lg leading-tight mb-1 relative z-10">{user?.name || 'Student'}</h4>
          <p className="text-[10px] text-gray-300 mb-6 relative z-10">{user?.email || 'student@examspro.com'}</p>
          
          <button className="w-full bg-[#146ef5] hover:bg-[#105bd1] transition-colors text-white text-xs font-semibold py-3 rounded-full relative z-10 shadow-md">
            View Profile
          </button>
        </div>
      </div>
    </>
  );
}
