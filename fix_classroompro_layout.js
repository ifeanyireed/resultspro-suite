const fs = require('fs');

let layoutCode = fs.readFileSync('classroompro/src/app/dashboard/layout.tsx', 'utf8');

if (!layoutCode.includes('ModernDashboardLayout')) {
  layoutCode = layoutCode.replace(
    'import { Sidebar } from "@/components/DashboardLayout";',
    'import { Sidebar, DashboardHeader } from "@/components/DashboardLayout";\nimport { ModernDashboardLayout } from "@/components/layout/ModernDashboardLayout";'
  );

  layoutCode = layoutCode.replace(
    /<div className="min-h-screen bg-navy">\s*<Sidebar \/>\s*<div className="pl-64">\s*\{children\}\s*<\/div>\s*<\/div>/g,
    `<ModernDashboardLayout
      sidebarContent={<Sidebar />}
      headerContent={<DashboardHeader title="Student Portal" />}
    >
      {children}
    </ModernDashboardLayout>`
  );

  fs.writeFileSync('classroompro/src/app/dashboard/layout.tsx', layoutCode);
}

