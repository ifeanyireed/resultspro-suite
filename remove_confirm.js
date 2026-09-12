const fs = require('fs');
const path = 'admin/src/app/(dashboard)/exampro/tabs/UsersTab.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '    if (!window.confirm("Are you sure you want to manually verify this user\'s email?")) return;',
  ''
);

fs.writeFileSync(path, content);
