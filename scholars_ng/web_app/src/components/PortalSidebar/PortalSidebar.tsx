'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTenant } from '../TenantProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { useSidebar } from '@/components/layout/ModernDashboardLayout';
import { 
  Squares2X2Icon,
  HomeModernIcon,
  ShoppingCartIcon,
  TruckIcon,
  AcademicCapIcon,
  CalendarIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  CreditCardIcon,
  EnvelopeIcon,
  BanknotesIcon,
  FolderOpenIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ComputerDesktopIcon,
  PuzzlePieceIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { 
  Squares2X2Icon as Squares2X2Solid
} from '@heroicons/react/24/solid';

type MenuItem = {
  name: string;
  icon: any;
  activeIcon: any;
  slug: string;
  section?: string;
};

const studentMenu: MenuItem[] = [
  { name: 'Overview', icon: Squares2X2Icon, activeIcon: Squares2X2Solid, slug: '/student/dashboard' },
  { name: 'Classroom', icon: AcademicCapIcon, activeIcon: AcademicCapIcon, slug: '/student/classroom' },
  { name: 'Timetable', icon: CalendarIcon, activeIcon: CalendarIcon, slug: '/student/timetable' },
  { name: 'Homework', icon: ClipboardDocumentListIcon, activeIcon: ClipboardDocumentListIcon, slug: '/student/homework' },
  { name: 'Library', icon: BookOpenIcon, activeIcon: BookOpenIcon, slug: '/student/learning' },
  { name: 'Exams', icon: ChartBarIcon, activeIcon: ChartBarIcon, slug: '/student/exams' },
  { name: 'Results', icon: ChartPieIcon, activeIcon: ChartPieIcon, slug: '/student/results' },
  { name: 'Tutors', icon: UserGroupIcon, activeIcon: UserGroupIcon, slug: '/student/tutors' },
  { name: 'Future Skills', icon: ComputerDesktopIcon, activeIcon: ComputerDesktopIcon, slug: '/student/future-skills' },
];

const teacherMenu: MenuItem[] = [
  { name: 'Overview', icon: Squares2X2Icon, activeIcon: Squares2X2Solid, slug: '/teacher/dashboard' },
  { name: 'Classroom', icon: AcademicCapIcon, activeIcon: AcademicCapIcon, slug: '/teacher/classroom' },
  { name: 'My Classes', icon: BookOpenIcon, activeIcon: BookOpenIcon, slug: '/teacher/classes' },
  { name: 'Homework', icon: ClipboardDocumentListIcon, activeIcon: ClipboardDocumentListIcon, slug: '/teacher/homework' },
  { name: 'Assessments', icon: ChartBarIcon, activeIcon: ChartBarIcon, slug: '/teacher/assessments' },
];

const parentMenu: MenuItem[] = [
  { name: 'Dashboard', icon: Squares2X2Icon, activeIcon: Squares2X2Solid, slug: '/parent/dashboard' },
  { name: 'Future Skills', icon: ComputerDesktopIcon, activeIcon: ComputerDesktopIcon, slug: '/parent/future-skills' },
  { name: 'Results', icon: ChartPieIcon, activeIcon: ChartPieIcon, slug: '/parent/results' },
  { name: 'Classes', icon: AcademicCapIcon, activeIcon: AcademicCapIcon, slug: '/parent/classroom' },
  { name: 'Communications', icon: EnvelopeIcon, activeIcon: EnvelopeIcon, slug: '/parent/communications' },
  { name: 'Events', icon: CalendarIcon, activeIcon: CalendarIcon, slug: '/parent/events' },
  { name: 'Payments', icon: CreditCardIcon, activeIcon: CreditCardIcon, slug: '/parent/payments' },
  { name: 'Tutors', icon: UserGroupIcon, activeIcon: UserGroupIcon, slug: '/parent/tutors' },
];

const adminMenu: MenuItem[] = [
  { section: 'Dashboard', name: 'Overview', icon: Squares2X2Icon, activeIcon: Squares2X2Solid, slug: '/admin/pulse' },
  { name: 'Website CMS', icon: ComputerDesktopIcon, activeIcon: ComputerDesktopIcon, slug: '/admin/website' },
  { section: 'Modular Suite', name: 'ClassroomPRO', icon: AcademicCapIcon, activeIcon: AcademicCapIcon, slug: '/admin/classrooms' },
  { name: 'TutorsPRO', icon: UserGroupIcon, activeIcon: UserGroupIcon, slug: '/admin/tutors' },
  { name: 'PuzzlePRO', icon: PuzzlePieceIcon, activeIcon: PuzzlePieceIcon, slug: '/admin/puzzlepro' },
  { name: 'ResultsPRO', icon: ChartPieIcon, activeIcon: ChartPieIcon, slug: '/admin/results' },
  { section: 'Operations', name: 'CampusPRO', icon: HomeModernIcon, activeIcon: HomeModernIcon, slug: '/admin/campus-os' },
];

export default function PortalSidebar() {
  const pathname = usePathname();
  const { tenant, hasModule } = useTenant();
  const { isCollapsed } = useSidebar();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getActiveMenu = () => {
    if (pathname.startsWith('/teacher')) return teacherMenu;
    if (pathname.startsWith('/parent')) return parentMenu;
    if (pathname.startsWith('/admin')) {
      return adminMenu;
    }
    return studentMenu;
  };

  const isModuleEnabled = (slug: string) => {
    if (!tenant || !tenant.enabled_modules) return true;
    if (slug.includes('classroom')) return hasModule('classroompro');
    if (slug.includes('tutors')) return hasModule('tutorspro');
    if (slug.includes('results')) return hasModule('resultspro');
    if (slug.includes('future-skills') || slug.includes('puzzlepro')) return hasModule('puzzlepro');
    return true;
  };

  const menuItems = getActiveMenu().filter(item => isModuleEnabled(item.slug));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sticky Logo Header */}
      <div className={`${isCollapsed ? 'px-3 flex justify-center' : 'px-8'} pt-4 pb-4 bg-white sticky top-0 z-20 shrink-0 border-b border-gray-100/80 transition-all`}>
        <Link href="/">
          <Image 
            src={tenant?.logo_url || "/logo.png"} 
            alt={tenant?.name || "ResultsPRO"} 
            width={isCollapsed ? 44 : 300} 
            height={isCollapsed ? 44 : 80} 
            className={isCollapsed ? "w-11 h-11 object-contain" : "w-auto h-20 object-contain"} 
          />
        </Link>
      </div>

      {/* Scrollable Navigation & Profile Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4 flex flex-col justify-between">
        <div>
          {/* Menu Sections */}
          <div className={`${isCollapsed ? 'px-2' : 'px-6'} space-y-1 transition-all`}>
            {!isCollapsed && !menuItems[0]?.section && (
              <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">MENU</p>
            )}
            
            {menuItems.map((item, index) => {
              const isActive = pathname === item.slug || (item.slug !== '/' && pathname.startsWith(item.slug + '/'));
              const Icon = isActive ? item.activeIcon : item.icon;
              return (
                <React.Fragment key={item.slug}>
                  {!isCollapsed && item.section && (
                    <div className={`px-2 ${index > 0 ? 'mt-8' : ''} mb-3`}>
                      <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{item.section}</p>
                    </div>
                  )}
                  {isCollapsed && item.section && index > 0 && (
                    <div className="my-3 border-t border-gray-100" />
                  )}
                  <Link 
                    href={item.slug}
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center ${isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-4 py-2'} text-lg rounded-xl font-normal relative transition-colors ${isActive ? 'text-[#146ef5] bg-blue-50/50 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    <Icon className="w-6 h-6 shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                </React.Fragment>
              );
            })}
          </div>
          
          <div className={`${isCollapsed ? 'px-2 mt-6 pt-4 border-t border-gray-100' : 'px-6 mt-10'} space-y-1`}>
            {!isCollapsed && <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">GENERAL</p>}
            
            <Link
              href="/support"
              title={isCollapsed ? 'Help' : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-4 py-2'} text-lg rounded-xl font-normal relative transition-colors ${pathname === '/support' ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <QuestionMarkCircleIcon className="w-6 h-6 shrink-0" />
              {!isCollapsed && <span>Help</span>}
            </Link>
            <button
              onClick={() => logout()}
              title={isCollapsed ? 'Logout' : undefined}
              className={`w-full text-left flex items-center ${isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-4 py-2'} text-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-normal relative transition-colors border-transparent cursor-pointer`}
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6 shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className={`${isCollapsed ? 'px-2 flex justify-center' : 'px-6'} mt-8`}>
          {isCollapsed ? (
            <div
              title={mounted ? ((user as any)?.full_name || (user as any)?.name || 'Profile') : 'Profile'}
              className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#146ef5] shadow-md"
            >
              {mounted ? (
                <Image
                  src={(user as any)?.avatarUrl || (user as any)?.avatar_url || `/avatars/character${(String(user?.id || (user as any)?.name || 'A').charCodeAt(0) % 20) || 1}.jpg`}
                  alt="User Avatar"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image src="/avatars/character1.jpg" alt="User Avatar" width={44} height={44} className="w-full h-full object-cover" />
              )}
            </div>
          ) : (
            <div 
              className="rounded-[1.5rem] p-6 text-white relative overflow-hidden shadow-lg bg-cover bg-center"
              style={{ backgroundImage: "url('/skies.jpeg')" }}
            >
              <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 relative z-10 shadow-sm border-2 border-white/50 overflow-hidden bg-white/20 backdrop-blur-sm">
                {mounted && <Image src={(user as any)?.avatarUrl || (user as any)?.avatar_url || `/avatars/character${ (String(user?.id || (user as any)?.name || 'A').charCodeAt(0) % 20) || 1 }.jpg`} alt="User Avatar" width={40} height={40} className="w-full h-full object-cover" />}
                {!mounted && <Image src="/avatars/character1.jpg" alt="User Avatar" width={40} height={40} className="w-full h-full object-cover" />}
              </div>
              <h4 className="font-normal text-lg leading-tight mb-1 relative z-10">{mounted ? ((user as any)?.full_name || (user as any)?.name || 'Loading...') : 'Loading...'}</h4>
              <p className="text-[10px] text-gray-300 mb-6 relative z-10">{mounted ? (user?.email || 'Loading...') : 'Loading...'}</p>
              
              <button className="w-full bg-[#146ef5] hover:bg-[#105bd1] transition-colors text-white text-xs font-semibold py-3 rounded-full relative z-10 shadow-md">
                View Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
