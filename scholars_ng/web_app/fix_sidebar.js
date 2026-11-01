const fs = require('fs');
let file = fs.readFileSync('src/components/PortalSidebar/PortalSidebar.tsx', 'utf8');

// Ensure new icons are imported
const newIcons = ['TruckIcon', 'ShoppingCartIcon', 'HomeModernIcon'];
for (const icon of newIcons) {
  if (!file.includes(icon)) {
    // Insert them right after Squares2X2Icon,
    file = file.replace('Squares2X2Icon,', `Squares2X2Icon,\n  ${icon},`);
  }
}

const targetMenu = `const adminMenu = [
  { name: 'Overview', icon: Squares2X2Icon, activeIcon: Squares2X2Solid, slug: '/admin/pulse' },
  { name: 'Results Center', icon: ChartPieIcon, activeIcon: ChartPieIcon, slug: '/admin/results' },
  { name: 'Insights Hub', icon: ChartBarIcon, activeIcon: ChartBarIcon, slug: '/admin/insights' },
  { name: 'Class Timetable', icon: CalendarIcon, activeIcon: CalendarIcon, slug: '/admin/timetable' },
  { name: 'Fees', icon: BanknotesIcon, activeIcon: BanknotesIcon, slug: '/admin/fees' },
  { name: 'Enrollment', icon: UserGroupIcon, activeIcon: UserGroupIcon, slug: '/admin/enrollment' },
  { name: 'Transport', icon: TruckIcon, activeIcon: TruckIcon, slug: '/admin/transport' },
  { name: 'Procurement', icon: ShoppingCartIcon, activeIcon: ShoppingCartIcon, slug: '/admin/procurement' },
  { name: 'Library', icon: BookOpenIcon, activeIcon: BookOpenIcon, slug: '/admin/library' },
  { name: 'Hostel', icon: HomeModernIcon, activeIcon: HomeModernIcon, slug: '/admin/hostel' },
  { name: 'Performance', icon: ChartBarIcon, activeIcon: ChartBarIcon, slug: '/admin/performance' },
  { name: 'Operations', icon: Cog6ToothIcon, activeIcon: Cog6ToothIcon, slug: '/admin/operations' },
];`;

file = file.replace(/const adminMenu = \[[\s\S]*?\];/, targetMenu);

fs.writeFileSync('src/components/PortalSidebar/PortalSidebar.tsx', file);
console.log('Done');
