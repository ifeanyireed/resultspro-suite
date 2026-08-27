const fs = require('fs');
const path = require('path');

const TUTORSPRO_DIR = path.join(__dirname, 'tutorspro');

// 1. Copy ModernDashboardLayout.tsx
const layoutDir = path.join(TUTORSPRO_DIR, 'src/components/layout');
if (!fs.existsSync(layoutDir)) fs.mkdirSync(layoutDir, { recursive: true });
fs.copyFileSync(
    path.join(__dirname, 'admin/src/components/layout/ModernDashboardLayout.tsx'),
    path.join(layoutDir, 'ModernDashboardLayout.tsx')
);
console.log('Copied ModernDashboardLayout.tsx');

// 2. Fix layout.tsx (Root)
const rootLayoutPath = path.join(TUTORSPRO_DIR, 'src/app/layout.tsx');
let rootLayout = fs.readFileSync(rootLayoutPath, 'utf8');
rootLayout = rootLayout.replace(/<body[^>]*>([\s\S]*?)<\/body>/, '<body>\n        $1\n      </body>');
fs.writeFileSync(rootLayoutPath, rootLayout);
console.log('Cleaned root layout.tsx');

// 3. Fix globals.css
const globalsCssPath = path.join(TUTORSPRO_DIR, 'src/app/globals.css');
let globalsCss = fs.readFileSync(globalsCssPath, 'utf8');
globalsCss = globalsCss.replace(/body\s*{[^}]*}/g, '');
globalsCss = globalsCss.replace(/\/\* Custom Scrollbars \*\/[\s\S]*$/g, '');
fs.writeFileSync(globalsCssPath, globalsCss);
console.log('Cleaned globals.css');

// 4. Fix nets.css
const netsCssPath = path.join(TUTORSPRO_DIR, 'src/app/nets.css');
let netsCss = fs.readFileSync(netsCssPath, 'utf8');
netsCss = netsCss.replace(/@theme\s*{/, ':root {');
netsCss = netsCss.replace(/--font-sans:[^;]*;/, '--font-sans: system-ui, -apple-system, sans-serif;');
fs.writeFileSync(netsCssPath, netsCss);
console.log('Fixed nets.css');

