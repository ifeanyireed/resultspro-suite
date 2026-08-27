const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'src', 'app', '(mentor)', 'layout.tsx');
let content = fs.readFileSync(layoutPath, 'utf8');

// I will just replace the exact text to add the missing div back.
content = content.replace(
  '            </div>\n\n          {/* Bottom App Promo */}',
  '            </div>\n          </div>\n\n          {/* Bottom App Promo */}'
);

fs.writeFileSync(layoutPath, content);
console.log('Fixed missing div.');
