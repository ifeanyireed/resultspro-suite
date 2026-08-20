'use client';

import { Sidebar } from '@/components/Sidebar';
import { ModernDashboardLayout } from '@resultspro/design-system';
import { IconSearch as Search, IconBell as Bell } from '@tabler/icons-react';
import { useAuthStore } from '@/store/useAuthStore';

function GlobalTopNav() {
  const { user } = useAuthStore();
  
  return (
    <>
      <div className="relative w-96">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search exams, subjects, past questions..." 
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
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.name?.charAt(0) || 'U'}
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
  return (
    <ModernDashboardLayout 
      sidebarContent={<Sidebar />}
      headerContent={<GlobalTopNav />}
    >
      {children}
    </ModernDashboardLayout>
  );
}
