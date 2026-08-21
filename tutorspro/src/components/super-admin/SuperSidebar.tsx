"use client";

import { IconActivity as Activity, IconLayoutDashboard as LayoutDashboard, IconFlag as Flag, IconDatabase as Database, IconLink2 as Link2, IconScrollText as ScrollText, IconLock as Lock, IconChartBar as BarChart3, IconSettings as Settings, IconServer as Server, IconLogout as LogOut } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '../Logo';
import { useAuthStore } from '@/store/useAuthStore';

const SuperSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/super-admin/dashboard' },
    { label: 'System Health', icon: Activity, href: '/super-admin/health' },
    { label: 'Feature Flags', icon: Flag, href: '/super-admin/feature-flags' },
    { label: 'Infrastructure', icon: Database, href: '/super-admin/infrastructure' },
    { label: 'Integrations', icon: Link2, href: '/super-admin/integrations' },
    { label: 'Audit Logs', icon: ScrollText, href: '/super-admin/audit-logs' },
    { label: 'Permissions', icon: Lock, href: '/super-admin/permissions' },
    { label: 'Global Analytics', icon: BarChart3, href: '/super-admin/analytics' },
    { label: 'Settings', icon: Settings, href: '/super-admin/settings' },
  ];

  return (
    <aside className="w-64 bg-navy border-r border-white/5 hidden lg:flex flex-col sticky top-0 h-screen z-30">
      <div className="p-6 border-b border-white/5">
        <Logo textSize="text-xl" href="/super-admin/dashboard" multiline={true} />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/super-admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-red-500/10 text-red-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-red-500/5 border border-red-500/10">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-xs font-bold">
            <Server className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">Super Admin</div>
            <div className="text-[10px] text-red-500/60 uppercase tracking-tight">Root Access</div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SuperSidebar;
