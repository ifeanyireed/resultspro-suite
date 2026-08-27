const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'src', 'app', '(app)', 'layout.tsx');
let content = fs.readFileSync(layoutPath, 'utf8');

content = content.replace(
  "const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');",
  "const isActive = (path: string) => {\n    if (path === '/dashboard') return pathname === '/dashboard';\n    return pathname === path || pathname.startsWith(path + '/');\n  };"
);

fs.writeFileSync(layoutPath, content);
console.log('Fixed isActive.');
