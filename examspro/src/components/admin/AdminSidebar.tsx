"use client";

import { 
  Users, 
  TrendingUp, 
  LayoutDashboard,
  BookOpen,
  DollarSign,
  Settings,
  ShieldAlert,
  Gift,
  Target,
  Sword,
  Radio,
  Trophy,
  Bell,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '../Logo';

const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Analytics', icon: TrendingUp, href: '/admin/analytics' },
    { label: 'Blog', icon: FileText, href: '/admin/blog' },
    { label: 'Questions', icon: BookOpen, href: '/admin/questions' },
    { label: 'Subjects', icon: Target, href: '/admin/subjects' },
    { label: 'Live Games', icon: Radio, href: '/admin/live' },
    { label: 'Tournaments', icon: Trophy, href: '/admin/tournaments' },
    { label: 'Users', icon: Users, href: '/admin/users' },
    { label: 'Finances', icon: DollarSign, href: '/admin/transactions' },
    { label: 'Referrals', icon: Gift, href: '/admin/referrals' },
    { label: 'Battles', icon: Sword, href: '/admin/battles' },
    { label: 'Notifications', icon: Bell, href: '/admin/notifications' },
    { label: 'Moderation', icon: ShieldAlert, href: '/admin/moderation' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-navy border-r border-white/5 hidden lg:flex flex-col sticky top-0 h-screen z-30">
      <div className="p-6 border-b border-white/5">
        <Logo textSize="text-xl" href="/admin/dashboard" multiline={true} />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
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
    </aside>
  );
};

export default AdminSidebar;
