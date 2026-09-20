import re

path = "src/app/parent/layout.tsx"
with open(path, "r") as f:
    content = f.read()

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
  UserIcon,
  WalletIcon,
  PuzzlePieceIcon,
  MagnifyingGlassCircleIcon,
  PlayIcon,
  Square3Stack3DIcon,
  ClockIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';"""
content = re.sub(r'import \{[\s\S]*?\} from \'@heroicons/react/24/outline\';', imports, content)

nav_links = """              {([
                { name: 'Dashboard', href: '/parent/dashboard', icon: Squares2X2Icon, activeIcon: Squares2X2Solid },
                { name: 'History & Attendance', href: '/parent/history', icon: ClockIcon },
                { name: 'Progress Analytics', href: '/parent/progress', icon: ChartBarIcon },
                { name: 'Tutor Feedback', href: '/parent/feedback', icon: ChatBubbleLeftRightIcon },
                { name: 'Notifications', href: '/parent/notifications', icon: BellIcon },
                { name: 'Billing', href: '/parent/billing', icon: CreditCardIcon },
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

content = re.sub(r'<Link href="/parent/dashboard"[\s\S]*?</Link>\s*<Link href="/parent/classes"[\s\S]*?</Link>\s*<Link href="/parent/progress"[\s\S]*?</Link>\s*<Link href="/parent/messages"[\s\S]*?</Link>', nav_links, content)

with open(path, "w") as f:
    f.write(content)
