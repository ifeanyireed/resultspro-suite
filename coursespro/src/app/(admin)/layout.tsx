"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TenantLogo from '@/components/TenantLogo';
import { usePathname } from 'next/navigation';
import api, { getTenantSlug } from '@/lib/api';
import { 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  BellIcon,
  Squares2X2Icon,
  MapIcon,
  BriefcaseIcon,
  FolderOpenIcon,
  VideoCameraIcon,
  UserGroupIcon,
  ChatBubbleLeftEllipsisIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  GlobeAltIcon,
  StarIcon,
  AcademicCapIcon,
  TrophyIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { 
  Squares2X2Icon as Squares2X2Solid,
} from '@heroicons/react/24/solid';

import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { useAuthStore } from '@/store/useAuthStore';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [mounted, setMounted] = React.useState(false);
  const [tenantName, setTenantName] = React.useState('ADMIN');
  const [logoUrl, setLogoUrl] = React.useState('/logo.png');
  const [profileName, setProfileName] = React.useState('Loading...');
  const [profileEmail, setProfileEmail] = React.useState('Loading...');

  
  React.useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    setMounted(true);
    const fetchTenant = async () => {
      try {
        const slug = getTenantSlug();
        const res = await api.get(`/api/public/tenant/resolve?domain=${slug}`);
        if (res.data && res.data.tenant && res.data.tenant.name) {
          setTenantName(res.data.tenant.name.toUpperCase());
          
          if (res.data.tenant.contact_person_name) {
            setProfileName(res.data.tenant.contact_person_name);
          }
          if (res.data.tenant.contact_email) {
            setProfileEmail(res.data.tenant.contact_email);
          }

          // Dynamically set favicon to dark logo (or fallback)
          const faviconUrl = res.data.tenant.dark_logo_url || res.data.tenant.logo_url;
          if (faviconUrl) {
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = faviconUrl;
          }
          if (res.data.tenant.logo_url) {
            setLogoUrl(res.data.tenant.logo_url);
          }
        }
      } catch (err) {
        const slug = getTenantSlug();
        if (slug && slug !== 'localhost' && slug !== 'coursespro') {
          setTenantName(slug.toUpperCase());
        }
      }
    };
    fetchTenant();
  }, [isAuthenticated, user]);

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <ModernDashboardLayout
      sidebarContent={
        <>
          
          <div>
            {/* Logo */}
            <div className="px-8 mb-6">
              <TenantLogo 
                theme="light"
                height={48}
                logoUrl={logoUrl}
                tenantName={tenantName}
                className="w-auto h-12 object-contain"
              />
            </div>

                        {/* Menu Sections */}
            <div className="px-6 space-y-1">
              <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">{tenantName}</p>
              
              <Link href="/admin/program-builder" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/program-builder') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <Squares2X2Icon className="w-6 h-6" />
                Program Builder
              </Link>

              <Link href="/admin/cohorts" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/cohorts') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <CalendarIcon className="w-6 h-6" />
                Cohort Configurator
              </Link>

              <Link href="/admin/mentors" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/mentors') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <AcademicCapIcon className="w-6 h-6" />
                Mentor Management
              </Link>
              
              <Link href="/admin/payments" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/payments') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <BriefcaseIcon className="w-6 h-6" />
                Payments
              </Link>
              <Link href="/admin/store" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/store') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <div className={`${isActive('/admin/store') ? 'bg-[#146ef5]' : 'bg-gray-100'} p-2 rounded-lg`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${isActive('/admin/store') ? 'text-white' : 'text-gray-500'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                  </svg>
                </div>
                Store
              </Link>


              <Link href="/admin/reports" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/reports') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <DocumentDuplicateIcon className="w-6 h-6" />
                Reports
              </Link>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <Link href="/admin/settings" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/settings') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                  <Cog6ToothIcon className="w-6 h-6" />
                  Settings
                </Link>
                <button onClick={() => logout()} className="w-full text-left flex items-center gap-3 text-lg px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-normal relative transition-colors border-transparent">
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 mt-8">
            <div 
              className="rounded-[1.5rem] p-6 text-white relative overflow-hidden shadow-lg bg-cover bg-center"
              style={{ backgroundImage: "url('/abstract-blue-2.jpg')" }}
            >
              <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 relative z-10 shadow-sm border-2 border-white/50 overflow-hidden bg-white/20 backdrop-blur-sm">
                {mounted && <Image src={user?.avatarUrl || `/avatars/character${ (String(user?.id || user?.name || profileName || 'A').charCodeAt(0) % 20) || 1 }.jpg`} alt="User Avatar" width={40} height={40} className="w-full h-full object-cover" />}
                {!mounted && <Image src="/avatars/character1.jpg" alt="User Avatar" width={40} height={40} className="w-full h-full object-cover" />}
              </div>
              <h4 className="font-normal text-lg leading-tight mb-1 relative z-10">{mounted ? (user?.name || profileName) : 'Loading...'}</h4>
              <p className="text-[10px] text-gray-300 mb-6 relative z-10">{mounted ? (user?.email || profileEmail) : 'Loading...'}</p>
              
              <button className="w-full bg-[#146ef5] hover:bg-[#105bd1] transition-colors text-white text-xs font-semibold py-3 rounded-full relative z-10 shadow-md">
                View Profile
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
                placeholder="Search courses, sprints, peers..." 
                className="w-full bg-white border border-white focus:border-gray-200 outline-none rounded-xl py-3 pl-12 pr-12 text-sm text-gray-700 shadow-sm transition-colors placeholder:text-gray-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gray-100 rounded px-1.5 py-0.5 border border-gray-200">
                <span className="text-[10px] font-medium text-gray-500">⌘</span>
                <span className="text-[10px] font-medium text-gray-500">K</span>
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
                  {mounted && <img src={user?.avatarUrl || `/avatars/character${ (String(user?.id || user?.name || profileName || 'A').charCodeAt(0) % 20) || 1 }.jpg`} alt="Admin Avatar" className="w-full h-full object-cover" />}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{mounted ? (user?.name || profileName) : 'Loading...'}</p>
                  <p className="text-xs text-gray-500">{mounted ? (user?.email || profileEmail) : 'Loading...'}</p>
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
