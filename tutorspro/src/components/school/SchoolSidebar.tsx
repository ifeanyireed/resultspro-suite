"use client";

import { IconUsers as Users, IconTrendingUp as TrendingUp, IconLayoutDashboard as LayoutDashboard, IconBookOpen as BookOpen, IconSettings as Settings, IconBell as Bell, IconFileText as FileText, IconCreditCard as CreditCard, IconPalette as Palette, IconGraduationCap as GraduationCap, IconLogOut as LogOut } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '../Logo';
import { useAuthStore } from '@/store/useAuthStore';

const SchoolSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/school/dashboard' },
    { label: 'Teachers', icon: Users, href: '/school/teachers' },
    { label: 'Classes', icon: BookOpen, href: '/school/classes' },
    { label: 'Students', icon: GraduationCap, href: '/school/students' },
    { label: 'Analytics', icon: TrendingUp, href: '/school/analytics' },
    { label: 'Reports', icon: FileText, href: '/school/reports' },
    { label: 'Subscription', icon: CreditCard, href: '/school/subscription' },
    { label: 'Branding', icon: Palette, href: '/school/branding' },
    { label: 'Notifications', icon: Bell, href: '/school/notifications' },
    { label: 'Settings', icon: Settings, href: '/school/settings' },
  ];

  return (
    <aside className="w-64 bg-navy border-r border-white/5 hidden lg:flex flex-col sticky top-0 h-screen z-30">
      <div className="p-6 border-b border-white/5">
        <Logo textSize="text-xl" href="/school/dashboard" multiline={true} />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/school/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-purple/10 text-purple' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">School</div>
            <div className="text-sm font-bold text-white truncate">Greenwood Academy</div>
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

export default SchoolSidebar;
