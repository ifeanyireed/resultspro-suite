const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'src', 'app', '(mentor)', 'layout.tsx');
let content = fs.readFileSync(layoutPath, 'utf8');

content = content.replace(
  '{/* Bottom App Promo */}',
  '</div>\n\n          {/* Bottom App Promo */}'
);

fs.writeFileSync(layoutPath, content);
console.log('Fixed syntax error.');
