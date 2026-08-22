const fs = require('fs');

const path = 'admin/src/app/agent/layout.tsx';
let content = fs.readFileSync(path, 'utf8');

// The file currently has <aside> ... </aside> and <header> ... </header>
// We want to extract those into variables or inline them in the ModernDashboardLayout

const newContent = content.replace(
  'export default function AgentLayout({',
  `import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';

export default function AgentLayout({`
).replace(
  /<div className="h-screen w-full bg-gray-50 flex overflow-hidden font-sans">[\s\S]*?{children}[\s\S]*?<\/div>\s*<\/div>/,
  (match) => {
    const sidebarMatch = match.match(/<aside[^>]*>([\s\S]*?)<\/aside>/);
    const headerMatch = match.match(/<header[^>]*>([\s\S]*?)<\/header>/);
    
    if (!sidebarMatch || !headerMatch) {
      console.log('Failed to match sidebar or header');
      return match;
    }

    return `
    <ModernDashboardLayout
      sidebarContent={
        <React.Fragment>
          ${sidebarMatch[1]}
        </React.Fragment>
      }
      headerContent={
        <React.Fragment>
          ${headerMatch[1]}
        </React.Fragment>
      }
    >
      {children}
    </ModernDashboardLayout>
    `;
  }
);

fs.writeFileSync(path, newContent);
console.log('Rewritten layout');
