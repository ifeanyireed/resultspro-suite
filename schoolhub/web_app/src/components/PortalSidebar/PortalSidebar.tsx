'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  DashboardSpeed02Icon, 
  AnalyticsUpIcon, 
  Calendar03Icon, 
  Home01Icon,
  HelpCircleIcon,
  Book02Icon,
  Task01Icon,
  Quiz01Icon,
  NoteIcon,
  CreditCardIcon,
  Message01Icon,
  Pulse01Icon,
  Invoice01Icon,
  UserGroupIcon,
  SchoolBusIcon,
  PackageIcon,
  BedIcon,
  Activity04Icon,
  Settings01Icon,
  FolderCheckIcon,
  School01Icon,
  Award01Icon,
  AiBrain01Icon,
  PlayCircle02Icon,
  ArrowUp01Icon
} from 'hugeicons-react';
import styles from './PortalSidebar.module.css';

const studentMenu = [
  { name: 'Home', icon: DashboardSpeed02Icon, slug: '/student/dashboard' },
  { name: 'Classroom', icon: School01Icon, slug: '/student/classroom' },
  { name: 'Timetable', icon: Calendar03Icon, slug: '/student/timetable' },
  { name: 'Homework', icon: Task01Icon, slug: '/student/homework' },
  { name: 'Learning Library', icon: Book02Icon, slug: '/student/learning' },
  { name: 'My Exams', icon: Quiz01Icon, slug: '/student/exams' },
  { name: 'Practice Progress', icon: AnalyticsUpIcon, slug: '/student/exams/progress' },
  { name: 'Academic Results', icon: Award01Icon, slug: '/student/results' },
  { name: 'Results Analytics', icon: Activity04Icon, slug: '/student/results/analytics' },
  { name: 'Tutor Hub', icon: UserGroupIcon, slug: '/student/tutors' },
  { name: 'Online Lessons', icon: PlayCircle02Icon, slug: '/student/tutors/lessons' },
  { name: 'Future Skills', icon: AiBrain01Icon, slug: '/student/future-skills' },
  { name: 'Skills Progress', icon: ArrowUp01Icon, slug: '/student/future-skills/progress' },
];

const teacherMenu = [
  { name: 'Home', icon: DashboardSpeed02Icon, slug: '/teacher/dashboard' },
  { name: 'Classroom', icon: School01Icon, slug: '/teacher/classroom' },
  { name: 'My Classes', icon: Book02Icon, slug: '/teacher/classes' },
  { name: 'Homework', icon: Task01Icon, slug: '/teacher/homework' },
  { name: 'Practice Insights', icon: AnalyticsUpIcon, slug: '/teacher/exams' },
  { name: 'Tutor Schedule', icon: Calendar03Icon, slug: '/teacher/tutors' },
  { name: 'Assessments', icon: Quiz01Icon, slug: '/teacher/assessments' },
  { name: 'Tasks', icon: NoteIcon, slug: '/teacher/tasks' },
];

const parentMenu = [
  { name: 'Home', icon: DashboardSpeed02Icon, slug: '/parent/dashboard' },
  { name: 'Classroom', icon: School01Icon, slug: '/parent/classroom' },
  { name: 'Exam Insights', icon: Quiz01Icon, slug: '/parent/exams' },
  { name: 'Results Analytics', icon: Activity04Icon, slug: '/parent/results' },
  { name: 'Academic Reports', icon: AnalyticsUpIcon, slug: '/parent/reports' },
  { name: 'Tutor Booking', icon: UserGroupIcon, slug: '/parent/tutors' },
  { name: 'Future Skills', icon: AiBrain01Icon, slug: '/parent/future-skills' },
  { name: 'Payments', icon: CreditCardIcon, slug: '/payments' },
  { name: 'Messages', icon: Message01Icon, slug: '/communications' },
  { name: 'Events Calendar', icon: Calendar03Icon, slug: '/parent/events' },
];

const adminMenu = [
  { name: 'Pulse', icon: Pulse01Icon, slug: '/admin/pulse' },
  { name: 'Results Center', icon: Award01Icon, slug: '/admin/results' },
  { name: 'Insights Hub', icon: AnalyticsUpIcon, slug: '/admin/insights' },
  { name: 'Class Timetable', icon: Calendar03Icon, slug: '/admin/timetable' },
  { name: 'Fees', icon: Invoice01Icon, slug: '/admin/fees' },
  { name: 'Enrollment', icon: UserGroupIcon, slug: '/admin/enrollment' },
  { name: 'Transport', icon: SchoolBusIcon, slug: '/admin/transport' },
  { name: 'Procurement', icon: PackageIcon, slug: '/admin/procurement' },
  { name: 'Library', icon: Book02Icon, slug: '/admin/library' },
  { name: 'Hostel', icon: BedIcon, slug: '/admin/hostel' },
  { name: 'Performance', icon: Activity04Icon, slug: '/admin/performance' },
  { name: 'Operations', icon: Settings01Icon, slug: '/admin/operations' },
];

const admissionsMenu = [
  { name: 'CRM Home', icon: DashboardSpeed02Icon, slug: '/admin/admissions' },
  { name: 'Inquiries', icon: UserGroupIcon, slug: '/admin/admissions/inquiries' },
  { name: 'Applications', icon: FolderCheckIcon, slug: '/admin/admissions/applications' },
  { name: 'Pipeline', icon: AnalyticsUpIcon, slug: '/admin/admissions/pipeline' },
  { name: 'Tours & Events', icon: Calendar03Icon, slug: '/admin/admissions/tours' },
];

const devRoles = [
  { name: 'Student Dashboard', slug: '/student/dashboard' },
  { name: 'Teacher Dashboard', slug: '/teacher/dashboard' },
  { name: 'Parent Dashboard', slug: '/parent/dashboard' },
  { name: 'Principal Pulse', slug: '/admin/pulse' },
  { name: 'Admissions Officer', slug: '/admin/admissions' },
];

export default function PortalSidebar() {
  const pathname = usePathname();

  const getActiveMenu = () => {
    if (pathname.startsWith('/teacher')) return teacherMenu;
    if (pathname.startsWith('/parent') || pathname === '/payments' || pathname === '/communications') return parentMenu;
    if (pathname.startsWith('/admin')) {
      if (pathname.includes('/admissions')) return admissionsMenu;
      return adminMenu;
    }
    return studentMenu;
  };

  const menuItems = getActiveMenu();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <Image src="/logo.png" alt="SchoolHub Logo" width={64} height={64} style={{ width: 'auto', height: '56px' }} />
        <div className={styles.schoolBrand}>
          <span className={styles.schoolName}>SchoolHub</span>
          <span className={styles.portalTag}>Digital Campus</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.slug;
          return (
            <Link 
              key={item.slug} 
              href={item.slug} 
              className={`${styles.link} ${isActive ? styles.active : ''}`}
            >
              <Icon 
                size={22} 
                className={styles.icon} 
              />
              <span className={styles.name}>{item.name}</span>
            </Link>
          );
        })}

        <div style={{ marginTop: '2rem', padding: '0 1rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Roles (Dev)
        </div>
        {devRoles.map((role) => (
          <Link 
            key={role.slug} 
            href={role.slug} 
            className={`${styles.link} ${pathname.startsWith(role.slug) ? styles.active : ''}`}
          >
            <span className={styles.name} style={{ marginLeft: '2rem' }}>{role.name}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <Link href="/support" className={styles.link}>
          <HelpCircleIcon size={20} />
          <span>Support</span>
        </Link>
      </div>
    </aside>
  );
}
