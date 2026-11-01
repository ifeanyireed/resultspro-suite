const fs = require('fs');
let file = fs.readFileSync('src/components/PortalSidebar/PortalSidebar.tsx', 'utf8');

// Add Fragment import if not there
if (!file.includes("import React")) {
  file = file.replace("import Link from 'next/link';", "import React from 'react';\nimport Link from 'next/link';");
}

const targetMenu = `const adminMenu = [
  { section: 'Dashboard', name: 'Overview', icon: Squares2X2Icon, activeIcon: Squares2X2Solid, slug: '/admin/pulse' },
  { section: 'Modular Suite', name: 'Classrooms', icon: AcademicCapIcon, activeIcon: AcademicCapIcon, slug: '/admin/classrooms' },
  { name: 'Tutors', icon: UserGroupIcon, activeIcon: UserGroupIcon, slug: '/admin/tutors' },
  { name: 'Cohorts', icon: BookOpenIcon, activeIcon: BookOpenIcon, slug: '/admin/cohorts' },
  { name: 'Results Center', icon: ChartPieIcon, activeIcon: ChartPieIcon, slug: '/admin/results' },
  { section: 'Operations', name: 'Insights Hub', icon: ChartBarIcon, activeIcon: ChartBarIcon, slug: '/admin/insights' },
  { name: 'Class Timetable', icon: CalendarIcon, activeIcon: CalendarIcon, slug: '/admin/timetable' },
  { name: 'Fees', icon: BanknotesIcon, activeIcon: BanknotesIcon, slug: '/admin/fees' },
  { name: 'Enrollment', icon: UserGroupIcon, activeIcon: UserGroupIcon, slug: '/admin/enrollment' },
  { name: 'Transport', icon: TruckIcon, activeIcon: TruckIcon, slug: '/admin/transport' },
  { name: 'Procurement', icon: ShoppingCartIcon, activeIcon: ShoppingCartIcon, slug: '/admin/procurement' },
  { name: 'Library', icon: BookOpenIcon, activeIcon: BookOpenIcon, slug: '/admin/library' },
  { name: 'Hostel', icon: HomeModernIcon, activeIcon: HomeModernIcon, slug: '/admin/hostel' },
  { name: 'Performance', icon: ChartBarIcon, activeIcon: ChartBarIcon, slug: '/admin/performance' },
  { name: 'Operations Controls', icon: Cog6ToothIcon, activeIcon: Cog6ToothIcon, slug: '/admin/operations' },
];`;

file = file.replace(/const adminMenu = \[[\s\S]*?\];/, targetMenu);

// Now update the render block
const oldRender = `{/* Menu Sections */}
        <div className="px-6 space-y-1">
          <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">MENU</p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.slug;
            const Icon = isActive ? item.activeIcon : item.icon;
            return (
              <Link 
                key={item.slug}
                href={item.slug} 
                className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}
              >
                <Icon className="w-6 h-6" />
                {item.name}
              </Link>
            );
          })}
        </div>`;

const newRender = `{/* Menu Sections */}
        <div className="px-6 space-y-1">
          {!menuItems[0]?.section && <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">MENU</p>}
          
          {menuItems.map((item, index) => {
            const isActive = pathname === item.slug;
            const Icon = isActive ? item.activeIcon : item.icon;
            return (
              <React.Fragment key={item.slug}>
                {item.section && (
                  <div className={\`px-2 \${index > 0 ? 'mt-8' : ''} mb-3\`}>
                    <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{item.section}</p>
                  </div>
                )}
                <Link 
                  href={item.slug} 
                  className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}
                >
                  <Icon className="w-6 h-6" />
                  {item.name}
                </Link>
              </React.Fragment>
            );
          })}
        </div>`;

file = file.replace(oldRender, newRender);

fs.writeFileSync('src/components/PortalSidebar/PortalSidebar.tsx', file);
console.log('Done');
