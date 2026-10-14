"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  BellIcon,
  Squares2X2Icon,
  ClipboardDocumentCheckIcon,
  BuildingStorefrontIcon,
  WalletIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { 
  Squares2X2Icon as Squares2X2Solid,
} from '@heroicons/react/24/solid';

import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleLogout = () => {
    localStorage.removeItem('resultspro_admin_token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('resultspro_admin_token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload.roles || [];
      if (!roles.includes('agent') && !roles.includes('super-admin') && !roles.includes('platform-admin') && !roles.includes('support')) {
        router.push('/unauthorized');
      } else {
        setIsAuthorized(true);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
      }
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const isActive = (path: string) => pathname === path;

  if (!isAuthorized) return null;



  const agentNavItems = [
    { label: 'Overview', mobileLabel: 'Overview', href: '/agent/dashboard', icon: Squares2X2Icon, activeIcon: Squares2X2Solid },
    { label: 'Registrations', mobileLabel: 'Leads', href: '/agent/leads', icon: ClipboardDocumentCheckIcon, activeIcon: ClipboardDocumentCheckIcon, badge: '12+' },
    { label: 'Wholesale Store', mobileLabel: 'Store', href: '/agent/store', icon: BuildingStorefrontIcon, activeIcon: BuildingStorefrontIcon },
    { label: 'Ledger & Payouts', mobileLabel: 'Ledger', href: '/agent/ledger', icon: WalletIcon, activeIcon: WalletIcon },
    { label: 'Settings', mobileLabel: 'Settings', href: '/agent/settings', icon: Cog6ToothIcon, activeIcon: Cog6ToothIcon },
    { label: 'Help', mobileLabel: 'Help', href: '/agent/help', icon: QuestionMarkCircleIcon, activeIcon: QuestionMarkCircleIcon },
  ];

  return (
    <ModernDashboardLayout
      mobileNavItems={agentNavItems}
      sidebarContent={
        <>
          
          <div>
            {/* Logo */}
            <div className="px-8 mb-6">
              <Image 
                src="/logo.png" 
                alt="ResultsPRO" 
                width={300} 
                height={80} 
                className="w-auto h-20 object-contain" 
              />
            </div>

            {/* Menu Sections */}
            <div className="px-6 space-y-1">
              <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">MENU</p>
              
              <Link href="/agent/dashboard" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/agent/dashboard') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                {isActive('/agent/dashboard') ? <Squares2X2Solid className="w-6 h-6" /> : <Squares2X2Icon className="w-6 h-6" />}
                Overview
              </Link>
              
              <Link href="/agent/leads" className={`flex items-center justify-between text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/agent/leads') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <ClipboardDocumentCheckIcon className="w-6 h-6" />
                  Registrations
                </div>
                <span className="bg-[#146ef5] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">12+</span>
              </Link>

              <Link href="/agent/store" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/agent/store') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <BuildingStorefrontIcon className="w-6 h-6" />
                Wholesale Store
              </Link>

              <Link href="/agent/ledger" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/agent/ledger') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <WalletIcon className="w-6 h-6" />
                Ledger & Payouts
              </Link>
            </div>

            <div className="px-6 mt-10 space-y-1">
              <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">GENERAL</p>
              
              <Link href="/agent/settings" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/agent/settings') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <Cog6ToothIcon className="w-6 h-6" />
                Settings
              </Link>
              <Link href="/agent/help" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/agent/help') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <QuestionMarkCircleIcon className="w-6 h-6" />
                Help
              </Link>
              <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 text-lg px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-normal relative transition-colors border-transparent cursor-pointer">
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                Logout
              </button>
            </div>
          </div>

          {/* Bottom App Promo */}
          <div className="px-6 mt-8">
            <div 
              className="rounded-[1.5rem] p-6 text-white relative overflow-hidden shadow-lg bg-cover bg-center"
              style={{ backgroundImage: "url('/abstract-blue-2.jpg')" }}
            >
              {/* Lighter overlay for text readability */}
              <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-4 relative z-10 backdrop-blur-sm">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#146ef5] rounded-full"></div>
                </div>
              </div>
              <h4 className="font-normal text-lg leading-tight mb-1 relative z-10">Download our<br/>Mobile App</h4>
              <p className="text-[10px] text-gray-300 mb-6 relative z-10">Get easy in another way</p>
              
              <button className="w-full bg-[#146ef5] hover:bg-[#105bd1] transition-colors text-white text-xs font-semibold py-3 rounded-full relative z-10 shadow-md">
                Download
              </button>
            </div>
          </div>
        
        </>
      }
      headerContent={
        <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile Logo */}
          <Link href="/agent/dashboard" className="md:hidden flex items-center gap-2 mr-1 shrink-0">
            <img src="/logo.png" alt="ResultsPRO" className="h-7 w-auto object-contain" />
          </Link>

          <div className="relative flex-1 max-w-[180px] xs:max-w-[240px] sm:max-w-xs md:max-w-none md:w-80 lg:w-96">
            <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full bg-white border border-gray-100 md:border-white focus:border-gray-200 outline-none rounded-xl py-2 sm:py-3 pl-8 sm:pl-12 pr-4 sm:pr-12 text-xs sm:text-sm text-gray-700 shadow-sm transition-colors placeholder:text-gray-400"
            />
            <div className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 bg-gray-100 rounded px-1.5 py-0.5 border border-gray-200">
              <span className="text-[10px] font-medium text-gray-500">⌘</span>
              <span className="text-[10px] font-medium text-gray-500">F</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-900 transition-colors">
              <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-900 transition-colors relative">
              <BellIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1.5 sm:top-2.5 right-1.5 sm:right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2 border-l border-gray-200 pl-2 sm:pl-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-orange-200 to-orange-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-sm text-gray-700 font-bold text-xs sm:text-sm shrink-0">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Agent Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name.charAt(0).toUpperCase() : 'A'
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name || "Error: Name not found"}</p>
                <p className="text-xs text-gray-500">{user?.email || "Error: Email not found"}</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ModernDashboardLayout>
  );
}
