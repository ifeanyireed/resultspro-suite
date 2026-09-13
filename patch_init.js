const fs = require('fs');
const path = 'admin/src/app/(dashboard)/coursespro/tenants/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "contact_email: school.contact_email || '',",
  "contact_email: school.contact_email || '',\n                              logo_url: school.logo_url || '',"
);
fs.writeFileSync(path, content);
