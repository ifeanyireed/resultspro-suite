const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'src', 'app', '(mentor)', 'layout.tsx');
let content = fs.readFileSync(layoutPath, 'utf8');

const regex = /const isActive[\s\S]*?return \(/;
const replacement = "const isActive = (path: string) => {\n    if (path === '/mentor') {\n      return pathname === '/mentor';\n    }\n    return pathname === path || pathname.startsWith(path + '/');\n  };\n\n  return (";

content = content.replace(regex, replacement);

content = content.replace('</div>\n\n          {/* Bottom App Promo */}', '{/* Bottom App Promo */}');

fs.writeFileSync(layoutPath, content);
console.log("Fixed syntax.")
