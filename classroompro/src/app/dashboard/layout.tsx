"use client";
import {
  IconLayoutDashboard as LayoutDashboard,
  IconBook as BookOpen,
  IconVideo as VideoIcon,
  IconBrain as BrainCircuit,
  IconStack2 as Layers,
  IconCertificate as GraduationCap,
  IconTrendingUp as TrendingUp,
  IconDownload as Download,
  IconSettings as Settings,
  IconUsers as Users,
  IconFilePlus as FilePlus,
  IconChartBar as BarChart3,
  IconTrophy as Trophy,
  IconLibrary as Library,
} from "@tabler/icons-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Role } from "@/lib/roles";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  EnvelopeIcon,
  BellIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { ModernDashboardLayout, useSidebar } from "@/components/layout/ModernDashboardLayout";
import { OfflineSyncBanner } from "@/components/OfflineSyncBanner";

interface SidebarNavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

function ClassroomSidebarContent({
  menuItems,
  isActive,
  handleLogout,
  user,
  mounted,
}: {
  menuItems: SidebarNavItem[];
  isActive: (path: string) => boolean;
  handleLogout: () => void;
  user: any;
  mounted: boolean;
}) {
  const { isCollapsed } = useSidebar();

  const avatarSrc = mounted
    ? (user as any)?.avatarUrl ||
      user?.avatar_url ||
      `/avatars/character${
        (String(user?.id || (user as any)?.name || user?.full_name || "A").charCodeAt(0) % 20) || 1
      }.jpg`
    : "/avatars/character1.jpg";

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Logo */}
        <div
          className={`${
            isCollapsed ? "px-3 flex justify-center" : "px-8"
          } mb-6 transition-all`}
        >
          <Link href="/dashboard" title="ClassroomPRO">
            <Image
              src="/logo.png"
              alt="ClassroomPRO"
              width={isCollapsed ? 44 : 300}
              height={isCollapsed ? 44 : 80}
              className={
                isCollapsed
                  ? "w-11 h-11 object-contain"
                  : "w-auto h-20 object-contain"
              }
            />
          </Link>
        </div>

        {/* Menu Sections */}
        <div className={`${isCollapsed ? "px-2" : "px-6"} space-y-1 transition-all`}>
          {!isCollapsed && (
            <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">
              MENU
            </p>
          )}

          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center ${
                  isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-4 py-2"
                } text-lg rounded-xl font-normal relative transition-colors ${
                  active
                    ? "text-[#146ef5] bg-blue-50/50 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="shrink-0 flex items-center justify-center">
                  {item.icon}
                </span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* General Section */}
        <div
          className={`${
            isCollapsed ? "px-2 mt-6 pt-4 border-t border-gray-100" : "px-6 mt-10"
          } space-y-1 transition-all`}
        >
          {!isCollapsed && (
            <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">
              GENERAL
            </p>
          )}

          <Link
            href="/dashboard/settings"
            title={isCollapsed ? "Settings" : undefined}
            className={`flex items-center ${
              isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-4 py-2"
            } text-lg rounded-xl font-normal relative transition-colors ${
              isActive("/dashboard/settings")
                ? "text-[#146ef5] bg-blue-50/50 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Cog6ToothIcon className="w-6 h-6 shrink-0" />
            {!isCollapsed && <span className="truncate">Settings</span>}
          </Link>

          <Link
            href="/dashboard/downloads"
            title={isCollapsed ? "Offline Help & Sync" : undefined}
            className={`flex items-center ${
              isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-4 py-2"
            } text-lg rounded-xl font-normal relative transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-50`}
          >
            <QuestionMarkCircleIcon className="w-6 h-6 shrink-0" />
            {!isCollapsed && <span className="truncate">Help</span>}
          </Link>

          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            className={`flex w-full items-center ${
              isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-4 py-2"
            } text-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-normal relative transition-colors border-transparent cursor-pointer`}
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6 shrink-0" />
            {!isCollapsed && <span className="truncate">Logout</span>}
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className={`${isCollapsed ? "px-2 flex justify-center" : "px-6"} mt-8`}>
        {isCollapsed ? (
          <div
            title={
              mounted
                ? (user as any)?.name || user?.full_name || "Chidinma Adeleke"
                : "Profile"
            }
            className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#146ef5] shadow-md shrink-0"
          >
            <Image
              src={avatarSrc}
              alt="User Avatar"
              width={44}
              height={44}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className="rounded-[1.5rem] p-6 text-white relative overflow-hidden shadow-lg bg-cover bg-center"
            style={{ backgroundImage: "url('/photo07.jpeg')" }}
          >
            <div className="absolute inset-0 bg-[#0D1060]/70 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1060]/90 to-transparent"></div>

            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 relative z-10 shadow-sm border-2 border-white/50 overflow-hidden bg-white/20 backdrop-blur-sm">
              <Image
                src={avatarSrc}
                alt="User Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-normal text-lg leading-tight mb-1 relative z-10">
              {mounted
                ? (user as any)?.name || user?.full_name || "Chidinma Adeleke"
                : "Loading..."}
            </h4>
            <p className="text-[10px] text-gray-300 mb-6 relative z-10">
              {mounted ? user?.email || "student@classroompro.ng" : "Loading..."}
            </p>

            <button className="w-full bg-[#146ef5] hover:bg-[#105bd1] transition-colors text-white text-xs font-semibold py-3 rounded-full relative z-10 shadow-md">
              View Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const logoutStore = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logoutStore();
    router.push("/login");
  };
  const [role, setRole] = useState(Role.STUDENT);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) setRole(user.role as Role);
  }, [user]);

  const studentItems: SidebarNavItem[] = [
    { icon: <LayoutDashboard className="w-6 h-6 shrink-0" />, label: "Dashboard", href: "/dashboard" },
    { icon: <Library className="w-6 h-6 shrink-0" />, label: "Library", href: "/dashboard/subjects" },
    { icon: <BookOpen className="w-6 h-6 shrink-0" />, label: "Class Notes", href: "/dashboard/notes" },
    { icon: <VideoIcon className="w-6 h-6 shrink-0" />, label: "Video Lessons", href: "/dashboard/videos" },
    { icon: <BrainCircuit className="w-6 h-6 shrink-0" />, label: "My Quizzes", href: "/dashboard/quizzes" },
    { icon: <Layers className="w-6 h-6 shrink-0" />, label: "Flashcards", href: "/dashboard/flashcards" },
    { icon: <Download className="w-6 h-6 shrink-0" />, label: "Offline Packs", href: "/dashboard/downloads" },
    { icon: <GraduationCap className="w-6 h-6 shrink-0" />, label: "My Exams", href: "/dashboard/exams" },
    { icon: <TrendingUp className="w-6 h-6 shrink-0" />, label: "My Progress", href: "/dashboard/progress" },
    { icon: <Trophy className="w-6 h-6 shrink-0" />, label: "Leaderboard", href: "/dashboard/leaderboard" },
  ];

  const teacherItems: SidebarNavItem[] = [
    { icon: <LayoutDashboard className="w-6 h-6 shrink-0" />, label: "Teacher Home", href: "/dashboard/teacher" },
    { icon: <Layers className="w-6 h-6 shrink-0" />, label: "Study Pack Studio", href: "/dashboard/teacher/study-packs" },
    { icon: <Users className="w-6 h-6 shrink-0" />, label: "Assigned Classes", href: "/dashboard/teacher/classes" },
    { icon: <FilePlus className="w-6 h-6 shrink-0" />, label: "Create Lesson Note", href: "/dashboard/teacher/create-note" },
    { icon: <VideoIcon className="w-6 h-6 shrink-0" />, label: "Link YouTube Video", href: "/dashboard/teacher/create-video" },
    { icon: <BrainCircuit className="w-6 h-6 shrink-0" />, label: "AI Quiz Generator", href: "/dashboard/teacher/create-quiz" },
    { icon: <BarChart3 className="w-6 h-6 shrink-0" />, label: "Topic Mastery & Sync", href: "/dashboard/teacher/analytics" },
    { icon: <Settings className="w-6 h-6 shrink-0" />, label: "Settings", href: "/dashboard/settings" },
  ];

  const parentItems: SidebarNavItem[] = [
    { icon: <LayoutDashboard className="w-6 h-6 shrink-0" />, label: "Parent Learning Hub", href: "/dashboard/parent" },
    { icon: <TrendingUp className="w-6 h-6 shrink-0" />, label: "Topic Mastery & Remedial", href: "/dashboard/parent/progress" },
    { icon: <Download className="w-6 h-6 shrink-0" />, label: "Ward Study Packs", href: "/dashboard/downloads" },
    { icon: <BookOpen className="w-6 h-6 shrink-0" />, label: "NERDC Class Notes", href: "/dashboard/notes" },
    { icon: <VideoIcon className="w-6 h-6 shrink-0" />, label: "Video Lessons", href: "/dashboard/videos" },
    { icon: <BrainCircuit className="w-6 h-6 shrink-0" />, label: "Practice Quizzes", href: "/dashboard/quizzes" },
  ];

  const adminItems: SidebarNavItem[] = [
    { icon: <LayoutDashboard className="w-6 h-6 shrink-0" />, label: "Curriculum Oversight", href: "/dashboard/admin" },
    { icon: <Layers className="w-6 h-6 shrink-0" />, label: "Study Pack Studio", href: "/dashboard/admin/study-packs" },
    { icon: <Library className="w-6 h-6 shrink-0" />, label: "NERDC Content Moderation", href: "/dashboard/admin/subjects" },
    { icon: <BarChart3 className="w-6 h-6 shrink-0" />, label: "Learning Gap & Sync Audit", href: "/dashboard/admin/reports" },
  ];

  const pathname = usePathname();

  const getMenuItems = () => {
    if (pathname.startsWith("/dashboard/admin")) return adminItems;
    if (pathname.startsWith("/dashboard/teacher")) return teacherItems;
    if (pathname.startsWith("/dashboard/parent")) return parentItems;
    switch (String(role).toUpperCase()) {
      case Role.SCHOOL_ADMIN:
        return adminItems;
      case Role.TEACHER:
        return teacherItems;
      case Role.PARENT:
        return parentItems;
      default:
        return studentItems;
    }
  };

  const menuItems = getMenuItems();
  const isActive = (path: string) => pathname === path;

  return (
    <ModernDashboardLayout
      sidebarContent={
        <ClassroomSidebarContent
          menuItems={menuItems}
          isActive={isActive}
          handleLogout={handleLogout}
          user={user}
          mounted={mounted}
        />
      }
      headerContent={
        <>
          <div className="relative w-96">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes, topics, quizzes..."
              className="w-full bg-white border border-white focus:border-gray-200 outline-none rounded-xl py-3 pl-12 pr-12 text-sm text-gray-700 shadow-sm transition-colors placeholder:text-gray-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gray-100 rounded px-1.5 py-0.5 border border-gray-200">
              <span className="text-[10px] font-medium text-gray-500">⌘</span>
              <span className="text-[10px] font-medium text-gray-500">F</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <OfflineSyncBanner />
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-900 transition-colors">
              <EnvelopeIcon className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-900 transition-colors relative">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 ml-2 border-l border-gray-200 pl-6">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-200 to-blue-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                <img
                  src={
                    mounted
                      ? (user as any)?.avatarUrl || user?.avatar_url || "/photo04.jpeg"
                      : "/photo04.jpeg"
                  }
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  {mounted
                    ? (user as any)?.name || user?.full_name || "Chidinma Adeleke"
                    : "Chidinma Adeleke"}
                </p>
                <p className="text-xs text-gray-500">
                  {mounted ? user?.email || "student@classroompro.ng" : "student@classroompro.ng"}
                </p>
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
