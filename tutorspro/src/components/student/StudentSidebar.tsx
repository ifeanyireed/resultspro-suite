"use client";

import { IconLayoutDashboard as LayoutDashboard, IconCalendar as Calendar, IconVideo as Video, IconFileText as FileText, IconBrain as Brain, IconStack2 as Layers, IconGamepad2 as Gamepad2, IconLineChart as LineChart, IconAward as Award, IconMessageSquare as MessageSquare, IconWallet as Wallet, IconSettings as Settings, IconSearch as Search, IconLogOut as LogOut } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '../Logo';
import { useAuthStore } from '@/store/useAuthStore';

const StudentSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/student/dashboard' },
    { label: 'Find a Tutor', icon: Search, href: '/student/find-tutor' },
    { label: 'Upcoming Classes', icon: Calendar, href: '/student/classes' },
    { label: 'Live Classroom', icon: Video, href: '/student/classroom' },
    { label: 'Assignments', icon: FileText, href: '/student/assignments' },
    { label: 'Quizzes', icon: Brain, href: '/student/quizzes' },
    { label: 'Flashcards', icon: Layers, href: '/student/flashcards' },
    { label: 'Games Hub', icon: Gamepad2, href: '/student/games' },
    { label: 'Progress Reports', icon: LineChart, href: '/student/progress' },
    { label: 'Certificates', icon: Award, href: '/student/certificates' },
    { label: 'Messages', icon: MessageSquare, href: '/student/messages' },
    { label: 'Wallet', icon: Wallet, href: '/student/wallet' },
    { label: 'Settings', icon: Settings, href: '/student/settings' },
  ];

  return (
    <aside className="w-64 bg-navy border-r border-white/5 hidden lg:flex flex-col sticky top-0 h-screen z-30">
      <div className="p-6 border-b border-white/5">
        <Logo textSize="text-xl" href="/student/dashboard" multiline={true} />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/student/dashboard' && pathname.startsWith(item.href));
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
          <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-green text-xs font-bold uppercase">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{user?.name || 'Student'}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-tight">Student Role</div>
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

export default StudentSidebar;
