const fs = require('fs');
let file = fs.readFileSync('src/components/PortalSidebar/PortalSidebar.tsx', 'utf8');

file = file.replace(
  "{ section: 'Modular Suite', name: 'Classrooms', icon: AcademicCapIcon, activeIcon: AcademicCapIcon, slug: '/admin/classrooms' }",
  "{ section: 'Modular Suite', name: 'ClassroomPRO', icon: AcademicCapIcon, activeIcon: AcademicCapIcon, slug: '/admin/classrooms' }"
);

file = file.replace(
  "{ name: 'Tutors', icon: UserGroupIcon, activeIcon: UserGroupIcon, slug: '/admin/tutors' }",
  "{ name: 'TutorsPRO', icon: UserGroupIcon, activeIcon: UserGroupIcon, slug: '/admin/tutors' }"
);

file = file.replace(
  "{ name: 'Cohorts', icon: BookOpenIcon, activeIcon: BookOpenIcon, slug: '/admin/cohorts' }",
  "{ name: 'CoursesPRO', icon: BookOpenIcon, activeIcon: BookOpenIcon, slug: '/admin/cohorts' }"
);

file = file.replace(
  "{ name: 'Results Center', icon: ChartPieIcon, activeIcon: ChartPieIcon, slug: '/admin/results' }",
  "{ name: 'ResultsPRO', icon: ChartPieIcon, activeIcon: ChartPieIcon, slug: '/admin/results' }"
);

fs.writeFileSync('src/components/PortalSidebar/PortalSidebar.tsx', file);
console.log('Done');
