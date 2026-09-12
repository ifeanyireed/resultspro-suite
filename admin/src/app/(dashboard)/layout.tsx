"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { Search, Bell } from 'lucide-react';

function GlobalTopNav({ user }: { user: any }) {
  return (
    <>
      <div className="relative w-96">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search everywhere..." 
          className="w-full bg-white border border-white focus:border-gray-200 outline-none rounded-xl py-3 pl-12 pr-12 text-sm text-gray-700 shadow-sm transition-colors placeholder:text-gray-400"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gray-100 rounded px-1.5 py-0.5 border border-gray-200">
          <span className="text-[10px] font-medium text-gray-500">⌘</span>
          <span className="text-[10px] font-medium text-gray-500">K</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-900 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 ml-2 border-l border-gray-200 pl-6">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
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
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('resultspro_admin_token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload.roles || [];
      
      // If the user has ONLY the agent role, redirect them to the agent dashboard
      const isOnlyAgent = roles.includes('agent') && !roles.includes('super-admin') && !roles.includes('platform-admin');
      if (isOnlyAgent) {
        router.push('/agent/dashboard');
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

  if (!isAuthorized) return null;

  return (
    <ModernDashboardLayout 
      sidebarContent={<Sidebar />}
      headerContent={<GlobalTopNav user={user} />}
    >
      {children}
    </ModernDashboardLayout>
  );
}

