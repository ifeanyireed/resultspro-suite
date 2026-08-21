"use client";

import { IconUsers as Users, IconShieldCheck as ShieldCheck, IconLayoutDashboard as LayoutDashboard, IconDollarSign as DollarSign, IconAlertCircle as AlertCircle, IconShieldAlert as ShieldAlert, IconMessage as MessageSquare, IconSettings as Settings, IconLogOut as LogOut } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '../Logo';
import { useAuthStore } from '@/store/useAuthStore';

const PlatformSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/platform-admin/dashboard' },
    { label: 'User Management', icon: Users, href: '/platform-admin/users' },
    { label: 'Tutor Verification', icon: ShieldCheck, href: '/platform-admin/tutor-verification' },
    { label: 'Payments & Billing', icon: DollarSign, href: '/platform-admin/payments' },
    { label: 'Dispute Resolution', icon: AlertCircle, href: '/platform-admin/disputes' },
    { label: 'Content Moderation', icon: ShieldAlert, href: '/platform-admin/moderation' },
    { label: 'Support Tickets', icon: MessageSquare, href: '/platform-admin/support' },
    { label: 'Settings', icon: Settings, href: '/platform-admin/settings' },
  ];

  return (
    <aside className="w-64 bg-navy border-r border-white/5 hidden lg:flex flex-col sticky top-0 h-screen z-30">
      <div className="p-6 border-b border-white/5">
        <Logo textSize="text-xl" href="/platform-admin/dashboard" multiline={true} />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/platform-admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-green/10 text-green' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-green text-xs font-bold">
            OP
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">Platform Ops</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-tight">Admin Role</div>
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

export default PlatformSidebar;
