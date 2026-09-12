const fs = require('fs');
const path = 'admin/src/app/(dashboard)/exampro/tabs/UsersTab.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("<Badge status={!u.otpCode ? 'VERIFIED' : 'PENDING'} />", "<Badge status={u.accountStatus === 'active' ? 'VERIFIED' : 'PENDING'} />");
content = content.replace("{u.otpCode && (", "{u.accountStatus !== 'active' && (");

fs.writeFileSync(path, content);
