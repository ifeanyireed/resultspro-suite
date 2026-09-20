import re
import os

def rewrite_tutor():
    path = "src/app/tutor/layout.tsx"
    with open(path, "r") as f:
        content = f.read()

    # Add missing icons to import
    imports = """import { 
  Squares2X2Icon, 
  MapIcon, 
  BriefcaseIcon, 
  FolderOpenIcon,
  VideoCameraIcon,
  UserGroupIcon,
  AcademicCapIcon,
  TrophyIcon,
  Cog6ToothIcon, 
  LifebuoyIcon, 
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  BellIcon,
  CalendarIcon,
  InboxIcon,
  BookOpenIcon,
  PresentationChartBarIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  StarIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline';"""
    content = re.sub(r'import \{[\s\S]*?\} from \'@heroicons/react/24/outline\';', imports, content)

    # We need to replace the manual links with a mapped array
    nav_links = """              {([
                { name: 'Dashboard', href: '/tutor/dashboard', icon: Squares2X2Icon, activeIcon: Squares2X2Solid },
                { name: 'Calendar & Availability', href: '/tutor/calendar', icon: CalendarIcon },
                { name: 'Class Requests', href: '/tutor/requests', icon: InboxIcon },
                { name: 'Lesson Planner', href: '/tutor/planner', icon: BookOpenIcon },
                { name: 'Live Classroom', href: '/tutor/classroom', icon: VideoCameraIcon },
                { name: 'Whiteboard', href: '/tutor/whiteboard', icon: PresentationChartBarIcon },
                { name: 'Resources', href: '/tutor/resources', icon: FolderOpenIcon },
                { name: 'Student Progress', href: '/tutor/student-progress', icon: TrophyIcon },
                { name: 'Earnings', href: '/tutor/earnings', icon: CurrencyDollarIcon },
                { name: 'Payouts', href: '/tutor/payouts', icon: BanknotesIcon },
                { name: 'Reviews', href: '/tutor/reviews', icon: StarIcon },
                { name: 'Messages', href: '/tutor/messages', icon: EnvelopeIcon },
              ]).map((item) => {
                const active = isActive(item.href);
                const Icon = active && item.activeIcon ? item.activeIcon : item.icon;
                return (
                  <Link key={item.name} href={item.href} className={`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors ${active ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                    <Icon className="w-6 h-6" />
                    {item.name}
                  </Link>
                );
              })}"""

    # Remove the existing links up to SYSTEM
    content = re.sub(r'<Link href="/tutor/dashboard"[\s\S]*?</Link>\s*<Link href="/tutor/classes"[\s\S]*?</Link>\s*<Link href="/tutor/progress"[\s\S]*?</Link>\s*<Link href="/tutor/messages"[\s\S]*?</Link>', nav_links, content)

    with open(path, "w") as f:
        f.write(content)

rewrite_tutor()
