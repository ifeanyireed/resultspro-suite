import { IconLayoutDashboard as LayoutDashboard, IconBook as BookOpen, IconBrain as BrainCircuit, IconStack2 as Layers, IconCertificate as GraduationCap, IconTrendingUp as TrendingUp, IconDownload as Download, IconSettings as Settings, IconLogout as LogOut, IconBell as Bell, IconUsers as Users, IconSchool as School, IconFilePlus as FilePlus, IconChartBar as BarChart3, IconCalendar as Calendar, IconTrophy as Trophy, IconBookmark as Bookmark, IconLibrary as Library, IconHeart as Heart, IconMessage as MessageSquare, IconCreditCard as CreditCard } from '@tabler/icons-react';
import { useAuthStore } from "@/store/useAuthStore";
import { Role } from "@/lib/roles";
import { useEffect, useState } from "react";
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
  ClipboardDocumentCheckIcon,
  BuildingStorefrontIcon,
  WalletIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { 
  Squares2X2Icon as Squares2X2Solid,
} from '@heroicons/react/24/solid';

import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const logoutStore = useAuthStore((state) => state.logout);
  const router = useRouter();
  
  const handleLogout = () => {
    logoutStore();
    router.push("/login");
  };
  const [role, setRole] = useState(Role.STUDENT);

  useEffect(() => {
    if (user) setRole(user.role as Role);
  }, [user]);

  const studentItems = [
    { icon: <LayoutDashboard className="w-6 h-6" />, label: "Dashboard", href: "/dashboard" },
    { icon: <Library className="w-6 h-6" />, label: "Library", href: "/dashboard/subjects" },
    { icon: <BookOpen className="w-6 h-6" />, label: "Class Notes", href: "/dashboard/notes" },
    { icon: <BrainCircuit className="w-6 h-6" />, label: "My Quizzes", href: "/dashboard/quizzes" },
    { icon: <Layers className="w-6 h-6" />, label: "Flashcards", href: "/dashboard/flashcards" },
    { icon: <GraduationCap className="w-6 h-6" />, label: "My Exams", href: "/dashboard/exams" },
    { icon: <TrendingUp className="w-6 h-6" />, label: "My Progress", href: "/dashboard/progress" },
    { icon: <Trophy className="w-6 h-6" />, label: "Leaderboard", href: "/dashboard/leaderboard" },
  ];

  const teacherItems = [
    { icon: <LayoutDashboard className="w-6 h-6" />, label: "Teacher Home", href: "/dashboard/teacher" },
    { icon: <MessageSquare className="w-6 h-6" />, label: "Messages", href: "/dashboard/teacher/messages" },
    { icon: <Users className="w-6 h-6" />, label: "My Classes", href: "/dashboard/teacher/classes" },
    { icon: <BarChart3 className="w-6 h-6" />, label: "Analytics", href: "/dashboard/teacher/analytics" },
    { icon: <Settings className="w-6 h-6" />, label: "Settings", href: "/dashboard/settings" },
  ];

  const adminItems = [
    { icon: <LayoutDashboard className="w-6 h-6" />, label: "Admin Panel", href: "/dashboard/admin" },
    { icon: <School className="w-6 h-6" />, label: "Manage School", href: "/dashboard/admin/school" },
    { icon: <Users className="w-6 h-6" />, label: "Manage Teachers", href: "/dashboard/admin/teachers" },
    { icon: <GraduationCap className="w-6 h-6" />, label: "Manage Students", href: "/dashboard/admin/students" },
    { icon: <BarChart3 className="w-6 h-6" />, label: "Reports", href: "/dashboard/admin/reports" },
  ];

  const getMenuItems = () => {
    switch (role) {
      case Role.SCHOOL_ADMIN: return adminItems;
      case Role.TEACHER: return teacherItems;
      default: return studentItems;
    }
  };

  const menuItems = getMenuItems();

  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;


  return (
    <ModernDashboardLayout
      sidebarContent={
        <>
          
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
              <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">MENU</p>
              
              {menuItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive(item.href) ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="px-6 mt-10 space-y-1">
              <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">GENERAL</p>
              
              <Link href="/agent/settings" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/agent/settings') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <Cog6ToothIcon className="w-6 h-6" />
                Settings
              </Link>
              <Link href="/agent/help" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/agent/help') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <QuestionMarkCircleIcon className="w-6 h-6" />
                Help
              </Link>
              <button onClick={handleLogout} className="flex w-full items-center gap-3 text-lg px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-normal relative transition-colors border-transparent">
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                Logout
              </button>
            </div>
          </div>

          {/* Bottom App Promo */}
          <div className="px-6 mt-8">
            <div 
              className="rounded-[1.5rem] p-6 text-white relative overflow-hidden shadow-lg bg-cover bg-center"
              style={{ backgroundImage: "url('/abstract-blue-2.jpg')" }}
            >
              {/* Lighter overlay for text readability */}
              <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-4 relative z-10 backdrop-blur-sm">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#146ef5] rounded-full"></div>
                </div>
              </div>
              <h4 className="font-normal text-lg leading-tight mb-1 relative z-10">Download our<br/>Mobile App</h4>
              <p className="text-[10px] text-gray-300 mb-6 relative z-10">Get easy in another way</p>
              
              <button className="w-full bg-[#146ef5] hover:bg-[#105bd1] transition-colors text-white text-xs font-semibold py-3 rounded-full relative z-10 shadow-md">
                Download
              </button>
            </div>
          </div>
        
        </>
      }
      headerContent={
        <>
          
            <div className="relative w-96">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="w-full bg-white border border-white focus:border-gray-200 outline-none rounded-xl py-3 pl-12 pr-12 text-sm text-gray-700 shadow-sm transition-colors placeholder:text-gray-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gray-100 rounded px-1.5 py-0.5 border border-gray-200">
                <span className="text-[10px] font-medium text-gray-500">⌘</span>
                <span className="text-[10px] font-medium text-gray-500">F</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-900 transition-colors">
                <EnvelopeIcon className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-900 transition-colors relative">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3 ml-2 border-l border-gray-200 pl-6">
                <div className="w-10 h-10 bg-gradient-to-tr from-orange-200 to-orange-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                  <img src="/avatars/character7.jpg" alt="Agent Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-gray-900 leading-tight">Totok Michael</p>
                  <p className="text-xs text-gray-500">tmichael20@gmail.com</p>
                </div>
              </div>
            </div>
          
        </>
      }
    >
      {children}
    </ModernDashboardLayout>
  );
}
