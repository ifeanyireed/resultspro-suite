"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLayoutDashboard as LayoutDashboard, IconBook as BookOpen, IconBrain as BrainCircuit, IconStack2 as Layers, IconCertificate as GraduationCap, IconTrendingUp as TrendingUp, IconDownload as Download, IconSettings as Settings, IconLogOut as LogOut, IconBell as Bell, IconUsers as Users, IconSchool as School, IconFilePlus as FilePlus, IconBarChart3 as BarChart3, IconCalendar as Calendar, IconTrophy as Trophy, IconBookmark as Bookmark, IconLibrary as Library, IconHeart as Heart, IconMessageSquare as MessageSquare, IconCreditCard as CreditCard } from '@tabler/icons-react';
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/roles";
import { ProfileModal } from "@/components/ProfileModal";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logoutStore = useAuthStore((state) => state.logout);
  const [role, setRole] = useState<Role>(Role.STUDENT);

  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  const handleLogout = () => {
    logoutStore();
    router.push("/login");
  };

  const studentItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", href: "/dashboard" },
    { icon: <Library className="w-5 h-5" />, label: "Library", href: "/dashboard/subjects" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Class Notes", href: "/dashboard/notes" },
    { icon: <BrainCircuit className="w-5 h-5" />, label: "My Quizzes", href: "/dashboard/quizzes" },
    { icon: <Layers className="w-5 h-5" />, label: "Flashcards", href: "/dashboard/flashcards" },
    { icon: <GraduationCap className="w-5 h-5" />, label: "My Exams", href: "/dashboard/exams" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "My Progress", href: "/dashboard/progress" },
    { icon: <Trophy className="w-5 h-5" />, label: "Leaderboard", href: "/dashboard/leaderboard" },
    { icon: <Bookmark className="w-5 h-5" />, label: "Saved Content", href: "/dashboard/saved-content" },
    { icon: <Download className="w-5 h-5" />, label: "Offline Content", href: "/dashboard/downloads" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", href: "/dashboard/settings" },
  ];

  const teacherItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Teacher Home", href: "/dashboard/teacher" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Messages", href: "/dashboard/teacher/messages" },
    { icon: <Users className="w-5 h-5" />, label: "My Classes", href: "/dashboard/teacher/classes" },
    { icon: <FilePlus className="w-5 h-5" />, label: "Create Note", href: "/dashboard/teacher/create-note" },
    { icon: <BrainCircuit className="w-5 h-5" />, label: "Create Quiz", href: "/dashboard/teacher/create-quiz" },
    { icon: <Layers className="w-5 h-5" />, label: "Create Flashcards", href: "/dashboard/teacher/create-flashcards" },
    { icon: <GraduationCap className="w-5 h-5" />, label: "Create Exam", href: "/dashboard/teacher/create-exam" },
    { icon: <Users className="w-5 h-5" />, label: "My Students", href: "/dashboard/teacher/students" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", href: "/dashboard/teacher/analytics" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", href: "/dashboard/settings" },
  ];

  const adminItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Admin Panel", href: "/dashboard/admin" },
    { icon: <School className="w-5 h-5" />, label: "Manage School", href: "/dashboard/admin/school" },
    { icon: <Users className="w-5 h-5" />, label: "Manage Teachers", href: "/dashboard/admin/teachers" },
    { icon: <GraduationCap className="w-5 h-5" />, label: "Manage Students", href: "/dashboard/admin/students" },
    { icon: <Layers className="w-5 h-5" />, label: "Manage Classes", href: "/dashboard/admin/classes" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Manage Subjects", href: "/dashboard/admin/subjects" },
    { icon: <Calendar className="w-5 h-5" />, label: "Manage Terms", href: "/dashboard/admin/terms" },
    { icon: <Trophy className="w-5 h-5" />, label: "Leaderboard", href: "/dashboard/admin/leaderboard" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Reports", href: "/dashboard/admin/reports" },
  ];

  const superAdminItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Platform Overview", href: "/dashboard/super-admin" },
    { icon: <School className="w-5 h-5" />, label: "Schools Overview", href: "/dashboard/super-admin/schools" },
    { icon: <Users className="w-5 h-5" />, label: "Global Users", href: "/dashboard/super-admin/users" },
    {icon: <BookOpen className="w-5 h-5" />, label: "Content Queue", href: "/dashboard/super-admin/moderation" },
    { icon: <GraduationCap className="w-5 h-5" />, label: "Curriculum Mgmt", href: "/dashboard/super-admin/syllabus" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Revenue Analytics", href: "/dashboard/super-admin/revenue" },
    { icon: <Settings className="w-5 h-5" />, label: "Platform Settings", href: "/dashboard/super-admin/settings" },
  ];

  const parentItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Parent Dashboard", href: "/dashboard/parent" },
    { icon: <Heart className="w-5 h-5" />, label: "My Children", href: "/dashboard/parent/children" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Progress Reports", href: "/dashboard/parent/progress" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Teacher Messages", href: "/dashboard/parent/messages" },
    { icon: <CreditCard className="w-5 h-5" />, label: "Subscriptions", href: "/dashboard/parent/billing" },
  ];

  const getMenuItems = () => {
    switch (role) {
      case Role.PARENT: return parentItems;
      case Role.SUPERADMIN: return superAdminItems;
      case Role.SCHOOL_ADMIN: return adminItems;
      case Role.TEACHER: return teacherItems;
      default: return studentItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-navy border-r border-white/10 flex flex-col z-50">
        <div className="p-6 space-y-6">
          <Logo />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            {role.replace("_", " ")} Portal
          </span>
        </div>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                ? "bg-green/10 text-green" 
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
      </aside>
      </>
      );
      }
export function DashboardHeader({ title }: { title: string }) {
  const user = useAuthStore((state) => state.user);
  const initials = user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : 'U';
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-navy/50 backdrop-blur-md sticky top-0 z-40">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-green rounded-full border border-navy" />
          </button>
          <div 
            className="flex items-center gap-3 ml-2 cursor-pointer group"
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-tight group-hover:text-green transition-colors">{user?.full_name || 'User'}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{user?.role.replace('_', ' ') || 'Guest'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-600 text-white font-bold flex items-center justify-center border-2 border-green/20 group-hover:border-green/50 transition-all overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
          </div>
        </div>
      </header>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
