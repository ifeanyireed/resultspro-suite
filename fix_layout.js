const fs = require('fs');
let code = fs.readFileSync('admin/src/app/agent/layout.tsx', 'utf8');

const topImports = `import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
`;
if (!code.includes('ModernDashboardLayout')) {
  code = code.replace("import React from 'react';", "import React from 'react';\n" + topImports);
}

// Extract sidebar
const asideStart = code.indexOf('<aside');
const asideEnd = code.indexOf('</aside>') + '</aside>'.length;
const asideHTML = code.substring(asideStart, asideEnd);

// Extract header
const headerStart = code.indexOf('<header');
const headerEnd = code.indexOf('</header>') + '</header>'.length;
const headerHTML = code.substring(headerStart, headerEnd);

const newReturn = `
  return (
    <ModernDashboardLayout
      sidebarContent={
        <>
          ${asideHTML.replace(/<aside[^>]*>/, '').replace(/<\/aside>/, '')}
        </>
      }
      headerContent={
        <>
          ${headerHTML.replace(/<header[^>]*>/, '').replace(/<\/header>/, '')}
        </>
      }
    >
      {children}
    </ModernDashboardLayout>
  );
}
`;

const returnStart = code.indexOf('  return (');
code = code.substring(0, returnStart) + newReturn;

fs.writeFileSync('admin/src/app/agent/layout.tsx', code);
