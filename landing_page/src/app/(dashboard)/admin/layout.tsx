"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  BellIcon,
  Squares2X2Icon,
  UsersIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { 
  Squares2X2Icon as Squares2X2Solid,
} from '@heroicons/react/24/solid';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="dashboard-page min-h-screen bg-[#f3f6f8] font-sans text-gray-900 flex justify-center p-4 lg:p-6 overflow-hidden">
      
      {/* Main App Container */}
      <div className="w-full max-w-[1600px] bg-[#f9fafc] rounded-[2rem] shadow-xl border border-gray-100 flex overflow-hidden h-[calc(100vh-3rem)]">
        
        {/* Sidebar */}
        <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col justify-between py-4 shrink-0 h-full overflow-y-auto">
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
              <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">SUPERADMIN</p>
              
              <Link href="/admin/dashboard" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/dashboard') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                {isActive('/admin/dashboard') ? <Squares2X2Solid className="w-6 h-6" /> : <Squares2X2Icon className="w-6 h-6" />}
                Global Overview
              </Link>
              
              <Link href="/admin/agents" className={`flex items-center justify-between text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/agents') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <UsersIcon className="w-6 h-6" />
                  Manage Agents
                </div>
                <span className="bg-[#146ef5] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">48</span>
              </Link>

              <Link href="/admin/schools" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/schools') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <BuildingOfficeIcon className="w-6 h-6" />
                Manage Schools
              </Link>

              <Link href="/admin/finance" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/finance') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <BanknotesIcon className="w-6 h-6" />
                Finance & Payouts
              </Link>

              <Link href="/admin/reports" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/reports') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <ChartBarIcon className="w-6 h-6" />
                System Reports
              </Link>
            </div>

            <div className="px-6 mt-10 space-y-1">
              <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">SYSTEM</p>
              
              <Link href="/admin/settings" className="flex items-center gap-3 text-lg px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-normal relative transition-colors border-transparent">
                <Cog6ToothIcon className="w-6 h-6" />
                Global Settings
              </Link>
            </div>
          </div>

          {/* Admin Tag */}
          <div className="px-6 mt-8">
            <div className="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg border border-gray-800">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 relative z-10 backdrop-blur-sm">
                <div className="w-4 h-4 bg-[#146ef5] rounded-full flex items-center justify-center"></div>
              </div>
              <h4 className="font-bold text-lg leading-tight mb-1 relative z-10">Superadmin<br/>Access</h4>
              <p className="text-[10px] text-gray-400 relative z-10">You have full system control</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Header */}
          <header className="h-24 px-3 flex items-center justify-between shrink-0">
            <div className="relative w-96">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search agents, schools, or transactions..." 
                className="w-full bg-white border border-white focus:border-gray-200 outline-none rounded-xl py-3 pl-12 pr-12 text-sm text-gray-700 shadow-sm transition-colors placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-900 transition-colors">
                <EnvelopeIcon className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-900 transition-colors relative">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#146ef5] rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3 ml-2 border-l border-gray-200 pl-6">
                <div className="w-10 h-10 bg-gradient-to-tr from-gray-200 to-gray-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                  <img src="/character12.jpg" alt="Admin Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-gray-900 leading-tight">Admin User</p>
                  <p className="text-xs text-gray-500">admin@resultspro.com</p>
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable Dashboard Content */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
