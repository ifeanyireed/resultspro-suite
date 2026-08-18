'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, Settings, HelpCircle, LogOut } from 'lucide-react';
import Image from 'next/image';

export interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  links: SidebarLink[];
  userName: string;
  userEmail: string;
  portalName: string;
}

export default function DashboardLayout({ children, links, userName, userEmail, portalName }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-slate-100 flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#146ef5] flex items-center justify-center text-white font-bold text-xl">
            R
          </div>
          <span className="font-extrabold text-slate-800 text-lg tracking-tight">ResultsPRO</span>
        </div>

        <div className="px-6 pb-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
          {portalName}
        </div>

        <nav className="flex-1 px-4 mt-2 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-[#146ef5]/10 text-[#146ef5] font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#146ef5]' : 'text-slate-400'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="bg-emerald-100 text-emerald-700 py-0.5 px-2 rounded-full text-[10px] font-black">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 pb-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-8">
          General
        </div>
        <nav className="px-4 mb-6 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-all">
            <Settings size={20} className="text-slate-400" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-all">
            <HelpCircle size={20} className="text-slate-400" />
            <span>Help</span>
          </button>
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 font-medium transition-all">
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </nav>
        
        {/* Promo Card (like in the image) */}
        <div className="mx-6 mb-8 bg-gradient-to-br from-[#146ef5] to-[#0f56c9] rounded-[24px] p-5 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <span className="font-bold text-sm">PRO</span>
            </div>
            <h4 className="font-bold mb-1">Download App</h4>
            <p className="text-white/80 text-xs mb-4">Get easy access anywhere</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all">
              Download
            </button>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full border-4 border-white/10" />
          <div className="absolute -right-2 -bottom-2 w-16 h-16 rounded-full border-4 border-white/10" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-[88px] px-8 flex items-center justify-between bg-[#f8fafc] sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all shadow-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded">⌘</span>
              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded">F</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#146ef5] hover:border-[#146ef5] transition-all relative shadow-sm">
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 border-l border-slate-200 mx-1"></div>
            <div className="flex items-center gap-3 bg-white pl-2 pr-4 py-1.5 rounded-full border border-slate-200 cursor-pointer hover:border-[#146ef5] transition-all shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#146ef5]/10 text-[#146ef5] flex items-center justify-center font-bold text-sm">
                {userName.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 leading-none">{userName}</span>
                <span className="text-[10px] font-medium text-slate-500 leading-none mt-1">{userEmail}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 pt-2 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
