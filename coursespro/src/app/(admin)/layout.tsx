"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TenantLogo from '@/components/TenantLogo';
import { usePathname } from 'next/navigation';
import api, { getTenantSlug } from '@/lib/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
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
  ShoppingBagIcon,
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
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  
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
      isCollapsed={isCollapsed}
      sidebarContent={
        <>
          
          <div>
            {/* Logo */}
            <div className={`${isCollapsed ? 'px-4' : 'px-8'} mb-6 flex items-center justify-between`}>
              {!isCollapsed ? (
                <TenantLogo 
                  theme="light"
                  height={48}
                  logoUrl={logoUrl}
                  tenantName={tenantName}
                  className="w-auto h-12 object-contain"
                />
              ) : (
                <div className="w-8 h-8 overflow-hidden flex items-center justify-start shrink-0">
                  <TenantLogo 
                    theme="light"
                    height={28}
                    logoUrl={logoUrl}
                    tenantName={tenantName}
                    className="w-auto h-7 object-left max-w-none"
                  />
                </div>
              )}
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 ${isCollapsed ? 'absolute -right-4 top-6 bg-white border border-gray-200 shadow-sm z-50' : ''}`}
              >
                {isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-5 h-5" />}
              </button>
            </div>

                        {/* Menu Sections */}
            <div className={`${isCollapsed ? 'px-3' : 'px-6'} space-y-1`}>
              {!isCollapsed && <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">{tenantName}</p>}
              
              <Link href="/admin/program-builder" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/program-builder') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <Squares2X2Icon className="w-6 h-6 shrink-0" />
                {!isCollapsed && <span className="truncate">Program Builder</span>}
              </Link>

              <Link href="/admin/cohorts" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/cohorts') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <CalendarIcon className="w-6 h-6 shrink-0" />
                {!isCollapsed && <span className="truncate">Cohort Configurator</span>}
              </Link>

              <Link href="/admin/students" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/students') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <UserGroupIcon className="w-6 h-6 shrink-0" />
                {!isCollapsed && <span className="truncate">Students</span>}
              </Link>

              <Link href="/admin/mentors" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/mentors') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <AcademicCapIcon className="w-6 h-6 shrink-0" />
                {!isCollapsed && <span className="truncate">Mentors</span>}
              </Link>
              
              <Link href="/admin/payments" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/payments') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <BriefcaseIcon className="w-6 h-6 shrink-0" />
                {!isCollapsed && <span className="truncate">Payments</span>}
              </Link>
              <Link href="/admin/store" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/store') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <ShoppingBagIcon className="w-6 h-6 shrink-0" strokeWidth={2} />
                {!isCollapsed && <span className="truncate">Store</span>}
              </Link>


              <Link href="/admin/reports" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/reports') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <DocumentDuplicateIcon className="w-6 h-6 shrink-0" />
                {!isCollapsed && <span className="truncate">Reports</span>}
              </Link>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <Link href="/admin/settings" className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${isActive('/admin/settings') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                  <Cog6ToothIcon className="w-6 h-6 shrink-0" />
                  {!isCollapsed && <span className="truncate">Settings</span>}
                </Link>
                <button onClick={() => logout()} className="w-full text-left flex items-center gap-3 text-lg px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-normal relative transition-colors border-transparent">
                  <ArrowRightOnRectangleIcon className="w-6 h-6 shrink-0" />
                  {!isCollapsed && <span className="truncate">Logout</span>}
                </button>
              </div>
            </div>
          </div>

          {/* User Info */}
          {!isCollapsed ? (
          <div className="px-6 mt-8">
            <div 
              className="rounded-[1.5rem] p-6 text-white relative overflow-hidden shadow-lg bg-cover bg-center"
              style={{ backgroundImage: "url('/abstract-blue-2.jpg')" }}
            >
              <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 relative z-10 shadow-sm border-2 border-white/50 overflow-hidden bg-white/20 backdrop-blur-sm">
                {mounted && <Image src={user?.avatarUrl || `/avatars/character4.jpg`} alt="User Avatar" width={40} height={40} className="w-full h-full object-cover" />}
                {!mounted && <Image src="/avatars/character4.jpg" alt="User Avatar" width={40} height={40} className="w-full h-full object-cover" />}
              </div>
              <h4 className="font-normal text-lg leading-tight mb-1 relative z-10">{mounted ? (user?.name || profileName) : 'Loading...'}</h4>
              <p className="text-[10px] text-gray-300 mb-6 relative z-10">{mounted ? (user?.email || profileEmail) : 'Loading...'}</p>
              
              <button className="w-full bg-[#146ef5] hover:bg-[#105bd1] transition-colors text-white text-xs font-semibold py-3 rounded-full relative z-10 shadow-md">
                View Profile
              </button>
            </div>
          </div>
          ) : (
            <div className="px-2 mt-8 flex justify-center">
               <div className="w-10 h-10 rounded-full flex items-center justify-center relative z-10 shadow-sm border border-gray-200 overflow-hidden bg-white/20 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                {mounted && <Image src={user?.avatarUrl || `/avatars/character4.jpg`} alt="User Avatar" width={40} height={40} className="w-full h-full object-cover" />}
                {!mounted && <Image src="/avatars/character4.jpg" alt="User Avatar" width={40} height={40} className="w-full h-full object-cover" />}
              </div>
            </div>
          )}
        
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
                  {mounted && <img src={user?.avatarUrl || `/avatars/character4.jpg`} alt="Admin Avatar" className="w-full h-full object-cover" />}
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
