'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ArrowsRightLeftIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/useAuthStore';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleSidebar: () => {},
  setCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

interface RoleProfile {
  id: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  portalName: string;
  fullName: string;
  subtitle: string;
  email: string;
  avatar: string;
  slug: string;
  accentColor: string;
}

const ROLE_PROFILES: RoleProfile[] = [
  {
    id: 'profile-student',
    role: 'student',
    portalName: 'Student Portal',
    fullName: 'Chidinma Adeleke',
    subtitle: 'SSS 2 Science · GHA/2026/0142',
    email: 'chidinma.adeleke@greenwood.scholars.ng',
    avatar: '/avatars/character4.jpg',
    slug: '/student/dashboard',
    accentColor: '#146ef5',
  },
  {
    id: 'profile-teacher',
    role: 'teacher',
    portalName: 'Teacher Portal',
    fullName: 'Mr. Tunde Ogunleye',
    subtitle: 'Senior STEM & Coding Educator',
    email: 'tunde.ogunleye@greenwood.scholars.ng',
    avatar: '/avatars/character2.jpg',
    slug: '/teacher/dashboard',
    accentColor: '#10b981',
  },
  {
    id: 'profile-parent',
    role: 'parent',
    portalName: 'Parent Portal',
    fullName: 'Chief & Mrs. O. Adeleke',
    subtitle: 'Parent / Guardian · 2 Wards',
    email: 'adeleke.family@gmail.com',
    avatar: '/avatars/character3.jpg',
    slug: '/parent/dashboard',
    accentColor: '#8b5cf6',
  },
  {
    id: 'profile-principal',
    role: 'admin',
    portalName: 'Principal Portal',
    fullName: 'Dr. (Mrs.) Folake Adeyemi',
    subtitle: 'Principal & Head of School',
    email: 'principal@greenwood.scholars.ng',
    avatar: '/avatars/character1.jpg',
    slug: '/admin/pulse',
    accentColor: '#f59e0b',
  },
  {
    id: 'profile-admissions',
    role: 'admin',
    portalName: 'Admissions CRM',
    fullName: 'Mrs. Amina Bello-Yusuf',
    subtitle: 'Admissions Registrar & VP',
    email: 'admissions@greenwood.scholars.ng',
    avatar: '/avatars/character5.jpg',
    slug: '/admin/admissions',
    accentColor: '#ec4899',
  },
];

interface ModernDashboardLayoutProps {
  sidebarContent: React.ReactNode;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

export function ModernDashboardLayout({ sidebarContent, headerContent, children }: ModernDashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('scholars_sidebar_collapsed');
      if (saved === 'true') setIsCollapsed(true);
    } catch {
      // ignore
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('scholars_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const getActiveProfile = (): RoleProfile => {
    if (pathname.startsWith('/admin/admissions')) return ROLE_PROFILES[4];
    if (pathname.startsWith('/admin')) return ROLE_PROFILES[3];
    if (pathname.startsWith('/teacher')) return ROLE_PROFILES[1];
    if (pathname.startsWith('/parent')) return ROLE_PROFILES[2];
    return ROLE_PROFILES[0];
  };

  const activeProfile = getActiveProfile();

  const handleSelectProfile = (profile: RoleProfile) => {
    setAuth(
      {
        id: profile.id,
        name: profile.fullName,
        full_name: profile.fullName,
        email: profile.email,
        role: profile.role,
        avatar_url: profile.avatar,
        avatarUrl: profile.avatar,
      } as any,
      `demo-jwt-${profile.role}`,
      ''
    );
    document.cookie = `user_role=${profile.role}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `token=demo-jwt-${profile.role}; path=/; max-age=86400; SameSite=Lax`;
    setSwitcherOpen(false);
    router.push(profile.slug);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, setCollapsed: setIsCollapsed }}>
      <div className="dashboard-page min-h-screen bg-[#f9fafc] font-sans text-gray-900 flex relative">
        {/* Sidebar Wrapper - Sticky with Floating Collapse Button */}
        <div
          className={`relative shrink-0 transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-[84px]' : 'w-[280px]'
          }`}
        >
          <aside
            className="w-full bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 overflow-hidden transition-all duration-300 ease-in-out"
          >
            {sidebarContent}
          </aside>

          {/* Floating Collapse / Expand Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expand sidebar menu' : 'Collapse sidebar menu'}
            title={isCollapsed ? 'Expand menu' : 'Collapse menu'}
            style={{
              position: 'fixed',
              top: '28px',
              left: isCollapsed ? '68px' : '264px',
              zIndex: 50,
              transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s ease, background-color 0.15s ease'
            }}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:border-[#146ef5] text-gray-600 hover:text-[#146ef5] flex items-center justify-center cursor-pointer active:scale-95"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>

        {/* Main Content Area - Native Scroll */}
        <main className="flex-1 flex flex-col min-h-screen min-w-0">
          {/* Header */}
          {headerContent && (
            <header className="h-24 px-6 flex items-center justify-between shrink-0 sticky top-0 bg-[#f9fafc] z-10">
              {headerContent}
            </header>
          )}

          {/* Dashboard Content */}
          <div className="flex-1 px-6 pb-20 min-w-0 max-w-full">
            {children}
          </div>
        </main>

        {/* ── Floating "SWITCH ROLES" Profile Switcher ── */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          {/* Expanded Profile List Popover */}
          {switcherOpen && (
            <div className="mb-3 w-[340px] bg-white rounded-3xl shadow-2xl border border-gray-200/90 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="px-5 py-4 bg-gradient-to-r from-[#0D1060] to-[#1A1FA8] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowsRightLeftIcon className="w-4 h-4 text-[#FBBC04]" />
                  <span className="text-xs font-bold uppercase tracking-widest">Switch Role Profile</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/90">
                  5 Profiles
                </span>
              </div>

              <div className="p-2.5 max-h-[380px] overflow-y-auto space-y-1.5">
                {ROLE_PROFILES.map((prof) => {
                  const isCurrent = activeProfile.id === prof.id;
                  return (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => handleSelectProfile(prof)}
                      className={`w-full text-left p-3 rounded-2xl flex items-center gap-3.5 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-50/90 border border-[#146ef5]/40 shadow-sm'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={prof.avatar}
                          alt={prof.fullName}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                          style={{ backgroundColor: prof.accentColor }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#146ef5]">
                            {prof.portalName}
                          </span>
                          {isCurrent && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckBadgeIcon className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-bold text-gray-900 truncate">{prof.fullName}</div>
                        <div className="text-[11px] text-gray-500 truncate">{prof.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Floating Trigger Pill */}
          <button
            type="button"
            onClick={() => setSwitcherOpen((prev) => !prev)}
            className="group bg-white hover:bg-gray-50 text-gray-900 pl-2.5 pr-4 py-2 rounded-full shadow-xl hover:shadow-2xl border border-gray-200 flex items-center gap-3 transition-all cursor-pointer active:scale-95"
          >
            <div className="relative">
              <img
                src={activeProfile.avatar}
                alt={activeProfile.fullName}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#146ef5]"
              />
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                style={{ backgroundColor: activeProfile.accentColor }}
              />
            </div>

            <div className="text-left mr-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#146ef5] leading-none mb-1 flex items-center gap-1">
                <span>Switch Roles</span>
                <span className="text-gray-300">·</span>
                <span>{activeProfile.portalName}</span>
              </div>
              <div className="text-xs font-bold text-gray-900 leading-none">
                {activeProfile.fullName}
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-[#146ef5] group-hover:text-white text-gray-600 flex items-center justify-center transition-colors">
              <ChevronUpIcon
                className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${
                  switcherOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
