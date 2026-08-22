const fs = require('fs');

const path = 'classroompro/src/app/dashboard/layout.tsx';
let code = fs.readFileSync(path, 'utf8');

// I will just replace the hardcoded links with a mapping of menuItems from DashboardLayout.
// First, import the necessary stuff.
if (!code.includes('import { useAuthStore }')) {
  code = `import { useAuthStore } from "@/store/useAuthStore";
import { Role } from "@/lib/roles";
import { useEffect, useState } from "react";
` + code;
}

if (!code.includes('import { IconLayoutDashboard as LayoutDashboard')) {
  code = `import { IconLayoutDashboard as LayoutDashboard, IconBook as BookOpen, IconBrain as BrainCircuit, IconStack2 as Layers, IconCertificate as GraduationCap, IconTrendingUp as TrendingUp, IconDownload as Download, IconSettings as Settings, IconLogout as LogOut, IconBell as Bell, IconUsers as Users, IconSchool as School, IconFilePlus as FilePlus, IconChartBar as BarChart3, IconCalendar as Calendar, IconTrophy as Trophy, IconBookmark as Bookmark, IconLibrary as Library, IconHeart as Heart, IconMessage as MessageSquare, IconCreditCard as CreditCard } from '@tabler/icons-react';
` + code;
}

// Now replace the inside of DashboardLayout component to define the menuItems.
const itemsCode = `
  const { user, isAuthenticated } = useAuthStore();
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
`;

code = code.replace(/export default function DashboardLayout\({\s*children,\s*}\s*:\s*{\s*children:\s*React\.ReactNode;\s*}\)\s*{/, `export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {${itemsCode}`);

// Replace the Menu section
const menuSectionRegex = /<div className="px-6 space-y-1">\s*<p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">MENU<\/p>[\s\S]*?<\/div>\s*<div className="px-6 mt-10 space-y-1">/;
const newMenuSection = `<div className="px-6 space-y-1">
              <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">MENU</p>
              
              {menuItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive(item.href) ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="px-6 mt-10 space-y-1">`;

code = code.replace(menuSectionRegex, newMenuSection);

fs.writeFileSync(path, code);
