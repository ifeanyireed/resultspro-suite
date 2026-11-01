'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTenant } from '../TenantProvider';
import { useAuthStore } from '@/store/useAuthStore';
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
  PlayCircleIcon,
  ChartBarIcon,
  CreditCardIcon,
  EnvelopeIcon,
  BanknotesIcon,
  BuildingStorefrontIcon,
  FolderOpenIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { 
  Squares2X2Icon as Squares2X2Solid
} from '@heroicons/react/24/solid';

const studentMenu = [
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

const teacherMenu = [
  { name: 'Overview', icon: Squares2X2Icon, activeIcon: Squares2X2Solid, slug: '/teacher/dashboard' },
  { name: 'Classroom', icon: AcademicCapIcon, activeIcon: AcademicCapIcon, slug: '/teacher/classroom' },
  { name: 'My Classes', icon: BookOpenIcon, activeIcon: BookOpenIcon, slug: '/teacher/classes' },
  { name: 'Homework', icon: ClipboardDocumentListIcon, activeIcon: ClipboardDocumentListIcon, slug: '/teacher/homework' },
  { name: 'Assessments', icon: ChartBarIcon, activeIcon: ChartBarIcon, slug: '/teacher/assessments' },
];

const parentMenu = [
  { name: 'Dashboard', icon: Squares2X2Icon, activeIcon: Squares2X2Solid, slug: '/parent/dashboard' },
  { name: 'Future Skills', icon: ComputerDesktopIcon, activeIcon: ComputerDesktopIcon, slug: '/parent/future-skills' },
  { name: 'Results', icon: ChartPieIcon, activeIcon: ChartPieIcon, slug: '/parent/results' },
  { name: 'Classes', icon: AcademicCapIcon, activeIcon: AcademicCapIcon, slug: '/parent/classroom' },
  { name: 'Communications', icon: EnvelopeIcon, activeIcon: EnvelopeIcon, slug: '/parent/communications' },
  { name: 'Events', icon: CalendarIcon, activeIcon: CalendarIcon, slug: '/parent/events' },
  { name: 'Payments', icon: CreditCardIcon, activeIcon: CreditCardIcon, slug: '/parent/payments' },
  { name: 'Tutors', icon: UserGroupIcon, activeIcon: UserGroupIcon, slug: '/parent/tutors' },
];

const adminMenu = [
  { section: 'Dashboard', name: 'Overview', icon: Squares2X2Icon, activeIcon: Squares2X2Solid, slug: '/admin/pulse' },
  { section: 'Modular Suite', name: 'ClassroomPRO', icon: AcademicCapIcon, activeIcon: AcademicCapIcon, slug: '/admin/classrooms' },
  { name: 'TutorsPRO', icon: UserGroupIcon, activeIcon: UserGroupIcon, slug: '/admin/tutors' },
  { name: 'CoursesPRO', icon: BookOpenIcon, activeIcon: BookOpenIcon, slug: '/admin/cohorts' },
  { name: 'ResultsPRO', icon: ChartPieIcon, activeIcon: ChartPieIcon, slug: '/admin/results' },
  { section: 'Operations', name: 'Insights Hub', icon: ChartBarIcon, activeIcon: ChartBarIcon, slug: '/admin/insights' },
  { name: 'Class Timetable', icon: CalendarIcon, activeIcon: CalendarIcon, slug: '/admin/timetable' },
  { name: 'Fees', icon: BanknotesIcon, activeIcon: BanknotesIcon, slug: '/admin/fees' },
  { name: 'Enrollment', icon: UserGroupIcon, activeIcon: UserGroupIcon, slug: '/admin/enrollment' },
  { name: 'Transport', icon: TruckIcon, activeIcon: TruckIcon, slug: '/admin/transport' },
  { name: 'Procurement', icon: ShoppingCartIcon, activeIcon: ShoppingCartIcon, slug: '/admin/procurement' },
  { name: 'Library', icon: BookOpenIcon, activeIcon: BookOpenIcon, slug: '/admin/library' },
  { name: 'Hostel', icon: HomeModernIcon, activeIcon: HomeModernIcon, slug: '/admin/hostel' },
  { name: 'Performance', icon: ChartBarIcon, activeIcon: ChartBarIcon, slug: '/admin/performance' },
  { name: 'Operations Controls', icon: Cog6ToothIcon, activeIcon: Cog6ToothIcon, slug: '/admin/operations' },
];

const admissionsMenu = [
  { name: 'Overview', icon: Squares2X2Icon, activeIcon: Squares2X2Solid, slug: '/admin/admissions' },
  { name: 'Inquiries', icon: EnvelopeIcon, activeIcon: EnvelopeIcon, slug: '/admin/admissions/inquiries' },
  { name: 'Applications', icon: FolderOpenIcon, activeIcon: FolderOpenIcon, slug: '/admin/admissions/applications' },
  { name: 'Pipeline', icon: ChartBarIcon, activeIcon: ChartBarIcon, slug: '/admin/admissions/pipeline' },
];

const devRoles = [
  { name: 'Student Portal', slug: '/student/dashboard' },
  { name: 'Teacher Portal', slug: '/teacher/dashboard' },
  { name: 'Parent Portal', slug: '/parent/dashboard' },
  { name: 'Principal Portal', slug: '/admin/pulse' },
  { name: 'Admissions CRM', slug: '/admin/admissions' },
];

export default function PortalSidebar() {
  const pathname = usePathname();
  const { tenant, hasModule } = useTenant();
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
      if (pathname.includes('/admissions')) return admissionsMenu;
      return adminMenu;
    }
    return studentMenu;
  };

  const menuItems = getActiveMenu();

  return (
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
          {!menuItems[0]?.section && <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">MENU</p>}
          
          {menuItems.map((item, index) => {
            const isActive = pathname === item.slug;
            const Icon = isActive ? item.activeIcon : item.icon;
            return (
              <React.Fragment key={item.slug}>
                {item.section && (
                  <div className={`px-2 ${index > 0 ? 'mt-8' : ''} mb-3`}>
                    <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{item.section}</p>
                  </div>
                )}
                <Link 
                  href={item.slug} 
                  className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  <Icon className="w-6 h-6" />
                  {item.name}
                </Link>
              </React.Fragment>
            );
          })}
        </div>

        <div className="px-6 mt-10 space-y-1">
          <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">SWITCH ROLES</p>
          
          {devRoles.map((role) => {
            const isActive = pathname.startsWith(role.slug.split('/')[1] === 'admin' ? '/admin' : role.slug);
            return (
              <Link 
                key={role.slug}
                href={role.slug} 
                className={`flex items-center gap-3 text-sm px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <UserGroupIcon className="w-5 h-5" />
                {role.name}
              </Link>
            );
          })}
        </div>
        
        <div className="px-6 mt-10 space-y-1">
          <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">GENERAL</p>
          
          <Link href="/support" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${pathname === '/support' ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            <QuestionMarkCircleIcon className="w-6 h-6" />
            Help
          </Link>
          <button onClick={() => logout()} className="w-full text-left flex items-center gap-3 text-lg px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-normal relative transition-colors border-transparent">
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
            Logout
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 mt-8">
        <div 
          className="rounded-[1.5rem] p-6 text-white relative overflow-hidden shadow-lg bg-cover bg-center"
          style={{ backgroundImage: "url('/skies.jpeg')" }}
        >
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
          
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 relative z-10 shadow-sm border-2 border-white/50 overflow-hidden bg-white/20 backdrop-blur-sm">
            {mounted && <Image src={user?.avatarUrl || `/avatars/character${ (String(user?.id || user?.name || 'A').charCodeAt(0) % 20) || 1 }.jpg`} alt="User Avatar" width={40} height={40} className="w-full h-full object-cover" />}
            {!mounted && <Image src="/avatars/character1.jpg" alt="User Avatar" width={40} height={40} className="w-full h-full object-cover" />}
          </div>
          <h4 className="font-normal text-lg leading-tight mb-1 relative z-10">{mounted ? (user?.name || 'Loading...') : 'Loading...'}</h4>
          <p className="text-[10px] text-gray-300 mb-6 relative z-10">{mounted ? (user?.email || 'Loading...') : 'Loading...'}</p>
          
          <button className="w-full bg-[#146ef5] hover:bg-[#105bd1] transition-colors text-white text-xs font-semibold py-3 rounded-full relative z-10 shadow-md">
            View Profile
          </button>
        </div>
      </div>
    </>
  );
}
