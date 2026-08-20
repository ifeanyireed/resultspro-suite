"use client";

import { IconSearch as Search, IconBell as Bell, IconMenu as Menu, IconLogout as LogOut } from '@tabler/icons-react';
import Logo from '../Logo';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

import { useState, useEffect, ReactNode } from 'react';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const AdminHeader = ({ title, subtitle, action, searchValue, onSearchChange }: AdminHeaderProps) => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <header className="h-20 bg-navy border-b border-white/5 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-4">
        <div className="lg:hidden flex items-center gap-4">
          <Menu className="w-6 h-6 text-gray-400" />
          <Logo showText={false} href="/admin/dashboard" />
        </div>
        <div className="hidden md:block">
          {title && <h1 className="text-xl font-display font-bold text-white">{title}</h1>}
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="relative w-96 hidden lg:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"
        />
      </div>

      <div className="flex items-center gap-6">
        {action && (
          <div className="hidden sm:block">
            {action}
          </div>
        )}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all text-xs font-bold"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
        <div className="h-8 w-px bg-white/5" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-white">
              {mounted ? (user?.name || 'Admin User') : 'Admin User'}
            </div>
            <div className="text-[10px] font-bold text-green uppercase tracking-widest leading-none">
              {mounted ? (user?.role || 'Super Admin') : 'Super Admin'}
            </div>
          </div>
          <img src={`https://i.pravatar.cc/100?u=${mounted && user?.email ? user.email : 'admin'}`} className="w-10 h-10 rounded-xl border border-white/10 shadow-lg shadow-black/20" alt="Admin" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
