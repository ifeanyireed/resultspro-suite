import re

path = "src/app/student/layout.tsx"
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
  Square3Stack3DIcon
} from '@heroicons/react/24/outline';"""
content = re.sub(r'import \{[\s\S]*?\} from \'@heroicons/react/24/outline\';', imports, content)

nav_links = """              {([
                { name: 'Dashboard', href: '/student/dashboard', icon: Squares2X2Icon, activeIcon: Squares2X2Solid },
                { name: 'Find a Tutor', href: '/student/find-tutor', icon: MagnifyingGlassCircleIcon },
                { name: 'Book a Session', href: '/student/bookings', icon: CalendarIcon },
                { name: 'Upcoming Classes', href: '/student/classes', icon: VideoCameraIcon },
                { name: 'Live Classroom', href: '/student/classroom', icon: PlayIcon },
                { name: 'Assignments', href: '/student/assignments', icon: ClipboardDocumentCheckIcon },
                { name: 'Quizzes', href: '/student/quizzes', icon: DocumentTextIcon },
                { name: 'Flashcards', href: '/student/flashcards', icon: Square3Stack3DIcon },
                { name: 'Games Hub', href: '/student/games', icon: PuzzlePieceIcon },
                { name: 'Progress Reports', href: '/student/progress', icon: TrophyIcon },
                { name: 'Certificates', href: '/student/certificates', icon: AcademicCapIcon },
                { name: 'Messages', href: '/student/messages', icon: EnvelopeIcon },
                { name: 'Wallet / Payments', href: '/student/wallet', icon: WalletIcon },
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

content = re.sub(r'<Link href="/student/dashboard"[\s\S]*?</Link>\s*<Link href="/student/classes"[\s\S]*?</Link>\s*<Link href="/student/progress"[\s\S]*?</Link>\s*<Link href="/student/messages"[\s\S]*?</Link>', nav_links, content)

with open(path, "w") as f:
    f.write(content)
